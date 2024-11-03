import React from "react";

interface TimelineProps {
  years: number[];
  onYearChange: (year: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ years, onYearChange }) => {
  return (
    <div className="timeline">
      {years.map((year: number) => (
        <button key={year} onClick={() => onYearChange(year)}>
          {year}
        </button>
      ))}
    </div>
  );
};

export default Timeline;
