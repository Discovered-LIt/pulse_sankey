import React, { useState } from "react";
import SliderCom from 'rc-slider'

export enum SliderType {
  Negative = '#b81b01',
  Positive = "#05a302",
  Basic = '#6c6c6c'
}

interface Slider {
  id: string
  label: string
  description?: string
  min?: number
  max?: number
  step?: number;
  value: number
  type?: SliderType
  prefix?: string;
  onChange: (val: number) => void;
}

const Slider = ({
  id,
  label,
  description,
  value,
  min = 0,
  max = 500,
  step=1,
  type = SliderType.Basic,
  prefix,
  onChange }: Slider) => {
  const [tempVal, setTempVal] = useState<any>(value)
  return (
    <div className="text-white w-full">
      <div className="flex justify-between">
        <label
          htmlFor={id}
          className="bold text-[12px] uppercase"
        >
          {label}
        </label>
        <div className="h-[20px] min-w-[55px] rounded bg-zinc-700 text-[10px] flex items-center justify-center">
          {tempVal} {prefix}
        </div>
      </div>
      <p className="text-[10px] font-light uppercase italic my-2">{description}</p>
      <SliderCom
        defaultValue={tempVal}
        value={tempVal}
        min={min}
        max={max}
        step={step}
        handleStyle={{ backgroundColor: 'none', border: 'none', opacity: 1 }}
        trackStyle={{ backgroundColor: type }}
        onChange={(val) => setTempVal(val)}
        onAfterChange={onChange}
      />
    </div>
  )
}

export default Slider
