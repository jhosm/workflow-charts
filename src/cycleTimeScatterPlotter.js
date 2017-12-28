"use strict";

import _ from "lodash";
import Highcharts from "highcharts";
import { List, Map } from "immutable";
import WorkItemsCollection from "./workItemsCollection";
import moment from "moment";

export default class CycleTimeScatterPlotter {
  constructor(workItems) {
    this._doneWorkItems = workItems.filter(workItem => {
      return workItem.doneAt != undefined;
    });
    this._data = this._doneWorkItems.workItems.reduce((acc, doneWorkItem) => {
      const key = doneWorkItem.doneAt + "-" + doneWorkItem.cycleTime;
      if (!acc[key]) {
        acc[key] = {
          date: doneWorkItem.doneAt.toDate(),
          days: doneWorkItem.cycleTime,
          size: "",
          workItems: List([doneWorkItem])
        };
      } else {
        if (acc[key]["size"] === "") {
          acc[key]["size"] = 2;
        } else if (acc[key]["size"] < 9) {
          acc[key]["size"] = acc[key]["size"] + 1;
        } else {
          acc[key]["size"] = "+";
        }
        acc[key]["workItems"].push(doneWorkItem);
      }
      return acc;
    }, {});
    this._data = _.values(this._data);
    this._data = _.sortBy(this._data, datum => datum.date);
  }

  get workItems() {
    return this._doneWorkItems;
  }

  guides(workItems) {
    if (!workItems) workItems = this._doneWorkItems;
    return [50, 70, 85, 95].map(p => {
      let pValue = workItems.percentile(p);
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
          startDate: moment(e.startDate),
          endDate: moment(e.endDate)
        })
      );
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
      dataProvider: this._data,
      valueAxes: [
        {
          axisAlpha: 0.2,
          dashLength: 1,
          position: "left",
          guides: this.guides(),
          title: "CycleTime (days)"
        }
      ],
      mouseWheelZoomEnabled: true,
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
            // set up generic mouse events
            var sb = e.chart.chartScrollbar.set.node;
            sb.addEventListener("mousedown", function() {
              e.chart.mouseIsDown = true;
            });
            e.chart.chartDiv.addEventListener("mouseup", function() {
              e.chart.mouseIsDown = false;
              e.chart.valueAxes[0].guides = chart.plotter.guides(
                chart.plotter.filterWorkItems({
                  startDate: moment(e.chart.lastZoomed.startDate),
                  endDate: moment(e.chart.lastZoomed.endDate)
                })
              );
              e.chart.validateNow();
              // zoomed finished
              console.log("zoom finished", e.chart.lastZoomed);
            });
          }
        },
        {
          event: "zoomed",
          method: function(e) {
            e.chart.lastZoomed = e;
            console.log("ignoring zoomed");
          }
        }
      ]
    });
    chart.plotter = this;
    /*
chart.addListener("rendered", zoomChart);
zoomChart();

// this method is called when chart is first inited as we listen for "rendered" event
function zoomChart() {
  // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
  chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
}

*/
    /*    AmCharts.makeChart("cycleTimeScatterPlotContainer", {
      type: "serial",
      theme: "light",
      autoMarginOffset: 20,
      dataDateFormat: "YYYY-MM-DD",
      dataProvider: this._data,
      valueAxes: [
        {
          position: "bottom",
          axisAlpha: 0,
          dashLength: 1,
          type: "date",
          title: "Done Date",
          listeners: [
            {
              event: "axisZoomed",
              method: _.bind(onZoom, this)
            }
          ]
        },
        {
          axisAlpha: 0,
          dashLength: 1,
          position: "left",
          title: "Cycle Time",
          guides: this.guides()
        }
      ],
      graphs: [
        {
          id: "g1",
          balloonText: "x:[[x]] y:[[y]]",
          bullet: "circle",
          lineAlpha: 0,
          xField: "date",
          yField: "days",
          valueField: "size",
          lineColor: "#FF6600",
          fillAlphas: 0,
          bulletSize: 20,
          labelText: "[[value]]",
          labelPosition: "middle"
        }
      ],
      chartScrollbar: {
        enabled: false
      },
      marginLeft: 64,
      marginRight: 84,
      marginBottom: 60,
      chartCursor: {}
    });*/
  }
}
