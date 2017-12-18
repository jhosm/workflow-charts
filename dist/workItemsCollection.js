"use strict";
import { List, Seq } from 'immutable';
import { percentile } from './percentile';
var WorkItemsCollection = /** @class */ (function () {
    function WorkItemsCollection(workItems) {
        this._workItems = List(workItems);
    }
    Object.defineProperty(WorkItemsCollection.prototype, "workItems", {
        get: function () {
            return this._workItems;
        },
        enumerable: true,
        configurable: true
    });
    WorkItemsCollection.prototype.filter = function (predicate) {
        var filteredWorkItems = this.workItems.filter(predicate);
        return new WorkItemsCollection(filteredWorkItems);
    };
    WorkItemsCollection.prototype.percentile = function (p) {
        var workItemsCycleTimes = Seq(this.workItems)
            .map(function (wi) { return wi.cycleTime; })
            .sort(function (a, b) { return a - b; });
        var result = Math.ceil(percentile(workItemsCycleTimes.toArray(), p / 100)) + 1;
        return result;
    };
    return WorkItemsCollection;
}());
export default WorkItemsCollection;
//# sourceMappingURL=workItemsCollection.js.map