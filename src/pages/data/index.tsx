import React, { useMemo, useState, useRef } from "react";
import axiosInstance from '../../config/axios';
import { useQuery } from "@tanstack/react-query";
import last from 'lodash-es/last';
import first from 'lodash-es/first';
import { format, subMonths } from "date-fns";
// components
import LineChart from "../../components/charts/line";
import BarChart from "../../components/charts/Bar";
import SideBar from "../../components/sideBar";
import Spinner from "../../components/Spinner";
// utils
import { GREEN, LIGHT_GREEN, LIGHT_RED } from "../../config/sankey";
// hooks
import useOnOutsideClick from "../../hooks/useOnClickOutside";
// types
import { ZoomType, zoomsConfig } from "../../components/charts/Filters";

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
}

const DataPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedChart, setSelectedChart] = useState<MappingData>(undefined)
  const sideBarRef = useRef<HTMLDivElement>();
  const [activeZoom, setActiveZoom] = useState(ZoomType.ALL);

  useOnOutsideClick(sideBarRef.current, () => {
    if (!showSidebar) return;
    setShowSidebar(false);
    setSelectedChart(undefined);
    setActiveZoom(ZoomType.ALL);
  });

  const { data: mappingData = [], isLoading } = useQuery<MappingData[]>({
    queryKey: ['datamapping'],
    queryFn: async () => {
      const { data }: { data: MappingData[] } = await axiosInstance.get('/datamapping.json');
      const promises = data.map(async (item) => {
        try {
          const chartData = await axiosInstance.get(item.link); 
          return {
            ...item,
            chartData: chartData.data.data || chartData.data.observations || chartData.data
          }
        } catch (err) {
          console.log(item.category, err)
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
      const subLabel = last(data).date ? format(new Date(last(data).date), dateFormat) : "";
      const priorDataValue = data.length > 1 ? data[data.length - 2].value : latestVal;
      let changeValue = latestVal - firstVal;
      changeValue = ((latestVal - priorDataValue) / priorDataValue) * 100;

      const greenSet = { light: LIGHT_GREEN, dark: '#04E382' };
      const redSet = { light: LIGHT_RED, dark: '#ff0000' };
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

  if(isLoading) return <Spinner show={isLoading} classNames="mt-16"/>

  return(
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 h-[87vh] overflow-scroll gap-4">
      {
        mappingData?.map((data) => (
          <div
            key={data.category}
            className="p-4 h-auto overflow-x-clip cursor-pointer rounded hover:bg-zinc-900"
            onClick={() => onChartSelect(data)}
          >
            <div className="uppercase font-extralight text-[14px]"> {data.title} </div>
            <div className="font-normal flex my-2">
              {`${data.prefix}${last(data?.chartData).value.toLocaleString()} ${data.symbol}`}
              <p
                className="text-[12px] ml-2"
                style={{ color: chartSettings?.[data.category]?.chartcolour?.light }}
              >
                {chartSettings[data.category].changeValue}%
              </p>
            </div>
            <p className="text-[14px]">{chartSettings[data.category].subLabel}</p>
            <div className="max-w-[300px] m-auto">
              {data.type === 'LINE' && <LineChart
                data={data?.chartData?.slice(0, data.showvalues)}
                timeLineData={[]}
                category={data?.category}
                isLoading={isLoading}
                chartOverview
                chartColour={chartSettings[data.category]?.chartcolour?.dark}
                dateFormat={chartSettings[data.category]?.dateFormat}
              />}
              {data.type === 'BAR' &&
                <BarChart
                  data={data?.chartData?.slice(0, data.showvalues)}
                  chartColour={chartSettings[data.category]?.chartcolour?.dark}
                  chartOverview
                  dateFormat={chartSettings[data.category]?.dateFormat}
                />
              }
            </div>
          </div>
        ))
      }
      <SideBar open={showSidebar} onClose={() => setShowSidebar(false)}>
        <div className="bg-[#232323] h-full overflow-auto" ref={sideBarRef}>
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
          <h1 className="py-4 text-center bg-black">
            {selectedChart?.title}
          </h1>
          <div className="p-6 mt-2" dangerouslySetInnerHTML={{ __html: selectedChart?.summary }} />
        </div>
      </SideBar>
    </div>
  )
}

export default DataPage;
