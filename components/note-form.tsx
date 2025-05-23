"use client"

import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createNote, updateNote } from "@/lib/notes"
import type { Note } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  content: z.string().min(1, {
    message: "Content is required.",
  }),
  tags: z.array(z.string()).optional(),
})

export function NoteForm({ note }: { note?: Note }) {
  const [isLoading, setIsLoading] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: note?.title || "",
      content: note?.content || "",
      tags: note?.tags || [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      if (note) {
        await updateNote(note._id, values)
      } else {
        await createNote(values)
      }
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to save note:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      const currentTags = form.getValues("tags") || []
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  function removeTag(tagToRemove: string) {
    const currentTags = form.getValues("tags") || []
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove),
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Note title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your note here..." className="min-h-[200px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Tags</FormLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.watch("tags")?.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="rounded-full hover:bg-muted">
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tag} tag</span>
                </button>
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Add tags (press Enter)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
          />
          <p className="text-xs text-muted-foreground">Press Enter to add a tag</p>
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : note ? "Update Note" : "Create Note"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
