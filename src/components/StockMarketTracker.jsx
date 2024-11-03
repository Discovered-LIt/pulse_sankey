  import React, { useState, useEffect } from 'react';
  import { motion } from 'framer-motion';
  import { useTopicSettingsContext } from '../../context/TopicSettingsContext';
  import CountUp from 'react-countup';
  import ParticleFlag from './ParticleFlag'; // Import the ParticleFlag component
  import './StockMarketTracker.css';// Ensure your CSS is correctly linked
  import dashmapping from './dashmapping.json';  // Assuming this is the file path for your mapping
  const crownIcon = "/images/crownlargeyellow.svg";

  const logoMap = {
    AAPL: "/logos/AAPL.svg",
    MSFT: "/logos/MSFT.svg",
    TSLA: "/logos/TSLA.svg",
    AMZN: "/logos/AMZN.svg",
    GOOG: "/logos/GOOG.svg",
    NVDA: "/logos/NVDA.svg",
    META: "/logos/META.svg",
    LLY: "/logos/LLY.svg",
    COST: "/logos/COST.svg",
    V: "/logos/V.svg",
    WMT: "/logos/WMT.svg",
    AVGO: "/logos/AVGO.svg",
    UNH: "/logos/UNH.svg",
    NVO: "/logos/NVO.svg",
    TSM: "/logos/TSM.svg",
    XOM: "/logos/XOM.svg",
    JPM: "/logos/JPM.svg",
    HD: "/logos/HD.svg",
    ORCL: "/logos/ORCL.svg",
    PG: "/logos/PG.svg",
    MA: "/logos/MA.svg",
    JNJ: "/logos/JNJ.svg",
    ABBV: "/logos/ABBV.svg",
    BAC: "/logos/BAC.svg",
    NFLX: "/logos/NFLX.svg",
    KO: "/logos/KO.svg",
    CRM: "/logos/CRM.svg",
    MRK: "/logos/MRK.svg",
    CVX: "/logos/CVX.svg",
    AMD: "/logos/AMD.svg"
  };

  const colorMap = {
    AAPL: "#F8F8F8",  // Yellow for Apple
    MSFT: "#0078d7",  // Blue for Microsoft
    TSLA: "#e31937",  // Red for Tesla
    AMZN: "#ff9900",  // Orange for Amazon
    NVDA: "#76b900",  // Green for Nvidia
    GOOG: "#e31937",  // Blue for Meta
    META: "#0082FB",  // Blue for Meta
    LLY: "#FF001F",   // Red for Eli Lilly
    COST: "#0259A6",  //
    V: "#0078d7",  // 
    WMT: "#0078d7",  // 
    AVGO: "#e31937",  // Orange for Amazon
    UNH: "#0078d7",  // Green for Nvidia
    NVO: "#4267B2",  // Blue for Meta
    TSM: "#FF001F",   // Red for Eli Lilly
    XOM: "#F86300",  //
    JPM: "#0078d7",  // Blue for Microsoft
    HD: "#F86300",  // Red for Tesla
    ORCL: "#e31937",  // Orange for Amazon
    PG: "#0078d7",  // Green for Nvidia
    MA: "#FF5900",  // 
    JNJ: "#FF001F",   // Red for Eli Lilly
    ABBV: "#0078d7",  //
    BAC: "#0078d7",  // Blue for Microsoft
    NFLX: "#e31937",  // Red for Tesla
    KO: "#ff9900",  // 
    CRM: "#00A2E0",  // 
    MRK: "#02857C",  //
    CVX: "#FF001F",   // 
    AMD: "#04A774"   //
  // Add more companies and their corresponding colors
};


  const initialTickers = {
    AAPL: { s: "AAPL", p: null, t: 0, marketCap: null },
    MSFT: { s: "MSFT", p: null, t: 0, marketCap: null },
    TSLA: { s: "TSLA", p: null, t: 0, marketCap: null },
    NVDA: { s: "NVDA", p: null, t: 0, marketCap: null },
    META: { s: "META", p: null, t: 0, marketCap: null },
    GOOG: { s: "GOOG", p: null, t: 0, marketCap: null },
    AMZN: { s: "AMZN", p: null, t: 0, marketCap: null },
    TSM: { s: "TSM", p: null, t: 0, marketCap: null },
    AVGO: { s: "AVGO", p: null, t: 0, marketCap: null },
    LLY: { s: "LLY", p: null, t: 0, marketCap: null },
    WMT: { s: "WMT", p: null, t: 0, marketCap: null },
    JPM: { s: "JPM", p: null, t: 0, marketCap: null },
    NVO: { s: "NVO", p: null, t: 0, marketCap: null },
    V: { s: "V", p: null, t: 0, marketCap: null },
    UNH: { s: "UNH", p: null, t: 0, marketCap: null },
    XOM: { s: "XOM", p: null, t: 0, marketCap: null },
    ORCL: { s: "ORCL", p: null, t: 0, marketCap: null },
    MA: { s: "MA", p: null, t: 0, marketCap: null },
    PG: { s: "PG", p: null, t: 0, marketCap: null },
    HD: { s: "HD", p: null, t: 0, marketCap: null },
    COST: { s: "COST", p: null, t: 0, marketCap: null },
    JNJ: { s: "JNJ", p: null, t: 0, marketCap: null },
    ABBV: { s: "ABBV", p: null, t: 0, marketCap: null },
    BAC: { s: "BAC", p: null, t: 0, marketCap: null },
    NFLX: { s: "NFLX", p: null, t: 0, marketCap: null },
    KO: { s: "KO", p: null, t: 0, marketCap: null },
    CRM: { s: "CRM", p: null, t: 0, marketCap: null },
    MRK: { s: "MRK", p: null, t: 0, marketCap: null },
    CVX: { s: "CVX", p: null, t: 0, marketCap: null },
    AMD: { s: "AMD", p: null, t: 0, marketCap: null }
  };


  const StockMarketTracker = () => {
    const navigate = useNavigate();
    const { setActiveTopic } = useTopicSettingsContext();
    const [stocks, setStocks] = useState(dashmapping.map(stock => ({
    ...stock, 
    marketCap: stock.sharesoutstanding * stock.adjustedclose, // Initial market cap
    initialPrice: stock.adjustedclose, // Store adjustedclose as initial price
    priceChange: 0 // No change initially
  })));

  const [showTracker, setShowTracker] = useState(false); // Track visibility of stock tracker

  const handleCardClick = (stock) => {
    const topic = stock.s.toLowerCase();
    setActiveTopic(topic);
    navigate(`/data?topic=${topic}`);
  };

  // Set a timeout to show the stock tracker after the particle animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTracker(true); // Show stock tracker after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

    const [previousMarketCap, setPreviousMarketCap] = useState({});
    const [previousMarketCapChange, setPreviousMarketCapChange] = useState({});
    const [previousRanks, setPreviousRanks] = useState({});
    const [initialRanks, setInitialRanks] = useState({}); // Add this
    const [rankLoaded, setRankLoaded] = useState(false); // 
    const [borderMap, setBorderMap] = useState({});  // Track border state for each stock

    
    const sharesOutstandingMap = {
      META: 2530000000,
      MSFT: 7433000000,
      TSLA: 3191000000,
      AMZN: 10500000000,
      GOOG: 12310000000,
      AAPL: 15287521000,
      NVDA: 24578000000,
      LLY: 900900000,
      COST: 443340000,
      V: 1610000000,
      WMT: 8044000000,
      AVGO: 4663000000,
      UNH: 921000000,
      NVO: 4457700000,
      XOM: 4317000000,
      JPM: 2889800000,
      HD: 990000000,
      ORCL: 2761000000,
      PG: 2360500000,
      MA: 933000000,
      TSM: 5185514310,
      JNJ: 2406800000,
      ABBV: 1766000000,
      BAC: 7865000000,
      NFLX: 430900000,
      KO: 4339000000,
      CRM: 984000000,
      MRK: 2542000000,
      CVX: 1824842000,
      AMD: 1618000000
    };

    useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://cheat-6bc2732715c1.herokuapp.com/ticker');
      const data = await response.json();

      if (Array.isArray(data)) {
        setStocks(prevStocks => {
          const stockArray = Array.isArray(prevStocks) ? prevStocks : [];
          const stockMap = { ...stockArray.reduce((acc, stock) => {
            acc[stock.s] = stock;
            return acc;
          }, {}) };

          data.forEach(item => {
            const previousPrice = stockMap[item.s]?.initialPrice || stockMap[item.s]?.adjustedclose;
            const latestPrice = item.p || previousPrice; // Use latest price from API or fallback to adjustedclose
            const priceChange = item.p ? item.p - previousPrice : 0;  // Calculate price change if new price exists

            stockMap[item.s] = {
              ...stockMap[item.s],
              p: item.p || null, // Set the latest price if available
              marketCap: (sharesOutstandingMap[item.s] || 0) * latestPrice, // Calculate market cap
              priceChange  // Store the price change
            };

            setPreviousMarketCap(prev => ({
              ...prev,
              [item.s]: stockMap[item.s].marketCap || 0,
            }));

            setPreviousMarketCapChange(prev => ({
              ...prev,
              [item.s]: (sharesOutstandingMap[item.s] * stockMap[item.s].priceChange) / 1e9 || 0,
            }));

            const borderClass = priceChange > 0 ? 'positive' : priceChange < 0 ? 'negative' : 'neutral';

            setBorderMap(prev => ({
              ...prev,
              [item.s]: {
                className: borderClass,
                type: borderClass
              }
            }));
          });


          const updatedStocks = Object.values(stockMap).sort((a, b) => b.marketCap - a.marketCap);
          
          // If ranks are not yet loaded, store initial ranks
          if (!rankLoaded) {
            const initialRanks = updatedStocks.reduce((acc, stock, index) => {
              acc[stock.s] = index + 1;
              return acc;
            }, {});
            setInitialRanks(initialRanks);
            setRankLoaded(true);
          }

          // Calculate current ranks
          const currentRanks = updatedStocks.reduce((acc, stock, index) => {
            acc[stock.s] = index + 1;
            return acc;
          }, {});

          // Calculate rank changes based on initial ranks
          const rankChanges = Object.keys(currentRanks).reduce((acc, stockSymbol) => {
            const previousRank = initialRanks[stockSymbol];
            const currentRank = currentRanks[stockSymbol];
            if (previousRank !== undefined) {
              acc[stockSymbol] = previousRank - currentRank;
            } else {
              acc[stockSymbol] = 0;
            }
            return acc;
          }, {});

          setPreviousRanks(rankChanges);
          return updatedStocks;
        });
      }
    };


    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [rankLoaded, borderMap]);


    const getBorderClass = (priceChange) => {
      if (priceChange > 0) {
        return 'positive';
      } else if (priceChange < 0) {
        return 'negative';
      } else {
        return 'neutral'; // For no change
      }
    };

    const getRankChangeIndicator = (rankChange) => {
      if (rankChange > 0) {
        return <span className="rank-up">▲ {rankChange}</span>; // Green for rank up
      } else if (rankChange < 0) {
        return <span className="rank-down">▼ {Math.abs(rankChange)}</span>; // Red for rank down
      } else {
        return <span className="rank-neutral">●</span>; // Neutral for no change
      }
    };


    return (
      <div>
      {!showTracker && <ParticleFlag />} {/* Show ParticleFlag initially */}
      {showTracker && (
        <div className="market-grid">
          {stocks.map((stock, index) => (
            <motion.div
              key={stock.s}
              className={`company-border-container ${borderMap[stock.s]?.className || 'neutral'}`}
              initial={{ opacity: 0, scale: 0.8 }} // Start at smaller scale and invisible
              animate={{ opacity: 1, scale: 1 }}  // Animate to full scale and opacity
              transition={{ delay: index * 0.15, duration: 0.5 }} // Slight delay between cards
              style={{
                background: 'transparent',  // No background by default
                '--hover-color': colorMap[stock.s] || '#111',  // Set the hover color dynamically for each company
              }}
            >
              <div className="company-card">
                  {index === 0 && (
                    <img src={crownIcon} alt="Crown Icon" className="crown-icon" />
                  )}
                <div className="rank">{index + 1}</div>
                <img src={logoMap[stock.s]} alt={`${stock.s} logo`} className="company-logo" />
                <div className="company-details">
                  <p className="market-cap">
                    {typeof stock.marketCap === 'number' 
                      ? (stock.marketCap >= 1e12 
                        ? `$${(stock.marketCap / 1e12).toFixed(2)}T` 
                        : `$${(stock.marketCap / 1e9).toFixed(2)}B`) 
                      : 'N/A'}
                  </p>
                  <p className="market-cap-change">
                    {typeof stock.priceChange === 'number' && typeof sharesOutstandingMap[stock.s] === 'number'
                      ? `${stock.priceChange > 0 ? '+' : ''}${((sharesOutstandingMap[stock.s] * stock.priceChange) / 1e9).toFixed(2)} Bn`
                      : 'N/A'}
                  </p>
                  <p className="rank-change-indicator">
                  {getRankChangeIndicator(previousRanks[stock.s])}
                  </p>
                  onClick={() => handleCardClick(stock)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    );
  };

  export default StockMarketTracker;