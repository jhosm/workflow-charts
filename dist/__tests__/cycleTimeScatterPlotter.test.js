"use strickt";
import _ from 'lodash';
import moment from 'moment';
import CycleTimeScatterPlotter from "../cycleTimeScatterPlotter";
import WorkItemsCollection from '../workItemsCollection';
import WorkItem from '../workItem';
it('should correctly calculate the percentile', function () {
    var workItemsSample = [];
    var baseDate = moment('20170101', 'YYYYMMDD');
    _.range(100).forEach(function (i) {
        var baseDatePlusOne = baseDate.clone();
        baseDatePlusOne.add(i, 'days');
        var wi = new WorkItem(i, "wi_" + i, baseDate, baseDatePlusOne);
        workItemsSample.push(wi);
    });
    var plotter = new CycleTimeScatterPlotter(new WorkItemsCollection(workItemsSample));
    expect(plotter.plotLines[0]).toEqual(expect.objectContaining({
        value: 84,
        id: 'plot-line-x-85'
    }));
});
//# sourceMappingURL=cycleTimeScatterPlotter.test.js.map