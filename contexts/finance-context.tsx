"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { Expense, Asset } from "@/types/finance"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface FinanceContextType {
  expenses: Expense[]
  assets: Asset[]
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  addAsset: (asset: Omit<Asset, "id">) => Promise<void>
  updateAsset: (id: string, asset: Partial<Asset>) => Promise<void>
  deleteAsset: (id: string) => Promise<void>
  selectedMonth: number
  selectedYear: number
  setSelectedMonth: (month: number) => void
  setSelectedYear: (year: number) => void
  isLoading: boolean
  user: User | null
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()

      // Verificar usuário autenticado
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (!user) {
        setIsLoading(false)
        return
      }

      // Carregar despesas
      const { data: expensesData } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })

      if (expensesData) {
        setExpenses(
          expensesData.map((e) => ({
            id: e.id,
            date: e.date,
            type: e.type,
            name: e.name,
            amount: Number(e.amount),
            status: e.status,
            paymentMethod: e.payment_method,
            category: e.category,
            dueDate: e.due_date,
            notes: e.notes,
            isRecurring: e.status === "recorrente",
            recurringDays: e.recurring_days, // Load recurring days
            recurringEndDate: e.recurring_end_date, // Load recurring end date
          })),
        )
      }

      // Carregar ativos
      const { data: assetsData } = await supabase
        .from("assets")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })

      if (assetsData) {
        setAssets(
          assetsData.map((a) => ({
            id: a.id,
            name: a.name,
            amount: Number(a.amount),
            source: a.source,
            date: a.date,
            category: a.category,
          })),
        )
      }

      setIsLoading(false)
    }

    loadData()
  }, [])

  const addExpense = useCallback(async (expense: Omit<Expense, "id">) => {
    console.log("[v0] Adding expense/liability:", expense)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] No user found, cannot add expense")
      return
    }

    const currentDate = new Date().toISOString().split("T")[0]

    if (expense.isRecurring && expense.recurringEndDate) {
      const startDate = new Date()
      const endDate = new Date(expense.recurringEndDate)

      // Array para armazenar todas as promessas de inserção
      const insertPromises = []

      // Criar uma entrada para cada mês até a data final
      let currentMonth = startDate.getMonth()
      let currentYear = startDate.getFullYear()

      while (
        currentYear < endDate.getFullYear() ||
        (currentYear === endDate.getFullYear() && currentMonth <= endDate.getMonth())
      ) {
        // Criar data de vencimento para este mês
        const dueDate = expense.dueDate ? new Date(expense.dueDate) : new Date()
        dueDate.setMonth(currentMonth)
        dueDate.setFullYear(currentYear)
        const dueDateStr = dueDate.toISOString().split("T")[0]

        // Inserir no banco
        const promise = supabase
          .from("expenses")
          .insert({
            user_id: user.id,
            date: currentDate,
            type: expense.type,
            name: expense.name,
            amount: expense.amount,
            status: expense.status,
            payment_method: expense.paymentMethod,
            category: expense.category,
            due_date: dueDateStr,
            notes: expense.notes || null,
            recurring_end_date: expense.recurringEndDate,
          })
          .select()
          .single()

        insertPromises.push(promise)

        // Avançar para o próximo mês
        currentMonth++
        if (currentMonth > 11) {
          currentMonth = 0
          currentYear++
        }
      }

      // Executar todas as inserções
      const results = await Promise.all(insertPromises)

      // Adicionar todas as despesas criadas ao estado
      const newExpenses: Expense[] = []
      results.forEach(({ data, error }) => {
        if (error) {
          console.error("[v0] Error adding recurring expense:", error)
        } else if (data) {
          console.log("[v0] Recurring expense added successfully:", data)
          newExpenses.push({
            id: data.id,
            date: data.date,
            type: data.type,
            name: data.name,
            amount: Number(data.amount),
            status: data.status,
            paymentMethod: data.payment_method,
            category: data.category,
            dueDate: data.due_date,
            notes: data.notes,
            isRecurring: true,
            recurringEndDate: data.recurring_end_date,
          })
        }
      })

      setExpenses((prev) => [...newExpenses, ...prev])
      return
    }

    const { data, error } = await supabase
      .from("expenses")
      .insert({
        user_id: user.id,
        date: expense.date || currentDate,
        type: expense.type,
        name: expense.name,
        amount: expense.amount,
        status: expense.status,
        payment_method: expense.paymentMethod,
        category: expense.category,
        due_date: expense.dueDate,
        notes: expense.notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error adding expense:", error)
      throw error
    }

    if (data) {
      console.log("[v0] Expense added successfully:", data)
      const newExpense: Expense = {
        id: data.id,
        date: data.date,
        type: data.type,
        name: data.name,
        amount: Number(data.amount),
        status: data.status,
        paymentMethod: data.payment_method,
        category: data.category,
        dueDate: data.due_date,
        notes: data.notes,
        isRecurring: false,
      }
      setExpenses((prev) => [newExpense, ...prev])
    }
  }, [])

  const updateExpense = useCallback(async (id: string, expense: Partial<Expense>) => {
    const supabase = createClient()

    const updateData: Record<string, unknown> = {}
    if (expense.date !== undefined) updateData.date = expense.date
    if (expense.type !== undefined) updateData.type = expense.type
    if (expense.name !== undefined) updateData.name = expense.name
    if (expense.amount !== undefined) updateData.amount = expense.amount
    if (expense.status !== undefined) updateData.status = expense.status
    if (expense.paymentMethod !== undefined) updateData.payment_method = expense.paymentMethod
    if (expense.category !== undefined) updateData.category = expense.category
    if (expense.dueDate !== undefined) updateData.due_date = expense.dueDate
    if (expense.notes !== undefined) updateData.notes = expense.notes
    if (expense.recurringDays !== undefined) updateData.recurring_days = expense.recurringDays
    if (expense.recurringEndDate !== undefined) updateData.recurring_end_date = expense.recurringEndDate

    const { error } = await supabase.from("expenses").update(updateData).eq("id", id)

    if (!error) {
      setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...expense } : e)))
    }
  }, [])

  const deleteExpense = useCallback(async (id: string) => {
    const supabase = createClient()

    const { error } = await supabase.from("expenses").delete().eq("id", id)

    if (!error) {
      setExpenses((prev) => prev.filter((e) => e.id !== id))
    }
  }, [])

  const addAsset = useCallback(async (asset: Omit<Asset, "id">) => {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Usuário não autenticado")
    }

    const { data, error } = await supabase
      .from("assets")
      .insert({
        user_id: user.id,
        name: asset.name,
        amount: asset.amount,
        source: asset.source,
        date: asset.date,
        category: asset.category,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao adicionar ativo:", error)
      throw error
    }

    if (data) {
      const newAsset: Asset = {
        id: data.id,
        name: data.name,
        amount: Number(data.amount),
        source: data.source,
        date: data.date,
        category: data.category,
      }
      setAssets((prev) => [newAsset, ...prev])
    }
  }, [])

  const updateAsset = useCallback(async (id: string, asset: Partial<Asset>) => {
    const supabase = createClient()

    const { error } = await supabase.from("assets").update(asset).eq("id", id)

    if (!error) {
      setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...asset } : a)))
    }
  }, [])

  const deleteAsset = useCallback(async (id: string) => {
    const supabase = createClient()

    const { error } = await supabase.from("assets").delete().eq("id", id)

    if (!error) {
      setAssets((prev) => prev.filter((a) => a.id !== id))
    }
  }, [])

  return (
    <FinanceContext.Provider
      value={{
        expenses,
        assets,
        addExpense,
        updateExpense,
        deleteExpense,
        addAsset,
        updateAsset,
        deleteAsset,
        selectedMonth,
        selectedYear,
        setSelectedMonth,
        setSelectedYear,
        isLoading,
        user,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider")
  }
  return context
}
