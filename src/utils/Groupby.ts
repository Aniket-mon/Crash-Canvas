//Groupby.ts

export type Point = {
  lat: number;
  lng: number;
  severity: "Fatal" | "Serious" | "Minor";
  intensity: number;
  vehicleType?: string;
  casualties: number;
  fatalities: number;
  date?: string;
  time: string;
  vehicles: number;
  speedLimit: number;
};

export function groupByLocation(data: any[]): Point[] {
  const points: Point[] = [];

  for (const row of data) {
    const lat = parseFloat(row["Latitude"]);
    const lng = parseFloat(row["Longitude"]);
    const severity = row["Accident Severity"]; 
    const vehicleType = row["Vehicle Type Involved"] || "Unknown";
    const casualties = Number(row["Number of Casualties"]) || 0;
    const fatalities = Number(row["Number of Fatalities"]) || 0;
    const month = row["Month"] || "Unknown";
    const year = row["Year"] || "Unknown";
    const date = `${month} ${year}`;   
    const time = row["Time of Day"] || "Unknown";
    const vehicles = Number(row["Number of Vehicles Involved"]) || 0;
    const speedLimit = Number(row["Speed Limit (km/h)"]) || 0;

    // Validate values
    if (isNaN(lat) || isNaN(lng) || !["Fatal", "Serious", "Minor"].includes(severity)) continue;

    points.push({
      lat,
      lng,
      severity,
      intensity: 1, 
      casualties,
      fatalities,
      vehicleType,
      date,
      time,
      vehicles,
      speedLimit,
    });
  }

  return points;
}
