import React from 'react'
import { BaseReq } from '@eldon/h'
import { toFullUserObject } from '@eldon/h/models/user'
import { ControllerParams, renderView } from '@eldon/h/server/http'
import { createInitialUserClientState } from '@eldon/h/clients/web/state'
import FieldLinesPage from '../public/js/field_lines.page.js'

/**
 * "Drawing with Orbits", an interactive essay rendered as a React page.
 */
export default async function getFieldLinesCtrl({ req, meta }: ControllerParams<BaseReq>) {
    const state = {
        meta,
        user: createInitialUserClientState(toFullUserObject(req.user)),
        pageData: {}
    }

    return renderView(<FieldLinesPage state={state} />, state)
}
