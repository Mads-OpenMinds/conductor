
export function aggregateExecutions(executions) {

    if (executions instanceof Array){
        let result = executions[0]

        let tasksMap = new Map()
        let runningInstancesMap = new Map()
        let failedInstancesMap = new Map()

        executions.forEach((execItem)  => {
            let failedInstancesOnExecutionMap = new Map()

            execItem.tasks.forEach((execItemTask) => {
                if (!tasksMap.has(execItemTask.referenceTaskName)){
                    tasksMap.set(execItemTask.referenceTaskName, execItemTask)
                }
                if (execItemTask.status === "IN_PROGRESS") {
                    if (runningInstancesMap.has(execItemTask.referenceTaskName)){
                        let val = parseInt(runningInstancesMap.get(execItemTask.referenceTaskName))
                        runningInstancesMap.set(execItemTask.referenceTaskName, val+1)
                    } else {
                        runningInstancesMap.set(execItemTask.referenceTaskName, 1)
                    }
                } else if (execItemTask.status === "FAILED") {
                    if (failedInstancesOnExecutionMap.has(execItemTask.referenceTaskName)){
                        let val = parseInt(failedInstancesOnExecutionMap.get(execItemTask.referenceTaskName))
                        failedInstancesOnExecutionMap.set(execItemTask.referenceTaskName, val+1)
                    } else {
                        failedInstancesOnExecutionMap.set(execItemTask.referenceTaskName, 1)
                    }
                }
            })
            failedInstancesOnExecutionMap.forEach((value, key, map) => {
                if (failedInstancesMap.has(key)) {
                    let val = parseInt(failedInstancesMap.get(key))
                    failedInstancesMap.set(key, val+1)
                } else {
                    failedInstancesMap.set(key, 1)
                }
            })
        })

        result.tasks = []
        tasksMap.forEach((value, key, map) => {
            value.runningInstances = runningInstancesMap.get(key) || 0
            result.tasks.push(value)

            value.failedInstances = failedInstancesMap.get(key) || 0
            for (let i = 0; i < failedInstancesMap.get(key)-1; i++) {
                result.tasks.push(value)
            }
        })

        return result
    } else return executions
}