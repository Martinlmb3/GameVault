"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Upload } from "lucide-react"
import GameVaultHeader from "@/components/game-vault-header"
import { GameVaultFooter } from "@/components/game-vault-footer"

export default function StoreGamePage() {
  const [formData, setFormData] = useState({
    gameName: "",
    releaseDate: "",
    publisher: "",
    platform: "",
    genre: "",
  })
  const [dragActive, setDragActive] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload logic here
      console.log("File dropped:", e.dataTransfer.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <GameVaultHeader />
      <div className="p-6 pt-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Add New Game</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Game Name */}
            <div className="space-y-2">
              <Label htmlFor="gameName" className="text-white font-medium">
                Game Name
              </Label>
              <Input
                id="gameName"
                type="text"
                placeholder="Enter game title"
                value={formData.gameName}
                onChange={(e) => handleInputChange("gameName", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
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
                  value={formData.releaseDate}
                  onChange={(e) => handleInputChange("releaseDate", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
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
                value={formData.publisher}
                onChange={(e) => handleInputChange("publisher", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Platform */}
            <div className="space-y-2">
              <Label className="text-white font-medium">Platform</Label>
              <Select value={formData.platform} onValueChange={(value) => handleInputChange("platform", value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="pc" className="text-white hover:bg-slate-700">
                    PC
                  </SelectItem>
                  <SelectItem value="playstation" className="text-white hover:bg-slate-700">
                    PlayStation
                  </SelectItem>
                  <SelectItem value="xbox" className="text-white hover:bg-slate-700">
                    Xbox
                  </SelectItem>
                  <SelectItem value="nintendo" className="text-white hover:bg-slate-700">
                    Nintendo Switch
                  </SelectItem>
                  <SelectItem value="mobile" className="text-white hover:bg-slate-700">
                    Mobile
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Genre */}
            <div className="space-y-2">
              <Label className="text-white font-medium">Genre</Label>
              <Select value={formData.genre} onValueChange={(value) => handleInputChange("genre", value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="action" className="text-white hover:bg-slate-700">
                    Action
                  </SelectItem>
                  <SelectItem value="adventure" className="text-white hover:bg-slate-700">
                    Adventure
                  </SelectItem>
                  <SelectItem value="rpg" className="text-white hover:bg-slate-700">
                    RPG
                  </SelectItem>
                  <SelectItem value="strategy" className="text-white hover:bg-slate-700">
                    Strategy
                  </SelectItem>
                  <SelectItem value="sports" className="text-white hover:bg-slate-700">
                    Sports
                  </SelectItem>
                  <SelectItem value="racing" className="text-white hover:bg-slate-700">
                    Racing
                  </SelectItem>
                  <SelectItem value="puzzle" className="text-white hover:bg-slate-700">
                    Puzzle
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Upload Game Image */}
            <div className="space-y-2">
              <Label className="text-white font-medium">Upload Game Image</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-blue-500 bg-blue-500/10" : "border-slate-600 hover:border-slate-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <p className="text-slate-300 mb-4">Drag and drop or click to upload</p>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  Browse Files
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2">
                Add Game
              </Button>
            </div>
          </form>
        </div>
      </div>
      <GameVaultFooter />
    </div>
  )
}
