import { DashboardHeader } from "@/components/dashboard-header"
import { NoteForm } from "@/components/note-form"
import { getNote } from "@/lib/notes"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Edit Note - Notes Manager",
  description: "Edit your note",
}

export default async function EditNotePage({
  params,
}: {
  params: { id: string }
}) {
  const note = await getNote(params.id)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Edit Note</h1>
        </div>
        <NoteForm note={note} />
      </main>
    </div>
  )
}
