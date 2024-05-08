import React, { useState, useEffect } from "react";
import cn from 'classnames';
// components
import Modal from "../../components/modal";
// icon
import QuestionMarkIcon from "@heroicons/react/24/solid/QuestionMarkCircleIcon";

const data = [
  {
    title: "ESTIMATE YOUR PRICE TARGET",
    description: "Use our income statement model to determine your price target for Tesla. Estimate revenue and expenses to determine price target.",
    gif: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/pricetarget1.gif",
    button: "Show Me"
  },
  {
    title: "SELECT QUARTER",
    description: "Select reporting period quarter from drop down.",
    gif: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/selectdate2.gif",
    button: "Next"
  },
  {
    title: "ADJUST SLIDERS",
    description: "Adjust sliders to estimate Tesla’s revenue and expenses. Click on the icon to expand details and view historical data. Net profit will automatically calculate.",
    gif: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/adjustsliders3.gif",
    button: "Next"
  },
  {
    title: "SET P/E RATIO",
    description: "Price-to-earnings ratio (P/E ratio) shows how much investors are willing to pay per dollar of earnings. Adjust the slider to set your P/E ratio. The P/E ratio is multiplied by Tesla’s trailing twelve month earnings to calculate your price target.",
    gif: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/peratio4.gif",
    button: "Next"
  },
  {
    title: "SAVE VALUES (OPTIONAL)",
    description: "Click the save button to store your values. You will be prompted to enter your email address.",
    gif: "https://pulse-stockprice.s3.us-east-2.amazonaws.com/save5.gif",
    button: "Get Started"
  }
];

const LOCAL_STORAGE_KEY = "sankeyGetStartedModal";

const GetStartedModal = () => {
  const [showModal, setShowModal] = useState(!localStorage.getItem(LOCAL_STORAGE_KEY));
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setActiveSlide(0);
  }, [showModal])

  const closeHandler = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, "true")
    setShowModal(false);
  }

  return(
    <div>
      <QuestionMarkIcon
        className="w-6 h-6 cursor-pointer"
        onClick={() => setShowModal(true)}
      />
      <Modal
        header={data[activeSlide].title}
        open={showModal}
        onClose={closeHandler}
      >
        <div className="w-[300px] md:w-[600px] mt-[10px]">
          <p className="text-sm min-h-[110px]">{data[activeSlide].description}</p>
          <img src={data[activeSlide].gif} loading="lazy" alt={`get-started-${activeSlide}`}/>
          <div className="mt-6 flex justify-center">
            <button
              className="bg-transparent text-white py-2 px-4 w-[140px] text-[14px] border border-gray-500 rounded"
              onClick={() => {
                const newIdx = activeSlide + 1;
                if(newIdx < 5) {
                  setActiveSlide(newIdx)
                } else {
                  closeHandler()
                }
              }}
            >
              {data[activeSlide].button}
            </button>
          </div>
          <div className="flex gap-2 justify-center mt-10">
            {
              data.map((_, idx) => (
                <button
                  type="button"
                  className={cn([
                    "w-3 h-3 rounded-full",
                    activeSlide === idx ? 'bg-green-500' : 'bg-gray-500 hover:bg-green-100'
                  ])}
                  onClick={() => setActiveSlide(idx)}
                />
              ))
            }
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default GetStartedModal;
