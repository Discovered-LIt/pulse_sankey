import React from "react";
import cn from 'classnames';
// context
import { useTopicSettingsContext } from "../context/TopicSettingsContext";

const Header = () => {
  const { settings } = useTopicSettingsContext();
  const bgClr = settings.theme.primary || 'black';

  return <div className={cn(`w-full h-12 bg-[${bgClr}]`)} />;
};

export default Header;
