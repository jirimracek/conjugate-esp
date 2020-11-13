/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
/* eslint-disable max-len */
import { Conjugator } from '../index';
import { Info, Result, ErrorType, VerbModelData, VerbModelTemplates } from '../lib/conjugator';
import { ModelFactory } from '../lib/factory';
import { AnyModeKey, ImperativoSubKey, ImpersonalSubKey, IndicativoSubKey, Regions, SubjuntivoSubKey } from '../lib/types';
import { errorMsg } from '../lib/conjugator';
import { Orthography } from '../../dist/lib/types';
import { HighlightTags } from '../../dist/lib/types';

const VERB_COUNT = 10567;
const MODEL_COUNT = 97;
// Disable thrown messages
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { /* empty */ });
    // jest.spyOn(console, 'warn').mockImplementation(jest.fn());

});

console.warn = jest.fn();
// shuffle lists so we don't test in the same order every time
function shuffle(array: string[]): string[] {
    let count = array.length, temp, index;
    while (count) {
        // Pick remaining 
        index = Math.floor(Math.random() * count--);
        // swap with current 
        temp = array[count];
        array[count] = array[index];
        array[index] = temp;
    }
    return array;
}

let verbsToTest: string[] = [];
const regionsToTest = shuffle(['castellano', 'voseo', 'formal', 'canarias']) as Regions[];
const verbSet: Set<string> = new Set();
const temp = new Conjugator();
const models: string[] = temp.getModelsSync();
models.forEach(m => verbSet.add(m));
// some interesting verbs
verbSet.add('abar');        // the only known trimorfo              
verbSet.add('abolir');      // interesting imorfo                   
verbSet.add('acostumbrar');  // omorfo                              
verbSet.add('aclarar');     // dual, defective                      
verbSet.add('acontecer');   // single defective                     
verbSet.add('adecuar');     // dual, non defective                  
verbSet.add('antojar');     // defective terciopersonal v2          
verbSet.add('balbucir');    // combo of ir & ar verb, very unique
verbSet.add('colorir');     // imorfo                               
verbSet.add('condecir');    // the decir family of differences      
verbSet.add('chiar');       // monosyllables
verbSet.add('ciar');       // monosyllables
verbSet.add('criar');       // monosyllables
verbSet.add('degollar');    // contar, o -> üe
verbSet.add('derrocar');    // dual volcar, sacar                   
verbSet.add('desvaír');     // dual, ír, defective in both N&P      
verbSet.add('embaír');
verbSet.add('empecer');      // the only known tercio               
verbSet.add('empedernir');  // the only bimorfop, dual defective    
verbSet.add('errar');       // err -> yerr                          
verbSet.add('escribir');
verbSet.add('erguir');
verbSet.add('fiar');       // monosyllables
verbSet.add('fluir');       // monosyllables
verbSet.add('freír');       // monosyllables, dual participio
verbSet.add('fruir');       // monosyllables
verbSet.add('guiar');       // dual vaciar, monosyllables           
verbSet.add('gruir');       // monosyllables
verbSet.add('huir');       // monosyllables
verbSet.add('inhestar');    // participio irregular, replace        
verbSet.add('imprimir');
verbSet.add('ir');
verbSet.add('liar');       // monosyllables
verbSet.add('luir');       // monosyllables
verbSet.add('marcir');      // eimorfo                              
verbSet.add('miar');       // monosyllables
verbSet.add('morir');
verbSet.add('muir');       // monosyllables
verbSet.add('piar');       // monosyllables
verbSet.add('predecir');    // the decir family of differences
verbSet.add('pringar');     // dual pagar                           
verbSet.add('proscribir');
verbSet.add('proveer');
verbSet.add('puar');        // dual, monosyllables                  
verbSet.add('raspahilar');  // the only bimorfog we have
verbSet.add('redecir');     // the decir family of differences
verbSet.add('reír');
verbSet.add('reponer');     // ogmorfo                              
verbSet.add('responder');   // in the list already, quite unique, repuse version   
verbSet.add('ruar');       // monosyllables
verbSet.add('satisfacer');
verbSet.add('serenar');     // triple, defective in one, N&P        
verbSet.add('sofreír');
verbSet.add('soler');       // the name said it all                 
verbSet.add('triar');       // monosyllables
verbSet.add('tronar');      // from contar                          
verbSet.add('ventar');      // triple, defective                    


const verbs: string[] = Array.from(verbSet);

// Derive to get access to templates
class MockJugator extends Conjugator {
    private savedTemplates: VerbModelTemplates;
    private savedFactory: ModelFactory;
    constructor() {
        super();
        // Make duplicates
        this.templates = JSON.parse(JSON.stringify(this.templates));
        this.savedTemplates = JSON.parse(JSON.stringify(this.templates));
        this.savedFactory = this.factory;
    }
    public deleteTemplates(): void {
        this.templates = undefined as unknown as VerbModelTemplates;
    }
    public undefineModelData(verb: string): void {
        this.templates[verb] = undefined as unknown as VerbModelData;
    }
    public restore(): void {
        this.templates = JSON.parse(JSON.stringify(this.savedTemplates));
        this.factory = this.savedFactory;
    }
    public fakeUnimplemented(verb: string, model: string): void {
        this.templates[verb] = { 'N': model } as VerbModelData;
    }
    public deleteFactory(): void {
        this.factory = undefined as unknown as ModelFactory;
    }
}

