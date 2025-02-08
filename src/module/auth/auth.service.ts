import { ICreateAccount, LoginDto } from '../../module/auth/auth.interface'
import { CustomError } from '../../common/errors/custom.error'
import { ResponseTypes } from '../../utils/response.utils'
import PasswordUtils from '../../utils/password.utils'
import JwtUtils from '../../utils/jwt.utils'
import PersistenceManager from './../../config/db'
import { User } from '../../module/user/user.model'

export default class AuthService {
    static get userRepository() {
        return PersistenceManager.repository(User)
    }

    static async login(loginDto: LoginDto) {
        const { email, password } = loginDto

        const user = await AuthService.userRepository.findOneBy({
            email,
        })

        if (!user) {
            throw CustomError.notFound(ResponseTypes.USER_NOT_FOUND)
        }

        if (!PasswordUtils.compare(password, user.password)) {
            throw CustomError.forbidden(ResponseTypes.INVALID_NUMBER_OR_PASSWORD)
        }

        const userDto = user.toDTO<User>(['password'])

        const token = JwtUtils.generateToken({ userId: user.id })
        return {
            user: userDto,
            token,
        }
    }

    static async createAccount(data: ICreateAccount): Promise<string> {
        const { email, password } = data

        const savedUser = await AuthService.userRepository.findOneBy({
            email,
        })

        if (savedUser) {
            throw CustomError.badRequest(ResponseTypes.EMAIL_ALREADY_EXISTS)
        }

        await this.saveData({
            email,
            password: await PasswordUtils.hash(password),
        })
        return 'User account successfully created'
    }

    static async saveData(data) {
        let user = AuthService.userRepository.create(data)

        const runner = PersistenceManager.dataSource.createQueryRunner()
        await runner.startTransaction()
        try {
            user = await AuthService.userRepository.save(user)
            await runner.commitTransaction()
            return user[0]
        } catch (e: any) {
            await runner.rollbackTransaction()
            await runner.release()

            if (e instanceof CustomError) {
                throw e
            }
            throw CustomError.internalServerError(e)
        }
    }
}
