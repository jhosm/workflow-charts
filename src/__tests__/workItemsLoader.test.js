"use strict;"

import fs from 'fs';
import WorkItemsLoader from '../workItemsLoader';
import Papa from 'papaparse';

describe('WorkItemsLoader', () => {

    let sampleData = '';
    let parsedSampleData = '';
    let loader = new WorkItemsLoader();

    beforeAll(() => {
        sampleData = fs.readFileSync(__dirname + '/testData.csv', 'utf8');
        parsedSampleData = Papa.parse(sampleData, {
            header: true
        });
    });

    describe('building work items', () => {
        let workItems;
        beforeAll(() => {
            workItems = loader.buildWorkItems(parsedSampleData).workItems;
        })

        it('should set id and name', () => {

            expect(workItems.size).toBe(4);
            expect(workItems.get(2)).toEqual(expect.objectContaining({
                _id: '100004',
                _name: 'Sample Item 4'
            }));
        });

        it('should calculate the cycle time when a work item is done', () => {
            expect(workItems.get(2).cycleTime).toBe(12);
        });

        it('should set the done date when a work item is done', () => {
            expect(workItems.get(2).doneAt.isSame("2017-11-28")).toBeTruthy();
        });

        it('should not calculate the cycle time when a work item is not done', () => {
            expect(workItems.get(0).cycleTime).toBeUndefined();
        });

    });

    it('should load and parse a csv', async () => {

        fetch.mockResponse(sampleData);

        let result = await WorkItemsLoader.load();
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
            {'﻿ID': ''}
        ]);
    });

});
