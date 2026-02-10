export const scenarios = [
  {
    name: 'Rare disease screening',
    prevalence: 1,
    sensitivity: 95,
    specificity: 95,
    insight: 'Rare condition + imperfect specificity can produce many false positives.'
  },
  {
    name: 'Specialist clinic',
    prevalence: 30,
    sensitivity: 92,
    specificity: 94,
    insight: 'Higher base rate makes a positive result more trustworthy.'
  },
  {
    name: 'Fraud detection',
    prevalence: 2,
    sensitivity: 90,
    specificity: 98,
    insight: 'Fraud is rare; tiny specificity drops create false-alert floods.'
  }
];
