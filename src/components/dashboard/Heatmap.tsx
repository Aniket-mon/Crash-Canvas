import React from "react";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./heatmap.css";

type Point = {
  lat: number;
  lng: number;
  intensity: number;
  severity: "Fatal" | "Serious" | "Minor";
};

const severityColors: Record<Point["severity"], string> = {
  Fatal: "#ff0000ff",   // Red
  Serious: "#ca8000ff", // Amber
  Minor: "#00711eff",   // Green
};

type Props = { points: Point[] };

const Heatmap: React.FC<Props> = ({ points }) => (
  <MapContainer center={[23, 80]} zoom={5} className="w-full h-full z-0">
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {points.map((pt, i) => (
      <Circle
        key={i}
        center={[pt.lat, pt.lng]}
        radius={pt.intensity * 8000}
        fillOpacity={0.5}
        color={severityColors[pt.severity]}
      />
    ))}
  </MapContainer>
);


export default Heatmap;
