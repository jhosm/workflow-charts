"use strickt";

import _ from "lodash";
import moment from "moment";
import CycleTimeScatterPlotter from "../cycleTimeScatterPlotter";
import WorkItemsCollection from "../workItemsCollection";
import WorkItem from "../workItem";

it("should correctly calculate the percentile", () => {
  let workItemsSample = [];
  let baseDate = moment("20170101", "YYYYMMDD");
  _.range(100).forEach(i => {
    let baseDatePlusOne = baseDate.clone();
    baseDatePlusOne.add(i, "days");
    let wi = new WorkItem(i, "wi_" + i, baseDate, baseDatePlusOne);
    workItemsSample.push(wi);
  });

  let plotter = new CycleTimeScatterPlotter(
    new WorkItemsCollection(workItemsSample)
  );
  expect(plotter.plotLines[0]).toEqual(
    expect.objectContaining({
      value: 51,
      id: "plot-line-x-50"
    })
  );
});
