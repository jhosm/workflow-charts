"use strict";

import moment from "moment/moment";

export default class WorkItem {
  constructor(id, name, initialStateDate, finalStateDate) {
    this._id = id;
    this._name = name;

    let cycleTime = finalStateDate.diff(initialStateDate, "days");
    if (initialStateDate && finalStateDate && finalStateDate.isValid()) {
      if (cycleTime > 0) {
        this._cycleTime = cycleTime;
        this._doneAt = finalStateDate;
      }
    }
  }
  get doneAt() {
    return this._doneAt;
  }

  get cycleTime() {
    return this._cycleTime;
  }
}
