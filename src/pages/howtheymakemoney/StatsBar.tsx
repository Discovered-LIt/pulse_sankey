import './StatsBar.css';
import React, { useState, useEffect } from 'react';

interface StatsBarProps {
  marketCap: number;
  revenue: number;
  grossMargin: number;
  profit: number;
  tradingMultiple: number;
}

const StatsBar: React.FC<StatsBarProps> = ({
  marketCap,
  revenue,
  grossMargin,
  profit,
  tradingMultiple,
}) => {
  const [animatedMarketCap, setAnimatedMarketCap] = useState(0);
  const [animatedRevenue, setAnimatedRevenue] = useState(0);
  const [animatedGrossMargin, setAnimatedGrossMargin] = useState(0);
  const [animatedProfit, setAnimatedProfit] = useState(0);
  const [animatedTradingMultiple, setAnimatedTradingMultiple] = useState(0);

  useEffect(() => {
    const duration = 1000; // Animation duration in milliseconds
    const start = performance.now();

    const animate = (timestamp: number) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      setAnimatedMarketCap(Math.floor(marketCap * progress));
      setAnimatedRevenue(Math.floor(revenue * progress));
      setAnimatedGrossMargin(Math.floor(grossMargin * progress));
      setAnimatedProfit(Math.floor(profit * progress));
      setAnimatedTradingMultiple(Math.floor(tradingMultiple * progress));

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [marketCap, revenue, grossMargin, profit, tradingMultiple]);

  return (
    <div className="stats-bar">
      <div className="stat">
        <div className="stat-value">${animatedMarketCap} BN</div>
        <div className="stat-label">Market Cap</div>
      </div>
      <div className="stat">
        <div className="stat-value">${animatedRevenue} BN</div>
        <div className="stat-label">Q4 '23 Revenue</div>
      </div>
      <div className="stat">
        <div className="stat-value">{animatedGrossMargin}%</div>
        <div className="stat-label">Gross Margin</div>
      </div>
      <div className="stat">
        <div className="stat-value">${animatedProfit} BN</div>
        <div className="stat-label">Profit</div>
      </div>
      <div className="stat">
        <div className="stat-value">{animatedTradingMultiple}x</div>
        <div className="stat-label">Trading Multiple</div>
      </div>
    </div>
  );
};

export default StatsBar;