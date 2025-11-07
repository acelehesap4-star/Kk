import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

interface DepthChartGraphProps {
  bidsDepth: { x: number; y: number }[];
  asksDepth: { x: number; y: number }[];
}

function DepthChartGraph({ bidsDepth, asksDepth }: DepthChartGraphProps) {
  const series = [
    {
      name: 'Bids',
      data: bidsDepth,
      color: 'hsl(var(--success))',
    },
    {
      name: 'Asks',
      data: asksDepth,
      color: 'hsl(var(--destructive))',
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: 300,
      background: 'transparent',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 800,
      },
      zoom: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'stepline',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    xaxis: {
      type: 'numeric',
      labels: {
        style: {
          colors: 'hsl(var(--muted-foreground))',
          fontSize: '10px',
        },
        formatter: (value: any) => (typeof value === 'number' ? value.toFixed(2) : String(value)),
      },
      title: {
        text: 'Price',
        style: {
          color: 'hsl(var(--foreground))',
          fontSize: '11px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: 'hsl(var(--muted-foreground))',
          fontSize: '10px',
        },
        formatter: (value: number) => {
          if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
          if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
          return value.toFixed(0);
        },
      },
      title: {
        text: 'Cumulative Volume',
        style: {
          color: 'hsl(var(--foreground))',
          fontSize: '11px',
        },
      },
    },
    grid: {
      borderColor: 'hsl(var(--border))',
      strokeDashArray: 4,
    },
    legend: {
      show: true,
      position: 'top',
      labels: {
        colors: 'hsl(var(--foreground))',
      },
    },
    tooltip: {
      theme: 'dark',
      x: {
        formatter: (value: any) => {
          const num = typeof value === 'number' ? value : parseFloat(value);
          return `Price: $${num.toFixed(6)}`;
        },
      },
      y: {
        formatter: (value: any) => {
          const num = typeof value === 'number' ? value : parseFloat(value);
          return `Volume: ${num.toLocaleString()}`;
        },
      },
    },
  };

  return <ReactApexChart options={options} series={series} type="area" height={300} />;
}

export default DepthChartGraph;