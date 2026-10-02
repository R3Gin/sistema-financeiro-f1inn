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
import { DollarSign, Shield, Zap, BarChart3 } from "lucide-react"

export default function SignUpPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col lg:flex-row">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 md:p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-white">
            <DollarSign className="h-8 w-8" />
            <span className="text-2xl font-bold">FINN</span>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Comece sua jornada para a liberdade financeira
          </h1>
          <p className="text-emerald-100 text-lg">
            Crie sua conta gratuita e tenha controle total das suas finanças pessoais.
          </p>

          <div className="space-y-4 pt-8">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-lg p-4">
              <Shield className="h-8 w-8 text-emerald-200" />
              <div>
                <h3 className="text-white font-semibold">Dados Seguros</h3>
                <p className="text-emerald-200 text-sm">Suas informações protegidas</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-lg p-4">
              <Zap className="h-8 w-8 text-emerald-200" />
              <div>
                <h3 className="text-white font-semibold">Rápido e Fácil</h3>
                <p className="text-emerald-200 text-sm">Configure em minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-lg p-4">
              <BarChart3 className="h-8 w-8 text-emerald-200" />
              <div>
                <h3 className="text-white font-semibold">Relatórios Detalhados</h3>
                <p className="text-emerald-200 text-sm">Insights sobre seus gastos</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-emerald-200 text-sm">© 2025 FINN - Controle Financeiro. Todos os direitos reservados.</p>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6 sm:mb-8">
            <DollarSign className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-600" />
            <span className="text-xl sm:text-2xl font-bold text-slate-800">FINN</span>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-center">Criar conta</CardTitle>
              <CardDescription className="text-center text-sm">Preencha os dados abaixo para começar</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-3.5 sm:gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName" className="text-sm">
                      Nome completo
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Seu nome"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-10 sm:h-11 text-base"
                    />
                  </div>
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
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password" className="text-sm">
                      Confirmar senha
                    </Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className="h-10 sm:h-11 text-base"
                    />
                  </div>
                  {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
                  <Button
                    type="submit"
                    className="w-full h-10 sm:h-11 bg-emerald-600 hover:bg-emerald-700 text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? "Criando conta..." : "Criar conta"}
                  </Button>
                </div>
                <div className="mt-5 sm:mt-6 text-center text-sm text-slate-600">
                  Já tem uma conta?{" "}
                  <Link
                    href="/auth/login"
                    className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-4"
                  >
                    Entrar
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
