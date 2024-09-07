import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  PropsWithChildren,
} from "react";

export enum Topic {
  Nvidia = 'nvidia',
  Curry = 'curry',
  USA = 'usa',
  Meta = 'meta',
  Apple = 'apple',
  Microsoft = 'microsoft',
  Alphabet = 'alphabet',
  Netflix = 'netflix',
  Amazon = 'amazon',
  Snowflake = 'snowflake',
  TSMC = 'tsmc',
  Spotify = 'spotify',
  Celsius = 'celsius',
  TKO = 'tko',
  McDonalds = 'mcdonalds',
  Disney = 'disney',
  Uber = 'uber',
  Ferrari = 'ferrari',
  EliLilly = 'elililly',
  AMD = 'amd',
  Novonordisk ='novonordisk',
  LVMH = 'lvmh',
  Costco = 'costco',
  Intuitivesurgical = 'intuitivesurgical',
  Unitedhealth = 'unitedhealth',
  Tencent = 'tencent',
  Berkshire = 'berkshire',
  Mastercard = 'mastercard',
  Walmart = 'walmart',
  Visa = 'visa',
  Jpmorgan = 'jpmorgan',
  Broadcom = 'broadcom',
  Exxon = 'exxon',
  Palantir = 'palantir',
  Artificialintelligence = 'ai',
  Default = 'default'
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
    nvidia: {
    datamappingUrl: '/NVDA.US/NVDA.US_metrics_mapping.json',
    tabMenu: ['sankey', 'data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/nvidia_mini.svg",
    sankeyDatamappingUrl: "/NVDA.US/sankeynvda.json"
  },
    meta: {
    datamappingUrl: '/META.US/META.US_metrics_mapping.json',
    tabMenu: ['sankey', 'data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/metalogo.svg",
    sankeyDatamappingUrl: "/TSLA.US/sankeytesla.json"
  },
    curry: {
    datamappingUrl: '/steph/datamapping_steph.json',
    tabMenu: ['data'],
    theme: { primary: '#FFC214', secondary: '#151C62' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/steph_pagelogo.svg"
  },
    usa: {
    datamappingUrl: '/USA/mapping_usa.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/USA/us_flag.svg"
  },
    apple: {
    datamappingUrl: '/AAPL.US/AAPL.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/applelong.svg"
  },
    microsoft: {
    datamappingUrl: '/MSFT.US/MSFT.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/microsoftlong.svg"
  },
    alphabet: {
    datamappingUrl: '/GOOG.US/GOOG.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/alphabetlong.svg"
  },
    netflix: {
    datamappingUrl: '/NFLX.US/NFLX.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/netflixlong.svg"
  },
    amazon: {
    datamappingUrl: '/AMZN.US/AMZN.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/amazonlong.svg"
  },
    spotify: {
    datamappingUrl: '/SPOT.US/SPOT.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/spotifylong.svg"
  },
    tsmc: {
    datamappingUrl: '/TSM.US/TSM.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/tsmclong.svg"
  },
    snowflake: {
    datamappingUrl: '/SNOW.US/SNOW.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/snowflakelong.svg"
  },
    tko: {
    datamappingUrl: '/TKO.US/TKO.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/tkologo.svg"
  },
    celsius: {
    datamappingUrl: '/CELH.US/CELH.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/celsiuslong.svg"
  },
    uber: {
    datamappingUrl: '/UBER.US/UBER.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/uberlong.svg"
  },
    mcdonalds: {
    datamappingUrl: '/MCD.US/MCD.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/mcdonaldslong.svg"
  },
    ferrari: {
    datamappingUrl: '/RACE.US/RACE.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/celsiuslong.svg"
  },
    disney: {
    datamappingUrl: '/DIS.US/DIS.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/disneylong.svg"
  },
    amd: {
    datamappingUrl: '/AMD.US/AMD.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/amdlong.svg"
  },
    lvmh: {
    datamappingUrl: '/LVMHF.US/LVMHF.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/lvmhlogo.svg"
  },
    elililly: {
    datamappingUrl: '/LLY.US/LLY.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/elilillylogo.svg"
  },
    novonordisk: {
    datamappingUrl: '/NVO.US/NVO.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/novonordisklong.svg"
  },
    costco: {
    datamappingUrl: '/COSTCO.US/COSTCO.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/costcologo.svg"
  },
    intuitivesurgical: {
    datamappingUrl: '/ISRG.US/ISRG.US_metrics_mapping.json',
    tabMenu: ['data', 'sankey'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/intuitivesurgicallogo.svg"
  },
    berkshire: {
    datamappingUrl: '/BRK-B.US/BRK-B.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/berkshirelong.svg"
  },
    tencent: {
    datamappingUrl: '/TCEHY.US/TCEHY.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/tencentlogo.svg"
  },
    unitedhealth: {
    datamappingUrl: '/UNH.US/UNH.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/unhlogo.svg"
  },
    mastercard: {
    datamappingUrl: '/MA.US/MA.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/mastercardlong.svg"
  },
    visa: {
    datamappingUrl: '/V.US/V.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/visalogo.svg"
  },
    jpmorgan: {
    datamappingUrl: '/JPM.US/JPM.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/jpmorganlogo.svg"
  },
    broadcom: {
    datamappingUrl: '/AVGO.US/AVGO.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/broadcomlong.svg"
  },
    exxon: {
    datamappingUrl: '/XOM.US/XOM.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/exxonlogo.svg"
  },
    walmart: {
    datamappingUrl: '/WMT.US/WMT.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/walmartlong.svg"
  },
    palantir: {
    datamappingUrl: '/PLTR.US/PLTR.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/Logos/palantirlong.svg"
  },
    ai: {
    datamappingUrl: '/AI/mapping_AI.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://d16knz2r0dpe77.cloudfront.net/AI/ailogolong.svg"
  },
    default: {
    datamappingUrl: '/TSLA.US/TSLA.US_metrics_mapping.json',
    tabMenu: ['sankey', 'data'],
    theme: { primary: 'black', secondary: '' },
    sankeyDatamappingUrl: "/TSLA.US/sankeytesla.json"
  }
}

const TopicSettingsContext = createContext<TopicContextType | undefined>(undefined);

const TopicSettingsContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [activeTopic, setActiveTopic] = useState<Topic>(Topic.Default);

  const activeTheme = settings[activeTopic].theme;
  const menuTabsToShow = settings[activeTopic].tabMenu;
  const datamappingUrl = settings[activeTopic].datamappingUrl;

  const value = useMemo(
    () => ({
      activeTopic,
      activeTheme,
      menuTabsToShow,
      datamappingUrl,
      settings: settings[activeTopic],
      setActiveTopic
    }),
    [activeTheme, menuTabsToShow, datamappingUrl, activeTopic, setActiveTopic],
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
