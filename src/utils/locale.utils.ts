import fs from 'fs/promises'
import { ResponseTypes } from '../utils/response.utils'

export default class LocaleUtils {
    private static messages: Record<string, string> | undefined
    private static readonly MESSAGE_URI: string = './src/resources/locales/messages.json'

    static async get() {
        if (this.messages) {
            return this.messages
        }
        await this.load()
        return this.messages
    }

    static async load() {
        const file = await fs.readFile(this.MESSAGE_URI)
        this.messages = JSON.parse(file.toString('utf-8')) as Record<string, string>
        return this.messages
    }

    static resolve(type: ResponseTypes | any) {
        if (!this.messages || !this.messages[`${type}`]) {
            return ''
        }
        return this.messages[`${type}`]
    }
}
