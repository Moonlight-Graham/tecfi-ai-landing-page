import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Staking & Rewards', value: 30 },
  { name: 'DAO Treasury', value: 25 }, 
  { name: 'Airdrop', value: 10 },
  { name: 'Marketing & Listings', value: 20 },
  { name: 'Creator Rewards', value: 5 },
  { name: 'Liquidity Pool', value: 15 }
];

const COLORS = ['#07C71E', '#0D66F6', '#EFB112', '#7A0BA6', '#EA1818', '#7A7B7B'];

const renderCustomLabel = ({ name, value }) => {
  return `${name} ${value}%`;
};

export default function TokenomicsChart() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem', background: '#f1f5f9', textSize: '12px' }}>
      <h2 style={{ fontWeight: '600', marginBottom: '10px' }}>📊 Tokenomics</h2>
      <PieChart width={440} height={360}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          label={renderCustomLabel}
          outerRadius={45}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="bottom" iconType="circle" />
      </PieChart>
    </div>
  );
}