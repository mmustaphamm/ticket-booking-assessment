export interface IBooking {
    eventId?: string
}

export interface ICancel {
    ticketId?: string
    id?: number
}

export const getAuthSessionKey = (userId: number) => `AuthSession_${userId}`
export const getBookedTicketSessionKey = (bookingId: string) => `BookedTicketSession_${bookingId}`
