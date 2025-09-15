import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function WaterQualityChart({ data, title }) {
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md h-96">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
        <p className="text-gray-500">No historical data available.</p>
      </div>
    );
  }

  const formattedData = data.map(d => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-96">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ph" stroke="#8884d8" name="pH" />
          <Line type="monotone" dataKey="turbidity" stroke="#82ca9d" name="Turbidity (NTU)" />
          <Line type="monotone" dataKey="tds" stroke="#ffc658" name="TDS (ppm)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WaterQualityChart;