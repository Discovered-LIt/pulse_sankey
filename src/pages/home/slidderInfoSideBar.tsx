import React, { useRef, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { format, subMonths, isAfter, isEqual } from 'date-fns';
import cn from 'classnames';
// component
import SideBar from "../../components/sideBar";
import LineChart, { LineChartData, ZoomType, zoomsConfig } from "../../components/charts/lineChart";
// hooks
import useOnOutsideClick from "../../hooks/useOnClickOutside";
// types
import { SliderMappingDataProps } from "../../context/SlidderContext";
// utils
import { formatToDate } from "../../utils/global";

interface SliderInfoSideBar {
  showSidebar: boolean;
  data?: SliderMappingDataProps
  closeSideBar: () => void;
}

type StatsResponse = {
  Q: string;
  revenue: string;
  value: number
}

const SliderInfoSideBar = ({
  showSidebar = false,
  data,
  closeSideBar
}: SliderInfoSideBar) => {
  const sideBarRef = useRef<HTMLDivElement>()
  const [chartData, setChartData] = useState<LineChartData[]>([])
  const [activeTab, setActiveTab] = useState(0)
  const [activeZoom, setActiveZoom] = useState(ZoomType.ALL)

  useOnOutsideClick(sideBarRef.current, () => {
    if(!showSidebar) return;
    setActiveZoom(ZoomType.ALL)
    setActiveTab(0)
    closeSideBar()
  })

  useEffect(() => {
    if(chartData.length > 0 && !data?.link) {
      setChartData([])
      return;
    }
    if(!data?.link) return;
    axios.get(data.link).then(({ data }) => {
      const formattedData = data.reduce((arr: LineChartData[], obj: StatsResponse) => {
        const newObj = {
          date: formatToDate(obj.Q) as Date,
          x: obj.Q,
          y: obj.revenue,
          value: obj.value
        }
        arr.push(newObj)
        return arr
      }, [])
      setChartData(formattedData)
    }).catch((err) => alert(err))
  }, [data])

  const filteredChartData = useMemo(() => {
    let data = chartData;
    if(activeZoom !== ZoomType.ALL) {
      const months = zoomsConfig.find(({ label }) => label === activeZoom)?.val
      data = chartData.filter(({ date }) => date >= subMonths(new Date(), months))
    }
    return data.sort((a: any, b: any) => a.date - b.date)
  }, [activeZoom, chartData])

  const stats = useMemo(() => {
    if(!filteredChartData?.length || !data) return [];
    const latestVal = filteredChartData[filteredChartData.length - 1].value
    const sortByValue = filteredChartData.sort((a, b) => a.value - b.value)
    const max = sortByValue[sortByValue.length - 1]
    const min = sortByValue[0]
    return [
      ['latest', data?.category?.split('_').join(' '), latestVal, 'B'],
      ['maximum', format(max.date, "'Q'Q yyyy"), max.value, 'B'],
      ['minimum', format(min.date, "'Q'Q yyyy"), min.value, 'B'],
      ['change', 'Percent', min.value, '%'],
    ]
  }, [filteredChartData])

  const Button = ({ text, active=false }: { text: string, active?: boolean }) => (
    <button className={cn(
      [
        "bg-transparen py-2 px-10 border rounded-xl",
        {
          "text-white border-green-500": active,
          "text-gray-400 border-0": !active
        }
      ]
    )}>
      {text}
    </button>
  )

  const onZoomChange = (zoom: ZoomType) => {
    setActiveZoom(zoom)
  }
  
  return(
    <div>
      <SideBar open={showSidebar}>
        <div className="bg-[#232323] h-screen" ref={sideBarRef}>
          <div className="p-6 h-[470px]">
            <LineChart
              data={filteredChartData}
              category={data?.category}
              activeZoom={activeZoom}
              parentRef={sideBarRef}
              onZoomChange={onZoomChange}
            />
            <div className="flex uppercase my-4 gap-6 justify-between px-6">
              {
                stats.map((stat, idx) => (
                  <div key={idx}>
                    <h3 className="">{stat[0]}</h3>
                    <p className="text-[12px] pt-1 pb-2 text-gray-400">{stat[1]}</p>
                    <h1 className="text-green-500 font-bold text-[22px]">
                      {`${stat[2]}${stat[3]}`}
                    </h1>
                  </div>
                ))
              }
            </div>
          </div>
          <h1 className="py-4 text-center bg-black">{data?.category.split('_').join(' ')}</h1>
          <div className="p-6 text-[14px] overflow-auto h-full">
            <div className="flex justify-between w-[350px] m-auto mb-6">
              <Button text="SUMMARY" active={activeTab === 0}/>
              <Button text="DATA" active={activeTab === 1}/>
            </div>
            {data?.description}
          </div>
        </div>
      </SideBar>
    </div>
  )
}

export default SliderInfoSideBar;
