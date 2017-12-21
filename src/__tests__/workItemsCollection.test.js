"use strict";

import _ from "lodash";
import moment from "moment";
import WorkItemsCollection from "../workItemsCollection";
import WorkItem from "../workItem";

it("should correctly calculate the percentile", () => {
  const workItemsSample = [];
  const baseDate = moment("20170101", "YYYYMMDD");
  _.range(100).forEach(i => {
    const wi = new WorkItem(i, "wi_" + i, baseDate, baseDate.add(i, "days"));
    workItemsSample.push(wi);
  });

  const wis = new WorkItemsCollection(workItemsSample);
  for (let i = 1; i < wis.workItems.length; i++) {
    expect(wis.percentile(i)).toBe(i - 1);
  }
});
