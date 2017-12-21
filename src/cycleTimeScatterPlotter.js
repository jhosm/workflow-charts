"use strict";

import Highcharts from "highcharts";
import List from "Immutable";
import WorkItemsCollection from "./workItemsCollection";

export default class CycleTimeScatterPlotter {
  constructor(workItems) {
    let doneWorkItems = workItems.filter(workItem => {
      return workItem.doneAt != undefined;
    });
    this._data = doneWorkItems.workItems
      .map(doneWorkItem => {
        return [doneWorkItem.doneAt.valueOf(), doneWorkItem.cycleTime];
      })
      .toArray();

    this._plotLines = [];
    [50, 70, 85, 95].forEach(p => {
      let pValue = doneWorkItems.percentile(p);
      this._plotLines.push({
        value: pValue,
        color: "black",
        dashStyle: "Dash",
        width: 1,
        id: "plot-line-x-" + p,
        label: {
          text: p + "% (" + pValue + "d)",
          align: "right"
        }
      });
    });
  }

  get plotLines() {
    return this._plotLines;
  }

  plot() {
    Highcharts.chart("cycleTimeScatterPlotContainer", {
      chart: {
        type: "scatter",
        zoomType: "x",
        panning: true,
        panKey: "shift"
      },
      title: {
        text: "Work Items Cycle Time"
      },
      subtitle: {
        text: "Source: Sample Data"
      },
      xAxis: {
        title: {
          enabled: true,
          text: "Done Date"
        },
        tickInterval: 24 * 3600 * 1000,
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true,
        type: "datetime"
      },
      yAxis: {
        title: {
          text: "CycleTime"
        },
        plotLines: this._plotLines
      },
      legend: {
        layout: "vertical",
        align: "left",
        verticalAlign: "top",
        x: 100,
        y: 70,
        floating: true,
        backgroundColor:
          (Highcharts.theme && Highcharts.theme.legendBackgroundColor) ||
          "#FFFFFF",
        borderWidth: 1
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 5,
            states: {
              hover: {
                enabled: true,
                lineColor: "rgb(100,100,100)"
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: false
              }
            }
          }
        }
      },
      series: [
        {
          name: "Work Item",
          color: "rgba(119, 152, 191, .5)",
          data: this._data
        }
      ]
    });
  }
}
