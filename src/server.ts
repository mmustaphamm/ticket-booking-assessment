import App from './index'
import PersistenceManager from './config/db'
import RedisManager from './config/redis'
import envs from './config/env'
import LocaleUtils from './utils/locale.utils'
import routes from './routes'
import models from './models'

const { PORT } = envs

const startServer = async () => {
    await PersistenceManager.initialize({ entities: models })
    RedisManager.initialize()
    await LocaleUtils.load()

    App.initialize({ apiPath: '/api/v1', routes, port: PORT, allowedOrigins: ['*'] })
    App.listen()
}

startServer()
