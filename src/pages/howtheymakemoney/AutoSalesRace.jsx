import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion"; // For smooth animations
import model3Svg from "./model3black.svg";
import cybertruckSvg from "./cybertruck.svg";
import modelXSvg from "./modelx.svg";

const AutoSalesRace = () => {
  const totalSales = 50000 + 10000 + 1000;
  const salesData = [
    { name: "Model 3", sales: 50000, svg: model3Svg },
    { name: "Cybertruck", sales: 10000, svg: cybertruckSvg },
    { name: "Model X", sales: 1000, svg: modelXSvg },
  ];

  // Race track style
  const trackRadius = 200; // Adjust based on your design

  const calculatePosition = (sales) => {
    // Calculate percentage of total sales to set position
    return (sales / totalSales) * 2 * Math.PI * trackRadius;
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "500px" }}>
      <svg width="100%" height="500">
        {/* Draw race track */}
        <circle
          cx="50%"
          cy="50%"
          r={trackRadius}
          fill="none"
          stroke="#ccc"
          strokeWidth="5"
        />
      </svg>
      {salesData.map((car, index) => (
        <motion.div
          key={car.name}
          initial={{ x: 0, y: -trackRadius }}
          animate={{
            x: calculatePosition(car.sales),
            y: -trackRadius,
          }}
          transition={{ duration: 2, ease: "linear", loop: Infinity }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `rotate(${index * 120}deg)`,
          }}
        >
          <img
            src={car.svg}
            alt={car.name}
            style={{ width: "50px", height: "auto" }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default AutoSalesRace;
