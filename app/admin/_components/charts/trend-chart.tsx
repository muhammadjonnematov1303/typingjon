'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: { label: string; value: number }[]
  color?: string
  unit?: string
}

export function TrendChart({ data, color = '#2563EB', unit = '' }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id={`fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.28} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={36} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12, fontFamily: 'monospace' }}
          formatter={(value) => [`${value}${unit}`, '']}
          labelStyle={{ fontWeight: 600, color: '#0F172A' }}
        />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#fill-${color.replace('#', '')})`} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
