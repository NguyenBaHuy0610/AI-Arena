/**
 * Evaluate an outfit combination against cultural & aesthetic rules.
 *
 * @param {Object} outfit — user's selected combination:
 *   {
 *     garmentId: string,        // e.g. 'ao-dai'
 *     accessories: string[],    // e.g. ['non-la', 'khan-ran']
 *     shoes: string | null,     // e.g. 'guoc-moc'
 *     color: string | null,     // e.g. 'do-son' (top garment color)
 *     context: string | null,   // e.g. 'tet'
 *     style: string | null,     // e.g. 'truyen-thong'
 *     region: string | null,    // e.g. 'bac-bo'
 *   }
 * @param {Array} rules — from rules.json
 * @returns {Object}
 *   {
 *     culturalScore: number (0–100),
 *     grade: 'A' | 'B' | 'C' | 'D',
 *     alerts: Array<{ id, level, message, sourceIds, delta, status }>,
 *     positives: Array<{ id, message, delta, sourceIds }>,  // rules with delta > 0
 *     warnings: Array<{ id, level, message, sourceIds, delta }>,  // rules with delta <= 0 or level > 0
 *   }
 */
export function evaluateOutfit(outfit, rules = []) {
  if (!outfit) {
    return {
      culturalScore: 100,
      grade: 'A',
      alerts: [],
      positives: [],
      warnings: [],
    };
  }

  let score = 100;
  const alerts = [];

  for (const rule of rules) {
    if (matchesCondition(rule.when, outfit)) {
      score += rule.delta || 0;
      alerts.push({
        id: rule.id,
        level: rule.level ?? 0,
        message: rule.message,
        sourceIds: rule.sourceIds || [],
        delta: rule.delta || 0,
        status: rule.status,
      });
    }
  }

  const culturalScore = Math.max(0, Math.min(100, score));
  const grade =
    culturalScore >= 90
      ? 'A'
      : culturalScore >= 70
      ? 'B'
      : culturalScore >= 50
      ? 'C'
      : 'D';

  return {
    culturalScore,
    grade,
    alerts,
    positives: alerts.filter(a => a.delta > 0),
    warnings: alerts.filter(a => a.delta < 0 || (a.delta === 0 && a.level > 0)),
  };
}

/**
 * Check if ALL conditions in `when.all` match the outfit.
 */
export function matchesCondition(when, outfit) {
  if (!when?.all || !Array.isArray(when.all)) return false;

  return when.all.every(cond => {
    // Garment conditions
    if (cond.garment?.in) {
      if (!outfit.garmentId || !cond.garment.in.includes(outfit.garmentId)) {
        return false;
      }
    }
    if (cond.garment?.notIn) {
      if (outfit.garmentId && cond.garment.notIn.includes(outfit.garmentId)) {
        return false;
      }
    }

    // Accessory conditions
    if (cond.accessories?.has) {
      if (!outfit.accessories || !outfit.accessories.includes(cond.accessories.has)) {
        return false;
      }
    }

    // Shoe conditions
    if (cond.shoes?.has) {
      if (outfit.shoes !== cond.shoes.has) {
        return false;
      }
    }
    if (cond.shoes?.in) {
      if (!outfit.shoes || !cond.shoes.in.includes(outfit.shoes)) {
        return false;
      }
    }

    // Context conditions
    if (cond.context?.in) {
      if (!outfit.context || !cond.context.in.includes(outfit.context)) {
        return false;
      }
    }

    // Style conditions
    if (cond.style?.in) {
      if (!outfit.style || !cond.style.in.includes(outfit.style)) {
        return false;
      }
    }

    // Region conditions
    if (cond.region?.in) {
      if (!outfit.region || !cond.region.in.includes(outfit.region)) {
        return false;
      }
    }

    // Color conditions
    if (cond.topColor?.in) {
      if (!outfit.color || !cond.topColor.in.includes(outfit.color)) {
        return false;
      }
    }

    return true;
  });
}
