"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/finance-utils"

interface StatusBreakdownProps {
  paid: number
  pending: number
  overdue: number
  total: number
}

export function StatusBreakdown({ paid, pending, overdue, total }: StatusBreakdownProps) {
  const paidPercent = total > 0 ? (paid / total) * 100 : 0
  const pendingPercent = total > 0 ? (pending / total) * 100 : 0
  const overduePercent = total > 0 ? (overdue / total) * 100 : 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Status dos Passivos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-success" />
              <span>Pago</span>
            </div>
            <span className="font-medium">{formatCurrency(paid)}</span>
          </div>
          <Progress value={paidPercent} className="h-1.5 sm:h-2 bg-muted [&>div]:bg-success" />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-warning" />
              <span>Pendente</span>
            </div>
            <span className="font-medium">{formatCurrency(pending)}</span>
          </div>
          <Progress value={pendingPercent} className="h-1.5 sm:h-2 bg-muted [&>div]:bg-warning" />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-destructive" />
              <span>Atrasado</span>
            </div>
            <span className="font-medium">{formatCurrency(overdue)}</span>
          </div>
          <Progress value={overduePercent} className="h-1.5 sm:h-2 bg-muted [&>div]:bg-destructive" />
        </div>
      </CardContent>
    </Card>
  )
}
