"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle } from "lucide-react"

interface FinancialHealthIndicatorProps {
  netBalance: number
  totalAssets: number
  totalExpenses: number
}

export function FinancialHealthIndicator({ netBalance, totalAssets, totalExpenses }: FinancialHealthIndicatorProps) {
  const isPositive = netBalance >= 0
  const savingsRate = totalAssets > 0 ? ((netBalance / totalAssets) * 100).toFixed(1) : 0

  return (
    <Card
      className={cn(
        "transition-all",
        isPositive
          ? "border-success/30 bg-gradient-to-br from-success/5 to-success/10"
          : "border-destructive/30 bg-gradient-to-br from-destructive/5 to-destructive/10",
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Saúde Financeira</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 sm:gap-3">
          {isPositive ? (
            <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-success shrink-0" />
          ) : (
            <XCircle className="h-8 w-8 sm:h-10 sm:w-10 text-destructive shrink-0" />
          )}
          <div className="min-w-0">
            <p
              className={cn(
                "text-sm sm:text-lg font-semibold leading-tight",
                isPositive ? "text-success" : "text-destructive",
              )}
            >
              {isPositive ? "Você está bem financeiramente" : "Você está no prejuízo"}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Taxa de economia: {savingsRate}%</p>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Entradas</span>
            <span className="font-medium text-success">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalAssets)}
            </span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Saídas</span>
            <span className="font-medium text-destructive">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalExpenses)}
            </span>
          </div>
          <div className="border-t pt-1.5 sm:pt-2">
            <div className="flex justify-between">
              <span className="font-medium text-sm">Saldo</span>
              <span className={cn("font-bold text-sm sm:text-base", isPositive ? "text-success" : "text-destructive")}>
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(netBalance)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
