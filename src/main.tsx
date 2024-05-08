import React from "react";
import Router from "./Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
// components
import Alert from "./components/alert";
import Header from "./components/header";
import TabMenu from "./components/tabMenu";
// provider
import { Compose } from "./context/Compose";
import AlertContextProvider from "./context/AlertContext";
import TopicSettingsProvider from "./context/TopicSettingsContext";

const Main = () => {
  const providers = [
    AlertContextProvider,
    TopicSettingsProvider
  ];
  const { pathname } = useLocation();
  const onDahboardPage = pathname === '/';
  // Create a client
  const queryClient = new QueryClient();
  return (
    <div className="bg-black text-white h-screen overflow-scroll">
      <QueryClientProvider client={queryClient}>
        <Compose providers={providers}>
          {!onDahboardPage && <>
            <Alert />
            <Header />
            <TabMenu />
          </>}
          <Router />
        </Compose>
      </QueryClientProvider>
    </div>
  );
};

export default Main;
