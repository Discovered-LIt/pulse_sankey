import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import worldData from "./world-geojson.json";
import usStatesGeoJson from "./us-states.json";

interface WorldMapProps {
  migrationData: {
    year: number;
    topOrigins: {
      country: string;
      count: number | null;
    }[];
    states: {
      [stateName: string]: string;
    };
  }[];
  isPlaying: boolean;
  currentYearIndex: number;
  setCurrentYearIndex: React.Dispatch<React.SetStateAction<number>>;
}

const WorldMap: React.FC<WorldMapProps> = ({
  migrationData,
  isPlaying,
  currentYearIndex,
  setCurrentYearIndex,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 800;
    const height = 500;

    const projection = d3.geoMercator()
      .scale(130)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove(); // Clear previous SVG elements

    const countryCoordinates = {
      Ireland: [-8, 53],
      Germany: [10, 51],
      UK: [-3, 54],
      Canada: [-106, 56],
      France: [2, 46],
      China: [104, 35],
      Mexico: [-102.5, 23.5],
      India: [78.9629, 20.5937],
      Philippines: [121.7740, 12.8797],
      Vietnam: [108.2772, 14.0583],
      Dominican_Republic: [-70.1627, 18.7357],
      El_Salvador: [-88.8965, 13.7942],
      Cuba: [-77.7812, 21.5218],
      Italy: [12.5674, 41.8719],
      USSR: [105.3188, 61.5240],
      Poland: [19.1451, 51.9194],
      Sweden: [18.6435, 60.1282],
    };

    const stateCoordinates = {
      "New York": [-74, 40.7],
      Massachusetts: [-71.5, 42.3],
      Pennsylvania: [-77.6, 41.2],
      Ohio: [-82.6, 40.4],
      Illinois: [-89.3, 40.6],
      Wisconsin: [-89.4, 44.5],
    };

    const countryColors: { [country: string]: string } = {
      Ireland: "#39FF14",
      Germany: "#00AFFF",
      UK: "#9400D3",
      Canada: "#FF6F00",
      France: "#FF1493",
      China: "#FF073A",
      Mexico: "#FFD700",
      India: "#FF4500",
      Philippines: "#00FFFF",
      Vietnam: "#FF00FF",
      Dominican_Republic: "#32CD32",
      El_Salvador: "#008080",
      Cuba: "#FF6347",
      Italy: "#800000",
      USSR: "#B8B8B8",
      Poland: "#EE82EE",
      Sweden: "#1E90FF",
    };

    // Filter out Antarctica
    const filteredWorldData = worldData.features.filter(
      (feature: any) => feature.properties.name !== "Antarctica"
    );

    // Draw the world map
    svg.append("g")
      .selectAll("path")
      .data(filteredWorldData)
      .enter()
      .append("path")
      .attr("d", path as any)
      .attr("fill", "#d0d0d0")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 0.5);

    // Map to hold the states and their associated colors
    const stateCountryColors: { [state: string]: Set<string> } = {};

    // Gather country colors for each state
    migrationData.forEach((yearData) => {
      Object.keys(yearData.states).forEach((state) => {
        const country = yearData.states[state];
        if (!stateCountryColors[state]) {
          stateCountryColors[state] = new Set();
        }
        stateCountryColors[state].add(countryColors[country]);
      });
    });

    // Add gradient fills for states with multiple countries
    const defs = svg.append("defs");

    Object.keys(stateCountryColors).forEach((state, index) => {
      const colors = Array.from(stateCountryColors[state]);
      if (colors.length > 1) {
        // Define a linear gradient for states with multiple country colors
        const gradient = defs.append("linearGradient")
          .attr("id", `gradient-${state.replace(/\s+/g, '-')}`)
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "0%");
        
        colors.forEach((color, i) => {
          gradient.append("stop")
            .attr("offset", `${(i / (colors.length - 1)) * 100}%`)
            .attr("stop-color", color);
        });
      }
    });

    // Draw U.S. state borders and fill them based on migration data
    svg.append("g")
      .selectAll("path")
      .data(usStatesGeoJson.features)
      .enter()
      .append("path")
      .attr("d", path as any)
      .attr("fill", (d: any) => {
        const state = d.properties.name;
        const colors = Array.from(stateCountryColors[state] || []);
        return colors.length > 1
          ? `url(#gradient-${state.replace(/\s+/g, '-')})`
          : colors[0] || "none";
      })
      .attr("stroke", "#000000")
      .attr("stroke-width", 0.7);

    // Draw all paths initially without animation
    const drawPathsWithoutAnimation = () => {
      migrationData.forEach((yearData) => {
        Object.keys(yearData.states).forEach((state) => {
          const originCountry = yearData.states[state];
          const startCoords = countryCoordinates[originCountry as keyof typeof countryCoordinates] || null;
          const endCoords = stateCoordinates[state as keyof typeof stateCoordinates] || null;
          const color = countryColors[originCountry] || "black";

          if (startCoords && endCoords) {
            svg.append("path")
              .datum({
                type: "LineString",
                coordinates: [startCoords, endCoords],
              })
              .attr("d", path as any)
              .attr("fill", "none")
              .attr("stroke", color)
              .attr("stroke-width", 2)
              .attr("stroke-dasharray", "5,5")
              .attr("marker-end", "url(#arrowhead)")
              .attr("stroke-dashoffset", 0); // No animation on load
          }
        });
      });
    };

    drawPathsWithoutAnimation();
  }, [migrationData, isPlaying, currentYearIndex, setCurrentYearIndex]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default WorldMap;
