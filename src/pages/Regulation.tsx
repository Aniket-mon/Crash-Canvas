import React, { useEffect, useState } from "react";
import { fetchAndParseCSV } from "../utils/csvParser";
import Sidebar from "../components/dashboard/Sidebar";
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell
} from "recharts";

interface AccidentData {
  'Traffic Control Presence'?: string;
  'Accident Severity'?: string;
  'Speed Limit (km/h)'?: string;
  'Number of Fatalities'?: string;
}

interface TrafficControlEffect {
  control: string;
  minor: number;
  major: number;
  fatal: number;
}

interface SpeedFatality {
  speed: number;
  fatalities: number;
}

const aggregateTrafficControl = (rawData: AccidentData[]): TrafficControlEffect[] => {
  const grouped: Record<string, { minor: number; major: number; fatal: number }> = {};

  rawData.forEach(row => {
    const controlRaw = row['Traffic Control Presence'];
    if (!controlRaw || controlRaw.toLowerCase() === 'unknown') return; // exclude unknown or missing

    const control = controlRaw;
    const severity = row['Accident Severity']?.toLowerCase();

    if (!grouped[control]) grouped[control] = { minor: 0, major: 0, fatal: 0 };

    if (severity?.includes("minor")) grouped[control].minor++;
    else if (severity?.includes("serious")) grouped[control].major++;
    else if (severity?.includes("fatal")) grouped[control].fatal++;
  });

  return Object.entries(grouped).map(([control, stats]) => ({ control, ...stats }));
};

const aggregateSpeedFatalities = (rawData: AccidentData[]): SpeedFatality[] => {
  const grouped: Record<number, number> = {};

  rawData.forEach(row => {
    const speed = parseInt(row['Speed Limit (km/h)'] || '0', 10);
    const fatalities = parseInt(row['Number of Fatalities'] || '0', 10);

    if (!isNaN(speed)) {
      grouped[speed] = (grouped[speed] || 0) + fatalities;
    }
  });

  return Object.entries(grouped)
    .map(([speed, fatalities]) => ({ speed: parseInt(speed), fatalities }))
    .sort((a, b) => a.speed - b.speed);
};

const Regulations: React.FC = () => {
  const [trafficData, setTrafficData] = useState<TrafficControlEffect[]>([]);
  const [speedData, setSpeedData] = useState<SpeedFatality[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCSV = async () => {
      try {
        const raw = await fetchAndParseCSV("/data/accidents.csv");
        setTrafficData(aggregateTrafficControl(raw));
        setSpeedData(aggregateSpeedFatalities(raw));
      } catch (err: any) {
        setError("Failed to load CSV: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCSV();
  }, []);

  const handleDownload = () => {
    const rows = [
      ["Traffic Control Presence vs. Accident Severity"],
      ["Control", "Minor", "Major", "Fatal"],
      ...trafficData.map(d => [d.control, d.minor, d.major, d.fatal]),
      [""],
      ["Speed Limit vs. Fatalities"],
      ["Speed", "Fatalities"],
      ...speedData.map(d => [d.speed, d.fatalities])
    ];
    const csvContent = rows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Crash Cavnvas - regulatory_insights.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 h-full fixed z-10">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 overflow-y-auto h-screen p-6">
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-800 animate-fade-in-down">
            Regulatory & Environmental Insights
          </h2>
          {loading ? (
            <div className="text-center text-lg text-blue-600">Loading data...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-lg w-full h-[500px] mb-12">
                <h3 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                  🚦 Traffic Control Presence vs. Accident Severity
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trafficData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="control" tick={{ fill: "#374151" }} />
                    <YAxis tick={{ fill: "#374151" }} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Bar dataKey="minor" stackId="a" fill="#34d399" name="Minor" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="major" stackId="a" fill="#fbbf24" name="Serious" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="fatal" stackId="a" fill="#ef4444" name="Fatal" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg w-full h-[500px] mb-12">
                <h3 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                  ⚡ Speed Limit vs. Fatalities
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="speed" name="Speed Limit (km/h)" tick={{ fill: "#374151" }} />
                    <YAxis dataKey="fatalities" name="Fatalities" tick={{ fill: "#374151" }} />
                    <ZAxis range={[100]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend verticalAlign="top" height={36} iconType="diamond" />
                    <Scatter name="Fatalities by Speed" data={speedData} fill="#6366f1">
                      {speedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#6366f1" />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center mt-20">
                <button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-green-500 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                >
                  ⬇ Download Insights (CSV)
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Regulations;
