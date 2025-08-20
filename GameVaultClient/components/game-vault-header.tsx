import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
export default function GameVaultHeader() {
  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              width={120}
              height={40}
              alt="Game Vault Logo"
              className="w-8 h-8 object-contain"
              priority
            />
            <span className="text-xl font-bold text-white">Game Vault</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/my-games" className="text-slate-400 hover:text-white transition-colors">
              My Games
            </Link>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              Wishlist
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              Reviews
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-blue-400 hover:bg-slate-800">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export { GameVaultHeader }
