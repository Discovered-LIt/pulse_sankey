import { SliderData } from "../pages/home";

export enum SankeyCategory {
  AutoRevenue = "Auto Revenue",
  AutoSalesRevenue = "Auto Sales Revenue",
  AutoLeasingRevenue = "Auto Leasing Revenue",
  AutoRegCredits = "Auto Reg Credits",
  TotalRevenue = "Total Revenue",
  GrossProfite = "Gross Profit",
  CostOfRevenue = "Cost of Revenue",
  OperationProfit = "Operation Profit",
  OperationExpenses = "Operation Expenses",
  AutoCosts = "Auto Costs",
  EnergyCosts = "Energy Costs",
  NetProfite = "Net Profit",
  NetLoss = "Net Loss",
  Tax = "Tax",
  Others = "Others",
  OtherOpex = "Other Opex",
  "R&D" = "R&D",
  "SG&A" = "SG&A"
}

export enum SlidderCategory {
  AutoSalesRevenue = "Auto sales revenue",
  AutoRegCreditsRevenue = "Auto reg credits revenue",
  AutomotiveLeasingRevenue = "Automotive leasing revenue",
  EnergyGenerationAndStorageRevenue = "Energy generation & storage revenue",
  ServicesAndOtherRevenue = "Services and other revenue",
  AutoRevenueMargin = "Auto revenue margin",
  EnergyStorageMargin = "Energy generation and storage margin",
  ServicesAndOtherMargin = "Services and other Margin",
  ResearchAndDevelopment = "R&D",
  SGA = "SGA",
  OtherOperatingExpenses = "Other Operating Expenses",
  InterestAndOther = "Interest and other income/expenses (net)",
  Taxes = "Taxes (TAX)"
}

export enum Prefix {
  Percentage = '%',
  Currency = 'BN'
}

export enum SliderType {
  Negative = '#b81818',
  Positive = "#188c1a",
  Basic = '#545955'
}

type SlidderSettings = { [key in SlidderCategory]: {
  min: number,
  max: number,
  prefix: Prefix,
  step: number,
  defaultValue: number,
  description?: string,
  type: SliderType
}}

// colors
export const GREY = '#545955'
export const LIGHT_GREY = '#a6a6a6'
export const GREEN = '#188c1a'
export const LIGHT_GREEN = '#18b81b'
export const RED = '#b81818'
export const LIGHT_RED = '#e63535'

export const sankeySettings: { [key in SankeyCategory]: { nodeFill: string, linkFill: string, showVal: boolean } } = {
  [SankeyCategory.AutoRevenue]: { nodeFill: GREY, linkFill: LIGHT_GREY, showVal: true },
  [SankeyCategory.AutoSalesRevenue]: { nodeFill: GREY, linkFill: LIGHT_GREY, showVal: true },
  [SankeyCategory.AutoLeasingRevenue]: { nodeFill: GREY, linkFill: LIGHT_GREY, showVal: true },
  [SankeyCategory.AutoRegCredits]: { nodeFill: GREY, linkFill: LIGHT_GREY, showVal: true },
  [SankeyCategory.TotalRevenue]: { nodeFill: GREY, linkFill: LIGHT_GREY, showVal: false },
  [SankeyCategory.GrossProfite]: { nodeFill: GREEN, linkFill: LIGHT_GREEN, showVal: false },
  [SankeyCategory.OperationProfit]: { nodeFill: GREEN, linkFill: LIGHT_GREEN, showVal: false },
  [SankeyCategory.NetProfite]: { nodeFill: GREEN, linkFill: LIGHT_GREEN, showVal: true },
  [SankeyCategory.NetLoss]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: false },

  [SankeyCategory.CostOfRevenue]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: false },
  [SankeyCategory.OperationExpenses]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: false },
  [SankeyCategory.AutoCosts]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: false },
  [SankeyCategory.EnergyCosts]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: false },
  [SankeyCategory.Tax]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: true },
  [SankeyCategory.Others]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: true },
  [SankeyCategory.OtherOpex]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: true },
  [SankeyCategory["R&D"]]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: true },
  [SankeyCategory["SG&A"]]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: true },
}


export const SlidderSettings: SlidderSettings = {
  [SlidderCategory.AutoSalesRevenue]: {
    min: 0,
    max: 55,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 26.4,
    description: "less than Q2 auti revenue",
    type: SliderType.Positive
  },
  [SlidderCategory.AutoRegCreditsRevenue]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 0.2,
    description: "more than analyst avg",
    type: SliderType.Positive
  },
  [SlidderCategory.AutomotiveLeasingRevenue]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 0.6,
    description: "more than yst avg",
    type: SliderType.Positive
  },
  [SlidderCategory.EnergyGenerationAndStorageRevenue]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 1.5,
    description: "less than Q2 auti revenue",
    type: SliderType.Positive
  },
  [SlidderCategory.ServicesAndOtherRevenue]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 2.15,
    description: "less than Q2 auti revenue",
    type: SliderType.Positive
  },

  [SlidderCategory.AutoRevenueMargin]: {
    min: 0,
    max: 100,
    prefix: Prefix.Percentage,
    step: 1,
    defaultValue: 19.2,
    description: "less than Q2 auti revenue",
    type: SliderType.Positive
  },
  [SlidderCategory.EnergyStorageMargin]: {
    min: 0,
    max: 100,
    prefix: Prefix.Percentage,
    step: 1,
    defaultValue: 18.4,
    description: "less than Q2 auti revenue",
    type: SliderType.Positive
  },
  [SlidderCategory.ServicesAndOtherMargin]: {
    min: 0,
    max: 100,
    prefix: Prefix.Percentage,
    step: 1,
    defaultValue: 7.7,
    description: "less than Q2 auti revenue",
    type: SliderType.Positive
  },

  [SlidderCategory.ResearchAndDevelopment]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 0.9,
    description: "less than Q2 auti revenue",
    type: SliderType.Negative
  },
  [SlidderCategory.SGA]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 1.2,
    description: "less than Q2 auti revenue",
    type: SliderType.Negative
  },
  [SlidderCategory.OtherOperatingExpenses]: {
    min: 0,
    max: 1,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 0,
    description: "less than Q2 auti revenue",
    type: SliderType.Negative
  },
  [SlidderCategory.InterestAndOther]: {
    min: 0,
    max: 1,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 0.5,
    description: "less than Q2 auti revenue",
    type: SliderType.Negative
  },
  [SlidderCategory.Taxes]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 0.3,
    description: "less than Q2 auti revenue",
    type: SliderType.Negative
  }
}

export const sliderDefaultData: SliderData = Object.keys(SlidderSettings).reduce((obj, key: SlidderCategory) => {
  return {...obj, ...{ [key]: SlidderSettings[key].defaultValue }}
}, {})
