//dashboard.tsx

import React, { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Heatmap from "../components/dashboard/Heatmap";
import KPICards from "../components/dashboard/KPICards";
import FiltersPanel from "../components/dashboard/FiltersPanel";
import ExportControls from "../components/dashboard/ExportControls";
import Loader from "../components/dashboard/Loader";
import { fetchAndParseCSV } from "../utils/csvParser.ts";
import { Filters } from "../types/filter";
import { groupByLocation } from "../utils/Groupby"; 
import { applyFilters } from "../utils/filterData"; 



const csvUrl = "/data/accidents.csv";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<Filters>({
    ALD: [],
    year: undefined,
    month: undefined,
    day: undefined,
    severity: [],
    vehicleType: [],
    weather: [],
    roadType: [],
    roadCondition: []
  });
  const filteredData = applyFilters(data, filters);
  const [columnOptions, setColumnOptions] = useState<string[]>([]);
  const [locationOptions, setLocationOptions] = useState<string[]>([]);

  const totalAccidents = data.length;
  const totalFatalities = data.reduce(
    (sum, d) => sum + (Number(d["Number of Fatalities"]) || 0),
    0
  );
  const fatalityRate = totalAccidents > 0
    ? ((totalFatalities / totalAccidents) * 100).toFixed(1) + "%"
    : "0%";


  useEffect(() => {
    fetchAndParseCSV(csvUrl)
      .then((json) => {
        console.log("Parsed CSV data:", json);
        setData(json);
        setLoading(false);
        if (json.length > 0) {
          setColumnOptions(Object.keys(json[0])); 
        }
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
      <main className="flex-1 p-4 bg-gray-50 flex flex-col gap-6">  

        
        <div className="relative w-full h-[700px] rounded-xl shadow-lg overflow-hidden">
          <Heatmap points={groupByLocation(filteredData)} />



          
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
              <FiltersPanel 
              filters={filters} 
              setFilters={setFilters}
              />
            </div>
          )}
        </div>

      

      </main>
    </div>
  );
};

export default Dashboard;
