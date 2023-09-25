import React, { useRef, useState, useMemo } from "react";
import axios from "axios";
import { format, subMonths } from 'date-fns';
import cn from 'classnames';
import { useQuery } from '@tanstack/react-query';
// component
import SideBar from "../../components/sideBar";
import LineChart, { LineChartData, ZoomType, zoomsConfig } from "../../components/charts/lineChart";
// hooks
import useOnOutsideClick from "../../hooks/useOnClickOutside";
// types
import { SliderMappingDataProps } from "../../context/SlidderContext";
// icons
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'

interface SliderInfoSideBar {
  showSidebar: boolean;
  data?: SliderMappingDataProps
  closeSideBar: () => void;
}

const SliderInfoSideBar = ({
  showSidebar = false,
  data,
  closeSideBar
}: SliderInfoSideBar) => {
  const sideBarRef = useRef<HTMLDivElement>()
  const [activeTab, setActiveTab] = useState(0)
  const [activeZoom, setActiveZoom] = useState(ZoomType.ALL)

  useOnOutsideClick(sideBarRef.current, () => {
    if(!showSidebar) return;
    setActiveZoom(ZoomType.ALL)
    setActiveTab(0)
    closeSideBar()
  })

  const { data: chartData, isLoading } = useQuery({
    queryKey: ['fetchChartData', data?.link],
    queryFn: async (): Promise<LineChartData[]> => {
      if(!data?.link) return []
      const res = await axios.get(data.link)
      return res?.data as LineChartData[]
  } })

  const filteredChartData = useMemo(() => {
    if(!chartData?.length) return [];
    if(activeZoom !== ZoomType.ALL) {
      const months = zoomsConfig.find(({ label }) => label === activeZoom)?.val
      return chartData.filter(({ date }) => new Date(date) >= subMonths(new Date(), months))
    }
    return chartData;
  }, [activeZoom, chartData])

  const stats = useMemo(() => {
    if(!filteredChartData?.length || !data) return [];
    const latestVal = filteredChartData[filteredChartData.length - 1].value
    const sortByValue = filteredChartData.sort((a, b) => a.value - b.value)
    const max = sortByValue[sortByValue.length - 1]
    const min = sortByValue[0]
    return [
      ['latest', data?.category?.split('_').join(' '), latestVal, 'B'],
      ['maximum', format(new Date(max.date), "'Q'Q yyyy"), max.value, 'B'],
      ['minimum', format(new Date(min.date), "'Q'Q yyyy"), min.value, 'B'],
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
    <SideBar open={showSidebar}>
      <div className="bg-[#232323] h-[92vh] overflow-auto" ref={sideBarRef}>
        {showSidebar && 
          <XMarkIcon
            className="sm:hidden h-4 w-4 absolute top-[5px] right-[12px] pointer"
            onClick={closeSideBar}
          />
        }
        <div className="p-6">
          <LineChart
            data={filteredChartData}
            category={data?.category}
            activeZoom={activeZoom}
            parentRef={sideBarRef}
            isLoading={isLoading}
            onZoomChange={onZoomChange}
          />
          <div className="flex flex-wrap uppercase my-4 justify-between px-6">
            {
              stats.map((stat, idx) => (
                <div key={idx} className="mr-6">
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
        <div className="p-6 text-[14px] overflow-auto">
          <div className="flex justify-between w-[350px] m-auto mb-6">
            <Button text="SUMMARY" active={activeTab === 0}/>
            <Button text="DATA" active={activeTab === 1}/>
          </div>
          {data?.description}
        </div>
      </div>
    </SideBar>
  )
}

export default SliderInfoSideBar;
