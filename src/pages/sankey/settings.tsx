import React, { useState, useMemo } from "react";
import cn from "classnames";
// components
import Slider from "../../components/slider";
import { SliderType, Prefix } from "../../config/sankey";
import Dropdown from "../../components/Dropdown";
// icons
import ChevronDoubleUpIcon from "@heroicons/react/24/solid/ChevronDoubleUpIcon";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDoubleDownIcon";
import MinusIcon from "@heroicons/react/24/solid/MinusIcon";
import ChevronUpIcon from "@heroicons/react/24/solid/ChevronUpIcon";
import CalendarIcon from "@heroicons/react/24/solid/CalendarIcon";
import GetStartedModal from "./getStartedModal";
// types
import {
  SliderSettings,
  SliderCategory,
  SliderGroups,
  SliderGroupType,
} from "../../config/sankey";
import { SliderData } from ".";

interface Setting {
  sliderData: SliderData;
  defaultSliderData: SliderData;
  eps: number;
  priceTarget: number;
  peRatio: number;
  selectedQuarter: string;
  setPeRatio: (peRatio: number) => void;
  onChange: (type: SliderCategory, val: number) => void;
  onSliderInfoClick: (string: SliderCategory) => void;
  onSaveClick: () => void;
  onQuarterChange: (val: string) => void;
}

type InfoDivProps = {
  isExpanded: boolean;
  eps: number;
  priceTarget: number;
  peRatio: number;
  selectedQuarter: string;
  setPeRatio: (peRatio: number) => void;
  onExpandClick: () => void;
  onSaveClick: () => void;
  onQuarterChange: (val: string) => void;
};

const SaveBtn = ({
  isExpanded,
  onExpandClick,
  onSaveClick,
  className,
}: any) => (
  <div className={cn("flex z-10", className)}>
    <button
      className="bg-transparent text-white py-1 px-2 text-xs border border-gray-500 rounded"
      onClick={onSaveClick}
    >
      SAVE
    </button>
    <GetStartedModal />
    <ChevronUpIcon
      className={cn(["h-6 w-6 transition-transform duration-500 z-20"], {
        "rotate-180": !isExpanded,
      })}
      onClick={onExpandClick}
    />
  </div>
);

export const calendarDropdownOptions = [
  { label: "Q3 2024", value: "Q3 2024"},
  { label: "Q4 2024", value: "Q4 2024"},
  { label: "Q1 2025", value: "Q1 2025"},
  { label: "Q2 2025", value: "Q2 2025"},
]

const InfoDiv = ({
  isExpanded,
  eps,
  priceTarget,
  peRatio,
  selectedQuarter,
  setPeRatio,
  onExpandClick,
  onSaveClick,
  onQuarterChange,
}: InfoDivProps) => (
  <div
    className="bg-black w-full px-8 py-4 top-0 z-10 text-xs shadow-md shadow-slate-600/50 flex items-center justify-between"
  >
    {/* Left side with dropdown */}
    <div className="flex items-center gap-2">
      <Dropdown
        value={selectedQuarter}
        options={calendarDropdownOptions}
        icon={<CalendarIcon className="h-4 w-4 mr-1" />}
        onChange={(opt) => onQuarterChange(opt.value)}
      />
    </div>

    {/* Middle with Price Target and EPS */}
    <div className="flex items-center gap-12">
      <div>
        PRICE TARGET <b className="ml-2"> ${Math.ceil(priceTarget)} </b>
      </div>
      <div>
        DILUTED EPS <b className="ml-2"> ${eps.toFixed(3)} </b>
      </div>
    </div>

    {/* Right side with PE ratio and save button */}
    <div className="flex items-center gap-4">
      <div className="flex gap-2 items-center">
        PE RATIO
        <div className="w-[120px]">
          <Slider
            id={"pe-ratio"}
            label=""
            description=""
            min={0}
            max={1000}
            step={1}
            prefix=""
            value={peRatio}
            type={SliderType.Positive}
            onChange={(val: number) => setPeRatio(val)}
            simple={true}
          />
        </div>
      </div>
      <SaveBtn
        isExpanded={isExpanded}
        onExpandClick={onExpandClick}
        onSaveClick={onSaveClick}
      />
     </div> 
   </div>
);

