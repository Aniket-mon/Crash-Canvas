import React from "react";
import { Link } from "react-router-dom";

const sidebarItems = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/analysis" },
  { label: "Patterns", path: "/patterns" },
  { label: "Severity Perdiction", path: "/prediction" },
  { label: "Yearly Trends", path: "/trends" },
  { label: "Export", path: "/export" }
];

const Sidebar: React.FC = () => (
  <aside className="h-screen w-56 bg-blue-900 text-white flex flex-col py-6 shadow-lg">
    <div className="text-2xl font-bold px-6 mb-8">Crash Canvas</div>
    <nav className="flex-1">
      {sidebarItems.map(item => (
        <Link
          key={item.label}
          to={item.path}
          className="block px-6 py-3 hover:bg-blue-700 rounded transition"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
