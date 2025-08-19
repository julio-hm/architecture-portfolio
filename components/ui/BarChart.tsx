import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BarChartProps {
  data: { name: string; value: number }[];
  title: string;
}

const COLORS = ['#A3B899', '#A7D8F0', '#D97706', '#5C4B3E'];

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
        <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
        <ResponsiveContainer width="100%" height="80%">
            <RechartsBarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                    contentStyle={{ 
                        background: 'rgba(0, 0, 0, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '10px'
                    }}
                />
                <Bar dataKey="value" barSize={20}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </RechartsBarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
