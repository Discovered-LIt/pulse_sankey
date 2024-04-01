import React from "react";
// icons
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";

interface Props {
  text: string;
  value: string;
  onClose?: (val: string) => void;
}

export const Tag = ({
  text,
  value,
  onClose,
}: Props) => {
  return(
    <div
      className="p-[2px] border-[1px] border-yellow-600 rounded-lg mr-2 mb-2 w-fit flex justify-between items-center"
    >
      <div className="px-4 text-[12px]">{text}</div>
      {onClose && <XCircleIcon className="h-4 w-4 mr-2 cursor-pointer" onClick={() => onClose(value)}/>}
    </div>
  )
}

export default Tag;
