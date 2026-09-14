import tseslint from 'typescript-eslint'
import { eslintRecommended } from '@eldon/h/eslint'

/** @type {import('@typescript-eslint/utils').TSESLint.Config} */
const config = tseslint.config(...eslintRecommended)

export default config
