import Image from "next/image"
import { Trash2 } from "lucide-react"
import { GameResponse } from "@/lib/api"

interface GameCardProps {
  game: GameResponse
  onDelete?: (gameId: string) => void
  isDeleting?: boolean
}

export default function GameCard({ game, onDelete, isDeleting }: GameCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg bg-slate-800 transition-transform duration-200 group-hover:scale-105">
        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(game.id)
            }}
            disabled={isDeleting}
            className="absolute top-2 right-2 z-10 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
            title="Delete game"
          >
            <Trash2 size={16} />
          </button>
        )}

        {/* Game Image */}
        <div className="aspect-[3/4] relative">
          <Image
            src={game.image || "/placeholder.svg"}
            alt={game.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          />
        </div>

        {/* Game Info */}
        <div className="p-4">
          <h3 className="font-semibold text-white mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {game.name}
          </h3>
          <p className="text-sm text-slate-400">
            {game.platform && `${game.platform}`}
            {game.gameGenres && game.gameGenres.length > 0 && `, ${game.gameGenres.map(gg => gg.genre?.name).filter(Boolean).join(', ')}`}
          </p>
        </div>
      </div>
    </div>
  )
}
