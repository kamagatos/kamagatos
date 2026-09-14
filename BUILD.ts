import { globSync } from 'glob'
import path from 'path'
import {
    Task,
    createHelpTask,
    getIgnoredFolders,
    ensureEnvFilesConsistencyTask,
    ensureProjectsFolderConsistencyTask,
    ensureTestFilesHaveNoSkipAndOnlyTask,
    ensureUseOfCorrectExtensionsTask,
    formatCodeTask,
    lintCodeTask,
    preventCheckinSecretsTask,
    validateManifestsTask,
    compressImagesTask
} from '@eldon/h/tasks'
import { cliLogger as logger } from '@eldon/h/h'

const presubmitTaskHelp = () =>
    createHelpTask({
        description: 'Runs presubmit tasks',
        examples: [
            { description: 'Runs presubmit on git staged files', example: 'h run {target}' },
            { description: 'Runs presubmit on all files in repo', example: 'h run {target} --allfiles' },
            { description: 'Autofixes fixable errors', example: 'h run {target} --fix' }
        ]
    })

/**
 * Runs all presubmit tasks.
 */
export const presubmit = [
    { help: presubmitTaskHelp },
    ensureTestFilesHaveNoSkipAndOnlyTask({}),
    ensureUseOfCorrectExtensionsTask(),
    compressImagesTask(),
    formatCodeTask(),
    lintCodeTask({}),
    preventCheckinSecretsTask({ secrets: [] }),
    ensureEnvFilesConsistencyTask({}),
    ensureProjectsFolderConsistencyTask(),
    validateManifestsTask({})
]

/**
 * Runs linter.
 */
export const lint = [lintCodeTask({})]

/**
 * Runs the `all_tests` target of every app in the repository.
 */
export const all_tests = getTests('all_tests')

/**
 * Lists all targets in the repository.
 */
export const targets = [listTargetsTask()]

function getTests(testName: string): () => Promise<Task[]> {
    return async () => {
        const cwd = process.cwd()
        const files = globSync('dist/apps/**/BUILD.js', { cwd, ignore: getIgnoredFolders({ exclude: ['dist/**'] }) })

        let testTasks: Task[] = []
        const listOfTests: string[] = []

        for (const file of files) {
            const buildFile = await import(path.join(cwd, file))
            if (buildFile[testName]) {
                const appPath = path.dirname(file).replace('dist/', '')
                listOfTests.push(`* ${appPath}:${testName}`)
                testTasks = testTasks.concat(buildFile[testName].map((t: Task) => ({ ...t, envPath: appPath })))
            }
        }

        return [
            {
                handler: async () => {
                    logger.info(`Testing ${listOfTests.length} test targets`)
                    logger.info(listOfTests.join('\n'))
                    return { data: {} }
                }
            },
            ...testTasks
        ]
    }
}

function listTargetsTask(): Task {
    return {
        handler: async ({ cwd }) => {
            const files = globSync('dist/**/BUILD.js', { cwd, ignore: getIgnoredFolders({ exclude: ['dist/**'] }) })
            for (const file of files) {
                const buildFile = await import(path.join(cwd, file))
                const appPath = path.dirname(file).replace(/dist\/?/, '')
                Object.keys(buildFile).forEach((taskName) => logger.info(`${appPath}:${taskName}`))
            }
            return { data: {} }
        }
    }
}
