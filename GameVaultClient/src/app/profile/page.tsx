'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useProfileQuery, useUpdateProfileMutation, useMyGamesQuery } from '@/lib/auth-queries'
import { ProfileRequest } from '@/lib/api'
import { isAuthenticated } from '@/lib/api'
import { useRouter } from 'next/navigation'
import GameVaultHeader from "@/components/game-vault-header"
import { GameVaultFooter } from "@/components/game-vault-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, GamepadIcon, Trophy } from "lucide-react"
import Image from 'next/image'

export default function ProfilePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { data: profile, isLoading, error } = useProfileQuery()
  const { data: myGames, isLoading: gamesLoading } = useMyGamesQuery()
  const updateProfileMutation = useUpdateProfileMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<ProfileRequest>()

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

  // Reset form when profile data loads
  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username,
        email: profile.email,
        image: profile.image || ''
      })
    }
  }, [profile, reset])

  const onSubmit = async (data: ProfileRequest) => {
    try {
      await updateProfileMutation.mutateAsync(data)
      // Reset the form to mark it as not dirty
      reset(data)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  // Wait for component to mount before rendering
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900">
        <GameVaultHeader />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-white">Loading...</div>
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
      <div className="min-h-screen bg-slate-900">
        <GameVaultHeader />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-white">Loading profile...</div>
        </div>
        <GameVaultFooter />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900">
        <GameVaultHeader />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-red-400">Error loading profile: {error.message}</div>
        </div>
        <GameVaultFooter />
      </div>
    )
  }

  // Calculate platform stats from user's games
  const calculatePlatformStats = () => {
    if (!myGames || myGames.length === 0) return []
    
    const platformCounts: Record<string, number> = {}
    myGames.forEach(game => {
      const platform = game.platform || 'Unknown'
      platformCounts[platform] = (platformCounts[platform] || 0) + 1
    })
    
    const total = myGames.length
    return Object.entries(platformCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count)
  }

  // Calculate genre stats from user's games
  const calculateGenreStats = () => {
    if (!myGames || myGames.length === 0) return []
    
    const genreCounts: Record<string, number> = {}
    myGames.forEach(game => {
      if (game.gameGenres && game.gameGenres.length > 0) {
        game.gameGenres.forEach(gameGenre => {
          if (gameGenre.genre && gameGenre.genre.name) {
            const genreName = gameGenre.genre.name
            genreCounts[genreName] = (genreCounts[genreName] || 0) + 1
          }
        })
      }
    })
    
    const totalGenres = Object.values(genreCounts).reduce((sum, count) => sum + count, 0)
    return Object.entries(genreCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalGenres > 0 ? Math.round((count / totalGenres) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
  }

  const platformStats = calculatePlatformStats()
  const genreStats = calculateGenreStats()

  return (
    <div className="min-h-screen bg-slate-900">
      <GameVaultHeader />

      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information Card */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="text-center pb-4">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-slate-700">
                    <Image 
                      src={profile?.image || "/profile.jpeg"} 
                      alt="Profile" 
                      width={200} 
                      height={200} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <CardTitle className="text-white text-xl">{profile?.username || 'Loading...'}</CardTitle>
                  <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {profile?.createAt ? new Date(profile.createAt).getFullYear() : 'N/A'}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-700 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-400">{myGames?.length || 0}</div>
                      <div className="text-slate-400 text-sm">Total Games</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-400">89%</div>
                      <div className="text-slate-400 text-sm">Completion</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      <Trophy className="w-3 h-3 mr-1" />
                      Achievement Hunter
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-600 text-white">
                      <GamepadIcon className="w-3 h-3 mr-1" />
                      Multi-Platform Gamer
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Edit Profile Form */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Username</label>
                        <Input
                          {...register('username', {
                            required: 'Username is required',
                            minLength: {
                              value: 3,
                              message: 'Username must be at least 3 characters'
                            }
                          })}
                          className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        />
                        {errors.username && (
                          <p className="text-red-400 text-sm">{errors.username.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Email</label>
                        <Input
                          type="email"
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /\S+@\S+\.\S+/,
                              message: 'Email is invalid'
                            }
                          })}
                          className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        />
                        {errors.email && (
                          <p className="text-red-400 text-sm">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Profile Image URL</label>
                      <Input
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        {...register('image')}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      />
                      {errors.image && (
                        <p className="text-red-400 text-sm">{errors.image.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Bio</label>
                      <Textarea
                        defaultValue="Passionate gamer who loves exploring new worlds and completing challenging achievements. Always looking for the next great adventure!"
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 min-h-[100px]"
                        disabled
                      />
                      <p className="text-slate-500 text-xs">Bio editing coming soon</p>
                    </div>

                    <Button 
                      type="submit"
                      disabled={updateProfileMutation.isPending || !isDirty}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {updateProfileMutation.isPending ? 'Updating Profile...' : 'Update Profile'}
                    </Button>

                    {updateProfileMutation.error && (
                      <div className="text-red-400 text-sm mt-2">
                        Failed to update profile. {updateProfileMutation.error.message}
                      </div>
                    )}

                    {updateProfileMutation.isSuccess && !isDirty && (
                      <div className="text-green-400 text-sm mt-2">
                        Profile updated successfully!
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Platform Breakdown */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <GamepadIcon className="w-5 h-5" />
                  Platform Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {gamesLoading ? (
                  <div className="text-slate-400 text-center py-4">Loading platform data...</div>
                ) : platformStats.length > 0 ? (
                  platformStats.map((platform) => (
                    <div key={platform.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">{platform.name}</span>
                        <span className="text-slate-400">{platform.count} games</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${platform.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400 text-center py-4">No games added yet</div>
                )}
              </CardContent>
            </Card>

            {/* Genre Breakdown */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Genre Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {gamesLoading ? (
                  <div className="text-slate-400 text-center py-4">Loading genre data...</div>
                ) : genreStats.length > 0 ? (
                  genreStats.map((genre) => (
                    <div key={genre.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">{genre.name}</span>
                        <span className="text-slate-400">{genre.count} games</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${genre.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400 text-center py-4">No games with genres added yet</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <GameVaultFooter />
    </div>
  )
}