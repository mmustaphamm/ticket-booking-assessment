import { ResponseTypes } from '../../utils/response.utils'
import { CustomError } from '../../common/errors/custom.error'
import { ValidationError } from 'joi'

export default class UserValidator {
    private static handleValidationError(error?: ValidationError) {
        if (error) {
            const { message } = error
            throw CustomError.badRequest(message as ResponseTypes)
        }
    }
}
