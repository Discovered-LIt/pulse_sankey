import { format } from 'date-fns';
import {
  SankeyCategory,
  sankeySettings,
  RED,
  LIGHT_GREEN,
  LIGHT_RED,
  GREEN,
  GREY,
  LIGHT_GREY,
} from "../config/sankey";

// Add your new type definitions here
export type Stock = {
  s: string;
  logo: string;
  sharesoutstanding: number;
  color: string;
  adjustedclose: number;
  p: number | null;
  t: number;
  marketCap: number | null;
  initialPrice: number;
  priceChange: number;
};

export type BorderMapItem = {
  className: string;
  type: string;
};

export type BorderMap = {
  [key: string]: BorderMapItem;
};

// Your existing functions
export const getSankeyDisplayColor = (
  value: number,
  type: SankeyCategory,
): { lite: string; dark: string } => {
  const positive = { lite: LIGHT_GREEN, dark: GREEN };
  const negative = { lite: LIGHT_RED, dark: RED };
  const isDefaultPositive = sankeySettings?.[type]?.nodeFill === GREEN;
  const isDefaultNegative = sankeySettings?.[type]?.nodeFill === RED;
  if (isDefaultPositive) {
    return value >= 0 ? positive : negative;
  } else if (isDefaultNegative) {
    return value >= 0 ? negative : positive;
  } else {
    return { lite: LIGHT_GREY, dark: GREY };
  }
};

export const getUTCDate = (date: string, dateFormat: string) => {
  if(!date) return "";
  const parsedDate = new Date(date);
  const utcDate = new Date(
    parsedDate.getUTCFullYear(), 
    parsedDate.getUTCMonth(), 
    parsedDate.getUTCDate()
  );
  return format(utcDate, dateFormat);
}