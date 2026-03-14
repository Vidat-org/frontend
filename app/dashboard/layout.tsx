import Navbar from "@/components/navbar"
import React from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto min-h-screen px-8 pt-24">
        {children}
      </main>
    </>
  )
}
