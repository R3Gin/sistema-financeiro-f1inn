import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <DollarSign className="h-8 w-8 text-emerald-600" />
          <span className="text-2xl font-bold text-slate-800">FINN</span>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-100 p-4 rounded-full">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Conta criada com sucesso!</CardTitle>
            <CardDescription>Verifique seu email para confirmar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Email de confirmação enviado</p>
                <p className="text-sm text-blue-600 mt-1">
                  Clique no link enviado para seu email para ativar sua conta e começar a usar o FINN.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/auth/login">
                <Button variant="outline" className="w-full bg-transparent">
                  Voltar para o login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
