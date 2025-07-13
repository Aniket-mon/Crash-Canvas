// MapWrapper.tsx
import React, { useEffect, useState } from "react";
import Heatmap from "./Heatmap"; // Your existing map visualization component
import { fetchAndParseCSV } from "../../utils/csvParser"; // Your CSV parser
import { parseFloat } from "lodash"; // optional, native parseFloat works too

type Point = {
  lat: number;
  lng: number;
  intensity: number;
  severity: "Fatal" | "Serious" | "Minor";
};

function groupByLocation(data: any[]): Point[] {
  const grouped = new Map<string, { count: number, severity: string, lat: number, lng: number }>();

  for (const row of data) {
    const lat = parseFloat(row.Latitude);
    const lng = parseFloat(row.Longitude);
    const severity = row["Accident Severity"];

    if (!lat || !lng || !severity) continue;

    const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;

    if (!grouped.has(key)) {
      grouped.set(key, { count: 1, severity, lat, lng });
    } else {
      const g = grouped.get(key)!;
      g.count += 1;
    }
  }

  const points: Point[] = [];
  for (const g of grouped.values()) {
    points.push({
      lat: g.lat,
      lng: g.lng,
      severity: g.severity as Point["severity"],
      intensity: g.count,
    });
  }

  return points;
}

export default function MapWrapper() {
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const rawData = await fetchAndParseCSV("/data/accidents.csv"); // path to your CSV
      const groupedPoints = groupByLocation(rawData); // ✅ APPLY HERE
      setPoints(groupedPoints);
    };

    loadData();
  }, []);

  return (
    <div className="w-full h-screen">
      <Heatmap points={points} />
    </div>
  );
}
