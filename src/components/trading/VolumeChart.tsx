import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface VolumeChartProps {
  data: { x: number; y: number; color?: string }[];
}

export function VolumeChart({ data }: VolumeChartProps) {
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 100,
      background: 'transparent',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        colors: {
          ranges: [
            {
              from: 0,
              to: Number.MAX_VALUE,
              color: 'hsl(var(--primary))',
            },
          ],
        },
        columnWidth: '80%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: 'hsl(var(--muted-foreground))',
          fontSize: '10px',
        },
        formatter: (value) => {
          if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
          if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
          return value.toFixed(0);
        },
      },
    },
    grid: {
      show: false,
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      x: {
        format: 'dd MMM yyyy HH:mm',
      },
      y: {
        formatter: (value) => value.toLocaleString(),
      },
    },
  };

  return (
    <div className="rounded-lg border border-border/50 bg-black/10 p-2">
      <div className="mb-1 px-2 text-xs font-semibold text-muted-foreground">VOLUME</div>
      <ReactApexChart
        options={options}
        series={[{ name: 'Volume', data }]}
        type="bar"
        height={100}
      />
    </div>
  );
}
