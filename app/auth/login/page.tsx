"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { DollarSign, TrendingUp, PieChart } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col lg:flex-row">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 md:p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-white">
            <DollarSign className="h-8 w-8" />
            <span className="text-2xl font-bold">FINN</span>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">Controle suas finanças de forma inteligente</h1>
          <p className="text-blue-100 text-lg">
            Gerencie despesas, acompanhe ativos e tenha uma visão completa da sua saúde financeira.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <TrendingUp className="h-8 w-8 text-blue-200 mb-2" />
              <h3 className="text-white font-semibold">Análise de Gastos</h3>
              <p className="text-blue-200 text-sm">Visualize para onde vai seu dinheiro</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <PieChart className="h-8 w-8 text-blue-200 mb-2" />
              <h3 className="text-white font-semibold">Gráficos Intuitivos</h3>
              <p className="text-blue-200 text-sm">Dados claros e fáceis de entender</p>
            </div>
          </div>
        </div>

        <p className="text-blue-200 text-sm">© 2025 FINN - Controle Financeiro. Todos os direitos reservados.</p>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6 sm:mb-8">
            <DollarSign className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
            <span className="text-xl sm:text-2xl font-bold text-slate-800">FINN</span>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-center">Bem-vindo de volta</CardTitle>
              <CardDescription className="text-center text-sm">
                Entre com seu email e senha para acessar
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 sm:h-11 text-base"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-sm">
                      Senha
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 sm:h-11 text-base"
                    />
                  </div>
                  {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
                  <Button
                    type="submit"
                    className="w-full h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </div>
                <div className="mt-5 sm:mt-6 text-center text-sm text-slate-600">
                  Não tem uma conta?{" "}
                  <Link
                    href="/auth/sign-up"
                    className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-4"
                  >
                    Criar conta
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
