import React, { useState } from "react";
import cn from 'classnames';
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
  value: number
  type?: SliderType
  onChange: (val: number) => void;
}

const Slider = ({ id, label, description, value, min = 0, max = 500, type = SliderType.Basic, onChange }: Slider) => {
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
        <div className="h-[20px] rounded bg-zinc-700 text-[10px] flex items-center p-2">
          {tempVal} BN
        </div>
      </div>
      <p className="text-[10px] font-light uppercase italic my-2">{description}</p>
      <SliderCom
        defaultValue={tempVal}
        value={tempVal}
        min={min}
        max={max}
        step={0.1}
        handleStyle={{ backgroundColor: 'none', border: 'none', opacity: 1 }}
        trackStyle={{ backgroundColor: type }}
        onChange={(val) => setTempVal(val)}
        onAfterChange={onChange}
      />
    </div>
  )
}

export default Slider
