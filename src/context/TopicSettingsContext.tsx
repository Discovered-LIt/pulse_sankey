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
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/nvidia_mini.svg",
    sankeyDatamappingUrl: "/NVDA.US/sankeynvda.json"
  },
    meta: {
    datamappingUrl: '/META.US/META.US_metrics_mapping.json',
    tabMenu: ['sankey', 'data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/metalogo.svg",
    sankeyDatamappingUrl: "/TSLA.US/sankeytesla.json"
  },
    curry: {
    datamappingUrl: '/steph/datamapping_steph.json',
    tabMenu: ['data'],
    theme: { primary: '#FFC214', secondary: '#004592' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/steph_pagelogo.svg"
  },
    usa: {
    datamappingUrl: '/USA/mapping_usa.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '#3C3B6E' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/USA/usdash.svg"
  },
    apple: {
    datamappingUrl: '/AAPL.US/AAPL.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/applelong.svg"
  },
    microsoft: {
    datamappingUrl: '/MSFT.US/MSFT.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/microsoftlong.svg"
  },
    alphabet: {
    datamappingUrl: '/GOOG.US/GOOG.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/alphabetlong.svg"
  },
    netflix: {
    datamappingUrl: '/NFLX.US/NFLX.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/netflixlong.svg"
  },
    amazon: {
    datamappingUrl: '/AMZN.US/AMZN.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/amazonlong.svg"
  },
    spotify: {
    datamappingUrl: '/SPOT.US/SPOT.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/spotifylong.svg"
  },
    tsmc: {
    datamappingUrl: '/TSM.US/TSM.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/tsmclong.svg"
  },
    snowflake: {
    datamappingUrl: '/SNOW.US/SNOW.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/snowflakelong.svg"
  },
    tko: {
    datamappingUrl: '/TKO.US/TKO.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/tkologo.svg"
  },
    celsius: {
    datamappingUrl: '/CELH.US/CELH.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/celsiuslong.svg"
  },
    uber: {
    datamappingUrl: '/UBER.US/UBER.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/uberlong.svg"
  },
    mcdonalds: {
    datamappingUrl: '/MCD.US/MCD.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/celsiuslong.svg"
  },
    ferrari: {
    datamappingUrl: '/RACE.US/RACE.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/celsiuslong.svg"
  },
    disney: {
    datamappingUrl: '/DIS.US/DIS.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/disneylong.svg"
  },
    amd: {
    datamappingUrl: '/AMD.US/AMD.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/amdlogo.svg"
  },
    lvmh: {
    datamappingUrl: '/LVMHF.US/LVMHF.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/lvmhlogo.svg"
  },
    elililly: {
    datamappingUrl: '/LLY.US/LLY.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/elilillylogo.svg"
  },
    novonordisk: {
    datamappingUrl: '/NVO.US/NVO.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/novonordisklogo.svg"
  },
    costco: {
    datamappingUrl: '/COSTCO.US/COSTCO.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/costcologo.svg"
  },
    intuitivesurgical: {
    datamappingUrl: '/ISRG.US/ISRG.US_metrics_mapping.json',
    tabMenu: ['data', 'sankey'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/intuitivesurgicallogo.svg"
  },
    berkshire: {
    datamappingUrl: '/BRK-B.US.US/BRK-B.US.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/berkshirelong.svg"
  },
    tencent: {
    datamappingUrl: '/TCEHY.US.US/TCEHY.US.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/tencentlogo.svg"
  },
    unitedhealth: {
    datamappingUrl: '/UNH.US/UNH.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/unhlogo.svg"
  },
    mastercard: {
    datamappingUrl: '/MA.US/MA.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/mastercardlong.svg"
  },
    visa: {
    datamappingUrl: '/V.US/V.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/visalogo.svg"
  },
    jpmorgan: {
    datamappingUrl: '/JPM.US/JPM.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/jpmorganlogo.svg"
  },
    broadcom: {
    datamappingUrl: '/AVGO.US/AVGO.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/broadcomlong.svg"
  },
    exxon: {
    datamappingUrl: '/XOM.US/XOM.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/exxonlogo.svg"
  },
    walmart: {
    datamappingUrl: '/WMT.US/WMT.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/walmartlong.svg"
  },
    palantir: {
    datamappingUrl: '/PLTR.US/PLTR.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/palantirlong.svg"
  },
    default: {
    datamappingUrl: 'datamapping.json',
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
