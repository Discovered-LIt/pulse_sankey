import React, { useEffect, useRef, useState } from "react";
import { sankey, sankeyCenter, sankeyLinkHorizontal } from "d3-sankey";
import * as d3 from "d3";
import { SankeyCategory, sankeySettings, GREY } from "../../config/sankey";

const MARGIN_Y = 25;
const MARGIN_X = 150;
const HEIGHT = 400;

export type SankeyData = {
  nodes: { id: string; heading?: boolean; value?: number }[];
  links: { source: string; target: string; value: number; displayValue?: number }[];
};

const SankeyChart = ({ data }: { data: SankeyData }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const isMobile = windowWidth <= 680;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sankeyGenerator = sankey()
    .nodeWidth(26)
    .nodePadding(29)
    .extent([
      [MARGIN_X, MARGIN_Y],
      [windowWidth - MARGIN_X, HEIGHT - MARGIN_Y],
    ])
    .nodeId((node: any) => node.id)
    .nodeAlign(sankeyCenter);

  const { nodes, links } = sankeyGenerator(data);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Add filter for glow effect
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "glow");
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "3.5")
      .attr("result", "coloredBlur");
    filter.append("feMerge")
      .selectAll("feMergeNode")
      .data(["coloredBlur", "SourceGraphic"])
      .enter().append("feMergeNode")
      .attr("in", d => d);

    // Animate nodes
    nodes.forEach((node: any) => {
      const { nodeFill } = sankeySettings[node.id as SankeyCategory] || {};
      const rect = svg.append("rect")
        .attr("x", node.x0)
        .attr("y", node.y0)
        .attr("height", 0)
        .attr("width", sankeyGenerator.nodeWidth())
        .attr("fill", node?.color?.dark || nodeFill || GREY)
        .attr("stroke", "none")
        .attr("fill-opacity", 0.8);

      rect.transition()
        .duration(1000)
        .attr("height", node.y1 - node.y0);

      // Add labels
      if (node.heading || !node.sourceLinks.length) {
        const foreignObject = svg.append("foreignObject")
          .attr("x", node.x0 + (node.x1 - node.x0) / 2 - 40)
          .attr("y", node.y0 + (node.y1 - node.y0) / 2 - 10)
          .attr("width", 200)
          .attr("height", 100)
          .style("opacity", 0);

        foreignObject.append("xhtml:div")
          .style("font-size", "12px")
          .style("color", "#fff")
          .html(`${node.id}<br>$${node.value?.toFixed(3)} BN`);

        foreignObject.transition()
          .duration(1000)
          .style("opacity", 1);
      }
    });

    // Animate links
    links.forEach((link: any, i: number) => {
      const linkGenerator = sankeyLinkHorizontal();
      const path = linkGenerator(link);

      const linkElement = svg.append("path")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", sankeySettings[link.target.id as SankeyCategory]?.linkFill || GREY)
        .attr("stroke-width", 0)
        .attr("stroke-opacity", link.target.id === SankeyCategory.NetProfite ? 0.8 : 1);

      if (link.target.id === SankeyCategory.NetProfite) {
        linkElement.style("filter", "url(#glow)");
      }

      linkElement.transition()
        .delay(i * 50)
        .duration(1000)
        .attr("stroke-width", Math.abs(link.width));
    });

  }, [data, windowWidth]);

  return (
    <svg
      ref={svgRef}
      width={MARGIN_X + windowWidth}
      height={isMobile ? 350 : HEIGHT}
      viewBox={`0 0 ${MARGIN_X + windowWidth} ${HEIGHT}`}
      className="m-auto"
    />
  );
};

export default SankeyChart;
