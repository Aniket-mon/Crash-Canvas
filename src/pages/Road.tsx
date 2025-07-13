import React, { useEffect, useState } from "react";
import { fetchAndParseCSV } from "../utils/csvParser";
import Sidebar from "../components/dashboard/Sidebar";

interface AccidentData {
  'Accident Severity'?: string;
  'Road Condition'?: string;
  'Road Type'?: string;
  'Number of Vehicles Involved'?: string;
  'Time of Day'?: string;
  'Day of Week'?: string;
  'Alcohol Involvement'?: string;
  'Driver Gender'?: string;
  'Driver Age'?: string;
  'Lighting Conditions'?: string;
  'Accident Location Details'?: string;
  'Number of Fatalities'?: string;
}

const RoadCond: React.FC = () => {
  const [data, setData] = useState<AccidentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCSV = async () => {
      try {
        const raw = await fetchAndParseCSV("/data/accidents.csv");
        setData(raw);
      } catch (err: any) {
        setError("Failed to load CSV: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCSV();
  }, []);

  const renderBasicChart = (title: string, values: Record<string, number>) => {
    const maxVal = Math.max(...Object.values(values));
    return (
      <div className="bg-white p-6 rounded-xl shadow w-full ml-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">{title}</h3>
        <div className="space-y-2">
          {Object.entries(values).map(([label, count]) => (
            <div key={label} className="flex items-start">
              <span className="w-52 text-sm text-gray-700 whitespace-pre-wrap break-words">
                {label}
              </span>
              <div className="flex-1 h-4 bg-gray-200 rounded overflow-hidden mx-2 mt-1">
                <div
                  className="h-4 bg-blue-500"
                  style={{ width: `${(count / maxVal) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-700 mt-1">{count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const exportCSV = (charts: { title: string; values: Record<string, number> }[]) => {
    const rows = charts.flatMap(({ title, values }) => [
      [title],
      ["Label", "Count"],
      ...Object.entries(values),
      [""],
    ]);
    const csvContent = rows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Crash Cavnvas - accident_flow_charts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const aggregateCounts = (field: keyof AccidentData): Record<string, number> => {
    const result: Record<string, number> = {};
    data.forEach((entry) => {
      const val = entry[field] || "Unknown";
      result[val] = (result[val] || 0) + 1;
    });
    return result;
  };

  const aggregateNested = (field1: keyof AccidentData, field2: keyof AccidentData): Record<string, number> => {
    const result: Record<string, number> = {};
    data.forEach((entry) => {
      const key1 = entry[field1] || "Unknown";
      const key2 = entry[field2] || "Unknown";
      const combined = `${key1} → ${key2}`;
      result[combined] = (result[combined] || 0) + 1;
    });
    return result;
  };

  const charts = [
    { title: "Accidents by Road Type", values: aggregateCounts("Road Type") },
    { title: "Accidents by Road Condition", values: aggregateCounts("Road Condition") },
    { title: "Accidents by Lighting Conditions", values: aggregateCounts("Lighting Conditions") },
    { title: "Accidents by Location Details", values: aggregateCounts("Accident Location Details") },
    { title: "Accident Flow: Road Type → Lighting Conditions", values: aggregateNested("Road Type", "Lighting Conditions") },
    { title: "Accident Flow: Road Condition → Location Details", values: aggregateNested("Road Condition", "Accident Location Details") },
    { title: "Accident Flow: Lighting Conditions → Severity", values: aggregateNested("Lighting Conditions", "Accident Severity") },
    { title: "Accident Flow: Road Type → Road Condition", values: aggregateNested("Road Type", "Road Condition") },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-15 overflow-y-auto h-screen p-6">
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-800 animate-fade-in-down">
            Accident Flow Charts (2018–2023)
          </h2>
          {loading ? (
            <div className="text-center text-lg text-blue-600">Loading data...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-12">
                {charts.map(({ title, values }) => renderBasicChart(title, values))}
              </div>
              <div className="flex justify-center mt-16 ">
                <button
                  onClick={() => exportCSV(charts)}
                  className="bg-gradient-to-r from-green-500 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                >
                  ⬇ Download Charts (CSV)
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default RoadCond;
