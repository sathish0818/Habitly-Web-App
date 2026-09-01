import type { QuantifiedUnit } from "../data/HabitsContext";

export function formatTargetValue(value: number, unit: QuantifiedUnit): string {
  if (unit === "ml") return `${(value / 1000).toFixed(1)}L`;
  if (unit === "hrs") return `${value}hrs`;
  return `${value.toLocaleString()} steps`;
}
