import express from 'express'
import AuthController from '../../module/auth/auth.controller'
import { decryptRequest } from './../../common/functionsUtils/functions'
import { IRoute } from '../../routes/route.interface'
import AuthValidator from '../../module/auth/auth.validator'

const router = express.Router()

router.post('/login', decryptRequest, AuthValidator.login, AuthController.login)

router.post('/create-account', AuthValidator.createAccount, AuthController.createAccount)

export default {
    router,
    path: 'auth',
} as IRoute
