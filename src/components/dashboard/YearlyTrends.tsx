import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

type DataPoint = {
  year: number;
  total: number;
  fatal: number;
  serious: number;
};

type Props = { data: DataPoint[] };

const YearlyTrends: React.FC<Props> = ({ data }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <h3 className="font-semibold mb-2 text-blue-600">Year-over-Year Accident Trends</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total" stroke="#6366f1" />
        <Line type="monotone" dataKey="fatal" stroke="#ef4444" />
        <Line type="monotone" dataKey="serious" stroke="#f59e42" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default YearlyTrends;
