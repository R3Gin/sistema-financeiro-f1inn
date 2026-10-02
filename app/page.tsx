import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, PieChart, Shield, BarChart3, ArrowRight, CheckCircle } from "lucide-react"
import { redirect } from "next/navigation"

export default function HomePage() {
  redirect("/auth/login")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 sm:py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <span className="text-xl sm:text-2xl font-bold text-slate-800">FINN</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-slate-600 h-9 sm:h-10 px-3 sm:px-4 text-sm">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-9 sm:h-10 px-3 sm:px-4 text-sm">
                Criar conta
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-4 sm:mb-6 text-balance">
            Controle suas finanças de forma <span className="text-blue-600">simples e inteligente</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-pretty">
            Gerencie despesas, acompanhe ativos e tenha uma visão completa da sua saúde financeira em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Link href="/auth/sign-up" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 h-11 sm:h-12 px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto"
              >
                Começar agora
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="h-11 sm:h-12 px-6 sm:px-8 text-base sm:text-lg bg-transparent w-full sm:w-auto"
              >
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-8 sm:mb-12 text-balance">
          Tudo que você precisa para controlar suas finanças
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg border border-slate-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Dashboard Completo</h3>
            <p className="text-sm sm:text-base text-slate-600 text-pretty">
              Visualize gráficos de gastos, comparativos e indicadores de saúde financeira em tempo real.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg border border-slate-100">
            <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Previsão de Gastos</h3>
            <p className="text-sm sm:text-base text-slate-600 text-pretty">
              Projeções inteligentes baseadas no seu histórico para planejar melhor o futuro.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg border border-slate-100">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <PieChart className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Análise por Categoria</h3>
            <p className="text-sm sm:text-base text-slate-600 text-pretty">
              Entenda para onde vai seu dinheiro com gráficos detalhados por categoria.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-slate-900 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-8 sm:mb-12 text-balance">
              Por que escolher o FINN?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                "Controle mensal de despesas e ativos",
                "Indicadores automáticos de saúde financeira",
                "Gráficos intuitivos e fáceis de entender",
                "Previsão de gastos futuros",
                "Tema claro e escuro",
                "100% gratuito para uso pessoal",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 sm:p-8 md:p-12 text-center">
          <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-blue-200 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 text-balance">
            Seus dados seguros e protegidos
          </h2>
          <p className="text-sm sm:text-base text-blue-100 mb-6 sm:mb-8 max-w-xl mx-auto text-pretty">
            Utilizamos criptografia e as melhores práticas de segurança para proteger suas informações financeiras.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 h-11 sm:h-12 px-6 sm:px-8 text-base">
              Criar minha conta grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              <span className="text-base sm:text-lg font-semibold text-slate-800">FINN</span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm text-center">
              © 2025 FINN - Controle Financeiro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
