import React, { useState, useEffect } from "react";
import { sankey, sankeyCenter, sankeyLinkHorizontal } from "d3-sankey";
import { sankeySettings, SankeyCategory } from "../../config/sankey";
import { SankeyData } from "../../pages/sankey";
import { GREY } from "../../config/sankey";

const MARGIN_Y = 25;
const MARGIN_X = 150;
const HEIGHT = 400;

interface SankeyProps {
  data: SankeyData;
}

const Sankey: React.FC<SankeyProps> = ({ data }) => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = windowWidth <= 680;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Trigger animation after component mount
    setIsVisible(true);
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

  const { nodes, links } = sankeyGenerator(data as any);

  const linkPath = sankeyLinkHorizontal();

  return (
    <svg
      width={MARGIN_X + windowWidth}
      height={isMobile ? 350 : HEIGHT}
      viewBox={`0 0 ${MARGIN_X + windowWidth} ${HEIGHT}`}
      className="m-auto"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {nodes.map((node: any) => {
        const { nodeFill } = sankeySettings[node.id as SankeyCategory] || {};
        const { heading, depth } = node;
        const showLeftLabel = depth === 0;
        const showLabel = showLeftLabel || !node.sourceLinks.length;
        const nodeLink = node.sourceLinks.find(
          (link: any) => link.source.id === node.id,
        );
        const value = nodeLink?.displayValue || node.value || 0;
        if (value === 0) return null;

        return (
          <g key={node.index}>
            <rect
              height={node.y1 - node.y0 || Math.abs(nodeLink?.width)}
              width={sankeyGenerator.nodeWidth()}
              x={node.x0 || 0}
              y={node.y0 + (value < 0 ? nodeLink?.width : 0) || 0}
              fill={node?.color?.dark || nodeFill || GREY}
              fillOpacity={0.8}
              style={{
                transition: "all 1s ease-out",
                transform: isVisible ? "scaleY(1)" : "scaleY(0)",
                transformOrigin: "bottom",
              }}
            />
            {showLabel && (
              <foreignObject
                x={(showLeftLabel ? node.x0 + (node.x1 - node.x0) / 2 - 80 : node.x1 + 15) || 0}
                y={node.y0 + (node.y1 - node.y0) / 2 - 10}
                width={isMobile ? 90 : 200}
                height={100}
                style={{
                  transition: "opacity 1s ease-out",
                  opacity: isVisible ? 1 : 0,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: heading ? "bold" : "normal",
                    textAlign: "left",
                    color: "#fff",
                    whiteSpace: "pre-wrap",
                    width: isMobile && !showLeftLabel ? "20px" : "fit-content",
                    lineHeight: "1.2em",
                  }}
                >
                  {node.id}
                  <br />
                  {`$${value.toFixed(3)} BN`}
                </div>
              </foreignObject>
            )}
          </g>
        );
      })}
      {links.map((link: any, i: number) => {
        const path = linkPath(link);
        const isNetProfit = link.target.id === SankeyCategory.NetProfite;

        return (
          <path
            key={i}
            d={path}
            fill="none"
            stroke={sankeySettings[link.target.id as SankeyCategory]?.linkFill || GREY}
            strokeWidth={Math.abs(link.width)}
            strokeOpacity={isNetProfit ? 0.8 : 1}
            style={{
              transition: "stroke-dashoffset 1s ease-out",
              strokeDasharray: isVisible ? "none" : "1000",
              strokeDashoffset: isVisible ? "0" : "1000",
              filter: isNetProfit ? "url(#glow)" : "none",
            }}
          />
        );
      })}
    </svg>
  );
};

export default Sankey;
