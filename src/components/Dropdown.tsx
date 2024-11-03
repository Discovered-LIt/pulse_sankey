import React, { useState, useRef } from "react";
import cn from 'classnames';
// icon
import ChevronUpIcon from "@heroicons/react/24/solid/ChevronUpIcon";
// hook
import useOnClickOutside from "../hooks/useOnClickOutside";

type Option = { value: string, label: string }

interface Props {
  value?: string;
  placeholder?: React.ReactNode;
  options: Option[];
  icon?: any;
  multiSelect?: boolean;
  selectedValues?: string[];
  onChange?: (opt: Option) => void;
}

const Dropdown = ({
  value = '',
  placeholder = '',
  options,
  icon,
  multiSelect = false,
  selectedValues = [],
  onChange,
}: Props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef()

  useOnClickOutside(ref.current, () => setShowDropdown(false))

  const _onChange = (opt: Option) => {
    if(!multiSelect) setShowDropdown(false)
    onChange?.(opt)
  }

  return(
    <div ref={ref}>
      <div className="flex items-center cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
        {icon}
        {value || placeholder}
        <ChevronUpIcon className={cn(["h-4 w-4 transition-transform duration-200 z-20 ml-2"], {
          "rotate-180": !showDropdown,
        })}/>
      </div>
      <div className={cn([
        "z-50 bg-black border-[1px] border-white divide-y divide-gray-100 rounded-lg shadow w-44 fixed mt-2",
        showDropdown ? "block max-h-[250px] overflow-auto" : "overflow-hidden hidden"
      ])}>
        <ul className="text-sm">
          {options.map((opt) => (
            <li onClick={() => _onChange(opt)}>
              <div className={cn([
                "block px-4 py-2 cursor-pointer",
                [...selectedValues, value].includes(opt.value) ? "text-black bg-white" : "text-white hover:text-black hover:bg-[#ffde64]"
              ])}>{opt.label}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Dropdown;