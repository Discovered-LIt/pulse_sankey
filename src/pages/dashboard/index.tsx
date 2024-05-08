import React from "react";
import cn from 'classnames';
import { useNavigate } from "react-router-dom";
// context
import { useTopicSettingsContext, Topic } from "../../context/TopicSettingsContext";

type Item = { label: string, logo: string, url?: string, param?: string; };

const items: {[key: string]: Item[]} = {
  "PEOPLE": [
    { label: 'Stephen Curry', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/stephcurry_logo.svg', url: '/data', param: 'curry' },
    { label: 'Taylor Swift', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/taylorswift_logo.svg' },
    { label: 'Elon Musk', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/elon_logo.svg' },
  ],
  "BUSINESS": [
    { label: 'Tesla', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/Tesla_logo.svg', url: '/sankey' },
    { label: 'Meta', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/meta_logo.svg' },
    { label: 'Nvidia', logo: 'https://pulse-stockprice.s3.us-east-2.amazonaws.com/Logos/nvidia_logo.svg' },
  ]
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { setActiveTopic } =  useTopicSettingsContext();

  const onClick = (url: string, topic: string = '') => {
    if(!url) return;
    setActiveTopic((topic as Topic) || Topic.Default)
    url = topic ? `${url}?topic=${topic}` : url;
    navigate(url)
  }

  return(
    <div>
      <h1 className="mb-10 text-center mt-10">TOPICS</h1>
      <div className="max-w-[600px] m-auto">
        {
          Object.keys(items).map((key) => (
            <div className="mb-14">
              <h1 className="mb-8 font-bold sm:text-left text-center">{key}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {items[key].map((item) => (
                  <div
                    className={cn([
                      'p-2',
                      item.url ? 'hover:bg-white cursor-pointer hover:text-black' : 'cursor-not-allowed'
                    ])}
                    onClick={() => onClick(item.url, item.param)}
                  >
                    <img
                      src={item.logo}
                      className='w-[100px] h-[120px] mb-4 m-auto'
                    />
                    <div className="mx-2 text-center">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Dashboard;