// Test synchronous functions
describe('Model Test Sync', () => {
    test('Internals Sync', () => {
        // expect correct data
        let mockjugator = new MockJugator();
        let result: Result[] | ErrorType = mockjugator.conjugateSync('partir', 'formal');
        expect(result).toBeInstanceOf(Array);
        expect(((result as Result[])[0].info as Info).model).toEqual('partir');

        // undefine verb model data in templates, expect error message
        mockjugator.undefineModelData('partir');
        result = mockjugator.conjugateSync('partir', 'formal');
        expect(result).not.toBeInstanceOf(Array);
        expect(result).toEqual({ ERROR: { message: errorMsg.noModelData.replace('VERB', 'partir') } });

        // restore to valid state, verify it's good
        mockjugator = new MockJugator();
        result = mockjugator.conjugateSync('partir', 'formal');
        expect(result).toBeInstanceOf(Array);
        expect(((result as Result[])[0].info as Info).region).toEqual('formal');

        // break it, expect error message
        mockjugator.deleteTemplates();
        result = mockjugator.conjugateSync('hablar', 'castellano');
        expect(result).not.toBeInstanceOf(Array);
        expect(result as ErrorType).toEqual({ ERROR: { message: errorMsg.noTemplates } });

        // expect error message again, can't get verblist
        expect(mockjugator.getVerbListSync()).toEqual([errorMsg.noVerbs]);

        // really break it, no factory, expect error
        mockjugator.deleteFactory();
        expect(mockjugator.getModelsSync()).toEqual([errorMsg.noModels]);

        // restore to valid state, verify it's good
        mockjugator = new MockJugator();
        result = mockjugator.conjugateSync('comer', 'voseo');
        expect(result).toBeInstanceOf(Array);
        expect(((result as Result[])[0].info as Info).verb).toEqual('comer');

        // polute the db with verb:model that isn't implemented, expect error
        mockjugator.fakeUnimplemented('foobar', 'bar');
        result = mockjugator.conjugateSync('foobar');
        expect(result).not.toBeInstanceOf(Array);
        expect(result).
            toEqual({
                ERROR: {
                    message: errorMsg.unknownModel.replace(/MODEL(.*)VERB(.*)REGION/,
                        'bar$1foobar$2castellano')
                }
            });

        // Force bad region, expect error
        mockjugator.fakeUnimplemented('totally', 'bad');
        result = mockjugator.conjugateSync('totally', 'bad' as Regions);
        expect(result).not.toBeInstanceOf(Array);
        expect((result as ErrorType)).toEqual({ ERROR: { message: errorMsg.unknownRegion.replace(/REGION/, 'bad') } });

        // Couple of 'normal' tests
        mockjugator = new MockJugator();
        result = mockjugator.conjugateSync('partir');
        expect((result as Result[])[0].info.defective).toEqual(false);
        result = mockjugator.conjugateSync('hablar');
        expect((result as Result[])[0].info.pronominal).toEqual(false);
        result = mockjugator.conjugateSync('temer');
        expect((result as Result[])[0].info.verb).toEqual('temer');
    });

    const conjugator = new Conjugator();
    test('Bad Input Sync', () => {
        expect(conjugator.conjugateSync('hablarse', 'castellano')).
            toEqual({ ERROR: { message: errorMsg.unknownVerb.replace('VERB', 'hablarse') } });

        // force bad region
        expect(conjugator.conjugateSync('temer', 'castillano' as Regions)).
            toEqual({ ERROR: { message: errorMsg.unknownRegion.replace('REGION', 'castillano') } });

        expect(conjugator.conjugateSync('yo momma')).
            toEqual({ ERROR: { message: errorMsg.unknownVerb.replace('VERB', 'yo momma') } });
    });

    test('ModelFactory', () => {
        const testFactory = new ModelFactory();
        // serenar is not a model, getModel should return Empty
        expect(testFactory.getModel('serenar', 'serenar', 'N', 'castellano', {})).toBeUndefined();
        expect(testFactory.getModel('hablar', 'invalid', 'N', 'canarias', {})).toBeUndefined();

        // legit existing models
        expect(testFactory.getModel('hablar', 'hablar', 'P', 'voseo', {})).toBeDefined();
        expect(testFactory.getModel('hablar', 'partir', 'P', 'formal', {})).toBeDefined();
        expect(testFactory.getModel('hablar', 'temer', 'P', 'castellano', {})).toBeDefined();

        // simulated models
        expect(testFactory.getModel('serenar', 'serenar', 'N', 'castellano',{}, true)).toBeUndefined();
        expect(testFactory.getModel('hablar', 'invalid', 'N', 'canarias', {}, true)).toBeUndefined();
    });

    test('Sync verb and model count', async () => {
        expect(conjugator.getVerbListSync().length).toEqual(VERB_COUNT);
        expect(conjugator.getModelsSync().length).toEqual(MODEL_COUNT);
    });

    test('Optional parameters', () => {
        let result: Result[] | ErrorType = conjugator.conjugateSync('hablarse');           // hablarse can't be used, use 'hablar'
        expect(result).not.toBeInstanceOf(Array);
        expect(result).toEqual({ ERROR: { message: errorMsg.unknownVerb.replace('VERB', 'hablarse') } });

        // force bad region
        result = conjugator.conjugateSync('temer', 'castillano' as Regions);
        expect(result).not.toBeInstanceOf(Array);
        expect(result).toEqual({ ERROR: { message: errorMsg.unknownRegion.replace('REGION', 'castillano') } });

        // good input, good answers
        result = conjugator.conjugateSync('hablar');
        expect(result).toBeInstanceOf(Array);
        expect(result).not.toEqual([]);

        result = conjugator.conjugateSync('hablar');
        expect(result).toBeInstanceOf(Array);
        expect((result as Result[])[0]['info']).toBeDefined();
        expect((result as Result[])[0].info.model).toEqual('hablar');
        expect((result as Result[])[0].conjugation.Indicativo.Presente[0]).toEqual('hablo');

        result = conjugator.conjugateSync('partir');
        expect(result).toBeInstanceOf(Array);
        expect((result as Result[])[0].info.pronominal).toBe(false);
        expect((result as Result[])[0].conjugation.Subjuntivo.Presente[2]).toEqual('parta');
    });

    verbsToTest = shuffle(conjugator.getVerbListSync().filter(verb => verbs.includes(verb)));
    test('Availability', () => {
        verbs.forEach(verb => {
            // this can happen if something goes wrong with the db (partial db during development)
            if (!verbsToTest.includes(verb)) {
                fail(`FIXME: '${verb}' not available for testing`);
            }
        });
    });
});


