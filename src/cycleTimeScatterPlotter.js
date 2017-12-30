"use strict";

import _ from "lodash";
import Highcharts from "highcharts";
import { List, Map } from "immutable";
import WorkItem from "./workItem";
import moment from "moment";

export default class CycleTimeScatterPlotter {
  constructor(workItems) {
    this._doneWorkItems = List(workItems).filter(workItem => {
      return workItem.doneAt != undefined;
    });
    const dataKeyedByDateAndCycleTime = this._doneWorkItems.reduce(
      (acc, doneWorkItem) => {
        const key = doneWorkItem.doneAt + "-" + doneWorkItem.cycleTime;
        if (!acc.has(key)) {
          return acc.set(key, {
            date: doneWorkItem.doneAt.toDate(),
            days: doneWorkItem.cycleTime,
            size: "",
            workItems: List([doneWorkItem])
          });
        } else {
          return acc.update(key, value => {
            if (value["size"] === "") {
              value["size"] = 2;
            } else if (value["size"] < 9) {
              value["size"] = value["size"] + 1;
            } else {
              value["size"] = "+";
            }
            value["workItems"] = value["workItems"].push(doneWorkItem);
            return value;
          });
        }
      },
      Map()
    );
    this._data = dataKeyedByDateAndCycleTime
      .valueSeq()
      .sortBy(datum => datum.date);
  }

  get workItems() {
    return this._doneWorkItems;
  }

  get chartData() {
    return this._data;
  }

  guides(workItems) {
    if (!workItems) workItems = this._doneWorkItems;
    return List([50, 70, 85, 95]).map(p => {
      let pValue = WorkItem.percentile(workItems, p);
      return {
        lineColor: "#111111",
        lineAlpha: 1,
        value: pValue,
        toValue: pValue,
        label: p + "% (" + pValue + "d)",
        id: "guides-x-" + p,
        dashLength: 2,
        lineThickness: 1,
        position: "right"
      };
    });
  }

  filterWorkItems({
    startDate = moment("20000101", "YYYYMMDD"),
    endDate = moment("21000101", "YYYYMMDD")
  } = {}) {
    return this._doneWorkItems.filter(doneWorkItem => {
      return (
        doneWorkItem.doneAt.isSameOrAfter(moment(startDate)) &&
        doneWorkItem.doneAt.isSameOrBefore(moment(endDate))
      );
    });
  }

  plot() {
    function onZoom(e) {
      e.chart.valueAxes[0].guides = this.guides(
        this.filterWorkItems({
          startDate: moment(e.chart.lastZoomed.startDate),
          endDate: moment(e.chart.lastZoomed.endDate)
        })
      ).toArray();
      e.chart.validateNow();
    }

    const chart = AmCharts.makeChart("cycleTimeScatterPlotContainer2", {
      type: "serial",
      theme: "light",
      titles: [
        {
          size: 15,
          text: "Cycle Time Scatter Plot"
        }
      ],
      marginRight: 80,
      autoMarginOffset: 20,
      marginTop: 7,
      dataProvider: this._data.toArray(),
      valueAxes: [
        {
          axisAlpha: 0.2,
          dashLength: 1,
          position: "left",
          guides: this.guides().toArray(),
          title: "CycleTime (days)"
        }
      ],
      graphs: [
        {
          id: "g1",
          balloonText: "# Items: [[size]]",
          bullet: "round",
          bulletBorderAlpha: 1,
          bulletSize: 10,
          lineAlpha: 0,
          labelText: "[[description]]",
          labelPosition: "middle",
          descriptionField: "size",
          valueField: "days",
          useLineColorForBulletBorder: true,
          balloon: {}
        }
      ],
      chartScrollbar: {
        graph: "g1",
        graphType: "column",
        oppositeAxis: false,
        offset: 30,
        scrollbarHeight: 80,
        autoGridCount: true
      },
      chartCursor: {
        balloonPointerOrientation: "vertical",
        valueLineEnabled: true,
        valueLineBalloonEnabled: true,
        pan: true
      },
      categoryField: "date",
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
            var sb = e.chart.chartScrollbar.set.node;
            sb.addEventListener("mouseup", onZoom.bind(this, e));
          }.bind(this)
        },
        {
          event: "zoomed",
          method: e => (e.chart.lastZoomed = e)
        }
      ]
    });
    chart.plotter = this;
  }
}
