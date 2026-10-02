"use client"

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFinance } from "@/contexts/finance-context"

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

export function MonthFilter() {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } = useFinance()

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  const goToCurrentMonth = () => {
    setSelectedMonth(currentMonth)
    setSelectedYear(currentYear)
  }

  const isCurrentMonth = selectedMonth === currentMonth && selectedYear === currentYear

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 py-4 bg-card border-b">
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousMonth}
        className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2 min-w-[160px] sm:min-w-[200px] justify-center">
        <Calendar className="h-4 w-4 text-muted-foreground hidden sm:block" />
        <span className="text-sm sm:text-base font-semibold">
          {MONTHS[selectedMonth]} {selectedYear}
        </span>
      </div>
      <Button variant="outline" size="icon" onClick={goToNextMonth} className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent">
        <ChevronRight className="h-4 w-4" />
      </Button>
      {!isCurrentMonth && (
        <Button variant="outline" size="sm" onClick={goToCurrentMonth} className="text-xs sm:text-sm bg-transparent">
          <span className="hidden sm:inline">Mês Atual</span>
          <span className="sm:hidden">Hoje</span>
        </Button>
      )}
    </div>
  )
}
