import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { prisma } from '@/db/client'

const router = Router()

const JWT_SECRET = process.env.SESSION_SECRET || 'topo-secret-key'

interface SignupRequest extends Request {
  body: {
    email: string
    name: string
    password: string
  }
}

interface LoginRequest extends Request {
  body: {
    email: string
    password: string
  }
}

// Signup endpoint
router.post('/signup', async (req: SignupRequest, res: Response) => {
  try {
    const { email, name, password } = req.body

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Email, name, and password are required' })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    // Generate JWT token
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// Login endpoint
router.post('/login', async (req: LoginRequest, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Failed to login' })
  }
})

export default router
