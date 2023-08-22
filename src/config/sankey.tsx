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
