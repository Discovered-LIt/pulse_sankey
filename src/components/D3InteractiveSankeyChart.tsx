import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, SankeyNodeMinimal, SankeyLinkMinimal } from 'd3-sankey';
import './D3InteractiveSankeyChart.css';
import Section from '../pages/howtheymakemoney/Section';


interface SankeyData {
  nodes: Array<{ name: string; value: number; type: string }>;
  links: Array<{ source: number; target: number; value: number; type: string }>;
}

interface SectionData {
  id: string;
  title: string;
  description: string;
  assetType: string;
  svgs: string[];
  charts: Chart[];
  component?: JSX.Element;
}

interface Chart {
  chartType: string;
  chartTitle: string;
  link: string;
  data?: any;
}


interface D3InteractiveSankeyChartProps {
  sankeyData: SankeyData;
  sectionsData: SectionData[];
  scrollY: number;
}

interface CustomNode extends SankeyNodeMinimal<{}, {}> {
  name: string;
  type: string;
}

interface CustomLink extends SankeyLinkMinimal<{}, {}> {
  type: string;
}

interface LinkData extends SankeyLinkMinimal<{}, {}> {
  type: string;
  width?: number;
}

interface NodeData extends SankeyNodeMinimal<{}, {}> {
  type: string;
  x0: number;
  y0: number;
  y1: number;
  x1: number;
  name: string;
}

