import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
// component
import Spinner from "./components/Spinner";
// pages
const Dashboard = lazy(() => import("./pages/dashboard"));
const Sankey = lazy(() => import("./pages/sankey"));
const DataPage = lazy(() => import("../src/pages/data"));
// context
import SliderContextProvider from "./context/SliderContext";

const Router = () => (
  <Suspense fallback={<Spinner show classNames="mt-16"/>}>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/sankey" element={
        <SliderContextProvider>
          <Sankey />
        </SliderContextProvider>
      }/>
      <Route path="/data" element={<DataPage />} />
    </Routes>
  </Suspense>
);

export default Router;
