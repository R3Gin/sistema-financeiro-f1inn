import type { Expense, Asset, FinancialSummary, ExpenseCategory } from "@/types/finance"

export function calculateFinancialSummary(expenses: Expense[], assets: Asset[]): FinancialSummary {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const totalAssets = assets.reduce((sum, asset) => sum + asset.amount, 0)
  const netBalance = totalAssets - totalExpenses

  const pendingExpenses = expenses
    .filter((exp) => exp.status === "pendente" || exp.status === "atrasado")
    .reduce((sum, exp) => sum + exp.amount, 0)

  const paidExpenses = expenses.filter((exp) => exp.status === "pago").reduce((sum, exp) => sum + exp.amount, 0)

  const expensesByCategory = expenses.reduce(
    (acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    },
    {} as Record<ExpenseCategory, number>,
  )

  return {
    totalExpenses,
    totalAssets,
    netBalance,
    pendingExpenses,
    paidExpenses,
    expensesByCategory,
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR")
}

export function getCategoryLabel(category: ExpenseCategory): string {
  const labels: Record<ExpenseCategory, string> = {
    moradia: "Moradia",
    alimentacao: "Alimentação",
    transporte: "Transporte",
    saude: "Saúde",
    educacao: "Educação",
    lazer: "Lazer",
    servicos: "Serviços",
    outros: "Outros",
  }
  return labels[category]
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pago: "Pago",
    pendente: "Pendente",
    atrasado: "Atrasado",
    recorrente: "Recorrente",
  }
  return labels[status] || status
}

export function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    cartao: "Cartão",
    pix: "Pix",
    boleto: "Boleto",
    debito: "Débito",
    dinheiro: "Dinheiro",
    transferencia: "Transferência",
  }
  return labels[method] || method
}

export function getAssetCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    salario: "Salário",
    investimento: "Investimento",
    renda_extra: "Renda Extra",
    vendas: "Vendas",
    outros: "Outros",
  }
  return labels[category] || category
}

export function calculateForecast(expenses: Expense[], months = 3): { month: string; predicted: number }[] {
  const recurringExpenses = expenses.filter((exp) => exp.isRecurring || exp.status === "recorrente")
  const recurringTotal = recurringExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  const nonRecurringAvg =
    expenses
      .filter((exp) => !exp.isRecurring && exp.status !== "recorrente")
      .reduce((sum, exp) => sum + exp.amount, 0) / Math.max(1, expenses.length)

  const forecast: { month: string; predicted: number }[] = []
  const currentDate = new Date()

  for (let i = 1; i <= months; i++) {
    const futureDate = new Date(currentDate)
    futureDate.setMonth(futureDate.getMonth() + i)
    const monthName = futureDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    forecast.push({
      month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      predicted: recurringTotal + nonRecurringAvg * 0.8,
    })
  }

  return forecast
}
