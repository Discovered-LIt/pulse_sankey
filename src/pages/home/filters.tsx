import React from "react";
import Slider, { SliderType } from "../../components/slider";
import { SlidderSettings, SlidderCategory } from "../../config/sankey";

interface Filter {
  sliderData: {[key in SlidderCategory]?: number}
  onChange: (type: SlidderCategory, val: number) => void;
}

const Filters = ({ sliderData, onChange }: Filter) => {
  return(
    <div className="w-full h-[260px] bg-black fixed bottom-0 left-0 right-0 pt-10 pb-10 overflow-auto">
      <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {
          Object.keys(SlidderSettings).map((type: SlidderCategory) => (
            <div className="w-[300px] mb-10 m-auto">
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

export default Filters