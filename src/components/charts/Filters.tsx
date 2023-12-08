import React from "react";
import cn from "classnames";

interface Props {
  activeZoom: ZoomType;
  onZoomChange?: (activeZoom: ZoomType) => void;
}

export enum ZoomType {
  OneM = "1m",
  ThreeM = "3m",
  SixM = "6m",
  YTD = "YTD",
  OneYear = "1y",
  ALL = "ALL",
}

export const zoomsConfig: { label: ZoomType; val?: number }[] = [
  { label: ZoomType.OneM, val: 1 },
  { label: ZoomType.ThreeM, val: 3 },
  { label: ZoomType.SixM, val: 6 },
  { label: ZoomType.YTD, val: new Date().getMonth() },
  { label: ZoomType.OneYear, val: 12 },
  { label: ZoomType.ALL },
];

const Filters = ({ activeZoom, onZoomChange }: Props) => {
  return(
    <div className="flex justify-end items-center text-[10px]">
    <div className="mr-2 text-gray-400">Zooms</div>
    {zoomsConfig.map(({ label }) => (
      <button
        key={label}
        className={cn([
          "px-2 py-1 mr-2 rounded-sm",
          activeZoom === label ? "bg-green-600" : "bg-[#2d2d2e]",
        ])}
        onClick={() => onZoomChange?.(label)}
      >
        {label}
      </button>
    ))}
  </div>
  )
}

export default Filters;