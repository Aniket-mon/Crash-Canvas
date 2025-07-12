import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Slider } from "primereact/slider";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

type PredictionResult = {
  severity: string;
  confidence: number;
  factors: string[];
  recommendation: string;
};

const weatherOptions = [
  { label: "Clear", value: "Clear" },
  { label: "Rain", value: "Rain" },
  { label: "Fog", value: "Fog" }
];

const roadOptions = [
  { label: "Highway", value: "Highway" },
  { label: "Urban", value: "Urban" },
  { label: "Rural", value: "Rural" }
];

const PredictionPanel: React.FC = () => {
  const [form, setForm] = useState({
    weather: "Clear",
    road: "Highway",
    speed: 60,
    time: "Day",
    vehicles: 2,
    driverAge: 30
  });
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleChange = (field: string, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult({
      severity: "Serious",
      confidence: 81,
      factors: ["High speed limit", "Nighttime", "Wet road"],
      recommendation: "Recommend: reduce speed to 40 km/h in foggy conditions."
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow mb-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Real-time Severity Prediction</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Dropdown value={form.weather} options={weatherOptions} onChange={e => handleChange("weather", e.value)} placeholder="Weather" />
        <Dropdown value={form.road} options={roadOptions} onChange={e => handleChange("road", e.value)} placeholder="Road Type" />
        <div>
          <label>Speed Limit: {form.speed} km/h</label>
          <Slider value={form.speed} min={20} max={120} onChange={e => handleChange("speed", e.value)} />
        </div>
        <InputText value={form.vehicles.toString()} onChange={e => handleChange("vehicles", Number(e.target.value))} placeholder="Number of Vehicles" />
        <InputText value={form.driverAge.toString()} onChange={e => handleChange("driverAge", Number(e.target.value))} placeholder="Driver Age" />
        <Button label="Predict Severity" type="submit" className="mt-2" />
      </form>
      {result && (
        <div className="mt-6">
          <div className="text-lg font-semibold">
            {result.severity} <span className="ml-2 text-gray-500">({result.confidence}% confidence)</span>
          </div>
          <div className="flex gap-2 mt-2">
            {result.factors.map(f => <Tag key={f} value={f} severity="info" />)}
          </div>
          <div className="mt-2 text-green-700">{result.recommendation}</div>
        </div>
      )}
    </div>
  );
};

export default PredictionPanel;
