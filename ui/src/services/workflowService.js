const serverURL = "http://localhost:8080/api";

export async function getWorkflowDefinitions() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return await fetch(`${serverURL}/metadata/workflow`, requestOptions)
        .then((response) => {
            return response.json()
        })
        .catch(error => console.log('error', error));
}

export async function getWorkflowDefinition(workflowName) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return await fetch(`${serverURL}/metadata/workflow/${workflowName}`, requestOptions)
        .then((response) => {
            return response.json()
        })
        .catch(error => console.log('error', error));
}

export async function getWorkflowExecutionByWorkflowId(workflowId) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return await fetch(`${serverURL}/workflow/${workflowId}`, requestOptions)
        .then((response) => {
            return response.json()
        })
        .catch(error => console.log('error', error));
}

export async function getWorkflowExecutions(workflowName) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return await fetch(`${serverURL}/workflow/search-v2?start=0&size=100&freeText=&query=workflowType%20IN%20(${workflowName})`, requestOptions)
        .then((response) => {
            return response.json()
        })
        .catch(error => console.log('error', error));
}