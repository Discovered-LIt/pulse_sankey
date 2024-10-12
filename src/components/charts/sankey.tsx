import React, { useState, useEffect } from "react";
import { sankey, sankeyCenter, sankeyLinkHorizontal } from "d3-sankey";
// types
import { sankeySettings, SankeyCategory } from "../../config/sankey";
import { SankeyData } from "../../pages/sankey";
// constant
import { GREY, GREEN } from "../../config/sankey";

const MARGIN_Y = 25;
const MARGIN_X = 150;
const HEIGHT = 400;

interface Sankey {
  data: SankeyData;
}

const Sankey = ({ data }: Sankey) => {
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

  // Draw the nodes
  const allNodes = nodes.map((node: any) => {
    const { nodeFill } = sankeySettings[node.id as SankeyCategory] || {};
    const { heading, depth } = node;
    const showLeftLabel = depth === 0;
    const showLabel = showLeftLabel || !node.sourceLinks.length;
    // Define the transform origin for the rotation
    let transformOriginX =
      node.x0 + (node.x1 - node.x0) / 2 + (showLeftLabel ? -40 : +50) || 1;
    let transformOriginY = node.y0 + (node.y1 - node.y0) / 2;

    if (isMobile) {
      let isOverlap = false;
      for (const otherNode of nodes) {
        if (node !== otherNode) {
          if (
            transformOriginX + 100 > otherNode.x0 && // Right edge of the foreignObject
            transformOriginX < otherNode.x1 && // Left edge of the other node
            transformOriginY < otherNode.y1 &&
            transformOriginY + 100 > otherNode.y0
          ) {
            isOverlap = true;
            break;
          }
        }
      }
      if (isOverlap) {
        transformOriginX += Math.min(transformOriginX, node.x0 - 110); // Move it to the right (adjust as needed)
        transformOriginY += 40; // Move it down (adjust as needed)
      }
    }

    const nodeLink = node.sourceLinks.find(
      (link: any) => link.source.id === node.id,
    );
    const value = nodeLink?.displayValue || node.value || 0;
    const transform = isMobile
      ? `rotate(90 ${transformOriginX} ${transformOriginY})`
      : "";
    if (value === 0) return null;

    return (
      <g key={node.index}>
        <rect
          height={node.y1 - node.y0 || Math.abs(nodeLink?.width)}
          width={sankeyGenerator.nodeWidth()}
          x={node.x0 || 0}
          y={node.y0 + (value < 0 ? nodeLink?.width : 0) || 0}
          stroke="none"
          fill={node?.color?.dark || nodeFill || GREY}
          fillOpacity={0.8}
          strokeLinecap="round"
        />
        {showLabel && (
          <g transform={transform} className="label">
            <foreignObject
              x={
                (showLeftLabel
                  ? node.x0 + (node.x1 - node.x0) / 2 - 80
                  : node.x1 + 15) || 0
              }
              y={node.y0 + (node.y1 - node.y0) / 2 - 10}
              width={isMobile ? 90 : 200}
              height={100}
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
          </g>
        )}
      </g>
    );
  });

  // Animate the links sequentially
  const allLinks = links.map((link: any, i) => {
    const linkGenerator = sankeyLinkHorizontal();
    const path = linkGenerator(link);
    const { linkFill } = sankeySettings[link?.target?.id as SankeyCategory] || {
      linkFill: "",
    };
    const { layer, color } = link?.source;

    // Set animation delay based on the category
    let animationDelay = 0;
    if (link.source.id.includes('Revenue')) {
      animationDelay = 0; // Revenues flow first
    } else if (link.source.id.includes('Cost')) {
      animationDelay = 1000; // Costs flow after revenues
    } else if (link.source.id.includes('Profit') || link.source.id.includes('Expenses')) {
      animationDelay = 2000; // Profits and Expenses flow after Costs
    }

    // Adding special effect for Net Profit
    const isNetProfit = link.target.id === 'Net Profit';

    return (
      <svg key={i}>
        <path
          id={`path-${i}`}
          d={path}
          stroke={color?.lite || linkFill}
          fill="none"
          strokeOpacity={isNetProfit ? 0.8 : 1} // Make Net Profit glow
          strokeWidth={0} // Start with strokeWidth 0 for animation
          filter={isNetProfit ? "url(#glow)" : ""} // Glow effect for Net Profit
        >
          <animate
            attributeName="stroke-width"
            from="0"
            to={Math.abs(link.width)}
            dur="1s"
            begin={`${animationDelay}ms`} // Apply delay for each category
            fill="freeze"
          />
        </path>

        {isNetProfit && (
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        )}

        {layer !== 0 && !!link.target.sourceLinks.length && (
          <text>
            <textPath
              xlinkHref={`#path-${i}`}
              startOffset="50%"
              textAnchor="middle"
              fontSize={isMobile ? 10 : 12}
              fill="white"
            >
              {link.target.id}
            </textPath>
          </text>
        )}
      </svg>
    );
  });

  return (
    <div className={`${isMobile ? "mobile-view" : ""}`}>
      <svg
        width={MARGIN_X + windowWidth}
        height={isMobile ? 350 : HEIGHT}
        viewBox={`0 0 ${MARGIN_X + windowWidth} ${HEIGHT}`}
        className="m-auto"
      >
        {allLinks}
        {allNodes}
      </svg>
    </div>
  );
};

export default Sankey;
