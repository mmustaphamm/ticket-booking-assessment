/* eslint-disable no-console */
import Redis, { Redis as RedisClient } from 'ioredis'

/**
 * https://www.npmjs.com/package/ioredis
 */
class RedisManager {
    private static _client: RedisClient

    static initialize() {
        this._client = new Redis()

        this._client?.on('connect', () => {
            console.log('Redis client is initiating a connection to the server.')
        })

        this._client?.on('ready', () => {
            console.log('Redis client successfully initiated connection to the server.')
        })

        this._client?.on('reconnecting', () => {
            console.log('Redis client is trying to reconnect to the server...')
        })

        this._client?.on('error', (err) => console.log('Redis Client Error', err))
    }

    static isConnected() {
        return this._client.status === 'ready'
    }

    static disconnect() {
        if (this.isConnected()) {
            return this._client.quit()
        }
    }

    static async del(key: string): Promise<void> {
        await this._client.del(key)
    }

    static async get<T>(key: string): Promise<T | null> {
        const data = await this._client.get(key)
        if (data) {
            try {
                return JSON.parse(data) as T
            } catch {
                return data as unknown as T
            }
        }
        return null
    }

    static async set<T>(key: string, value: T, expirationSeconds: number = -1): Promise<void> {
        const data =
            typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)

        await this._client.set(key, data, 'EX', expirationSeconds)
    }

    static async hSet<T>(
        key: string,
        field: string,
        value: T,
        expirationSeconds: number = -1,
    ): Promise<void> {
        const data =
            typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)

        await this._client.hset(key, field, data, 'EX', expirationSeconds)
    }

    static async hSetAll<T>(
        key: string,
        fieldValues: Record<string, T>,
        expirationSeconds: number = -1,
    ): Promise<void> {
        const values: Record<string, number | string> = {}
        for (const [field, value] of Object.entries(fieldValues)) {
            values[field] = typeof value === 'object' ? JSON.stringify(value) : String(value)
        }
        values['EX'] = expirationSeconds
        await this._client.hset(key, values)
    }

    static async hGet<T>(key: string, field: string): Promise<T | null> {
        const data = await this._client.hget(key, field)
        if (data) {
            try {
                return JSON.parse(data) as T
            } catch {
                return data as unknown as T
            }
        }
        return null
    }

    static async hGetAll<T>(key: string): Promise<Record<string, T>> {
        const fieldValues = await this._client.hgetall(key)
        const values: Record<string, T> = {}
        for (const [field, value] of Object.entries(fieldValues)) {
            if (value) {
                try {
                    values[field] = JSON.parse(value as string) as T
                } catch {
                    values[field] = value as T
                }
            }
        }
        return values
    }

    static async update<T>(
        key: string,
        value: T,
        defaultExpirationSeconds: number = -1,
    ): Promise<void> {
        let ttl: number = await this._client.ttl(key)
        if (ttl === -2) {
            ttl = defaultExpirationSeconds
        }
        await this.set(key, value, ttl)
    }
}

export default RedisManager
