"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown } from "lucide-react"
import GameCard from "@/components/game-card"
import GameVaultHeader from "@/components/game-vault-header"
import { GameVaultFooter } from "@/components/game-vault-footer"
import { useMyGamesQuery, useDeleteGameMutation } from "@/lib/auth-queries"
import { isAuthenticated } from "@/lib/api"
import { useRouter } from "next/navigation"

const platforms = ["All Platforms", "PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"]
const genres = ["All Genres", "Action", "Adventure", "RPG", "Strategy", "Sports", "Racing", "Puzzle"]

export default function MyGamesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("All Platforms")
  const [selectedGenre, setSelectedGenre] = useState("All Genres")
  const [mounted, setMounted] = useState(false)

  const { data: games = [], isLoading, error } = useMyGamesQuery()
  const deleteGameMutation = useDeleteGameMutation()

  // Ensure component is mounted before checking authentication
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (mounted && !isAuthenticated()) {
      router.push('/login')
    }
  }, [router, mounted])

  const handleDeleteGame = async (gameId: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      try {
        await deleteGameMutation.mutateAsync(gameId)
      } catch (error) {
        console.error('Failed to delete game:', error)
      }
    }
  }

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = selectedPlatform === "All Platforms" || game.platform === selectedPlatform
    
    // Handle gameGenres structure from API
    const gameGenres = game.gameGenres?.map(gg => gg.genre?.name).filter(Boolean) || []
    const matchesGenre = selectedGenre === "All Genres" || gameGenres.includes(selectedGenre)

    return matchesSearch && matchesPlatform && matchesGenre
  })

  // Wait for component to mount before rendering
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <GameVaultHeader />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">Loading...</p>
          </div>
        </div>
        <GameVaultFooter />
      </div>
    )
  }

  if (!isAuthenticated()) {
    return null // Will redirect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <GameVaultHeader />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">Loading your games...</p>
          </div>
        </div>
        <GameVaultFooter />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <GameVaultHeader />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">Failed to load games. Please try again.</p>
          </div>
        </div>
        <GameVaultFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <GameVaultHeader />
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8">My Games</h1>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for games"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex gap-4">
            <div className="relative">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="appearance-none bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                {platforms.map((platform) => (
                  <option key={platform} value={platform} className="bg-slate-800">
                    {platform}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="appearance-none bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre} className="bg-slate-800">
                    {genre}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredGames.map((game) => (
            <GameCard 
              key={game.id} 
              game={game} 
              onDelete={handleDeleteGame}
              isDeleting={deleteGameMutation.isPending}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No games found matching your criteria.</p>
          </div>
        )}
      </div>
      <GameVaultFooter />
    </div>
  )
}
