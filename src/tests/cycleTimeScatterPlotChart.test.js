"use strict";

import _ from "lodash";
import { List } from "immutable";
import moment from "moment";
import CycleTimeScatterPlotChart from "../cycleTimeScatterPlotChart";
import WorkItem from "../workItem";
import {
  buildWorkItem,
  buildWorkItemCollection
} from "./builders/workItemBuilder";
import { buildPercentileGuides } from "../scatterChart";

it("should not throw if given an empty workItems list", () => {
  expect(() => {
    new CycleTimeScatterPlotChart([]);
  }).not.toThrow();
});

it("should build the chart data based on the work items", () => {
  const workItemsSample = buildWorkItemCollection();

  const plotter = new CycleTimeScatterPlotChart(workItemsSample);

  const chartData = plotter.chartData;
  expect(chartData.size).toBe(2);
  const firstDataItem = chartData.get(0);
  expect(firstDataItem).toEqual(
    expect.objectContaining({
      xValue: new Date(2017, 0, 1),
      yValue: 0,
      numberOfWorkItems: ""
    })
  );
  expect(firstDataItem.workItems.size).toBe(1);
  expect(chartData.get(1)).toEqual(
    expect.objectContaining({
      xValue: new Date(2017, 0, 2),
      yValue: 1,
      numberOfWorkItems: ""
    })
  );
});

it("should build just one data item when two work items completed in the same day with the same cycle time", () => {
  const workItemsSample = [];
  workItemsSample.push(buildWorkItem()); //two identical work items
  workItemsSample.push(buildWorkItem());

  const plotter = new CycleTimeScatterPlotChart(workItemsSample);

  const chartData = plotter.chartData;
  expect(chartData.size).toBe(1);
  const dataItem = chartData.get(0);
  expect(dataItem).toEqual(
    expect.objectContaining({
      xValue: new Date(2017, 0, 3),
      yValue: 2,
      numberOfWorkItems: 2
    })
  );
  expect(dataItem.workItems.size).toBe(2);
});

it("should set the number of overlapping (same completion date and cycle time) work items as '+' when there are more than 9.", () => {
  const workItemsSample = [];
  _.range(10).forEach(i => workItemsSample.push(buildWorkItem()));

  const plotter = new CycleTimeScatterPlotChart(workItemsSample);

  const chartData = plotter.chartData;
  expect(chartData.size).toBe(1);
  const dataItem = chartData.get(0);
  expect(dataItem.numberOfWorkItems).toBe("+");
});

it("should calculate the guides (corresponding to the 50, 70, 85 and 95 percentiles)", () => {
  const workItemsSample = buildWorkItemCollection({ numOfWorkItems: 100 });

  const plotter = new CycleTimeScatterPlotChart(workItemsSample);
  const guides = buildPercentileGuides(workItemsSample);
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
