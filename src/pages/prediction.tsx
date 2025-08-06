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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface AccidentData {
  'Accident Severity'?: string;
  'Weather Conditions'?: string;
  'Road Condition'?: string;
  'Road Type'?: string;
  'Number of Vehicles Involved'?: string;
  'Vehicle Type Involved'?: string;
  'Time of Day'?: string;
  'Day of Week'?: string;
  'Alcohol Involvement'?: string;
  'Driver Gender'?: string;
  'Driver Age'?: string;
  'Driver License Status'?: string;
}

const Prediction: React.FC = () => {
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

  const aggregateByField = (field: keyof AccidentData, sortByTime = false) => {
    if (field === "Time of Day") {
      const hourlyBins: Record<string, Record<string, number>> = {};
      for (let h = 0; h < 24; h++) {
        const label = `${h.toString().padStart(2, '0')}:00`;
        hourlyBins[label] = { Minor: 0, Serious: 0, Fatal: 0 };
      }

      data.forEach((d) => {
        const time = d['Time of Day'];
        const severity = d['Accident Severity'] || "Unknown";
        if (time) {
          const hour = parseInt(time.split(":" )[0]);
          const binLabel = `${hour.toString().padStart(2, '0')}:00`;
          if (!hourlyBins[binLabel]) hourlyBins[binLabel] = { Minor: 0, Serious: 0, Fatal: 0 };
          if (severity in hourlyBins[binLabel]) {
            hourlyBins[binLabel][severity]!++;
          } else {
            hourlyBins[binLabel][severity] = 1;
          }
        }
      });

      return Object.entries(hourlyBins).map(([hour, counts]) => ({ category: hour, ...counts }));
    }

    const result: Record<string, Record<string, number>> = {};
    data.forEach((d) => {
      const category = d[field] || "Unknown";
      const severity = d['Accident Severity'] || "Unknown";
      if (!result[category]) result[category] = {};
      if (!result[category][severity]) result[category][severity] = 0;
      result[category][severity]++;
    });
    return Object.entries(result).map(([key, val]) => ({ category: key, ...val }));
  };

  const pieData = aggregateByField("Accident Severity").map(d => ({
    name: d.category,
    value: Object.values(d).filter(v => typeof v === 'number').reduce((a: number, b: number) => a + (b as number), 0)
  }));

  const colors = ["#fbbf24", "#34d399", "#ef4444"];

  const handleDownload = () => {
    const csvContent = [
      Object.keys(data[0] || {}).join(","),
      ...data.map(row => Object.values(row).map(v => `"${v ?? ''}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Crash Cavnvas - severity_prediction.csv");
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
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
            Accident Severity Analysis (2018-2023)
          </h2>
          {loading ? (
            <div className="text-center text-lg text-blue-600">Loading data...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : (
            <>
              {/* Pie Chart - Severity Distribution */}
              <div className="bg-white p-6 rounded-2xl shadow-lg w-full h-[500px] mb-12">
                <h3 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                   Severity Distribution
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={140}
                      label
                    >
                      {pieData.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                      ))}
                    </Pie>
                    <Legend layout="horizontal" verticalAlign="top" align="center" iconType="circle" wrapperStyle={{ top: 0, fontSize: 14 }} />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Additional Charts */}
              <div className="bg-white p-6 rounded-2xl shadow-lg w-full h-[500px] mb-12">
                <h3 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                   Day of Week vs. Accident Severity
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={aggregateByField("Day of Week")} margin={{ right: 10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" tick={{ fill: "#374151" }} />
                    <YAxis tick={{ fill: "#374151" }} />
                    <Tooltip />
                    <Legend layout="horizontal" verticalAlign="top" align="center" iconType="circle" wrapperStyle={{ top: 0, fontSize: 14 }} />
                    <Line type="monotone" dataKey="Minor" stroke="#34d399" />
                    <Line type="monotone" dataKey="Serious" stroke="#fbbf24" />
                    <Line type="monotone" dataKey="Fatal" stroke="#ef4444" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg w-full h-[500px] mb-12">
                <h3 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                   Time of Day vs. Accident Severity
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={aggregateByField("Time of Day", true)} margin={{ bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" tick={{ fill: "#374151", fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fill: "#374151" }} />
                    <Tooltip />
                    <Legend layout="horizontal" verticalAlign="top" align="center" iconType="circle" wrapperStyle={{ top: 0, fontSize: 14 }} />
                    <Bar dataKey="Minor" stackId="a" fill="#34d399" />
                    <Bar dataKey="Serious" stackId="a" fill="#fbbf24" />
                    <Bar dataKey="Fatal" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg w-full h-[500px] mb-12">
                <h3 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                   Vehicle Type Involved vs. Severity
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={aggregateByField("Vehicle Type Involved")} margin={{ bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" tick={{ fill: "#374151" }} />
                    <YAxis tick={{ fill: "#374151" }} />
                    <Tooltip />
                    <Legend layout="horizontal" verticalAlign="top" align="center" iconType="circle" wrapperStyle={{ top: 0, fontSize: 14 }} />
                    <Bar dataKey="Minor" stackId="a" fill="#34d399" />
                    <Bar dataKey="Serious" stackId="a" fill="#fbbf24" />
                    <Bar dataKey="Fatal" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center mt-10">
                <button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-green-500 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Download CSV
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Prediction;
