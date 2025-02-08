const mockCache: Record<string, any> = {}

export const RedisManagerMock = {
    isConnected: jest.fn(() => true),
    initialize: jest.fn(() => Promise.resolve()),
    disconnect: jest.fn(() => Promise.resolve()),

    get: jest.fn(async (key: string) => {
        const entry = mockCache[key]
        if (!entry) return null

        if (entry.expiresAt && entry.expiresAt < Date.now()) {
            delete mockCache[key]
            return null
        }
        return JSON.parse(entry.value)
    }),

    set: jest.fn(async (key: string, value: unknown, expirationSeconds: number = -1) => {
        const expiresAt = expirationSeconds > 0 ? Date.now() + expirationSeconds * 1000 : null
        mockCache[key] = { value: JSON.stringify(value), expiresAt }
    }),

    del: jest.fn(async (key: string) => {
        delete mockCache[key]
    }),

    update: jest.fn(async (key: string, value: unknown, defaultExpirationSeconds: number = -1) => {
        const existingTtl = mockCache[key]?.expiresAt
            ? (mockCache[key]!.expiresAt - Date.now()) / 1000
            : defaultExpirationSeconds

        const ttl = existingTtl > 0 ? existingTtl : defaultExpirationSeconds
        const expiresAt = ttl > 0 ? Date.now() + ttl * 1000 : null

        mockCache[key] = { value: JSON.stringify(value), expiresAt }
    }),

    hSet: jest.fn(
        async (key: string, field: string, value: unknown, expirationSeconds: number = -1) => {
            if (!mockCache[key]) {
                mockCache[key] = {}
            }
            const data =
                typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)
            mockCache[key][field] = data

            if (expirationSeconds > 0) {
                const expiresAt = Date.now() + expirationSeconds * 1000
                mockCache[key].expiresAt = expiresAt
            }
        },
    ),

    hSetAll: jest.fn(
        async (
            key: string,
            fieldValues: Record<string, unknown>,
            expirationSeconds: number = -1,
        ) => {
            if (!mockCache[key]) {
                mockCache[key] = {}
            }
            for (const [field, value] of Object.entries(fieldValues)) {
                const data =
                    typeof value === 'object' && value !== null
                        ? JSON.stringify(value)
                        : String(value)
                mockCache[key][field] = data
            }

            if (expirationSeconds > 0) {
                const expiresAt = Date.now() + expirationSeconds * 1000
                mockCache[key].expiresAt = expiresAt
            }
        },
    ),

    hGet: jest.fn(async (key: string, field: string) => {
        const hash = mockCache[key]
        if (!hash) return null

        const value = hash[field]
        if (!value) return null

        try {
            return JSON.parse(value)
        } catch {
            return value
        }
    }),

    hGetAll: jest.fn(async (key: string) => {
        const hash = mockCache[key]
        if (!hash) return {}

        const result: Record<string, unknown> = {}
        for (const [field, value] of Object.entries(hash)) {
            if (field === 'expiresAt') continue

            try {
                result[field] = JSON.parse(value as string)
            } catch {
                result[field] = value
            }
        }
        return result
    }),
}
