import { AppType, ConfigurationSet } from '@eldon/h'
import { isError } from '@eldon/h/library/general'
import { HttpMethods, Route } from '@eldon/h/server/http'
import { getBlogRoutes, syncStaticContentFolder } from '@eldon/h/server/blog'
import { createWebClientApi } from '@eldon/h/clients/web/server'
import envs from './envs.js'
import manifest from './manifest.json' with { type: 'json' }
import { blogContent } from './constants.server.js'
import { blogPaths } from './constants.client.js'
import getFieldLinesCtrl from './controllers/get_field_lines.ctrl.js'

const { GET } = HttpMethods

const routes: Route[] = [
    // Interactive essays are React pages with their own assets, so they are
    // declared before the blog's catch-all page route.
    {
        type: AppType.WEBSITE,
        method: GET,
        path: `${blogPaths.lab}/field-lines`,
        title: 'Drawing with Orbits',
        description: 'A tiny interactive sketch about attraction, momentum, and paths.',
        cssFiles: ['/public/css/field_lines.page.css'],
        jsFiles: ['/public/js/field_lines.page.js'],
        handlers: [getFieldLinesCtrl]
    },
    // Homepage, /page/:n, /rss, /editor and every markdown page (writing, evergreen pages, about).
    ...getBlogRoutes({ blog: { appName: manifest.name, pathPrefix: '' } })
]

export default createWebClientApi({
    name: manifest.name,
    appCommonName: manifest.appCommonName,
    version: manifest.deployedVersion,
    basePath: 'apps/blog/web',
    routes,
    hosts: [envs.host],
    keywords: 'blog, essays, experiments',
    description: 'Notes, essays, and small experiments.',
    staticEndpoint: envs.staticEndpoint,
    apiEndpoint: envs.apiEndpoint,
    appEndpoint: envs.appEndpoint,
    port: envs.port,
    configurationSet: ConfigurationSet.GLOBAL,
    models: [],
    emailLogoUrl: '',
    async onSignup() {
        return { data: {} }
    },
    async onServerStart() {
        // The markdown files under apps/blog/content are the source of truth:
        // publish them into the static content models on every start.
        const syncResult = await syncStaticContentFolder(blogContent)
        if (isError(syncResult)) {
            return syncResult
        }

        return { data: {} }
    },
    async onServerStop() {
        return { data: {} }
    }
})
