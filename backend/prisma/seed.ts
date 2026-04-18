import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: hashed },
  })
  console.log('Seed completado: usuario admin / admin123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
