import crypto from 'crypto'
import { promisify } from 'util'

export type AsymmetricKeyPair = {
    publicKey: string
    privateKey: string
}

export enum CryptoErrorTypes {
    MISSING_KEY_PAIR = 'MISSING_KEY_PAIR',
    ASYMMETRIC_DECRYPTION_FAILED = 'ASYMMETRIC_DECRYPTION_FAILED',
    SYMMETRIC_DECRYPTION_FAILED = 'SYMMETRIC_DECRYPTION_FAILED',
    INVALID_SYMMETRIC_DATA_FORMAT = 'INVALID_SYMMETRIC_DATA_FORMAT',
}

export class CryptoError extends Error {
    errType: CryptoErrorTypes
    originalError?: Error

    constructor(errType: CryptoErrorTypes, originalError?: Error) {
        super(`${errType}: ${originalError?.message}`)
        this.errType = errType
        this.originalError = originalError
        if (originalError?.stack) {
            this.stack = originalError.stack
        }
    }
}

export default class CryptoUtils {
    private static _keyPair: AsymmetricKeyPair | null = null

    static async keyPair(): Promise<AsymmetricKeyPair> {
        const generateKeyPairAsync = promisify(crypto.generateKeyPair)
        this._keyPair = (await generateKeyPairAsync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
        })) as AsymmetricKeyPair

        return this._keyPair
    }

    static asymmetricDecrypt(data: string): string {
        if (!this._keyPair || !this._keyPair.privateKey) {
            throw new CryptoError(CryptoErrorTypes.MISSING_KEY_PAIR)
        }

        try {
            const buffer = Buffer.from(data, 'base64')
            return crypto.privateDecrypt(this._keyPair.privateKey, buffer).toString('utf-8')
        } catch (err: any) {
            throw new CryptoError(CryptoErrorTypes.ASYMMETRIC_DECRYPTION_FAILED, err)
        }
    }

    static get publicKey(): string {
        if (!this._keyPair || !this._keyPair.publicKey) {
            throw new CryptoError(CryptoErrorTypes.MISSING_KEY_PAIR)
        }
        return this._keyPair.publicKey
    }

    static get privateKey(): string {
        if (!this._keyPair || !this._keyPair.privateKey) {
            throw new CryptoError(CryptoErrorTypes.MISSING_KEY_PAIR)
        }
        return this._keyPair.privateKey
    }

    static symmetricDecrypt(key: string, data: string): string {
        const [iv, encryptedData] = data.split(':')
        if (!iv || !encryptedData) {
            throw new CryptoError(CryptoErrorTypes.INVALID_SYMMETRIC_DATA_FORMAT)
        }
        try {
            const decipher = crypto.createDecipheriv(
                'aes-256-cbc',
                Buffer.from(key, 'base64'),
                Buffer.from(iv, 'base64'),
            )
            let decrypted = decipher.update(encryptedData, 'base64', 'utf-8')
            decrypted += decipher.final('utf-8')
            return decrypted
        } catch (err: any) {
            throw new CryptoError(CryptoErrorTypes.SYMMETRIC_DECRYPTION_FAILED, err)
        }
    }

    static randomBytes(length: number = 32) {
        return crypto.randomBytes(length)
    }

    static asymmetricEncrypt(data: string) {
        if (!this._keyPair || !this._keyPair.publicKey) {
            throw new CryptoError(CryptoErrorTypes.MISSING_KEY_PAIR)
        }

        const buffer = Buffer.from(data, 'utf-8')
        return crypto.publicEncrypt(this._keyPair.privateKey, buffer).toString('base64')
    }

    static symmetricEncrypt(key: string, data: any) {
        const iv = crypto.randomBytes(16)
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'base64'), iv)
        let encrypted = cipher.update(data, 'utf8', 'base64')
        encrypted += cipher.final('base64')
        return `${iv.toString('base64')}:${encrypted}`
    }
}
