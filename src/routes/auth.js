// Registro e login com JWT

import bcrypt from 'bcryptjs'

export default async function (fastify) {
  // Rota de Registro
  fastify.post('/register', async (request, reply) => {
    const { email, password, name } = request.body

    const userExists = await fastify.prisma.user.findUnique({
      where: { email },
    })

    if (userExists) {
      return reply.status(400).send({ error: 'Email já cadastrado.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await fastify.prisma.user.create({
      data: { email, password: hashedPassword, name },
    })

    const token = fastify.jwt.sign({ id: user.id, email: user.email })

    return { token, userId: user.id }
  })

  // Rota de Login
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body

    const user = await fastify.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return reply.status(400).send({ error: 'Usuário não encontrado.' })
    }

    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
      return reply.status(400).send({ error: 'Senha incorreta.' })
    }

    const token = fastify.jwt.sign({ id: user.id, email: user.email })

    return { token, userId: user.id }
  })

  // Rota Protegida de Perfil
  fastify.get('/me', { preHandler: [fastify.authenticate] }, async (request) => {
    const user = await fastify.prisma.user.findUnique({
      where: { id: request.user.id },
      select: { id: true, email: true, name: true, points: true },
    })

    return user
  })
}
