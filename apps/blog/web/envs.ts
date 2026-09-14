import { getEnvs } from '@eldon/h/server/envs'

const envs = getEnvs()

export default {
    db: envs.global.APP_DB || '',
    port: parseInt(envs.blogweb.PORT, 10) || 8080,
    host: envs.blogweb.HOST,
    apiEndpoint: envs.blogweb.API_ENDPOINT || '',
    appEndpoint: envs.blogweb.APP_ENDPOINT || '',
    staticEndpoint: envs.blogweb.STATIC_ENDPOINT || '',
    loggerDb: envs.global.APP_LOGS_DB
}
