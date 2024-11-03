import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  PropsWithChildren,
} from "react";

export enum Topic {
  Nvidia = 'NVDA',
  Curry = 'CURRY',
  USA = 'USA',
  Meta = 'META',
  Apple = 'AAPL',
  Microsoft = 'MSFT',
  Alphabet = 'GOOG',
  Netflix = 'NFLX',
  Amazon = 'AMZN',
  Snowflake = 'SNOW',
  TSMC = 'TSM',
  Spotify = 'SPOT',
  Celsius = 'CELH',
  TKO = 'TKO',
  McDonalds = 'MCD',
  Disney = 'DIS',
  Uber = 'UBER',
  Ferrari = 'RACE',
  EliLilly = 'LLY',
  AMD = 'AMD',
  Novonordisk ='NVO',
  Costco = 'COST',
  Intuitivesurgical = 'ISRG',
  Unitedhealth = 'UNH',
  Mastercard = 'MA',
  Walmart = 'WMT',
  Visa = 'V',
  Jpmorgan = 'JPM',
  Broadcom = 'AVGO',
  Exxon = 'XOM',
  Palantir = 'PLTR',
  Artificialintelligence = 'AI',
  Coke = 'KO',
  CVX = 'CVX',
  MRK = 'MRK',
  ABBV = 'ABBV',
  CRM = 'CRM',
  ORCL = 'ORCL',
  JNJ = 'JNJ',
  HD = 'HD',
  PG = 'PG',
  Default = 'DEFAULT'
}

export interface TopicContextType {
  setActiveTopic: (topic: Topic) => void;
  activeTheme: { primary: string, secondary: string };
  menuTabsToShow: string[];
  datamappingUrl: string;
  activeTopic: Topic;
  settings: Setting;
}

type Setting = {
  datamappingUrl: string;
  tabMenu: string[];
  theme: { primary: string, secondary: string };
  logo?: string;
  sankeyDatamappingUrl?: string;
}

