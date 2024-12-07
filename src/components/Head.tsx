import React from "react";
import LogoWhite from "../assets/Logo_white.svg"; // Adjust the path as needed

enum Types {
  COMPANIES = "COMPANIES",
  THEMES = "THEMES",
  PEOPLE = "PEOPLE",
}

type HeaderProps = {
  activeType: Types;
  setActiveType: (type: Types) => void;
};

const Head: React.FC<HeaderProps> = ({ activeType, setActiveType }) => {
  return (
    <div className="sticky top-0 bg-black w-full z-50 py-4 flex items-center justify-between">
      <div className="flex-1"></div>
      <div className="flex-1 flex justify-center">
        {Object.values(Types).map((type) => (
          <button
            key={type}
            className={`border-2 rounded-xl px-4 py-[4px] text-sm sm:mr-14 ${
              activeType === type ? "border-gray-700" : "border-transparent"
            }`}
            onClick={() => setActiveType(type)}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="flex-1 flex justify-end">
        {/* Import and Use SVG Here */}
        <LogoWhite className="h-8 mr-4 fill-current text-[#2afeb7]" />
      </div>
    </div>
  );
};

export default Head;
