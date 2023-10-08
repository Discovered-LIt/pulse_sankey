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
import { useSliderContext } from "../../context/SlidderContext";
// types
import { SliderMappingDataProps } from "../../context/SlidderContext";
// icons
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
// Date
import { SlidderSettings } from "../../config/sankey";

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
  const { selectedSlider } = useSliderContext()

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

  const stats = useMemo((): [string, string, number, string][] => {
    if(!filteredChartData?.length || !data) return [];
    const latest = filteredChartData[filteredChartData.length - 1]
    const sortByValue = [...filteredChartData].sort((a, b) => a.value - b.value)
    const max = sortByValue[sortByValue.length - 1]
    const min = sortByValue[0]
    const prefix = SlidderSettings[selectedSlider]?.prefix || '';

    const firstVal = filteredChartData[0].value;
    let changeValue = ((latest.value - firstVal) / Math.abs(firstVal));
    if(prefix !== '%') {
      changeValue = changeValue * 100
    }

    return [
      ['latest', format(new Date(latest.date), "'Q'Q yyyy"), latest.value, prefix],
      ['change', `Since ${format(new Date(min.date), "'Q'Q yyyy")}`, parseFloat(changeValue.toFixed(1)), '%'],
      ['maximum', format(new Date(max.date), "'Q'Q yyyy"), max.value, prefix],
      ['minimum', format(new Date(min.date), "'Q'Q yyyy"), min.value, prefix],
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
      <div className="bg-[#232323] h-full overflow-auto" ref={sideBarRef}>
        {showSidebar && 
          <XMarkIcon
            className="sm:hidden h-5 w-5 absolute top-[5px] right-[12px] pointer"
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
            prefix={SlidderSettings[selectedSlider]?.prefix}
            onZoomChange={onZoomChange}
          />
          <div className="flex flex-wrap uppercase mt-4 justify-between px-2 py-2 md:px-6 md:py-4 bg-[#2d2d2e] rounded-md">
            {
              stats.map((stat, idx) => (
                <div key={idx}>
                  <h3 className="text-[12px] md:text-[16px]">{stat[0]}</h3>
                  <p className="text-[12px] text-gray-400">{stat[1]}</p>
                  <h1 className="text-green-500 font-bold md:text-[22px]">
                    {`${stat[2]}${stat[3]}`}
                  </h1>
                </div>
              ))
            }
          </div>
        </div>
        <h1 className="py-4 text-center bg-black">{data?.category.split('_').join(' ')}</h1>
        <div className="p-6 text-[14px] overflow-hidden">
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
