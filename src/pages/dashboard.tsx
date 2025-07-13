//dashboard.tsx

import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Heatmap from "../components/dashboard/Heatmap";
import FiltersPanel from "../components/dashboard/FiltersPanel";
import Loader from "../components/dashboard/Loader";
import { fetchAndParseCSV } from "../utils/csvParser.ts";
import { Filters } from "../types/filter";
import { groupByLocation } from "../utils/Groupby"; 
import { applyFilters } from "../utils/filterData"; 
import { Toast } from "primereact/toast";
import "./main.css"


const csvUrl = "/data/accidents.csv";

const Dashboard: React.FC = () => {
  const toastRef = useRef<Toast>(null);
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
  useEffect(() => {
    if (!loading && filteredData.length === 0) {
      toastRef.current?.show({
        severity: "warn",
        summary: "No data found",
        detail: "No accidents match the selected filters.",
        life: 3000,
      });
    }
  }, [filteredData, loading]);

  const [columnOptions, setColumnOptions] = useState<string[]>([]);
  const [locationOptions, setLocationOptions] = useState<string[]>([]);


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
      <h1 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-fade-in-down tracking-wide">
         Real-Time Accident Spatial Analysis
      </h1>
  
        <Toast ref={toastRef} position="bottom-right"/>

        
        <div className="relative w-full h-[645px] rounded-xl shadow-lg overflow-hidden">
          <Heatmap points={groupByLocation(filteredData)} />



          
          
          <button
            onClick={() => {
              setShowFilters(!showFilters);

              if (showFilters && groupByLocation(filteredData).length > 0) {
                toastRef.current?.show({
                  severity: "success",
                  summary: "✅ Accidents Visualized",
                  detail: `${groupByLocation(filteredData).length} accident(s) matched the filters.`,
                  life: 3000,
                });
              }
            }}
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
                onApplyFilters={() => {
                  toastRef.current?.show({
                    severity: "success",
                    summary: "✅ Accidents Visualized",
                    detail: `${groupByLocation(applyFilters(data, filters)).length} accident(s) matched the filters.`,
                    life: 3000,
                  });
                }}
              />
            </div>
          )}
        </div>

      

      </main>
    </div>
  );
};

export default Dashboard;
