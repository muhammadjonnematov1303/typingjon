'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Props {
  data: { label: string; value: number }[]
  color?: string
  unit?: string
  domainMax?: number   // fix the axis upper bound (e.g. total users) for context
}

const COLORS = ['#2563EB', '#60A5FA', '#818CF8', '#A78BFA', '#38BDF8', '#34D399', '#FBBF24', '#FB923C']

export function RankBarChart({ data, color, unit = '', domainMax }: Props) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 38)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
        <XAxis type="number" allowDecimals={false} domain={domainMax ? [0, domainMax] : undefined}
          tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={110} />
        <Tooltip
          cursor={{ fill: '#F1F5F9' }}
          contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12, fontFamily: 'monospace' }}
          formatter={(value) => [`${value}${unit}`, '']}
          labelStyle={{ fontWeight: 600, color: '#0F172A' }}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={22}>
          {data.map((_, i) => <Cell key={i} fill={color ?? COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
