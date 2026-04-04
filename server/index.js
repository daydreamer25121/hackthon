import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { connectDb } from './config/db.js'
import { authRouter } from './routes/auth.js'
import { productsRouter } from './routes/products.js'
import { chatRouter } from './routes/chat.js'

const app = express()
const port = Number(process.env.PORT || 5000)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRouter)
app.use('/api/products', productsRouter)
app.use('/api/chat', chatRouter)

async function start() {
  console.log('Connecting to MongoDB...')
  try {
    await connectDb(process.env.MONGODB_URI)
    console.log('Successfully connected to MongoDB')
    
    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`)
    })
  } catch (error) {
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n❌ DATABASE ERROR: Could not connect to MongoDB!')
      console.error('👉 Make sure your MongoDB is running locally, or check your MONGODB_URI in .env\n')
    } else {
      console.error('Failed to start API:', error.message)
    }
    process.exit(1)
  }
}

start()

