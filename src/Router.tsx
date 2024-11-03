import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Spinner from "./components/Spinner";
import SliderContextProvider from "./context/SliderContext";

// Lazy loaded pages
const Dashboard = lazy(() => import("./pages/dashboard"));
const Sankey = lazy(() => import("./pages/sankey"));
const DataPage = lazy(() => import("./pages/data"));
const HowTheyMakeMoney = lazy(() => import("./pages/howtheymakemoney"));
const DollarBreakdown = lazy(() => import("./pages/dollarbreakdown"));
const ImmigrationVisualization = lazy(() => import("./pages/immigration"));


const Router = () => {
  const location = useLocation(); // Get current route location

  return (
    <Suspense fallback={<Spinner show classNames="mt-16" />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/sankey"
            element={
              <SliderContextProvider>
                <Sankey />
              </SliderContextProvider>
            }
          />
          <Route path="/data" element={<DataPage />} />
          <Route path="/howtheymakemoney" element={<HowTheyMakeMoney />} />
          <Route path="/dollarbreakdown" element={<DollarBreakdown />} />
          <Route path="/immigration" element={<ImmigrationVisualization />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

export default Router;
