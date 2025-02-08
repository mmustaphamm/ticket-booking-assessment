import { Request, Response } from 'express'
import EventController from '@app/module/event/event.controller'
import EventService from '@app/module/event/event.service'
import { ResponseTypes } from '@app/utils/response.utils'
import { CustomError } from '@app/common/errors/custom.error'
import RedisManager from '@app/config/redis'
import PersistenceManager from '@app/config/db'
// import { getEventSessionKey } from '../event.interface'
import { HttpStatusCode } from 'axios'

describe('EventController.getEventStatus', () => {
    let request: Partial<Request>
    let response: Partial<Response>
    let statusMock: jest.Mock
    let sendMock: jest.Mock

    beforeAll(async () => {
        if (!PersistenceManager.isConnected()) {
            await PersistenceManager.initialize({})
        }
    }, 20000)

    beforeEach(() => {
        statusMock = jest.fn()
        sendMock = jest.fn()

        response = {
            status: statusMock.mockReturnValue({ send: sendMock }),
        }
    })

    afterAll(async () => {
        await PersistenceManager.destroy()
    })

    it('should handle errors thrown by the service', async () => {
        const error = new CustomError({
            code: HttpStatusCode.InternalServerError,
            message: '',
        })
        jest.spyOn(EventService, 'getEventStatus').mockRejectedValue(error)

        request = { params: { eventId: '1' } }

        await expect(
            EventController.getEventStatus(request as Request, response as Response),
        ).rejects.toThrow(error)
    })
    it('should return event status when found in Redis', async () => {
        const eventId = 1
        const mockEvent = {
            id: eventId,
            name: 'Sample Event',
            total_tickets: 100,
            booked_tickets: 90,
        }
        jest.spyOn(RedisManager, 'get').mockResolvedValue(mockEvent)
        jest.spyOn(EventService.eventRepository, 'findOneBy').mockResolvedValue(null)

        const result = await EventService.getEventStatus(eventId)

        expect(result).toEqual({
            eventId,
            eventName: 'Sample Event',
            availableTickets: 10,
            totalTickets: 100,
            bookedTickets: 90,
            waitingListCount: expect.any(Number),
        })
    })

    it('should throw a not found error if event does not exist', async () => {
        jest.spyOn(RedisManager, 'get').mockResolvedValue(null)
        jest.spyOn(EventService, 'eventRepository', 'get').mockReturnValue({
            findOneBy: jest.fn().mockResolvedValue(null), // Mock function
        } as any)

        await expect(EventService.getEventStatus(3)).rejects.toThrow(
            CustomError.notFound(ResponseTypes.NON_EXISTENT_EVENT),
        )
    })
})
