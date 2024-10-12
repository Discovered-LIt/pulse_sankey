import React, { useEffect, useRef } from "react";
import { sankey, sankeyCenter, sankeyLinkHorizontal } from "d3-sankey";
import * as d3 from "d3";
import { sankeySettings, SankeyCategory } from "../../config/sankey";
import { SankeyData } from "../../pages/sankey";
import { GREY } from "../../config/sankey";

const MARGIN_Y = 25;
const MARGIN_X = 150;
const HEIGHT = 400;

interface Sankey {
  data: SankeyData;
}

const Sankey = ({ data }: Sankey) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const isMobile = window.innerWidth <= 680;

  useEffect(() => {
    windowresizeHandler();
    window.addEventListener("resize", windowresizeHandler);
    return () => window.removeEventListener("resize", windowresizeHandler);
  }, []);

  const windowresizeHandler = () => {
    const width = window.innerWidth <= 680 ? 800 : window.innerWidth;
    setWindowWidth(width);
  };

  // Set the sankey diagram properties
  const sankeyGenerator = sankey()
    .nodeWidth(26)
    .nodePadding(29)
    .extent([
      [MARGIN_X, MARGIN_Y],
      [windowWidth - MARGIN_X, HEIGHT - MARGIN_Y],
    ])
    .nodeId((node: any) => node.id)
    .nodeAlign(sankeyCenter);

  // Compute nodes and links positions
  const { nodes, links } = sankeyGenerator(data as any);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Clear previous content
    svg.selectAll("*").remove();

    // Add filter for glow effect
    svg.append("defs")
      .append("filter")
      .attr("id", "glow")
      .append("feGaussianBlur")
      .attr("stdDeviation", "3.5")
      .attr("result", "coloredBlur");

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

      // Add labels (similar to your existing code)
      // ...
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
        .delay(i * 50)  // Stagger the animations
        .duration(1000)
        .attr("stroke-width", Math.abs(link.width));
    });

  }, [data, windowWidth]);

  return (
    <div className={`${isMobile ? "mobile-view" : ""}`}>
      <svg
        ref={svgRef}
        width={MARGIN_X + windowWidth}
        height={isMobile ? 350 : HEIGHT}
        viewBox={`0 0 ${MARGIN_X + windowWidth} ${HEIGHT}`}
        className="m-auto"
      />
    </div>
  );
};

export default Sankey;
