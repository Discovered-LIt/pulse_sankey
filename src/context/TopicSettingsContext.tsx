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
  Celsius = 'celsius',
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
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/logo-amazon.svg"
  },
    snowflake: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/SNOW.US/SNOW.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/snowflakelong.svg"
  },
    celsius: {
    datamappingUrl: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/CELH.US/CELH.US_metrics_mapping.json',
    tabMenu: ['data'],
    theme: { primary: 'black', secondary: '' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/celsiuslong.svg"
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
