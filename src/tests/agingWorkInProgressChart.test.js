/*import _ from "lodash";
import { List } from "immutable";
import moment from "moment";
import WorkItem from "../workItem";

import { buildPercentileGuides } from "../scatterChart";*/
import AgingWorkInProgressChart from "../agingWorkInProgressChart";
import { buildWorkItemCollection } from "./builders/workItemBuilder";

it("should build the x axis values correctly, based on the age of work items", () => {
  const workItemsSample = buildWorkItemCollection({ numOfWorkItems: 2 });
  const chart = new AgingWorkInProgressChart(workItemsSample);
  return chart.chartData;
});
