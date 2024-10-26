import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    Label
} from 'recharts';

// Function to format large numbers
const formatNumber = (number) => {
    if (number >= 1000000000000) {
        return (number / 1000000000000).toFixed(1) + 'T'; // Convert to trillions
    }
    if (number >= 1000000000) {
        return (number / 1000000000).toFixed(1) + 'B'; // Convert to billions
    }
    if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M'; // Convert to millions
    }
    if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'K'; // Convert to thousands
    }
    return number; // Return the number if it's smaller
};

export default function CompGraph({ years, pop1, gdp1, pop2, gdp2, name1, name2 }) {
    // Structure the data for the chart
    const data = years.map((year, index) => ({
        year,
        [`Population ${name1}`]: pop1[index],
        [`GDP ${name1}`]: gdp1[index],
        [`Population ${name2}`]: pop2[index],
        [`GDP ${name2}`]: gdp2[index],
    }));

    return (
        <div style={{ width: '100%', height: '100%', maxWidth: '1000px', maxHeight: '500px' }}>
            <BarChart
                width={900} // Fill the container width
                height={400} // Fill the container height
                data={data}
                margin={{
                    top: 40,   // Increased top margin
                    right: 50, // Increased right margin
                    left: 50,  // Increased left margin
                    bottom: 20 // 
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
                >
                    <Label
                        value="Population"
                        angle={0}
                        position="top"
                        dy={-15} // Adjusts vertical position
                        style={{ textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' }} // Adjusts size and weight
                    />
                </YAxis>
                {/* Format YAxis for GDP */}
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#82ca9d"
                    tickFormatter={formatNumber} // Apply formatting
                >
                     <Label
                        value="GDP"
                        angle={0}
                        position="top"
                        dy={-15} // Adjusts vertical position
                        style={{ textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' }} // Adjusts size and weight
                    />
                </YAxis>
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey={`Population ${name1}`} fill="#8884d8" />
                <Bar yAxisId="right" dataKey={`GDP ${name1}`} fill="#82ca9d" />
                <Bar yAxisId="left" dataKey={`Population ${name2}`} fill="#ff7300" />
                <Bar yAxisId="right" dataKey={`GDP ${name2}`} fill="#ffc658" />
            </BarChart>
        </div>
    );
}
