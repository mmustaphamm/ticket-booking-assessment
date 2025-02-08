import { NextFunction, Request, Response } from 'express'
import { CustomError } from './../../common/errors/custom.error'
import { ResponseTypes } from './../../utils/response.utils'
import RedisManager from './../../config/redis'
import { getAuthSessionKey, IAuthSession } from './../../module/auth/auth.interface'
import JwtUtils from './../../utils/jwt.utils'

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    let token = request.header('Authorization')

    if (!token) {
        throw CustomError.unauthorized(ResponseTypes.INVALID_AUTH_TOKEN)
    }
    token = token.replace('Bearer ', '')

    try {
        const decoded = JwtUtils.verifyToken(token) as { userId: number }

        const key = getAuthSessionKey(decoded.userId)

        const authSession = await RedisManager.get<IAuthSession>(key)

        if (!authSession) {
            throw CustomError.notFound(ResponseTypes.NO_SESSION_FOUND_FOR_USER)
        }

        request['session'] = authSession

        next()
    } catch (err) {
        if (err instanceof CustomError) {
            throw err
        }
        const e = err as any
        if (['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError'].includes(e.name)) {
            throw CustomError.unauthorized(ResponseTypes.INVALID_AUTH_TOKEN)
        }
        throw CustomError.internalServerError(e)
    }
}
