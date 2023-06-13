import {makeStyles} from "@material-ui/styles";
import sharedStyles from "../styles";
import {useRouteMatch} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {
  getWorkflowDefinition,
  getWorkflowExecutionByWorkflowId,
  getWorkflowExecutions
} from "../../services/workflowService";
import {Helmet} from "react-helmet";
import {DataTable, NavLink} from "../../components";
import {useQueryState} from "react-router-use-location-state";
import WorkflowGraph from "../../components/diagram/WorkflowGraph";
import WorkflowDAG from "../../components/diagram/WorkflowDAG";
import {aggregateExecutions} from "../../utils/executions";

const useStyles = makeStyles(sharedStyles);

const columns = [
  {
    name: "status",
    renderer: (val) => {
      if (val === "RUNNING") return `✅ ${val}`
      else return `❌ ${val}`
    }
  },
  {
    name: "workflowName",
  },
  {
    name: "processId"
  },
  {
    name: "workflowId",
    renderer: (val) => (
        <NavLink path={`/execution/${val.trim()}`}>{val.trim()}</NavLink>
    )
  }
];


export default function WorkflowProcesses(){
  const classes = useStyles();
  const match = useRouteMatch();

  const workflowName = match.params.workflowName
  console.log(workflowName)

  const [processes, setProcesses] = useState([])
  const [filterParam, setFilterParam] = useQueryState("filter", "");
  const [dag, setDag] = useState(null);
  const [execution, setExecution] = useState(null);
  const filterObj = filterParam === "" ? undefined : JSON.parse(filterParam);

  const handleFilterChange = (obj) => {
    if (obj) {
      setFilterParam(JSON.stringify(obj));
    } else {
      setFilterParam("");
    }
  };

  // useEffect(() => {
  //   const fetchDefinition = async () => {
  //     return await getWorkflowDefinition(workflowName)
  //   }
  //   fetchDefinition().then( (def) => {
  //     // setDag(new WorkflowDAG(null, def))
  //   })
  // }, [workflowName])

  useEffect(() => {
    const fetchExecutions = async () => {
      const result = await getWorkflowExecutions(workflowName)

      let executions = [];
      result.results.forEach((res)=>{
        if (res.status === "RUNNING" || res.status === "FAILED") {
          res.processId = res.input.processId
          executions.push(res);
        }
      })

      let exec = []
      for (let i = 0; i < executions.length; i++) {
        exec[i] = await getWorkflowExecutionByWorkflowId(executions[i].workflowId)
      }

      if (exec.length){
        const aggregatedExecution = aggregateExecutions(exec)
        setDag(new WorkflowDAG(aggregatedExecution))
        setExecution(aggregatedExecution)
      }


      return executions;
    }

    fetchExecutions().then( (result) => {
      setProcesses(result)})
  }, [workflowName])


  return (
      <div className={classes.wrapper}>
        <Helmet>
          <title>Conductor UI - Workflow Processes - {workflowName}</title>
        </Helmet>

        <div className={classes.tabContent}>
          {processes && (
              <DataTable
                  title={`${workflowName}`}
                  localStorageKey="processesTable"
                  defaultShowColumns={[
                      "status",
                      "processId",
                      "workflowId"
                  ]}
                  keyField="name"
                  onFilterChange={handleFilterChange}
                  initialFilterObj={filterObj}
                  data={processes}
                  columns={columns}
              />
          )}
        </div>
        <div className={classes.workflowGraph}>
          {dag && <WorkflowGraph dag={dag}  />}
        </div>
      </div>
  );
}