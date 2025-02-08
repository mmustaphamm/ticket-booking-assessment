import PersistenceManager from './../../config/db'
import { User } from '../../module/user/user.model'

export default class UserService {
    static get userRepository() {
        return PersistenceManager.repository(User)
    }
}
