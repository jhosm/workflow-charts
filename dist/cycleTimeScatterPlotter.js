"use strict";
import Highcharts from "highcharts";
var CycleTimeScatterPlotter = /** @class */ (function() {
  function CycleTimeScatterPlotter(workItems) {
    var _this = this;
    var doneWorkItems = workItems.filter(function(workItem) {
      return workItem.doneAt != undefined;
    });
    this._data = doneWorkItems.workItems
      .map(function(doneWorkItem) {
        return [doneWorkItem.doneAt.valueOf(), doneWorkItem.cycleTime];
      })
      .toArray();
    this._plotLines = [];
    [50, 70, 85, 95].forEach(function(p) {
      var pValue = doneWorkItems.percentile(p);
      _this._plotLines.push({
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
  Object.defineProperty(CycleTimeScatterPlotter.prototype, "plotLines", {
    get: function() {
      return this._plotLines;
    },
    enumerable: true,
    configurable: true
  });
  CycleTimeScatterPlotter.prototype.plot = function() {
    Highcharts.chart("container", {
      chart: {
        type: "scatter",
        zoomType: "xy"
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
        },
        series: {
          point: {
            events: {
              mouseOver: function(e) {
                var chart = this.series.chart;
                if (!chart.lbl) {
                  chart.lbl = chart.renderer
                    .label("")
                    .attr({
                      padding: 10,
                      r: 10,
                      fill: Highcharts.getOptions().colors[1]
                    })
                    .css({
                      color: "#FFFFFF"
                    })
                    .add();
                }
                chart.lbl.show().attr({
                  text: "x: " + this.x + ", y: " + this.y
                });
                chart.xAxis[0].removePlotLine("plot-line-x");
                chart.yAxis[0].removePlotLine("plot-line-y");
                chart.xAxis[0].addPlotLine({
                  value: this.x,
                  color: "blue",
                  width: 2,
                  id: "plot-line-x"
                });
                chart.yAxis[0].addPlotLine({
                  value: this.y,
                  color: "red",
                  width: 2,
                  id: "plot-line-y"
                });
              }
            }
          },
          events: {
            mouseOut: function() {
              if (this.chart.lbl) {
                this.chart.lbl.hide();
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
  };
  return CycleTimeScatterPlotter;
})();
export default CycleTimeScatterPlotter;
//# sourceMappingURL=cycleTimeScatterPlotter.js.map
