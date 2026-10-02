"use client"

import { useState, useEffect } from "react"
import { X, Wallet, PlusCircle, BarChart3, Filter, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const TUTORIAL_STEPS = [
  {
    title: "Bem-vindo ao FINN!",
    description:
      "Este é o seu painel pessoal para gerenciar suas finanças. Vamos fazer um tour rápido para você conhecer as principais funcionalidades.",
    icon: Wallet,
  },
  {
    title: "Registre suas Despesas",
    description:
      "Na tabela de despesas, você pode adicionar todos os seus gastos: contas, compras, assinaturas e muito mais. Clique em 'Adicionar Despesa' para começar.",
    icon: PlusCircle,
  },
  {
    title: "Cadastre seus Ativos",
    description:
      "Registre suas fontes de renda como salário, investimentos, freelances e outras entradas. Isso permite calcular seu saldo real.",
    icon: PlusCircle,
  },
  {
    title: "Acompanhe seus Indicadores",
    description:
      "Os KPIs no topo mostram seu total de despesas, ativos e saldo líquido. O indicador de saúde financeira mostra se você está no positivo ou negativo.",
    icon: BarChart3,
  },
  {
    title: "Filtre por Mês",
    description:
      "Use o filtro de mês para navegar entre períodos diferentes e ver o histórico das suas finanças. O botão 'Hoje' volta para o mês atual.",
    icon: Filter,
  },
]

export function OnboardingTutorial() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial")
    if (!hasSeenTutorial) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem("hasSeenTutorial", "true")
  }

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleClose()
  }

  const CurrentIcon = TUTORIAL_STEPS[currentStep].icon

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CurrentIcon className="h-6 w-6 text-primary" />
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          </div>
          <DialogTitle className="text-xl mt-4">{TUTORIAL_STEPS[currentStep].title}</DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            {TUTORIAL_STEPS[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 py-4">
          {TUTORIAL_STEPS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentStep ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-2">
          <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
            Pular tutorial
          </Button>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                Anterior
              </Button>
            )}
            <Button onClick={handleNext} className="gap-2">
              {currentStep === TUTORIAL_STEPS.length - 1 ? (
                "Começar"
              ) : (
                <>
                  Próximo
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
