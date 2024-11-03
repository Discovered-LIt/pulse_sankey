import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import worldData from "./world-geojson.json";
import usStatesGeoJson from "./us-states.json";

interface WorldGlobeProps {
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

const WorldGlobe: React.FC<WorldGlobeProps> = ({
  migrationData,
  isPlaying,
  currentYearIndex,
  setCurrentYearIndex
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 800;
    const height = 600;
    let currentRotation: [number, number, number] = [45, -40, 0];

    const projection = d3.geoOrthographic()
      .scale(250)
      .translate([width / 2, height / 2])
      .rotate(currentRotation);

    const path = d3.geoPath().projection(projection);

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const countryCoordinates: { [key: string]: [number, number] } = {
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
      Sweden: [18.6435, 60.1282]
    };

    const stateCoordinates: { [key: string]: [number, number] } = {
      "New York": [-74, 40.7],
      Massachusetts: [-71.5, 42.3],
      Pennsylvania: [-77.6, 41.2],
      Ohio: [-82.6, 40.4],
      Illinois: [-89.3, 40.6],
      Wisconsin: [-89.4, 44.5],
    };

    const countryColors: { [key: string]: string } = {
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

    const stateCountryColors: { [state: string]: Set<string> } = {};

    migrationData.forEach((yearData) => {
      Object.keys(yearData.states).forEach((state) => {
        const country = yearData.states[state];
        if (countryColors[country]) {
          if (!stateCountryColors[state]) {
            stateCountryColors[state] = new Set();
          }
          stateCountryColors[state].add(countryColors[country]);
        }
      });
    });

    const defs = svg.append("defs");
    Object.keys(stateCountryColors).forEach((state) => {
      const colors = Array.from(stateCountryColors[state]);
      if (colors.length > 1) {
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

    const renderGlobe = () => {
      svg.selectAll("path").remove();

      svg.append("g")
        .selectAll("path")
        .data(worldData.features)
        .enter()
        .append("path")
        .attr("d", path as any)
        .attr("fill", "#d0d0d0")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 0.5);

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
    };

    const drawArrowsForYear = (yearIndex: number) => {
      const yearData = migrationData[yearIndex];
      if (!yearData) return;

      Object.keys(yearData.states).forEach((state) => {
        const originCountry = yearData.states[state];
        const startCoords = countryCoordinates[originCountry];
        const endCoords = stateCoordinates[state];
        const color = countryColors[originCountry];

        if (startCoords && endCoords && color) {
          svg.append("path")
            .datum({ type: "LineString", coordinates: [startCoords, endCoords] })
            .attr("d", path as any)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("marker-end", `url(#arrowhead-${originCountry}-${yearIndex})`);
        }
      });
    };

    const setupDragRotation = () => {
      let startRotation = [...currentRotation];
      svg.call(d3.drag()
        .on("start", () => {
          startRotation = [...currentRotation];
        })
        .on("drag", (event) => {
          const dx = event.dx * 0.1;
          const dy = event.dy * 0.1;

          currentRotation[0] = startRotation[0] + dx;
          currentRotation[1] = startRotation[1] - dy;
          projection.rotate(currentRotation);
          
          renderGlobe();
          drawArrowsForYear(currentYearIndex);
        }));
    };

    renderGlobe();
    drawArrowsForYear(currentYearIndex);
    setupDragRotation();

    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentYearIndex((index) => {
          const nextIndex = index + 1;
          if (nextIndex >= migrationData.length) {
            clearInterval(interval);
            return index;
          }
          drawArrowsForYear(nextIndex);
          return nextIndex;
        });
      }, 3000);

      return () => clearInterval(interval);
    } else {
      for (let i = 0; i <= currentYearIndex; i++) {
        drawArrowsForYear(i);
      }
    }
  }, [migrationData, isPlaying, currentYearIndex, setCurrentYearIndex]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default WorldGlobe;
