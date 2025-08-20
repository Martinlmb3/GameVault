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
  const platformStats = [
    { name: "PlayStation", count: 45, percentage: 30 },
    { name: "Xbox", count: 38, percentage: 25 },
    { name: "PC", count: 52, percentage: 35 },
    { name: "Nintendo", count: 15, percentage: 10 },
  ]

  const genreStats = [
    { name: "Action", count: 35, percentage: 23 },
    { name: "RPG", count: 42, percentage: 28 },
    { name: "Strategy", count: 28, percentage: 19 },
    { name: "Puzzle", count: 18, percentage: 12 },
    { name: "Sports", count: 12, percentage: 8 },
    { name: "Racing", count: 15, percentage: 10 },
  ]

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
                    <Image src="/professional-woman-avatar.png" alt="Profile" width={200} height={200} className="w-full h-full object-cover" />
                  </div>
                  <CardTitle className="text-white text-xl">Sophia Rodriguez</CardTitle>
                  <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Joined 2020</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-700 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-400">150</div>
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
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Username</label>
                      <Input
                        defaultValue="sophia_rodriguez"
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Email</label>
                      <Input
                        defaultValue="sophia@example.com"
                        type="email"
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Bio</label>
                    <Textarea
                      defaultValue="Passionate gamer who loves exploring new worlds and completing challenging achievements. Always looking for the next great adventure!"
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Password</label>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    />
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Update Profile</Button>
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
                {platformStats.map((platform) => (
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
                ))}
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
                {genreStats.map((genre) => (
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
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <GameVaultFooter />
    </div>
  )
}
