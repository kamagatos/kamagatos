import { EldonDb } from '@eldon/h/library/db'
import { addGlobalHooks } from '@eldon/h/library/testing'
import { startHttpServer } from '@eldon/h/server/http'
import serverConfig from '../server_config.js'
import envs from '../envs.js'

addGlobalHooks([envs.db || '', envs.loggerDb || ''])

let server
before('starting the http server', async () => {
    const db = new EldonDb(envs.db || '')
    await db.connect()

    server = await startHttpServer({
        version: '1',
        db: envs.db || '',
        loggerDb: envs.loggerDb || '',
        port: envs.port,
        auth: {},
        ...serverConfig
    })
})

after('stopping the http server', async () => {
    await server.data?.stop()
})
