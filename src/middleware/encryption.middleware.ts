import { NextFunction, Request, Response } from 'express'
import { IAuthSession } from '../module/auth/auth.interface'
import CryptoUtils, { CryptoError, CryptoErrorTypes } from '../utils/crypto.utils'
import { CustomError } from '../common/errors/custom.error'
import { ResponseTypes } from '../utils/response.utils'

type Scheme = 'rsa' | 'aes'

type EncryptedDataDto = {
    data?: string
    scheme?: Scheme
}

export const decryptRequestMiddleware = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    const body = request.body as EncryptedDataDto
    const authSession = request['session'] as IAuthSession | undefined
    if (!authSession || !body || !body.data || body?.scheme === 'rsa') {
        return next()
    }
    // Caution, we are only using aes encryption for now
    try {
        const result = CryptoUtils.symmetricDecrypt(authSession.symmetricKey, body.data)
        request.body = JSON.stringify(result)
        next()
    } catch (e: any) {
        if (e instanceof CryptoError) {
            if (e.errType === CryptoErrorTypes.SYMMETRIC_DECRYPTION_FAILED) {
                throw CustomError.badRequest(ResponseTypes.DATA_DECRYPTION_FAILED)
            }
        }
        throw CustomError.internalServerError(e)
    }
}
