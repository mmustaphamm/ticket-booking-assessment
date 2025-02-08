import { HttpStatusCode } from 'axios'
import { ResponseTypes } from './../../utils/response.utils'

export type ICustomError = {
    code?: HttpStatusCode
    message?: string
    type?: any
    data?: any
    source?: Error
}

export class CustomError extends Error {
    private readonly _statusCode?: HttpStatusCode
    private readonly _source?: Error
    private readonly _data?: unknown
    private readonly _type?: ResponseTypes

    constructor(params: ICustomError) {
        const { code, message, type, data, source } = params
        super(message)
        this._statusCode = code
        this._source = source
        this._data = data
        this._type = type
    }

    get statusCode(): HttpStatusCode | undefined {
        return this._statusCode
    }

    get type(): ResponseTypes | undefined {
        return this._type
    }

    get data(): any {
        return this._data
    }

    get source(): Error | undefined {
        return this._source
    }

    toJSON() {
        return {
            message: this.message,
            statusCode: this._statusCode,
            type: this._type,
            data: this._data,
            source: this._source?.message,
            stack: this.stack,
        }
    }

    static internalServerError(
        source?: Error,
        type: ResponseTypes = ResponseTypes.INTERNAL_SERVER_ERROR,
    ) {
        return new CustomError({
            type,
            code: HttpStatusCode.InternalServerError,
            source,
        })
    }

    static forbidden(type: ResponseTypes, source?: Error, data?: any) {
        return new CustomError({
            type,
            code: HttpStatusCode.Forbidden,
            source,
            data,
        })
    }

    static notFound(type: ResponseTypes, source?: Error, data?: any) {
        return new CustomError({
            type,
            code: HttpStatusCode.NotFound,
            source,
            data,
        })
    }

    static unauthorized(type: ResponseTypes, source?: Error, data?: any) {
        return new CustomError({
            type,
            code: HttpStatusCode.Unauthorized,
            source,
            data,
        })
    }

    static badRequest(type: ResponseTypes, source?: Error, data?: any) {
        return new CustomError({
            type,
            code: HttpStatusCode.BadRequest,
            source,
            data,
        })
    }

    static validationError(type: ResponseTypes) {
        return new CustomError({
            type,
            code: HttpStatusCode.BadRequest,
        })
    }
}
