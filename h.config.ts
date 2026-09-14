import { createHConfig } from '@eldon/h/infrastructure'

/**
 * Deployment configuration: one Hetzner server runs the blog behind Caddy,
 * and the kamagatos.com zone is managed by the infra stack (`:deployinfra`).
 * The records below reproduce everything the zone held before the stack
 * took it over: Google Workspace mail, the SES sending identity used by
 * m@kamagatos.com, and the compass host served from eldonlabs infrastructure.
 */
export const configs = {
    production: createHConfig({
        name: 'kamagatos',
        adminEmails: ['kamagatos@gmail.com'],
        servers: {
            kamagatosprod: {
                ip: '2.28.77.218'
            }
        },
        domains: [
            {
                domain: 'kamagatos.com',
                records: [
                    { name: 'kamagatos.com', serverName: 'kamagatosprod' },
                    { name: 'www.kamagatos.com', serverName: 'kamagatosprod' },
                    { name: 'compass.kamagatos.com', type: 'A', value: ['178.156.178.50'] },

                    // Gmail for Google Workspace.
                    { name: 'kamagatos.com', type: 'MX', value: ['1 smtp.google.com'] },
                    {
                        name: '_dmarc.kamagatos.com',
                        type: 'TXT',
                        value: ['"v=DMARC1; p=none; rua=mailto:m@kamagatos.com; ruf=mailto:m@kamagatos.com; fo=1"']
                    },

                    // SES sending identity (DKIM + custom MAIL FROM), set up outside the stack.
                    {
                        name: '7g623iohe6avcciuh2z4gzfcqgyfkqx2._domainkey.kamagatos.com',
                        type: 'CNAME',
                        value: ['7g623iohe6avcciuh2z4gzfcqgyfkqx2.dkim.amazonses.com']
                    },
                    {
                        name: 'dxkoura3qba2qrguvbxlitpw3ji4gbsr._domainkey.kamagatos.com',
                        type: 'CNAME',
                        value: ['dxkoura3qba2qrguvbxlitpw3ji4gbsr.dkim.amazonses.com']
                    },
                    {
                        name: 'xmrs7kyluq5xieznz5fy7dw2tiisxrys._domainkey.kamagatos.com',
                        type: 'CNAME',
                        value: ['xmrs7kyluq5xieznz5fy7dw2tiisxrys.dkim.amazonses.com']
                    },
                    { name: 'mail.kamagatos.com', type: 'MX', value: ['10 feedback-smtp.us-east-1.amazonses.com'] },
                    { name: 'mail.kamagatos.com', type: 'TXT', value: ['"v=spf1 include:amazonses.com ~all"'] }
                ]
            }
        ]
    })
}
