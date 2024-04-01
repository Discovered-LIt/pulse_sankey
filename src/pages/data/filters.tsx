import React from "react";
// components
import Dropdown from "../../components/Dropdown";
import FunnelIcon from "@heroicons/react/24/solid/FunnelIcon";
import Tag from "../../components/tag";
// types
import { Filter } from ".";

interface Props {
  filters: Filter;
  chartTypeOptions: { value: string, label: string }[];
  setFilters: (filters: Filter) => void;
}

export const Filters = ({
  filters,
  chartTypeOptions,
  setFilters
}: Props) => {
  const onTypeSelect = (val: string) => {
    const { types } = filters;
    setFilters({
      ...filters,
      ...{ types: 
        types.includes(val) ? types.filter((typ) => typ !== val) : [val, ...types]
      }
    })
  }

  return(
    <div className="p-2">
      <div className="flex items-baseline">
        <div className="w-fit mr-6 mt-2">
          <Dropdown
            placeholder='FILTER'
            selectedValues={filters.types}
            options={chartTypeOptions}
            multiSelect
            icon={<FunnelIcon className="h-5 w-5 mr-2" />}
            onChange={(opt) => onTypeSelect(opt.value)}
          />
        </div>
        <div className="flex items-center flex-wrap">
          {filters.types.map((type) =>
            <Tag
              text={type.toUpperCase()}
              value={type}
              onClose={onTypeSelect}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Filters;
