import React, { useMemo, useState, useRef } from "react";
import axiosInstance from '../../config/axios';
import { useQuery } from "@tanstack/react-query";
import last from 'lodash-es/last';
import first from 'lodash-es/first';
import { format } from "date-fns";
// components
import LineChart from "../../components/charts/line";
import BarChart from "../../components/charts/Bar";
import SideBar from "../../components/sideBar";
import Spinner from "../../components/Spinner";
// utils
import { GREEN, RED, LIGHT_GREEN, LIGHT_RED } from "../../config/sankey";
// hooks
import useOnOutsideClick from "../../hooks/useOnClickOutside";

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
  prefix: 'CURRENCY' | 'PERCENTAGE' | 'NUMBER';
  chartData?: { date: string, value: number, positive?: boolean, changeValue: number }[];
}

const DataPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedChart, setSelectedChart] = useState<MappingData>(undefined)
  const sideBarRef = useRef<HTMLDivElement>();

  useOnOutsideClick(sideBarRef.current, () => {
    if (!showSidebar) return;
    setShowSidebar(false);
    setSelectedChart(undefined)
  });

  const { data: mappingData = [], isLoading } = useQuery<MappingData[]>({
    queryKey: ['datamapping'],
    queryFn: async () => {
      const { data }: { data: MappingData[] } = await axiosInstance.get('/datamapping.json');
      let newData: MappingData[] = [];
      for(var i=0; i < data.length; i++) {
        try {
          const chartData = await axiosInstance.get(data[i].link); 
          newData.push({
            ...data[i],
            chartData: chartData.data.data || chartData.data.observations || chartData.data
          })
        } catch (err) {
          console.log(data[i].category, err)
        }
      }
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
      const subLabel = last(data).date ? format(new Date(last(data).date), "'Q'Q yyyy") : "";
      const priorDataValue = data.length > 1 ? data[data.length - 2].value : latestVal;
      let changeValue = latestVal - firstVal;
      const leadingPrefix = obj.prefix === "CURRENCY" ? "$" : "";
      const endingPrefix = ["CURRENCY", "NUMBER"].includes(obj.prefix) ? "B" : obj.prefix === "PERCENTAGE" ? "%" : ""
      if(obj.prefix !== "PERCENTAGE") {
        changeValue = ((latestVal - priorDataValue) / priorDataValue) * 100;
      }

      const greenSet = { light: LIGHT_GREEN, dark: GREEN };
      const redSet = { light: LIGHT_RED, dark: RED };
      let chartcolour: { light: string, dark: string } = { light: LIGHT_GREEN, dark: GREEN }
      if(obj.increase === "GREEN") {
        chartcolour = changeValue >= 0 ? greenSet : redSet;
      } else {
        chartcolour = changeValue >= 0 ? redSet : greenSet;
      }

      newObj[obj.category] = { 
        chartcolour,
        changeValue: parseFloat(changeValue.toFixed(2)),
        leadingPrefix,
        endingPrefix,
        subLabel
      }
      return newObj;
    }, {} as {[key: string]: any})
  }, [mappingData])

  const onChartSelect = (data: MappingData) => {
    setSelectedChart(data);
    setShowSidebar(true)
  }

  if(isLoading) return <Spinner show={isLoading} classNames="mt-16"/>

  return(
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 h-[87vh] overflow-scroll gap-4">
      {
        mappingData?.map((data) => (
          <div
            key={data.category}
            className="py-4 h-auto overflow-x-clip cursor-pointer"
            onClick={() => onChartSelect(data)}
          >
            <div className="uppercase font-extralight text-[14px]"> {data.title} </div>
            <div className="font-normal flex my-2">
              {chartSettings[data.category].leadingPrefix}{last(data?.chartData).value} {chartSettings[data.category].endingPrefix}
              <p
                className="text-[12px] ml-2"
                style={{ color: chartSettings?.[data.category]?.chartcolour?.light }}
              >
                {chartSettings[data.category].changeValue}%
              </p>
            </div>
            <p className="text-[12px]">{chartSettings[data.category].subLabel}</p>
            <div className="max-w-[300px]">
              {data.type === 'LINE' && <LineChart
                data={data?.chartData?.slice(0, data.showvalues)}
                timeLineData={[]}
                category={data?.category}
                isLoading={isLoading}
                chartOverview
                chartColour={chartSettings[data.category]?.chartcolour?.dark}
              />}
              {data.type === 'BAR' &&
                <BarChart
                  data={data?.chartData?.slice(0, data.showvalues)}
                  chartColour={chartSettings[data.category]?.chartcolour?.dark}
                  chartOverview
                />
              }
            </div>
          </div>
        ))
      }
      <SideBar open={showSidebar} onClose={() => setShowSidebar(false)}>
        <div className="bg-[#232323] h-full overflow-auto" ref={sideBarRef}>
          <div className="p-6 mt-2 h-[300px] flex justify-center items-center">
            Chart will be available soon! In-progress
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
