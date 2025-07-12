import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import * as Recharts from "recharts";


type SeverityData = { label: string; value: number }[];
type Props = { data: SeverityData };


const COLORS = ["#4ade80", "#f59e42", "#ef4444"];

const SeverityPieChart: React.FC<Props> = ({ data }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <h3 className="font-semibold mb-2 text-blue-600">Severity Distribution</h3>
    <Recharts.ResponsiveContainer width="100%" height={250}>
    <Recharts.PieChart>
        <Recharts.Pie
        data={data}
        dataKey="value"
        nameKey="label"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
        >
        {data.map((entry, i) => (
            <Recharts.Cell key={entry.label} fill={COLORS[i % COLORS.length]} />
        ))}
        </Recharts.Pie>
        <Recharts.Tooltip />
        <Recharts.Legend />
    </Recharts.PieChart>
    </Recharts.ResponsiveContainer>

  </div>
);

export default SeverityPieChart;
