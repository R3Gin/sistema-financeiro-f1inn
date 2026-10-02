"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface KPICardProps {
  title: string
  value: string
  subtitle?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  variant?: "default" | "success" | "danger" | "warning"
  icon?: React.ReactNode
}

export function KPICard({ title, value, subtitle, trend, trendValue, variant = "default", icon }: KPICardProps) {
  const variantStyles = {
    default: "border-border",
    success: "border-success/30 bg-success/5",
    danger: "border-destructive/30 bg-destructive/5",
    warning: "border-warning/30 bg-warning/5",
  }

  const trendColors = {
    up: "text-success",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  }

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  return (
    <Card className={cn("transition-all hover:shadow-md", variantStyles[variant])}>
      <CardContent className="p-3 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-lg sm:text-2xl font-bold tracking-tight truncate">{value}</p>
            {subtitle && <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{subtitle}</p>}
          </div>
          {icon && <div className="rounded-lg bg-primary/10 p-1.5 sm:p-2.5 text-primary shrink-0 ml-2">{icon}</div>}
        </div>
        {trend && trendValue && (
          <div className={cn("mt-2 sm:mt-3 flex items-center gap-1 text-xs sm:text-sm", trendColors[trend])}>
            <TrendIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="font-medium">{trendValue}</span>
            <span className="text-muted-foreground hidden sm:inline">vs mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
