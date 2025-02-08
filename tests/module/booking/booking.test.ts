import BookingController from '@app/module/booking/booking.controller'
import { Request, Response } from 'express'
import BookingService from '../../../src/module/booking/booking.service'
import { CustomError } from '@app/common/errors/custom.error'
import { HttpStatusCode } from 'axios'
import { Repository } from 'typeorm'
import { ResponseTypes } from '@app/utils/response.utils'
import { encryptResponse } from '@app/common/functionsUtils/functions'
import EventService from '@app/module/event/event.service'
import { EventModel } from '@app/module/event/event.model'

jest.mock('@app/module/booking/booking.service', () => ({
    BookingService: {
        bookTicket: jest.fn(),
    },
}))
jest.mock('@app/module/booking/booking.controller')
jest.mock('@app/common/functionsUtils/functions', () => ({
    encryptResponse: jest.fn(),
}))

// Define a custom type for the session property
interface MockRequest extends Partial<Request> {
    session: { user: { id: number } }
}

describe('Booking Controller - bookTicket', () => {
    let request: MockRequest
    let response: Partial<Response>
    let jsonMock: jest.Mock
    let statusMock: jest.Mock
    let mockEventRepository: jest.Mocked<Repository<EventModel>>

    beforeEach(() => {
        jsonMock = jest.fn()
        statusMock = jest.fn().mockReturnValue({ send: jsonMock })

        // Create a mock repository
        mockEventRepository = {
            findOneBy: jest.fn(),
            save: jest.fn(),
        } as unknown as jest.Mocked<Repository<EventModel>>

        // Use jest.spyOn to mock the static getter
        // ✅ Use Object.defineProperty to mock the getter
        Object.defineProperty(EventService, 'eventRepository', {
            get: jest.fn(() => mockEventRepository),
        })

        request = {
            body: { eventId: '123' },
            session: { user: { id: 1 } },
        }
        response = {
            status: statusMock,
        }
    })

    // test('should return a success response when booking is successful', async () => {
    //     const mockBookingResponse = {
    //         bookedTicket: { user_id: 'user_1', event_id: '1', status: 'booked' },
    //         message: 'Booking successful.',
    //     }
    //     ;(BookingService.bookTicket as jest.Mock).mockResolvedValue(mockBookingResponse)
    //     ;(encryptResponse as jest.Mock).mockReturnValue('encrypted_data')

    //     await BookingController.bookTicket(request as Request, response as Response)

    //     expect(BookingService.bookTicket).toHaveBeenCalledWith({ eventId: '1', id: 1 })
    //     expect(encryptResponse).toHaveBeenCalledWith({ result: mockBookingResponse })
    //     // expect(statusMock).toHaveBeenCalledWith(HttpStatusCode.Ok)
    //     // expect(jsonMock).toHaveBeenCalledWith(
    //     //     expect.objectContaining({
    //     //         code: HttpStatusCode.Ok,
    //     //         success: true,
    //     //         message: 'Booking successful.',
    //     //         data: 'encrypted_data',
    //     //     }),
    //     // )
    // })

    test('should throw an error when event does not exist', async () => {
        mockEventRepository.findOneBy.mockResolvedValue(null) // Simulate event not found

        await expect(BookingService.bookTicket({ eventId: '123', id: '1' })).rejects.toThrow(
            CustomError.badRequest(ResponseTypes.NON_EXISTENT_EVENT),
        )
    })
})
