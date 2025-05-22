import 'dotenv/config'
import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.js'
import phraseRoutes from './routes/phrase.js'
import guessRoutes from './routes/guess.js'

const fastify = Fastify({ logger: true })
const prisma = new PrismaClient()

fastify.register(cors, {
  origin: 'http://localhost:5173',
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

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  console.log(`🚀 Server is running at ${address}`)
})
