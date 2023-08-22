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
  Tax = "Tax",
  Others = "Others",
  "R&D" = "R&D",
  "SG&D" = "SG&D"
}

export enum SlidderCategory {
  AutoSalesRevenue = "Auto sales revenue",
  AutoRegCreditsRevenue = "Auto reg credits revenue",
  AutomotiveLeasingRevenue = "Automotive leasing revenue",
  EnergyStorageRevenue = "Energy Storage revenue",
  EnergyGenerationRevenue = "Energy generation revenue",
  ServicesEndOtherRevenue = "Services and other revenue",
  AutoRevenueMargin = "Auto revenue margin",
  EnergyStorageMargin = "Energy Storage margin",
  EnergyGenerationMargin = "Energy generation margin",
  ServicesAndOtherMargin = "Services and other Margin",
  ResearchAndDevelopment = "R&D",
  SGA = "SGA",
  OtherExpenses = "Other Expenses",
  InterestTaxesDepreciationAmortization = "Interest, taxes, depreciation, and amortization"
}

export enum Prefix {
  Percentage = '%',
  Currency = 'BN'
}

export enum SliderType {
  Negative = '#b81b01',
  Positive = "#05a302",
  Basic = '#6c6c6c'
}

type SlidderSettings = { [key in SlidderCategory]: {
  min: number,
  max: number,
  prefix: Prefix,
  step: number,
  description?: string
}}

// colors
const GREY = '#545955'
const LIGHT_GREY = '#a6a6a6'
const GREEN = '#188c1a'
const LIGHT_GREEN = '#18b81b'
const RED = '#b81818'
const LIGHT_RED = '#e63535'

export const sankeySettings: { [key in SankeyCategory]: { nodeFill: string, linkFill: string, showVal: boolean } } = {
  [SankeyCategory.AutoRevenue]: { nodeFill: GREY, linkFill: LIGHT_GREY, showVal: true },
  [SankeyCategory.AutoSalesRevenue]: { nodeFill: GREY, linkFill: LIGHT_GREY, showVal: true },
  [SankeyCategory.AutoLeasingRevenue]: { nodeFill: GREY, linkFill: LIGHT_GREY, showVal: true },
  [SankeyCategory.AutoRegCredits]: { nodeFill: GREY, linkFill: LIGHT_GREY, showVal: true },
  [SankeyCategory.TotalRevenue]: { nodeFill: GREY, linkFill: LIGHT_GREY, showVal: false },
  [SankeyCategory.GrossProfite]: { nodeFill: GREEN, linkFill: LIGHT_GREEN, showVal: false },
  [SankeyCategory.OperationProfit]: { nodeFill: GREEN, linkFill: LIGHT_GREEN, showVal: false },
  [SankeyCategory.NetProfite]: { nodeFill: GREEN, linkFill: LIGHT_GREEN, showVal: true },
  [SankeyCategory.CostOfRevenue]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: false },
  [SankeyCategory.OperationExpenses]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: false },
  [SankeyCategory.AutoCosts]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: false },
  [SankeyCategory.EnergyCosts]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: false },
  [SankeyCategory.Tax]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: true },
  [SankeyCategory.Others]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: true },
  [SankeyCategory["R&D"]]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: true },
  [SankeyCategory["SG&D"]]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: true },
}


export const SlidderSettings: SlidderSettings = {
  [SlidderCategory.AutoSalesRevenue]: {
    min: 0,
    max: 5,
    prefix: Prefix.Currency,
    step: 0.1,
    description: "less than Q2 auti revenue"
  },
  [SlidderCategory.AutoRegCreditsRevenue]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    description: "more than analyst avg"
  },
  [SlidderCategory.AutomotiveLeasingRevenue]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    description: "more than yst avg"
  },
  [SlidderCategory.EnergyStorageRevenue]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    description: "less than Q2 auti revenue"
  },
  [SlidderCategory.EnergyGenerationRevenue]: {
    min: 0,
    max: 5,
    prefix: Prefix.Currency,
    step: 0.1,
    description: "less than Q2 auti revenue"
  },
  [SlidderCategory.ServicesEndOtherRevenue]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    description: "less than Q2 auti revenue"
  },

  [SlidderCategory.AutoRevenueMargin]: {
    min: 0,
    max: 100,
    prefix: Prefix.Percentage,
    step: 1,
    description: "less than Q2 auti revenue"
  },
  [SlidderCategory.EnergyStorageMargin]: {
    min: 0,
    max: 100,
    prefix: Prefix.Percentage,
    step: 1,
    description: "less than Q2 auti revenue"
  },
  [SlidderCategory.EnergyGenerationMargin]: {
    min: 0,
    max: 100,
    prefix: Prefix.Percentage,
    step: 1,
    description: "less than Q2 auti revenue"
  },
  [SlidderCategory.ServicesAndOtherMargin]: {
    min: 0,
    max: 100,
    prefix: Prefix.Percentage,
    step: 1,
    description: "less than Q2 auti revenue"
  },

  [SlidderCategory.ResearchAndDevelopment]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    description: "less than Q2 auti revenue"
  },
  [SlidderCategory.SGA]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    description: "less than Q2 auti revenue"
  },
  [SlidderCategory.OtherExpenses]: {
    min: 0,
    max: 1,
    prefix: Prefix.Currency,
    step: 0.1,
    description: "less than Q2 auti revenue"
  },
  [SlidderCategory.InterestTaxesDepreciationAmortization]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    description: "less than Q2 auti revenue"
  },
}
