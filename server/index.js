import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { connectDb } from './config/db.js'
import { authRouter } from './routes/auth.js'
import { productsRouter } from './routes/products.js'

const app = express()
const port = Number(process.env.PORT || 5000)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRouter)
app.use('/api/products', productsRouter)

async function start() {
  await connectDb(process.env.MONGODB_URI)
  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`)
  })
}

start().catch((error) => {
  console.error('Failed to start API', error)
  process.exit(1)
})
