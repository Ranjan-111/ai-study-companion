import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import './ProgressChart.css';

const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6', '#22c55e'];
const STATUS_COLORS = { 'Not Started': '#9e9e9e', 'In Progress': '#2196f3', 'Completed': '#22c55e', 'Needs Revision': '#ff9800' };

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label || payload[0].name}</p>
        <p className="chart-tooltip-value">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export function SubjectProgressChart({ data }) {
  return (
    <div className="chart-card">
      <h3>Subject Progress</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={{ fill: '#a0a0bc', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#a0a0bc', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="percentage" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CompletionPieChart({ data }) {
  return (
    <div className="chart-card">
      <h3>Topic Status Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span style={{ color: '#a0a0bc', fontSize: '0.78rem' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WeeklyProductivityChart({ data }) {
  return (
    <div className="chart-card">
      <h3>Weekly Productivity</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="day" tick={{ fill: '#a0a0bc', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#a0a0bc', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="activities"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ fill: '#6366f1', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, fill: '#818cf8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
