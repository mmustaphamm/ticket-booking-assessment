import jwt, { sign } from 'jsonwebtoken'
import envs from '@config/env'

const { JWT_SECRET_KEY, JWT_ISSUER, JWT_EXPIRATION_IN_SECONDS = 86400 } = envs

export default class JwtUtils {
    static generateToken(data) {
        return sign(data, JWT_SECRET_KEY, {
            issuer: JWT_ISSUER,
            algorithm: 'HS256',
            expiresIn: JWT_EXPIRATION_IN_SECONDS * 1000,
        })
    }

    static verifyToken<T>(token: string) {
        return jwt.verify(token, JWT_SECRET_KEY) as T
    }
}
