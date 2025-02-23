import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { AdminMetric } from './Dashboard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  metrics: AdminMetric[];
}

const AdminCharts = ({ metrics }: Props) => {
  const barData = {
    labels: metrics.map(metric => metric.email),
    datasets: [
      {
        label: 'Streak Atual',
        data: metrics.map(metric => metric.currentStreak),
        backgroundColor: 'rgb(36, 14, 11)',
        borderColor: 'rgb(36, 14, 11)',
        borderWidth: 1,
      },
      {
        label: 'Maior Streak',
        data: metrics.map(metric => metric.maxStreak),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Desempenho dos Leitores',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="charts-container">
      <div className="chart-wrapper">
        <Bar data={barData} options={options} />
      </div>
    </div>
  );
};

export default AdminCharts;