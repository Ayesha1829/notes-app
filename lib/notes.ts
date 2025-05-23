"use server"

import { connectToDatabase } from "./db"
import { getCurrentUser } from "./auth"
import type { Note } from "./types"
import { ObjectId } from "mongodb"

export async function getNotes(): Promise<Note[]> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { db } = await connectToDatabase()

  const notes = await db.collection("notes").find({ userId: user._id }).sort({ createdAt: -1 }).toArray()

  return notes.map((note) => ({
    ...note,
    _id: note._id.toString(),
  }))
}

export async function getNote(id: string): Promise<Note> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { db } = await connectToDatabase()

  const note = await db.collection("notes").findOne({
    _id: new ObjectId(id),
    userId: user._id,
  })

  if (!note) {
    throw new Error("Note not found")
  }

  return {
    ...note,
    _id: note._id.toString(),
  }
}

export async function createNote({
  title,
  content,
  tags,
}: {
  title: string
  content: string
  tags?: string[]
}): Promise<Note> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { db } = await connectToDatabase()

  const result = await db.collection("notes").insertOne({
    title,
    content,
    tags: tags || [],
    userId: user._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return {
    _id: result.insertedId.toString(),
    title,
    content,
    tags: tags || [],
    userId: user._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export async function updateNote(
  id: string,
  {
    title,
    content,
    tags,
  }: {
    title: string
    content: string
    tags?: string[]
  },
): Promise<Note> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { db } = await connectToDatabase()

  const result = await db.collection("notes").findOneAndUpdate(
    {
      _id: new ObjectId(id),
      userId: user._id,
    },
    {
      $set: {
        title,
        content,
        tags: tags || [],
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  )

  if (!result) {
    throw new Error("Note not found")
  }

  return {
    ...result,
    _id: result._id.toString(),
  }
}

export async function deleteNote(id: string): Promise<void> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { db } = await connectToDatabase()

  const result = await db.collection("notes").deleteOne({
    _id: new ObjectId(id),
    userId: user._id,
  })

  if (result.deletedCount === 0) {
    throw new Error("Note not found")
  }
}
