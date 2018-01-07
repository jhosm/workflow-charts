"use script";

import _ from "lodash";
import { List } from "immutable";
import moment from "moment";
import WorkItem from "../workItem";
import { buildWorkItem } from "./builders/workItemBuilder";

it("should get the id and the name", () => {
  const wi = buildWorkItem();
  expect(wi.id).toEqual("1");
  expect(wi.name).toEqual("name1");
});

it("should calculate the elapsed days in each state", () => {
  const wi = buildWorkItem({
    statesDates: List([
      moment("2017-01-01", "YYYYMMDD"),
      moment("2017-01-03", "YYYYMMDD")
    ])
  });
  expect(wi.states.toArray()).toEqual([
    {
      name: "ToDo",
      elapsedDays: 2,
      date: moment("2017-01-01", "YYYYMMDD")
    },
    {
      name: "Done",
      elapsedDays: moment().diff(moment("2017-01-03", "YYYYMMDD"), "days"), // last state. elapsed days from state change till today.
      date: moment("2017-01-03", "YYYYMMDD")
    }
  ]);
});

it("should calculate the cycle time when a work item is done", () => {
  const wi = buildWorkItem({
    statesDates: List([
      moment("2017-01-01", "YYYYMMDD"),
      moment("2017-01-05", "YYYYMMDD"),
      ,
      moment("2017-02-05", "YYYYMMDD")
    ]),
    stateNames: ["ToDo", "Doing", "Testing", "Done"]
  });
  expect(wi.cycleTime()).toBe(35);
  expect(wi.cycleTime(0, 1)).toBe(4);
  // Given that the Testing state was skipped, the elapsed time on Doing is the difference between Done and Doing.
  expect(wi.cycleTime(1, 2)).toBeUndefined();
  expect(wi.cycleTime(1, 3)).toBe(31);
  expect(wi.doneAt.isSame("2017-02-05")).toBeTruthy();
});

it("should not calculate the cycle time when the stated end state did not occur", () => {
  const wi = buildWorkItem({
    statesDates: List([
      moment("2017-01-01", "YYYYMMDD"),
      moment("2017-01-05", "YYYYMMDD"),
      ,
      ,
    ]),
    stateNames: ["ToDo", "Doing", "Testing", "Done"]
  });

  // Given that we don't have the "end" state, the age is calculated up until today's date.
  expect(wi.cycleTime()).toBeUndefined();
  expect(wi.cycleTime(1, 3)).toBeUndefined();
});

it("should calculate the age in days when a work item is done", () => {
  const wi = buildWorkItem({
    statesDates: List([
      moment("2017-01-01", "YYYYMMDD"),
      moment("2017-01-05", "YYYYMMDD"),
      ,
      moment("2017-02-05", "YYYYMMDD")
    ]),
    stateNames: ["ToDo", "Doing", "Testing", "Done"]
  });
  expect(wi.ageInDays()).toBe(35);
  expect(wi.ageInDays(0, 1)).toBe(4);
  // Given that the Testing state was skipped, the elapsed time on Doing is the difference between Done and Doing.
  expect(wi.ageInDays(1, 2)).toBe(31);
  expect(wi.ageInDays(1, 3)).toBe(31);
  expect(wi.doneAt.isSame("2017-02-05")).toBeTruthy();
});

it("should calculate the age in days when a work item is not done", () => {
  const wi = buildWorkItem({
    statesDates: List([
      moment("2017-01-01", "YYYYMMDD"),
      moment("2017-01-05", "YYYYMMDD"),
      ,
      ,
    ]),
    stateNames: ["ToDo", "Doing", "Testing", "Done"]
  });

  // Given that we don't have the "end" state, the age is calculated up until today's date.
  expect(wi.ageInDays()).toBe(
    moment().diff(moment("2017-01-01", "YYYYMMDD"), "days")
  );
  expect(wi.ageInDays(1, 3)).toBe(
    moment().diff(moment("2017-01-05", "YYYYMMDD"), "days")
  );
});

it("should not set the done date when a work item is not done", () => {
  const wi = buildWorkItem({
    statesDates: List([moment("2017-01-01", "YYYYMMDD"), undefined])
  });
  expect(wi.doneAt).toBeUndefined();
});

it("should calculate the current state", () => {
  const wi = buildWorkItem({
    statesDates: List([
      moment("2017-01-01", "YYYYMMDD"),
      undefined,
      moment("2018-01-07", "YYYYMMDD"),
      undefined
    ]),
    stateNames: ["ToDo", "Doing", "Testing", "Done"]
  });
  expect(wi.currentState).toBe(wi.states.get(2));

  const wi2 = buildWorkItem({
    statesDates: List([
      moment("2017-01-01", "YYYYMMDD"),
      moment("2018-01-07", "YYYYMMDD"),
      undefined
    ]),
    stateNames: ["ToDo", "Doing", "Done"]
  });
  expect(wi2.currentState).toBe(wi2.states.get(1));

  const wi3 = buildWorkItem({
    statesDates: List([
      moment("2017-01-01", "YYYYMMDD"),
      moment("2018-01-07", "YYYYMMDD"),
      moment("2018-01-09", "YYYYMMDD")
    ]),
    stateNames: ["ToDo", "Doing", "Done"]
  });
  expect(wi3.currentState).toBe(wi3.states.get(2));
});

