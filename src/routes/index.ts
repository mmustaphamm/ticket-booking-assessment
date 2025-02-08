import { IRoute } from './../routes/route.interface'
import authRoute from './../module/auth/auth.route'
import userRoute from '../module/user/user.route'
import eventsRoute from '../module/event/event.route'

const routes: IRoute[] = [authRoute, userRoute, eventsRoute]

export default routes
