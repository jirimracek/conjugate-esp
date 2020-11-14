/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
/* eslint-disable max-len */
import { Conjugator } from '../index';
import { Result, ErrorType } from '../lib/conjugator';
import { AnyModeKey, ImperativoSubKey, ImpersonalSubKey, IndicativoSubKey, SubjuntivoSubKey } from '../lib/types';
import { HighlightTags } from '../../dist/lib/types';
import { getRegions, shuffle } from './include';

// Disable thrown messages
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { /* empty */ });
});

console.warn = jest.fn();

const regionsToTest = getRegions();

// Verify that the start / end tags are consistent, i.e.: for each start tag there must be a closing end tag
describe('Highlight Tag Consistency Test', () => {
    const conjugator = new Conjugator();
    conjugator.setOrthography('1999');
    expect(conjugator.getOrthography()).toEqual('1999');

    expect(conjugator.getHighlightTags()).toEqual({ start: '', end: '', deleted: '' });
    conjugator.setHighlightTags('foo' as unknown as HighlightTags);
    expect(console.warn).toHaveBeenCalled();
    expect(conjugator.getHighlightTags()).toEqual({ start: '', end: '', deleted: '' });

    const tags = { start: '.', end: '-', deleted: '*' };
    conjugator.setHighlightTags(tags);
    expect(conjugator.getHighlightTags()).toEqual({ start: '.', end: '-', deleted: '*' });

    // Test random 200 verbs
    const toTest = shuffle(conjugator.getVerbListSync()).splice(0, 200);

    const emptyTags = tags.start + tags.end;
    // const redundantEnd = tags.start + tags.deleted + tags.end;
    // TODO: check for combo of things that shouldn't happen, for ex.: .-.*-
    //       need to reorganize tests

    toTest.forEach(verb => {
        regionsToTest.forEach(region => {
            test(`${region}, ortho 1999, highlight tags '-','.'`, () => {
                const conjugations: Result[] | ErrorType = conjugator.conjugateSync(verb, region);
                if (!Array.isArray(conjugations)) {
                    fail(conjugations);
                }
                conjugations.forEach(result => {
                    const table = (result as Result).conjugation;
                    Object.keys(table).forEach(key => {
                        const modeKey = key as AnyModeKey;
                        Object.keys(table[modeKey]).forEach(subKey => {
                            switch (modeKey) {
                                case 'Impersonal':
                                    matchTags(table[modeKey][subKey as ImpersonalSubKey]);
                                    break;
                                case 'Indicativo':
                                    table[modeKey][subKey as IndicativoSubKey].forEach(t => matchTags(t));
                                    break;
                                case 'Subjuntivo':
                                    table[modeKey][subKey as SubjuntivoSubKey].forEach(t => matchTags(t));
                                    break;
                                case 'Imperativo':
                                    table[modeKey][subKey as ImperativoSubKey].forEach(t => matchTags(t));
                                    break;
                            }
                        });
                    });
                });
            });
        });
    });

    function matchTags(text: string): void {
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