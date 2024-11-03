import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

type NodeType = 'revenue' | 'expense' | 'profit';
type Node = { name: string; value: number; type: NodeType };
type Link = { source: number | string; target: number | string; value: number; type: NodeType };
type SankeyData = { nodes: Node[]; links: Link[] };
type Section = { id: string; title: string; description: string };

const D3SankeyChart: React.FC<{ data: SankeyData; focusedNode: string | null }> = ({ data, focusedNode }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    svg.attr('width', width).attr('height', height);

    const sankeyGenerator = sankey<Node, Link>()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 6]]);

    const { nodes, links } = sankeyGenerator({
      nodes: data.nodes.map(d => Object.assign({}, d)),
      links: data.links.map(d => Object.assign({}, d))
    });

    svg.selectAll('*').remove();

    // Add links
    svg.append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.5)
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d: any) => d.type === 'revenue' ? '#4CAF50' : d.type === 'expense' ? '#F44336' : '#2196F3')
      .attr('stroke-width', (d: any) => Math.max(1, d.width));

    // Add nodes
    const node = svg.append('g')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('fill', (d: any) => d.type === 'revenue' ? '#4CAF50' : d.type === 'expense' ? '#F44336' : '#2196F3')
      .attr('opacity', (d: any) => d.name === focusedNode ? 1 : 0.8);

    // Add labels
    svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', (d: any) => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', (d: any) => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => d.x0 < width / 2 ? 'start' : 'end')
      .text((d: any) => d.name)
      .attr('fill', 'white');

    // Zoom and highlight effect
    if (focusedNode) {
      const focusedNodeData = nodes.find((n: any) => n.name === focusedNode);
      if (focusedNodeData) {
        const scale = 1.5;
        const x = (focusedNodeData as any).x0;
        const y = (focusedNodeData as any).y0;
        const nodeWidth = (focusedNodeData as any).x1 - (focusedNodeData as any).x0;
        const nodeHeight = (focusedNodeData as any).y1 - (focusedNodeData as any).y0;

        svg.transition().duration(750)
          .attr('viewBox', `${x - nodeWidth} ${y - nodeHeight / 2} ${width / scale} ${height / scale}`)
          .attr('preserveAspectRatio', 'xMidYMid meet');

        node.filter((d: any) => d.name === focusedNode)
          .transition().duration(750)
          .attr('opacity', 1)
          .attr('stroke', '#FFF')
          .attr('stroke-width', 2);
      }
    } else {
      svg.transition().duration(750)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

      node.transition().duration(750)
        .attr('opacity', 0.8)
        .attr('stroke', 'none');
    }

  }, [data, focusedNode]);

  return <svg ref={svgRef} style={{ background: '#1e1e1e', width: '100%', height: '100%' }}></svg>;
};

const Section: React.FC<{ section: Section; isIntersecting: boolean }> = ({ section, isIntersecting }) => {
  return (
    <div id={section.id} className={`min-h-screen flex items-center justify-center p-8 ${isIntersecting ? 'bg-opacity-90' : 'bg-opacity-0'} bg-gray-800 transition-all duration-500`}>
      <div className={`bg-gray-700 shadow-md rounded p-6 text-white transform transition-all duration-500 ${isIntersecting ? 'scale-110 opacity-100' : 'scale-100 opacity-0'}`}>
        <h2 className="text-xl font-bold mb-2">{section.title}</h2>
        <p>{section.description}</p>
      </div>
    </div>
  );
};

const InteractiveSankeyChart: React.FC<{ sankeyData: SankeyData; sections: Section[] }> = ({ sankeyData, sections }) => {
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setFocusedNode(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      <div className="sticky top-0 w-full h-screen bg-gray-900 z-10">
        <D3SankeyChart data={sankeyData} focusedNode={focusedNode} />
      </div>
      <div className="absolute top-0 left-0 w-full z-20">
        {sections.map((section, index) => (
          <div key={section.id} ref={(el) => (sectionRefs.current[index] = el)}>
            <Section section={section} isIntersecting={focusedNode === section.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveSankeyChart;