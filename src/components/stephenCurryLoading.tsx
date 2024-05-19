import React, { useState } from "react";
import cn from 'classnames'
import stephcurryTitlePng from '../assets/stephcurry-title.png';

const StephenCurryLoading = () => {
  const [gifEnded, setGifEnded] = useState(false);
  const [showGifScreen, setGifScreen] = useState(true);
  const [hideLoading, setHideLoading] = useState(false);

  const onGifLoad = () => {
    setTimeout(() => {
      setGifEnded(true)
      setTimeout(() => {
        setGifScreen(false)
        setTimeout(() => {
          setHideLoading(true)
        }, 1000)
      }, 500)
    }, 4000)
  };

  if(hideLoading) return null;

  return(
    <div
      className={cn(`bg-[#FFC214] top-0 left-0 right-0 bottom-0 w-full z-50 transition-height duration-1000 ${showGifScreen ? 'h-[100vh] fixed' : 'h-[0vh] block'}`)}
    >
      <div className={"h-screen flex justify-center items-center flex-col"}>
        <img
          src={'https://pulse-stockprice.s3.us-east-2.amazonaws.com/steph/stephcurry.gif'}
          onLoadCapture={onGifLoad}
          onCompositionEnd={()=> alert("ended?")}
        />
        {gifEnded && showGifScreen && <img src={stephcurryTitlePng} className={"fixed max-w-[450px]"}/>}
      </div>
    </div>
  )
}

export default StephenCurryLoading;
