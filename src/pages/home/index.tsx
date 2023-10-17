import React, { useState, useMemo } from "react";
// components
import SankeyChart from "../../components/charts/sankey";
import Settings from "./settings";
import SliderInfoSideBar from "./slidderInfoSideBar";
// types
import { SlidderCategory, SankeyCategory } from "../../config/sankey";
// data
import { sliderDefaultData, slidderCategoryInfoMaping } from "../../config/sankey";
// utils
import cal from "../../utils/sankey";
import { getSankeyDisplayColor } from "../../utils/global";
// context
import { useSliderContext } from "../../context/SlidderContext";

export type SliderData = {[key in SlidderCategory]?: number}

export type SankeyData = {
  nodes: { id: string }[];
  links: { source: string; target: string; value: number }[];
};

const Home = () => {
  const [defaultSliderData] = useState<SliderData>(sliderDefaultData)
  const [sliderData, setSlider] = useState<SliderData>(sliderDefaultData)
  const [peRatio, setPeRatio] = useState<number>(70)
  const { selectedSlider, sliderCategoryData, setSelectedSlider } = useSliderContext();

  const sankeyData = useMemo((): SankeyData => {
    const netProfit = cal.calculateNetProfit(sliderData)
    const sankeyLinks: [any, SankeyCategory, (data: SliderData) => number][] = [
      [SankeyCategory.AutoRevenue, SankeyCategory.TotalRevenue, cal.calculateAutoRevenue],
      [SlidderCategory.EnergyGenerationAndStorageRevenue, SankeyCategory.TotalRevenue, cal.getEnergyGenerationAndStorageRevenue],
      [SlidderCategory.ServicesAndOtherRevenue, SankeyCategory.TotalRevenue, cal.getServicesAndOtherRevenue],
      [SankeyCategory.TotalRevenue, SankeyCategory.GrossProfite, cal.calculateGrossProfit],
      [SankeyCategory.GrossProfite, SankeyCategory.OperationProfit, cal.calculateOperationProfit],
      [SankeyCategory.GrossProfite, SankeyCategory.OperationExpenses, cal.calculateOperationExpenses],
      [
        SankeyCategory.OperationProfit, 
        netProfit >= 0 ? SankeyCategory.NetProfite : SankeyCategory.NetLoss, 
        cal.calculateNetProfit
      ],
      [SankeyCategory.OperationProfit, SankeyCategory.Tax, cal.calculateTax],
      [SankeyCategory.Others, SankeyCategory.NetProfite, cal.calculateOthers],
      [SankeyCategory.OperationExpenses, SankeyCategory["R&D"], cal.calculateRAndD],
      [SankeyCategory.OperationExpenses, SankeyCategory["SG&A"], cal.calculateSGA],
      [SankeyCategory.OperationExpenses, SankeyCategory.OtherOpex, cal.calculateOtherOpex],
      [SankeyCategory.TotalRevenue, SankeyCategory.CostOfRevenue, cal.calculateCostOfRevenue],
    ];
    
    // to show dynamic color for others sankey line
    const othersLineColor = getSankeyDisplayColor(cal.calculateOthers(sliderData), SankeyCategory.Others)

    return {
      nodes: [...new Set(sankeyLinks.map((ar) => [ar[1], ar[0]]).flat())].map(key => {
        return { 
          id: key,
          heading: [SankeyCategory.AutoRevenue, SankeyCategory.NetProfite].includes(key),
          ...(key === SankeyCategory.Others ? { color: othersLineColor } : {})
        }
      }),
      links: sankeyLinks.map((link) => {
        const [source, target, fn] = link;
        const value = Math.abs(fn?.(sliderData))
        return { source, target, value, displayValue: fn?.(sliderData) }
      })
    }
  }, [sliderData])

  const eps = useMemo(() => {
    return cal.calEPS(sliderData)
  }, [sliderData])
  
  const onSliderChange = (type: SlidderCategory, val: number) => {
    setSlider((prevState) => {
      return {...prevState, ...{[type]: val}}
    })
  }

  const onSliderInfoClick = (type: SlidderCategory) => {
    setSelectedSlider(type)
  }

  const sideBarData = useMemo(() => {
    if(!selectedSlider) return undefined
    return sliderCategoryData[slidderCategoryInfoMaping[selectedSlider].category]
  }, [selectedSlider])

  return (
    <div className="bg-[#1d1f23] text-white h-screen w-full block pt-20 overflow-scroll">
      <SankeyChart data={sankeyData} />
      <Settings
        onChange={onSliderChange}
        defaultSliderData={defaultSliderData}
        sliderData={sliderData}
        eps={eps}
        priceTarget={(eps + 2.58) * peRatio}
        peRatio={peRatio}
        setPeRatio={setPeRatio}
        onSliderInfoClick={onSliderInfoClick}
      />
      <SliderInfoSideBar
        showSidebar={!!selectedSlider}
        data={sideBarData}
        closeSideBar={() => {
          setSelectedSlider(null)
        }}
      />
    </div>
  )
}

export default Home;
