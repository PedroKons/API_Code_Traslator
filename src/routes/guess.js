//Recebe a resposta do usuário, envia para o gpt, valida e salva

import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function (fastify) {
  fastify.post('/phrases/:id/guess', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const phraseId = request.params.id
    const { userAnswer } = request.body
    const userId = request.user.id

    const phrase = await fastify.prisma.phrase.findUnique({
      where: { id: phraseId }
    })

    if (!phrase) {
      return reply.status(404).send({ error: 'Frase não encontrada.' })
    }

    // Prompt para o ChatGPT validar a resposta do usuário
    const prompt = `
Você é um professor de inglês técnico. Avalie a tradução abaixo:

Frase em inglês: "${phrase.textEN}"

Tradução feita pelo aluno: "${userAnswer}"

Responda apenas em JSON:
{
  "isCorrect": true|false,
  "feedback": "Sua explicação detalhada sobre a resposta"
}
    `.trim()

    let gptResponse
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: "system", content: 
              `Você é um avaliador especializado em traduções técnicas de inglês para português, com foco em terminologia de programação e desenvolvimento de software.

              Sua função é:
              1. Avaliar a precisão e adequação da tradução fornecida
              2. Explicar termos técnicos específicos da programação quando relevante
              3. Destacar diferenças sutis entre o inglês técnico e português
              4. Fornecer feedback construtivo sobre a tradução
              5. Manter o feedback no formato JSON solicitado

              Importante: 
              - Não reescreva a tradução do usuário, apenas avalie e explique
              - Mantenha suas explicações concisas e focadas nos aspectos técnicos e linguísticos relevantes` },
            { role: 'user', content: prompt }
        ],
        temperature: 0
      })

      const rawContent = completion.choices[0].message.content

      gptResponse = JSON.parse(rawContent)

    } catch (error) {
      console.error('Erro ao validar com o GPT:', error)
      return reply.status(500).send({ error: 'Erro ao validar a resposta com o GPT.' })
    }

    // Atualiza a pontuação
    const pointDelta = gptResponse.isCorrect ? 10 : -5

    await fastify.prisma.user.update({
      where: { id: userId },
      data: { points: { increment: pointDelta } }
    })

    // Salva o palpite
    await fastify.prisma.guess.create({
      data: {
        userId,
        phraseId,
        userAnswer,
        isCorrect: gptResponse.isCorrect,
        gptFeedback: gptResponse.feedback
      }
    })

    return {
      isCorrect: gptResponse.isCorrect,
      feedback: gptResponse.feedback,
      pointsAwarded: pointDelta
    }
  })
}
