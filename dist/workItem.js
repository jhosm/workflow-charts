"use strict";
var WorkItem = /** @class */ (function () {
    function WorkItem(id, name, initialStateDate, finalStateDate) {
        this._id = id;
        this._name = name;
        var cycleTime = finalStateDate.diff(initialStateDate, 'days');
        if (initialStateDate && finalStateDate && finalStateDate.isValid()) {
            if (cycleTime > 0) {
                this._cycleTime = cycleTime;
                this._doneAt = finalStateDate;
            }
        }
    }
    Object.defineProperty(WorkItem.prototype, "doneAt", {
        get: function () {
            return this._doneAt;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkItem.prototype, "cycleTime", {
        get: function () {
            return this._cycleTime;
        },
        enumerable: true,
        configurable: true
    });
    return WorkItem;
}());
export default WorkItem;
//# sourceMappingURL=workItem.js.map