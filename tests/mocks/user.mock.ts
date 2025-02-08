import { faker } from '@faker-js/faker'
import { User } from '@app/module/user/user.model'
import PasswordUtils from '@app/utils/password.utils'
import PersistenceManager from '@config/db'

export default class UserMock {
    private static async create(props: Partial<User> = {}): Promise<User> {
        const user = new User()
        user.email = props.email ?? faker.internet.email()

        const password = props.password ?? faker.internet.password({ length: 10 })
        user.password = await PasswordUtils.hash(password)

        return user
    }

    static async persistRand(): Promise<User> {
        const user = await this.create()
        const userRepository = PersistenceManager.repository(User)
        return userRepository.save<User>(user)
    }

    static async persistMany(size: number = 10): Promise<User[]> {
        const users = await Promise.all(Array.from({ length: size }, () => this.create()))
        return this.saveAll(users)
    }

    static async save(user: User): Promise<User> {
        const userRepository = PersistenceManager.repository(User)
        return userRepository.save<User>(user)
    }

    static async saveAll(users: User[]): Promise<User[]> {
        const userRepository = PersistenceManager.repository(User)
        return userRepository.save<User>(users)
    }

    static get email(): string {
        return faker.internet.email()
    }

    static get mobileNumber(): string {
        return faker.phone.number({ style: 'national' })
    }
}
