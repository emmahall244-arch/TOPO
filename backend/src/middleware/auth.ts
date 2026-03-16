import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    name: string
    azureId?: string
  }
}

const JWT_SECRET = process.env.SESSION_SECRET || 'topo-secret-key'

// Middleware to verify JWT token and ensure user is authenticated
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // Verify and decode JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      azureId: decoded.oid,
    }

    return next()
  } catch (error) {
    console.error('Token verification error:', error)
    return res.status(401).json({ error: 'Invalid token' })
  }
}
