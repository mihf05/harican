// Simple JWT-based authentication for now
// We'll implement Better Auth integration in the client separately

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from "./lib/prisma.js"

export const authService = {
  // Generate JWT token
  generateToken(userId) {
    return jwt.sign(
      { userId }, 
      process.env.BETTER_AUTH_SECRET, 
      { expiresIn: '7d' }
    )
  },

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.BETTER_AUTH_SECRET)
    } catch (error) {
      return null
    }
  },

  // Hash password
  async hashPassword(password) {
    return bcrypt.hash(password, 12)
  },

  // Compare password
  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword)
  },

  // Generate OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }
}
