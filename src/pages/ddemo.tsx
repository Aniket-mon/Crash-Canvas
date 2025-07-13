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
} from "recharts";

interface AccidentData {
  'Driver Gender'?: string;
  'Driver Age'?: string;
  'Accident Severity'?: string;
  'Driver License Status'?: string;
}

interface AgeGenderStats {
  ageGroup: string;
  male_minor: number;
  male_serious: number;
  male_fatal: number;
  female_minor: number;
  female_serious: number;
  female_fatal: number;
  unknown_minor: number;
  unknown_serious: number;
  unknown_fatal: number;
}

interface LicenseStats {
  status: string;
  minor: number;
  serious: number;
  fatal: number;
}

const ageGroup = (ageStr?: string): string => {
  const age = parseInt(ageStr || "", 10);
  if (isNaN(age)) return "Unknown";
  if (age < 18) return "<18";
  if (age <= 30) return "18-30";
  if (age <= 45) return "31-45";
  if (age <= 60) return "46-60";
  return "60+";
};

const genders = ["male", "female", "unknown"] as const;
const severities = ["minor", "serious", "fatal"] as const;
type Gender = typeof genders[number];
type Severity = typeof severities[number];
type StatKey = `${Gender}_${Severity}`;

const aggregateAgeGenderSeverity = (data: AccidentData[]): AgeGenderStats[] => {
  const grouped: Record<string, AgeGenderStats> = {};

  data.forEach((row) => {
    const age = ageGroup(row['Driver Age']);
    const gender = (row['Driver Gender'] || 'unknown').toLowerCase() as Gender;
    const severity = row['Accident Severity']?.toLowerCase() as Severity;
    const key = age;
    const statKey = `${gender}_${severity}` as StatKey;

    if (!grouped[key]) {
      grouped[key] = {
        ageGroup: age,
        male_minor: 0,
        male_serious: 0,
        male_fatal: 0,
        female_minor: 0,
        female_serious: 0,
        female_fatal: 0,
        unknown_minor: 0,
        unknown_serious: 0,
        unknown_fatal: 0,
      };
    }

    if (statKey in grouped[key]) {
      grouped[key][statKey]++;
    }
  });

  return Object.values(grouped);
};

const aggregateLicenseStats = (data: AccidentData[]): LicenseStats[] => {
  const grouped: Record<string, LicenseStats> = {};

  data.forEach((row) => {
    let status = row['Driver License Status'] || 'Unknown';
    if (status === 'Unknown') status = 'License Not Found';

    const severity = row['Accident Severity']?.toLowerCase();

    if (!grouped[status]) grouped[status] = { status, minor: 0, serious: 0, fatal: 0 };

    if (severity?.includes("minor")) grouped[status].minor++;
    else if (severity?.includes("serious")) grouped[status].serious++;
    else if (severity?.includes("fatal")) grouped[status].fatal++;
  });

  return Object.values(grouped);
};

const DDemo: React.FC = () => {
  const [demographics, setDemographics] = useState<AgeGenderStats[]>([]);
  const [licenses, setLicenses] = useState<LicenseStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCSV = async () => {
      try {
        const raw = await fetchAndParseCSV("/data/accidents.csv");
        setDemographics(aggregateAgeGenderSeverity(raw));
        setLicenses(aggregateLicenseStats(raw));
      } catch (err: any) {
        setError("Failed to load CSV: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCSV();
  }, []);

  const exportCSV = () => {
    const rows = [
      ["Age Group vs. Accident Severity by Gender"],
      ["Age Group", ...Object.keys(demographics[0] || {}).filter(k => k !== "ageGroup")],
      ...demographics.map(row => [row.ageGroup, ...Object.values(row).slice(1)]),
      [""],
      ["License Status vs. Accident Severity"],
      ["Status", "Minor", "Serious", "Fatal"],
      ...licenses.map(row => [row.status, row.minor, row.serious, row.fatal]),
    ];

    const csvContent = rows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Crash Cavnvas - driver_demographics.csv");
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
            Driver Demographics
          </h2>
          {loading ? (
            <div className="text-center text-lg text-blue-600">Loading data...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-lg w-full h-[500px] mb-12 animate-slide-in-up">
                <h3 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                  👤 Age Group vs. Accident Severity by Gender
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demographics} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="ageGroup" tick={{ fill: "#374151" }} />
                    <YAxis tick={{ fill: "#374151" }} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Bar dataKey="male_minor" stackId="male" fill="#60a5fa" name="Minor (Male)" />
                    <Bar dataKey="male_serious" stackId="male" fill="#2563eb" name="Serious (Male)" />
                    <Bar dataKey="male_fatal" stackId="male" fill="#1e3a8a" name="Fatal (Male)" />
                    <Bar dataKey="female_minor" stackId="female" fill="#f472b6" name="Minor (Female)" />
                    <Bar dataKey="female_serious" stackId="female" fill="#ec4899" name="Serious (Female)" />
                    <Bar dataKey="female_fatal" stackId="female" fill="#be185d" name="Fatal (Female)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg w-full h-[500px] mb-12 animate-slide-in-up delay-200">
                <h3 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                   License Status vs. Accident Severity
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={licenses}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    barCategoryGap={12}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="status" tick={{ fill: "#374151" }} />
                    <YAxis tick={{ fill: "#374151" }} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Bar dataKey="minor" stackId="a" fill="#0cd548ff" name="Minor" />
                    <Bar dataKey="serious" stackId="a" fill="#fbbf24" name="Serious" />
                    <Bar dataKey="fatal" stackId="a" fill="#ef4444" name="Fatal" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center mt-20">
                <button
                  onClick={exportCSV}
                  className="bg-gradient-to-r from-green-500 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                >
                  ⬇ Download Data (CSV)
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DDemo;
