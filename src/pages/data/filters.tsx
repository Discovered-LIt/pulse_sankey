import React from "react";
import FunnelIcon from "@heroicons/react/24/solid/FunnelIcon";
import Dropdown from "../../components/Dropdown";
// types
import { Filter } from ".";
import '../../pages/data/global.css'

interface Props {
  filters: Filter;
  chartTypeOptions: { value: string, label: string }[];
  setFilters: (filters: Filter) => void;
}

const FilterLabel = () => (
  <div className="flex items-center">
    <FunnelIcon className="h-5 w-5 mr-2" />
    <span>FILTER</span>
  </div>
);

export const Filters = ({ filters, chartTypeOptions, setFilters }: Props) => {
  // Function to handle filter selection (toggle logic for both dropdown and buttons)
  const onTypeSelect = (val: string) => {
    const { types } = filters;
    setFilters({
      ...filters,
      types: types.includes(val) ? types.filter((typ) => typ !== val) : [val, ...types],
    });
  };

  return (
    <div className="p-2">
      <div className="flex items-center mb-6">
        {/* Dropdown for filter selection with icon and FILTER text */}
        <div className="w-[200px] mr-4">
          <Dropdown
            placeholder={<FilterLabel />} // Use the custom FilterLabel here
            selectedValues={filters.types}
            options={chartTypeOptions}
            multiSelect
            onChange={(opt) => onTypeSelect(opt.value)}
          />
        </div>

        {/* Filter buttons with hidden scrollbar and smaller button styles */}
        <div
          className="flex gap-2 overflow-x-auto whitespace-nowrap no-scrollbar" // Enables horizontal scroll, hides scrollbar
        >
          {chartTypeOptions.map((option) => (
            <button
              key={option.value}
              className={`px-6 py-2 text-sm border ${
                filters.types.includes(option.value)
                  ? "bg-white text-black"
                  : "bg-black text-white"
              } border-white rounded-md transition-colors duration-300`}
              onClick={() => onTypeSelect(option.value)}
            >
              {option.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
