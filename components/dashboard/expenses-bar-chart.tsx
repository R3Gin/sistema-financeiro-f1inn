"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Expense } from "@/types/finance"
import { formatCurrency } from "@/lib/finance-utils"

interface ExpensesBarChartProps {
  expenses: Expense[]
}

export function ExpensesBarChart({ expenses }: ExpensesBarChartProps) {
  const sortedExpenses = [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6)
    .map((exp) => ({
      name: exp.name.length > 8 ? exp.name.substring(0, 8) + "..." : exp.name,
      fullName: exp.name,
      amount: exp.amount,
    }))

  const CustomTooltip = ({
    active,
    payload,
  }: { active?: boolean; payload?: Array<{ payload: { fullName: string; amount: number } }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="rounded-lg border bg-card p-2 sm:p-3 shadow-lg">
          <p className="font-medium text-sm">{item.fullName}</p>
          <p className="text-xs sm:text-sm text-primary font-semibold">{formatCurrency(item.amount)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Maiores Passivos</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedExpenses.length === 0 ? (
          <div className="flex h-[200px] sm:h-[250px] items-center justify-center text-muted-foreground text-sm">
            Nenhum dado disponível
          </div>
        ) : (
          <div className="h-[200px] sm:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedExpenses} layout="vertical" margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.3} />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={60}
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
