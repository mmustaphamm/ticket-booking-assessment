/* eslint-disable no-console */
import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { HttpStatusCode } from 'axios'
import PersistenceManager from './config/db'
import RedisManager from './config/redis'
import CustomResponse, { ResponseTypes } from './utils/response.utils'
import { IRoute } from './routes/route.interface'
import 'express-async-errors'
import { errorMiddleware } from './middleware/error.middleware'
import httpLogger from './loader/logging/http'

export type AppAttributes = {
    port: number
    apiPath: string
    allowedOrigins: string[]
    routes: IRoute[]
}

class App {
    private static app: Application
    private static port: number
    private static apiPath: string

    static initialize({ port, allowedOrigins, apiPath, routes }: AppAttributes) {
        this.app = express()
        this.port = port
        this.apiPath = apiPath
        this.middlewareInitializer(allowedOrigins)
        this.routeInitializer(routes)
        this.app.use(errorMiddleware)
    }

    private static middlewareInitializer(allowedOrigins: string[]) {
        this.app.set('trust proxy', true) // trust the headers added by the proxy
        this.app.use(compression())
        this.app.use(express.json())
        this.app.use(helmet())
        this.app.use(
            cors({
                origin: allowedOrigins,
            }),
        )
        this.app.use(httpLogger)
        this.app.use(express.urlencoded({ extended: true }))
    }

    private static routeInitializer(routes: IRoute[]) {
        routes.forEach((route) => {
            if (route.path && route.path[route.path.length - 1] === '/') {
                throw new Error('Hello developer, remove the trailing slash in your path')
            }
            this.app.use(`${this.apiPath}/${route.path}`, route.router)
        })
        this.app.get('/', (req, res) => {
            res.status(HttpStatusCode.Ok).send(
                CustomResponse.build({
                    code: HttpStatusCode.Ok,
                    message: '',
                    success: true,
                }),
            )
        })

        this.app.get('/status', (req, res) => {
            res.status(HttpStatusCode.Ok).send(
                CustomResponse.build({
                    code: HttpStatusCode.Ok,
                    message: '',
                    success: true,
                    data: {
                        isDatabaseActive: PersistenceManager.isConnected(),
                        isRedisActive: RedisManager.isConnected(),
                    },
                }),
            )
        })

        this.app.all('*', (req, res) => {
            res.status(HttpStatusCode.NotFound).send(
                CustomResponse.build({
                    code: HttpStatusCode.NotFound,
                    message: '',
                    success: false,
                    type: ResponseTypes.ROUTE_NOT_FOUND,
                }),
            )
        })
    }

    static listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on ${this.port}\n`)
        })
    }
}

export default App
