import CryptoUtils, { CryptoError, CryptoErrorTypes } from './../../utils/crypto.utils'
import { ResponseTypes } from './../../utils/response.utils'
import { CustomError } from '../errors/custom.error'
import { NextFunction, Request, Response } from 'express'
import envs from './../../config/env'

type EncryptedLoginDto = {
    data: string
}

const { ENCRYPTION_KEY } = envs

export const encryptResponse = (data) => {
    if (!data) {
        throw CustomError.badRequest(ResponseTypes.INVALID_OR_MISSING_DATA)
    }

    try {
        const encryptedData = CryptoUtils.symmetricEncrypt(ENCRYPTION_KEY, JSON.stringify(data))
        return encryptedData
    } catch (e: any) {
        if (e instanceof CryptoError) {
            let responseType: ResponseTypes = ResponseTypes.INTERNAL_SERVER_ERROR
            if (
                e.errType === CryptoErrorTypes.INVALID_SYMMETRIC_DATA_FORMAT ||
                e.errType === CryptoErrorTypes.SYMMETRIC_DECRYPTION_FAILED
            ) {
                responseType = ResponseTypes.DATA_DECRYPTION_FAILED
            } else if (e.errType === CryptoErrorTypes.ASYMMETRIC_DECRYPTION_FAILED) {
                responseType = ResponseTypes.KEY_DECRYPTION_FAILED
            }
            throw CustomError.badRequest(responseType)
        }
        throw CustomError.internalServerError(e)
    }
}

export const decryptRequest = (request: Request, response: Response, next: NextFunction) => {
    if (!request.body?.data) {
        throw CustomError.badRequest(ResponseTypes.INVALID_OR_MISSING_DATA)
    }

    const { data } = request.body as EncryptedLoginDto
    try {
        const decryptedData = CryptoUtils.symmetricDecrypt(ENCRYPTION_KEY, data)
        request['userSymmetricKey'] = ENCRYPTION_KEY
        request.body = JSON.parse(decryptedData)
        next()
    } catch (e: any) {
        if (e instanceof CryptoError) {
            let responseType: ResponseTypes = ResponseTypes.INTERNAL_SERVER_ERROR
            if (
                e.errType === CryptoErrorTypes.INVALID_SYMMETRIC_DATA_FORMAT ||
                e.errType === CryptoErrorTypes.SYMMETRIC_DECRYPTION_FAILED
            ) {
                responseType = ResponseTypes.DATA_DECRYPTION_FAILED
            } else if (e.errType === CryptoErrorTypes.ASYMMETRIC_DECRYPTION_FAILED) {
                responseType = ResponseTypes.KEY_DECRYPTION_FAILED
            }
            throw CustomError.badRequest(responseType)
        }
        throw CustomError.internalServerError(e)
    }
}
