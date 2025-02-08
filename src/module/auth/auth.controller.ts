import { Request, Response } from 'express'
import {
    getAuthSessionKey,
    IAuthSession,
    ICreateAccount,
    LoginDto,
} from './../../module/auth/auth.interface'
import { CustomError } from './../../common/errors/custom.error'
import AuthService from './../../module/auth/auth.service'
import RedisManager from './../../config/redis'
import envs from './../../config/env'
import { HttpStatusCode } from 'axios'
import CustomResponse from './../../utils/response.utils'
import Logger from './../../utils/logger.utils'
import { encryptResponse } from './../../common/functionsUtils/functions'

const { JWT_EXPIRATION_IN_SECONDS = 86400 } = envs

export default class AuthController {
    static async login(request: Request, response: Response) {
        Logger.getInstance().warn(`======== Entered login controller ========`)
        const data: LoginDto = request.body
        try {
            const result = await AuthService.login(data)
            Logger.getInstance().warn(`token: ${result.token}`)

            const { token, user } = result
            const symmetricKey = request['userSymmetricKey'] as string

            const authSession: IAuthSession = {
                user,
                token,
                symmetricKey,
            }

            // save data in redis
            await RedisManager.set<IAuthSession>(
                getAuthSessionKey(user.id as number),
                authSession,
                JWT_EXPIRATION_IN_SECONDS,
            )

            // encrypt data to send as response
            const encrypted_data = encryptResponse({ result })
            response.status(HttpStatusCode.Ok).send(
                CustomResponse.build({
                    code: HttpStatusCode.Ok,
                    success: true,
                    message: 'Login successful',
                    data: encrypted_data,
                }),
            )
        } catch (e: any) {
            if (e instanceof CustomError) {
                throw e
            }
            throw CustomError.internalServerError(e)
        }
    }

    private static async handler<T, R>(
        data: T,
        handler: (data: T) => Promise<R>,
        response: Response,
    ) {
        try {
            const result = await handler(data)
            response.status(HttpStatusCode.Ok).send(
                CustomResponse.build({
                    code: HttpStatusCode.Ok,
                    success: true,
                    data: result,
                    message: '',
                }),
            )
        } catch (e: any) {
            if (e instanceof CustomError) {
                throw e
            }
            throw CustomError.internalServerError(e)
        }
    }

    static async createAccount(request: Request, response: Response) {
        const data = request.body as ICreateAccount
        try {
            const result = await AuthService.createAccount(data)
            response.status(HttpStatusCode.Created).send(
                CustomResponse.build({
                    code: HttpStatusCode.Created,
                    success: true,
                    message: result,
                    data: {
                        message: result,
                    },
                }),
            )
        } catch (e: any) {
            if (e instanceof CustomError) {
                throw e
            }
            throw CustomError.internalServerError(e)
        }
    }
}
