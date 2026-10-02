"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useFinance } from "@/contexts/finance-context"
import type { Expense, ExpenseStatus, PaymentMethod, ExpenseCategory } from "@/types/finance"
import {
  formatCurrency,
  formatDate,
  getCategoryLabel,
  getStatusLabel,
  getPaymentMethodLabel,
} from "@/lib/finance-utils"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export function ExpensesTable() {
  const { expenses, addExpense, updateExpense, deleteExpense, selectedMonth, selectedYear } = useFinance()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [formData, setFormData] = useState<Partial<Expense>>({
    type: "passivo",
    name: "",
    amount: 0,
    status: "pendente",
    paymentMethod: "pix",
    category: "outros",
    dueDate: new Date().toISOString().split("T")[0],
    notes: "",
    isRecurring: false,
    recurringEndDate: "", // Added recurringEndDate field
  })

  const filteredExpenses = expenses.filter((exp) => {
    const date = new Date(exp.date)
    const matchesMonth = date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
    const matchesSearch =
      exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryLabel(exp.category).toLowerCase().includes(searchTerm.toLowerCase())
    return matchesMonth && matchesSearch
  })

  const handleSubmit = () => {
    if (editingExpense) {
      updateExpense(editingExpense.id, formData)
    } else {
      addExpense(formData as Omit<Expense, "id">)
    }
    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setFormData(expense)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingExpense(null)
    setFormData({
      type: "passivo",
      name: "",
      amount: 0,
      status: "pendente",
      paymentMethod: "pix",
      category: "outros",
      dueDate: new Date().toISOString().split("T")[0],
      notes: "",
      isRecurring: false,
      recurringEndDate: "", // Reset recurringEndDate
    })
  }

  const getStatusBadge = (status: ExpenseStatus) => {
    const variants: Record<ExpenseStatus, string> = {
      pago: "bg-success/10 text-success border-success/20",
      pendente: "bg-warning/10 text-warning border-warning/20",
      atrasado: "bg-destructive/10 text-destructive border-destructive/20",
      recorrente: "bg-primary/10 text-primary border-primary/20",
    }
    return (
      <Badge variant="outline" className={cn("font-medium text-[10px] sm:text-xs", variants[status])}>
        {getStatusLabel(status)}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
        <CardTitle className="text-base sm:text-lg">Passivos</CardTitle>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-[160px]"
            />
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="shrink-0">
                <Plus className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Novo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingExpense ? "Editar Passivo" : "Novo Passivo"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Nome</Label>
                  <Input
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Aluguel"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Valor</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount || ""}
                      onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) || 0 })}
                      placeholder="0,00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Vencimento</Label>
                    <Input
                      type="date"
                      value={formData.dueDate || ""}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as ExpenseStatus })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pago">Pago</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="atrasado">Atrasado</SelectItem>
                        <SelectItem value="recorrente">Recorrente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Categoria</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value as ExpenseCategory })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="moradia">Moradia</SelectItem>
                        <SelectItem value="alimentacao">Alimentação</SelectItem>
                        <SelectItem value="transporte">Transporte</SelectItem>
                        <SelectItem value="saude">Saúde</SelectItem>
                        <SelectItem value="educacao">Educação</SelectItem>
                        <SelectItem value="lazer">Lazer</SelectItem>
                        <SelectItem value="servicos">Serviços</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Método de Pagamento</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as PaymentMethod })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cartao">Cartão</SelectItem>
                      <SelectItem value="pix">Pix</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="transferencia">Transferência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Observações</Label>
                  <Textarea
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Observações opcionais..."
                    rows={2}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={formData.isRecurring || false}
                    onChange={(e) => {
                      setFormData({ ...formData, isRecurring: e.target.checked })
                      if (!e.target.checked) {
                        setFormData({ ...formData, isRecurring: false, recurringEndDate: "" })
                      }
                    }}
                    className="rounded border-input"
                  />
                  <Label htmlFor="isRecurring" className="text-sm font-normal">
                    Passivo recorrente
                  </Label>
                </div>
                {formData.isRecurring && (
                  <div className="grid gap-2 border rounded-lg p-3 bg-muted/30">
                    <Label className="text-sm font-medium">Duração do passivo recorrente</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Até qual mês e ano este passivo vai ser cobrado?
                    </p>
                    <Input
                      type="month"
                      value={formData.recurringEndDate || ""}
                      onChange={(e) => setFormData({ ...formData, recurringEndDate: e.target.value })}
                      min={new Date().toISOString().slice(0, 7)}
                      className="w-full"
                    />
                    {formData.recurringEndDate && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Este passivo será cobrado até{" "}
                        {new Date(formData.recurringEndDate + "-01").toLocaleDateString("pt-BR", {
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>{editingExpense ? "Salvar" : "Adicionar"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[70px]">Data</TableHead>
                <TableHead className="min-w-[100px]">Nome</TableHead>
                <TableHead className="min-w-[90px] hidden md:table-cell">Categoria</TableHead>
                <TableHead className="text-right min-w-[90px]">Valor</TableHead>
                <TableHead className="min-w-[80px]">Status</TableHead>
                <TableHead className="min-w-[90px] hidden lg:table-cell">Pagamento</TableHead>
                <TableHead className="min-w-[80px] hidden lg:table-cell">Vencimento</TableHead>
                <TableHead className="w-[70px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Nenhum passivo encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="text-xs sm:text-sm">{formatDate(expense.date)}</TableCell>
                    <TableCell className="font-medium text-xs sm:text-sm">{expense.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                      {getCategoryLabel(expense.category)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-xs sm:text-sm">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(expense.status)}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs sm:text-sm">
                      {getPaymentMethodLabel(expense.paymentMethod)}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                      {formatDate(expense.dueDate)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                          onClick={() => handleEdit(expense)}
                        >
                          <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteExpense(expense.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
