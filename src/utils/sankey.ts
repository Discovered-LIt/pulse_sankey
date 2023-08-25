import { SliderData } from "../pages/home";
import { SankeyCategory, SlidderCategory } from "../config/sankey";

export type CalculationProps = { [key in SankeyCategory]?: number };

const calculateAutoRevenue = (data: SliderData): number => 
  data[SlidderCategory.AutoSalesRevenue] +
  data[SlidderCategory.AutomotiveLeasingRevenue] +
  data[SlidderCategory.AutoRegCreditsRevenue];

const calculateCostOfRevenue = (data: SliderData): number => {
  const autoRevenue = calculateAutoRevenue(data);
  const autoMargin = data[SlidderCategory.AutoRevenueMargin] / 100;
  const energyMargin = data[SlidderCategory.EnergyStorageMargin] / 100;
  const servicesMargin = data[SlidderCategory.ServicesAndOtherMargin] / 100;

  return (
    autoRevenue * (1 - autoMargin) +
    data[SlidderCategory.EnergyGenerationAndStorageRevenue] * (1 - energyMargin) +
    data[SlidderCategory.ServicesAndOtherRevenue] * (1 - servicesMargin)
  );
};

const calculateTotalRevenue = (data: SliderData): number =>
  calculateAutoRevenue(data) +
  data[SlidderCategory.AutoRegCreditsRevenue] +
  data[SlidderCategory.AutomotiveLeasingRevenue] +
  data[SlidderCategory.EnergyGenerationAndStorageRevenue] +
  data[SlidderCategory.ServicesAndOtherRevenue];

const calculateGrossProfit = (data: SliderData): number =>
  calculateTotalRevenue(data) - calculateCostOfRevenue(data);

const calculateOperationExpenses = (data: SliderData): number =>
  data[SlidderCategory.ResearchAndDevelopment] +
  data[SlidderCategory.SGA] +
  data[SlidderCategory.OtherExpenses];

const calculateOperationProfit = (data: SliderData): number =>
  calculateGrossProfit(data) - calculateOperationExpenses(data);

const calculateTax = (data: SliderData): number => data[SlidderCategory.Taxes];

const calculateNetProfit = (data: SliderData): number =>
  calculateOperationProfit(data) -
  data[SlidderCategory.ServicesAndOtherRevenue] * (1 - data[SlidderCategory.ServicesAndOtherMargin] / 100) -
  calculateTax(data);

const calculateOthers = (data: SliderData): number =>
  data[SlidderCategory.ServicesAndOtherRevenue] * (1 - data[SlidderCategory.ServicesAndOtherMargin] / 100);

const calculateAutoCosts = (data: SliderData): number =>
  calculateAutoRevenue(data) * (1 - data[SlidderCategory.AutoRevenueMargin] / 100);

const calculateEnergyCosts = (data: SliderData): number =>
  data[SlidderCategory.EnergyGenerationAndStorageRevenue] * (1 - data[SlidderCategory.EnergyStorageMargin] / 100);

const calculateRAndD = (data: SliderData): number => data[SlidderCategory.ResearchAndDevelopment];
const calculateSGA = (data: SliderData): number => data[SlidderCategory.SGA];

const getAutoSalesRevenue = (data: SliderData): number => data[SlidderCategory.AutoSalesRevenue]
const getAutoLeasingRevenue = (data: SliderData): number => data[SlidderCategory.AutomotiveLeasingRevenue]
const getAutoRegCredits = (data: SliderData): number => data[SlidderCategory.AutoRegCreditsRevenue]

const getEnergyGenerationAndStorageRevenue = (data: SliderData): number => data[SlidderCategory.EnergyGenerationAndStorageRevenue]
const getServicesAndOtherRevenue = (data: SliderData): number => data[SlidderCategory.ServicesAndOtherRevenue]

const calculations = {
  calculateAutoRevenue,
  calculateAutoSalesRevenue: getAutoSalesRevenue,
  calculateAutoLeasingRevenue: getAutoLeasingRevenue,
  calculateAutoRegCredits: getAutoRegCredits,
  calculateCostOfRevenue,
  calculateTotalRevenue,
  calculateGrossProfit,
  calculateOperationExpenses,
  calculateOperationProfit,
  calculateTax,
  calculateNetProfit,
  calculateOthers,
  calculateAutoCosts,
  calculateEnergyCosts,
  calculateRAndD,
  calculateSGA,
  getEnergyGenerationAndStorageRevenue,
  getServicesAndOtherRevenue
};

export default calculations;
