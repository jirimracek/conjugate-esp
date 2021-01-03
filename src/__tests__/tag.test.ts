/**
 * @copyright 
 * Copyright (c) 2020-2021 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020-2021 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
/* eslint-disable max-len */
import { Conjugator, Result } from '../index';
import { AnyModeKey, ImperativoSubKey, ImpersonalSubKey, IndicativoSubKey, SubjuntivoSubKey } from '../lib/types';
import { getRegions, shuffle, verbsToTest, monos } from './testdata';

// Disable thrown messages
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { /* empty */ });
});

console.warn = jest.fn();

const regionsToTest = getRegions();

// Verify that the start / end tags are consistent, i.e.: for each start tag there must be a closing end tag
describe('Highlight Tag Consistency Test', () => {
    const tags = { start: '<mark>', end: '</mark>', del: '\u2027' };
    const cng = new Conjugator('2010', tags);
    cng.setOrthography('1999');
    cng.useHighlight();

    // expect(cng.getHighlightMarks()).toEqual(tags);
    // cng.setHighlightMarks('foo' as unknown as HighlightMarks);
    // // expect(console.warn).toHaveBeenCalled();
    // expect(cng.getHighlightMarks()).toEqual(tags);

    // cng.setHighlightMarks(tags);
    // expect(cng.getHighlightMarks()).toEqual(tags);

    // Our array of interesting verbs and throw in a few more
    const toTest = shuffle(Array.from(new Set([...cng.getVerbListSync().splice(0, 200), ...verbsToTest, ... monos])));

    const emptyTags = tags.start + tags.end;

    toTest.forEach(verb => {
        regionsToTest.forEach(region => {
            test(`${region}, ortho 1999, tags:[${tags.start}, ${tags.end}, ${tags.del}]`, () => {
                (cng.conjugateSync(verb, region) as Result[]).forEach(result => {
                    const table = (result as Result).conjugation;
                    Object.keys(table).forEach(k => {
                        const key = k as AnyModeKey;
                        Object.keys(table[key]).forEach(sub => {
                            switch (key) {
                                case 'Impersonal':
                                    matchTags(table[key][sub as ImpersonalSubKey], tags);
                                    break;
                                case 'Indicativo':
                                    table[key][sub as IndicativoSubKey].forEach(t => matchTags(t, tags));
                                    break;
                                case 'Subjuntivo':
                                    table[key][sub as SubjuntivoSubKey].forEach(t => matchTags(t, tags));
                                    break;
                                case 'Imperativo':
                                    table[key][sub as ImperativoSubKey].forEach(t => matchTags(t, tags));
                                    break;
                            }
                        });
                    });
                });
            });
        });
    });

    function matchTags(text: string, tags: {start: string, end: string, del: string}): void {
        if (text === '-') {   // defective
            return;
        }
        let starts = 0;
        let ends = 0;
        let lastTag = tags.end;
        text.split('').forEach(character => {
            if (character === tags.start) {
                expect(lastTag).toEqual(tags.end);
                lastTag = tags.start;
                ++starts;
            } else if (character === tags.end) {
                expect(lastTag).toEqual(tags.start);
                lastTag = tags.end;
                ++ends;
            }
        });
        expect (starts).toEqual(ends);
        expect (text.includes(emptyTags)).toBe(false);
    }
});