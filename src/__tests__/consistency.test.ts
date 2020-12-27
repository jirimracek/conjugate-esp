/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
/* eslint-disable max-len */
import { Conjugator, Result } from '../index';
import { getRegions, shuffle, verbsToTest, monos } from './testdata';

// Disable thrown messages
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { /* empty */});
});

console.warn = jest.fn();

const regionsToTest = getRegions();

const cng = new Conjugator();
const verbs = [...verbsToTest, ...cng.getModelsSync(), ...monos];
const toTest = shuffle(cng.getVerbListSync().filter(verb => verbs.includes(verb)));
// Conjugate each verb / region matrix - there is no verification whether the conjugation is correct
// we're just running functional testing here, we should be able to conjugate each verb / each region
describe('Conjugation Test', () => {
    toTest.forEach(verb => {
        regionsToTest.forEach(region => {
            test(`${verb} ${region} ortho 2010`, () => {
                cng.setOrthography('2010');
                const conjugations = cng.conjugateSync(verb, region) as Result[];
                expect(conjugations[0].info.region).toEqual(region);
                if (monos.includes(verb)) {
                    conjugations.forEach(c => expect(c.info.ortho).toEqual('2010'));
                } else {
                    conjugations.forEach(c => expect(c.info.ortho).toBeUndefined());
                }
            });
            test(`${verb} ${region} ortho 1999`, () => {
                cng.setOrthography('1999');
                const conjugations = cng.conjugateSync(verb, region) as Result[];
                expect(conjugations[0].info.region).toEqual(region);
                if (monos.includes(verb)) {
                    if (conjugations.length === 2) {
                        expect(conjugations[0].info.ortho).toEqual('2010');
                        expect(conjugations[1].info.ortho).toEqual('1999');
                    } else {
                        expect(conjugations[0].info.ortho).toEqual('2010');
                        expect(conjugations[1].info.ortho).toEqual('2010');
                        expect(conjugations[2].info.ortho).toEqual('1999');
                        expect(conjugations[3].info.ortho).toEqual('1999');
                    }
                } else {
                    conjugations.forEach(c => expect(c.info.ortho).toBeUndefined());
                }
            });
        });
    });
});

describe('Conjugate async', () => {
    const models: string[] = cng.getModelsSync();
    const verbs = shuffle([...verbsToTest, ...models]);
    test('Async', () => {
        return regionsToTest.forEach((region) => verbs.forEach((verb) => {
            cng.conjugate(verb, region).then((r) => {
                const result = r as Result[];
                expect(result[0].info.region).toBe(region);
                expect(result[0].conjugation.Impersonal.Infinitivo).toBe(verb);
            });
        }));
    });
});