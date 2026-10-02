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
import { useFinance } from "@/contexts/finance-context"
import type { Asset, AssetCategory } from "@/types/finance"
import { formatCurrency, formatDate, getAssetCategoryLabel } from "@/lib/finance-utils"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export function AssetsTable() {
  const { assets, addAsset, updateAsset, deleteAsset, selectedMonth, selectedYear } = useFinance()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [formData, setFormData] = useState<Partial<Asset>>({
    name: "",
    amount: 0,
    source: "",
    date: new Date().toISOString().split("T")[0],
    category: "outros",
  })

  const filteredAssets = assets.filter((asset) => {
    const date = new Date(asset.date)
    const matchesMonth = date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.source.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesMonth && matchesSearch
  })

  const handleSubmit = async () => {
    // Validar campos obrigatórios
    if (!formData.name?.trim()) {
      alert("Por favor, preencha o nome do ativo")
      return
    }
    if (!formData.source?.trim()) {
      alert("Por favor, preencha a origem do ativo")
      return
    }
    if (!formData.amount || formData.amount <= 0) {
      alert("Por favor, insira um valor maior que zero")
      return
    }
    if (!formData.date) {
      alert("Por favor, selecione uma data")
      return
    }
    if (!formData.category) {
      alert("Por favor, selecione uma categoria")
      return
    }

    try {
      if (editingAsset) {
        await updateAsset(editingAsset.id, formData)
      } else {
        await addAsset(formData as Omit<Asset, "id">)
      }
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erro ao salvar ativo:", error)
      alert("Erro ao salvar ativo. Por favor, verifique sua conexão e tente novamente.")
    }
  }

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset)
    setFormData(asset)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingAsset(null)
    setFormData({
      name: "",
      amount: 0,
      source: "",
      date: new Date().toISOString().split("T")[0],
      category: "outros",
    })
  }

  const getCategoryBadge = (category: AssetCategory) => {
    const variants: Record<AssetCategory, string> = {
      salario: "bg-success/10 text-success border-success/20",
      investimento: "bg-primary/10 text-primary border-primary/20",
      renda_extra: "bg-chart-5/10 text-chart-5 border-chart-5/20",
      vendas: "bg-warning/10 text-warning border-warning/20",
      outros: "bg-muted text-muted-foreground border-muted",
    }
    return (
      <Badge variant="outline" className={cn("font-medium text-[10px] sm:text-xs", variants[category])}>
        {getAssetCategoryLabel(category)}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
        <CardTitle className="text-base sm:text-lg">Ativos</CardTitle>
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
                <DialogTitle>{editingAsset ? "Editar Ativo" : "Novo Ativo"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Nome *</Label>
                  <Input
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Salário"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Valor *</Label>
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
                    <Label>Data de Entrada *</Label>
                    <Input
                      type="date"
                      value={formData.date || ""}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Origem *</Label>
                  <Input
                    value={formData.source || ""}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="Ex: Empresa XYZ"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as AssetCategory })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salario">Salário</SelectItem>
                      <SelectItem value="investimento">Investimento</SelectItem>
                      <SelectItem value="renda_extra">Renda Extra</SelectItem>
                      <SelectItem value="vendas">Vendas</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>{editingAsset ? "Salvar" : "Adicionar"}</Button>
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
                <TableHead className="min-w-[90px] hidden sm:table-cell">Origem</TableHead>
                <TableHead className="min-w-[90px]">Categoria</TableHead>
                <TableHead className="text-right min-w-[90px]">Valor</TableHead>
                <TableHead className="w-[70px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Nenhum ativo encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="text-xs sm:text-sm">{formatDate(asset.date)}</TableCell>
                    <TableCell className="font-medium text-xs sm:text-sm">{asset.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{asset.source}</TableCell>
                    <TableCell>{getCategoryBadge(asset.category)}</TableCell>
                    <TableCell className="text-right font-medium text-success text-xs sm:text-sm">
                      {formatCurrency(asset.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                          onClick={() => handleEdit(asset)}
                        >
                          <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteAsset(asset.id)}
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
