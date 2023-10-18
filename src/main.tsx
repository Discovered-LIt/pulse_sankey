import React from "react";
import Router from "./Router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// components
// import Header from "./components/header";
// provider
import { Compose } from "./context/Compose";
import SliderContextProvider from "./context/SlidderContext";

const Main = () => {
  const providers = [SliderContextProvider]
  // Create a client
  const queryClient = new QueryClient()
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Compose providers={providers}>
          {/* <Header /> */}
          <Router />
        </Compose>
      </QueryClientProvider>
    </>
  )
}

export default Main;
