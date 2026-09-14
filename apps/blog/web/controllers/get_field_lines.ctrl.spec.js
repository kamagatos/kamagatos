import { expect } from '@eldon/h/library/testing'
import { createTestUser } from '@eldon/h/server/testing'
import { syncStaticContentFolder } from '@eldon/h/server/blog'
import { blogContent } from '../constants.server.js'
import envs from '../envs.js'

let agent

describe('blog web', () => {
    beforeEach(async () => {
        agent = (await createTestUser({ host: `http://${envs.host}` })).agent
        // The test hooks truncate the database before each test; publish the content again.
        const syncResult = await syncStaticContentFolder(blogContent)
        expect(syncResult.error).toBe(undefined)
    })

    it('serves the orbit experiment', async () => {
        const res = await agent.get('/lab/field-lines')

        expect(res.status).toBe(200)
        expect(String(res.data).includes('Drawing with Orbits')).toBe(true)
    })

    it('serves the homepage, writing, evergreen pages and the feed from the markdown files', async () => {
        const home = await agent.get('/')
        expect(home.status).toBe(200)
        expect(String(home.data).includes('Attempt #n')).toBe(true)

        const post = await agent.get('/writing/attempt-n')
        expect(post.status).toBe(200)
        expect(String(post.data).includes('Another attempt at returning to blogging')).toBe(true)

        expect((await agent.get('/timeless-music-from-the-world')).status).toBe(200)
        expect((await agent.get('/about')).status).toBe(200)
        expect((await agent.get('/writing/nope')).status).toBe(404)

        const rss = await agent.get('/rss')
        expect(rss.status).toBe(200)
        expect(String(rss.data).includes('<title>Attempt #n</title>')).toBe(true)
    })
})
