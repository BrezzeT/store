import jwt from 'jsonwebtoken'

const JWT_SECRET = 'your_jwt_secret_key' // Заміни на надійний секрет у .env

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (e) {
    return null
  }
}

export function getUserFromToken(token: string) {
  const decoded = verifyToken(token)
  if (!decoded || typeof decoded !== 'object') return null
  return decoded as { userId: string; role: string; name: string; email: string }
} 