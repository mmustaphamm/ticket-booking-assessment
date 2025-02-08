import * as dotenv from 'dotenv'
import { ISms, IEmail } from './interface/notification.interface'
dotenv.config()

const emailConfig: IEmail = {
    service: process.env.EMAIL_SERVICE as string,
    host: process.env.EMAIL_HOST as string,
    port: Number(process.env.EMAIL_PORT) as number,
    isSecured: Boolean(process.env.EMAIL_IS_SECURED) as boolean,
    senderEmail: process.env.SENDER_EMAIL as string,
    senderPassword: process.env.SENDER_PASSWORD as string,
}

const smsConfig: ISms = {
    gateway: process.env.SMS_OPTION as string, // termii or habari
    termii: {
        name: 'termii',
        apiKey: process.env.TERMII_API_KEY as string,
        apiURL: process.env.TERMII_API_URL as string,
    },
    habari: {
        name: 'habari',
        apiURL: process.env.HABARI_API_URL as string,
        keyString: process.env.HABARI_KEY as string,
        ivString: process.env.HABARI_IV as string,
        clientId: process.env.HABARI_CLIENT_ID as string,
        userId: process.env.HABARI_USER_ID as string,
    },
}

export default {
    smsConfig,
    emailConfig,
}
