import React, { useState } from "react";
import cn from 'classnames';
// components
import Slider from "../../components/slider";
import { SliderType, Prefix} from "../../config/sankey";
// icons
import AdjustmentsHorizontalIcon from '@heroicons/react/24/outline/AdjustmentsHorizontalIcon'
import LockClosedIcon from '@heroicons/react/24/outline/LockClosedIcon'
import ChevronDoubleUpIcon from '@heroicons/react/24/solid/ChevronDoubleUpIcon'
import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDoubleDownIcon'
import MinusIcon from '@heroicons/react/24/solid/MinusIcon'
import ChevronUpIcon from '@heroicons/react/24/solid/ChevronUpIcon'
// types
import { SlidderSettings, SlidderCategory } from "../../config/sankey";
import { SliderData } from ".";

interface Setting {
  sliderData: SliderData;
  defaultSliderData: SliderData;
  eps: number;
  priceTarget: number;
  setPeRatio: (peRatio: number) => void;
  onChange: (type: SlidderCategory, val: number) => void;
  onSliderInfoClick: (string: SlidderCategory) => void;
}

type InfoDivProps = { 
  isExpanded: boolean;
  eps: number;
  priceTarget: number;
  setPeRatio: (peRatio: number) => void;
  onExpandClick: () => void;
}

const InfoDiv = ({
  isExpanded,
  eps,
  priceTarget,
  setPeRatio,
  onExpandClick
}: InfoDivProps) => (
  <div
    className="
      bg-black w-full min-h-10 px-8 py-4 top-0 z-10 text-xs
      gap-4 md:gap-12 shadow-md shadow-slate-600/50 flex flex-wrap items-center
      sm:justify-normal justify-between"
    >
    <div className="flex gap-2 md:gap-4">
      <b> Q3 2023 </b>
      <AdjustmentsHorizontalIcon className="h-4 w-4"/>
      <ChevronUpIcon className={
        cn(
          ["h-4 w-4 transition-transform duration-500"],
          { 'rotate-180': isExpanded }
        )}
        onClick={onExpandClick}
      />
      <LockClosedIcon className="h-4 w-4 hidden sm:block"/>
    </div>
    <div className="flex gap-2 md:gap-4">
      EPS
      <b> ${eps.toFixed(2)} </b>
    </div>
    <div className="gap-2 md:gap-4 hidden sm:flex">
      PRICE TARGET
      <b> ${Math.ceil(priceTarget)} </b>
    </div>
    <div className="gap-2 md:gap-4 hidden sm:flex">
      PE RATIO
      <div className="w-[120px]">
        <Slider
          id={'pe-ratio'}
          label=''
          description=''
          min={0}
          max={1000}
          step={1}
          prefix=''
          value={20}
          type={SliderType.Positive}
          onChange={(val: number) => setPeRatio(val)}
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

const Settings = ({
  sliderData,
  defaultSliderData,
  eps,
  priceTarget,
  setPeRatio,
  onChange,
  onSliderInfoClick
}: Setting) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const isMobile = window.innerWidth <= 680
  const [height, setHeight] = useState(isMobile ? 0 : 250);
  const [isDragging, setIsDragging] = useState(false);

  const calculatePercentage = (type: SlidderCategory): number => {
    const defaultVal = defaultSliderData[type]
    const currentVal = sliderData[type]

    if((defaultVal + currentVal) === 0) return 0;
    if(defaultVal === 0) return 100;
    if(SlidderSettings[type].prefix === Prefix.Percentage) {
      return Math.ceil(currentVal - defaultVal)
    }
    return Math.ceil(((currentVal - defaultVal) / defaultVal) * 100)
  }
  
  const getDescription = (type: SlidderCategory) => {
    const percentage = calculatePercentage(type)
    const base = percentage === 0
    const Icon = base ? MinusIcon : percentage >= 0 ? ChevronDoubleUpIcon : ChevronDownIcon
    const primary = base ? 'text-gray-500' : SlidderSettings[type].type === SliderType.Positive ? 'text-green-500' : 'text-red-500'
    const secondary = SlidderSettings[type].type === SliderType.Positive ? 'text-red-500' : 'text-green-500'
    return (
      <div className="flex items-center gap-1">
        <Icon className={cn(
          [
            "h-4 w-6 -ml-2",
            {
              [primary]: percentage >= 0,
              [secondary]: percentage < 0
            }
          ],
        )}/>
        <p className="text-[10px] font-light uppercase italic">
          {`${percentage}% since Q2 2023`}
        </p>
      </div>
    )
  }

  const handleMouseDown = (e: any) => {
    e.preventDefault();
    let startY = e.clientY || e.touches[0].clientY;
    setIsDragging(true)

    const handleMouseMove = (e: any) => {
      e.preventDefault();
      setIsExpanded(true)
      const deltaY = (e.clientY || e.touches[0].clientY) - startY;
      setHeight((prevHeight) => {
        const newHeight = prevHeight - deltaY;
        if(!isMobile && newHeight <= 250 || newHeight > 550) return prevHeight;
        startY = e.clientY || e.touches[0].clientY
        return newHeight
      });
    };

    const handleMouseUp = (e: any) => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleMouseMove, {passive: false});
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
  };

  const onExpandClick = () => {
    setIsExpanded(!isExpanded)
    setHeight(isExpanded ? 0 : 500)
  }

  return(
      <div className="w-full bg-black fixed bottom-0 left-0 right-0 cursor-pointer overflow-auto">
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <InfoDiv
            isExpanded={isExpanded}
            eps={eps}
            priceTarget={priceTarget}
            setPeRatio={setPeRatio}
            onExpandClick={onExpandClick}
          />
        </div>
        <div className={cn([
            "overflow-auto block",
            // isExpanded ? "md:h-[200px] h-0" : "md:h-[200px] h-[200px]",
            {
              'transition-height duration-500': !isDragging
            }
          ])}
          style={{ height: `${height}px` }}
        >
          <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-6">
            {
              Object.keys(SlidderSettings).map((type: SlidderCategory, idx: number) => (
                <div key={idx} className="w-[300px] mb-2 m-auto">
                  <Slider
                    id={type}
                    label={type}
                    description={getDescription(type)}
                    min={SlidderSettings[type].min}
                    max={SlidderSettings[type].max}
                    step={SlidderSettings[type].step}
                    prefix={SlidderSettings[type].prefix}
                    value={sliderData[type] || 0}
                    type={SlidderSettings[type].type}
                    onChange={(val: number) => onChange(type, val)}
                    onInfoClick={onSliderInfoClick}
                  />
                </div>
              ))
            }
          </div>
        </div>
      </div>
  )
}

export default Settings