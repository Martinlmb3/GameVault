"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import GameCard from "@/components/game-card"
import GameVaultHeader from "@/components/game-vault-header"
import { GameVaultFooter } from "@/components/game-vault-footer"

const games = [
  {
    id: 1,
    title: "Cyberpunk 2077",
    platform: "PC",
    genre: "Action RPG",
    image: "/cyberpunk-2077-inspired-cover.png",
  },
  {
    id: 2,
    title: "The Witcher 3: Wild Hunt",
    platform: "PC",
    genre: "Action RPG",
    image: "/witcher-3-inspired-cover.png",
  },
  {
    id: 3,
    title: "Red Dead Redemption 2",
    platform: "PlayStation 4",
    genre: "Action-Adventure",
    image: "/generic-western-game-cover.png",
  },
  {
    id: 4,
    title: "Grand Theft Auto V",
    platform: "PlayStation 4",
    genre: "Action-Adventure",
    image: "/generic-city-cover.png",
  },
  {
    id: 5,
    title: "Assassin's Creed Valhalla",
    platform: "Xbox Series X",
    genre: "Action RPG",
    image: "/assassins-creed-valhalla-cover.png",
  },
  {
    id: 6,
    title: "God of War",
    platform: "PlayStation 5",
    genre: "Action-Adventure",
    image: "/god-of-war-inspired-cover.png",
  },
]

const platforms = ["All Platforms", "PC", "PlayStation 4", "PlayStation 5", "Xbox Series X", "Nintendo Switch"]
const genres = ["All Genres", "Action RPG", "Action-Adventure", "FPS", "Strategy", "Sports"]

export default function MyGamesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("All Platforms")
  const [selectedGenre, setSelectedGenre] = useState("All Genres")

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = selectedPlatform === "All Platforms" || game.platform === selectedPlatform
    const matchesGenre = selectedGenre === "All Genres" || game.genre === selectedGenre

    return matchesSearch && matchesPlatform && matchesGenre
  })

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
            <GameCard key={game.id} game={game} />
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
