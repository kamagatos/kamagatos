import { rustTask } from '@eldon/h/tasks'

export const soma = [
    rustTask({
        name: 'soma',
        path: 'apps/experimental/soma',
        deps: [],
        taskOptions: {}
    })
]
