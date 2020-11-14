/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
/* eslint-disable max-len */
import { Conjugator } from '../index';
import { Info, Result, ErrorType } from '../lib/conjugator';
import { Orthography } from '../lib/types';
import { getRegions, shuffle, verbsToTest } from './include';

// Disable thrown messages
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { /* empty */ });
});

console.warn = jest.fn();

const regionsToTest = getRegions();
const monos = ['freír', 'reír', 'puar', 'ruar', 'chiar', 'ciar', 'criar', 'fiar', 'guiar', 'liar', 'miar', 'piar', 'triar', 'fluir', 'fruir', 'gruir', 'huir', 'luir', 'muir'];

// Conjugate each verb / region matrix - there is no verification whether the conjugation is correct
// we're just running functional testing here, we should be able to conjugate each verb / each region
describe('Conjugation Test', () => {
    const conjugator = new Conjugator();
    const verbs = [...verbsToTest(), ...conjugator.getModelsSync()];
    const toTest = shuffle(conjugator.getVerbListSync().filter(verb => verbs.includes(verb)));
    toTest.forEach(verb => {
        regionsToTest.forEach(region => {
            test(`${region} ortho 2010`, () => {
                conjugator.setOrthography('2010');
                const conjugations: Result[] | ErrorType = conjugator.conjugateSync(verb, region);
                if (!Array.isArray(conjugations)) {
                    fail(conjugations);
                }
                expect((conjugations[0].info as Info)['verb']).
                    toEqual((conjugations[0].info as Info)['pronominal'] === true ? `${verb}se` : verb);
                expect((conjugations[0].info as Info)['region']).toEqual(region);
                if (monos.includes(verb) || monos.includes(`${verb}se`)) {
                    conjugations.forEach(c => expect(c.info.ortho).toEqual('2010'));
                } else {
                    conjugations.forEach(c => expect(c.info.ortho).toBeUndefined());
                }
            });
            test(`${region} ortho 1999`, () => {
                conjugator.setOrthography('1999');
                const conjugations: Result[] | ErrorType = conjugator.conjugateSync(verb, region);
                if (!Array.isArray(conjugations)) {
                    fail(conjugations);
                }
                expect((conjugations[0].info as Info)['verb']).
                    toEqual((conjugations[0].info as Info)['pronominal'] === true ? `${verb}se` : verb);
                expect((conjugations[0].info as Info)['region']).toEqual(region);
                if (monos.includes(verb) || monos.includes(`${verb}se`)) {
                    conjugations.forEach(c => expect(c.info.ortho).toEqual(expect.stringMatching(/2010|1999/)));
                } else {
                    conjugations.forEach(c => expect(c.info.ortho).toBeUndefined());
                }
            });
        });
    });
});

