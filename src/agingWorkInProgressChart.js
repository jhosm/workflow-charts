"use strict";

import _ from "lodash";
import { List, Map } from "immutable";
import WorkItem from "./workItem";
import moment from "moment";
import {
  buildPercentileGuides,
  buildScatterGraph,
  buildChartData,
  buildChartCursor
} from "./scatterChart";

export default class AgingWorkInProgressChart {
  constructor(workItems, stateNames) {
    this._workItems = List(workItems);
    this._stateNames = stateNames;
    const groupedWorkItems = this._workItems.groupBy(workItem => {
      return workItem.doneAt === undefined ? "notDone" : "done";
    });
    this._workItemsInProgress = groupedWorkItems.get("notDone");
    this._doneWorkItems = groupedWorkItems.get("done");
    const unsortedChartData = buildChartData(
      this._workItemsInProgress,
      doneWorkItem => {
        return {
          xValue:
            // Five positions for each space, evenly spaced between 0.1 and 0.8
            0.7 / 5 * _.random(0, 5) + 0.1 + doneWorkItem.currentStateIndex,
          yValue: doneWorkItem.ageInDays()
        };
      }
    );

    this._chartData = unsortedChartData.sortBy(datum => datum.xValue);
  }

  get chartData() {
    return this._chartData;
  }

  plot(containerId) {
    const chart = AmCharts.makeChart(containerId, {
      type: "xy",
      theme: "light",
      titles: [
        {
          size: 15,
          text: "Aging Work In Progress"
        }
      ],
      marginRight: 80,
      minMarginBottom: 80,
      dataProvider: this._chartData.toArray(),
      valueAxes: [
        {
          position: "bottom",
          axisAlpha: 0,
          dashLength: 0,
          gridAlpha: 1,
          minimum: 0,
          maximum: this._workItemsInProgress.get(0).states.size,
          gridCount: this._workItemsInProgress.get(0).states.size,
          autoGridCount: false,
          labelsEnabled: false
        },
        {
          axisAlpha: 0,
          dashLength: 1,
          minimum: 0,
          position: "left",
          guides: buildPercentileGuides(this._doneWorkItems).toArray(),
          title: "Age (days)",
          labelOffset: 15
        }
      ],
      graphs: [
        buildScatterGraph("g1", {
          xField: "xValue",
          yField: "yValue"
        })
      ],
      chartScrollbar: { enabled: false },
      chartCursor: { enabled: false },
      listeners: [
        {
          event: "rendered",
          method: function(e) {
            let chart = e.chart;
            const xAxisWith = chart.valueAxes[0].axisWidth;
            const stateNamesYPosition =
              chart.valueAxes[0].y + chart.valueAxes[0].height;
            const numberOfStates = this._stateNames.size;
            const widthPerState = xAxisWith / numberOfStates;

            this._stateNames.forEach((stateName, stateIndex) => {
              chart.addLabel(
                xAxisWith / 2 -
                  chart.valueAxes[0].getCoordinate(stateIndex + 1) +
                  widthPerState / 2,
                stateNamesYPosition + 5,
                stateName,
                "center"
              );
            });

            const wisPerState = this._workItemsInProgress.groupBy(wi => {
              return wi.currentStateIndex;
            });

            wisPerState.forEach((wis, stateIndex) => {
              chart.addLabel(
                xAxisWith / 2 -
                  chart.valueAxes[0].getCoordinate(stateIndex + 1) +
                  widthPerState / 2,
                chart.valueAxes[0].y - 20,
                "WIP:" + wis.size,
                "center"
              );
            });
          }.bind(this)
        }
      ]
    });
  }
}
