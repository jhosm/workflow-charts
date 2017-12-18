"use strict;";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import fs from 'fs';
import WorkItemsLoader from '../workItemsLoader';
import Papa from 'papaparse';
describe('WorkItemsLoader', function () {
    var sampleData = '';
    var parsedSampleData = '';
    var loader = new WorkItemsLoader();
    beforeAll(function () {
        sampleData = fs.readFileSync(__dirname + '/testData.csv', 'utf8');
        parsedSampleData = Papa.parse(sampleData, {
            header: true
        });
    });
    describe('building work items', function () {
        var workItems;
        beforeAll(function () {
            workItems = loader.buildWorkItems(parsedSampleData).workItems;
        });
        it('should set id and name', function () {
            expect(workItems.size).toBe(4);
            expect(workItems.get(2)).toEqual(expect.objectContaining({
                _id: '100004',
                _name: 'Sample Item 4'
            }));
        });
        it('should calculate the cycle time when a work item is done', function () {
            expect(workItems.get(2).cycleTime).toBe(12);
        });
        it('should set the done date when a work item is done', function () {
            expect(workItems.get(2).doneAt.isSame("2017-11-28")).toBeTruthy();
        });
        it('should not calculate the cycle time when a work item is not done', function () {
            expect(workItems.get(0).cycleTime).toBeUndefined();
        });
    });
    it('should load and parse a csv', function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetch.mockResponse(sampleData);
                    return [4 /*yield*/, WorkItemsLoader.load()];
                case 1:
                    result = _a.sent();
                    expect(result.meta.fields).toEqual([
                        '﻿ID',
                        'Name',
                        'State.Backlog',
                        'State.Analysis Active',
                        'State.Analysis Done',
                        'State.Dev Active',
                        'State.Dev Done',
                        'State.Testing',
                        'State.Done',
                        'Team',
                        'Type',
                        'Blocked Days',
                        'Labels'
                    ]);
                    expect(result.data).toEqual([
                        {
                            '﻿ID': '100001',
                            Name: 'Sample Item 1',
                            'State.Backlog': '20170709',
                            'State.Analysis Active': '20171121',
                            'State.Analysis Done': '20171121',
                            'State.Dev Active': '20171129',
                            'State.Dev Done': '20171129',
                            'State.Testing': '20171129',
                            'State.Done': '',
                            Team: 'Team 3',
                            Type: 'User Story',
                            'Blocked Days': '2',
                            Labels: ''
                        },
                        {
                            '﻿ID': '100002',
                            Name: 'Sample Item 2',
                            'State.Backlog': '20170709',
                            'State.Analysis Active': '20171120',
                            'State.Analysis Done': '20171120',
                            'State.Dev Active': '20171120',
                            'State.Dev Done': '20171129',
                            'State.Testing': '20171129',
                            'State.Done': '',
                            Team: 'Team 4',
                            Type: 'User Story',
                            'Blocked Days': '0',
                            Labels: ''
                        },
                        {
                            '﻿ID': '100004',
                            Name: 'Sample Item 4',
                            'State.Backlog': '20170709',
                            'State.Analysis Active': '20171116',
                            'State.Analysis Done': '20171116',
                            'State.Dev Active': '20171128',
                            'State.Dev Done': '20171128',
                            'State.Testing': '20171128',
                            'State.Done': '20171128',
                            Team: 'Team 4',
                            Type: 'User Story',
                            'Blocked Days': '3',
                            Labels: '[A]'
                        },
                        { '﻿ID': '' }
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=workItemsLoader.test.js.map