"use strict";

import _ from "lodash";
import { List } from "immutable";
import moment from "moment";
import CycleTimeScatterPlotter from "../cycleTimeScatterPlotter";
import WorkItem from "../workItem";
import {
  buildWorkItem,
  buildWorkItemCollection
} from "./builders/workItemBuilder";

it("should not throw if given an empty workItems list", () => {
  expect(() => {
    new CycleTimeScatterPlotter([]);
  }).not.toThrow();
});

it("should build the chart data based on the work items", () => {
  const workItemsSample = buildWorkItemCollection();

  const plotter = new CycleTimeScatterPlotter(workItemsSample);

  const chartData = plotter.chartData;
  expect(chartData.size).toBe(2);
  const firstDataItem = chartData.get(0);
  expect(firstDataItem).toEqual(
    expect.objectContaining({
      date: new Date(2017, 0, 1),
      days: 0,
      size: ""
    })
  );
  expect(firstDataItem.workItems.size).toBe(1);
  expect(chartData.get(1)).toEqual(
    expect.objectContaining({
      date: new Date(2017, 0, 2),
      days: 1,
      size: ""
    })
  );
});

it("should build just one data item when two work items completed in the same day with the same cycle time", () => {
  const workItemsSample = [];
  workItemsSample.push(buildWorkItem()); //two identical work items
  workItemsSample.push(buildWorkItem());

  const plotter = new CycleTimeScatterPlotter(workItemsSample);

  const chartData = plotter.chartData;
  expect(chartData.size).toBe(1);
  const dataItem = chartData.get(0);
  expect(dataItem).toEqual(
    expect.objectContaining({
      date: new Date(2017, 0, 3),
      days: 2,
      size: 2
    })
  );
  expect(dataItem.workItems.size).toBe(2);
});

it("should set the number of overlapping (same completion date and cycle time) work items as '+' when there are more than 9.", () => {
  const workItemsSample = [];
  _.range(10).forEach(i => workItemsSample.push(buildWorkItem()));

  const plotter = new CycleTimeScatterPlotter(workItemsSample);

  const chartData = plotter.chartData;
  expect(chartData.size).toBe(1);
  const dataItem = chartData.get(0);
  expect(dataItem.size).toBe("+");
});

it("should filter work items by date", () => {
  const workItemsSample = [];
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

  const plotter = new CycleTimeScatterPlotter(workItemsSample);

  const result = plotter.filterWorkItems({
    startDate: moment("20170103", "YYYYMMDD")
  });

  expect(result.size).toBe(1);
  expect(result.get(0).doneAt).toEqual(moment("20170103", "YYYYMMDD"));
});

it("should calculate the guides (corresponding to the 50, 70, 85 and 95 percentiles)", () => {
  const workItemsSample = buildWorkItemCollection({ size: 100 });

  const plotter = new CycleTimeScatterPlotter(workItemsSample);
  const guides = plotter.guides();
  expect(guides.size).toBe(4);
  expect(guides.get(0)).toEqual(
    expect.objectContaining({
      value: 50,
      id: "guides-x-50",
      label: "50% (50d)"
    })
  );
  expect(guides.get(1)).toEqual(
    expect.objectContaining({
      value: 70,
      id: "guides-x-70",
      label: "70% (70d)"
    })
  );
  expect(guides.get(2)).toEqual(
    expect.objectContaining({
      value: 85,
      id: "guides-x-85",
      label: "85% (85d)"
    })
  );
  expect(guides.get(3)).toEqual(
    expect.objectContaining({
      value: 95,
      id: "guides-x-95",
      label: "95% (95d)"
    })
  );
});
