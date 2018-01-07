import WorkItem from "./workItem";
import { List, Map } from "immutable";

export function buildChartData(workItems, getXYValues) {
  const groupedChartData = workItems.reduce((acc, workItem) => {
    const { xValue, yValue } = getXYValues(workItem);
    const groupKey = xValue + yValue;
    if (!acc.has(groupKey)) {
      return acc.set(groupKey, {
        xValue: xValue,
        yValue: yValue,
        numberOfWorkItems: "",
        workItems: List([workItem])
      });
    } else {
      return acc.update(groupKey, value => {
        if (value["numberOfWorkItems"] === "") {
          value["numberOfWorkItems"] = 2;
        } else if (value["numberOfWorkItems"] < 9) {
          value["numberOfWorkItems"] = value["numberOfWorkItems"] + 1;
        } else {
          value["numberOfWorkItems"] = "+";
        }
        value["workItems"] = value["workItems"].push(workItem);
        return value;
      });
    }
  }, Map());
  return groupedChartData.valueSeq();
}

export function buildScatterGraph(id, graphOptions) {
  return Object.assign(
    {
      id: id,
      balloonFunction: (item, graph) => {
        return item.dataContext.workItems.reduce(
          (acc, wi) => acc + wi.id + "-" + wi.name + "<br/>",
          ""
        );
      },
      bullet: "round",
      bulletBorderAlpha: 1,
      bulletSize: 10,
      lineAlpha: 0,
      labelText: "[[description]]",
      labelPosition: "middle",
      descriptionField: "numberOfWorkItems",
      useLineColorForBulletBorder: true,
      balloon: {}
    },
    graphOptions
  );
}

export function buildPercentileGuides(workItems) {
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

export function buildChartCursor() {
  return {
    balloonPointerOrientation: "vertical",
    valueLineEnabled: true,
    valueLineBalloonEnabled: true,
    pan: true
  };
}
