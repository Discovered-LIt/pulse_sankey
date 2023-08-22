import React, { useState } from "react";
// components
import Header from "../../components/header";
import SankeyChart from "../../components/charts/sankey";
import Filters from "./filters";
// types
import { SlidderCategory } from "config/sankey";

const Home = () => {
  const [autoSalesRevenue, setAutoSalesRevenue] = useState<number>(2)
  const [autoLeasingRevenue, setAutoLeasingRevenue] = useState<number>(2)
  const [autoRegCredits, setAutoRegCredits] = useState<number>(2)
  const [sliderData, setSlider] = useState<{[key in SlidderCategory]?: number}>({})

  const onSliderChange = (type: SlidderCategory, val: number) => {
    setSlider((prevState) => {
      return {...prevState, ...{[type]: val}}
    })
  }

  return (
    <div className="bg-[#1d1f23] text-white h-screen w-screen block">
      <Header />
      <SankeyChart
        autoSalesRevenue={autoSalesRevenue}
        autoLeasingRevenue={autoLeasingRevenue}
        autoRegCredits={autoRegCredits}
      />
      <Filters
        onChange={onSliderChange}
        sliderData={sliderData}
      />
    </div>
  )
}

export default Home;
