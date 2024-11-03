import React, { useEffect, useState } from 'react';
import BarChart from '../../components/charts/Bar';
import AutoSalesRace from "./AutoSalesRace"; // Assuming you placed it in the components folder
import './Section.css';

interface Chart {
  chartType: string;
  chartTitle: string;
  link: string;
  data?: any;
}

interface SectionProps {
  id: string;
  title: string;
  description: string;
  assetType: string;
  svgs: string[];
  charts: Chart[];
  component?: JSX.Element;
}

const Section: React.FC<SectionProps> = ({ title, description, assetType, svgs, charts, component }) => {
  const [chartDataArray, setChartDataArray] = useState<Chart[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const loadedData = await Promise.all(
        charts.map(async (chart: Chart) => {
          const response = await fetch(chart.link);
          const data = await response.json();
          return { ...chart, data };
        })
      );
      setChartDataArray(loadedData);
    };

    fetchData();
  }, [charts]);

  return (
    <section className="section-container">
      <h2 className="section-title">{title}</h2>
      <p className="section-description">{description}</p>

      {/* Conditionally render custom component or SVGs row */}
      {component ? (
        <div className="custom-component">{component}</div>
      ) : (
        <div className="svgs-row">
          {svgs.map((svg: string, index: number) => (
            <img key={index} src={svg} alt={`${title} icon`} className="section-svg" />
          ))}
        </div>
      )}

      <div className="horizontal-scroll-container">
        {/* Row for Charts */}
        <div className="charts-row">
          {assetType === 'charts' && chartDataArray.map((chart, index) => (
            <div key={index} className="section-chart-container">
              <h3>{chart.chartTitle}</h3>
              {chart.chartType === 'bar' && chart.data && (
                <BarChart data={chart.data} chartOverview={false} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section;
