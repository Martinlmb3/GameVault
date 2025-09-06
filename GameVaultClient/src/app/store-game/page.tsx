"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { useCreateGameMutation } from "@/lib/auth-queries"
import { GameRequest } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import GameVaultHeader from "@/components/game-vault-header"
import { GameVaultFooter } from "@/components/game-vault-footer"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/api"

export default function StoreGamePage() {
  const router = useRouter()
  const createGameMutation = useCreateGameMutation()
  const [isLoading, setIsLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<GameRequest>({
    defaultValues: {
      title: "",
      publisher: "",
      platform: "",
      image: "",
      releaseDate: "",
      genres: []
    }
  })

  // Check authentication on client side only
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated()
      setAuthenticated(authStatus)
      setIsLoading(false)
      
      if (!authStatus) {
        router.push('/login')
      }
    }
    
    checkAuth()
  }, [router])

  const onSubmit = async (data: GameRequest) => {
    try {
      // Convert single genre to array for API compatibility
      const gameData = {
        ...data,
        genres: data.genres.length > 0 ? data.genres : []
      }
      await createGameMutation.mutateAsync(gameData)
    } catch (error) {
      console.error('Failed to create game:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!authenticated) {
    return null 
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <GameVaultHeader />
      <div className="p-6 pt-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Add New Game</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Game Name */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white font-medium">
                Game Name
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter game title"
                {...register('title', {
                  required: 'Game title is required',
                  minLength: {
                    value: 2,
                    message: 'Game title must be at least 2 characters'
                  }
                })}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-red-400 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Release Date */}
            <div className="space-y-2">
              <Label htmlFor="releaseDate" className="text-white font-medium">
                Release Date
              </Label>
              <div className="relative">
                <Input
                  id="releaseDate"
                  type="date"
                  placeholder="Select date"
                  {...register('releaseDate')}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
              {errors.releaseDate && (
                <p className="text-red-400 text-sm">{errors.releaseDate.message}</p>
              )}
            </div>

            {/* Publisher */}
            <div className="space-y-2">
              <Label htmlFor="publisher" className="text-white font-medium">
                Publisher
              </Label>
              <Input
                id="publisher"
                type="text"
                placeholder="Enter publisher name"
                {...register('publisher')}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.publisher && (
                <p className="text-red-400 text-sm">{errors.publisher.message}</p>
              )}
            </div>

            {/* Platform */}
            <div className="space-y-2">
              <Label className="text-white font-medium">Platform</Label>
              <Controller
                name="platform"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="PC" className="text-white hover:bg-slate-700">
                        PC
                      </SelectItem>
                      <SelectItem value="PlayStation" className="text-white hover:bg-slate-700">
                        PlayStation
                      </SelectItem>
                      <SelectItem value="Xbox" className="text-white hover:bg-slate-700">
                        Xbox
                      </SelectItem>
                      <SelectItem value="Nintendo Switch" className="text-white hover:bg-slate-700">
                        Nintendo Switch
                      </SelectItem>
                      <SelectItem value="Mobile" className="text-white hover:bg-slate-700">
                        Mobile
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.platform && (
                <p className="text-red-400 text-sm">{errors.platform.message}</p>
              )}
            </div>

            {/* Genre */}
            <div className="space-y-2">
              <Label className="text-white font-medium">Genre</Label>
              <Controller
                name="genres"
                control={control}
                render={({ field }) => (
                  <Select 
                    value={field.value?.[0] || ""} 
                    onValueChange={(value) => field.onChange([value])}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="Action" className="text-white hover:bg-slate-700">
                        Action
                      </SelectItem>
                      <SelectItem value="Adventure" className="text-white hover:bg-slate-700">
                        Adventure
                      </SelectItem>
                      <SelectItem value="RPG" className="text-white hover:bg-slate-700">
                        RPG
                      </SelectItem>
                      <SelectItem value="Strategy" className="text-white hover:bg-slate-700">
                        Strategy
                      </SelectItem>
                      <SelectItem value="Sports" className="text-white hover:bg-slate-700">
                        Sports
                      </SelectItem>
                      <SelectItem value="Racing" className="text-white hover:bg-slate-700">
                        Racing
                      </SelectItem>
                      <SelectItem value="Puzzle" className="text-white hover:bg-slate-700">
                        Puzzle
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.genres && (
                <p className="text-red-400 text-sm">{errors.genres.message}</p>
              )}
            </div>

            {/* Image URL Input */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-white font-medium">Game Image URL</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/game-image.jpg"
                {...register('image')}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.image && (
                <p className="text-red-400 text-sm">{errors.image.message}</p>
              )}
            </div>


            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/my-games')}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-2"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createGameMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                {createGameMutation.isPending ? 'Adding Game...' : 'Add Game'}
              </Button>
            </div>

            {createGameMutation.error && (
              <div className="text-red-400 text-sm mt-4">
                Failed to add game. {createGameMutation.error.message}
              </div>
            )}
          </form>
        </div>
      </div>
      <GameVaultFooter />
    </div>
  )
}