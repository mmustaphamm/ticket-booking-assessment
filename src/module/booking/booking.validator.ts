import { Request, NextFunction } from 'express'
import Joi, { ValidationError } from 'joi'
import { ResponseTypes } from '../../utils/response.utils'
import { CustomError } from '../../common/errors/custom.error'
import { IBooking } from './booking.interface'

export default class BookingValidator {
    static bookTicket(request: Request, response, next: NextFunction) {
        const schema = Joi.object({
            eventId: Joi.number().required(),
        })

        const data: IBooking = request.body
        const { error } = schema.validate(data, { abortEarly: false })
        BookingValidator.handleValidationError(error)
        next()
    }

    static cancelTicket(request: Request, response, next: NextFunction) {
        const schema = Joi.object({
            ticketId: Joi.number().required(),
        })

        const data: { ticketId: number } = request.body
        const { error } = schema.validate(data, { abortEarly: false })
        BookingValidator.handleValidationError(error)
        next()
    }

    private static handleValidationError(error?: ValidationError) {
        if (error) {
            const { message } = error
            throw CustomError.badRequest(message as ResponseTypes)
        }
    }
}
