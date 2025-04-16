import { PrismaClient } from '../prisma/.prisma/client';
const prisma = new PrismaClient()

async function main() {
  const defaultUser = await prisma.user.findFirst()

  if (!defaultUser) {
    throw new Error('No user found to assign quizzes to')
  }

  const quizzes = await prisma.quiz.findMany({
    where: {
      userId: null,
    },
  })

  for (const quiz of quizzes) {
    await prisma.quiz.update({
      where: { id: quiz.id },
      data: { userId: defaultUser.id },
    })
  }

  console.log(`Assigned ${quizzes.length} quizzes to user ${defaultUser.id}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

