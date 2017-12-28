"use strict";

import { List, Seq } from "immutable";
import { percentile } from "./percentile";

export default class WorkItemsCollection {
  constructor(workItems) {
    this._workItems = List(workItems);
  }

  get workItems() {
    return this._workItems;
  }

  filter(predicate) {
    const filteredWorkItems = this.workItems.filter(predicate);
    return new WorkItemsCollection(filteredWorkItems);
  }

  sortBy(comparer) {
    const sortedWorkItems = this.workItems.sortBy(comparer);
    return new WorkItemsCollection(sortedWorkItems);
  }

  percentile(p) {
    let workItemsCycleTimes = Seq(this.workItems)
      .map(wi => wi.cycleTime)
      .sort((a, b) => {
        return a - b;
      });
    let result =
      Math.ceil(percentile(workItemsCycleTimes.toArray(), p / 100)) + 1;
    return result;
  }
}
