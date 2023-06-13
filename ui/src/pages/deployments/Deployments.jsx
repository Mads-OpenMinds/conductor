import React, {useEffect, useState} from "react";
import {DataTable, NavLink} from "../../components";
import {makeStyles} from "@material-ui/styles";
import _ from "lodash";
import {useQueryState} from "react-router-use-location-state";
import sharedStyles from "../styles";
import {Helmet} from "react-helmet";
import {getWorkflowDefinitions, getWorkflowExecutions} from "../../services/workflowService";

const useStyles = makeStyles(sharedStyles);

const columns = [
  {
    name: "state",
  },
  {
    name: "incidents"
  },
  {
    name: "runningInstances"
  },
  {
    name: "name",
    renderer: (val) => (
      <NavLink path={`/process/${val.trim()}`}>{val.trim()}</NavLink>
    ),
  }
];

export default function DeployedWorkflows() {
  const classes = useStyles();

  const [filterParam, setFilterParam] = useQueryState("filter", "");
  const filterObj = filterParam === "" ? undefined : JSON.parse(filterParam);

  const handleFilterChange = (obj) => {
    if (obj) {
      setFilterParam(JSON.stringify(obj));
    } else {
      setFilterParam("");
    }
  };

  const [deployments, setDeployments] = useState([])
  useEffect( ()=>{

    const fetchExecutions = async () => {
      const data = await getWorkflowDefinitions();
      if (data) {
        const uniqueMap = new Map();
        const types = new Set();
        for (let workflowDef of data) {
          if (!uniqueMap.has(workflowDef.name)) {
            uniqueMap.set(workflowDef.name, workflowDef);
          } else if (uniqueMap.get(workflowDef.name).version < workflowDef.version) {
            uniqueMap.set(workflowDef.name, workflowDef);
          }

          for (let task of workflowDef.tasks) {
            types.add(task.type);
          }
        }

        const uniqueArray = Array.from(uniqueMap.values());

        for (let i = 0; i < uniqueArray.length; i++) {
          let incidentsNumber = 0;
          let runningInstances = 0;
          const result = await getWorkflowExecutions(uniqueArray[i].name)
          // console.log(result.results)
          result.results.forEach((execution)=> {
            if (execution.status === "FAILED") incidentsNumber++;
            else if (execution.status === "RUNNING") runningInstances++;
          })
          uniqueArray[i].incidents = incidentsNumber;
          uniqueArray[i].runningInstances = runningInstances;
          if (incidentsNumber === 0) uniqueArray[i].state = "✅"; else uniqueArray[i].state = "❌";
        }

        console.log(uniqueArray)
        return uniqueArray;
      }
    }

    fetchExecutions().then((result)=> {setDeployments(result)})

  }, [])

  return (
    <div className={classes.wrapper}>
      <Helmet>
        <title>Conductor UI - Deployed Workflow Definitions</title>
      </Helmet>

      <div className={classes.tabContent}>
        {deployments && (
          <DataTable
            title={`${deployments.length} workflow definitions deployed`}
            localStorageKey="deploymentsTable"
            defaultShowColumns={[
                "state",
                "incidents",
                "runningInstances",
                "name"
            ]}
            keyField="name"
            onFilterChange={handleFilterChange}
            initialFilterObj={filterObj}
            data={deployments}
            columns={columns}
          />
        )}
      </div>
    </div>
  );
}