const settings: {[key in Topic]: Setting } = {
    NVDA: {
    datamappingUrl: '/NVDA.US/NVDA.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/nvidia_mini.svg",
    sankeyDatamappingUrl: "/NVDA.US/sankeynvda.json"
  },
    META: {
    datamappingUrl: '/META.US/META.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/metalogo.svg",
    sankeyDatamappingUrl: "/TSLA.US/sankeytesla.json"
  },
    CURRY: {
    datamappingUrl: '/steph/datamapping_steph.json',
    tabMenu: ['data'],
    theme: { primary: '#FFC214', secondary: '#151C62' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/steph_pagelogo.svg"
  },
    USA: {
    datamappingUrl: '/USA/mapping_usa.json',
    tabMenu: ['data', 'dollarbreakdown', 'immigrationvisualization'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/USA/us_flag.svg"
  },
    AAPL: {
    datamappingUrl: '/AAPL.US/AAPL.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/applelong.svg"
  },
    MSFT: {
    datamappingUrl: '/MSFT.US/MSFT.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/microsoftlong.svg"
  },
    GOOG: {
    datamappingUrl: '/GOOG.US/GOOG.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/alphabetlong.svg"
  },
    NFLX: {
    datamappingUrl: '/NFLX.US/NFLX.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/netflixlong.svg"
  },
    AMZN: {
    datamappingUrl: '/AMZN.US/AMZN.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/amazonlong.svg"
  },
    SPOT: {
    datamappingUrl: '/SPOT.US/SPOT.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/spotifylong.svg"
  },
    TSM: {
    datamappingUrl: '/TSM.US/TSM.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/tsmclong.svg"
  },
    SNOW: {
    datamappingUrl: '/SNOW.US/SNOW.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/snowflakelong.svg"
  },
    TKO: {
    datamappingUrl: '/TKO.US/TKO.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/tkologo.svg"
  },
    CELH: {
    datamappingUrl: '/CELH.US/CELH.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/celsiuslong.svg"
  },
    UBER: {
    datamappingUrl: '/UBER.US/UBER.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/uberlong.svg"
  },
    MCD: {
    datamappingUrl: '/MCD.US/MCD.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/mcdonaldslong.svg"
  },
    RACE: {
    datamappingUrl: '/RACE.US/RACE.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/celsiuslong.svg"
  },
    DIS: {
    datamappingUrl: '/DIS.US/DIS.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/disneylong.svg"
  },
    AMD: {
    datamappingUrl: '/AMD.US/AMD.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/amdlong.svg"
  },
    LLY: {
    datamappingUrl: '/LLY.US/LLY.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/elilillylogo.svg"
  },
    NVO: {
    datamappingUrl: '/NVO.US/NVO.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/novonordisklong.svg"
  },
    COST: {
    datamappingUrl: '/COSTCO.US/COSTCO.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/costcologo.svg"
  },
    ISRG: {
    datamappingUrl: '/ISRG.US/ISRG.US_metrics_mapping.json',
    tabMenu: ['data', 'sankey'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/intuitivesurgicallogo.svg"
  },
    UNH: {
    datamappingUrl: '/UNH.US/UNH.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/unhlogo.svg"
  },
    MA: {
    datamappingUrl: '/MA.US/MA.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/mastercardlong.svg"
  },
    V: {
    datamappingUrl: '/V.US/V.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/visalogo.svg"
  },
    JPM: {
    datamappingUrl: '/JPM.US/JPM.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/jpmorganlogo.svg"
  },
    AVGO: {
    datamappingUrl: '/AVGO.US/AVGO.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/broadcomlong.svg"
  },
    XOM: {
    datamappingUrl: '/XOM.US/XOM.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/exxonlogo.svg"
  },
    WMT: {
    datamappingUrl: '/WMT.US/WMT.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/walmartlong.svg"
  },
    PLTR: {
    datamappingUrl: '/PLTR.US/PLTR.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/palantirlong.svg"
  },
    KO: {
    datamappingUrl: '/PLTR.US/PLTR.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/palantirlong.svg"
  },
    CVX: {
    datamappingUrl: '/PLTR.US/PLTR.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/palantirlong.svg"
  },
    MRK: {
    datamappingUrl: '/PLTR.US/PLTR.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/palantirlong.svg"
  },
    ABBV: {
    datamappingUrl: '/PLTR.US/PLTR.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/palantirlong.svg"
  },
    CRM: {
    datamappingUrl: '/PLTR.US/PLTR.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/palantirlong.svg"
  },
    ORCL: {
    datamappingUrl: '/PLTR.US/PLTR.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/palantirlong.svg"
  },
    AI: {
    datamappingUrl: '/AI/mapping_AI.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/AI/ailogolong.svg"
  },
    JNJ: {
    datamappingUrl: '/AI/mapping_AI.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/AI/ailogolong.svg"
  },
    HD: {
    datamappingUrl: '/AI/mapping_AI.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/AI/ailogolong.svg"
  },
    PG: {
    datamappingUrl: '/AI/mapping_AI.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/AI/ailogolong.svg"
  },
    DEFAULT: {
    datamappingUrl: '/TSLA.US/TSLA.US_metrics_mapping.json',
    tabMenu: ['sankey', 'data', 'howtheymakemoney'],
    theme: { primary: 'black', secondary: '' },
    sankeyDatamappingUrl: "/TSLA.US/sankeytesla.json"
  }
}

const defaultContextValue: TopicContextType = {
  setActiveTopic: () => {},
  activeTheme: { primary: 'black', secondary: '' },
  menuTabsToShow: [],
  datamappingUrl: '',
  activeTopic: Topic.Default,
  settings: settings[Topic.Default],
};

const TopicSettingsContext = createContext<TopicContextType>(defaultContextValue);

const TopicSettingsContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [activeTopic, setActiveTopic] = useState<Topic>(Topic.Default);

  const currentSettings = settings[activeTopic] || settings[Topic.Default];
  console.log('Active Topic:', activeTopic);
  console.log('Current Settings:', currentSettings);
  const activeTheme = currentSettings?.theme || { primary: 'black', secondary: '' };
  const menuTabsToShow = currentSettings?.tabMenu || [];
  const datamappingUrl = currentSettings?.datamappingUrl || '';

  const value = useMemo(
    () => ({
      activeTopic,
      activeTheme,
      menuTabsToShow,
      datamappingUrl,
      settings: currentSettings,
      setActiveTopic,
    }),
    [activeTheme, menuTabsToShow, datamappingUrl, activeTopic, setActiveTopic]
  );

  return (
    <TopicSettingsContext.Provider value={value}>{children}</TopicSettingsContext.Provider>
  );
};

export default TopicSettingsContextProvider;

export const useTopicSettingsContext = () => {
  const ctx = useContext(TopicSettingsContext);
  if (!ctx) {
    throw new Error("Something went wrong with useTopicSettingsContext");
  }
  return ctx;
};
