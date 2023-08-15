import React, { useState } from "react";
// components
import Header from "./components/header";
import SankeyChart from "./components/charts/sankey";
import Slider, { SliderType } from "./components/slider";

const Main = () => {
  const [autoSalesRevenue, setAutoSalesRevenue] = useState<number>(2)
  const [autoLeasingRevenue, setAutoLeasingRevenue] = useState<number>(2)
  const [autoRegCredits, setAutoRegCredits] = useState<number>(2)

  return (
    <div className="bg-[#1d1f23] text-white h-screen w-screen block">
      <Header />
      <SankeyChart
        autoSalesRevenue={autoSalesRevenue}
        autoLeasingRevenue={autoLeasingRevenue}
        autoRegCredits={autoRegCredits}
      />
      <div className="w-full h-[200px] bg-black fixed bottom-0 left-0 right-0 pt-6 pb-10 px-20 flex gap-[200px]">
        <Slider
          id="auto_sales"
          label="Auto Sales Revenue"
          description="less than Q2 auti revenue"
          min={0}
          max={5}
          value={autoSalesRevenue}
          type={SliderType.Negative}
          onChange={(val) => setAutoSalesRevenue(val)}
        />
        <Slider
          id="auto_leasing"
          label="Auto Leasing Revenue"
          description="more than analyst avg"
          min={0.2}
          max={3}
          value={autoSalesRevenue}
          type={SliderType.Positive}
          onChange={(val) => setAutoLeasingRevenue(val)}
        />
        <Slider
          id="auto_reg"
          label="Auto Reg Credits"
          description="more than yst avg"
          min={0}
          max={3}
          value={autoSalesRevenue}
          type={SliderType.Positive}
          onChange={(val) => setAutoRegCredits(val)}
        />
      </div>
    </div>
  )
}

export default Main;
