import React, { useState, useMemo } from "react";
import cn from 'classnames';
// components
import Slider from "../../components/slider";
import { SliderType, Prefix} from "../../config/sankey";
import ProgressTabMenu from "../../components/progressTabMenu";
// icons
import ChevronDoubleUpIcon from '@heroicons/react/24/solid/ChevronDoubleUpIcon'
import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDoubleDownIcon'
import MinusIcon from '@heroicons/react/24/solid/MinusIcon'
import ChevronUpIcon from '@heroicons/react/24/solid/ChevronUpIcon'
import CalendarIcon from '@heroicons/react/24/solid/CalendarIcon'
// types
import { SlidderSettings, SlidderCategory, slidderGroups, SlidderGroupType } from "../../config/sankey";
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
      bg-black w-full min-h-10 px-8 py-4 top-0 z-20 text-xs
      flex flex-wrap items-center
      justify-between cursor-n-resize
      border-b-2 border-b-slate-600/50" 
    >
    <div className="flex justify-between gap-x-2 sm:gap-x-12 sm:justify-normal items-center flex-wrap cursor-pointer">
      <div className="flex ">
        <CalendarIcon className="h-4 w-4 mr-1"/>
        Q3 2023 
      </div>
      <div>
        PRICE TARGET
        <b className="ml-2"> ${Math.ceil(priceTarget)} </b>
      </div>
      <div>
        EPS
        <b className="ml-2"> ${eps.toFixed(2)} </b>
      </div>
      <div className="flex pt-4 md:pt-0 justify-between w-full md:w-auto">
        <div className="flex gap-2 items-center">
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
        <button
          className="bg-transparent text-white py-1 px-2 text-xs border border-gray-500 rounded md:hidden"
          onClick={() => alert("Coming soon!")}
        >
          SAVE
        </button>
      </div>
    </div>
    <div className="md:flex gap-10 hidden cursor-pointer items-center">
      <button
        className="bg-transparent text-white py-1 px-2 text-xs border border-gray-500 rounded"
        onClick={() => alert("Coming soon!")}
      >
        SAVE
      </button>
      <ChevronUpIcon className={
        cn(
          ["h-6 w-6 transition-transform duration-500"],
          { 'rotate-180': isExpanded }
        )}
        onClick={onExpandClick}
      />
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

  const getSlidderViewSettings = (type: SlidderCategory) => {
    const percentage = calculatePercentage(type)
    const base = percentage === 0
    const isPositive = SlidderSettings[type].type === SliderType.Positive
    const primary = base ? 'text-gray-500' : isPositive ? 'text-green-500' : 'text-red-500'
    const secondary = isPositive ? 'text-red-500' : 'text-green-500'
    let Icon = MinusIcon;
    let newSliderType = null;
    if(!base) {
      if(isPositive) {
        Icon = percentage > 0 ? ChevronDoubleUpIcon : ChevronDownIcon;
        newSliderType = percentage > 0 ? SliderType.Positive : SliderType.Negative
      } else {
        Icon = percentage > 0 ? ChevronDownIcon : ChevronDoubleUpIcon
        newSliderType = percentage > 0 ? SliderType.Negative : SliderType.Positive
      }
    }
    return {
      primary,
      secondary,
      newSliderType,
      Icon,
      percentage
    }
  }

  const dynamicSettings = useMemo(() => {
    return Object.keys(SlidderSettings).reduce((obj: any, type: SlidderCategory) => {
      obj[type] = getSlidderViewSettings(type)
      return obj;
    }, {})
  }, [sliderData])
  
  const getDescription = (type: SlidderCategory) => {
    const { primary, secondary, percentage, Icon } = dynamicSettings[type]
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

  const sliderContainerId = 'slider-container';
  const sliderContentClassName = 'slider-group'

  return(
      <div className="w-full bg-black fixed bottom-0 left-0 right-0 overflow-auto">
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
        <div
          id={sliderContainerId}
          className={cn([
            "overflow-auto block w-[80%] m-auto pl-[10px]",
            {
              'transition-height duration-500': !isDragging
            }
          ])}
          style={{ height: `${height}px` }}
        >
          {/* <div className="flex flex-wrap sticky top-0 w-full pt-4 pb-2 m-auto bg-black mt-[2px] z-10">
            <ProgressTabMenu
              options={Object.keys(slidderGroups)}
              mainContainerId={sliderContainerId}
              contentClassName={sliderContentClassName}
            />
          </div> */}
          {/* <div className={`grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-6`}> */}
          {
            Object.keys(slidderGroups).map((group: SlidderGroupType, idx) => (
              <>
                <div className="bg-[#1d1f23] p-2 rounded sticky top-0 z-10 w-[98%] uppercase text-[12px]">
                  {group}
                </div>
                <div
                  id={`${sliderContentClassName}-${idx}`} 
                  key={idx}
                  className={`grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-6 ${sliderContentClassName}`}
                >
                  {slidderGroups[group].map((type, index) => (
                    <div key={index} className="w-[300px] mb-2">
                      <Slider
                        id={type}
                        label={type}
                        description={getDescription(type)}
                        min={SlidderSettings[type].min}
                        max={SlidderSettings[type].max}
                        step={SlidderSettings[type].step}
                        prefix={SlidderSettings[type].prefix}
                        value={sliderData[type] || 0}
                        type={dynamicSettings?.[type]?.newSliderType || SlidderSettings[type].type}
                        onChange={(val: number) => onChange(type, val)}
                        onInfoClick={onSliderInfoClick}
                      />
                    </div>
                  ))}
                </div>
              </>
            ))
            // Object.keys(SlidderSettings).map((type: SlidderCategory, idx: number) => (
            //   <div key={idx} className="w-[300px] mb-2 m-auto">
            //     <Slider
            //       id={type}
            //       label={type}
            //       description={getDescription(type)}
            //       min={SlidderSettings[type].min}
            //       max={SlidderSettings[type].max}
            //       step={SlidderSettings[type].step}
            //       prefix={SlidderSettings[type].prefix}
            //       value={sliderData[type] || 0}
            //       type={dynamicSettings?.[type]?.newSliderType || SlidderSettings[type].type}
            //       onChange={(val: number) => onChange(type, val)}
            //       onInfoClick={onSliderInfoClick}
            //     />
            //   </div>
            // ))
          }
          </div>
        {/* </div> */}
      </div>
  )
}

export default Settings