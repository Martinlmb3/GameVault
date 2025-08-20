import { Button } from "@/components/ui/button"

export function GameVaultHero() {
  return (
    <section className="relative min-h-[600px] bg-slate-900 flex items-center justify-center overflow-hidden">
      {/* Background with controller image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-4xl mx-auto px-6">
          <div className="bg-slate-200 rounded-2xl p-8 md:p-16 relative">
            {/* Controller image */}
            <div className="flex justify-center mb-8">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-qY9r9Ypk6C3Ko3oxNBq5Cov0VAar03.png"
                alt="Gaming Controller"
                className="w-64 h-auto object-contain"
              />
            </div>

            {/* Hero content overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
              <div className="text-center text-white px-6">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Your Ultimate Game Collection Hub</h1>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
                  Organize, track, and manage your entire video game library effortlessly. Discover new titles, create
                  wishlists, and share your gaming experiences with friends.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg">
                    Add Game
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 text-lg"
                  >
                    View Library
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
