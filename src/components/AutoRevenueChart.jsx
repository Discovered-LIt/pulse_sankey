import React, { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AutoRevenueChart.css';

const AutoRevenueChart = () => {
  const [autoSalesData, setAutoSalesData] = useState([]);
  const [deliveriesData, setDeliveriesData] = useState([]);
  const scrollContainerRef = useRef(null);

  // Fake data for additional two charts
  const fakeData1 = [
    { date: '2020-01', value: 10 },
    { date: '2020-02', value: 15 },
    { date: '2020-03', value: 18 },
    { date: '2020-04', value: 22 },
  ];

  const fakeData2 = [
    { date: '2021-01', value: 5 },
    { date: '2021-02', value: 12 },
    { date: '2021-03', value: 9 },
    { date: '2021-04', value: 15 },
  ];

  // Fetch data from the public folder
  useEffect(() => {
    fetch("/autosalesrevenue.json")
      .then(response => response.json())
      .then(data => setAutoSalesData(data));

    fetch("/deliveries.json")
      .then(response => response.json())
      .then(data => setDeliveriesData(data));
  }, []);

  useEffect(() => {
    const handleScroll = (event) => {
      const element = scrollContainerRef.current;
      if (!element) return;

      const maxScrollLeft = element.scrollWidth - element.clientWidth;
      const elementTop = element.offsetTop;
      const elementBottom = elementTop + element.clientHeight;

      // Check if the user is within the auto-revenue section
      if (window.scrollY >= elementTop && window.scrollY < elementBottom) {
        // Translate vertical scroll into horizontal scroll
        const deltaY = window.scrollY - elementTop;
        element.scrollLeft = (deltaY / element.clientHeight) * maxScrollLeft;

        // Prevent vertical scroll if horizontal scroll is not complete
        if (element.scrollLeft < maxScrollLeft) {
          window.scrollTo(0, elementTop); // Hold the vertical scroll position
        } else {
          window.scrollTo(0, elementBottom); // Resume vertical scroll after horizontal scroll completes
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (autoSalesData.length === 0 || deliveriesData.length === 0) return <div>Loading...</div>;

  return (
    <div id="auto-revenue" className="auto-revenue-container">
      <h2 style={{ color: "#FFFFFF" }}>Auto Revenue</h2>
      <p style={{ color: "#FFFFFF" }}>Revenue generated from automobile sales: $17.378 BN</p>
      
      {/* Horizontal scrolling container */}
      <div id="charts-container" ref={scrollContainerRef} className="chart-scroll-container">
        
        {/* Chart 1: Auto Sales Revenue */}
        <div className="chart-section">
          <div className="chart-title">Auto Sales Revenue</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={autoSalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" tick={{ fill: '#FFF' }} />
              <YAxis tick={{ fill: '#FFF' }} />
              <Tooltip />
              <Bar dataKey="value" fill="#32CD32" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Deliveries */}
        <div className="chart-section">
          <div className="chart-title">Deliveries</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deliveriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" tick={{ fill: '#FFF' }} />
              <YAxis tick={{ fill: '#FFF' }} />
              <Tooltip />
              <Bar dataKey="value" fill="#FF0000" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Fake Data 1 */}
        <div className="chart-section">
          <div className="chart-title">Fake Data 1</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fakeData1}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" tick={{ fill: '#FFF' }} />
              <YAxis tick={{ fill: '#FFF' }} />
              <Tooltip />
              <Bar dataKey="value" fill="#FFD700" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 4: Fake Data 2 */}
        <div className="chart-section">
          <div className="chart-title">Fake Data 2</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fakeData2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" tick={{ fill: '#FFF' }} />
              <YAxis tick={{ fill: '#FFF' }} />
              <Tooltip />
              <Bar dataKey="value" fill="#00CED1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default AutoRevenueChart;
