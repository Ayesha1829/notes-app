"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash, Plus } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { deleteNote, getNotes } from "@/lib/notes"
import type { Note } from "@/lib/types"
import { formatDate } from "@/lib/utils"

export function NotesList() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchNotes() {
      try {
        const fetchedNotes = await getNotes()
        setNotes(fetchedNotes)
      } catch (error) {
        console.error("Failed to fetch notes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotes()
  }, [])

  async function handleDelete(id: string) {
    try {
      await deleteNote(id)
      setNotes(notes.filter((note) => note._id !== id))
    } catch (error) {
      console.error("Failed to delete note:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-muted"></CardHeader>
            <CardContent className="h-32 mt-4 bg-muted"></CardContent>
            <CardFooter className="h-10 mt-4 bg-muted"></CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No notes yet</h3>
        <p className="text-muted-foreground mb-4">Create your first note to get started</p>
        <Link href="/dashboard/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Note
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <Card key={note._id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{note.title}</CardTitle>
              <div className="flex space-x-2">
                <Link href={`/dashboard/edit/${note._id}`}>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(note._id)}>
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3">{note.content}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex flex-wrap gap-2">
              {note.tags &&
                note.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
            </div>
            <div className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
