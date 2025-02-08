import bcrypt from 'bcrypt'

const MIN_LENGTH = 8
const MAX_LENGTH = 20
const REGEX_UPPERCASE = /[A-Z]/
const REGEX_LOWERCASE = /[a-z]/
const REGEX_NUMBER = /[0-9]/
const BCRYPT_SALT_ROUNDS = 10

export default class PasswordUtils {
    static validate(password: string): boolean {
        if (password.length < MIN_LENGTH || password.length > MAX_LENGTH) {
            return false
        }
        return (
            REGEX_UPPERCASE.test(password) &&
            REGEX_LOWERCASE.test(password) &&
            REGEX_NUMBER.test(password)
        )
    }

    static hash(password: string) {
        return bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    }

    static compare(password?: string, hash?: string) {
        if (!password || !hash) {
            return false
        }
        return bcrypt.compare(password, hash)
    }
}
