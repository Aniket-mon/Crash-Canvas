import React, { useEffect, useState } from "react";
import { fetchAndParseCSV } from "../utils/csvParser";
import Sidebar from "../components/dashboard/Sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AccidentData {
  Year: string;
  'Number of Fatalities': string;
  'Number of Casualties'?: string;
  'Alcohol Involvement'?: string;
  'Weather Conditions'?: string;
}

interface AggregatedData {
    year: number;
    casualties: number;
    fatalities: number;
}

interface AlcoholData {
  year: number;
  casualties: number;
  fatalities: number;
}

interface WeatherData {
  year: number;
  [key: string]: number;
}

const aggregateWeatherData = (rawData: AccidentData[]): WeatherData[] => {
  const grouped: Record<number, Record<string, number>> = {};

  rawData.forEach((row) => {
    const year = parseInt(row.Year, 10);
    const weather = row["Weather Conditions"]?.toLowerCase().trim();
    if (!isNaN(year) && weather) {
      const key = weather.charAt(0).toUpperCase() + weather.slice(1);
      if (!grouped[year]) grouped[year] = {};
      grouped[year][key] = (grouped[year][key] || 0) + 1;
    }
  });

  return Object.entries(grouped)
    .map(([year, weatherStats]) => ({
      year: parseInt(year),
      ...weatherStats,
    }))
    .sort((a, b) => a.year - b.year);
};

const aggregateData = (rawData: AccidentData[]): AggregatedData[] => {
  const grouped: Record<number, { casualties: number; fatalities: number }> = {};

  rawData.forEach((row) => {
    const year = parseInt(row.Year, 10);
    const fatalities = parseInt(row["Number of Fatalities"] || "0", 10);
    const casualties = parseInt(row["Number of Casualties"] || "0", 10);
    if (!isNaN(year)) {
      if (!grouped[year]) {
        grouped[year] = { casualties: 0, fatalities: 0 };
      }
      grouped[year].casualties += 1;
      grouped[year].fatalities += fatalities;
    }
  });

  return Object.entries(grouped)
    .map(([year, stats]) => ({ year: parseInt(year), ...stats }))
    .sort((a, b) => a.year - b.year);
};

const aggregateAlcoholData = (rawData: AccidentData[]): AlcoholData[] => {
  const grouped: Record<number, { fatalities: number; casualties: number }> = {};

  rawData.forEach((row) => {
    const year = parseInt(row.Year, 10);
    if (!isNaN(year) && row["Alcohol Involvement"]?.toLowerCase() === "yes") {
      const fatalities = parseInt(row["Number of Fatalities"] || "0", 10);
      const casualties = parseInt(row["Number of Casualties"] || "0", 10);

      if (!grouped[year]) {
        grouped[year] = { fatalities: 0, casualties: 0 };
      }
      grouped[year].fatalities += fatalities;
      grouped[year].casualties += casualties;
    }
  });

  return Object.entries(grouped)
    .map(([year, stats]) => ({ year: parseInt(year), ...stats }))
    .sort((a, b) => a.year - b.year);
};

