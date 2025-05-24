import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function (fastify, opts) {
  fastify.get('/leaderboard', async (request, reply) => {
    try {
      const topUsers = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          points: true,
          createdAt: true
        },
        orderBy: {
          points: 'desc'
        },
        take: 10
      })

      return reply.send({
        success: true,
        data: topUsers
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Erro ao buscar o ranking de usuários'
      })
    }
  })
} 