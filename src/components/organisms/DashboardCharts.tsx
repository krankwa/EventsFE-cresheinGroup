import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Mon', sales: 4000, registrations: 2400 },
  { name: 'Tue', sales: 3000, registrations: 1398 },
  { name: 'Wed', sales: 2000, registrations: 9800 },
  { name: 'Thu', sales: 2780, registrations: 3908 },
  { name: 'Fri', sales: 1890, registrations: 4800 },
  { name: 'Sat', sales: 2390, registrations: 3800 },
  { name: 'Sun', sales: 3490, registrations: 4300 },
];

export function DashboardCharts() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            hide 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))', 
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px' 
            }}
          />
          <Area 
            type="monotone" 
            dataKey="sales" 
            stroke="hsl(var(--primary))" 
            fillOpacity={1} 
            fill="url(#colorSales)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
