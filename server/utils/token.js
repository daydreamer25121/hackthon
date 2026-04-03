import jwt from 'jsonwebtoken'

export function signAuthToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '7d',
  })
}
