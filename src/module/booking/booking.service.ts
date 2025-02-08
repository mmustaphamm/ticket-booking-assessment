import { getEventSessionKey } from '../event/event.interface'
import { CustomError } from '../../common/errors/custom.error'
import { ResponseTypes } from '../../utils/response.utils'
import PersistenceManager from './../../config/db'
import { Booking } from './booking.model'
import { EventModel } from '../event/event.model'
import RedisManager from './../../config/redis'
import { getBookedTicketSessionKey, ICancel } from './booking.interface'
import { WaitListService } from '../wait-list/wait-list.service'
import EventService from '../event/event.service'
import envs from './../../config/env'

const { JWT_EXPIRATION_IN_SECONDS = 86400 } = envs

export default class BookingService {
    static get bookRepository() {
        return PersistenceManager.repository(Booking)
    }

    static async bookTicket(data) {
        const { eventId, id } = data
        const runner = PersistenceManager.dataSource.createQueryRunner()
        await runner.startTransaction()

        try {
            let event = await RedisManager.get<EventModel>(getEventSessionKey(eventId.toString()))
            let bookedTicket

            if (!event) {
                // If event is not in Redis, fetch from DB
                event = await EventService.eventRepository.findOneBy({ id: eventId })
                if (!event) throw CustomError.badRequest(ResponseTypes.NON_EXISTENT_EVENT)
            }

            let bookingConfirmed = false

            // Atomic booking update to prevent overbooking
            const updateResult = await EventService.eventRepository
                .createQueryBuilder()
                .update(EventModel)
                .set({ booked_tickets: () => 'booked_tickets + 1' })
                .where('id = :eventId AND booked_tickets < total_tickets', { eventId })
                .execute()

            if (updateResult && updateResult.affected && updateResult.affected > 0) {
                // Booking confirmed
                bookedTicket = BookingService.bookRepository.create({
                    user_id: id,
                    event_id: event.id,
                    status: 'booked',
                })
                await BookingService.bookRepository.save(bookedTicket)
                bookingConfirmed = true
            } else {
                // No available tickets, add to the waiting list
                const waitingListEntry = WaitListService.waitingListRepository.create({
                    user_id: id,
                    event_id: event.id,
                })
                await WaitListService.waitingListRepository.save(waitingListEntry)
            }

            // Update event cache in Redis
            event.booked_tickets += bookingConfirmed ? 1 : 0
            RedisManager.set(
                getEventSessionKey(event.id.toString()),
                event,
                JWT_EXPIRATION_IN_SECONDS,
            )

            RedisManager.set<Booking>(
                getBookedTicketSessionKey(event.id.toString()),
                bookedTicket,
                JWT_EXPIRATION_IN_SECONDS,
            )

            await runner.commitTransaction()

            return {
                bookedTicket: bookingConfirmed ? bookedTicket : null,
                message: bookingConfirmed
                    ? 'Booking successful.'
                    : 'Event full, added to waiting list.',
            }
        } catch (e: any) {
            await runner.rollbackTransaction()
            throw e instanceof CustomError ? e : CustomError.internalServerError(e)
        } finally {
            await runner.release()
        }
    }

    static async cancelTicket(data: ICancel) {
        const { ticketId } = data

        const runner = PersistenceManager.dataSource.createQueryRunner()
        await runner.startTransaction()

        try {
            let booking = await RedisManager.get<Booking>(
                getBookedTicketSessionKey(ticketId as unknown as string),
            )

            if (!booking) {
                // If not in Redis, check DB
                booking = await BookingService.bookRepository.findOneBy({ id: Number(ticketId) })
                if (!booking) throw CustomError.badRequest(ResponseTypes.TICKET_DOES_NOT_EXIST)
            }

            const event = await EventService.eventRepository.findOneBy({ id: booking.event_id })
            if (!event) throw CustomError.badRequest(ResponseTypes.INVALID_EVENT)

            // Remove booking
            await BookingService.bookRepository.delete({ id: booking.id })

            // Update event ticket count
            event.booked_tickets -= 1
            await EventService.eventRepository.save(event)

            // Remove from Redis if it existed
            await RedisManager.del(getBookedTicketSessionKey(ticketId as unknown as string))

            // Check waiting list
            const nextInline = await WaitListService.waitingListRepository.findOne({
                where: { event_id: event.id },
                order: { created_at: 'ASC' },
            })

            if (nextInline) {
                // Assign ticket to the next user in line
                const newBooking = BookingService.bookRepository.create({
                    user_id: nextInline.user_id,
                    event_id: nextInline.event_id,
                    status: 'booked',
                })

                await BookingService.bookRepository.save(newBooking)

                // Remove from waiting list
                await WaitListService.waitingListRepository.delete({ id: nextInline.id })

                // Save booking to Redis
                RedisManager.set(
                    getBookedTicketSessionKey(newBooking.id.toString()),
                    newBooking,
                    JWT_EXPIRATION_IN_SECONDS,
                )
            }
            await runner.commitTransaction()
            return { message: 'Booking canceled and reassigned successfully.' }
        } catch (e: any) {
            await runner.rollbackTransaction()

            if (e instanceof CustomError) {
                throw e
            }
            throw CustomError.internalServerError(e)
        } finally {
            await runner.release()
        }
    }
}
