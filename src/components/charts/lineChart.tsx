import React, { useEffect, useRef, useState, RefObject } from "react";
import * as d3 from 'd3';
import cn from 'classnames';
import { format } from 'date-fns';
import { LIGHT_GREEN } from "../../config/sankey";

export type LineChartData = {
  x: string;
  y: string;
  date: Date,
  value: number
}

interface Props {
  data: LineChartData[];
  category: string;
  activeZoom?: string;
  parentRef?: RefObject<HTMLDivElement>;
  onZoomChange?: (type: ZoomType) => void;
}

export enum ZoomType {
  OneM = '1m',
  ThreeM = '3m',
  SixM = '6m',
  YTD = 'YTD',
  OneYear = '1y',
  ALL = 'ALL'
}

export const zoomsConfig: { label: ZoomType, val?: number}[] = [
  { label: ZoomType.OneM, val: 1 },
  { label: ZoomType.ThreeM, val: 3 },
  { label: ZoomType.SixM, val: 6 },
  { label: ZoomType.YTD, val: new Date().getMonth() },
  { label: ZoomType.OneYear, val: 12 },
  { label: ZoomType.ALL },
]

const LineChart = ({
  data,
  category,
  activeZoom = ZoomType.ALL,
  parentRef,
  onZoomChange
}: Props) => {
  const lineChartRef = useRef(null);
  const [tooltip, setTooltip] = useState<{x: number, y: number, d: LineChartData}>()

  const createGraph = () => {
    const svg = d3.select(lineChartRef.current);
    svg.selectAll("*").remove();

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    const numTicks = 7; // Number of desired ticks
    const dataLength = data.length;
    const tickStep = Math.ceil(dataLength / (numTicks - 1));

    const tickValues = Array.from({ length: numTicks }, (_, i) => {
      const index = Math.min(i * tickStep, dataLength - 1); // Ensure not to go beyond the last data point
      return data[index].x;
    });

    const x = d3
      .scaleBand()
      // .scaleTime()
      // .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .domain(data.map((d) => d.x))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) as number])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line<LineChartData>()
      // .x((d) => x(new Date(d.date)) || 0)
      .x((d) => x(d.x) || 0)
      .y((d) => y(d.value));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", LIGHT_GREEN)
      .attr("stroke-width", 2)
      .attr("d", line);

    const handleMouseOver = (e: MouseEvent, d: LineChartData) => {
      let x = e.pageX;
      let y = e.pageY;
      // calculate within the parent container
      if(parentRef.current) {
        x -= (parentRef.current.getBoundingClientRect().left + 40)
        const maxX = parentRef.current.offsetWidth;
        x = Math.min(x, maxX);
        y -= (parentRef.current.getBoundingClientRect().top + 40);
      }
      setTooltip({ x, y, d: d || data[data.length - 1]})
    }

    // Handle mouseout event to hide tooltip
    const handleMouseOut = () => {
      setTooltip(undefined)
    }

    // Append circles to the circle group
    svg.append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.x) || 0)
      .attr("cy", (d) => y(d.value))
      .attr("r", 3)
      .attr("fill", LIGHT_GREEN)
      .attr("cursor", 'pointer')
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)

    svg
      .append("circle")
      .attr("cx", x(data[data.length - 1].x) || 0)
      .attr("cx", x(data[data.length - 1].x) || 0)
      .attr("cy", y(data[data.length - 1].value))
      .attr("r", 7)
      .attr("fill", LIGHT_GREEN)
      .attr('opacity', 0.4)
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)

    svg
      .append("circle")
      .attr("cx", x(data[data.length - 1].x) || 0)
      .attr("cx", x(data[data.length - 1].x) || 0)
      .attr("cy", y(data[data.length - 1].value))
      .attr("r", 4)
      .attr("fill", LIGHT_GREEN)
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues(tickValues))

    // Add y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat((d) => `${d}B`));
    
    svg.selectAll(".domain").remove();
    svg.selectAll(".tick line").remove();
  }

  useEffect(() => {
    if(!data?.length) return;
    createGraph()
  }, [data, category])

  return(
    <>
      <div className="flex justify-end items-center text-[10px]">
        <div className="mr-2 text-gray-400">Zooms</div>
        {
          zoomsConfig.map(({ label }) => (
            <button
              key={label}
              className={cn([
                "px-2 py-1 mr-2 rounded-sm",
                activeZoom === label ? 'bg-green-600' : 'bg-[#2d2d2e]'
              ])}
              onClick={() => onZoomChange?.(label)}
            >{label}
            </button>
          ))
        }
      </div>
      {
        !data?.length ? 
          <h2 className="text-center mt-10">No data found.</h2> 
        :
          <>
            <svg ref={lineChartRef} width={1000} height={300}></svg>
            {tooltip && <div
              className="bg-black px-4 py-2 rounded absolute text-[12px]"
              style={{ left: `${tooltip?.x}px`, top: `${tooltip?.y}px` }}
            >
              <b className="mr-2">{format(tooltip.d.date, "'Q'Q yyyy")}:</b>
              {tooltip?.d?.y || tooltip?.d?.value}
            </div>}
          </>
      }
    </>
  )
}

export default LineChart;
