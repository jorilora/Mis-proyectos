import bcrypt from 'bcryptjs'
import prisma from '../utils/prisma'
import { signToken } from '../utils/jwt'

export async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) throw new Error('Credenciales incorrectas')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw new Error('Credenciales incorrectas')

  const token = signToken({ sub: user.id, username: user.username })
  return { token, user: { id: user.id, username: user.username } }
}
