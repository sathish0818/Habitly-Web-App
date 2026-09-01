import type { QuantifiedUnit } from "../data/HabitsContext";
import type { UnitSystem } from "../data/WellbeingContext";

const ML_PER_FL_OZ = 29.5735;

export function formatTargetValue(
  value: number,
  unit: QuantifiedUnit,
  unitSystem: UnitSystem = "metric"
): string {
  if (unit === "ml") {
    if (unitSystem === "imperial") {
      return `${Math.round(value / ML_PER_FL_OZ)}fl oz`;
    }
    return `${(value / 1000).toFixed(1)}L`;
  }
  if (unit === "hrs") return `${value}hrs`;
  return `${value.toLocaleString()} steps`;
}
