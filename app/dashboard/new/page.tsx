import { DashboardHeader } from "@/components/dashboard-header"
import { NoteForm } from "@/components/note-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Note - Notes Manager",
  description: "Create a new note",
}

export default function NewNotePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create New Note</h1>
        </div>
        <NoteForm />
      </main>
    </div>
  )
}
