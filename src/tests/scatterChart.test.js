"use strict";

import { buildScatterGraph } from "../scatterChart";

it("should build the scatter graph", () => {
  const graph = buildScatterGraph("myGraph", { valueField: "aField" });
  expect(graph.id).toBe("myGraph");
  expect(graph.valueField).toBe("aField");
});
