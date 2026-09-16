import { pythonTask, runPythonTestsTask } from '@eldon/h/tasks'

export const mlp = [
    pythonTask({
        name: 'mlp',
        path: 'apps/experimental/mlp',
        taskOptions: {}
    })
]

export const all_tests = [
    runPythonTestsTask({
        target: 'apps/experimental/mlp:mlp'
    })
]
