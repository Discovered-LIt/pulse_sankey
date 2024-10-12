import React, { useMemo, useState, useRef } from "react";
import axiosInstance from '../../config/axios';
import { useQuery } from "@tanstack/react-query";
import last from 'lodash-es/last';
import first from 'lodash-es/first';
import sortBy from 'lodash-es/sortBy';
import { subMonths } from "date-fns";
import { TwitterTweetEmbed } from 'react-twitter-embed'
import cn from 'classnames';
// components
import LineChart from "../../components/charts/line";
import BarChart from "../../components/charts/Bar";
import SideBar from "../../components/sideBar";
import Spinner from "../../components/Spinner";
import LoadingSkeleton from "../../components/loadingSkeleton";
import Filters from "./filters";
// utils
import { GREEN, LIGHT_GREEN, LIGHT_RED } from "../../config/sankey";
import { getUTCDate } from "../../utils/global";
// hooks
import useOnOutsideClick from "../../hooks/useOnClickOutside";
// types
import { ZoomType, zoomsConfig } from "../../components/charts/Filters";
// context
import { useTopicSettingsContext, Topic } from "../../context/TopicSettingsContext";

type MappingData = {
  category: string;
  title: string;
  summary: string;
  link: string;
  type: string;
  increase: string;
  decrease: string;
  showvalues: number;
  frequency: string;
  symbol: string;
  prefix: string;
  chartData?: { date: string, value: number, positive?: boolean, changeValue: number }[];
  tweets?: string[];
  filters: string[];
}

export type Filter = {
  types: string[]
}

const DataPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedChart, setSelectedChart] = useState<MappingData>(undefined)
  const sideBarRef = useRef<HTMLDivElement>();
  const [activeZoom, setActiveZoom] = useState(ZoomType.ALL);
  const [filters, setFilters] = useState<Filter>({ types: [] })
  const { settings, datamappingUrl } = useTopicSettingsContext();

  useOnOutsideClick(sideBarRef.current, () => {
    if (!showSidebar) return;
    setShowSidebar(false);
    setSelectedChart(undefined);
    setActiveZoom(ZoomType.ALL);
  });

  const { data: mappingData = [], isLoading } = useQuery<MappingData[]>({
    queryKey: ['datamapping'],
    queryFn: async () => {
      const resp = await axiosInstance.get(datamappingUrl)
      const data: MappingData[] = resp.data;
      const promises = data.map(async (item) => {
        try {
          const chartData = await axiosInstance.get(item.link); 
          return {
            ...item,
            chartData: chartData.data.data || chartData.data.observations || chartData.data
          }
        } catch (err) {
          return null;
        }
      })
      const newData: MappingData[] = await Promise.all(promises).then((res) => res.filter((d) => d !== null))
      return newData;
    },
    retry: false,
    refetchOnWindowFocus: false
  });

  const chartSettings = useMemo(() => {
    if(!mappingData.length) return {};
    return mappingData.reduce((newObj, obj) => {
      const data = obj.chartData;
      const firstVal = first(data).value;
      const latestVal = last(data).value;
      const dateFormat = obj.frequency === 'QUARTERLY' ? "'Q'Q yyyy" : "MMMM dd, yyyy"
      const subLabel = getUTCDate(last(data).date, dateFormat);
      const priorDataValue = data.length > 1 ? data[data.length - 2].value : latestVal;
      let changeValue = latestVal - firstVal;
      changeValue = ((latestVal - priorDataValue) / priorDataValue) * 100;

      const greenSet = { light: LIGHT_GREEN, dark: '#04E382' };
      const redSet = { light: LIGHT_RED, dark: '#FF7575' };
      let chartcolour: { light: string, dark: string } = { light: LIGHT_GREEN, dark: GREEN }
      if(obj.increase === "GREEN") {
        chartcolour = changeValue >= 0 ? greenSet : redSet;
      } else {
        chartcolour = changeValue >= 0 ? redSet : greenSet;
      }

      newObj[obj.category] = { 
        chartcolour,
        changeValue: parseFloat(changeValue.toFixed(3)),
        subLabel,
        dateFormat
      }
      return newObj;
    }, {} as {[key: string]: any})
  }, [mappingData])

  const onChartSelect = (data: MappingData) => {
    setSelectedChart(data);
    setShowSidebar(true)
  }

  const onZoomChange = (zoom: ZoomType) => {
    setActiveZoom(zoom)
  }

  const filteredChartData = useMemo(() => {
    if (!selectedChart) return [];
    const { chartData } = selectedChart;
    if (activeZoom !== ZoomType.ALL) {
      const months = zoomsConfig.find(({ label }) => label === activeZoom)?.val;
      return chartData.filter(({ date }) => new Date(date) >= subMonths(new Date(), months))
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });
    }
    return chartData;
  }, [activeZoom, selectedChart]);

  const filteredCharts = useMemo(() => {
    if(!filters.types.length) return mappingData;
    return mappingData.filter((chart) => (
      typeof chart?.filters === 'string' ? 
        !!filters.types.includes(chart.filters) : 
        !!chart?.filters?.find((type) => filters.types.includes(type))
    ))
  }, [mappingData, filters.types])

  const chartTypeOptions = useMemo(() => {
    return sortBy([...new Set(mappingData.map((chart) => chart.filters).flat())].map(
      (type) => { return { label: type.toUpperCase(), value: type }}), 'label')
  }, [mappingData])

  if(isLoading) return <Spinner show={isLoading} classNames="mt-16"/>

  const bgPrimaryClr = settings.theme.primary || 'black';
  const bgSecondaryClr = settings.theme.secondary || 'black';

  return(
    <div className={cn(`px-8 pt-8 bg-[${bgPrimaryClr}]`)}>
      <Filters
        filters={filters}
        setFilters={setFilters}
        chartTypeOptions={chartTypeOptions}
      />
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 max-h-[80vh] overflow-scroll gap-4"
      >
        {
          filteredCharts?.map((data) => (
            <div
              key={data.category}
              className="p-4 h-auto overflow-x-clip cursor-pointer rounded-[10px] hover:bg-zinc-900 sm:border-0 border border-white flex flex-row sm:flex-col min-h-[105px] sm:max-h-max mb-4 z-10"
              style={{ background: bgSecondaryClr }}
              onClick={() => onChartSelect(data)}
            >
              <div className="flex-2 w-[145px] sm:w-auto">
                <div className="uppercase font-extralight text-[12px] sm:text-[14px]"> {data.title} </div>
                <div className="font-normal flex my-2 text-[14px] sm:text-[16px]">
                  {`${data.prefix}${last(data?.chartData).value.toLocaleString()} ${data.symbol}`}
                  <p
                    className="text-[12px] ml-2"
                    style={{ color: chartSettings?.[data.category]?.chartcolour?.light }}
                  >
                    {chartSettings[data.category].changeValue}%
                  </p>
                </div>
                <p className="text-[12px] sm:text-[14px]">{chartSettings[data.category].subLabel}</p>
              </div>
              <div className="w-auto flex-1">
                {data.type === 'LINE' && <LineChart
                  data={data?.chartData?.slice(-data.showvalues)}
                  timeLineData={[]}
                  category={data?.category}
                  isLoading={isLoading}
                  chartOverview
                  chartColour={chartSettings[data.category]?.chartcolour?.dark}
                  dateFormat={chartSettings[data.category]?.dateFormat}
                  width={500}
                  height={300}
                  margin={{ top: 20, right: 20, bottom: 30, left: 50 }} 
                />}
                {data.type === 'BAR' &&
                  <BarChart
                    data={data?.chartData?.slice(-data.showvalues)}
                    chartColour={chartSettings[data.category]?.chartcolour?.dark}
                    chartOverview
                    dateFormat={chartSettings[data.category]?.dateFormat}
                    width={500}
                    height={300}
                    margin={{ top: 20, right: 20, bottom: 30, left: 50 }}
                  />
                }
              </div>
            </div>
          ))
        }
        <SideBar
          open={showSidebar}
          bgColor={settings.theme.secondary}
          onClose={() => setShowSidebar(false)}
        >
          <div
            className="h-full overflow-auto"
            ref={sideBarRef}
            style={{ background: settings.theme.secondary || '#232323' }}
          >
            <div className="p-6 mt-2">
              {selectedChart?.type === 'LINE' && <LineChart
                data={filteredChartData}
                timeLineData={[]}
                category={selectedChart?.category}
                isLoading={isLoading}
                parentRef={sideBarRef}
                prefix={selectedChart.symbol}
                chartColour={chartSettings[selectedChart.category]?.chartcolour?.dark}
                dateFormat={chartSettings[selectedChart.category]?.dateFormat}
                activeZoom={activeZoom}
                onZoomChange={onZoomChange}
              />}
              {selectedChart?.type === 'BAR' &&
                <BarChart
                  data={filteredChartData}
                  chartColour={chartSettings[selectedChart.category]?.chartcolour?.dark}
                  parentRef={sideBarRef}
                  dateFormat={chartSettings[selectedChart.category]?.dateFormat}
                  activeZoom={activeZoom}
                  onZoomChange={onZoomChange}
                />
              }
            </div>
            <h1
              className="py-4 text-center bg-black"
              style={{
                background: bgPrimaryClr,
                color: settings.theme.secondary || 'white'
              }}
            >
              {selectedChart?.title}
            </h1>
            <div className="p-6 mt-2" dangerouslySetInnerHTML={{ __html: selectedChart?.summary }} />
            {selectedChart?.tweets?.length > 0 && <div className="p-6">
              <p className="uppercase italic -mt-8 mb-4">latest</p>
              <ol className="relative border-s border-gray-200 dark:border-gray-700">   
                {
                  selectedChart?.tweets?.map((tweetId, idx) => (
                    <li className="mb-10 ms-4" key={idx}>
                      <div
                        className="absolute w-4 h-4 bg-[#232323] rounded-full mt-4 -start-[8px] border border-white dark:border-gray-900 dark:bg-gray-700"
                      />
                      <TwitterTweetEmbed
                        tweetId={tweetId}
                        placeholder={<LoadingSkeleton />}
                      />
                    </li>
                  ))
                }
              </ol>
            </div>}
          </div>
        </SideBar>
      </div>
    </div>
  )
}

export default DataPage;
