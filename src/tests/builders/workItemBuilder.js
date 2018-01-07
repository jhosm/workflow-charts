"use strict";

import WorkItem from "../../workItem";
import { List } from "immutable";
import moment from "moment";
import _ from "lodash";

export function buildWorkItemCollection({
  numOfWorkItems = 2,
  states = ["ToDo", "Done"]
} = {}) {
  const baseDate = moment("20170101", "YYYYMMDD");
  return _.range(numOfWorkItems).map(i => {
    const stateDates = _.map(states, (state, index) => {
      const result = baseDate.clone();
      result.add(i * index, "days");
      return result;
    });
    return new WorkItem(i + "", "wi_" + i, stateDates, states);
  });
}

export function buildWorkItem({
  id = "1",
  name = "name1",
  statesDates = List([
    moment("2017-01-01", "YYYYMMDD"),
    moment("2017-01-03", "YYYYMMDD")
  ]),
  stateNames = ["ToDo", "Done"]
} = {}) {
  return new WorkItem(id, name, statesDates, stateNames);
}
