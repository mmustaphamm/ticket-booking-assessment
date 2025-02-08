import PersistenceManager from './../../config/db'
import { WaitingList } from './wait-list.model'

export class WaitListService {
    static get waitingListRepository() {
        return PersistenceManager.repository(WaitingList)
    }
}
