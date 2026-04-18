import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import authRoutes from './routes/auth.routes'
import clientRoutes from './routes/clients.routes'
import debtRoutes from './routes/debts.routes'
import { dashboard, overdueReport } from './controllers/debts.controller'
import { authMiddleware } from './middleware/auth'
import { errorHandler } from './middleware/errorHandler'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/debts', debtRoutes)
app.get('/api/dashboard', authMiddleware, dashboard)
app.get('/api/reports/overdue', authMiddleware, overdueReport)

app.use(errorHandler)

// En producción, sirve el frontend compilado desde este mismo servidor
const frontendDist = path.join(__dirname, '../../frontend/dist')
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'))
  })
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Cartera en Mora corriendo en http://localhost:${PORT}`))
