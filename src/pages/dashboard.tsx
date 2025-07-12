import React, { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Heatmap from "../components/dashboard/Heatmap";
import KPICards from "../components/dashboard/KPICards";
import FiltersPanel from "../components/dashboard/FiltersPanel";
import ExportControls from "../components/dashboard/ExportControls";
import Loader from "../components/dashboard/Loader";
import { fetchAndParseCSV } from "../utils/csvParser.ts";
import { Filters } from "../types/filter";

const csvUrl = "/data/accidents.csv";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    region: "All",
    state: undefined,
    year: undefined,
    month: undefined,
    day: undefined,
    severity: [],
    vehicleType: [],
    driverGender: "",
    weather: "",
    roadType: "",
    roadCondition: ""
  });

  useEffect(() => {
    fetchAndParseCSV(csvUrl)
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading CSV:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen overflow-auto">
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-50 flex flex-col gap-6">  {/* Reduced padding for closer sidebar touch */}

        {/* Full-width Heatmap with Overlay Filter */}
        <div className="relative w-full h-[700px] rounded-xl shadow-lg overflow-hidden">
          <Heatmap
            points={data
              .filter(
                (d) =>
                  d.Latitude &&
                  d.Longitude &&
                  !isNaN(Number(d.Latitude)) &&
                  !isNaN(Number(d.Longitude))
              )
              .map((d) => ({
                lat: Number(d.Latitude),
                lng: Number(d.Longitude),
                intensity:
                  d["Accident Severity"] === "Fatal"
                    ? 1
                    : d["Accident Severity"] === "Serious"
                    ? 0.6
                    : 0.3,
                severity: d["Accident Severity"],
              }))}
          />

          {/* Beautified Filter Button with Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute top-4 right-4 z-[1000] bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-3 rounded-full shadow-xl hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium"
          >
            {showFilters ? '✕ Close' : '🛠️ Filter'}
          </button>

          {showFilters && (
            <div className="absolute top-4 right-24 z-[999] bg-white shadow-2xl border border-gray-200 rounded-2xl p-6 w-[750px] max-h-[90vh] overflow-y-auto animate-fade-in transition-all duration-300">  
              <div className="flex justify-between items-center mb-4 border-b pb-2">

                
              </div>
              <FiltersPanel filters={filters} setFilters={setFilters} />
            </div>
          )}
        </div>

        {/* Map Legend */}
        <div className="p-4 bg-white rounded-xl shadow border text-sm w-full">
          <p className="font-semibold mb-2">Accident Severity:</p>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-600 block"></span>
              <span>Fatal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-yellow-500 block"></span>
              <span>Serious</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 block"></span>
              <span>Minor</span>
            </div>
          </div>
        </div>

        {/* KPIs + Export Button */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KPICards
            kpis={{
              totalAccidents: data.length,
              totalFatalities: data.reduce(
                (sum, d) => sum + Number(d["Number of Fatalities"] || 0),
                0
              ),
              fatalityRate:
                (
                  (data.reduce(
                    (sum, d) => sum + Number(d["Number of Fatalities"] || 0),
                    0
                  ) /
                    data.length) *
                  100
                ).toFixed(1) + "%",
            }}
          />
          <ExportControls data={data} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
