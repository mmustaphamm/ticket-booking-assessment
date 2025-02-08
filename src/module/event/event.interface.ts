export interface IEvents {
    name: string
    totalTickets: number
}

export const getEventSessionKey = (eventId: string) => `EventSession_${eventId}`
