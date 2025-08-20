import Image from "next/image"

interface Game {
  id: number
  title: string
  platform: string
  genre: string
  image: string
}

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg bg-slate-800 transition-transform duration-200 group-hover:scale-105">
        {/* Game Image */}
        <div className="aspect-[3/4] relative">
          <Image
            src={game.image || "/placeholder.svg"}
            alt={game.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          />
        </div>

        {/* Game Info */}
        <div className="p-4">
          <h3 className="font-semibold text-white mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {game.title}
          </h3>
          <p className="text-sm text-slate-400">
            {game.platform}, {game.genre}
          </p>
        </div>
      </div>
    </div>
  )
}
