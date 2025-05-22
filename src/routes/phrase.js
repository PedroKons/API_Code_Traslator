// Retorna uma frase aleatória

export default async function (fastify) {
    // Rota protegida para pegar uma frase aleatória
    fastify.get('/phrases/random', { preHandler: [fastify.authenticate] }, async (request, reply) => {
      const allPhrases = await fastify.prisma.phrase.findMany()
      const randomPhrase = allPhrases[Math.floor(Math.random() * allPhrases.length)]
  
      if (!randomPhrase) {
        return reply.status(404).send({ error: 'Nenhuma frase disponível.' })
      }
  
      return {
        id: randomPhrase.id,
        textEN: randomPhrase.textEN,
        explanation: randomPhrase.explanation
      }
    })
}
