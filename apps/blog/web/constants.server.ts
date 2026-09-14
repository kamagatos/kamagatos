import { SyncStaticContentFolderOptions } from '@eldon/h/server/blog'
import manifest from './manifest.json' with { type: 'json' }
import { blogPaths } from './constants.client.js'

/**
 * How the markdown files under apps/blog/content become the site's pages:
 * `posts/` is dated writing, `pages/` are evergreen pages at the root, and
 * files at the root of the folder (about.md) are pages too.
 */
export const blogContent: SyncStaticContentFolderOptions = {
    appName: manifest.name,
    contentFolder: 'apps/blog/content',
    authorid: 'mkamagate',
    pathPrefixes: {
        posts: blogPaths.writing,
        pages: blogPaths.pages,
        experiments: blogPaths.lab
    },
    metadata: {
        title: manifest.appCommonName,
        description: 'Notes, essays, and small experiments.',
        shortDescription: 'Notes, essays, and small experiments.',
        headerLinks: [
            { id: 'writing', label: 'Writing', url: '/' },
            { id: 'timeless', label: 'Timeless', url: '/timeless-music-from-the-world' },
            { id: 'lab', label: 'Lab', url: `${blogPaths.lab}/field-lines` },
            { id: 'about', label: 'About', url: '/about' }
        ],
        footerLinks: [
            {
                sections: [
                    {
                        title: 'Follow',
                        links: [{ label: 'RSS', url: '/rss' }]
                    }
                ]
            }
        ]
    }
}
