import React from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./heatmap.css";
import MarkerClusterGroup from "react-leaflet-cluster";



type Point = {
  lat: number;
  lng: number;
  severity: "Fatal" | "Serious" | "Minor";
  intensity: number;
  casualties: number;
  fatalities: number;
  vehicleType?: string;
  date?: string;
  time: string;
  vehicles: number;
  speedLimit: number;
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
    <MarkerClusterGroup chunkedLoading>
    {points.map((pt, i) => (
      <Circle
        key={i}
        center={[pt.lat, pt.lng]}
        radius={pt.intensity * 500}
        fillOpacity={0.5}
        color={severityColors[pt.severity]}
      >
        <Popup>
          <div className="text-sm">
            <p><strong>Date:</strong> {pt.date}</p>
            <p><strong>Time:</strong> {pt.time}</p>
            <p><strong>Casualties:</strong> {pt.casualties}</p>
            <p><strong>Fatalities:</strong> {pt.fatalities}</p>
            <p><strong>Vehicle Type:</strong> {pt.vehicleType}</p>
            <p><strong>No. of Vehicles Involved:</strong> {pt.vehicles}</p>
            <p><strong>Speed Limit:</strong> {pt.speedLimit} km/h</p>
          </div>
        </Popup>
      </Circle>
    ))}
  </MarkerClusterGroup>
  </MapContainer>
);


export default Heatmap;
