"use strict";

import WorkItemsLoader from "./workItemsLoader";
import CycleTimeScatterPlotChart from "./cycleTimeScatterPlotChart";
import AgingWorkInProgressChart from "./agingWorkInProgressChart";

async function render() {
  let loader = new WorkItemsLoader();
  let raw = await WorkItemsLoader.load();
  let workItems = loader.buildWorkItems(raw);
  let stateNames = loader.getWorkItemStateNames(raw);
  let cycleTimePlotter = new CycleTimeScatterPlotChart(workItems);
  cycleTimePlotter.plot("cycleTimeScatterPlotContainer");
  let aging = new AgingWorkInProgressChart(workItems, stateNames);
  aging.plot("agingWorkInProgressContainer");
}
render();