const D3InteractiveSankeyChart: React.FC<D3InteractiveSankeyChartProps> = ({ sankeyData, sectionsData, scrollY }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentSection, setCurrentSection] = useState(-1);

  const d3ObjectsRef = useRef({
    zoomToFit: () => {},
    zoomToNode: (nodeName: string) => {},
    highlightNode: (nodeName: string | null, fullOpacity: boolean = false) => {},
  });

  useLayoutEffect(() => {
    const sectionIndex = Math.floor((scrollY - window.innerHeight) / window.innerHeight);
    setCurrentSection(Math.max(-1, sectionIndex));
  }, [scrollY]);

  const updateVisualization = useCallback((index: number) => {
    if (!d3ObjectsRef.current.zoomToFit || !d3ObjectsRef.current.zoomToNode || !d3ObjectsRef.current.highlightNode) {
      return;
    }

    const sectionMap: { [key: number]: string } = {
      1: "Auto Revenue",
      2: "Energy Revenue",
      3: "Services and other Revenue",
      4: "Total Revenue",
      5: "Cost of Revenue",
      6: "Gross Profit",
      7: "Operation Expenses",
      8: "Operation Profit",
      9: "R&D",
      10: "SG&A",
      11: "Tax",
      12: "Others",
      13: "Net Profit",
    };

    if (index === -1 || index === 0) {
      d3ObjectsRef.current.zoomToFit();
      d3ObjectsRef.current.highlightNode(null);
    } else if (sectionMap[index]) {
      d3ObjectsRef.current.zoomToNode(sectionMap[index]);
      d3ObjectsRef.current.highlightNode(sectionMap[index]);
    }
  }, []);

  useEffect(() => {
    updateVisualization(currentSection);
  }, [currentSection, updateVisualization]);

  useEffect(() => {
    if (!sankeyData || !sankeyData.nodes || !sankeyData.links) {
      console.error('Invalid or missing sankeyData');
      return;
    }

    const width = 1200;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(0, 0)`);

    const colorScale = d3.scaleOrdinal()
      .domain(['revenue', 'expense', 'profit'])
      .range(['#70706F', '#FF0000', '#32CD32']);

    const customNodeOrder = [
      "Auto Revenue", "Energy Revenue", "Services and other Revenue", "Total Revenue",
      "Cost of Revenue", "Gross Profit", "Operation Profit", "Operation Expenses",
      "Net Profit", "Others", "Tax", "R&D", "SG&A"
    ];

    const rightSideNodes = ["Others", "Net Profit", "Tax", "R&D", "SG&A"];
    const rightSidePositions: { [key: string]: number } = {};
    rightSideNodes.forEach((nodeName, index) => {
      rightSidePositions[nodeName] = (index + 1) * (height / (rightSideNodes.length + 1));
    });

    const sankeyGenerator = sankey()
      .nodeWidth(20)
      .nodePadding(10)
      .extent([[100, 50], [width - 100, height - 50]])
      .nodeSort((a: CustomNode, b: CustomNode) => customNodeOrder.indexOf(a.name) - customNodeOrder.indexOf(b.name));

    const { nodes, links } = sankeyGenerator(sankeyData);

    nodes.forEach((node: CustomNode) => {
      if (rightSideNodes.includes(node.name)) {
        const targetY = rightSidePositions[node.name];
        const nodeHeight = node.y1 - node.y0;
        node.y0 = targetY - nodeHeight / 2;
        node.y1 = targetY + nodeHeight / 2;
      }

      if (node.name === 'Cost of Revenue') {
        const shift = 590 - node.x0;
        node.x0 += shift;
        node.x1 += shift;
      } else if (node.name === 'Others' || node.name === 'Others') {
        const shift = 950 - node.x0;
        node.x0 += shift;
        node.x1 += shift;
      } else if (node.name === 'Net Profit' || node.name === 'Others') {
        const shift = 1000 - node.x0;
        node.x0 += shift;
        node.x1 += shift;
      }
    });

    sankeyGenerator.update({ nodes, links });


    const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 1)
      .selectAll("path")
      .data(links as LinkData[])
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", (d: LinkData) => colorScale(d.type) as string)
      .attr("stroke-width", (d: LinkData) => Math.max(1, d.width || 0))
      .style("mix-blend-mode", "multiply");

    const node = svg.append("g")
      .selectAll("rect")
      .data(nodes as NodeData[])
      .join("rect")
      .attr("x", (d: NodeData) => d.x0)
      .attr("y", (d: NodeData) => d.y0)
      .attr("height", (d: NodeData) => Math.max(1, d.y1 - d.y0))
      .attr("width", (d: NodeData) => Math.max(1, d.x1 - d.x0))
      .attr("fill", (d: NodeData) => colorScale(d.type) as string);

    d3ObjectsRef.current.zoomToFit = () => {
      svg.transition().duration(750).attr('transform', null);
    };

    d3ObjectsRef.current.zoomToNode = (nodeName: string) => {
      const node = nodes.find((n: CustomNode) => n.name === nodeName);
      if (node) {
        const scale = 1.5;
        const x = -node.x0 * scale + width / 4 + 100;
        const y = -node.y0 * scale + height / 4;
        svg.transition().duration(750)
          .attr('transform', `translate(${x},${y})scale(${scale})`);
      }
    };

    d3ObjectsRef.current.highlightNode = (nodeName: string | null, fullOpacity: boolean = false) => {
      if (fullOpacity) {
        node.transition().duration(750).attr("opacity", 1);
        link.transition().duration(750).attr("opacity", 1);
      } else {
        node.transition().duration(750)
          .attr("opacity", (d: NodeData) => d.name === nodeName ? 1 : 0.3);
        link.transition().duration(750)
          .attr("opacity", (d: LinkData) => (d.source as NodeData).name === nodeName || (d.target as NodeData).name === nodeName ? 0.8 : 0.1);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionIndex = parseInt(entry.target.getAttribute('data-index') || '-1', 10);
          setCurrentSection(sectionIndex);
          updateVisualization(sectionIndex);
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    document.querySelectorAll('.step').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [sankeyData, updateVisualization]);

  return (
    <div ref={containerRef} className="scrollable-sankey-container">
      <svg ref={svgRef} className="sankey-svg"></svg>
      <div id="sections">
        {sectionsData.map((sectionData, index) => (
          <div key={sectionData.id} className="step" data-index={index + 1}>
            <Section
              id={sectionData.id}  // Include id here
              title={sectionData.title}
              description={sectionData.description}
              assetType={sectionData.assetType}
              svgs={sectionData.svgs}
              charts={sectionData.charts}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default D3InteractiveSankeyChart;