it("should calculate state transition information, even when it did not happen.", () => {
  const wi = buildWorkItem({
    statesDates: List([
      moment("2017-01-01", "YYYYMMDD"),
      undefined,
      moment("2018-01-07", "YYYYMMDD"),
      undefined
    ]),
    stateNames: ["ToDo", "Doing", "Testing", "Done"]
  });
  expect(wi.states.size).toBe(4);
  expect(wi.states.get(1)).toEqual({
    name: "Doing",
    date: undefined,
    elapsedDays: 0
  });
  expect(wi.states.get(3)).toEqual({
    name: "Done",
    date: undefined,
    elapsedDays: 0
  });
});

it("should not be possible to create a work item without id", () => {
  ["", null, undefined].forEach(badId => {
    expect(() => {
      new WorkItem(badId);
    }).toThrow("id must not be empty");
  });
});

it("should not be possible to create a work item without a name", () => {
  ["", null, undefined].forEach(badName => {
    expect(() => {
      new WorkItem("anId", badName);
    }).toThrow("name must not be empty");
  });
});

it("should not be possible to create a work item without states", () => {
  [null, undefined, 1, "notAnArray"].forEach(badStatesDatesTransitionList => {
    expect(() => {
      new WorkItem("anId", "aName", badStatesDatesTransitionList);
    }).toThrow("statesDatesTransitions must be an Array or a List");
  });

  [[], List()].forEach(badStatesDatesTransitionList => {
    expect(() => {
      new WorkItem("anId", "aName", badStatesDatesTransitionList);
    }).toThrow("statesDatesTransitions must not be empty");
  });
});

it("should not be possible to create a work item without a state names list", () => {
  [null, undefined, 1, "notAnArray"].forEach(badStatesNamesList => {
    expect(() => {
      new WorkItem("anId", "aName", [moment()], badStatesNamesList);
    }).toThrow("statesNames must be an Array or a List");
  });

  [[], List()].forEach(badStatesNamesList => {
    expect(() => {
      new WorkItem("anId", "aName", [moment()], badStatesNamesList);
    }).toThrow("statesNames must not be empty");
  });
});

it("should be verified that the size of the state transitions is equal to the size of the state names", () => {
  expect(() => {
    new WorkItem("anId", "aName", [moment()], ["Todo", "Done"]);
  }).toThrow("statesNames must be same size as statesDatesTransitions");

  expect(() => {
    new WorkItem("anId", "aName", [moment()], ["TODO"]);
  }).not.toThrow();
});

it("should correctly calculate the percentile", () => {
  const workItemsSample = [];
  const baseDate = moment("20170101", "YYYYMMDD");
  _.range(100).forEach(i => {
    const doneDate = moment("20170101", "YYYYMMDD");
    doneDate.add(i, "days");
    const wi = new WorkItem(i + "", "wi_" + i, List([baseDate, doneDate]), [
      "ToDo",
      "Done"
    ]);
    workItemsSample.push(wi);
  });

  for (let i = 1; i < workItemsSample.length; i++) {
    expect(WorkItem.percentile(workItemsSample, i)).toBe(i);
  }
});

it("should filter work items by date", () => {
  const workItemsSample = [];
  workItemsSample.push(
    buildWorkItem({
      statesDates: List([
        moment("20170101", "YYYYMMDD"),
        moment("20170105", "YYYYMMDD")
      ])
    })
  );
  workItemsSample.push(
    buildWorkItem({
      statesDates: List([
        moment("20170101", "YYYYMMDD"),
        moment("20170104", "YYYYMMDD")
      ])
    })
  );
  workItemsSample.push(
    buildWorkItem({
      statesDates: List([
        moment("20170101", "YYYYMMDD"),
        moment("20170103", "YYYYMMDD")
      ])
    })
  );
  workItemsSample.push(
    buildWorkItem({
      statesDates: List([
        moment("20170101", "YYYYMMDD"),
        moment("20170102", "YYYYMMDD")
      ])
    })
  );

  const result = WorkItem.filter(List(workItemsSample), {
    startDate: moment("20170103", "YYYYMMDD"),
    endDate: moment("20170104", "YYYYMMDD")
  });

  expect(result.size).toBe(2);
  expect(result.get(0).doneAt).toEqual(moment("20170104", "YYYYMMDD"));
  expect(result.get(1).doneAt).toEqual(moment("20170103", "YYYYMMDD"));
});

it("should return an empty list when filtering an... empty list.", () => {
  expect(WorkItem.filter()).toBe(List());
});

it("should return the an equal list when filtering... without filters.", () => {
  const workItemsSample = List([
    buildWorkItem({
      statesDates: List([
        moment("20170101", "YYYYMMDD"),
        moment("20170105", "YYYYMMDD")
      ])
    })
  ]);
  const result = WorkItem.filter(workItemsSample);
  expect(result.size).toBe(1);
  expect(result.get(0).doneAt).toEqual(moment("20170105", "YYYYMMDD"));
});
