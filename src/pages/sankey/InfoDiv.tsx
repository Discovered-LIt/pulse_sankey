import React from "react";
import Slider from "../../components/slider";
import Dropdown from "../../components/Dropdown";

// Types for Props
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

export const calendarDropdownOptions = [
  { label: "Q3 2024", value: "Q3 2024" },
  { label: "Q4 2024", value: "Q4 2024" },
  { label: "Q1 2025", value: "Q1 2025" },
  { label: "Q2 2025", value: "Q2 2025" },
];

const InfoDiv = ({
  eps,
  priceTarget,
  peRatio,
  selectedQuarter,
  setPeRatio,
  onQuarterChange,
}: InfoDivProps) => (
  <div className="bg-black w-full px-8 py-4 top-0 ml-5 mt-2 z-10 text-xs flex justify-between">
    {/* Left side: Quarter Dropdown */}
    <div className="flex gap-2">
      <Dropdown
        value={selectedQuarter}
        options={calendarDropdownOptions}
        onChange={(opt) => onQuarterChange(opt.value)}
      />
    </div>

    {/* Middle: Price Target and EPS */}
    <div className="flex items-center gap-12">
      <div>
        PRICE TARGET <b className="ml-2"> ${Math.ceil(priceTarget)} </b>
      </div>
      <div>
        DILUTED EPS <b className="ml-2"> ${eps.toFixed(3)} </b>
      </div>
    </div>

    {/* Right side: PE Ratio */}
    <div className="flex gap-4">
      <div className="flex gap-2">
        PE RATIO
        <div className="w-[120px]">
          <Slider
            id="pe-ratio"
            label=""
            description=""
            min={0}
            max={1000}
            step={1}
            prefix=""
            value={peRatio}
            onChange={(val: number) => setPeRatio(val)}
            simple={true}
          />
        </div>
      </div>
    </div>
  </div>
);

export default InfoDiv;