// Async tests
// Required reading:
// https://jestjs.io/docs/en/asynchronous
describe('Model Test Async', () => {
    test('Async verb and model count', async () => {
        const mockjugator = new MockJugator();
        await mockjugator.getVerbList().then(value => expect(value.length).toEqual(VERB_COUNT));
        await mockjugator.getModels().then(value => expect(value.length).toEqual(MODEL_COUNT));
    });

    test('Async broken templates', () => {
        // make a broken mock
        const broken = new MockJugator();
        broken.deleteTemplates();
        // return expect(broken.getVerbList()).resolves.toEqual([errorMsg.noVerbs]);
        return expect(broken.getVerbList()).rejects.toEqual([errorMsg.noVerbs]);
    });

    test('Async no factory', () => {
        const broken = new MockJugator();
        broken.deleteFactory();      // really break it
        // return expect(broken.getModels()).resolves.toEqual([errorMsg.noModels]);
        return expect(broken.getModels()).rejects.toEqual([errorMsg.noModels]);
    });

    test('Async badly formed verb (includes "se")', () => {
        const conjugator = new Conjugator();
        return conjugator.conjugate('partirse').
            catch(e => expect(e).toEqual({ 'ERROR': { 'message': errorMsg.unknownVerb.replace('VERB', 'partirse') } }));
    });

    test('Async bad region', () => {
        const conjugator = new Conjugator();
        return conjugator.conjugate('partir', 'castilgano' as Regions).
            catch(e => expect(e).toEqual({ 'ERROR': { 'message': errorMsg.unknownRegion.replace('REGION', 'castilgano') } }));
    });

    test('Async unknown verb', () => {
        const conjugator = new Conjugator();
        return conjugator.conjugate('yo').
            catch(e => expect(e).toEqual({ 'ERROR': { 'message': errorMsg.unknownVerb.replace('VERB', 'yo') } }));
    });

    test('Async known verb', () => {
        const conjugator = new Conjugator();
        return conjugator.conjugate('haber').
            then(result => expect((result as Result[])[0].conjugation.Subjuntivo.Presente[1]).toEqual('hayas'));
    });
});

const monos = ['freír', 'reír', 'puar', 'ruar', 'chiar', 'ciar', 'criar', 'fiar', 'guiar', 'liar', 'miar', 'piar', 'triar', 'fluir', 'fruir', 'gruir', 'huir', 'luir', 'muir'];

// Conjugate each verb / region matrix - there is no verification whether the conjugation is correct
// we're just running functional testing here, we should be able to conjugate each verb / each region
describe('Conjugation Test', () => {
    const conjugator = new Conjugator();
    verbsToTest = shuffle(conjugator.getVerbListSync().filter(verb => verbs.includes(verb)));
    verbsToTest.forEach(verb => {
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

    verbsToTest = shuffle(conjugator.getVerbListSync().filter(verb => verbs.includes(verb)));

    const emptyTags = tags.start + tags.end;
    // const redundantEnd = tags.start + tags.deleted + tags.end;
    // TODO: check for combo of things that shouldn't happen, for ex.: .-.*-
    //       need to reorganize tests

    verbsToTest.forEach(verb => {
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