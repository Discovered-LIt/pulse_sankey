import React, { useState } from "react";
import cn from 'classnames';
import { useNavigate } from "react-router-dom";
// context
import { useTopicSettingsContext, Topic } from "../../context/TopicSettingsContext";

type Item = { label: string, logo: string, url?: string, param?: string; };

enum Types {
  COMPANIES = 'COMPANIES',
  PEOPLE = 'PEOPLE'
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
    { label: 'MCDONALDS', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/mcdonalds.svg' },
    { label: 'FERRARI', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/ferrari.svg' },
  ],
  [Types.PEOPLE]: [
    { label: 'STEPHEN CURRY', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/stephcurry_logo.svg', url: '/data', param: 'curry' },
    { label: 'MICHAEL JORDAN', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/jordan.svg' },
    { label: 'TAYLOR SWIFT', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/taylorswift_logo.svg' },
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
      <div className="my-20 text-center">
        {
          Object.keys(items).map((key) => (
            <button
              className={cn([
                "border-2 rounded-xl px-4 py-[4px] text-sm first:mr-14",
                activeType === key ? 'border-gray-700' : 'border-transparent'
              ])}
              onClick={() => setActiveType(key as Types)}
            >{key}</button>
          ))
        }
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
      </div>
    </div>
  )
}

export default Dashboard;
