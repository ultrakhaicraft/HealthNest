import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';




interface IncidentReportsChartProps {
  data: { month: string; count: number }[];
}



const CustomTooltip = ({ active, payload, label }: any) => {
  console.log('CustomTooltip props:', { active, payload, label }); // Debugging line
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value">{payload[0].value} incidents</p>
      </div>
    );
  }
  return null;
};

export const IncidentReportBarChart = ({ data }: IncidentReportsChartProps) => {
    console.log('IncidentReportBarChart data:', data); // Debugging line
    return(
        <section className="incident-report-bar-chart">
            <p className="chart-title">Incident Reports per Month in a Year</p>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12}}
                    axisLine={{stroke: '#e2e8f0'}} tickLine={false}/>
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 } }
                    axisLine={false}
                    tickLine={false}
                    width={35} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#eff6ff' }} allowEscapeViewBox={{ x: true, y: true }} />
                    <Bar dataKey="count" fill="#2563eb"  radius={[6, 6, 0, 0]} maxBarSize={36} />
                </BarChart>
            </ResponsiveContainer>
        </section>
    )
}