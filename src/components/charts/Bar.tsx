import React, { useRef, useState, useEffect, RefObject } from "react";
import * as d3 from "d3";
// components
import Filters, { ZoomType } from "./Filters";
// utils
import { getUTCDate } from "../../utils/global";

export type BarChartData = {
  date: string;
  value: number;
};

interface Props {
  chartOverview?: boolean;
  data: BarChartData[];
  chartColour?: string;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  parentRef?: RefObject<HTMLDivElement>;
  dateFormat?: string;
  activeZoom?: ZoomType;
  onZoomChange?: (activeZoom: ZoomType) => void;
}

const BarChart = ({
  data,
  chartOverview = false,
  chartColour,
  parentRef,
  dateFormat,
  activeZoom,
  onZoomChange,
}: Props) => {
  const barChartRef = useRef(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; d: BarChartData } | null>(null);

  const handleMouseOver = (event: MouseEvent, d: BarChartData) => {
    const rect = barChartRef.current?.getBoundingClientRect();
    const x = event.pageX - (rect ? rect.left : 0);
    const y = event.pageY - (rect ? rect.top : 0);
    

    setTooltip({ x, y, d: d || data[data.length - 1] });
  };

  const createGraph = () => {
    const width = 400,
      height = 300,
      margin = { top: 20, right: 20, bottom: 30, left: chartOverview ? 20 : 50 };

    const svg = d3.select(barChartRef.current);
    svg.selectAll("*").remove();

    const numTicks = 7;
    const dataLength = data.length;
    const tickStep = Math.ceil(dataLength / (numTicks - 1));

    const tickValues = Array.from({ length: numTicks }, (_, i) => {
      const index = Math.min(i * tickStep, dataLength - 1);
      return data?.[index]?.date;
    });

    const x = d3
      .scaleBand()
      .range([0, width - margin.left - margin.right])
      .domain(data.map((d) => d.date))
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([
        0, // Start Y-axis at 0 for positive values
        d3.max(data, (d) => d.value) || 1 // Max value or fallback to 1 if no data
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const latestDataPoint = data[data.length - 1];

    // Bars with rounded tops and square bottoms using a path
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("path")
      .attr("d", (d) => {
        const xPos = x(d.date);
        const barHeight = Math.abs(y(d.value) - y(0));
        const barTop = y(d.value);
        const barWidth = x.bandwidth();
        const radius = Math.min(10, barWidth / 2);  // Adjust radius to avoid excess curvature

        // Create a custom path with rounded top and square bottom
        return `M${xPos},${barTop + radius}
                a${radius},${radius} 0 0 1 ${radius},-${radius}
                h${barWidth - 2 * radius}
                a${radius},${radius} 0 0 1 ${radius},${radius}
                v${barHeight - radius}
                h-${barWidth}
                z`;
      })
      .style("fill", (d) => (d === latestDataPoint ? (chartColour || "steelblue") : "#888"))
      .on("mouseover", handleMouseOver)
      .on("mouseout", () => setTooltip(undefined));

    if (!chartOverview) {
      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
        .call(
          d3
            .axisBottom(x)
            .tickValues(tickValues)
            .tickFormat((d) => getUTCDate(d, "'Q'Q yy"))
        );

      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

      svg.selectAll(".domain").remove();
      svg.selectAll(".tick line").remove();
    }

    svg
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  };
    
  useEffect(() => {
    if (!data?.length) return;
    createGraph();
  }, [data]);

  return (
    <>
      {!chartOverview && <Filters activeZoom={activeZoom} onZoomChange={onZoomChange}/>}
      {!data?.length ? (
        <h2 className="text-center mt-10">No data found.</h2>
      ) : (
        <svg ref={barChartRef} width={400} height={300} />
      )}
      {tooltip && (
        <div
          className="bg-zinc-200 text-black px-4 py-2 rounded absolute text-[12px]"
          style={{ left: `${tooltip?.x}px`, top: `${tooltip?.y}px` }}
        >
          <b className="mr-2">
            {getUTCDate(tooltip.d.date, (dateFormat || "'Q'Q yyyy"))}:
          </b>
          {tooltip?.d?.value}
        </div>
      )}
    </>
  );
};

export default BarChart;
