"use strict";

import _ from "lodash";
import { List } from "immutable";
import moment from "moment";
import CycleTimeScatterPlotter from "../cycleTimeScatterPlotter";
import WorkItemsCollection from "../workItemsCollection";
import WorkItem from "../workItem";

it("should correctly calculate the percentile", () => {
  const workItemsSample = [];
  const baseDate = moment("20170101", "YYYYMMDD");
  _.range(100).forEach(i => {
    const wi = new WorkItem(
      i + "",
      "wi_" + i,
      List([baseDate, baseDate.clone().add(i, "days")]),
      ["ToDo", "Done"]
    );
    workItemsSample.push(wi);
  });

  const plotter = new CycleTimeScatterPlotter(
    new WorkItemsCollection(workItemsSample)
  );
  expect(plotter.plotLines[0]).toEqual(
    expect.objectContaining({
      value: 51,
      id: "plot-line-x-50"
    })
  );
});
