import React from "react";

import { Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import { Button, AppBar, Toolbar } from "@material-ui/core";
import AppLogo from "./components/AppLogo";
import NavLink from "./components/NavLink";

import WorkflowSearch from "./pages/executions/WorkflowSearch";
import TaskSearch from "./pages/executions/TaskSearch";

import Deployments from "./pages/deployments/Deployments"
import Execution from "./pages/execution/Execution";
import WorkflowDefinitions from "./pages/definitions/Workflow";
import WorkflowDefinition from "./pages/definition/WorkflowDefinition";
import TaskDefinitions from "./pages/definitions/Task";
import TaskDefinition from "./pages/definition/TaskDefinition";
import EventHandlerDefinitions from "./pages/definitions/EventHandler";
import EventHandlerDefinition from "./pages/definition/EventHandler";
import TaskQueue from "./pages/misc/TaskQueue";
import KitchenSink from "./pages/kitchensink/KitchenSink";
import DiagramTest from "./pages/kitchensink/DiagramTest";
import Examples from "./pages/kitchensink/Examples";
import Gantt from "./pages/kitchensink/Gantt";

import Workbench from "./pages/workbench/Workbench";
import WorkflowProcesses from "./pages/deployments/WorkflowProcesses";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#efefef", // TODO: Use theme var
    display: "flex",
  },
  body: {
    width: "100vw",
    height: "100vh",
    paddingTop: theme.overrides.MuiAppBar.root.height,
  },
  toolbarRight: {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "row",
  },
  toolbarRegular: {
    minHeight: 80,
  },
}));

export default function App({
  appBarModules,
  appBarButtons,
  customAppLogo,
  customRoutes,
}) {
  const classes = useStyles();

  return (
    // Provide context for backward compatibility with class components
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar
          classes={{
            regular: classes.toolbarRegular,
          }}
        >
          {customAppLogo || <AppLogo />}

          <Button component={NavLink} path="/">
            Deployments
          </Button>
          <Button component={NavLink} path="/search/workflows">
            Search
          </Button>
          <Button component={NavLink} path="/workflowDefs">
            Definitions
          </Button>
          <Button component={NavLink} path="/taskQueue">
            Task Queues
          </Button>
          <Button component={NavLink} path="/workbench">
            Workbench
          </Button>

          {appBarButtons}

          <div className={classes.toolbarRight}>{appBarModules}</div>
        </Toolbar>
      </AppBar>
      <div className={classes.body}>
        <Switch>
          <Route exact path="/">
            <Deployments />
          </Route>
          <Route exact path="/search/workflows">
            <WorkflowSearch />
          </Route>
          <Route exact path="/search/tasks">
            <TaskSearch />
          </Route>
          <Route path="/execution/:id/:taskId?">
            <Execution />
          </Route>
          <Route path="/process/:workflowName">
            <WorkflowProcesses/>
          </Route>
          <Route exact path="/workflowDefs">
            <WorkflowDefinitions />
          </Route>
          <Route exact path="/workflowDef/:name?/:version?">
            <WorkflowDefinition />
          </Route>
          <Route exact path="/taskDefs">
            <TaskDefinitions />
          </Route>
          <Route exact path="/taskDef/:name?">
            <TaskDefinition />
          </Route>
          <Route exact path="/eventHandlerDef">
            <EventHandlerDefinitions />
          </Route>
          <Route exact path="/eventHandlerDef/:name">
            <EventHandlerDefinition />
          </Route>
          <Route exact path="/taskQueue/:name?">
            <TaskQueue />
          </Route>
          <Route exact path="/workbench">
            <Workbench />
          </Route>
          <Route exact path="/kitchen">
            <KitchenSink />
          </Route>
          <Route exact path="/kitchen/diagram">
            <DiagramTest />
          </Route>
          <Route exact path="/kitchen/examples">
            <Examples />
          </Route>
          <Route exact path="/kitchen/gantt">
            <Gantt />
          </Route>

          {customRoutes}
        </Switch>
      </div>
    </div>
  );
}
