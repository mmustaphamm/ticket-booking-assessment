/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource, Repository } from 'typeorm'
import envs from './../../config/env'
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions'
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral'
import { EntityTarget } from 'typeorm/common/EntityTarget'
import DBLogger from './../../config/db/db.logger'
import { User } from './../../module/user/user.model'
import { EventModel } from './../../module/event/event.model'
import { WaitingList } from './../../module/wait-list/wait-list.model'
import { Booking } from './../../module/booking/booking.model'

const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_POOL_CONNECTION_LIMIT = 1000,
    DB_PORT,
    NODE_ENV,
} = envs

export interface PersistenceConfig {
    entities?: any[]
}

class PersistenceManager {
    private static _dataSource: DataSource

    static initialize({ entities = [] }: PersistenceConfig) {
        const options: DataSourceOptions = {
            type: 'mysql',
            port: Number(DB_PORT) as number,
            host: DB_HOST,
            username: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            synchronize: true, // please never turn this to true on prod
            logging: NODE_ENV !== 'production',
            entities: [User, EventModel, WaitingList, Booking],
            logger: new DBLogger(),
            migrations: [],
            subscribers: [],
            poolSize: Number(DB_POOL_CONNECTION_LIMIT) as number,
        }
        this._dataSource = new DataSource(options)
        return this._dataSource.initialize()
    }

    static isConnected() {
        return this._dataSource?.isInitialized || false
    }

    static async destroy() {
        if (!this._dataSource.isInitialized) {
            return
        }
        await this._dataSource.destroy()
    }

    static get dataSource() {
        return this._dataSource
    }

    static repository<T extends ObjectLiteral>(entity: EntityTarget<T>): Repository<T> {
        return this._dataSource.getRepository(entity)
    }
}

export default PersistenceManager
