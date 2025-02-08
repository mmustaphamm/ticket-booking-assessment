import CryptoUtils from '@app/utils/crypto.utils'
import { Request, Response } from 'express'
import { CustomError } from '@app/common/errors/custom.error'
import { decryptRequest } from '@app/common/functionsUtils/functions'
import { HttpStatusCode } from 'axios'
import { ResponseTypes } from '@app/utils/response.utils'

describe('Auth middleware', () => {
    describe('Login auth middleware', () => {
        beforeAll(async () => {
            await CryptoUtils.keyPair()
        })
        test('given a request, when the Data is empty or missing, should throw an error', () => {
            const request = { body: { data: null } }
            const response = {}
            const next = jest.fn()
            expect.assertions(3)
            try {
                decryptRequest(request as Request, response as Response, next)
            } catch (e: any) {
                expect(e).toBeInstanceOf(CustomError)
                expect(e.statusCode).toBe(HttpStatusCode.BadRequest)
                expect(e.type).toBe(ResponseTypes.INVALID_OR_MISSING_DATA)
            }
        })

        test('given a request, when the data is invalid, should throw an error', () => {
            const symmetricKey = CryptoUtils.randomBytes().toString('base64')
            const encKey = CryptoUtils.asymmetricEncrypt(symmetricKey)
            const request = { body: { key: encKey, data: 'random_data' } }
            const response = {}
            const next = jest.fn()
            expect.assertions(3)
            try {
                decryptRequest(request as Request, response as Response, next)
            } catch (e: any) {
                expect(e).toBeInstanceOf(CustomError)
                expect(e.statusCode).toBe(HttpStatusCode.BadRequest)
                expect(e.type).toBe(ResponseTypes.DATA_DECRYPTION_FAILED)
            }
        })
    })
})
