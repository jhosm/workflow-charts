"use strict";

import _ from "lodash";
import { List, Seq } from "immutable";
import moment from "moment/moment";
import { percentile } from "./percentile";

let statesList;

export default class WorkItem {
  static percentile(workItems, p) {
    const workItemsCycleTimes = Seq(workItems)
      .map(wi => wi.cycleTime())
      .sort((a, b) => {
        return a - b;
      });
    const result = Math.ceil(
      percentile(workItemsCycleTimes.toArray(), p / 100)
    );
    return result;
  }

  static filter(
    workItems = List(),
    {
      startDate = moment("20000101", "YYYYMMDD"),
      endDate = moment("21000101", "YYYYMMDD")
    } = {}
  ) {
    return workItems.filter(workItem => {
      return (
        workItem.doneAt.isSameOrAfter(moment(startDate)) &&
        workItem.doneAt.isSameOrBefore(moment(endDate))
      );
    });
  }

  constructor(id, name, statesDatesTransitions, statesNames) {
    if (!id) throw new Error("id must not be empty");
    if (!name) throw new Error("name must not be empty");
    statesDatesTransitions = ensureListIsNotEmpty(
      statesDatesTransitions,
      "statesDatesTransitions"
    );
    statesList = ensureListIsNotEmpty(statesNames, "statesNames");
    if (statesDatesTransitions.size !== statesList.size) {
      throw new Error(
        "statesNames must be same size as statesDatesTransitions"
      );
    }

    this.id = id;
    this.name = name;

    const getNextStateIndex = (statesDates, currentStateIndex) => {
      return statesDates.findIndex((stateDate, stateIndex) => {
        if (currentStateIndex >= stateIndex) return false; // only interested in states after the current one.
        if (stateDate === undefined) return false; // ignore states that the work item didn't stay in.
        return true;
      });
    };

    this.states = statesDatesTransitions.map((stateDate, index) => {
      const result = {
        name: statesList.get(index),
        date: stateDate
      };
      const nextStateIndex = getNextStateIndex(statesDatesTransitions, index);
      if (!stateDate) {
        result.elapsedDays = 0;
      } else if (nextStateIndex == -1) {
        result.elapsedDays = moment().diff(stateDate, "days");
        this.currentState = result;
        this.currentStateIndex = index;
      } else {
        result.elapsedDays = statesDatesTransitions
          .get(nextStateIndex)
          .diff(stateDate, "days");
      }
      return result;
    });
    const initialStateDate = this.states.first().date;
    const finalStateDate = this.states.last().date;

    if (finalStateDate && finalStateDate.isValid()) {
      this.doneAt = finalStateDate;
    }
  }

  cycleTime(initialStateIndex = 0, finalStateIndex = this.states.size - 1) {
    if (
      initialStateIndex < 0 ||
      this.states.size <= finalStateIndex ||
      this.states.get(finalStateIndex).date === undefined
    ) {
      return undefined;
    }
    return this.ageInDays(initialStateIndex, finalStateIndex);
  }

  ageInDays(initialStateIndex = 0, finalStateIndex = this.states.size - 1) {
    const states = this.states.slice(initialStateIndex, finalStateIndex);
    const result = states.reduce((acc, state) => acc + state.elapsedDays, 0);
    return result;
  }
}

function ensureListIsNotEmpty(maybeList, listName) {
  if (!_.isArray(maybeList) && !List.isList(maybeList)) {
    throw new Error(listName + " must be an Array or a List");
  }
  maybeList = List(maybeList);
  if (maybeList.size === 0) {
    throw new Error(listName + " must not be empty");
  }
  return maybeList;
}
