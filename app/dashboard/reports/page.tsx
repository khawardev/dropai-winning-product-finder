'use client'

import React, { useState, useEffect } from 'react'
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Download,
  Calendar,
  Filter,
  Loader2
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
  Pie
} from 'recharts'
import { getReportsData } from '@/server/actions/ReportsData'

const COLORS = ['var(--primary)', 'var(--secondary)', '#F59E0B', '#22C55E', '#EC4899']

export default function ReportsPage() {
  const [nicheData, setNicheData] = useState<any[]>([])
  const [profitDistData, setProfitDistData] = useState<any[]>([])
  const [competitionData, setCompetitionData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    async function loadReports() {
      try {
        const result = await getReportsData()
        if (result.data) {
          if (result.data.recentTrends.length > 0) {
            setNicheData(result.data.recentTrends.slice(0, 5))
          }
          if (result.data.profitDistribution.length > 0) {
            setProfitDistData(result.data.profitDistribution)
          }
          if (result.data.nicheData.length > 0) {
            setCompetitionData(result.data.nicheData)
          }
        }
      } catch (err) {
        console.error('Failed to load reports:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadReports()
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Market Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">Deep dive into niche trends and market performance metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-border text-foreground">
            <Calendar className="mr-2 w-4 h-4" /> Last 30 Days
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="mr-2 w-4 h-4" /> Download CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Niche Trend Over Time
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Filter className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {isMounted && nicheData.length > 0 ? (
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
                    <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} fill="url(#colorNiche)" />
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

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-500" /> Profit Margin Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-8">
            {isMounted && profitDistData.length > 0 ? (
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
                      <span className="text-sm font-bold text-foreground">{item.value}%</span>
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

        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-500" /> Competition Distribution by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {isMounted && competitionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <BarChart data={competitionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '18px', padding: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(12px)' }}
                      itemStyle={{ color: 'var(--primary)' }}
                    />
                    <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
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
    </div>
  )
}
