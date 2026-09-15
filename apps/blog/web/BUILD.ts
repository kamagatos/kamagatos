import { AppType } from '@eldon/h'
import { SEC_MS } from '@eldon/h/library/date'
import { getAppTasks, runTestsTask, applyDbSchemaTask } from '@eldon/h/tasks'
import envs from './envs.js'

const {
    server: serverTasks,
    build,
    release,
    deploy
} = getAppTasks({
    type: AppType.WEBSITE,
    servers: [
        {
            path: 'apps/blog/web/server.ts',
            previewPaths: [{ url: '/' }, { url: '/lab/field-lines' }],
            // Content is published at server start, so a changed post restarts the server too.
            watch: ['**/apps/blog/web/**/*.ts*', '**/apps/blog/content/**/*.md']
        }
    ],
    cssFiles: [
        {
            file: 'apps/blog/web/public/css/vars.scss',
            watch: ['**/apps/blog/web/**/*.scss']
        },
        {
            file: 'apps/blog/web/public/css/blog_page_web_client.scss',
            watch: ['**/apps/blog/web/**/*.scss']
        },
        {
            file: 'apps/blog/web/public/css/field_lines.page.scss',
            watch: ['**/apps/blog/web/**/*.scss']
        }
    ],
    images: [{ file: 'apps/blog/web/public/images/**/*' }],
    jsFiles: [
        {
            file: 'apps/blog/web/public/js/blog_homepage_web_client.tsx',
            staticEndpoint: envs.staticEndpoint,
            watch: ['**/apps/blog/web/**/*.ts*']
        },
        {
            file: 'apps/blog/web/public/js/blog_page_web_client.tsx',
            staticEndpoint: envs.staticEndpoint,
            watch: ['**/apps/blog/web/**/*.ts*']
        },
        {
            file: 'apps/blog/web/public/js/field_lines.page.tsx',
            staticEndpoint: envs.staticEndpoint,
            watch: ['**/apps/blog/web/**/*.ts*']
        }
    ]
})

export const server = serverTasks
export { build, release, deploy }

/**
 * Creates or updates the app's database tables.
 * Usage: h run apps/blog/web:apply_db_schema --server_name=kamagatosprod --env=production
 */
export const apply_db_schema = [applyDbSchemaTask({})]

export const all_tests = [
    runTestsTask({
        folder: 'apps/blog/web/controllers',
        // The framework's jsdom bootstrap backs the test agent's requests.
        require: ['core/webclient/testing/bootstrap.js'],
        hooks: ['apps/blog/web/tests/before_api.js'],
        timeoutMs: 30 * SEC_MS
    })
]
