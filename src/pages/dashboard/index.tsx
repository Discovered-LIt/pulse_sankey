  import React, { useState, useEffect } from 'react';
  import { motion, AnimatePresence, Variants } from 'framer-motion';
  import { useNavigate } from 'react-router-dom';
  import CountUp from 'react-countup';
  import cn from 'classnames'; // or 'clsx' if you're using that
  import ParticleFlag from '../../components/ParticleFlag';// Import the ParticleFlag component
  import '../../components/StockMarketTracker.css';// Ensure your CSS is correctly linked
  import { Topic, useTopicSettingsContext } from '../../context/TopicSettingsContext';
  import { Stock, BorderMap } from '../../utils/global';
  import Head from '../../components/Head'; // Adjust the import path accordingly

  const crownIcon = "https://d16knz2r0dpe77.cloudfront.net/assets/crownlargeyellow.svg";
  const cloudFrontUrl = 'https://d16knz2r0dpe77.cloudfront.net/dashmapping.json'; // Replace with your CloudFront URL


  type Item = { label: string, logo: string, url?: string, param?: string; };

  enum Types {
    COMPANIES = 'COMPANIES',
    THEMES = 'THEMES',
    PEOPLE = 'PEOPLE',
  }

  type HeaderProps = {
  activeType: Types;
  setActiveType: (type: Types) => void;
};

  const items: {[key in Types]: Item[]} = {
    [Types.COMPANIES]: [
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/teslalong.svg', url: '/data' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/nvidialong.svg', url: '/data', param:'nvidia' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/metalogo.svg', url: '/data', param:'meta' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/microsoftlong.svg', url: '/data', param:'microsoft' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/applelong.svg', url: '/data', param:'apple' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/amazon.svg', url: '/data', param:'amazon' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/spotifylong.svg', url: '/data', param:'spotify' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/netflixlong.svg', url: '/data', param:'netflix' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/alphabet.svg', url: '/data', param:'alphabet' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/tkologo.svg', url: '/data', param:'tko' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/disneylogo.svg', url: '/data', param:'disney' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/amdlong.svg', url: '/data', param:'amd' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/tsmclogo.svg', url: '/data', param:'tsmc' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/novonordisklogo.svg', url: '/data', param:'novonordisk' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/costcologo.svg', url: '/data', param:'costco' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/berkshirelogo.svg', url: '/data', param:'berkshire' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/intuitivelong.svg', url: '/data', param:'intuitivesurgical' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/tencentlong.svg', url: '/data', param:'tencent' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/jpmorganlogo.svg', url: '/data', param:'jpmorgan' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/exxonlogo.svg', url: '/data', param:'exxon' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/visalogo.svg', url: '/data', param:'visa' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/snowflakelong.svg', url: '/data', param:'snowflake' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/celsiuslong.svg', url: '/data', param:'celsius' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/mcdonaldslong.svg', url: '/data', param:'mcdonalds' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/ferrarilong.svg', url: '/data', param:'ferrari' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/uberlong.svg', url: '/data', param:'uber' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/lvmhlong.svg', url: '/data', param:'lvmh' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/elilillylogo.svg', url: '/data', param:'elililly' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/unitedhealthcarelong.svg', url: '/data', param:'unitedhealth' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/broadcomlong.svg', url: '/data', param:'broadcom' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/walmartlong.svg', url: '/data', param:'walmart' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/mastercardlong.svg', url: '/data', param:'mastercard' },
      { label: '', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/palantirlong.svg', url: '/data', param:'palantir' },    
    ],
    [Types.THEMES]: [
      { label: 'USA', logo: 'https://d16knz2r0dpe77.cloudfront.net/USA/us_logo.svg', url: '/data', param: 'USA' },
      { label: 'AI', logo: 'https://d16knz2r0dpe77.cloudfront.net/AI/AI_logo.svg' }
    ],
    [Types.PEOPLE]: [
      { label: 'STEPHEN CURRY', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/stephcurry_logo.svg' },
      { label: 'MICHAEL JORDAN', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/jordan.svg' },
      { label: 'TAYLOR SWIFT', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/taylorswift_logo.svg' },
    ]
  };


  const logoMap: { [key: string]: string } = {
    AAPL: "https://d16knz2r0dpe77.cloudfront.net/logos/AAPL.svg",
    MSFT: "https://d16knz2r0dpe77.cloudfront.net/logos/MSFT.svg",
    TSLA: "https://d16knz2r0dpe77.cloudfront.net/logos/TSLA.svg",
    AMZN: "https://d16knz2r0dpe77.cloudfront.net/logos/AMZN.svg",
    GOOG: "https://d16knz2r0dpe77.cloudfront.net/logos/GOOG.svg",
    NVDA: "https://d16knz2r0dpe77.cloudfront.net/logos/NVDA.svg",
    META: "https://d16knz2r0dpe77.cloudfront.net/logos/META.svg",
    LLY: "https://d16knz2r0dpe77.cloudfront.net/logos/LLY.svg",
    COST: "https://d16knz2r0dpe77.cloudfront.net/logos/COST.svg",
    V: "https://d16knz2r0dpe77.cloudfront.net/logos/V.svg",
    WMT: "https://d16knz2r0dpe77.cloudfront.net/logos/WMT.svg",
    AVGO: "https://d16knz2r0dpe77.cloudfront.net/logos/AVGO.svg",
    UNH: "https://d16knz2r0dpe77.cloudfront.net/logos/UNH.svg",
    NVO: "https://d16knz2r0dpe77.cloudfront.net/logos/NVO.svg",
    TSM: "https://d16knz2r0dpe77.cloudfront.net/logos/TSM.svg",
    XOM: "https://d16knz2r0dpe77.cloudfront.net/logos/XOM.svg",
    JPM: "https://d16knz2r0dpe77.cloudfront.net/logos/JPM.svg",
    HD: "https://d16knz2r0dpe77.cloudfront.net/logos/HD.svg",
    ORCL: "https://d16knz2r0dpe77.cloudfront.net/logos/ORCL.svg",
    PG: "https://d16knz2r0dpe77.cloudfront.net/logos/PG.svg",
    MA: "https://d16knz2r0dpe77.cloudfront.net/logos/MA.svg",
    JNJ: "https://d16knz2r0dpe77.cloudfront.net/logos/JNJ.svg",
    ABBV: "https://d16knz2r0dpe77.cloudfront.net/logos/ABBV.svg",
    BAC: "https://d16knz2r0dpe77.cloudfront.net/logos/BAC.svg",
    NFLX: "https://d16knz2r0dpe77.cloudfront.net/logos/NFLX.svg",
    KO: "https://d16knz2r0dpe77.cloudfront.net/logos/KO.svg",
    CRM: "https://d16knz2r0dpe77.cloudfront.net/logos/CRM.svg",
    MRK: "https://d16knz2r0dpe77.cloudfront.net/logos/MRK.svg",
    CVX: "https://d16knz2r0dpe77.cloudfront.net/logos/CVX.svg",
    AMD: "https://d16knz2r0dpe77.cloudfront.net/logos/AMD.svg"
  };


  const colorMap: { [key: string]: string } = {
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

  const sharesOutstandingMap: { [key: string]: number } = {
      META: 2524488533,
      MSFT: 7434880776,
      TSLA: 3210059659,
      AMZN: 10515011008,
      GOOG: 5843000000,
      AAPL: 15115823000,
      NVDA: 24530000000,
      LLY: 949315694,
      COST: 443073537,
      V: 1610000000,
      WMT: 8038251174,
      AVGO: 4670576083,
      UNH: 920284334,
      NVO: 4457700000,
      XOM: 4395094536,
      JPM: 2815340422,
      HD: 993293377,
      ORCL: 2770968000,
      PG: 2355041729,
      MA: 933000000,
      TSM: 5185514310,
      JNJ: 2407622972,
      ABBV: 1767140323,
      BAC: 7672879599,
      NFLX: 427458114,
      KO: 4307797138,
      CRM: 956000000,
      MRK: 2534809312,
      CVX: 1828917113,
      AMD: 1622807346
    };


  const initialTickers: { [key: string]: Stock } = {
    AAPL: { s: "AAPL", p: null, t: 0, marketCap: null, logo: logoMap.AAPL, sharesoutstanding: sharesOutstandingMap.AAPL, color: colorMap.AAPL, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    MSFT: { s: "MSFT", p: null, t: 0, marketCap: null, logo: logoMap.MSFT, sharesoutstanding: sharesOutstandingMap.MSFT, color: colorMap.MSFT, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    TSLA: { s: "TSLA", p: null, t: 0, marketCap: null, logo: logoMap.TSLA, sharesoutstanding: sharesOutstandingMap.TSLA, color: colorMap.TSLA, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    NVDA: { s: "NVDA", p: null, t: 0, marketCap: null, logo: logoMap.NVDA, sharesoutstanding: sharesOutstandingMap.NVDA, color: colorMap.NVDA, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    META: { s: "META", p: null, t: 0, marketCap: null, logo: logoMap.META, sharesoutstanding: sharesOutstandingMap.META, color: colorMap.META, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    GOOG: { s: "GOOG", p: null, t: 0, marketCap: null, logo: logoMap.GOOG, sharesoutstanding: sharesOutstandingMap.GOOG, color: colorMap.GOOG, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    AMZN: { s: "AMZN", p: null, t: 0, marketCap: null, logo: logoMap.AMZN, sharesoutstanding: sharesOutstandingMap.AMZN, color: colorMap.AMZN, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    TSM: { s: "TSM", p: null, t: 0, marketCap: null, logo: logoMap.TSM, sharesoutstanding: sharesOutstandingMap.TSM, color: colorMap.TSM, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    AVGO: { s: "AVGO", p: null, t: 0, marketCap: null, logo: logoMap.AVGO, sharesoutstanding: sharesOutstandingMap.AVGO, color: colorMap.AVGO, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    LLY: { s: "LLY", p: null, t: 0, marketCap: null, logo: logoMap.LLY, sharesoutstanding: sharesOutstandingMap.LLY, color: colorMap.LLY, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    WMT: { s: "WMT", p: null, t: 0, marketCap: null, logo: logoMap.WMT, sharesoutstanding: sharesOutstandingMap.WMT, color: colorMap.WMT, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    JPM: { s: "JPM", p: null, t: 0, marketCap: null, logo: logoMap.JPM, sharesoutstanding: sharesOutstandingMap.JPM, color: colorMap.JPM, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    NVO: { s: "NVO", p: null, t: 0, marketCap: null, logo: logoMap.NVO, sharesoutstanding: sharesOutstandingMap.NVO, color: colorMap.NVO, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    V: { s: "V", p: null, t: 0, marketCap: null, logo: logoMap.V, sharesoutstanding: sharesOutstandingMap.V, color: colorMap.V, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    UNH: { s: "UNH", p: null, t: 0, marketCap: null, logo: logoMap.UNH, sharesoutstanding: sharesOutstandingMap.UNH, color: colorMap.UNH, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    XOM: { s: "XOM", p: null, t: 0, marketCap: null, logo: logoMap.XOM, sharesoutstanding: sharesOutstandingMap.XOM, color: colorMap.XOM, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    ORCL: { s: "ORCL", p: null, t: 0, marketCap: null, logo: logoMap.ORCL, sharesoutstanding: sharesOutstandingMap.ORCL, color: colorMap.ORCL, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    MA: { s: "MA", p: null, t: 0, marketCap: null, logo: logoMap.MA, sharesoutstanding: sharesOutstandingMap.MA, color: colorMap.MA, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    PG: { s: "PG", p: null, t: 0, marketCap: null, logo: logoMap.PG, sharesoutstanding: sharesOutstandingMap.PG, color: colorMap.PG, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    HD: { s: "HD", p: null, t: 0, marketCap: null, logo: logoMap.HD, sharesoutstanding: sharesOutstandingMap.HD, color: colorMap.HD, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    COST: { s: "COST", p: null, t: 0, marketCap: null, logo: logoMap.COST, sharesoutstanding: sharesOutstandingMap.COST, color: colorMap.COST, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    JNJ: { s: "JNJ", p: null, t: 0, marketCap: null, logo: logoMap.JNJ, sharesoutstanding: sharesOutstandingMap.JNJ, color: colorMap.JNJ, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    ABBV: { s: "ABBV", p: null, t: 0, marketCap: null, logo: logoMap.ABBV, sharesoutstanding: sharesOutstandingMap.ABBV, color: colorMap.ABBV, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    BAC: { s: "BAC", p: null, t: 0, marketCap: null, logo: logoMap.BAC, sharesoutstanding: sharesOutstandingMap.BAC, color: colorMap.BAC, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    NFLX: { s: "NFLX", p: null, t: 0, marketCap: null, logo: logoMap.NFLX, sharesoutstanding: sharesOutstandingMap.NFLX, color: colorMap.NFLX, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    KO: { s: "KO", p: null, t: 0, marketCap: null, logo: logoMap.KO, sharesoutstanding: sharesOutstandingMap.KO, color: colorMap.KO, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    CRM: { s: "CRM", p: null, t: 0, marketCap: null, logo: logoMap.CRM, sharesoutstanding: sharesOutstandingMap.CRM, color: colorMap.CRM, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    MRK: { s: "MRK", p: null, t: 0, marketCap: null, logo: logoMap.MRK, sharesoutstanding: sharesOutstandingMap.MRK, color: colorMap.MRK, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    CVX: { s: "CVX", p: null, t: 0, marketCap: null, logo: logoMap.CVX, sharesoutstanding: sharesOutstandingMap.CVX, color: colorMap.CVX, adjustedclose: 0, initialPrice: 0, priceChange: 0 },
    AMD: { s: "AMD", p: null, t: 0, marketCap: null, logo: logoMap.AMD, sharesoutstanding: sharesOutstandingMap.AMD, color: colorMap.AMD, adjustedclose: 0, initialPrice: 0, priceChange: 0 }
  };


  const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { setActiveTopic } = useTopicSettingsContext();
    const [activeType, setActiveType] = useState<Types>(Types.COMPANIES);
    const [clickedCard, setClickedCard] = useState<string | null>(null); // To track which card was clicked for animation
    const [isExiting, setIsExiting] = useState(false);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

      // Fetch dashmapping.json from CloudFront
    useEffect(() => {
      const fetchDashmapping = async () => {
        try {
          const response = await fetch(cloudFrontUrl);
          const data = await response.json();
          
          // Map the fetched data to your stock state structure
          const mappedStocks = data.map((stock: any) => ({
            ...stock,
            marketCap: stock.sharesoutstanding * stock.adjustedclose,
            initialPrice: stock.adjustedclose,
            priceChange: 0,
            p: null,
            t: 0
          }));

          setStocks(mappedStocks); // Update state with the fetched data
        } catch (error) {
          console.error('Error fetching dashmapping data:', error);
        }
      };

      fetchDashmapping();
    }, []); // Empty dependency array ensures

    useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight) {
        // User has scrolled to the bottom of the page
        switch (activeType) {
          case Types.COMPANIES:
            setActiveType(Types.THEMES);
            break;
          case Types.THEMES:
            setActiveType(Types.PEOPLE);
            break;
          case Types.PEOPLE:
            // Do nothing, as we've reached the end
            break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeType]);

    const [stocks, setStocks] = useState<Stock[]>([]); // Initialize as empty array

    const repeatedZoomVariants: Variants = {
      initial: { 
        scale: 1,  // Initial scale (normal size)
        opacity: 1,
        // Remove zIndex from initial and exit to minimize layout impact
      },
      clicked: { 
        scale: [1.1, 1.2, 1.3, 1.4],  // Progressive zoom steps
        opacity: 1,
        zIndex: 999,  // Only add zIndex for clicked state to ensure it's on top
        transition: {
          duration: .5,  // Total duration of the zoom effect
          ease: "easeInOut",
          repeat: 1,  // Repeat the zoom effect
          repeatType: "loop",  // Loop the zoom animation continuously
          repeatDelay: 0.2,  // Small delay between repetitions
        }
      },
      exit: { 
        opacity: 0, 
        transition: { duration: 0.5, ease: "easeInOut" }
      },
    };


  const handleCardClick = (stock: Stock) => {
    setClickedCard(stock.s); // Mark which card was clicked
    setActiveTopic(stock.s as Topic); // Set active topic
  };

    const onCardAnimationComplete = (stock: Stock) => {
    navigate(`/data?topic=${stock.s}`);
  };

    const [previousMarketCap, setPreviousMarketCap] = useState<{[key: string]: number}>({});
    const [previousMarketCapChange, setPreviousMarketCapChange] = useState<{[key: string]: number}>({});
    const [previousRanks, setPreviousRanks] = useState<{[key: string]: number}>({});
    const [initialRanks, setInitialRanks] = useState<{[key: string]: number}>({});
    const [rankLoaded, setRankLoaded] = useState(false); // 
    const [borderMap, setBorderMap] = useState<BorderMap>({});

    useEffect(() => {
      if (isExiting && selectedStock) {
        // Wait for the exit animation to complete
        const timer = setTimeout(() => {
          navigate(`/data?topic=${selectedStock.s}`);
        }, 500);  // Adjust based on the animation duration
        return () => clearTimeout(timer);
      }
    }, [isExiting, selectedStock, navigate]);

    useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://cheat-6bc2732715c1.herokuapp.com/ticker');
      const data = await response.json();

      if (Array.isArray(data)) {
        setStocks((prevStocks: Stock[]) => {
          const stockMap = prevStocks.reduce<{[key: string]: Stock}>((acc, stock) => {
            acc[stock.s] = stock;
            return acc;
          }, {});


         data.forEach((item: any) => {
            const previousPrice = stockMap[item.s]?.initialPrice || stockMap[item.s]?.adjustedclose;
            const latestPrice = item.p || previousPrice; // Use latest price from API or fallback to adjustedclose
            const priceChange = item.p ? item.p - previousPrice : 0;  // Calculate price change if new price exists

            if (stockMap[item.s]) {
              stockMap[item.s] = {
                ...stockMap[item.s],
                p: item.p || null,
                marketCap: (sharesOutstandingMap[item.s] || 0) * latestPrice,
                priceChange
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
            }
          });

          const updatedStocks = Object.values(stockMap).sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0));
          
          // If ranks are not yet loaded, store initial ranks
          if (!rankLoaded) {
            const initialRanks = updatedStocks.reduce<{[key: string]: number}>((acc, stock, index) => {
              acc[stock.s] = index + 1;
              return acc;
            }, {});
            setInitialRanks(initialRanks);
            setRankLoaded(true);
          }

          // Calculate current ranks
          const currentRanks = updatedStocks.reduce<{[key: string]: number}>((acc, stock, index) => {
            acc[stock.s] = index + 1;
            return acc;
          }, {});

          // Calculate rank changes based on initial ranks
          const rankChanges = Object.keys(currentRanks).reduce<{[key: string]: number}>((acc, stockSymbol) => {
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


    const getBorderClass = (priceChange: number): string => {
      if (priceChange > 0) {
        return 'positive';
      } else if (priceChange < 0) {
        return 'negative';
      } else {
        return 'neutral'; // For no change
      }
    };

    const getRankChangeIndicator = (rankChange: number): JSX.Element => {
      if (rankChange > 0) {
        return <span className="rank-up">▲ {rankChange}</span>; // Green for rank up
      } else if (rankChange < 0) {
        return <span className="rank-down">▼ {Math.abs(rankChange)}</span>; // Red for rank down
      } else {
        return <span className="rank-neutral">●</span>; // Neutral for no change
      }
    };

    const onClick = (url: string, topic: string = '') => {
      if (!url) return;
      setActiveTopic(topic as Topic || Topic.Default);
      url = topic ? `${url}?topic=${topic}` : url;
      navigate(url);
    };
    


    return (
      <div>
         <Head activeType={activeType} setActiveType={setActiveType} />
          {/* Render the content for the active type */}
          {activeType === Types.COMPANIES && <div></div>}
          {activeType === Types.THEMES && <div></div>}
          {activeType === Types.PEOPLE && <div></div>}
        <div className="my-4 text-center">
      </div>

        <AnimatePresence>
          {activeType === Types.COMPANIES && (
            <div className="market-grid mt-4">
              {stocks.map((stock, index) => (
                <motion.div
                  key={stock.s}
                  onClick={() => handleCardClick(stock)}
                  className={`company-border-container ${borderMap[stock.s]?.className || 'neutral'}`}
                  initial="initial"
                  animate={clickedCard === stock.s ? "clicked" : "initial"}
                  exit="exit"
                  variants={repeatedZoomVariants}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  onAnimationComplete={() => {
                    if (clickedCard === stock.s) {
                      onCardAnimationComplete(stock);
                    }
                  }}
                  style={{
                    background: 'transparent',
                    '--hover-color': colorMap[stock.s] || '#111',
                  } as React.CSSProperties}
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
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {(activeType === Types.THEMES || activeType === Types.PEOPLE) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 m-auto mt-4">
            {items[activeType].map((item) => (
              <div
                key={item.label || item.logo}
                className={cn([
                  'p-2 mb-4 w-[180px] m-auto relative border-2 border-transparent rounded-xl',
                  item.url ? 'hover:border-gray-700 hover:bg-opacity-40 hover:bg-black cursor-pointer hover:text-black' : 'cursor-not-allowed opacity-50'
                ])}
                onClick={() => onClick(item.url, item.param)}
              >
                {!item?.url && <div className="bg-black bg-opacity-10 absolute top-0 w-full h-full"></div>}
                <img
                  src={item.logo}
                  className='w-[80px] h-[80px] mb-4 m-auto'
                  alt={item.label}
                />
                <div className={cn(["mx-2 text-center", !item?.url ? 'text-gray-500' : 'text-white'])}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {!items[activeType].length && <p className="align-center uppercase">No Topics available</p>}
      </div>
    );
  };

export default Dashboard;
