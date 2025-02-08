import { CustomError } from '../../common/errors/custom.error'
import { ResponseTypes } from '../../utils/response.utils'
import PersistenceManager from './../../config/db'
import { EventModel } from './event.model'
import { IEvents } from './event.interface'
import RedisManager from '@app/config/redis'
import { getEventSessionKey } from './event.interface'
import { WaitingList } from '../wait-list/wait-list.model'
import Logger from '@app/utils/logger.utils'

export default class EventService {
    static get eventRepository() {
        return PersistenceManager.repository(EventModel)
    }

    static get waitingListRepository() {
        return PersistenceManager.repository(WaitingList)
    }

    static async initializeEvent(data: IEvents) {
        Logger.getInstance().warn('Creation of event started')
        const { name, totalTickets } = data

        // Validate inputs
        if (!name || totalTickets === undefined || totalTickets <= 0) {
            throw CustomError.badRequest(ResponseTypes.INVALID_EVENTS_DATA)
        }

        const savedEvent = await EventService.eventRepository.findOneBy({
            name,
            is_active: true,
        })

        if (savedEvent) {
            throw CustomError.badRequest(ResponseTypes.DUPLICATE_EVENT)
        }

        let event = EventService.eventRepository.create({
            name,
            total_tickets: totalTickets,
            is_active: true,
        })

        const runner = PersistenceManager.dataSource.createQueryRunner()
        await runner.startTransaction()
        try {
            await EventService.eventRepository.save(event)
            await runner.commitTransaction()
            Logger.getInstance().warn('Event created and added to the db successfully')
            return event
        } catch (e: any) {
            await runner.rollbackTransaction()

            throw e instanceof CustomError ? e : CustomError.internalServerError(e)
        } finally {
            await runner.release()
        }
    }

    static async getEventStatus(eventId: number) {
        const runner = PersistenceManager.dataSource.createQueryRunner()
        await runner.startTransaction()

        try {
            let event = await RedisManager.get<EventModel>(getEventSessionKey(eventId.toString()))

            if (!event) {
                // If event is not in Redis, fetch from DB
                event = await EventService.eventRepository.findOneBy({ id: eventId })
                if (!event) throw CustomError.notFound(ResponseTypes.NON_EXISTENT_EVENT)
            }

            // Calculate available tickets
            const availableTickets = event.total_tickets - event.booked_tickets

            // Count users in the waiting list
            const waitingListCount = await EventService.waitingListRepository.count({
                where: { event_id: eventId },
            })

            return {
                eventId: event.id,
                eventName: event.name,
                availableTickets,
                totalTickets: event.total_tickets,
                bookedTickets: event.booked_tickets,
                waitingListCount,
            }
        } catch (e: any) {
            await runner.rollbackTransaction()
            throw e instanceof CustomError ? e : CustomError.internalServerError(e)
        } finally {
            await runner.release()
        }
    }
}
