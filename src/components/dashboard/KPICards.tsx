import React from "react";

type KPIs = {
  totalAccidents: number;
  totalFatalities: number;
  fatalityRate: string;
};

type Props = { kpis: KPIs };

const KPICards: React.FC<Props> = ({ kpis }) => (
  <div className="flex gap-4 mb-4">
    <div className="bg-white rounded-xl shadow p-4 flex-1 text-center">
      <div className="text-gray-500">Total Accidents</div>
      <div className="text-2xl font-bold">{kpis.totalAccidents}</div>
    </div>
    <div className="bg-white rounded-xl shadow p-4 flex-1 text-center">
      <div className="text-gray-500">Total Fatalities</div>
      <div className="text-2xl font-bold">{kpis.totalFatalities}</div>
    </div>
    <div className="bg-white rounded-xl shadow p-4 flex-1 text-center">
      <div className="text-gray-500">Fatality Rate</div>
      <div className="text-2xl font-bold">{kpis.fatalityRate}</div>
    </div>
  </div>
);

export default KPICards;
