import React, { useState, useEffect } from "react";
import { sankey, sankeyCenter, sankeyLinkHorizontal } from "d3-sankey";

const MARGIN_Y = 25;
const MARGIN_X = 150;
const HEIGHT = 400

// colors
const GREY = '#6c6c6c'
const LIGHT_GREY = '#aaaaaa'
const GREEN = '#05a302'
const LIGHT_GREEN = '#12d02a'
const RED = '#b81b01'
const LIGHT_RED = '#f76c67'

type Data = {
  nodes: { id: string }[];
  links: { source: string; target: string; value: number }[];
};

enum Title {
  AutoRevenue = "Auto Revenue",
  AutoSalesRevenue = "Auto Sales Revenue",
  AutoLeasingRevenue = "Auto Leasing Revenue",
  AutoRegCredits = "Auto Reg Credits",
  TotalRevenue = "Total Revenue",
  GrossProfite = "Gross Profit",
  CostOfRevenue = "Cost of Revenue",
  OperationProfit = "Operation Profit",
  OperationExpenses = "Operation Expenses",
  AutoCosts = "Auto Costs",
  EnergyCosts = "Energy Costs",
  NetProfite = "Net Profit",
  Tax = "Tax",
  Others = "Others",
  "R&D" = "R&D",
  "SG&D" = "SG&D"
}

const sankeySettings = {
  [Title.AutoRevenue]: { nodeFill: GREY, linkFill: LIGHT_GREY },
  [Title.AutoSalesRevenue]: { nodeFill: GREY, linkFill: LIGHT_GREY },
  [Title.AutoLeasingRevenue]: { nodeFill: GREY, linkFill: LIGHT_GREY },
  [Title.AutoRegCredits]: { nodeFill: GREY, linkFill: LIGHT_GREY },
  [Title.TotalRevenue]: { nodeFill: GREY, linkFill: LIGHT_GREY },
  [Title.GrossProfite]: { nodeFill: GREEN, linkFill: LIGHT_GREEN },
  [Title.OperationProfit]: { nodeFill: GREEN, linkFill: LIGHT_GREEN },
  [Title.NetProfite]: { nodeFill: GREEN, linkFill: LIGHT_GREEN },
  [Title.CostOfRevenue]: { nodeFill: RED, linkFill: LIGHT_RED },
  [Title.OperationExpenses]: { nodeFill: RED, linkFill: LIGHT_RED },
  [Title.AutoCosts]: { nodeFill: RED, linkFill: LIGHT_RED },
  [Title.EnergyCosts]: { nodeFill: RED, linkFill: LIGHT_RED },
  [Title.Tax]: { nodeFill: RED, linkFill: LIGHT_RED },
  [Title.Others]: { nodeFill: RED, linkFill: LIGHT_RED },
  [Title["R&D"]]: { nodeFill: RED, linkFill: LIGHT_RED },
  [Title["SG&D"]]: { nodeFill: RED, linkFill: LIGHT_RED },
} as { [key in Title]: { nodeFill: string, linkFill: string } }

interface Sankey {
  autoSalesRevenue: number;
  autoLeasingRevenue: number;
  autoRegCredits: number
}

const Sankey = ({ autoSalesRevenue, autoLeasingRevenue, autoRegCredits }: Sankey) => {
  const [hoveredNode, setHoveredNode] = useState<string>('')
  const [windowWidth, setWindowWidth] = useState<number>()

  const autoRevenue = autoSalesRevenue + autoLeasingRevenue + autoRegCredits;
  console.log('autoRevenue', autoRevenue)

  useEffect(() => {
    windowresizeHandler()
    window.addEventListener('resize', windowresizeHandler);
    return () => window.removeEventListener('resize', windowresizeHandler);
  }, [])

  const windowresizeHandler = () => {
    setWindowWidth(window.innerWidth)
  }

  const data: Data = {
    nodes: Object.values(Title).map((key) => {
      return { id: key, heading: [Title.AutoRevenue, Title.NetProfite].includes(key) }
    }),
    links: [
      { source: Title.AutoRevenue, target: Title.TotalRevenue, value: autoRevenue },
      { source: Title.AutoSalesRevenue, target: Title.TotalRevenue, value: autoSalesRevenue },
      { source: Title.AutoLeasingRevenue, target: Title.TotalRevenue, value: autoLeasingRevenue },
      { source: Title.AutoRegCredits, target: Title.TotalRevenue, value: autoRegCredits },

      { source: Title.TotalRevenue, target: Title.GrossProfite, value: 1.4 },
      { source: Title.GrossProfite, target: Title.OperationProfit, value: 1.4 },
      { source: Title.GrossProfite, target: Title.OperationExpenses, value: 1.4 },

      { source: Title.OperationProfit, target: Title.NetProfite, value: 1.4 },
      { source: Title.OperationProfit, target: Title.Tax, value: 1.4 },
      { source: Title.OperationProfit, target: Title.Others, value: 1.4 },

      { source: Title.OperationExpenses, target: Title["R&D"], value: 1.4 },
      { source: Title.OperationExpenses, target: Title["SG&D"], value: 1.4 },

      { source: Title.TotalRevenue, target: Title.CostOfRevenue, value: 1.4 },
      { source: Title.CostOfRevenue, target: Title.AutoCosts, value: 1.4 },
      { source: Title.CostOfRevenue, target: Title.EnergyCosts, value: 1.4 },
    ]
  }

  // Set the sankey diagram properties
  const sankeyGenerator = sankey()
    .nodeWidth(26)
    .nodePadding(29)
    .extent([
      [MARGIN_X, MARGIN_Y],
      [windowWidth - MARGIN_X, HEIGHT - MARGIN_Y],
    ])
    .nodeId((node: any) => node.id) // Accessor function: how to retrieve the id that defines each node. This id is then used for the source and target props of links
    .nodeAlign(sankeyCenter); // Algorithm used to decide node position

  // Compute nodes and links positions
  const { nodes, links } = sankeyGenerator(data as any);

  // Draw the nodes
  const allNodes = nodes.map((node: any) => {
    const { nodeFill } = sankeySettings[node.id as Title] || {}
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
          fill={nodeFill}
          fillOpacity={0.8}
          strokeLinecap="round"
        />
        {showLabel && <text
          x={showLeftLabel ? (node.x0 + (node.x1 - node.x0) / 2) - 20 : node.x1 + 15}
          y={node.y0 + (node.y1 - node.y0) / 2}
          dy={".35em"}
          fontSize={12}
          fontWeight={heading ? 'bold' : 'normal'}
          textAnchor={showLeftLabel ? "end" : "start"}
          transform={null}
          fill="#fff"
        >{node.id}</text>}
      </g>
    );
  });

  // Draw the links
  const allLinks = links.map((link: any, i) => {
    const linkGenerator = sankeyLinkHorizontal();
    const path = linkGenerator(link);
    // const hoveredId = `${link?.target?.id}-${link?.source?.id}`
    // const hovered = hoveredId === hoveredNode
    const { linkFill } = sankeySettings[link?.target?.id as Title] || { linkFill: '' }
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
