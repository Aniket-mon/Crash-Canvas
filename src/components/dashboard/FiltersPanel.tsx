//FiltersPanel.tsx

import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Filters } from "../../types/filter";
import "./filters.css";

type Props = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onApplyFilters?: () => void;
};

const locationOptionsRaw = ["Curve", "Straight Road", "Bridge", "Intersection"];
const locationOptions = locationOptionsRaw.map(ld => ({ label: ld, value: ld }));



const severityOptions = [
  { label: "Fatal", value: "Fatal" },
  { label: "Serious", value: "Serious" },
  { label: "Minor", value: "Minor" },
];

const vehicleOptions = [
  "Cycle", "Truck", "Pedestrian", "Bus", "Two-Wheeler", "Car", "Auto-Rickshaw"
].map(v => ({ label: v, value: v }));

const weatherOptionsRaw = ["Clear", "Rainy", "Foggy", "Stormy", "Hazy"];
const weatherOptions = weatherOptionsRaw.map(w => ({ label: w, value: w }));

const roadTypeOptionsRaw = ["National Highway", "State Highway", "Urban Road", "Village Road"];
const roadTypeOptions = roadTypeOptionsRaw.map(rt => ({ label: rt, value: rt }));

const roadConditionOptionsRaw = ["Dry", "Wet", "Damaged", "Under Construction"];
const roadConditionOptions = roadConditionOptionsRaw.map(rc => ({ label: rc, value: rc }));

const yearOptions = [
  ...Array.from({ length: 6 }, (_, i) => ({
    label: `${2018 + i}`,
    value: 2018 + i,
  })),
];

const monthOptions = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

const customTokenRenderer = (
  value: string[],
  options: { label: string; value: string }[]
): React.ReactNode => {
  if (!value || value.length === 0) return "Select";
  if (value.length === 1) {
    const label = options.find(opt => opt.value === value[0])?.label || value[0];
    return <span className="p-multiselect-token">{label}</span>;
  }
  return <span className="p-multiselect-token">*</span>;
};

const FiltersPanel: React.FC<Props> = ({ filters, setFilters }) => {
  const [tempFilters, setTempFilters] = useState<Filters>(filters);



  const handleMultiSelect = (
    field: keyof Filters,
    value: string[] | null,
    allOptions: string[]
  ) => {
    if (value?.includes("ALL")) {
      setTempFilters({ ...tempFilters, [field]: allOptions });
    } else {
      setTempFilters({ ...tempFilters, [field]: value });
    }
  };

  const handleSubmit = () => {
    setFilters(tempFilters);
    if (onApplyFilters) onApplyFilters();
  };

  const handleClear = () => {
    setTempFilters({
      ALD: [],
      year: undefined,
      month: undefined,
      day: undefined,
      severity: [],
      vehicleType: [],
      weather: [],
      roadType: [],
      roadCondition: [],
    });
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h2 className="filter-title">Filter Accidents Data</h2>
        <button className="clear-btn" onClick={handleClear}>Clear All ✨</button>
      </div>

      <div className="filter-grid">
        <div className="filter-column">
          <div className="filter-group">
            <label className="filter-label">Location Details</label>
            <MultiSelect
              value={tempFilters.ALD || []}
              options={locationOptions}
              onChange={e => setTempFilters({ ...tempFilters, ALD: e.value })}
              placeholder="Select Location"
              className="filter-multiselect"
              display="chip"
              selectedItemTemplate={(value) => customTokenRenderer(value, locationOptions)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Year</label>
            <Dropdown
              value={tempFilters.year ?? null}
              options={yearOptions}
              onChange={e => setTempFilters({ ...tempFilters, year: e.value })}
              placeholder="Select Year"
              className="filter-dropdown"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Month</label>
            <Dropdown
              value={tempFilters.month ?? null}
              options={monthOptions}
              onChange={e => setTempFilters({ ...tempFilters, month: e.value })}
              placeholder="Select Month"
              className="filter-dropdown"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Severity</label>
            <MultiSelect
              value={tempFilters.severity || []}
              options={severityOptions}
              onChange={e => setTempFilters({ ...tempFilters, severity: e.value })}
              placeholder="Select Severity"
              className="filter-multiselect"
              display="chip"
              selectedItemTemplate={(value) => customTokenRenderer(value, severityOptions)}
            />
          </div>
        </div>

        <div className="filter-column">
          <div className="filter-group">
            <label className="filter-label">Vehicle Type</label>
            <MultiSelect
              value={tempFilters.vehicleType || []}
              options={vehicleOptions}
              onChange={e => setTempFilters({ ...tempFilters, vehicleType: e.value })}
              placeholder="Select Vehicle Type"
              className="filter-multiselect"
              display="chip"
              selectedItemTemplate={(value) => customTokenRenderer(value, vehicleOptions)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Weather</label>
            <MultiSelect
              value={tempFilters.weather || []}
              options={weatherOptions}
              onChange={e => handleMultiSelect("weather", e.value, weatherOptionsRaw)}
              placeholder="Select Weather"
              className="filter-multiselect"
              display="chip"
              selectedItemTemplate={(value) => customTokenRenderer(value, weatherOptions)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Road Type</label>
            <MultiSelect
              value={tempFilters.roadType || []}
              options={roadTypeOptions}
              onChange={e => handleMultiSelect("roadType", e.value, roadTypeOptionsRaw)}
              placeholder="Select Road Type"
              className="filter-multiselect"
              display="chip"
              selectedItemTemplate={(value) => customTokenRenderer(value, roadTypeOptions)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Road Condition</label>
            <MultiSelect
              value={tempFilters.roadCondition || []}
              options={roadConditionOptions}
              onChange={e => handleMultiSelect("roadCondition", e.value, roadConditionOptionsRaw)}
              placeholder="Select Road Condition"
              className="filter-multiselect"
              display="chip"
              selectedItemTemplate={(value) => customTokenRenderer(value, roadConditionOptions)}
            />
          </div>
        </div>
      </div>

      <button
        className="filter-submit-btn"
        onClick={handleSubmit}
      >
        Apply Filters
        <span className="filter-submit-icon">→</span>
      </button>
    </div>
  );
};

export default FiltersPanel;
function onApplyFilters() {
  throw new Error("Function not implemented.");
}