const Settings = ({
  sliderData,
  defaultSliderData,
  eps,
  priceTarget,
  peRatio,
  selectedQuarter,
  setPeRatio,
  onChange,
  onSliderInfoClick,
  onSaveClick,
  onQuarterChange,
}: Setting) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const calculateChangePercentage = (
    currVal: number,
    prevVal: number,
    prefix: string,
  ): number => {
    if (prevVal + currVal === 0) return 0;
    if (prevVal === 0) return 100;
    if (prefix === Prefix.Percentage) {
      return Math.ceil(currVal - prevVal);
    }
    return Math.ceil(((currVal - prevVal) / prevVal) * 100);
  };

  const getSliderViewSettings = (type: SliderCategory) => {
    const percentage = calculateChangePercentage(
      sliderData[type],
      defaultSliderData[type],
      SliderSettings[type].prefix,
    );
    const base = percentage === 0;
    const isPositive = SliderSettings[type].type === SliderType.Positive;
    const primary = base
      ? "text-gray-500"
      : isPositive
      ? "text-green-500"
      : "text-red-500";
    const secondary = isPositive ? "text-red-500" : "text-green-500";
    let Icon = MinusIcon;
    let newSliderType = null;
    if (!base) {
      if (isPositive) {
        Icon = percentage > 0 ? ChevronDoubleUpIcon : ChevronDownIcon;
        newSliderType =
          percentage > 0 ? SliderType.Positive : SliderType.Negative;
      } else {
        Icon = percentage > 0 ? ChevronDownIcon : ChevronDoubleUpIcon;
        newSliderType =
          percentage > 0 ? SliderType.Negative : SliderType.Positive;
      }
    }
    return {
      primary,
      secondary,
      newSliderType,
      Icon,
      percentage,
    };
  };

  const dynamicSettings = useMemo(() => {
    return Object.keys(SliderSettings).reduce(
      (obj: any, type: SliderCategory) => {
        obj[type] = getSliderViewSettings(type);
        return obj;
      },
      {},
    );
  }, [sliderData]);

  const getDescription = (type: SliderCategory) => {
    const { primary, secondary, percentage, Icon } = dynamicSettings[type];
    return (
      <div className="flex items-center gap-1">
        <Icon
          className={cn([
            "h-4 w-6 -ml-2",
            {
              [primary]: percentage >= 0,
              [secondary]: percentage < 0,
            },
          ])}
        />
        <p className="text-[10px] font-light uppercase italic">
          {`${percentage}% since Q2 2024`}
        </p>
      </div>
    );
  };


  const onExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full bg-black overflow-auto">
      <div
        id="slider-container"
        className="overflow-auto block w-full top-30 bg-black"
      >
        {Object.keys(SliderGroups).map((group: SliderGroupType, idx) => (
          <div key={`${group}-${idx}`}>
            <div className="bg-[#1d1f23] py-2 px-8 sticky top-0 w-full uppercase text-[12px]">
              {group}
            </div>
            <div className="grid gap-10 grid-cols-1 py-6">
              {SliderGroups[group].map((type) => (
                <div
                  className="w-[300px] mb-2 m-auto"
                  key={`${type}-${group}-${idx}`}
                >
                  <Slider
                    id={type}
                    label={SliderSettings[type].label}
                    description={getDescription(type)}
                    min={SliderSettings[type].min}
                    max={SliderSettings[type].max}
                    step={SliderSettings[type].step}
                    prefix={SliderSettings[type].prefix}
                    value={sliderData[type] || 0}
                    type={
                      dynamicSettings?.[type]?.newSliderType ||
                      SliderSettings[type].type
                    }
                    onChange={(val: number) => onChange(type, val)}
                    onInfoClick={onSliderInfoClick}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div
          className="hidden sm:flex bg-white text-black rounded-lg w-6 h-2 sticky bottom-0 justify-center items-center m-auto cursor-ns-resize"
        >
          <div className="w-[15px] h-[2px] bg-black" />
        </div>
      </div>
    </div>
  );
};

export default Settings;
