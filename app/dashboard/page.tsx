import { DashboardHeader } from "@/components/dashboard-header"
import { NotesList } from "@/components/notes-list"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - Notes Manager",
  description: "Manage your notes",
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Notes</h1>
        </div>
        <NotesList />
      </main>
    </div>
  )
}
