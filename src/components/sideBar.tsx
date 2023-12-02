import React, { RefObject } from "react";
import cn from "classnames";
// icon
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";

interface SideBar {
  children?: JSX.Element;
  open: boolean;
  ref?: RefObject<HTMLDivElement>;
  onClose?: () => void;
}

const SideBar = ({ children, open, ref, onClose }: SideBar) => {
  return (
    <div
      ref={ref}
      className={cn([
        "fixed top-0 right-0 bottom-0 bg-black",
        open
          ? "transition-width duration-500 w-full sm:w-[600px] px-2 z-20"
          : "w-0",
      ])}
    >
      {onClose && open && <XMarkIcon
        className="h-5 w-5 absolute top-[10px] right-[12px] cursor-pointer z-20"
        onClick={onClose}
      />}
      {children}
    </div>
  );
};

export default SideBar;
