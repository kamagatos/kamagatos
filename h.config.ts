import { createHConfig } from '@eldon/h/infrastructure'

/**
 * Deployment configuration: one Hetzner server runs the blog behind Caddy.
 * The infra stack (`:deployinfra`) owns the kamagatos.com zone, the SES
 * sending identity used by m@kamagatos.com (DKIM and mail.* records come
 * from `enableSendingEmails`) and the `kamagatos` static assets bucket.
 */
export const configs = {
    production: createHConfig({
        name: 'kamagatos',
        // Also the DMARC report address the stack derives for the domain.
        adminEmails: ['m@kamagatos.com'],
        servers: {
            kamagatosprod: {
                ip: '2.28.77.218'
            }
        },
        domains: [
            {
                domain: 'kamagatos.com',
                emails: {
                    enableSendingEmails: true
                },
                records: [
                    { name: 'kamagatos.com', serverName: 'kamagatosprod' },
                    { name: 'www.kamagatos.com', serverName: 'kamagatosprod' },
                    // Served from eldonlabs infrastructure.
                    { name: 'compass.kamagatos.com', type: 'A', value: ['178.156.178.50'] },
                    // Gmail for Google Workspace.
                    { name: 'kamagatos.com', type: 'MX', value: ['1 smtp.google.com'] }
                ]
            }
        ]
    })
}
