import React, { useState } from "react";
import cn from 'classnames'
import stephcurryTitlePng from '../assets/stephcurry-title.png';
// icons
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";

const StephenCurryLoading = () => {
  const [gifEnded, setGifEnded] = useState(false);
  const [showScreen, setShowScreen] = useState(true);

  const onGifLoad = () => {
    setTimeout(() => {
      setGifEnded(true)
    }, 4000)
  };

  return(
    <div
      onClick={() => gifEnded && setShowScreen(false)}
      className={cn(`bg-[#FFC214] top-0 left-0 right-0 bottom-0 w-full z-50 transition-height duration-1000 ${showScreen ? 'h-[100vh] fixed' : 'h-[0vh] block'}`)}
    >
      <div className={"h-screen flex justify-center items-center flex-col"}>
        <img
          src={'https://pulse-stockprice.s3.us-east-2.amazonaws.com/steph/stephcurry.gif'}
          onLoadCapture={onGifLoad}
          onCompositionEnd={()=> alert("ended?")}
        />
        {gifEnded && showScreen && <img src={stephcurryTitlePng} className={"fixed max-w-[450px]"}/>}
        {gifEnded && showScreen && <div className="text-[#1C428A] flex flex-col items-center font-semibold cursor-pointer absolute bottom-[35px]">
          CLICK
          <ChevronDownIcon className="w-6 h-6"/>
        </div>}
      </div>
    </div>
  )
}

export default StephenCurryLoading;
