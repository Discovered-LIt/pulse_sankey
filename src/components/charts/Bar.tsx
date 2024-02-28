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
  onZoomChange
}: Props) => {
  const barChartRef = useRef(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    d: BarChartData;
  }>();
  
  const createGraph = () => {
    const width = 500,
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
        data.length < 2 ? 0 : d3.min(data, (d) => d.value),
        d3.max(data, (d) => d.value),
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const handleMouseOver = (e: MouseEvent, d: BarChartData) => {
      let x = e.pageX - 40;
      let y = e.pageY - 40;
      // calculate within the parent container
      if (parentRef?.current) {
        x -= parentRef.current.getBoundingClientRect().left;
        const maxX = parentRef.current.offsetWidth;
        x = Math.min(x, maxX);
        y -= parentRef.current.getBoundingClientRect().top;
      } 
      setTooltip({ x, y, d: d || data[data.length - 1] });
    };
  
    // Bars
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.date))
      .attr("width", x.bandwidth())
      .attr("y", (d) => {
        return d.value >= 0 ? y(d.value) : y(0);
      })
      .attr("height", (d) => Math.abs(y(d.value) - y(0)))
      .style("fill", (chartColour || "steelblue"))
      .on("mouseover", handleMouseOver)
      .on("mouseout", () => setTooltip(undefined));

    if (!chartOverview) {
      // x axis
      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
        .attr("fill", "red")
        .call(
          d3
            .axisBottom(x)
            .tickValues(tickValues)
            .tickFormat((d) => getUTCDate(d, "'Q'Q yy"))
        );
  
      // y axis
      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));
  
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
    createGraph()
  }, [data])

  return(
    <>
      {!chartOverview && <Filters activeZoom={activeZoom} onZoomChange={onZoomChange}/>}
      {!data?.length ? (
        <h2 className="text-center mt-10">No data found.</h2>
      ) : (
        <svg ref={barChartRef} width={500} height={300} />
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
  )
}

export default BarChart;
