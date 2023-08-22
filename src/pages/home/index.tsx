import React, { useState } from "react";
// components
import SankeyChart from "../../components/charts/sankey";
import Filters from "./filters";
// types
import { SlidderCategory, SankeyCategory } from "../../config/sankey";

export type SliderData = {[key in SlidderCategory]?: number}

export type SankeyData = {
  nodes: { id: string }[];
  links: { source: string; target: string; value: number }[];
};

const Home = () => {
  const [autoSalesRevenue, setAutoSalesRevenue] = useState<number>(2)
  const [autoLeasingRevenue, setAutoLeasingRevenue] = useState<number>(2)
  const [autoRegCredits, setAutoRegCredits] = useState<number>(2)
  const [sliderData, setSlider] = useState<{[key in SlidderCategory]?: number}>({})

  const autoRevenue = autoSalesRevenue + autoLeasingRevenue + autoRegCredits;

  const sankeyData: SankeyData = {
    nodes: Object.values(SankeyCategory).map((key) => {
      return { id: key, heading: [SankeyCategory.AutoRevenue, SankeyCategory.NetProfite].includes(key) }
    }),
    links: [
      { source: SankeyCategory.AutoRevenue, target: SankeyCategory.TotalRevenue, value: autoRevenue },
      { source: SankeyCategory.AutoSalesRevenue, target: SankeyCategory.TotalRevenue, value: autoSalesRevenue },
      { source: SankeyCategory.AutoLeasingRevenue, target: SankeyCategory.TotalRevenue, value: autoLeasingRevenue },
      { source: SankeyCategory.AutoRegCredits, target: SankeyCategory.TotalRevenue, value: autoRegCredits },

      { source: SankeyCategory.TotalRevenue, target: SankeyCategory.GrossProfite, value: 1.4 },
      { source: SankeyCategory.GrossProfite, target: SankeyCategory.OperationProfit, value: 1.4 },
      { source: SankeyCategory.GrossProfite, target: SankeyCategory.OperationExpenses, value: 1.4 },

      { source: SankeyCategory.OperationProfit, target: SankeyCategory.NetProfite, value: 1.4 },
      { source: SankeyCategory.OperationProfit, target: SankeyCategory.Tax, value: 1.4 },
      { source: SankeyCategory.OperationProfit, target: SankeyCategory.Others, value: 1.4 },

      { source: SankeyCategory.OperationExpenses, target: SankeyCategory["R&D"], value: 1.4 },
      { source: SankeyCategory.OperationExpenses, target: SankeyCategory["SG&D"], value: 1.4 },

      { source: SankeyCategory.TotalRevenue, target: SankeyCategory.CostOfRevenue, value: 1.4 },
      { source: SankeyCategory.CostOfRevenue, target: SankeyCategory.AutoCosts, value: 1.4 },
      { source: SankeyCategory.CostOfRevenue, target: SankeyCategory.EnergyCosts, value: 1.4 },
    ]
  }

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
