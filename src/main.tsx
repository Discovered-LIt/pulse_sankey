import React from "react";
import Router from "./Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// components
import Alert from "./components/alert";
import Header from "./components/header";
import TabMenu from "./components/tabMenu";
// provider
import { Compose } from "./context/Compose";
import SliderContextProvider from "./context/SliderContext";
import AlertContextProvider from "./context/AlertContext";

const Main = () => {
  const providers = [
    AlertContextProvider
  ];
  // Create a client
  const queryClient = new QueryClient();
  return (
    <div className="bg-black text-white h-screen overflow-scroll">
      <QueryClientProvider client={queryClient}>
        <Compose providers={providers}>
          <Alert />
          <Header />
          <TabMenu />
          <Router />
        </Compose>
      </QueryClientProvider>
    </div>
  );
};

export default Main;
