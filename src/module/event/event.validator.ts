import { Request, Response, NextFunction } from 'express'
import Joi, { ValidationError } from 'joi'
import { ResponseTypes } from '../../utils/response.utils'
import { CustomError } from '../../common/errors/custom.error'
import { IEvents } from './event.interface'

export default class EventValidator {
    static initializeEventValidator(request: Request, response: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().required().min(2),
            totalTickets: Joi.number().min(1).required(),
        })

        const data: IEvents = request.body
        const { error } = schema.validate(data, { abortEarly: false })
        EventValidator.handleValidationError(error)
        next()
    }

    private static handleValidationError(error?: ValidationError) {
        if (error) {
            const { message } = error
            throw CustomError.badRequest(message as ResponseTypes)
        }
    }
}
