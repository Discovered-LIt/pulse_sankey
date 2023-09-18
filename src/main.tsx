import React from "react";
import Router from "./Router";
// components
import Header from "./components/header";
// provider
import { Compose } from "./context/Compose";
import SliderContextProvider from "./context/SlidderContext";

const Main = () => {
  const providers = [SliderContextProvider]
  return (
    <>
      <Compose providers={providers}>
        <Header />
        <Router />
      </Compose>
    </>
  )
}

export default Main;
