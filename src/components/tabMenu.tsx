import React, { useEffect, useMemo } from "react";
import cn from "classnames";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
// components
import StephenCurryLoading from "./stephenCurryLoading";
// context
import { useTopicSettingsContext, Topic } from "../context/TopicSettingsContext";
// logo
import teslaLogo from '../assets/tesla-logo.svg';

const TabMenu = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const { activeTopic, menuTabsToShow, settings, setActiveTopic } = useTopicSettingsContext();

  useEffect(() => {
    let topic = searchParams.get('topic');
    topic = Object.values(Topic).includes(topic as Topic) ? topic : Topic.Default;
    setActiveTopic(topic as Topic)
  }, []);

  const tabs = useMemo((): { name: string, link: string }[] => {
    if(!activeTopic) return;
    const items = [
      { name: 'data', link: '/data'},
      { name: 'FORECAST', link: '/sankey'},
    ]
    return items.filter(({ name }) => menuTabsToShow.includes(name.toLowerCase()));
  }, [activeTopic])
  
  const linkClickHandler = (e: any, route: string) => {
    e.preventDefault()
    navigate(route)
  }

  const secondaryClr = settings.theme.secondary || '#9BA3AF';

  return (
    <div>
      {activeTopic === Topic.Curry && <StephenCurryLoading />}
      <div className={cn([
        "flex",
        `bg-[${settings.theme.primary || 'black'}]`,
      ])}>
        <img
          src={settings.logo || teslaLogo}
          className="w-[100px] sm:w-[150px] mx-4 sm:mx-8 cursor-pointer"
          onClick={() => navigate('/')}
        />
        <div className="border-b w-full" style={{ borderColor: secondaryClr }}>
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map(({ name, link }) => (
              <a
                key={name}
                href={'#'}
                onClick={(e) => linkClickHandler(e, link)}
                className={cn(pathname === link ? `font-bold border-b-2 border-[${secondaryClr}] text-[${secondaryClr}]` : 
                  `border-transparent text-gray-400 hover:border-[${secondaryClr}] hover:text-[${secondaryClr}] font-medium`,
                  'whitespace-nowrap py-4 px-1 text-sm'
                )}
                style={{ borderColor: secondaryClr }}
                aria-current={true ? 'page' : undefined}
              >
                {name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default TabMenu;
