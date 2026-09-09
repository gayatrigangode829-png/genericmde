export interface CDSCOReport {
  reportId: string;
  generatedAt: string;
  ePharmacyLicenseNo: string;
  governingBody: string;
  totalTransactionsAudited: number;
  genericBioequivalenceComplianceRate: number;
  averagePatientSavingsPercent: number;
  scheduleH1RegisterCount: number;
  pricingAnomaliesDetected: number;
  auditLedger: {
    tenantCode: string;
    saltName: string;
    brandedMRP: number;
    genericPrice: number;
    savingsPercent: number;
    status: string;
  }[];
}

export function generateCDSCOComplianceReport(): CDSCOReport {
  return {
    reportId: `CDSCO-AUDIT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    generatedAt: new Date().toISOString(),
    ePharmacyLicenseNo: 'CDSCO/WZ/E-PHARM/2026/0449',
    governingBody: 'Central Drugs Standard Control Organisation (State Licensing Authority - Maharashtra)',
    totalTransactionsAudited: 1248,
    genericBioequivalenceComplianceRate: 99.6,
    averagePatientSavingsPercent: 64.2,
    scheduleH1RegisterCount: 142,
    pricingAnomaliesDetected: 1,
    auditLedger: [
      {
        tenantCode: 'TN-044',
        saltName: 'Paracetamol IP 650mg',
        brandedMRP: 38.0,
        genericPrice: 14.5,
        savingsPercent: 61.8,
        status: 'CDSCO_COMPLIANT',
      },
      {
        tenantCode: 'TN-044',
        saltName: 'Metformin HCl 500mg ER',
        brandedMRP: 64.5,
        genericPrice: 22.0,
        savingsPercent: 65.9,
        status: 'CDSCO_COMPLIANT',
      },
      {
        tenantCode: 'TN-044',
        saltName: 'Atorvastatin Calcium 10mg',
        brandedMRP: 112.0,
        genericPrice: 38.0,
        savingsPercent: 66.1,
        status: 'CDSCO_COMPLIANT',
      },
      {
        tenantCode: 'TN-008',
        saltName: 'Pantoprazole Sodium 40mg',
        brandedMRP: 85.0,
        genericPrice: 28.0,
        savingsPercent: 67.0,
        status: 'UNDER_NLEM_REVIEW',
      },
    ],
  };
}
