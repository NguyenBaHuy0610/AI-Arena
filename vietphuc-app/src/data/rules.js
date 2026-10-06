import rulesData from '../../../data/rules.json';

export const RULES = rulesData.rules;

// Get rules applicable to a specific garment
export function getRulesForGarment(garmentId) {
  return RULES.filter(rule =>
    rule.when.all.some(cond =>
      cond.garment?.in?.includes(garmentId) ||
      cond.garment?.notIn !== undefined
    )
  );
}
