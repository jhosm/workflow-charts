"use strict";

import _ from "lodash";
import { List } from "immutable";
import moment from "moment/moment";

let statesList;

export default class WorkItem {
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
        if (stateDate === undefined) return false; // ignore states that the wor item didn't stay in.
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
      const cycleTime = finalStateDate.diff(initialStateDate, "days");
      if (cycleTime > 0) {
        this.cycleTime = cycleTime;
        this.doneAt = finalStateDate;
      }
    }
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
