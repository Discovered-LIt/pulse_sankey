import React, { useState, useEffect } from "react";
import { sankey, sankeyCenter, sankeyLinkHorizontal } from "d3-sankey";
// types
import { sankeySettings, SankeyCategory } from "../../../config/sankey";
import { SankeyData } from "../../../pages/home";
// constant
import { GREY } from "../../../config/sankey";

const MARGIN_Y = 25;
const MARGIN_X = 150;
const HEIGHT = 400

interface Sankey {
  data: SankeyData
}

const Sankey = ({ data }: Sankey) => {
  const [hoveredNode, setHoveredNode] = useState<string>('')
  const [windowWidth, setWindowWidth] = useState<number>()

  useEffect(() => {
    windowresizeHandler()
    window.addEventListener('resize', windowresizeHandler);
    return () => window.removeEventListener('resize', windowresizeHandler);
  }, [])

  const windowresizeHandler = () => {
    setWindowWidth(window.innerWidth)
  }

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
    const { nodeFill, showVal } = sankeySettings[node.id as SankeyCategory] || {}
    const { heading, layer } = node
    const showLeftLabel = [0, 1].includes(layer)
    const showLabel = showLeftLabel || !node.sourceLinks.length
    return (
      <g key={node.index} onClick={() => setHoveredNode(node.id)}>
        <rect
          height={node.y1 - node.y0}
          width={sankeyGenerator.nodeWidth()}
          x={node.x0}
          y={node.y0}
          stroke='none'
          fill={nodeFill || GREY}
          fillOpacity={0.8}
          strokeLinecap="round"
        />
        {showLabel && 
          <foreignObject
            x={showLeftLabel ? (node.x0 + (node.x1 - node.x0) / 2) - 100 : node.x1 + 15}
            y={node.y0 + (node.y1 - node.y0) / 2 - 10}
            width={300}
            height={100}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: heading ? 'bold' : 'normal',
                textAlign: 'left',
                color: '#fff',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                lineHeight: '1.2em',
              }}
            >
              {node.id}
              <br />
              {`$${(node.value).toFixed(1)} BN`}
            </div>
          </foreignObject>
        }
      </g>
    );
  });

  // Draw the links
  const allLinks = links.map((link: any, i) => {
    const linkGenerator = sankeyLinkHorizontal();
    const path = linkGenerator(link);
    // const hoveredId = `${link?.target?.id}-${link?.source?.id}`
    // const hovered = hoveredId === hoveredNode
    const { linkFill } = sankeySettings[link?.target?.id as SankeyCategory] || { linkFill: '' }
    const { layer } = link?.source;
    const showLabel = layer !== 0 && !!link.target.sourceLinks.length
    
    return (
      <svg key={i}>
        <path
          id={`path-${i}`}
          d={path}
          stroke={linkFill}
          fill="none"
          strokeOpacity={1}
          strokeWidth={link.width}
          // onMouseOver={() => setHoveredNode(hoveredId)}
          // onMouseOut={() => setHoveredNode('')}
        />
        {showLabel && <text>
          <textPath
            xlinkHref={`#path-${i}`}
            startOffset="50%"
            textAnchor="middle"
            fontSize={12}
            fill="white"
          >
            {link.target.id}
          </textPath>
        </text>}
      </svg>
    );
  });

  return (
    <div className="flex items-center h-[70vh]">
      <svg width={windowWidth} height={HEIGHT} className="m-auto">
        {allLinks}
        {allNodes}
      </svg>
    </div>
  );
};

export default Sankey;
