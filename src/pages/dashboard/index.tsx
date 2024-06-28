import React, { useState } from "react";
import cn from 'classnames';
import { useNavigate } from "react-router-dom";
// context
import { useTopicSettingsContext, Topic } from "../../context/TopicSettingsContext";

type Item = { label: string, logo: string, url?: string, param?: string; };

enum Types {
  COMPANIES = 'COMPANIES',
  PEOPLE = 'PEOPLE',
  THEME = 'THEME',
}

const items: {[key in Types]: Item[]} = {
  [Types.COMPANIES]: [
    { label: 'TESLA', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/Tesla_logo.svg', url: '/data' },
    { label: 'NVIDIA', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/nvidia_logo.svg', url: '/data', param:'nvidia' },
    { label: 'META', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/meta_logo.svg', url: '/data', param:'meta' },
    { label: 'MICROSOFT', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/microsoftdash.svg', url: '/data', param:'microsoft' },
    { label: 'APPLE', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/appledash.svg', url: '/data', param:'apple' },
    { label: 'NETFLIX', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/netflixdash.svg', url: '/data', param:'netflix' },
    { label: 'ALPHABET', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/alphabet.svg', url: '/data', param:'alphabet' },
    { label: 'AMAZON', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/amazon.svg', url: '/data', param:'amazon' },
    { label: 'SPOTIFY', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/spotifylogo.svg', url: '/data', param:'spotify' },
    { label: 'TKO', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/tkologo.svg', url: '/data', param:'tko' },
    { label: 'SNOWFLAKE', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/snowflakedash.svg', url: '/data', param:'snowflake' },
    { label: 'TSMC', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/tsmclogo.svg', url: '/data', param:'tsmc' },
    { label: 'CELSIUS', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/celsiuslogo.svg', url: '/data', param:'celsius' },
    { label: 'MCDONALDS', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/mcdonalds.svg', url: '/data', param:'mcdonalds' },
    { label: 'FERRARI', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/ferrarilogo.svg', url: '/data', param:'ferrari' },
    { label: 'UBER', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/uberlogo.svg', url: '/data', param:'uber' },
    { label: 'DISNEY', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/disneylogo.svg', url: '/data', param:'disney' },
    { label: 'AMD', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/amdlogo.svg', url: '/data', param:'amd' },
    { label: 'LVMH', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/lvmhlogo.svg', url: '/data', param:'lvmh' },
    { label: 'ELI LILLY', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/elilillylogo.svg', url: '/data', param:'elililly' },
    { label: 'NOVO NORDISK', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/novonordisklogo.svg', url: '/data', param:'novonordisk' },
    { label: 'COSTCO', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/costcologo.svg', url: '/data', param:'costco' },
    { label: 'INTUITIVE SURGICAL', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/intuitivesurgicallogo.svg', url: '/data', param:'intuitivesurgical' },
  ],
  [Types.PEOPLE]: [
    { label: 'STEPHEN CURRY', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/stephcurry_logo.svg', url: '/data', param: 'curry' },
    { label: 'MICHAEL JORDAN', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/jordan.svg' },
    { label: 'TAYLOR SWIFT', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/taylorswift_logo.svg' },
  ],
  [Types.THEME]: [
    { label: 'ARTIFICAL INTELLIGENCE', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/ailogo.svg', url: '/data', param: 'curry' },
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
