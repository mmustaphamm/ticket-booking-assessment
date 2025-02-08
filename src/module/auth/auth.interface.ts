export interface LoginDto {
    email?: string
    password?: string
}

export interface IAuthSession {
    user?: any
    token: string
    symmetricKey: string
}

export interface IEventSession {
    userId?: string
    event?: any
}

export interface ICreateAccount {
    email: string
    password: string
}

export const getAuthSessionKey = (userId: number) => `AuthSession_${userId}`
