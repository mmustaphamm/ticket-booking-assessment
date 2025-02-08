import { HttpStatusCode } from 'axios'
import LocaleUtils from '../utils/locale.utils'

export enum ResponseTypes {
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    INVALID_OR_MISSING_DATA = 'INVALID_OR_MISSING_DATA',
    INVALID_EVENTS_DATA = 'INVALID_EVENT_NAME_OR_TICKET_COUNT',
    INVALID_OR_MISSING_ENCRYPTION_KEY = 'INVALID_OR_MISSING_ENCRYPTION_KEY',
    KEY_DECRYPTION_FAILED = 'KEY_DECRYPTION_FAILED',
    DATA_DECRYPTION_FAILED = 'DATA_DECRYPTION_FAILED',
    INVALID_AUTH_TOKEN = 'INVALID_AUTH_TOKEN',
    NO_SESSION_FOUND_FOR_USER = 'NO_SESSION_FOUND_FOR_USER',
    USER_NOT_VERIFIED = 'USER_NOT_VERIFIED',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
    INVALID_NUMBER_OR_PASSWORD = 'INVALID_NUMBER_OR_PASSWORD',
    INVALID_PASSWORD = 'INVALID_PASSWORD',
    INVALID_EMAIL = 'INVALID_EMAIL',
    INVALID_EVENT = 'INVALID_EVENT',
    NON_EXISTENT_EVENT = 'EVENT_DOES_NOT_EXIST',
    TICKET_DOES_NOT_EXIST = 'TICKET_DOES_NOT_EXIST',
    USER_SESSION_NOT_FOUND = 'USER_SESSION_NOT_FOUND',
    ROUTE_NOT_FOUND = 'ROUTE_NOT_FOUND',
    DUPLICATE_EVENT = 'EVENT WITH THAT NAME EXIST AND STILL ACTIVE',
}

export interface IResponse<T> {
    data?: T
    type?: ResponseTypes
    success: boolean
    code: HttpStatusCode
    message?: string
    err?: any
}

class CustomResponse {
    static build<T>(response: IResponse<T>) {
        const message = LocaleUtils.resolve(response.type)
        return {
            ...response,
            message,
        }
    }
}

export default CustomResponse
