import { Request, Response } from 'express'
import { CustomError } from './../../common/errors/custom.error'
import { HttpStatusCode } from 'axios'
import CustomResponse from './../../utils/response.utils'
import { encryptResponse } from '@app/common/functionsUtils/functions'
import BookingService from './booking.service'
import Logger from './../../utils/logger.utils'

const logger = Logger.getInstance()

export default class BookingController {
    static async bookTicket(request: Request, response: Response) {
        const session = request['session']
        const eventId = request.body.eventId

        const { user } = session
        const { id } = user
        const data = { eventId, id }
        logger.warn('Entered booking ticket controller')
        try {
            const result = await BookingService.bookTicket(data)
            const encrypted_data = encryptResponse({ result })
            response.status(HttpStatusCode.Ok).send(
                CustomResponse.build({
                    code: HttpStatusCode.Ok,
                    success: true,
                    message: result.message,
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

    static async cancelTicket(request: Request, response: Response) {
        const session = request['session']
        const ticketId = request.body.ticketId

        const { user } = session
        const { id } = user
        const data = { ticketId, id }
        try {
            const result = await BookingService.cancelTicket(data)

            // encrypt data to send as response
            const encrypted_data = encryptResponse({ result })
            response.status(HttpStatusCode.Ok).send(
                CustomResponse.build({
                    code: HttpStatusCode.Ok,
                    success: true,
                    message: '',
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
}
