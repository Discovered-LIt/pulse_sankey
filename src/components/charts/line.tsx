import React, { useEffect, useRef, useState, RefObject, useMemo } from "react";
import * as d3 from "d3";
// utils
import { LIGHT_GREEN } from "../../config/sankey";
import { getUTCDate } from "../../utils/global";
// components
import TimelineRangeSlider from "../../components/rangeSlider";
import Filters, { ZoomType } from "./Filters";

export type LineChartData = {
  date: string;
  value: number;
};

interface Props {
  data: LineChartData[];
  timeLineData: LineChartData[];
  category: string;
  activeZoom?: ZoomType;
  isLoading?: boolean;
  parentRef?: RefObject<HTMLDivElement>;
  prefix?: string;
  timelineFilter?: { startDate: Date; endDate: Date };
  chartOverview?: boolean;
  chartColour?: string;
  dateFormat?: string;
  onTimelineFilterChange?: (startDate: Date, endDate: Date) => void;
  onZoomChange?: (type: ZoomType) => void;
}

type CreateGraphProps = {
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  pathOnly?: boolean;
  ref: React.MutableRefObject<any>;
  data: LineChartData[];
};

const LineChart = ({
  data,
  timeLineData,
  category,
  activeZoom = ZoomType.ALL,
  parentRef,
  prefix = "",
  isLoading = false,
  timelineFilter,
  chartOverview = false,
  chartColour,
  dateFormat,
  onTimelineFilterChange,
  onZoomChange,
}: Props) => {
  const lineChartRef = useRef(null);
  const sublinePathChartRef = useRef(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    d: LineChartData;
  }>();

  const createGraph = ({
  width = 500,
  height = 300,
  margin = { top: 20, right: 20, bottom: 30, left: chartOverview ? 20 : 50 },
  ref,
  pathOnly = false,
  data,
}: CreateGraphProps) => {
  const svg = d3.select(ref.current);
  svg.selectAll("*").remove();

  const numTicks = 7; // Number of desired ticks
  const dataLength = data.length;
  const tickStep = Math.ceil(dataLength / (numTicks - 1));

  const tickValues = Array.from({ length: numTicks }, (_, i) => {
    const index = Math.min(i * tickStep, dataLength - 1); // Ensure not to go beyond the last data point
    return data?.[index]?.date;
  });

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.date))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const line = d3
    .line<LineChartData>()
    .x((d) => x(d.date) || 0)
    .y((d) => y(d.value))
    .curve(d3.curveCardinal); // Add cardinal curve

  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", chartColour || LIGHT_GREEN)
    .attr("stroke-width", 2)
    .attr("d", line);

  // Add x-axis
  if (!chartOverview) {
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3.axisBottom(x).tickValues(tickValues).tickFormat((d) => getUTCDate(d, !pathOnly ? "'Q'Q yy" : "yyyy"))
      );

    svg.selectAll(".domain").remove();
    svg.selectAll(".tick line").remove();
  }

  if (pathOnly) return;

  const handleMouseOver = (e: MouseEvent, d: LineChartData) => {
    let x = e.pageX - 40;
    let y = e.pageY - 40;
    if (parentRef?.current) {
      x -= parentRef.current.getBoundingClientRect().left;
      const maxX = parentRef.current.offsetWidth;
      x = Math.min(x, maxX);
      y -= parentRef.current.getBoundingClientRect().top;
    }
    setTooltip({ x, y, d: d || data[data.length - 1] });
  };

  const handleMouseOut = () => {
    setTooltip(undefined);
  };

  // Append circles to the circle group
  svg
    .append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.date) || 0)
    .attr("cy", (d) => y(d.value))
    .attr("r", 3)
    .attr("fill", chartColour || LIGHT_GREEN)
    .attr("cursor", "pointer")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  svg
    .append("circle")
    .attr("cx", x(data[data.length - 1].date) || 0)
    .attr("cx", x(data[data.length - 1].date) || 0)
    .attr("cy", y(data[data.length - 1].value))
    .attr("r", 7)
    .attr("fill", chartColour || LIGHT_GREEN)
    .attr("opacity", 0.4)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  svg
    .append("circle")
    .attr("cx", x(data[data.length - 1].date) || 0)
    .attr("cx", x(data[data.length - 1].date) || 0)
    .attr("cy", y(data[data.length - 1].value))
    .attr("r", 4)
    .attr("fill", chartColour || LIGHT_GREEN)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  // Add y-axis
  if (!chartOverview) {
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat((d) => `${d}${prefix}`));

    svg.selectAll(".domain").remove();
    svg.selectAll(".tick line").remove();
  }

  svg
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
};

  useEffect(() => {
    if (!data?.length) return;
    createGraph({ ref: lineChartRef, data });
    createGraph({
      ref: sublinePathChartRef,
      pathOnly: true,
      width: 500,
      height: 60,
      margin: { top: 10, right: 10, bottom: 10, left: 20 },
      data: timeLineData,
    });
  }, [data, category]);

  if (isLoading) return <p className="text-center">Loading....</p>;

  return (
    <>
      {!chartOverview && <Filters activeZoom={activeZoom} onZoomChange={onZoomChange}/>}
      {!data?.length ? (
        <h2 className="text-center mt-10">No data found.</h2>
      ) : (
        <>
          <svg ref={lineChartRef} width={500} height={300} />
          {timelineFilter && !chartOverview && <TimelineRangeSlider
            onChange={onTimelineFilterChange}
            dateRange={timelineFilter}
          >
            <div className="h-[80px]">
              <svg ref={sublinePathChartRef} width={500} height={80} />
            </div>
          </TimelineRangeSlider>}
          {tooltip && (
            <div
              className="bg-zinc-200 text-black px-4 py-2 rounded absolute text-[12px]"
              style={{ left: ${tooltip?.x}px, top: ${tooltip?.y}px }}
            >
              <b className="mr-2">
                {getUTCDate(tooltip.d.date, (dateFormat || "'Q'Q yyyy"))}:
              </b>
              {tooltip?.d?.value}
              {prefix}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default LineChart;
