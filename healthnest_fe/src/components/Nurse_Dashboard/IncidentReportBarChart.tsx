import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from '../../CSS/Nurse/Dashboard/IncidentReportBarChart.module.css';

interface IncidentReportsChartProps {
  data: { month: string; count: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.chartTooltip}>
        <p className={styles.chartTooltipLabel}>{label}</p>
        <p className={styles.chartTooltipValue}>{payload[0].value} incidents</p>
      </div>
    );
  }
  return null;
};

export const IncidentReportBarChart = ({ data }: IncidentReportsChartProps) => {
  return (
    <section className="incident-report-bar-chart">
      <p className={styles.chartTitle}>Incident Reports per Month in a Year</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f9" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={35} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#eff6ff' }} allowEscapeViewBox={{ x: true, y: true }} />
          <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  )
}