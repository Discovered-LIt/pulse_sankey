import React, { useState } from "react";
import cn from 'classnames';
import { useNavigate } from "react-router-dom";
// context
import { useTopicSettingsContext, Topic } from "../../context/TopicSettingsContext";

type Item = { label: string, logo: string, url?: string, param?: string; };

enum Types {
  COMPANIES = 'COMPANIES',
  THEMES = 'THEMES',
  PEOPLE = 'PEOPLE',
}

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
    { label: 'USA', logo: 'https://d16knz2r0dpe77.cloudfront.net/USA/us_logo.svg', url: '/data', param: 'usa' },
    { label: 'AI', logo: 'https://d16knz2r0dpe77.cloudfront.net/AI/AI_logo.svg', url: '/data', param: 'ai' },
  ],
  [Types.PEOPLE]: [
    { label: 'STEPHEN CURRY', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/stephcurry_logo.svg' },
    { label: 'MICHAEL JORDAN', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/jordan.svg' },
    { label: 'TAYLOR SWIFT', logo: 'https://d16knz2r0dpe77.cloudfront.net/Logos/taylorswift_logo.svg' },
  ]
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { setActiveTopic } =  useTopicSettingsContext();
  const [activeType, setActiveType] = useState<Types>(Types.COMPANIES);

  const onClick = (url: string, topic: string = '') => {
    if(!url) return;
    setActiveTopic((topic as Topic) || Topic.Default)
    url = topic ? `${url}?topic=${topic}` : url;
    navigate(url)
  }

  return(
    <div>
      <div className="my-20 text-center relative">
        <div className="sticky top-0 bg-black w-full z-50 py-4">
          {
            Object.keys(items).map((key) => (
              <button
                className={cn([
                  "border-2 rounded-xl px-4 py-[4px] text-sm sm:mr-14",
                  activeType === key ? 'border-gray-700' : 'border-transparent'
                ])}
                onClick={() => setActiveType(key as Types)}
              >{key}</button>
            ))
          }
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 m-auto mt-14">
          {items[activeType].map((item) => (
            <div
              className={cn([
                'p-2 mb-4 w-[200px] m-auto relative border-2 border-transparent rounded-xl',
                item.url ? 'hover:border-gray-700 hover:bg-opacity-40 hover:bg-black cursor-pointer hover:text-black' : 'cursor-not-allowed opacity-50'
              ])}
              onClick={() => onClick(item.url, item.param)}
            >
              {!item?.url && <div className="bg-black bg-opacity-10 absolute top-0 w-full h-full"></div>}
              <img
                src={item.logo}
                className='w-[80px] h-[100px] mb-4 m-auto'
              />
              <div className={cn(["mx-2 text-center", !item?.url ? 'text-gray-500' : 'text-white'])}>{item.label}</div>
            </div>
          ))}
        </div>
        {!items[activeType].length && <p className="align-center uppercase">No Topics available</p>}
      </div>
    </div>
  )
}

export default Dashboard;
