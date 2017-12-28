"use strict";

import WorkItem from "../../workItem";
import { List } from "immutable";
import moment from "moment";

export default function buildWorkItem({
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
