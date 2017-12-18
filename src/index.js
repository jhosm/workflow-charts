"use strict";

import FlowDataLoader from './workItemsLoader';
import CycleTimeScatterPlotter from './cycleTimeScatterPlotter';

async function render() {

    let loader = new FlowDataLoader();
    let workItems = await FlowDataLoader.load();
    let x = new CycleTimeScatterPlotter(loader.buildWorkItems(workItems));
    x.plot();
}
render();

