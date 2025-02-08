import { config } from 'dotenv'

export const CURRENT_DIR = `${process.cwd()}`
const ENV_FILE_PATH = `${CURRENT_DIR}/.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`
config({ path: ENV_FILE_PATH })

const envs: any = process.env

const NODE_ENV = `${envs.NODE_ENV}`

const requiredVariables = [
    'PORT',
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'DB_POOL_CONNECTION_LIMIT',
    'DB_PORT',
]

const missingVariables: any = []

requiredVariables.forEach((key) => {
    if (envs[key]) {
        envs[key] = envs[key]
    } else {
        missingVariables.push(key)
    }
})

if (missingVariables.length !== 0) {
    throw new Error(
        `Some compulsory environment variables are missing ${missingVariables.toString()}`,
    )
}

export const isDevelopment = () => {
    return NODE_ENV === 'dev' || NODE_ENV === 'development'
}

export const isProduction = () => {
    return NODE_ENV === 'production' || NODE_ENV === 'prod'
}

export const isStaging = () => {
    return NODE_ENV === 'staging'
}

export const isTest = () => {
    return NODE_ENV === 'test'
}

export default envs
