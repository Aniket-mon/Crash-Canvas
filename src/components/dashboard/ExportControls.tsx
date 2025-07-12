import React from "react";
import Papa from "papaparse";

type Props = { data: any[] };

const ExportControls: React.FC<Props> = ({ data }) => {
  const handleExport = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const fileName = `accidents-${new Date().toISOString().split("T")[0]}.csv`;
    a.download = fileName;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
    if (!data || data.length === 0) {
    alert("No data to export.");
    return;
    
}
  };

  return (
    <div className="mb-4">
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow" onClick={handleExport}>
        Download Filtered Data (CSV)
      </button>
    </div>
  );
};

export default ExportControls;
