import { createHConfig } from '@eldon/h/infrastructure'

/**
 * Deployment configuration. No server is provisioned yet: add one with
 * `h run core/tasks/ops:provision_server` from the eldonlabs/h repository, list it under
 * `servers` and deploy with `h run apps/blog/web:deploy --env=production`.
 */
export const configs = {
    production: createHConfig({
        name: 'kamagatos',
        adminEmails: ['kamagatos@gmail.com'],
        servers: {},
        domains: []
    })
}
