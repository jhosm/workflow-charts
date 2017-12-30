"use strict";

import WorkItem from "../../workItem";
import { List } from "immutable";
import moment from "moment";
import _ from "lodash";

export function buildWorkItemCollection({ size = 2 } = {}) {
  const baseDate = moment("20170101", "YYYYMMDD");
  return _.range(size).map(i => {
    return new WorkItem(
      i + "",
      "wi_" + i,
      List([baseDate, baseDate.clone().add(i, "days")]),
      ["ToDo", "Done"]
    );
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
