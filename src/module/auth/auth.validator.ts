import { Request, Response, NextFunction } from 'express'
import Joi, { ValidationError } from 'joi'
import { ResponseTypes } from '../../utils/response.utils'

import { ICreateAccount } from '../../module/auth/auth.interface'
import { CustomError } from '../../common/errors/custom.error'

export default class AuthValidator {
    private static passwordSchema = Joi.string().required().messages({
        'any.required': ResponseTypes.INVALID_PASSWORD,
        'string.invalid': ResponseTypes.INVALID_PASSWORD,
        'string.empty': ResponseTypes.INVALID_PASSWORD,
    })

    private static emailSchema = Joi.string().required().email().messages({
        'string.email': ResponseTypes.INVALID_EMAIL,
        'any.required': ResponseTypes.INVALID_EMAIL,
        'string.empty': ResponseTypes.INVALID_EMAIL,
    })

    static login(request: Request, response: Response, next: NextFunction) {
        const schema = Joi.object({
            email: AuthValidator.emailSchema,
            password: AuthValidator.passwordSchema,
        })
        const { error } = schema.validate(request.body, { abortEarly: false })
        AuthValidator.handleValidationError(error)
        next()
    }

    static createAccount(request: Request, response: Response, next: NextFunction) {
        const schema = Joi.object({
            email: AuthValidator.emailSchema,
            password: Joi.string().required().min(6),
        })

        const data: ICreateAccount = request.body
        const { error } = schema.validate(data, { abortEarly: false })
        AuthValidator.handleValidationError(error)
        next()
    }

    private static handleValidationError(error?: ValidationError) {
        if (error) {
            const { message } = error
            throw CustomError.badRequest(message as ResponseTypes)
        }
    }
}
