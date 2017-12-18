"use strickt";
import _ from 'lodash';
import moment from 'moment';
import WorkItemsCollection from '../workItemsCollection';
import WorkItem from '../workItem';
it('should correctly calculate the percentile', function () {
    var workItemsSample = [];
    var baseDate = moment('20170101', 'YYYYMMDD');
    _.range(100).forEach(function (i) {
        var wi = new WorkItem(i, "wi_" + i, baseDate, baseDate.add(i, 'days'));
        workItemsSample.push(wi);
    });
    var wis = new WorkItemsCollection(workItemsSample);
    for (var i = 1; i < wis.workItems.length; i++) {
        expect(wis.percentile(i)).toBe(i - 1);
    }
});
//# sourceMappingURL=workItemsCollection.test.js.map