// This is really a verification test, no longer just functional.  But, it doesn't take too much to verify.
describe('Info Header Ortho', () => {
    const conjugator = new Conjugator();
    expect(conjugator.getOrthography()).toEqual('2010');

    conjugator.setOrthography('2000' as Orthography);
    expect(console.warn).toHaveBeenCalled();
    expect(conjugator.getOrthography()).not.toEqual('2000');

    conjugator.setOrthography('1999');
    expect(conjugator.getOrthography()).toEqual('1999');

    // verbs with ortho M flags (monosyllables correction as per 2010)
    monos.forEach(verb => {
        regionsToTest.forEach(region => {
            // 2010 has only the short versions
            test(`info header ${region} ortho 2010`, () => {
                conjugator.setOrthography('2010');
                const conjugations: Result[] | ErrorType = conjugator.conjugateSync(verb, region);
                if (!Array.isArray(conjugations)) {
                    fail(conjugations);
                }
                conjugations.forEach(c => {
                    expect(c.info.ortho).toEqual('2010');
                    // reír, freír
                    if (c.info.verb.match(/.*(reír|reírse)$/)) {
                        expect(c.conjugation.Indicativo.PreteritoIndefinido[2]).toEqual(expect.stringMatching(/.*rio$/));
                        if (c.info.region === 'castellano') {
                            expect(c.conjugation.Subjuntivo.Presente[4]).toEqual(expect.stringMatching(/.*riais$/));
                        }
                    }
                    // fluir, fruir, gruir, huir, luir, muir
                    if (c.info.verb.match(/.*(uir|uirse)$/)) {
                        expect(c.conjugation.Indicativo.PreteritoIndefinido[0]).toEqual(expect.stringMatching(/.*ui$/));
                        if (c.info.region === 'castellano') {
                            expect(c.conjugation.Indicativo.Presente[4]).toEqual(expect.stringMatching(/.*uis$/));
                        }
                        if (c.info.region === 'voseo') {
                            expect(c.conjugation.Indicativo.Presente[1]).toEqual(expect.stringMatching(/.*uis$/));
                            if (c.info.pronominal) {
                                expect(c.conjugation.Imperativo.Afirmativo[1]).toEqual(expect.stringMatching(/.*uite$/));
                            } else {
                                expect(c.conjugation.Imperativo.Afirmativo[1]).toEqual(expect.stringMatching(/.*ui$/));
                            }
                        }
                    }
                    // puar, ruar
                    if (c.info.verb.match(/.*uar$/)) {
                        expect(c.conjugation.Indicativo.PreteritoIndefinido[0]).toEqual(expect.stringMatching(/.*ue$/));
                        expect(c.conjugation.Indicativo.PreteritoIndefinido[2]).toEqual(expect.stringMatching(/.*uo$/));
                        if (c.info.region === 'castellano') {
                            expect(c.conjugation.Indicativo.Presente[4]).toEqual(expect.stringMatching(/.*ais$/));
                        }
                        if (c.info.region === 'voseo') {
                            expect(c.conjugation.Indicativo.Presente[1]).toEqual(expect.stringMatching(/.*uas$/));
                            expect(c.conjugation.Imperativo.Afirmativo[1]).toEqual(expect.stringMatching(/.*ua$/));
                        }
                        if (c.info.region === 'formal') {
                            expect(c.conjugation.Indicativo.PreteritoIndefinido[1]).toEqual(expect.stringMatching(/.*uo$/));
                        }
                    }
                    // chiar, ciar, criar, fiar, guiar, liar, miar, piar, triar, 
                    if (c.info.verb.match(/.*(iar|iarse)$/)) {
                        expect(c.conjugation.Indicativo.PreteritoIndefinido[0]).toEqual(expect.stringMatching(/.*ie$/));
                        expect(c.conjugation.Indicativo.PreteritoIndefinido[2]).toEqual(expect.stringMatching(/.*io$/));
                        if (c.info.region === 'castellano') {
                            expect(c.conjugation.Indicativo.Presente[4]).toEqual(expect.stringMatching(/.*ais$/));
                        }
                        if (c.info.region === 'voseo') {
                            expect(c.conjugation.Indicativo.Presente[1]).toEqual(expect.stringMatching(/.*ias$/));
                            if (c.info.pronominal) {
                                expect(c.conjugation.Imperativo.Afirmativo[1]).toEqual(expect.stringMatching(/.*iate$/));
                            } else {
                                expect(c.conjugation.Imperativo.Afirmativo[1]).toEqual(expect.stringMatching(/.*ia$/));
                            }
                        }
                        if (c.info.region === 'formal') {
                            expect(c.conjugation.Indicativo.PreteritoIndefinido[1]).toEqual(expect.stringMatching(/.*io$/));
                        }
                    }
                });
            });
            // 1999 ortho has both
            test(`info header ${region} ortho 1999`, () => {
                conjugator.setOrthography('1999');
                const conjugations: Result[] | ErrorType = conjugator.conjugateSync(verb, region);
                if (!Array.isArray(conjugations)) {
                    fail(conjugations);
                }
                conjugations.forEach(c => {
                    expect(c.info.ortho).toBeDefined();
                    if (c.info.ortho === '2010') {
                        if (c.info.verb.match(/.*(reír|reírse)$/)) {
                            // reír, freír
                            expect(c.conjugation.Indicativo.PreteritoIndefinido[2]).toEqual(expect.stringMatching(/.*rio$/));
                            if (c.info.region === 'castellano') {
                                expect(c.conjugation.Subjuntivo.Presente[4]).toEqual(expect.stringMatching(/.*riais$/));
                            }
                        }
                        // fluir, fruir, gruir, huir, luir, muir
                        if (c.info.verb.match(/.*(uir|uirse)$/)) {
                            expect(c.conjugation.Indicativo.PreteritoIndefinido[0]).toEqual(expect.stringMatching(/.*ui$/));
                            if (c.info.region === 'castellano') {
                                expect(c.conjugation.Indicativo.Presente[4]).toEqual(expect.stringMatching(/.*uis$/));
                            }
                            if (c.info.region === 'voseo') {
                                expect(c.conjugation.Indicativo.Presente[1]).toEqual(expect.stringMatching(/.*uis$/));
                                if (c.info.pronominal) {
                                    expect(c.conjugation.Imperativo.Afirmativo[1]).toEqual(expect.stringMatching(/.*uite$/));
                                } else {
                                    expect(c.conjugation.Imperativo.Afirmativo[1]).toEqual(expect.stringMatching(/.*ui$/));
                                }
                            }
                        }
                        if (c.info.verb.match(/.*uar$/)) {
                            expect(c.conjugation.Indicativo.PreteritoIndefinido[0]).toEqual(expect.stringMatching(/.*ue$/));
                            expect(c.conjugation.Indicativo.PreteritoIndefinido[2]).toEqual(expect.stringMatching(/.*uo$/));
                            if (c.info.region === 'castellano') {
                                expect(c.conjugation.Indicativo.Presente[4]).toEqual(expect.stringMatching(/.*ais$/));
                            }
                            if (c.info.region === 'voseo') {
                                expect(c.conjugation.Indicativo.Presente[1]).toEqual(expect.stringMatching(/.*uas$/));
                                expect(c.conjugation.Imperativo.Afirmativo[1]).toEqual(expect.stringMatching(/.*ua$/));
                            }
                            if (c.info.region === 'formal') {
                                expect(c.conjugation.Indicativo.PreteritoIndefinido[1]).toEqual(expect.stringMatching(/.*uo$/));
                            }
                        }
                        if (c.info.verb.match(/.*(iar|iarse)$/)) {
                            expect(c.conjugation.Indicativo.PreteritoIndefinido[0]).toEqual(expect.stringMatching(/.*ie$/));
                            expect(c.conjugation.Indicativo.PreteritoIndefinido[2]).toEqual(expect.stringMatching(/.*io$/));
                            if (c.info.region === 'castellano') {
                                expect(c.conjugation.Indicativo.Presente[4]).toEqual(expect.stringMatching(/.*ais$/));
                            }
                            if (c.info.region === 'voseo') {
                                expect(c.conjugation.Indicativo.Presente[1]).toEqual(expect.stringMatching(/.*ias$/));
                                if (c.info.pronominal) {
                                    expect(c.conjugation.Imperativo.Afirmativo[1]).toEqual(expect.stringMatching(/.*iate$/));
                                } else {
                                    expect(c.conjugation.Imperativo.Afirmativo[1]).toEqual(expect.stringMatching(/.*ia$/));
                                }
                            }
                            if (c.info.region === 'formal') {
                                expect(c.conjugation.Indicativo.PreteritoIndefinido[1]).toEqual(expect.stringMatching(/.*io$/));
                            }
                        }
                    } else if (c.info.ortho === '1999') {
                        if (c.info.verb.match(/.*(reír|reírse)$/)) {
                            expect(c.conjugation.Indicativo.PreteritoIndefinido[2]).toEqual(expect.stringMatching(/.*rió$/));
                            if (c.info.region === 'castellano') {
                                expect(c.conjugation.Subjuntivo.Presente[4]).toEqual(expect.stringMatching(/.*riáis$/));
                            }
                        }
                        // fluir, fruir, gruir, huir, luir, muir
                        if (c.info.verb.match(/.*(uir|uirse)$/)) {
                            expect(c.conjugation.Indicativo.PreteritoIndefinido[0]).toEqual(expect.stringMatching(/.*uí$/));
                            if (c.info.region === 'castellano') {
                                expect(c.conjugation.Indicativo.Presente[4]).toEqual(expect.stringMatching(/.*uís$/));
                            }
                            if (c.info.region === 'voseo') {
                                expect(c.conjugation.Indicativo.Presente[1]).toEqual(expect.stringMatching(/.*uís$/));
                                if (c.info.pronominal) {
                                    expect(c.conjugation.Imperativo.Afirmativo[1]).toEqual(expect.stringMatching(/.*uite$/));
                                } else {
                                    expect(c.conjugation.Imperativo.Afirmativo[1]).toEqual(expect.stringMatching(/.*uí$/));
                                }
                            }
                        }
                        if (c.info.verb.match(/.*uar$/)) {
                            expect(c.conjugation.Indicativo.PreteritoIndefinido[0]).toEqual(expect.stringMatching(/.*ué$/));
                            expect(c.conjugation.Indicativo.PreteritoIndefinido[2]).toEqual(expect.stringMatching(/.*uó$/));
                            if (c.info.region === 'castellano') {
                                expect(c.conjugation.Indicativo.Presente[4]).toEqual(expect.stringMatching(/.*áis$/));
                            }
                            if (c.info.region === 'voseo') {
                                expect(c.conjugation.Indicativo.Presente[1]).toEqual(expect.stringMatching(/.*uás$/));
                                expect(c.conjugation.Imperativo.Afirmativo[1]).toEqual(expect.stringMatching(/.*uá$/));
                            }
                            if (c.info.region === 'formal') {
                                expect(c.conjugation.Indicativo.PreteritoIndefinido[1]).toEqual(expect.stringMatching(/.*uó$/));
                            }
                        }
                        if (c.info.verb.match(/.*(iar|iarse)$/)) {
                            expect(c.conjugation.Indicativo.PreteritoIndefinido[0]).toEqual(expect.stringMatching(/.*ié$/));
                            expect(c.conjugation.Indicativo.PreteritoIndefinido[2]).toEqual(expect.stringMatching(/.*ió$/));

                            if (c.info.region === 'castellano') {
                                expect(c.conjugation.Indicativo.Presente[4]).toEqual(expect.stringMatching(/.*áis$/));
                            }
                            if (c.info.region === 'voseo') {
                                expect(c.conjugation.Indicativo.Presente[1]).toEqual(expect.stringMatching(/.*iás$/));
                                if (c.info.pronominal) {
                                    expect(c.conjugation.Imperativo.Afirmativo[1]).toEqual(expect.stringMatching(/.*iate$/));
                                } else {
                                    expect(c.conjugation.Imperativo.Afirmativo[1]).toEqual(expect.stringMatching(/.*iá$/));
                                }
                            }
                            if (c.info.region === 'formal') {
                                expect(c.conjugation.Indicativo.PreteritoIndefinido[1]).toEqual(expect.stringMatching(/.*ió$/));
                            }
                        }
                    }
                });
            });
        });
    });
});
