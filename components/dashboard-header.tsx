"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { logout } from "@/lib/auth"
import { LogOut, Plus, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    setIsLoading(true)
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-xl">
          Notes Manager
        </Link>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search notes..." className="w-full pl-8" />
          </div>
          <Link href="/dashboard/new">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </Link>
          <ModeToggle />
          <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoading}>
            <LogOut className="mr-2 h-4 w-4" />
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  )
}
