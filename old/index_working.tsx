import React, { useEffect, useState, useRef } from 'react';
import D3InteractiveSankeyChart from '../../components/D3InteractiveSankeyChart';
import SimpleSankey from './SimpleSankey';
import ScrollDownIndicator from './ScrollDownIndicator';
import './HowTheyMakeMoney.css';

const HowTheyMakeMoney = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showSimpleSankey, setShowSimpleSankey] = useState(true);  // Toggle between charts


  const sankeyData = {
    nodes: [
      { name: "Auto Revenue", value: 17.378, type: "revenue" },
      { name: "Energy Revenue", value: 1.635, type: "revenue" },
      { name: "Services and other Revenue", value: 2.288, type: "revenue" },
      { name: "Total Revenue", value: 21.301, type: "revenue" },
      { name: "Cost of Revenue", value: 17.605, type: "expense" },
      { name: "Gross Profit", value: 3.696, type: "profit" },
      { name: "Operation Expenses", value: 2.525, type: "expense" },
      { name: "Operation Profit", value: 1.171, type: "profit" },
      { name: "Others", value: 0.382, type: "profit" },
      { name: "Net Profit", value: 1.144, type: "profit" },
      { name: "R&D", value: 1.151, type: "expense" },
      { name: "Tax", value: 0.409, type: "expense" },
      { name: "SG&A", value: 1.374, type: "expense" }
    ],
    links: [
      { source: 0, target: 3, value: 17.378, type: "revenue" },
      { source: 1, target: 3, value: 1.635, type: "revenue" },
      { source: 2, target: 3, value: 2.288, type: "revenue" },
      { source: 3, target: 4, value: 17.605, type: "expense" },
      { source: 3, target: 5, value: 3.696, type: "profit" },
      { source: 5, target: 6, value: 2.525, type: "expense" },
      { source: 5, target: 7, value: 1.171, type: "profit" },
      { source: 7, target: 9, value: 1.144, type: "profit" },
      { source: 8, target: 9, value: 0.382, type: "profit" },
      { source: 6, target: 10, value: 1.151, type: "expense" },
      { source: 7, target: 11, value: 0.409, type: "expense" },
      { source: 6, target: 12, value: 1.374, type: "expense" }
    ]
  };

  const sections = [
    { id: 'overview', title: 'Overview of Tesla’s Business', description: 'Learn who they are' },
    { id: 'auto-revenue', title: 'Auto Revenue', description: 'Revenue from energy products and services: $1.635 BN' },
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

  useEffect(() => {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        setScrollY(scrollPosition);
        setShowSimpleSankey(scrollPosition < window.innerHeight);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

   return (
      <div className="outer-container">
        <div className="scrollable-sankey-container">
          <div className="scrollable-content">
            {/* First section with SimpleSankey */}
            <section className="step">
              <div className="container">
                <SimpleSankey
                  sankeyData={sankeyData}
                  highlightedNode={null}
                  zoomLevel={1}
                  zoomFocus={null}
                />
              </div>
            </section>

            {/* D3InteractiveSankeyChart sections */}
            <section className="step">
              <D3InteractiveSankeyChart
                sankeyData={sankeyData}
                sections={sections}
                scrollY={scrollY}
              />
            </section>
          </div>
            {showSimpleSankey && <ScrollDownIndicator />}
        </div>
      </div>
    );
  };

export default HowTheyMakeMoney;