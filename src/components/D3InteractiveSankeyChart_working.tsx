import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, SankeyNodeMinimal, SankeyLinkMinimal } from 'd3-sankey';
import './D3InteractiveSankeyChart.css';

interface SankeyData {
  nodes: Array<{ name: string; value: number; type: string }>;
  links: Array<{ source: number; target: number; value: number; type: string }>;
}

interface Section {
  id: string;
  title: string;
  description: string;
  component?: JSX.Element;
}

interface D3InteractiveSankeyChartProps {
  sankeyData: SankeyData;
  sections: Array<{ id: string; title: string; description: string; component?: JSX.Element }>;
  scrollY: number;
  currentSection?: number;  
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
  name: string; // Add the 'name' property to NodeData
}

const D3InteractiveSankeyChart: React.FC<D3InteractiveSankeyChartProps> = ({ sankeyData, sections, scrollY }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentSection, setCurrentSection] = useState(-1);
  const d3ObjectsRef = useRef({
    zoomToFit: () => {},
    zoomToNode: (nodeName: string) => {},
    highlightNode: (nodeName: string | null, fullOpacity: boolean = false) => {},
  });

  useLayoutEffect(() => {
    // Adjusts the current section based on scroll position
    const handleScroll = () => {
      const sectionIndex = Math.floor((scrollY - window.innerHeight) / window.innerHeight);
      setCurrentSection(Math.max(-1, sectionIndex));
    };

    handleScroll();
  }, [scrollY]);

  const updateVisualization = useCallback((index: number) => {
    if (!d3ObjectsRef.current.zoomToFit || !d3ObjectsRef.current.zoomToNode || !d3ObjectsRef.current.highlightNode) {
      return;
    }

    // Control zoom and node highlighting based on current section index
    switch (index) {
      case -1:
      case 0:
        console.log('Zoom to fit');
        d3ObjectsRef.current.zoomToFit();
        d3ObjectsRef.current.highlightNode(null);
        break;
      case 1:
        console.log('Auto Revenue');
        d3ObjectsRef.current.zoomToNode('Auto Revenue');
        d3ObjectsRef.current.highlightNode('Auto Revenue');
        break;
      case 2:
        console.log('Energy');
        d3ObjectsRef.current.zoomToNode('Energy Revenue');
        d3ObjectsRef.current.highlightNode('Energy Revenue');
        break;
      case 3:
        console.log('Services');
        d3ObjectsRef.current.zoomToNode('Services and other Revenue');
        d3ObjectsRef.current.highlightNode('Services and other Revenue');
        break;
      case 4:
        console.log('Total Rev');
        d3ObjectsRef.current.zoomToNode('Total Revenue');
        d3ObjectsRef.current.highlightNode('Total Revenue');
        break;
      case 5:
        console.log('Cost of Rev');
        d3ObjectsRef.current.zoomToNode('Cost of Revenue');
        d3ObjectsRef.current.highlightNode('Cost of Revenue');
        break;
      case 6:
        console.log('Gross Profit');
        d3ObjectsRef.current.zoomToNode('Gross Profit');
        d3ObjectsRef.current.highlightNode('Gross Profit');
        break;
      case 7:
        console.log('Operation Expenses');
        d3ObjectsRef.current.zoomToNode('Operation Expenses');
        d3ObjectsRef.current.highlightNode('Operation Expenses');
        break;
      case 8:
        console.log('Operation Profit');
        d3ObjectsRef.current.zoomToNode('Operation Profit');
        d3ObjectsRef.current.highlightNode('Operation Profit');
        break;
      case 9:
        console.log('R&D');
        d3ObjectsRef.current.zoomToNode('R&D');
        d3ObjectsRef.current.highlightNode('R&D');
        break;
      case 10:
        console.log('SGA');
        d3ObjectsRef.current.zoomToNode('SG&A');
        d3ObjectsRef.current.highlightNode('SG&A');
        break;
      case 11:
        console.log('Tax');
        d3ObjectsRef.current.zoomToNode('Tax');
        d3ObjectsRef.current.highlightNode('Tax');
        break;
      case 12:
        console.log('Others');
        d3ObjectsRef.current.zoomToNode('Others');
        d3ObjectsRef.current.highlightNode('Others');
        break;
      case 13:
        console.log('Net Profit');
        d3ObjectsRef.current.zoomToNode('Net Profit');
        d3ObjectsRef.current.highlightNode('Net Profit');
        break;
      default:
        console.log('Zoom to fit');
        d3ObjectsRef.current.zoomToFit();
        d3ObjectsRef.current.highlightNode(null);
    }
  }, []);

  useEffect(() => {
    // Watch for scroll and call the updateVisualization function
    const handleScroll = () => {
      updateVisualization(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
        {sections.map((section, index) => (
          <div key={section.id} className="step" data-index={index}>
            <h2>{section.title}</h2>
            <p>{section.description}</p>
            {section.component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default D3InteractiveSankeyChart;
