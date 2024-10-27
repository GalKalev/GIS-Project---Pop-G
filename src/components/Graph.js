import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

// Function to format large numbers
const formatNumber = (number) => {
    if(number >= 1000000000000){
        return (number / 1000000000000).toFixed(1) + 'T'; // Convert to trilions
    }
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + 'B'; // Convert to billions
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M'; // Convert to millions
  }
  if(number >= 1000){
    return (number / 1000).toFixed(1) + 'K'; // Convert to thoudands
  }
  return number; // Return the number if it's smaller
};

export default function Graph({ years = [], pop = [], gdp = [], isMapShrunken }) {
  const data = years.map((year, index) => ({
    year,
    Population: pop[index],
    GDP: gdp[index],
  }));

  return (
     <div style={{ width: '100%', height: '100%', maxWidth: '1000px', maxHeight: '500px' }}>
      <BarChart
        width={isMapShrunken ? 900 : 400} // Fill the container width
        height={300} // Fill the container height
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        {/* Format Y-Axis for population */}
        <YAxis
          yAxisId="left"
          orientation="left"
          stroke="#8884d8"
          tickFormatter={formatNumber} // Apply formatting
        />
        {/* Format Y-Axis for GDP */}
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#82ca9d"
          tickFormatter={formatNumber} // Apply formatting
        />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="Population" fill="#8884d8" />
        <Bar yAxisId="right" dataKey="GDP" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}
