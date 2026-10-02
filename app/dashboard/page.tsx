import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FinanceProvider } from "@/contexts/finance-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { OnboardingTutorial } from "@/components/dashboard/onboarding-tutorial"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <ThemeProvider>
      <FinanceProvider>
        <div className="min-h-screen bg-background">
          <OnboardingTutorial />
          <DashboardHeader />
          <main>
            <DashboardContent />
          </main>
        </div>
      </FinanceProvider>
    </ThemeProvider>
  )
}
