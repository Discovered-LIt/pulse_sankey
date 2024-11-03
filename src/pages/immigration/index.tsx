import React, { useState } from "react";
import WorldMap from "./WorldMap";
import WorldGlobe from "./WorldGlobe";
import './ImmigrationVisualization.css';
import migrationData from "./immigrationhistory_us.json";

const ImmigrationVisualization = () => {
  const [view, setView] = useState<"globe" | "map">("globe");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentYearIndex, setCurrentYearIndex] = useState(0);

  // Toggle between globe and map view
  const toggleView = () => {
    setView((prevView) => (prevView === "globe" ? "map" : "globe"));
  };

  // Play/Pause functionality
  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="immigration-visualization">
      <h1>Immigration Patterns</h1>

      {/* Button Row for View Toggle and Play/Pause */}
      <div className="button-row">
        <button onClick={toggleView} className="toggle-view-button">
          {view === "globe" ? "2D" : "3D"}
        </button>
        <button onClick={handlePlayPause} className="play-pause-button">
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      {/* Display Current Year (only show when isPlaying is true) */}
      {isPlaying && (
        <div className="year-display">
          <span>Year: {migrationData[currentYearIndex]?.year || "All Years"}</span>
        </div>
      )}

      {/* Map or Globe Container */}
      <div className={`map-container ${view === "map" ? "worldmap-view" : "worldglobe-view"}`}>
        {view === "globe" ? (
          <WorldGlobe 
            migrationData={migrationData}
            isPlaying={isPlaying}
            currentYearIndex={currentYearIndex}
            setCurrentYearIndex={setCurrentYearIndex}
          />
        ) : (
          <WorldMap 
            migrationData={migrationData}
            isPlaying={isPlaying}
            currentYearIndex={currentYearIndex}
            setCurrentYearIndex={setCurrentYearIndex}
          />
        )}
      </div>
    </div>
  );
};

export default ImmigrationVisualization;
