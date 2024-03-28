import React from "react";
import cn from "classnames";
import { useLocation, useNavigate } from "react-router-dom";
// logo
import teslaLogo from '../assets/tesla-logo.svg';

const TabMenu = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  
  const tabs: { name: string, link: string }[] = [
    { name: 'Sankey', link: '/'},
    { name: 'Data', link: '/data'},
  ]

  const linkClickHandler = (e: any, route: string) => {
    e.preventDefault()
    navigate(route)
  }

  return (
    <div className="bg-black flex">
      <img src={teslaLogo} className="w-[100px] sm:w-[150px] px-4" />
      <div className="border-b border-gray-200 w-full">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map(({ name, link }) => (
            <a
              key={name}
              href={'#'}
              onClick={(e) => linkClickHandler(e, link)}
              className={cn(pathname === link ? 'border-white text-white' : 
                'border-transparent text-gray-400 hover:border-white hover:text-white',
                'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
              )}
              aria-current={true ? 'page' : undefined}
            >
              {name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default TabMenu;
