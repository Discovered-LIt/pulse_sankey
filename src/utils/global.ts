import { addQuarters, startOfQuarter, addDays } from "date-fns";

const quarters: {[key: number]: number} = {
  1: 0,
  2: 3,
  3: 6,
  4: 9,
}

export const formatToDate = (date: string) => {
  const [yearString, quarterString] = date.split(" ")

  // Parse the year and quarter components into numbers
  const year = parseInt(yearString);
  const startMonth = quarters[parseInt(quarterString.charAt(1))]; // Extract the numeric part of the quarter

  // Calculate the Date object for the start of the specified quarter
  const currentDate = new Date();
  currentDate.setFullYear(2000 + year); 
  currentDate.setMonth(startMonth);
  const startDate = startOfQuarter(currentDate); 

  // Calculate the last day of the quarter
  const endDate = addDays(addQuarters(startDate, 1), -1);

  // Generate a random date within the quarter
  const randomTimestamp = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  const randomDate = new Date(randomTimestamp);
  return randomDate
}
