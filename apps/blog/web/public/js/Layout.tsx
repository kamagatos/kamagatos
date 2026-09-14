import React, { ReactNode } from 'react'
import { BaseState } from '@eldon/h/clients/web/state'
import { staticAssetsManager } from '@eldon/h/clients/web/assets'
import { WebsiteLayout, WebsiteLayoutStyle } from '@eldon/h/clients/web/website'
import { blogLinks, blogPaths } from '../../constants.client.js'

type Props = {
    children: ReactNode
    headerPosition: 'floating' | 'sticky' | 'normal'
    state: BaseState<{}>
}

/**
 * Same chrome as the blog pages, for the pages that are not markdown.
 */
export default ({ children, headerPosition, state }: Props) => {
    return (
        <WebsiteLayout
            state={state}
            layout={WebsiteLayoutStyle.CENTERED}
            isUserLoggedIn={state.user.loggedIn}
            appCommonName={state.meta.appCommonName}
            headerPosition={headerPosition}
            headerLinks={[
                { id: 'writing', label: 'Writing', url: '/' },
                { id: 'timeless', label: 'Timeless', url: '/timeless-music-from-the-world' },
                { id: 'lab', label: 'Lab', url: `${blogPaths.lab}/field-lines` },
                { id: 'about', label: 'About', url: '/about' }
            ]}
            footerLinks={[{ sections: [{ title: 'Follow', links: [{ label: 'RSS', url: '/rss' }] }] }]}
            twitterUrl={blogLinks.twitter}
            facebookUrl={blogLinks.facebook}
            logoUrl={staticAssetsManager.getAsset('@blogweb/public/images/colored_logo.png', { width: 220 }).url}
            smallLogoUrl={
                staticAssetsManager.getAsset('@blogweb/public/images/square_logo_colored.png', { height: 40 }).url
            }>
            {children}
        </WebsiteLayout>
    )
}
