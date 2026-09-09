export interface InteractionRisk {
  saltsInvolved: [string, string];
  severity: 'critical' | 'major' | 'moderate' | 'safe';
  clinicalWarning: string;
  recommendation: string;
}

export interface DDIAnalysisResult {
  hasInteractions: boolean;
  maxSeverity: 'critical' | 'major' | 'moderate' | 'safe';
  interactions: InteractionRisk[];
  clinicalSummary: string;
}

const KNOWN_INTERACTIONS: InteractionRisk[] = [
  {
    saltsInvolved: ['Metformin Hydrochloride', 'Contrast Media'],
    severity: 'critical',
    clinicalWarning: 'Risk of Severe Lactic Acidosis. Metformin must be withheld prior to iodinated contrast procedures.',
    recommendation: 'Temporarily discontinue Metformin 48 hours prior to contrast imaging procedure under medical supervision.',
  },
  {
    saltsInvolved: ['Pantoprazole Sodium', 'Clopidogrel'],
    severity: 'major',
    clinicalWarning: 'Reduced Antiplatelet Efficacy. Proton Pump Inhibitors may decrease active metabolite exposure of Clopidogrel.',
    recommendation: 'Consider H2-receptor antagonist (e.g. Famotidine) or stagger dosing interval by 12 hours.',
  },
  {
    saltsInvolved: ['Amoxicillin and Potassium Clavulanate', 'Methotrexate'],
    severity: 'major',
    clinicalWarning: 'Increased Methotrexate Toxicity. Penicillins reduce renal clearance of Methotrexate.',
    recommendation: 'Monitor serum Methotrexate levels and signs of bone marrow suppression closely.',
  },
  {
    saltsInvolved: ['Paracetamol', 'Warfarin'],
    severity: 'moderate',
    clinicalWarning: 'Enhanced Anticoagulant Effect. High chronic doses of Paracetamol (>2g/day) may elevate INR values.',
    recommendation: 'Limit Paracetamol to short-term SOS use or monitor INR weekly during prolonged co-administration.',
  },
];

export function analyzeDrugInteractions(salts: string[]): DDIAnalysisResult {
  const normalizedSalts = salts.map((s) => s.toLowerCase().trim());
  const detectedInteractions: InteractionRisk[] = [];

  for (const interaction of KNOWN_INTERACTIONS) {
    const s1 = interaction.saltsInvolved[0].toLowerCase();
    const s2 = interaction.saltsInvolved[1].toLowerCase();

    const matchesFirst = normalizedSalts.some((s) => s.includes(s1) || s1.includes(s));
    const matchesSecond = normalizedSalts.some((s) => s.includes(s2) || s2.includes(s));

    if (matchesFirst && matchesSecond) {
      detectedInteractions.push(interaction);
    }
  }

  let maxSeverity: 'critical' | 'major' | 'moderate' | 'safe' = 'safe';
  if (detectedInteractions.some((i) => i.severity === 'critical')) {
    maxSeverity = 'critical';
  } else if (detectedInteractions.some((i) => i.severity === 'major')) {
    maxSeverity = 'major';
  } else if (detectedInteractions.some((i) => i.severity === 'moderate')) {
    maxSeverity = 'moderate';
  }

  const summary = detectedInteractions.length === 0
    ? 'No adverse drug-drug interactions detected between prescribed active salts.'
    : `Detected ${detectedInteractions.length} clinical drug interaction(s) requiring pharmacist review.`;

  return {
    hasInteractions: detectedInteractions.length > 0,
    maxSeverity,
    interactions: detectedInteractions,
    clinicalSummary: summary,
  };
}
