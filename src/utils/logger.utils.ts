/* eslint-disable no-console */
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston'
import { Writable } from 'stream'

class Logger {
    private static instance: Logger
    private logger: WinstonLogger

    constructor(logLevel: string = 'warn', streams: Writable[] = []) {
        const winstonTransports = streams.map((stream) => new transports.Stream({ stream }))
        this.logger = createLogger({
            level: logLevel,
            format: format.combine(
                format.timestamp(),
                format.printf(({ timestamp, level, message, ...meta }) => {
                    const metaData = this.parseLoggingArgs(meta)
                    return `[${timestamp}] [${level.toUpperCase()}]: ${message} ${metaData}`
                }),
            ),
            transports: [...winstonTransports, new transports.Console()],
        })
    }

    private parseLoggingArgs(meta: any): string {
        const SPLAT = Symbol.for('splat')
        if (!meta || !meta[SPLAT]) {
            return ''
        }

        let metaData = ''
        const args: any[] = meta[SPLAT]

        for (const arg of args) {
            if (arg instanceof Error) {
                metaData += `${arg.toString()}\n${arg.stack}\n`
            } else if (typeof arg === 'object') {
                try {
                    metaData += `${JSON.stringify(arg, null, 2)}\n`
                } catch (error: any) {
                    console.log(error)
                    metaData += '[Circular or non-serializable object]\n'
                }
            } else if (arg) {
                metaData += `${arg}\n`
            }
        }

        return metaData
    }

    public log(message: string, ...args: any[]): void {
        this.logger.info(message, ...args)
    }

    public info(message: string, ...args: any[]): void {
        this.logger.info(message, ...args)
    }

    public warn(message: string, ...args: any[]): void {
        this.logger.warn(message, ...args)
    }

    public error(message: string, ...args: any[]): void {
        this.logger.error(message, ...args)
    }

    public static getInstance(logLevel?: string, streams?: Writable[]): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger(logLevel, streams)
        }
        return Logger.instance
    }

    public static updateConfig(logLevel: string, streams?: Writable[]): void {
        if (Logger.instance) {
            Logger.instance.logger.configure({
                level: logLevel,
                transports: [
                    ...(streams || []).map((stream) => new transports.Stream({ stream })),
                    new transports.Console(),
                ],
            })
        }
    }
}

export default Logger
