import { NextFunction, Request, Response } from 'express'
import { CustomError } from './../common/errors/custom.error'
import { HttpStatusCode } from 'axios'
import CustomResponse, { ResponseTypes } from './../utils/response.utils'
import Logger from './../utils/logger.utils'

export const errorMiddleware = async (
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) => {
    if (err instanceof CustomError) {
        const { statusCode = HttpStatusCode.InternalServerError } = err

        if (statusCode !== HttpStatusCode.InternalServerError) {
            Logger.getInstance().info(err.message, err)
            return res.status(<number>statusCode).send(
                CustomResponse.build({
                    code: statusCode,
                    type: err.type,
                    data: err.data,
                    success: false,
                }),
            )
        }
    }
    Logger.getInstance().error(err.message, err)
    res.status(HttpStatusCode.InternalServerError).send(
        CustomResponse.build({
            code: HttpStatusCode.InternalServerError,
            success: false,
            type: ResponseTypes.INTERNAL_SERVER_ERROR,
        }),
    )
}
