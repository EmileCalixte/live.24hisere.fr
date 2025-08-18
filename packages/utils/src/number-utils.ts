export function range(min: number, max: number, step = 1): number[] {
  if (step <= 0 || !Number.isInteger(step)) {
    throw new Error("Step must be a must be a positive non-null integer");
  }

  if (min === max) {
    return [];
  }

  const range = [];

  if (min < max) {
    for (let i = min; i <= max; i += step) {
      range.push(i);
    }
  } else {
    for (let i = min; i >= max; i -= step) {
      range.push(i);
    }
  }

  return range;
}

export function formatPercentage(ratio: number, decimals = 0): string {
  return `${(ratio * 100).toFixed(decimals)} %`;
}
