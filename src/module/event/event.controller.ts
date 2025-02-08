import { Request, Response } from 'express'
import { CustomError } from '../../common/errors/custom.error'
import { HttpStatusCode } from 'axios'
import CustomResponse from '../../utils/response.utils'
import EventService from './event.service'
import { IEvents } from './event.interface'
import RedisManager from './../../config/redis'
import { getEventSessionKey } from './event.interface'
import { EventModel } from './event.model'
import { encryptResponse } from '../../common/functionsUtils/functions'
import envs from './../../config/env'
import Logger from './../../utils/logger.utils'

const logger = Logger.getInstance()

const { JWT_EXPIRATION_IN_SECONDS = 86400 } = envs

export default class EventController {
    static async initialize(request: Request, response: Response) {
        const data: IEvents = request.body
        logger.warn(`request body ${JSON.stringify(data)}`)
        try {
            const result = await EventService.initializeEvent(data)

            // save data in redis
            await RedisManager.set<EventModel>(
                getEventSessionKey(result.id as unknown as string),
                result,
                JWT_EXPIRATION_IN_SECONDS,
            )

            const encrypted_data = encryptResponse(result)

            response.status(HttpStatusCode.Created).send(
                CustomResponse.build({
                    code: HttpStatusCode.Created,
                    success: true,
                    message: 'Event created successfully',
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

    static async getEventStatus(request: Request, response: Response) {
        try {
            logger.warn('Enetered get event status controller')
            const eventId = parseInt(request.params.eventId, 10)
            const result = await EventService.getEventStatus(eventId)

            const encrypted_data = encryptResponse(result)

            response.status(HttpStatusCode.Created).send(
                CustomResponse.build({
                    code: HttpStatusCode.Created,
                    success: true,
                    message: 'Event created successfully',
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
}
