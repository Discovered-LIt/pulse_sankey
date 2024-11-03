import React, { useEffect, useState } from 'react';
import D3InteractiveSankeyChart from '../../components/D3InteractiveSankeyChart';
import SimpleSankey from './SimpleSankey';
import ScrollDownIndicator from './ScrollDownIndicator';
import './HowTheyMakeMoney.css';

interface Chart {
  chartType: string;
  chartTitle: string;
  link: string;
  data?: any;
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

const HowTheyMakeMoney = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showSimpleSankey, setShowSimpleSankey] = useState(true);
  const [sectionsData, setSectionsData] = useState<SectionData[]>([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://d16knz2r0dpe77.cloudfront.net/howtheymakemoney_tsla2.json");
        const data = await response.json();
        setSectionsData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);
      setShowSimpleSankey(scrollPosition < window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!sectionsData.length) {
    return <p>Loading...</p>;
  }

  return (
    <div className="outer-container">
      <div className="scrollable-sankey-container">
        <div className="scrollable-content">
          <section className="step">
            <div className="container">
              <SimpleSankey sankeyData={sankeyData} highlightedNode={null} zoomLevel={1} zoomFocus={null} />
            </div>
          </section>

          {/* Integrate sectionsData into D3InteractiveSankeyChart */}
          <D3InteractiveSankeyChart sankeyData={sankeyData} sectionsData={sectionsData} scrollY={scrollY} />

        </div>
        {showSimpleSankey && <ScrollDownIndicator />}
      </div>
    </div>
  );
};

export default HowTheyMakeMoney;
