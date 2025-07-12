import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import App from "./pages/App";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "leaflet/dist/leaflet.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter basename= "/">
        <App />
      </BrowserRouter>
    </StrictMode>
  );
} else {
  console.error("Root element with id 'root' not found.");
}
