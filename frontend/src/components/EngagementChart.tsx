import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface Props {
  weeklyData: number[];
}

const EngagementChart = ({ weeklyData }: Props) => {
  const mockData = [12, 19, 3, 5, 2, 3, 15];

  return (
    <Bar 
      data={{
        labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        datasets: [{
          label: 'Aberturas por Dia',
          data: weeklyData.length > 0 ? weeklyData : mockData,
          backgroundColor: '#FFCE04'
        }]
      }} 
    />
  );
};

export default EngagementChart;