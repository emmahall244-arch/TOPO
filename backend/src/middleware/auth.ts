import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    name: string
    azureId: string
  }
}

// Middleware to verify JWT token
export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // TODO: Verify token with Azure AD
    // For now, we'll do a simple verification
    const decoded = jwt.decode(token) as any

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    req.user = {
      id: decoded.sub || decoded.oid,
      email: decoded.email || decoded.unique_name,
      name: decoded.name,
      azureId: decoded.oid || decoded.sub,
    }

    next()
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(401).json({ error: 'Invalid token' })
  }
}

// Middleware to ensure user is authenticated
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  next()
}
