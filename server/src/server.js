import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.js'
import profileRoutes from './routes/profile.js'
import jobRoutes from './routes/jobs.js'
import resourceRoutes from './routes/resources.js'
import dashboardRoutes from './routes/dashboard.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))

app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error)
  
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body'
    })
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  })
})

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`)
  console.log(`👤 Profile endpoints: http://localhost:${PORT}/api/profile`)
  console.log(`💼 Job endpoints: http://localhost:${PORT}/api/jobs`)
  console.log(`📚 Resource endpoints: http://localhost:${PORT}/api/resources`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
})

export default app
