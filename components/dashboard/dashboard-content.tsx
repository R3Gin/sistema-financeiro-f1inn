"use client"

import { useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFinance } from "@/contexts/finance-context"
import { calculateFinancialSummary, formatCurrency } from "@/lib/finance-utils"
import { KPICard } from "./kpi-card"
import { FinancialHealthIndicator } from "./financial-health-indicator"
import { StatusBreakdown } from "./status-breakdown"
import { CategoryPieChart } from "./category-pie-chart"
import { ExpensesBarChart } from "./expenses-bar-chart"
import { AssetsVsExpensesChart } from "./assets-vs-expenses-chart"
import { ForecastChart } from "./forecast-chart"
import { ExpensesTable } from "./expenses-table"
import { AssetsTable } from "./assets-table"
import { MonthFilter } from "./month-filter"
import { Wallet, TrendingUp, TrendingDown, Receipt, LayoutDashboard, PiggyBank } from "lucide-react"

export function DashboardContent() {
  const { expenses, assets, selectedMonth, selectedYear } = useFinance()

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const date = new Date(exp.date)
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
    })
  }, [expenses, selectedMonth, selectedYear])

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const date = new Date(asset.date)
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
    })
  }, [assets, selectedMonth, selectedYear])

  const summary = useMemo(
    () => calculateFinancialSummary(filteredExpenses, filteredAssets),
    [filteredExpenses, filteredAssets],
  )

  const lastMonth = selectedMonth === 0 ? 11 : selectedMonth - 1
  const lastMonthYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear

  const lastMonthExpenses = expenses.filter((exp) => {
    const date = new Date(exp.date)
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
  })

  const currentMonthTotal = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  const expenseChange =
    lastMonthTotal > 0 ? (((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1) : "0"

  const overdueExpenses = filteredExpenses
    .filter((exp) => exp.status === "atrasado")
    .reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="min-h-screen bg-background">
      <MonthFilter />

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 md:py-6">
        <Tabs defaultValue="dashboard" className="space-y-3 sm:space-y-4 md:space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto h-10 sm:h-11">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1.5 sm:px-4"
            >
              <LayoutDashboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Início</span>
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1.5 sm:px-4"
            >
              <Receipt className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Passivos</span>
              <span className="sm:hidden">Passivos</span>
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1.5 sm:px-4">
              <PiggyBank className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Ativos</span>
              <span className="sm:hidden">Ativos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="grid gap-2.5 sm:gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Total Passivos"
                value={formatCurrency(summary.totalExpenses)}
                subtitle="Mês selecionado"
                trend={
                  Number.parseFloat(expenseChange) > 0
                    ? "up"
                    : Number.parseFloat(expenseChange) < 0
                      ? "down"
                      : "neutral"
                }
                trendValue={`${Math.abs(Number.parseFloat(expenseChange))}%`}
                variant="danger"
                icon={<TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />}
              />
              <KPICard
                title="Total Ativos"
                value={formatCurrency(summary.totalAssets)}
                subtitle="Mês selecionado"
                variant="success"
                icon={<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />}
              />
              <KPICard
                title="Saldo Líquido"
                value={formatCurrency(summary.netBalance)}
                subtitle="Ativos - Passivos"
                variant={summary.netBalance >= 0 ? "success" : "danger"}
                icon={<Wallet className="h-4 w-4 sm:h-5 sm:w-5" />}
              />
              <KPICard
                title="Pendentes"
                value={formatCurrency(summary.pendingExpenses)}
                subtitle={overdueExpenses > 0 ? `${formatCurrency(overdueExpenses)} atraso` : "Sem atrasos"}
                variant={overdueExpenses > 0 ? "warning" : "default"}
                icon={<Receipt className="h-4 w-4 sm:h-5 sm:w-5" />}
              />
            </div>

            <div className="grid gap-2.5 sm:gap-3 md:gap-4 grid-cols-1 lg:grid-cols-3">
              <FinancialHealthIndicator
                netBalance={summary.netBalance}
                totalAssets={summary.totalAssets}
                totalExpenses={summary.totalExpenses}
              />
              <StatusBreakdown
                paid={summary.paidExpenses}
                pending={summary.pendingExpenses - overdueExpenses}
                overdue={overdueExpenses}
                total={summary.totalExpenses}
              />
              <div className="lg:col-span-1">
                <ForecastChart expenses={expenses} />
              </div>
            </div>

            <div className="grid gap-2.5 sm:gap-3 md:gap-4 grid-cols-1 lg:grid-cols-3">
              <CategoryPieChart data={summary.expensesByCategory} />
              <ExpensesBarChart expenses={filteredExpenses} />
              <div className="lg:col-span-1">
                <AssetsVsExpensesChart expenses={expenses} assets={assets} />
              </div>
            </div>

            <div className="grid gap-3 sm:gap-4 grid-cols-1 xl:grid-cols-2">
              <ExpensesTable />
              <AssetsTable />
            </div>
          </TabsContent>

          <TabsContent value="expenses">
            <ExpensesTable />
          </TabsContent>

          <TabsContent value="assets">
            <AssetsTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
