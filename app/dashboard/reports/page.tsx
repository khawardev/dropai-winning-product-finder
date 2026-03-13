'use client'

import React, { useState, useEffect } from 'react'
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Download,
  Calendar,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart as RePieChart,
  Pie,
  Legend
} from 'recharts'
import useSWR from 'swr'
import { getReportsData } from '@/server/actions/ReportsData'
import { Blur } from '@/components/MagicBlur'

const COLORS = ['var(--primary)', 'var(--secondary)', '#F59E0B', '#22C55E', '#EC4899']

export default function ReportsPage() {
  const isMounted = React.useRef(false);
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    isMounted.current = true;
    setForceUpdate(prev => prev + 1);
  }, []);

  const { data: result, error, isLoading } = useSWR('reports-data', getReportsData, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  });

  const nicheData = result?.data?.recentTrends?.slice(0, 5) || [];
  const profitDistData = result?.data?.profitDistribution || [];
  const competitionData = result?.data?.nicheData || [];

  return (
    <Blur className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Market Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">Deep dive into niche trends and market performance metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Calendar /> Last 30 Days
          </Button>
          <Button>
            <Download /> Download CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Niche Trend Over Time
            </CardTitle>
            <Button variant="ghost" size="sm">
              <Filter />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {isMounted.current && nicheData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <AreaChart data={nicheData}>
                    <defs>
                      <linearGradient id="colorNiche" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '18px', padding: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(12px)' }}
                      itemStyle={{ color: 'var(--primary)' }}
                    />
                    <Legend verticalAlign="top" align="right" />
                    <Area name="Interest" type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} fill="url(#colorNiche)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  No trend data available yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-500" /> Profit Margin Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-8">
            {isMounted.current && profitDistData.length > 0 ? (
              <>
                <div className="h-[250px] w-[250px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <RePieChart>
                      <Pie
                        data={profitDistData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {profitDistData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '18px', padding: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(12px)' }}
                        itemStyle={{ color: 'var(--primary)' }}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-4">
                  {profitDistData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                        <span className="text-sm text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full flex items-center justify-center h-[250px] text-muted-foreground text-sm">
                No profit margin data available yet.
              </div>
            )}
          </CardContent>        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-500" /> Competition Distribution by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {isMounted.current && competitionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <BarChart data={competitionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '18px', padding: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(12px)' }}
                      itemStyle={{ color: 'var(--primary)' }}
                    />
                    <Legend verticalAlign="top" align="right" />
                    <Bar name="Competition Level" dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  No competition data available yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Blur>
  )
}
