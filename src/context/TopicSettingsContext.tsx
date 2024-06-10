import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  PropsWithChildren,
} from "react";

export enum Topic {
  Nvidia = 'nvidia', // keep it camel case and this will show in the url as well
  Curry = 'curry',
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
  nvidia: { // this should match what you added above
    datamappingUrl: '/steph/datamapping_nvidia.json', // the url of datamapping
    tabMenu: ['data'], // what tabs should be available for this topic. Like curry only has data page
    theme: { primary: '#FFC214', secondary: '#1C428A' }, // primary and secondary color of the theme you can set it as same as default values if not available
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/steph_pagelogo.svg" // This is the logo that will show near the navigation
  },
  curry: {
    datamappingUrl: '/steph/datamapping_steph.json',
    tabMenu: ['data'],
    theme: { primary: '#FFC214', secondary: '#1C428A' },
    logo: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/steph_pagelogo.svg"
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
