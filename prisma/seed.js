import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const phrases = JSON.parse(readFileSync(join(__dirname, 'phrases.json'), 'utf-8'))

const prisma = new PrismaClient()

async function main() {
  for (const item of phrases) {
    await prisma.phrase.create({
      data: {
        textEN: item.textEN,
        explanation: item.explanation || '',
      },
    })
  }

  console.log('✅ Frases inseridas!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
