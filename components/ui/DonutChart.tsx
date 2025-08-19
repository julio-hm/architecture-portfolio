import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ChartDataItem {
    name: string;
    value: number;
}

interface DonutChartProps {
  data: ChartDataItem[];
}

// Paleta de colores moderna y profesional
const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#3B82F6'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg">
                <p className="text-white font-bold">{`${payload[0].name}: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 text-white">
        <h3 className="text-lg font-bold mb-4">Project Categories</h3>
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                    iconType="circle" 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right" 
                    formatter={(value) => <span className="text-slate-300">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;
