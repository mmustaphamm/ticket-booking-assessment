import { faker } from '@faker-js/faker'
import { ICreateAccount } from '@app/module/auth/auth.interface'

export default class AuthMock {
    static async createAccount(props: Partial<ICreateAccount> = {}): Promise<ICreateAccount> {
        return {
            email: props.email ?? faker.internet.email(),
            password: props.password ?? faker.internet.password({ length: 8 }),
        }
    }
}
