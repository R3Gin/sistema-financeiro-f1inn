"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import type { Expense } from "@/types/finance"
import { calculateForecast, formatCurrency } from "@/lib/finance-utils"

interface ForecastChartProps {
  expenses: Expense[]
}

export function ForecastChart({ expenses }: ForecastChartProps) {
  const forecast = calculateForecast(expenses, 3)

  const currentMonthExpenses = expenses
    .filter((exp) => {
      const expDate = new Date(exp.date)
      const now = new Date()
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, exp) => sum + exp.amount, 0)

  const chartData = [
    { month: "Atual", value: currentMonthExpenses, isCurrent: true },
    ...forecast.map((f) => ({
      month: f.month.split(" ")[0].substring(0, 3),
      value: f.predicted,
      isCurrent: false,
    })),
  ]

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{ value: number; payload: { isCurrent: boolean } }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      const item = payload[0]
      return (
        <div className="rounded-lg border bg-card p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-primary font-semibold">{formatCurrency(item.value)}</p>
          <p className="text-xs text-muted-foreground">{item.payload.isCurrent ? "Valor real" : "Previsão"}</p>
        </div>
      )
    }
    return null
  }

  const primaryColor = "#3b82f6"
  const mutedColor = "#9ca3af"

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Previsão de Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] sm:h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={mutedColor} strokeOpacity={0.3} />
              <XAxis
                dataKey="month"
                tick={{ fill: mutedColor, fontSize: 11 }}
                axisLine={{ stroke: mutedColor, strokeOpacity: 0.3 }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                tick={{ fill: mutedColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={currentMonthExpenses}
                stroke={mutedColor}
                strokeDasharray="5 5"
                strokeOpacity={0.5}
                label={{ value: "Base", fill: mutedColor, fontSize: 10 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={primaryColor}
                strokeWidth={3}
                fill="url(#colorValue)"
                dot={{ fill: primaryColor, strokeWidth: 2, r: 5, stroke: "#fff" }}
                activeDot={{ r: 7, fill: primaryColor, stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 text-xs sm:text-sm">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: primaryColor }} />
          <span className="text-muted-foreground">Previsão baseada em gastos recorrentes</span>
        </div>
      </CardContent>
    </Card>
  )
}
