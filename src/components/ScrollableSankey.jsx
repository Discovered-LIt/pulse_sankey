import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import './ScrollableSankey.css';
import SimpleSankey from './SimpleSankey';
import AutoRevenueChart from './AutoRevenueChart';

const ScrollableSankey = ({ sankeyData }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [showSimpleSankey, setShowSimpleSankey] = useState(true); 
  const d3ObjectsRef = useRef({});

  const sections = [
    { id: 'overview', title: 'Overview of Tesla\'s Business', description: 'Learn who they are' },
    { id: 'auto-revenue', component: <AutoRevenueChart />, },
    { id: 'energy-revenue', title: 'Energy Revenue', description: 'Revenue from energy products and services: $1.635 BN' },
    { id: 'services-revenue', title: 'Services and Other Revenue', description: 'Revenue from additional services and products: $2.288 BN' },
    { id: 'total-revenue', title: 'Total Revenue', description: 'Combined revenue from all streams: $21.301 BN' },
    { id: 'cost-of-revenue', title: 'Cost of Revenue', description: 'Total costs directly associated with delivering goods and services: $17.605 BN' },
    { id: 'gross-profit', title: 'Gross Profit', description: 'Revenue minus cost of revenue: $3.696 BN' },
    { id: 'operation-expenses', title: 'Operation Expenses', description: 'Costs incurred in daily business operations: $2.525 BN' },
    { id: 'operation-profit', title: 'Operation Profit', description: 'Profit from core business operations: $1.171 BN' },
    { id: 'rd-expenses', title: 'Research and Development', description: 'Investment in R&D: $1.151 BN' },
    { id: 'sga-expenses', title: 'Selling, General & Administrative', description: 'Costs for selling products and managing the business: $1.374 BN' },
    { id: 'tax', title: 'Tax', description: 'Corporate income tax: $0.409 BN' },
    { id: 'others', title: 'Other Income', description: 'Additional income from other sources: $0.382 BN' },
    { id: 'net-profit', title: 'Net Profit', description: 'Final profit after all expenses and taxes: $1.144 BN' }
  ];
      // Define handleScroll as a useCallback to ensure it's properly memoized
    const handleScroll = useCallback(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 100 && showSimpleSankey) {
        setShowSimpleSankey(false);
      }
    }, [showSimpleSankey]);


  // Switch from SimpleSankey to ScrollableSankey when user scrolls past a certain point
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const updateVisualization = useCallback((index) => {
      console.log(`updateVisualization - Index: ${index}`);
      if (!d3ObjectsRef.current.zoomToFit || !d3ObjectsRef.current.zoomToNode || !d3ObjectsRef.current.highlightNode) {
        return;
      }

    // Switch between zoom-ins and highlighting specific nodes based on scroll position
    switch (index) {
      case -1:
      case 0:
        d3ObjectsRef.current.zoomToFit();
        d3ObjectsRef.current.highlightNode(null);
        break;
      case 1:
        d3ObjectsRef.current.zoomToNode('Auto Revenue');
        d3ObjectsRef.current.highlightNode('Auto Revenue');
        break;
      case 2:
        d3ObjectsRef.current.zoomToNode('Energy Revenue');
        d3ObjectsRef.current.highlightNode('Energy Revenue');
        break;
      case 3:
        d3ObjectsRef.current.zoomToNode('Services and other Revenue');
        d3ObjectsRef.current.highlightNode('Services and other Revenue');
        break;
      case 4:
        d3ObjectsRef.current.zoomToNode('Total Revenue');
        d3ObjectsRef.current.highlightNode('Total Revenue');
        break;
      case 5:
        d3ObjectsRef.current.zoomToNode('Cost of Revenue');
        d3ObjectsRef.current.highlightNode('Cost of Revenue');
        break;
      case 6:
        d3ObjectsRef.current.zoomToNode('Gross Profit');
        d3ObjectsRef.current.highlightNode('Gross Profit');
        break;
      case 7:
        d3ObjectsRef.current.zoomToNode('Operation Expenses');
        d3ObjectsRef.current.highlightNode('Operation Expenses');
        break;
      case 8:
        d3ObjectsRef.current.zoomToNode('Operation Profit');
        d3ObjectsRef.current.highlightNode('Operation Profit');
        break;
      case 9:
        d3ObjectsRef.current.zoomToNode('R&D');
        d3ObjectsRef.current.highlightNode('R&D');
        break;
      case 10:
        d3ObjectsRef.current.zoomToNode('SG&A');
        d3ObjectsRef.current.highlightNode('SG&A');
        break;
      case 11:
        d3ObjectsRef.current.zoomToNode('Tax');
        d3ObjectsRef.current.highlightNode('Tax');
        break;
      case 12:
        d3ObjectsRef.current.zoomToNode('Others');
        d3ObjectsRef.current.highlightNode('Others');
        break;
      case 13:
        d3ObjectsRef.current.zoomToNode('Net Profit');
        d3ObjectsRef.current.highlightNode('Net Profit');
        break;
      default:
        d3ObjectsRef.current.zoomToFit();
        d3ObjectsRef.current.highlightNode(null);
    }
  }, []);

   useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionIndex = parseInt(entry.target.getAttribute('data-index'));
            setCurrentSection(sectionIndex);
            updateVisualization(sectionIndex);
          }
        });
      }, { root: null, rootMargin: '0px', threshold: 0.1 });

      const sections = document.querySelectorAll('.step');
      sections.forEach(section => {
        observer.observe(section);
      });

      return () => {
        observer.disconnect();
      };
    }, [updateVisualization]);

    // Rendering logic for Scrollable Sankey
    useEffect(() => {
      if (!sankeyData || !sankeyData.nodes || !sankeyData.links || showSimpleSankey) {
        return;
      }

      const svg = d3.select(svgRef.current)
        .attr('width', 1200)
        .attr('height', 600)
        .append('g')
        .attr('transform', 'translate(0, 0)');

      const colorScale = d3.scaleOrdinal()
        .domain(['revenue', 'expense', 'profit'])
        .range(['#70706F', '#FF0000', '#32CD32']);

      const sankeyGenerator = sankey()
        .nodeWidth(20)
        .nodePadding(10)
        .extent([[100, 50], [1200 - 100, 600 - 50]]);

      const { nodes, links } = sankeyGenerator(sankeyData);

      // Draw links and nodes
      svg.append('g')
        .attr('fill', 'none')
        .selectAll('path')
        .data(links)
        .join('path')
        .attr('d', sankeyLinkHorizontal())
        .attr('stroke', d => colorScale(d.type))
        .attr('stroke-width', d => Math.max(1, d.width))
        .style('mix-blend-mode', 'multiply');

      svg.append('g')
        .selectAll('rect')
        .data(nodes)
        .join('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('height', d => d.y1 - d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('fill', d => colorScale(d.type));

    }, [sankeyData, showSimpleSankey]);

    return (
      <div className="scrollable-sankey-container" ref={containerRef}>
        {showSimpleSankey ? (
          <SimpleSankey sankeyData={sankeyData} />
        ) : (
          <>
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
          </>
        )}
      </div>
    );
  };

  export default ScrollableSankey;