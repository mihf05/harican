import { authService } from '../auth.js'
import { prisma } from '../lib/prisma.js'

// Middleware to authenticate user
export const authenticateUser = async (req, res, next) => {
  try {
    // Try to get token from cookie first, then from Authorization header
    let token = req.cookies?.auth_token
    
    if (!token) {
      const authHeader = req.headers.authorization
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7) // Remove 'Bearer ' prefix
      }
    }
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      })
    }

    const decoded = authService.verifyToken(token)

    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      })
    }

    // Get full user data from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        skills: true,
      },
    })

    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found or inactive' 
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Authentication failed' 
    })
  }
}

// Middleware to check user roles
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      })
    }

    const userRoles = Array.isArray(roles) ? roles : [roles]
    
    if (!userRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      })
    }

    next()
  }
}

// Middleware for admin only routes
export const requireAdmin = requireRole(['ADMIN'])

// Middleware for employer and admin routes
export const requireEmployerOrAdmin = requireRole(['EMPLOYER', 'ADMIN'])

// Optional authentication - doesn't fail if no user
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = authService.verifyToken(token)

      if (decoded) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          include: {
            skills: true,
          },
        })
        
        if (user && user.isActive) {
          req.user = user
        }
      }
    }

    next()
  } catch (error) {
    // Continue without authentication
    next()
  }
}
