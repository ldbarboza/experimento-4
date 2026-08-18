import express from 'express'
import cors from 'cors'
import contactRouter from './routes/contact'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api', contactRouter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred.',
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
