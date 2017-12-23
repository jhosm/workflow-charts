"use strict";

import Papa from "papaparse";
import moment from "moment";
import _ from "lodash";
import { List } from "immutable";
import WorkItem from "./workItem";
import WorkItemsCollection from "./workItemsCollection";

const STATE_PREFIX = "State.";

export default class WorkItemsLoader {
  getStateFields(fields) {
    return fields.filter(field => {
      if (_.startsWith(field, STATE_PREFIX)) return field;
    });
  }

  buildWorkItems(rawData) {
    const fields = List(rawData.meta.fields);
    const stateFields = this.getStateFields(fields);
    const initialState = stateFields.get(1);
    const finalState = stateFields.last();

    const result = _(rawData.data)
      .filter(dataItem => {
        if (!dataItem[fields.get(0)]) return false;
        return true;
      })
      .map(dataItem => {
        const stateTransitions = stateFields.map(state => {
          const result = moment.utc(dataItem[state], "YYYYMMDD");
          if (!result.isValid()) return undefined;
          return result;
        });

        let wi = new WorkItem(
          dataItem[fields.get(0)],
          dataItem[fields.get(1)],
          stateTransitions,
          stateFields.map(state => _.trimStart(state, STATE_PREFIX))
        );
        return wi;
      });
    return new WorkItemsCollection(result);
  }

  static async load() {
    const response = await fetch("/sampleData.htm");
    const data = await response.text();
    const results = Papa.parse(data, {
      header: true
    });
    return results;
  }
}
