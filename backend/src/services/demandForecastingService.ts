export interface DemandForecastItem {
  saltName: string;
  currentStock: number;
  projectedDemand30Days: number;
  safetyBufferRequired: number;
  recommendedReplenishmentUnits: number;
  seasonalSurgeFactor: number;
  surgeReason: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export function computeDemandForecast(): DemandForecastItem[] {
  return [
    {
      saltName: 'Paracetamol IP 650mg',
      currentStock: 142,
      projectedDemand30Days: 450,
      safetyBufferRequired: 100,
      recommendedReplenishmentUnits: 408,
      seasonalSurgeFactor: 1.45,
      surgeReason: 'Monsoon Viral Pyrexia Surge (Mumbai Zone)',
      urgency: 'high',
    },
    {
      saltName: 'Amoxicillin + Clavulanic 625mg',
      currentStock: 8,
      projectedDemand30Days: 180,
      safetyBufferRequired: 50,
      recommendedReplenishmentUnits: 222,
      seasonalSurgeFactor: 1.6,
      surgeReason: 'Post-Monsoon Upper Respiratory Infections',
      urgency: 'critical',
    },
    {
      saltName: 'Metformin HCl 500mg ER',
      currentStock: 95,
      projectedDemand30Days: 210,
      safetyBufferRequired: 40,
      recommendedReplenishmentUnits: 155,
      seasonalSurgeFactor: 1.1,
      surgeReason: 'Chronic Disease Monthly Refill Consistency',
      urgency: 'medium',
    },
    {
      saltName: 'Pantoprazole 40mg',
      currentStock: 110,
      projectedDemand30Days: 190,
      safetyBufferRequired: 40,
      recommendedReplenishmentUnits: 120,
      seasonalSurgeFactor: 1.15,
      surgeReason: 'Festive Season Dietary Acidity Spike',
      urgency: 'low',
    },
  ];
}
