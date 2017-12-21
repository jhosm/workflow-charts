"use strict";

import FlowDataLoader from "./workItemsLoader";
import CycleTimeScatterPlotter from "./cycleTimeScatterPlotter";

async function render() {
  let loader = new FlowDataLoader();
  let workItems = await FlowDataLoader.load();
  let cycleTimePlotter = new CycleTimeScatterPlotter(
    loader.buildWorkItems(workItems)
  );
  cycleTimePlotter.plot();

  Highcharts.chart("AgingWorkInProgressContainer", {
    chart: {
      type: "scatter",
      zoomType: "x"
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
render();
