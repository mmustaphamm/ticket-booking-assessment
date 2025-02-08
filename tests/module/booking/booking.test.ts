import { Request, Response } from 'express'
import BookingController from '@app/module/booking/booking.controller'
import BookingService from '@app/module/booking/booking.service'

jest.mock('@app/module/booking/booking.controller', () => ({
    bookTicket: jest.fn(),
}))

describe('BookingController', () => {
    describe('BookingController', () => {
        let mockRequest: Partial<Request>
        let mockResponse: Partial<Response>
        let statusMock: jest.Mock
        let sendMock: jest.Mock

        beforeEach(() => {
            statusMock = jest.fn().mockReturnThis()
            sendMock = jest.fn()

            mockRequest = {
                body: { eventId: '123' },
                session: { user: { id: 'user-1' } },
            } as Partial<Request>

            mockResponse = {
                status: statusMock,
                send: sendMock,
            } as Partial<Response>
        })

        it('should successfully book a ticket', async () => {
            const mockResult = { message: 'Booking successful.', bookedTicket: {} }

            // ✅ Correctly spy on the static method
            const bookTicketSpy = jest
                .spyOn(BookingService, 'bookTicket')
                .mockResolvedValue(mockResult)

            // ✅ Call the controller method
            await BookingController.bookTicket(mockRequest as Request, mockResponse as Response)

            // ✅ Ensure `bookTicket` was called once
            expect(bookTicketSpy).toHaveBeenCalledTimes(1)
            expect(bookTicketSpy).toHaveBeenCalledWith('123', 'user-1')

            // ✅ Ensure response is returned correctly
            expect(statusMock).toHaveBeenCalledWith(200)
            expect(sendMock).toHaveBeenCalledWith({
                code: 200,
                success: true,
                message: mockResult.message,
                data: mockResult.bookedTicket,
            })

            bookTicketSpy.mockRestore() // Cleanup
        })
    })

    describe('cancelTicket', () => {
        // it('should cancel a ticket successfully', async () => {
        //     const req = mockRequest({ ticketId: '789' })
        //     const res = mockResponse()
        //     const cancelResult = { message: 'Booking canceled successfully.' }
        //     ;(BookingService.cancelTicket as jest.Mock).mockResolvedValue(cancelResult)
        //     await BookingController.cancelTicket(req, res)
        //     expect(BookingService.cancelTicket).toHaveBeenCalledWith({ ticketId: '789', id: '123' })
        //     expect(res.status).toHaveBeenCalledWith(HttpStatusCode.Ok)
        //     expect(res.send).toHaveBeenCalledWith(
        //         CustomResponse.build({
        //             code: HttpStatusCode.Ok,
        //             success: true,
        //             message: '',
        //             data: expect.any(String),
        //         }),
        //     )
        // })
        // it('should handle errors', async () => {
        //     const req = mockRequest({ ticketId: '789' })
        //     const res = mockResponse()
        //     ;(BookingService.cancelTicket as jest.Mock).mockRejectedValue(
        //         new Error(ResponseTypes.INTERNAL_SERVER_ERROR),
        //     )
        //     await expect(BookingController.cancelTicket(req, res)).rejects.toThrow(
        //         CustomError.internalServerError(ResponseTypes.NON_EXISTENT_EVENT),
        //     )
        // })
    })
})
