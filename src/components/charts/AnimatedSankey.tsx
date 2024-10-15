import React, { useState, useEffect } from "react";
import { sankey, sankeyCenter, sankeyLinkHorizontal } from "d3-sankey";
import { sankeySettings, SankeyCategory } from "../../config/sankey";
import { SankeyData } from "../../pages/sankey";
import { GREY } from "../../config/sankey";

const MARGIN_Y = 25;
const MARGIN_X = 150;
const HEIGHT = 400;

const AnimatedSankey = ({ data }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Trigger animation after a short delay
    const timer = setTimeout(() => setIsVisible(true), 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const sankeyGenerator = sankey()
    .nodeWidth(26)
    .nodePadding(29)
    .extent([
      [MARGIN_X, MARGIN_Y],
      [windowWidth - MARGIN_X, HEIGHT - MARGIN_Y],
    ])
    .nodeId((node) => node.id)
    .nodeAlign(sankeyCenter);

  const { nodes, links } = sankeyGenerator(data);

  const linkPath = sankeyLinkHorizontal();

  return (
    <svg
      width={MARGIN_X + windowWidth}
      height={HEIGHT}
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
      {nodes.map((node, index) => {
        const { nodeFill } = sankeySettings[node.id] || {};
        const { heading, depth } = node;
        const showLeftLabel = depth === 0;
        const showLabel = showLeftLabel || !node.sourceLinks.length;
        const nodeLink = node.sourceLinks.find(
          (link) => link.source.id === node.id
        );
        const value = nodeLink?.displayValue || node.value || 0;
        if (value === 0) return null;

        return (
          <g key={node.index}>
            <rect
              height={node.y1 - node.y0}
              width={sankeyGenerator.nodeWidth()}
              x={node.x0}
              y={node.y0}
              fill={node?.color?.dark || nodeFill || GREY}
              fillOpacity={0.8}
              style={{
                transition: `all 1s ease-in-out ${index * 0.1}s`,
                transform: isVisible ? 'scale(1, 1)' : 'scale(0, 1)',
                transformOrigin: 'left'
              }}
            />
            {showLabel && (
              <foreignObject
                x={showLeftLabel ? node.x0 - 80 : node.x1 + 15}
                y={node.y0 + (node.y1 - node.y0) / 2 - 10}
                width={200}
                height={100}
                style={{
                  transition: `opacity 1s ease-in-out ${index * 0.1 + 0.5}s`,
                  opacity: isVisible ? 1 : 0
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: heading ? "bold" : "normal",
                    textAlign: "left",
                    color: "#fff",
                    whiteSpace: "pre-wrap",
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
      {links.map((link, i) => {
        const path = linkPath(link);
        const isNetProfit = link.target.id === SankeyCategory.NetProfite;

        return (
          <path
            key={i}
            d={path}
            fill="none"
            stroke={sankeySettings[link.target.id]?.linkFill || GREY}
            strokeWidth={Math.abs(link.width)}
            strokeOpacity={isNetProfit ? 0.8 : 1}
            style={{
              filter: isNetProfit ? "url(#glow)" : "none",
              transition: `stroke-dashoffset 1s ease-in-out ${i * 0.05}s`,
              strokeDasharray: link.width,
              strokeDashoffset: isVisible ? 0 : link.width
            }}
          />
        );
      })}
    </svg>
  );
};

export default AnimatedSankey;
