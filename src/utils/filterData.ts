import { Filters } from "../types/filter";

// Convert month name to number for comparison
const monthMap: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

export function applyFilters(data: any[], filters: Filters): any[] {
  return data.filter((item) => {
    // Accident Location Details
    if (
      filters.ALD.length &&
      !filters.ALD.includes(item["Accident Location Details"])
    ) return false;

    // Year
    if (filters.year && Number(item.Year) !== filters.year) return false;

    // Month
    const itemMonthNum = monthMap[item["Month"]];
    if (filters.month && itemMonthNum !== filters.month) return false;

    // Severity
    if (
      filters.severity.length &&
      !filters.severity.includes(item["Accident Severity"])
    ) return false;

    // Vehicle Type (key fixed)
    if (
      filters.vehicleType.length &&
      !filters.vehicleType.includes(item["Vehicle Type Involved"])
    ) return false;

    // Weather (key fixed)
    if (
      filters.weather.length &&
      !filters.weather.includes(item["Weather Conditions"])
    ) return false;

    // Road Type
    if (
      filters.roadType.length &&
      !filters.roadType.includes(item["Road Type"])
    ) return false;

    // Road Condition
    if (
      filters.roadCondition.length &&
      !filters.roadCondition.includes(item["Road Condition"])
    ) return false;

    return true;
  });
}
