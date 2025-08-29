"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown } from "lucide-react"
import GameCard from "@/components/game-card"
import GameVaultHeader from "@/components/game-vault-header"
import { GameVaultFooter } from "@/components/game-vault-footer"
import { apiClient, GameResponse } from "@/lib/api"

const hardcodedGames = [
  {
    id: "hardcoded-1",
    name: "Cyberpunk 2077",
    platform: "PC",
    genres: ["Action RPG"],
    image: "/cyberpunk-2077-inspired-cover.png",
  },
  {
    id: "hardcoded-2",
    name: "The Witcher 3: Wild Hunt",
    platform: "PC",
    genres: ["Action RPG"],
    image: "/witcher-3-inspired-cover.png",
  },
  {
    id: "hardcoded-3",
    name: "Red Dead Redemption 2",
    platform: "PlayStation 4",
    genres: ["Action-Adventure"],
    image: "/generic-western-game-cover.png",
  },
  {
    id: "hardcoded-4",
    name: "Grand Theft Auto V",
    platform: "PlayStation 4",
    genres: ["Action-Adventure"],
    image: "/generic-city-cover.png",
  },
  {
    id: "hardcoded-5",
    name: "Assassin's Creed Valhalla",
    platform: "Xbox Series X",
    genres: ["Action RPG"],
    image: "/assassins-creed-valhalla-cover.png",
  },
  {
    id: "hardcoded-6",
    name: "God of War",
    platform: "PlayStation 5",
    genres: ["Action-Adventure"],
    image: "/god-of-war-inspired-cover.png",
  },
]

const platforms = ["All Platforms", "PC", "PlayStation 4", "PlayStation 5", "Xbox Series X", "Nintendo Switch"]
const genres = ["All Genres", "Action RPG", "Action-Adventure", "FPS", "Strategy", "Sports"]

export default function MyGamesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("All Platforms")
  const [selectedGenre, setSelectedGenre] = useState("All Genres")
  const [fetchedGames, setFetchedGames] = useState<GameResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const games = await apiClient.getAllGames()
        setFetchedGames(games)
      } catch (error) {
        console.error("Failed to fetch games:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchGames()
  }, [])

  const normalizeGame = (game: GameResponse) => ({
    id: game.id,
    name: game.name,
    platform: game.platform || "Unknown",
    genres: game.gameGenres?.map(gg => gg.genre?.name).filter(Boolean) || [],
    image: game.image || "/placeholder-game.png",
  })

  const allGames = [
    ...hardcodedGames,
    ...fetchedGames.map(normalizeGame)
  ]

  const filteredGames = allGames.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = selectedPlatform === "All Platforms" || game.platform === selectedPlatform
    const matchesGenre = selectedGenre === "All Genres" || (game.genres && game.genres.includes(selectedGenre))

    return matchesSearch && matchesPlatform && matchesGenre
  })

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <GameVaultHeader />
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8 text-center">The Vault</h1>

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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">Loading games...</p>
          </div>
        )}

        {/* Games Grid */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No games found matching your criteria.</p>
          </div>
        )}
      </div>
      <GameVaultFooter />
    </div>
  )
}
