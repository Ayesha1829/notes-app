"use server"

import { cookies } from "next/headers"
import { connectToDatabase } from "./db"
import type { User } from "./types"
import { sign, verify } from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const TOKEN_NAME = "auth-token"

export async function register({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}) {
  const { db } = await connectToDatabase()

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  const result = await db.collection("users").insertOne({
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  })

  // Create session
  const user = {
    _id: result.insertedId.toString(),
    name,
    email,
  }

  const token = sign(user, JWT_SECRET, { expiresIn: "7d" })
  cookies().set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return user
}

export async function login({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const { db } = await connectToDatabase()

  // Find user
  const user = await db.collection("users").findOne({ email })
  if (!user) {
    throw new Error("Invalid credentials")
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new Error("Invalid credentials")
  }

  // Create session
  const sessionUser = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
  }

  const token = sign(sessionUser, JWT_SECRET, { expiresIn: "7d" })
  cookies().set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return sessionUser
}

export async function logout() {
  cookies().delete(TOKEN_NAME)
}

export async function verifySession(): Promise<User | null> {
  const token = cookies().get(TOKEN_NAME)?.value

  if (!token) {
    return null
  }

  try {
    const user = verify(token, JWT_SECRET) as User
    return user
  } catch (error) {
    cookies().delete(TOKEN_NAME)
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  return verifySession()
}
