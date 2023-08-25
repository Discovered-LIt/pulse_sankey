import React, { useState, useMemo } from "react";
// components
import SankeyChart from "../../components/charts/sankey";
import Filters from "./filters";
// types
import { SlidderCategory, SankeyCategory } from "../../config/sankey";
// data
import { sliderDefaultData } from "../../config/sankey";
// utils
import cal from "../../utils/sankey";

export type SliderData = {[key in SlidderCategory]?: number}

export type SankeyData = {
  nodes: { id: string }[];
  links: { source: string; target: string; value: number }[];
};

const Home = () => {
  const [sliderData, setSlider] = useState<SliderData>(sliderDefaultData)

  const sankeyData = useMemo((): SankeyData => {
    const sankeyLinks: [any, SankeyCategory, (data: SliderData) => number][] = [
      [SankeyCategory.AutoRevenue, SankeyCategory.TotalRevenue, cal.calculateAutoRevenue],
      // [SankeyCategory.AutoSalesRevenue, SankeyCategory.TotalRevenue, cal.calculateAutoSalesRevenue],
      // [SankeyCategory.AutoLeasingRevenue, SankeyCategory.TotalRevenue, cal.calculateAutoLeasingRevenue],
      // [SankeyCategory.AutoRegCredits, SankeyCategory.TotalRevenue, cal.calculateAutoRegCredits],
      [SlidderCategory.EnergyGenerationAndStorageRevenue, SankeyCategory.TotalRevenue, cal.getEnergyGenerationAndStorageRevenue],
      [SlidderCategory.ServicesAndOtherRevenue, SankeyCategory.TotalRevenue, cal.getServicesAndOtherRevenue],
    
      [SankeyCategory.TotalRevenue, SankeyCategory.GrossProfite, cal.calculateGrossProfit],
      [SankeyCategory.GrossProfite, SankeyCategory.OperationProfit, cal.calculateOperationProfit],
      [SankeyCategory.GrossProfite, SankeyCategory.OperationExpenses, cal.calculateOperationExpenses],
      [SankeyCategory.OperationProfit, SankeyCategory.NetProfite, cal.calculateNetProfit],
      [SankeyCategory.OperationProfit, SankeyCategory.Tax, cal.calculateTax],
      [SankeyCategory.OperationProfit, SankeyCategory.Others, cal.calculateOthers],
    
      [SankeyCategory.OperationExpenses, SankeyCategory["R&D"], cal.calculateRAndD],
      [SankeyCategory.OperationExpenses, SankeyCategory["SG&D"], cal.calculateSGA],
    
      [SankeyCategory.TotalRevenue, SankeyCategory.CostOfRevenue, cal.calculateCostOfRevenue],
      [SankeyCategory.CostOfRevenue, SankeyCategory.AutoCosts, cal.calculateAutoCosts],
      [SankeyCategory.CostOfRevenue, SankeyCategory.EnergyCosts, cal.calculateEnergyCosts],
    ];
  
    return {
      nodes: [...new Set(sankeyLinks.map((ar) => [ar[1], ar[0]] ).flat())].map((key) => {
        return { id: key, heading: [SankeyCategory.AutoRevenue, SankeyCategory.NetProfite].includes(key) }
      }),
      links: sankeyLinks.map((link) => {
        const [source, target, fn] = link;
        const val = parseFloat((fn?.(sliderData) || 0).toFixed(1))
        return { source, target, value: val }
      })
    }
  }, [sliderData])
  
  const onSliderChange = (type: SlidderCategory, val: number) => {
    setSlider((prevState) => {
      return {...prevState, ...{[type]: val}}
    })
  }

  return (
    <div className="bg-[#1d1f23] text-white h-screen w-screen block">
      <SankeyChart data={sankeyData} />
      <Filters
        onChange={onSliderChange}
        sliderData={sliderData}
      />
    </div>
  )
}

export default Home;
