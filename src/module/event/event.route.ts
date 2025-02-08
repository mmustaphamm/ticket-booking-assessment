import { Router } from 'express'
import EventController from './event.controller'
import { IRoute } from '../../routes/route.interface'
import EventValidator from './event.validator'
import { decryptRequest } from './../../common/functionsUtils/functions'
import { authMiddleware } from '../auth/auth.middleware'
import BookingValidator from '../booking/booking.validator'
import BookingController from '../booking/booking.controller'

const router = Router()

router.get('/status/:eventId', authMiddleware, EventController.getEventStatus)

router.post(
    '/initialize',
    authMiddleware,
    decryptRequest,
    EventValidator.initializeEventValidator,
    EventController.initialize,
)

router.post(
    '/book',
    authMiddleware,
    decryptRequest,
    BookingValidator.bookTicket,
    BookingController.bookTicket,
)

router.post(
    '/cancel',
    authMiddleware,
    decryptRequest,
    BookingValidator.cancelTicket,
    BookingController.cancelTicket,
)

export default {
    router,
    path: 'events',
} as IRoute
