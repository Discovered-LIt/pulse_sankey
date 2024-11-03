import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { geoPath, geoAlbersUsa } from "d3-geo";
import usStatesGeoJson from "./us-states.json";

interface USMapProps {
  data: {
    states: { [key: string]: string };
  };
}

const countryColors: { [key: string]: string } = {
  Mexico: "#FF5733",
  Canada: "#33A1FF",
  Germany: "#FF33A1",
  Italy: "#4CAF50",
  USSR: "#FFD700", // Former USSR
  UK: "#FFA07A",
  Ireland: "#98FB98",
  China: "#FF4500",
  Japan: "#FF6347",
  Norway: "#4682B4",
  Sweden: "#6A5ACD",
  Greece: "#87CEEB",
  Poland: "#B0E0E6",
  France: "#FFC0CB",
  India: "#FF8C00",
  Philippines: "#9370DB",
  Vietnam: "#DC143C",
  Brazil: "#32CD32",
  El_Salvador: "#FA8072",
  Jamaica: "#FFDAB9",
  Dominican_Republic: "#00FA9A",
  Portugal: "#FFD700",
  Laos: "#D2691E",
  Cuba: "#40E0D0",
  Korea: "#DB7093",
  Switzerland: "#9ACD32",
  Austria: "#FFB6C1",
  Australia: "#F08080",
  South_Africa: "#FFD700",
  Netherlands: "#DA70D6",
  Belgium: "#FF69B4",
  Argentina: "#FFDEAD",
  Peru: "#DDA0DD",
  Turkey: "#B22222",
  Thailand: "#FF6347",
  default: "#EEE",
};

const USMap: React.FC<USMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const projection = geoAlbersUsa().scale(1000).translate([500, 300]);
    const path = geoPath().projection(projection) as any;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .selectAll("path")
      .data(usStatesGeoJson.features) // Use the imported GeoJSON data directly
      .enter()
      .append("path")
      .attr("d", path as any)
      .attr("fill", (d: any) => {
        const stateName = d.properties.name;
        const topCountry = data.states[stateName] || "default";
        return countryColors[topCountry];
      })
      .attr("stroke", "#FFF")
      .attr("stroke-width", 0.5);
  }, [data]);

  return <svg ref={svgRef} width={1000} height={600}></svg>;
};

export default USMap;
