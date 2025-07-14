import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import './LinkChart.css';
import { LinksChartProps, ChartData, ChartOptions } from '../types';

const LinksChart: React.FC<LinksChartProps> = ({ internal, external }) => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: []
  });
  const [chartOptions, setChartOptions] = useState<ChartOptions>({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
      },
    },
  });

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data: ChartData = {
      labels: ['internal', 'external'],
      datasets: [
        {
          data: [internal, external],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--green-500')
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--green-400')
          ]
        }
      ]
    };
    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          display: true, // optional: hide legend to save space
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [internal, external]);

  return (
    <div className="card flex justify-content-center flex-1 chart_container">
      <Chart type="doughnut" data={chartData} options={chartOptions} />
    </div>
  );
};

export default LinksChart; 