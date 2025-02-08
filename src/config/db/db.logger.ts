import { Logger } from 'typeorm'
import DefaultLogger from '../../utils/logger.utils'

export default class DBLogger implements Logger {
    private logger: DefaultLogger
    constructor(logLevel = 'info') {
        this.logger = new DefaultLogger(logLevel)
    }

    logQuery(query: string, parameters?: any[]): void {
        this.logger.info('QUERY', query, parameters)
    }

    logQueryError(error: string, query: string, parameters?: any[]): void {
        this.logger.error('QUERY ERROR', error, query, parameters)
    }

    logQuerySlow(time: number, query: string, parameters?: any[]): void {
        this.logger.warn('SLOW QUERY', `Execution time: ${time}ms`, query, parameters)
    }

    logSchemaBuild(message: string): void {
        this.logger.info('SCHEMA BUILD', message)
    }

    logMigration(message: string): void {
        this.logger.info('MIGRATION', message)
    }

    log(level: 'log' | 'info' | 'warn' | 'error', message: any): void {
        this.logger.log(level, message)
    }
}
