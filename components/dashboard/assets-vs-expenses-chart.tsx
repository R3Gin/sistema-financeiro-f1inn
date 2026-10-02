"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { Expense, Asset } from "@/types/finance"
import { formatCurrency } from "@/lib/finance-utils"

interface AssetsVsExpensesChartProps {
  expenses: Expense[]
  assets: Asset[]
}

export function AssetsVsExpensesChart({ expenses, assets }: AssetsVsExpensesChartProps) {
  const monthlyData: Record<string, { month: string; assets: number; expenses: number }> = {}

  const getMonthKey = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
  }

  expenses.forEach((exp) => {
    const month = getMonthKey(exp.date)
    if (!monthlyData[month]) {
      monthlyData[month] = { month, assets: 0, expenses: 0 }
    }
    monthlyData[month].expenses += exp.amount
  })

  assets.forEach((asset) => {
    const month = getMonthKey(asset.date)
    if (!monthlyData[month]) {
      monthlyData[month] = { month, assets: 0, expenses: 0 }
    }
    monthlyData[month].assets += asset.amount
  })

  const chartData = Object.values(monthlyData).sort((a, b) => {
    const [monthA, yearA] = a.month.split("/")
    const [monthB, yearB] = b.month.split("/")
    return yearA === yearB ? monthA.localeCompare(monthB) : yearA.localeCompare(yearB)
  })

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{ name: string; value: number; color: string }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-card p-2 sm:p-3 shadow-lg">
          <p className="font-medium text-sm mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs sm:text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Ativos vs Passivos</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[200px] sm:h-[250px] items-center justify-center text-muted-foreground text-sm">
            Nenhum dado disponível
          </div>
        ) : (
          <div className="h-[200px] sm:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={35}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }}
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
                <Bar dataKey="assets" name="Ativos" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Passivos" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
