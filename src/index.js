"use strict";

import Highcharts from "highcharts";
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
      text: "Aging Work In Progress"
    },
    subtitle: {
      text: "Source: Sample Data"
    },
    xAxis: {
      title: {
        enabled: true,
        text: "Done Date"
      },
      showLastLabel: true,
      type: "category"
    },
    yAxis: {
      title: {
        text: "CycleTime"
      }
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
        data: [
          ["x", 51.6],
          ["x", 51.6],
          ["x", 59.0],
          ["y", 49.2],
          ["x", 61.6],
          ["x", 92.6],
          ["x", 59.0],
          ["x", 61.6],
          ["x", 1.6],
          ["x", 59.0],
          ["x", 71.6],
          ["x", 11.6],
          ["x", 59.0],
          ["x", 81.6],
          ["x", 91.6],
          ["x", 59.0],
          ["x", 31.6],
          ["x", 41.6],
          ["x", 59.0]
        ]
      },
      {
        name: "Work Item 2",
        color: "rgba(119, 152, 191, .5)",
        pointPadding: 0.4,
        pointPlacement: 0.2,
        data: [["x", 51.6], ["x", 51.6], ["x", 59.0]]
      }
    ]
  });
}
render();
