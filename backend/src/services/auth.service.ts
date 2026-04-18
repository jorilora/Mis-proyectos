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

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('Usuario no encontrado')

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) throw new Error('La contraseña actual es incorrecta')

  if (newPassword.length < 6) throw new Error('La nueva contraseña debe tener al menos 6 caracteres')

  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } })
}
