"use strict";

import _ from "lodash";
import Highcharts from "highcharts";
import { List, Map } from "immutable";
import WorkItem from "./workItem";
import moment from "moment";
import {
  buildPercentileGuides,
  buildScatterGraph,
  buildChartData,
  buildChartCursor
} from "./scatterChart";

export default class CycleTimeScatterPlotChart {
  constructor(workItems) {
    this._doneWorkItems = List(workItems).filter(workItem => {
      return workItem.doneAt != undefined;
    });
    const unsortedChartData = buildChartData(
      this._doneWorkItems,
      doneWorkItem => {
        return {
          xValue: doneWorkItem.doneAt.toDate(),
          yValue: doneWorkItem.cycleTime()
        };
      }
    );

    this._chartData = unsortedChartData.sortBy(datum => datum.xValue);
  }

  get chartData() {
    return this._chartData;
  }

  plot(containerId) {
    function onZoom(e) {
      if (!e.chart.lastZoomed) return;
      e.chart.valueAxes[0].guides = buildPercentileGuides(
        WorkItem.filter(this._doneWorkItems, {
          startDate: moment(e.chart.lastZoomed.startDate),
          endDate: moment(e.chart.lastZoomed.endDate)
        })
      ).toArray();
      e.chart.lastZoomed = undefined;
      e.chart.validateNow();
    }

    const chart = AmCharts.makeChart(containerId, {
      type: "serial",
      theme: "light",
      titles: [
        {
          size: 15,
          text: "Cycle Time Scatter Plot"
        }
      ],
      marginRight: 80,
      dataProvider: this._chartData.toArray(),
      valueAxes: [
        {
          axisAlpha: 0.2,
          dashLength: 1,
          position: "left",
          guides: buildPercentileGuides(this._doneWorkItems).toArray(),
          title: "CycleTime (days)"
        }
      ],
      graphs: [buildScatterGraph("g1", { valueField: "yValue" })],
      chartScrollbar: {
        graph: "g1",
        graphType: "column",
        oppositeAxis: false,
        offset: 30,
        scrollbarHeight: 80,
        autoGridCount: true
      },
      chartCursor: buildChartCursor(),
      categoryField: "xValue",
      categoryAxis: {
        parseDates: true,
        axisColor: "#DADADA",
        dashLength: 1,
        title: "Completion Date"
      },
      listeners: [
        {
          event: "rendered",
          method: function(e) {
            var sb = e.chart.chartDiv;
            sb.addEventListener("mouseup", onZoom.bind(this, e));
          }.bind(this)
        },
        {
          event: "zoomed",
          method: e => (e.chart.lastZoomed = e)
        }
      ]
    });
  }
}
