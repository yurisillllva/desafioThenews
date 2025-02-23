import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface Props {
  streakHistory: number[];
}

const StreakChart = ({ streakHistory }: Props) => {
  const data = {
    labels: streakHistory.map((_, index) => `Dia ${index + 1}`),
    datasets: [{
      label: 'Evolução do Streak',
      data: streakHistory,
      borderColor: '#4CAF50',
      tension: 0.4,
      fill: false
    }]
  };

  return <Line data={data} />;
};

export default StreakChart;
