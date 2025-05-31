import 'dotenv/config'
import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.js'
import phraseRoutes from './routes/phrase.js'
import guessRoutes from './routes/guess.js'
import leaderboardRoutes from './routes/leaderboard.js'

const fastify = Fastify({ 
  logger: true,
  trustProxy: true
})
const prisma = new PrismaClient()

fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type']
})
fastify.register(jwt, { secret: process.env.JWT_SECRET })
fastify.decorate('prisma', prisma)
fastify.decorate('authenticate', async (req, res) => {
  try {
    await req.jwtVerify()
  } catch (err) {
    res.send(err)
  }
})

fastify.register(authRoutes)
fastify.register(phraseRoutes)
fastify.register(guessRoutes)
fastify.register(leaderboardRoutes)

const start = async () => {
  try {
    await fastify.listen({ 
      port: process.env.PORT || 3000,
      host: '0.0.0.0'  // Importante para produção
    })
    console.log(`🚀 Server is running at ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
