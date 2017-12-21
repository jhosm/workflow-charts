"use strict";

import Papa from "papaparse";
import moment from "moment";
import _ from "lodash";
import WorkItem from "./workItem";
import WorkItemsCollection from "./workItemsCollection";

const STATE_PREFIX = "State.";

export default class WorkItemsLoader {
  getStateFields(fields) {
    return _.filter(fields, field => {
      if (_.startsWith(field, STATE_PREFIX)) return field;
    });
  }

  buildWorkItems(rawData) {
    let fields = rawData.meta.fields;
    let stateFields = this.getStateFields(fields);
    let initialState = stateFields[1];
    let finalState = stateFields[stateFields.length - 1];
    let result = _.map(rawData.data, dataItem => {
      let wi = new WorkItem(
        dataItem[fields[0]],
        dataItem[fields[1]],
        moment.utc(dataItem[initialState], "YYYYMMDD"),
        moment.utc(dataItem[finalState], "YYYYMMDD")
      );
      return wi;
    });
    return new WorkItemsCollection(result);
  }

  static async load() {
    let response = await fetch("/sampleData.htm");
    let data = await response.text();
    let results = Papa.parse(data, {
      header: true
    });
    return results;
  }
}
