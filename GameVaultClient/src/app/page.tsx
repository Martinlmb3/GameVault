import { GameVaultHeader } from "@/components/game-vault-header"
import { GameVaultHero } from "@/components/game-vault-hero"
import { GameVaultFooter } from "@/components/game-vault-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <GameVaultHeader />
      <main>
        <GameVaultHero />
      </main>
      <GameVaultFooter />
    </div>
  )
}
