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
  Costco ='costco',
  Intuitivesurgical = 'intuitivesurgical',
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
}

const settings: {[key in Topic]: Setting } = {
    nvidia: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/NVDA.US/NVDA.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/nvidia_mini.svg"
  },
    meta: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/META.US/META.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/metalogo.svg"
  },
    curry: {
    datamappingUrl: '/steph/datamapping_steph.json',
    tabMenu: ['data'],
    theme: { primary: '#FFC214', secondary: '#0000FF' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/steph_pagelogo.svg"
  },
    apple: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/AAPL.US/AAPL.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/applelong.svg"
  },
    microsoft: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/MSFT.US/MSFT.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/microsoftlong.svg"
  },
    alphabet: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/GOOG.US/GOOG.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/alphabetlong.svg"
  },
    netflix: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/NFLX.US/NFLX.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/netflixlong.svg"
  },
    amazon: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/AMZN.US/AMZN.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/amazonlong.svg"
  },
    spotify: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/SPOT.US/SPOT.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/spotifylong.svg"
  },
    tsmc: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/TSM.US/TSM.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/tsmclong.svg"
  },
    snowflake: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/SNOW.US/SNOW.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/snowflakelong.svg"
  },
    tko: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/TKO.US/TKO.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/tkologo.svg"
  },
    celsius: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/CELH.US/CELH.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/celsiuslong.svg"
  },
    uber: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/UBER.US/UBER.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/uberlong.svg"
  },
    mcdonalds: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/MCD.US/MCD.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/celsiuslong.svg"
  },
    ferrari: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/RACE.US/RACE.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/celsiuslong.svg"
  },
    disney: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/DIS.US/DIS.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/disneylong.svg"
  },
    amd: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/AMD.US/AMD.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/amdlogo.svg"
  },
    lvmh: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/LVMHF.US/LVMHF.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/lvmhlogo.svg"
  },
    elililly: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/LLY.US/LLY.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/elilillylogo.svg"
  },
    novonordisk: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/NVO.US/NVO.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/novonordisklogo.svg"
  },
    costco: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/COSTCO.US/COSTCO.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/costcologo.svg"
  },
    intuitivesurgical: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/ISRG.US/ISRG.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/intuitivesurgicallogo.svg"
  },
    default: {
    datamappingUrl: 'datamapping.json',
    tabMenu: ['sankey', 'data'],
    theme: { primary: 'black', secondary: '' },
    // logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/Tesla_logo.svg"
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
