export type ExpenseStatus = "pago" | "pendente" | "atrasado" | "recorrente"
export type PaymentMethod = "cartao" | "pix" | "boleto" | "dinheiro" | "transferencia"
export type ExpenseCategory =
  | "moradia"
  | "alimentacao"
  | "transporte"
  | "saude"
  | "educacao"
  | "lazer"
  | "servicos"
  | "outros"
export type AssetCategory = "salario" | "investimento" | "renda_extra" | "vendas" | "outros"

export interface Expense {
  id: string
  date: string // Auto-generated on creation, not user input
  type: "passivo"
  name: string
  amount: number
  status: ExpenseStatus
  paymentMethod: PaymentMethod
  category: ExpenseCategory
  dueDate: string
  notes?: string
  isRecurring?: boolean
  recurringEndDate?: string // Format: "YYYY-MM" - defines until which month/year the recurring expense lasts
}

export interface Asset {
  id: string
  name: string
  amount: number
  source: string
  date: string
  category: AssetCategory
}

export interface FinancialSummary {
  totalExpenses: number
  totalAssets: number
  netBalance: number
  pendingExpenses: number
  paidExpenses: number
  expensesByCategory: Record<ExpenseCategory, number>
}
