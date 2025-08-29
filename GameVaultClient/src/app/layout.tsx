import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { QueryProvider } from "@/lib/query-provider"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Game Vault",
  description: "Your game management platform",
  icons: {
    icon: "/Depth 3, Frame 2.png",
    shortcut: "/Depth 3, Frame 2.png",
    apple: "/Depth 3, Frame 2.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="font-sans antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