const Trends: React.FC = () => {
  const [data, setData] = useState<AggregatedData[]>([]);
  const [alcoholData, setAlcoholData] = useState<AlcoholData[]>([]);
  const [showAlcoholChart, setShowAlcoholChart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]); 
  const [showWeatherChart, setShowWeatherChart] = useState(false);

  useEffect(() => {
    const loadCSV = async () => {
      try {
        const raw = await fetchAndParseCSV("/data/accidents.csv");
        setData(aggregateData(raw));
        setAlcoholData(aggregateAlcoholData(raw));
        setWeatherData(aggregateWeatherData(raw));
      } catch (err: any) {
        setError("Failed to load CSV: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCSV();
  }, []);

    const handleDownload = () => {
    const generalHeader = ["Year", "Casualties", "Fatalities"];
    const generalRows = data.map(d => [d.year, d.casualties, d.fatalities]);

    const alcoholHeader = ["Year", "Alcohol-Related Casualties", "Alcohol-Related Fatalities"];
    const alcoholRows = alcoholData.map(d => [d.year, d.casualties, d.fatalities]);

    const weatherHeader = ["Year", ...new Set(weatherData.flatMap(w => Object.keys(w)).filter(k => k !== "year"))];
    const weatherRows = weatherData.map(d => {
        return [d.year, ...weatherHeader.slice(1).map(key => d[key] ?? 0)];
    });

    // Combine all sections with headers and empty lines
    const csvSections: string[] = [
        "General Accident Trends",
        generalHeader.join(","),
        ...generalRows.map(r => r.join(",")),
        "",

        "Alcohol Involvement Trends",
        alcoholHeader.join(","),
        ...alcoholRows.map(r => r.join(",")),
        "",

        "Weather Conditions Trends",
        weatherHeader.join(","),
        ...weatherRows.map(r => r.join(",")),
    ];

    const csvContent = csvSections.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Crash Cavnvas - Yearly_Trends.csv");
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
          Yearly Trends in Accidents and Fatalities in India (2018–2023)
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Raising Awareness for Safer Roads
        </p>

        {loading ? (
          <div className="text-center text-lg text-blue-600">Loading data...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <>
            {/* First Chart */}
            <div className="bg-white p-4 rounded-lg shadow w-full h-[500px] mb-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="year" tick={{ fill: "#666" }} />
                  <YAxis yAxisId="left" tick={{ fill: "#666" }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "#666" }} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="casualties"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#3b82f6" }}
                    name="Total Casualties"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="fatalities"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: "#ef4444" }}
                    name="Total Fatalities"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Toggle Button */}
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setShowAlcoholChart(!showAlcoholChart)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                {showAlcoholChart ? "Hide" : "Show"} 'Under Influence of Alcohol' Trends
              </button>
            </div>

            {/* Alcohol Chart */}
            {showAlcoholChart && (
              <div className="bg-white p-4 rounded-lg shadow w-full h-[500px] mb-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={alcoholData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="year" tick={{ fill: "#666" }} />
                    <YAxis yAxisId="left" tick={{ fill: "#666" }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: "#666" }} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="casualties"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#10b981" }}
                      name="Casualties (Alcohol Involved)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="fatalities"
                      stroke="#f43f5e"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 4, fill: "#f43f5e" }}
                      name="Fatalities (Alcohol Involved)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}

        <p className="text-center text-sm text-red-600 mt-2 font-semibold">
        50.67% of accidents occurred under the influence of alcohol.
        </p>

        <div className="flex justify-center mt-5 mb-6">
        <button
            onClick={() => setShowWeatherChart(!showWeatherChart)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
            {showWeatherChart ? "Hide" : "Show"} Weather Analysis
        </button>
        </div>

        {showWeatherChart && (
        <>
        <div className="bg-white p-4 rounded-lg shadow w-full h-[550px] mt-10 mb-10">
        <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">
            Accidents by Weather Condition (2018–2023)
        </h3>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weatherData} margin={{ top: 20, right: 50, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="year" tick={{ fill: "#666" }} />
            <YAxis tick={{ fill: "#666" }} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            {["Clear", "Rainy", "Foggy", "Stormy", "Hazy"].map((condition, idx) => (
                <Line
                key={condition}
                type="monotone"
                dataKey={condition}
                stroke={["#decb00ff", "#51c8ffff", "#a855f7", "#ef4444", "#10b981"][idx]}
                strokeWidth={2}
                dot={{ r: 4 }}
                name={`${condition}`}
                />
            ))}
            </LineChart>
        </ResponsiveContainer>
        </div>
        </>
        )}
        <p className="text-center text-sm text-blue-600 mt-2 font-semibold">
        Rainy conditions contributed to 21.04% of accidents.
        </p>
        <p className="text-center text-sm text-gray-500 mt-6">
          Drive Safely: Avoid Alcohol and Check Weather Before Travel. 
        </p>

        <div className="flex justify-center mt-10">
          <button
            onClick={handleDownload}
            className="bg-gradient-to-r from-green-500 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            ⬇ Download Trends (CSV)
          </button>
        </div>
      </main>
      </div>
    </div>
  );
};

export default Trends;
