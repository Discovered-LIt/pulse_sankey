import React from "react";
// components
import Slider, { SliderType } from "../../components/slider";
// icons
import AdjustmentsHorizontalIcon from '@heroicons/react/24/outline/AdjustmentsHorizontalIcon'
import LockClosedIcon from '@heroicons/react/24/outline/LockClosedIcon'
// types
import { SlidderSettings, SlidderCategory } from "../../config/sankey";
import { SliderData } from ".";

interface Filter {
  sliderData: SliderData;
  onChange: (type: SlidderCategory, val: number) => void;
}

const InfoDiv = () => (
  <div
    className="
      bg-black w-full min-h-10 mb-4 px-8 py-4 sticky top-0 z-10 text-xs
      gap-4 md:gap-12 shadow-md shadow-slate-600/50 flex flex-wrap items-center
      sm:justify-normal justify-between"
    >
    <div className="flex gap-2 md:gap-4">
      <b> Q3 2023 </b>
      <AdjustmentsHorizontalIcon className="h-4 w-4"/>
      <LockClosedIcon className="h-4 w-4 hidden sm:block"/>
    </div>
    <div className="flex gap-2 md:gap-4">
      EPS
      <b> $0.10 </b>
    </div>
    <div className="gap-2 md:gap-4 hidden sm:flex">
      PRICE TARGET
      <b> $350 </b>
    </div>
    <div className="gap-2 md:gap-4 hidden sm:flex">
      PE RATIO
      <div className="w-[120px]">
        <Slider
          id={'pe-ratio'}
          label=''
          description=''
          min={0}
          max={100}
          step={1}
          prefix=''
          value={20}
          type={SliderType.Positive}
          onChange={(val: number) => console.log(val)}
          simple={true}
        />
      </div>
    </div>
    <div className="gap-2 md:gap-4 hidden sm:flex">
      UPSIDE
      <b className="text-green-500"> 20% </b>
    </div>
  </div>
)

const Settings = ({ sliderData, onChange }: Filter) => {
  return(
    <div className="w-full h-[260px] bg-black fixed bottom-0 left-0 right-0 pb-10 overflow-auto">
      <InfoDiv />
      <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {
          Object.keys(SlidderSettings).map((type: SlidderCategory) => (
            <div className="w-[300px] mb-2 m-auto">
            <Slider
              id={type}
              label={type}
              description={SlidderSettings[type].description}
              min={SlidderSettings[type].min}
              max={SlidderSettings[type].max}
              step={SlidderSettings[type].step}
              prefix={SlidderSettings[type].prefix}
              value={sliderData[type] || 0}
              type={SliderType.Positive}
              onChange={(val: number) => onChange(type, val)}
            />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Settings