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
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  chartOverview?: boolean;
  activeZoom?: ZoomType;
  isLoading?: boolean;
  parentRef?: RefObject<HTMLDivElement>;
  prefix?: string;
  timelineFilter?: { startDate: Date; endDate: Date };
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

  const createGraph = () => {
    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: chartOverview ? 20 : 50 };

    const svg = d3.select(lineChartRef.current);
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
      .curve(d3.curveCardinal);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", chartColour || LIGHT_GREEN)
      .attr("stroke-width", 2)
      .attr("d", line);

    if (!chartOverview) {
      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(
          d3.axisBottom(x).tickValues(tickValues).tickFormat((d) => getUTCDate(d, "'Q'Q yy"))
        );
      svg.selectAll(".domain").remove();
      svg.selectAll(".tick line").remove();
    }

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
    createGraph();
  }, [data, category]);

  return (
    <>
      {!chartOverview && <Filters activeZoom={activeZoom} onZoomChange={onZoomChange} />}
      {!data?.length ? (
        <h2 className="text-center mt-10">No data found.</h2>
      ) : (
        <>
          <svg ref={lineChartRef} width={500} height={300} />
        </>
      )}
    </>
  );
};

export default LineChart;
