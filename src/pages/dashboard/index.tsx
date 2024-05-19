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
    { label: 'Tesla', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/Tesla_logo.svg', url: '/data' },
    { label: 'Meta', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/meta_logo.svg' },
    { label: 'Nvidia', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/nvidia_logo.svg' },
  ],
  [Types.PEOPLE]: [
    { label: 'Stephen Curry', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/stephcurry_logo.svg', url: '/data', param: 'curry' },
    { label: 'Taylor Swift', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/taylorswift_logo.svg' },
    { label: 'Elon Musk', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/elon_logo.svg' },
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
      <div className="max-w-[600px] m-auto my-20 text-center">
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
        <div className="grid grid-cols-2 w-[300px] m-auto mt-14">
          {items[activeType].map((item) => (
            <div
              className={cn([
                'p-2 mb-4',
                item.url ? 'hover:bg-white cursor-pointer hover:text-black' : 'cursor-not-allowed'
              ])}
              onClick={() => onClick(item.url, item.param)}
            >
              <img
                src={item.logo}
                className='w-[80px] h-[100px] mb-4 m-auto'
              />
              <div className="mx-2 text-center">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
