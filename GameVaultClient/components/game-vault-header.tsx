'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getAuthData, isAuthenticated } from "@/lib/api"
import { useLogoutMutation } from "@/lib/auth-queries"

export default function GameVaultHeader() {
  const [user, setUser] = useState<{ id: string; username: string; image?: string } | null>(null)
  const [mounted, setMounted] = useState(false)
  const logoutMutation = useLogoutMutation()

  useEffect(() => {
    setMounted(true)
    if (isAuthenticated()) {
      const { user: userData } = getAuthData()
      setUser(userData)
    }
  }, [])

  const handleLogout = () => {
    logoutMutation.mutate()
    setUser(null)
  }

  if (!mounted) {
    // Render minimal version during hydration
    return (
      <header className="bg-slate-900 border-b border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
            <div className="w-32 h-10"></div>
          </div>
        </div>
      </header>
    )
  }
  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/Depth 3, Frame 2.png"
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
            {user && (
              <Link href="/my-games" className="text-slate-400 hover:text-white transition-colors">
                My Games
              </Link>
            )}
            <a href="/games" className="text-slate-400 hover:text-white transition-colors">
              Games
            </a>
            <a href="/store-game" className="text-slate-400 hover:text-white transition-colors">
              Add to Vault
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  <Link href="/profile">
                    <Image
                      src={user.image || "/profile.jpeg"}
                      width={32}
                      height={32}
                      alt={`${user.username}'s avatar`}
                      className="w-8 h-8 rounded-full object-cover border border-slate-600"
                    />
                  </Link>
                  <span className="text-white text-sm">Hello, {user.username}</span>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="text-white hover:text-red-400 hover:bg-slate-800"
                >
                  {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:text-blue-400 hover:bg-slate-800">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export { GameVaultHeader }
