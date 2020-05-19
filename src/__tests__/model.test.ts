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
import { Regions } from '../lib/types';
import { errorMsg } from '../lib/conjugator';

const VERB_COUNT = 12815;
const MODEL_COUNT = 99;
// Disable thrown messages
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { /* empty */ });
});

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
verbSet.add('abar');        // the only known trimorfo              'abar': { 'P': { 'hablar': { 'D': 'trimorfo' } } },
verbSet.add('abolir');      // interesting imorfo                   'abolir': { 'N': [ 'partir', { 'partir': { 'D': 'imorfo' } } ] },
verbSet.add('acostumbrar');  // omorfo                               'acostumbrar': { 'N': [ 'hablar', { 'hablar': { 'D': 'omorfo' } } ], 'P': 'hablar' },
verbSet.add('aclarar');     // dual, defective                      'aclarar': { 'N': [ 'hablar', { 'hablar': { 'd': 'imper' } } ], 'P': 'hablar' },
verbSet.add('acontecer');   // single defective                     'acontecer': { 'N': { 'nacer': { 'D': 'terciop' } } },
verbSet.add('adecuar');     // dual, non defective                  'adecuar': { 'N': [ 'hablar', 'actuar' ], 'P': [ 'hablar', 'actuar' ]
verbSet.add('antojar');     // defective terciopersonal v2          'antojar': { 'P': { 'hablar': { 'D': 'terciop' } } },
verbSet.add('autosatisfacer');     // odd version of hacer          'autosatisfacer': { 'N': [ 'hacer', { 'hacer': { 'V': '1' } } ],
verbSet.add('balbucir');    // combo of ir & ar verb, very unique, in the model list
verbSet.add('colorir');     // imorfo                               'colorir': { 'N': { 'partir': { 'D': 'imorfo' } } },
verbSet.add('condecir');    // the decir family of differences      'condecir': { 'N': [ { 'decir': { 'V': '1' } }, { 'decir': { 'D': 'terciop' } }, { 'decir': { 'V': '2' } } ] },
verbSet.add('degollar');    // contar, o -> üe
verbSet.add('derrocar');    // dual volcar, sacar                   'derrocar': { 'N': [ 'volcar', 'sacar' ], 'P': 'volcar' },
verbSet.add('desvaír');     // dual, ír, defective in both N&P      'desvaír': { 'N': [ { 'embaír': { 'D': 'imorfo' } }, 'embaír' ], 'P': [ { 'embaír': { 'D': 'imorfo' } }, 'embaír' ] },
verbSet.add('embaír');
verbSet.add('empecer');      // the only known tercio                'empecer': { 'N': { 'nacer': { 'D': 'tercio' } } },
verbSet.add('empedernir');  // the only bimorfop, dual defective    'empedernir': { 'N': [ { 'partir': { 'D': 'bimorfop' } }, { 'partir': { 'D': 'imorfo' } } ], 'P': [ { 'partir': { 'D': 'bimorfop' } }, { 'partir': { 'D': 'imorfo' } } ] },
verbSet.add('errar');       // err -> yerr                          'errar': { 'N': [ 'errar', 'hablar' ], 'P': [ 'errar', 'hablar' ] },
verbSet.add('escribir');
verbSet.add('erguir');
verbSet.add('freír');
verbSet.add('guiar');       // dual vaciar with monosyll            'guiar': { 'N': [ 'vaciar', { 'vaciar': { 'M': 'true' } } ], 'P': [ 'vaciar', { 'vaciar': { 'M': 'true' } } ] },
verbSet.add('hidropicar');  // sacar, dual, defective               'hidropicar': { 'N': [ 'sacar', { 'sacar': { 'D': 'imper' } } ], 'P': 'sacar' },
verbSet.add('infecir');     //                                      'infecir': { 'N': { 'lucir': { 'PR': 'ido/to' } } },
verbSet.add('inhestar');    // participio irregular, replace        'inhestar': { 'N': { 'pensar': { 'PR': 'estad/iest' } }
verbSet.add('imprimir');
verbSet.add('ir');
verbSet.add('marcir');      // eimorfo                              'marcir': { 'N': [ 'zurcir', { 'zurcir': { 'D': 'eimorfo' } } ] },
verbSet.add('morir');
verbSet.add('predecir');    // the decir family of differences
verbSet.add('pringar');     // dual pagar                           'pringar': { 'N': [ 'pagar', { 'pagar': { 'D': 'imper' } } ], 'P': 'pagar' },
verbSet.add('proscribir');
verbSet.add('proveer');
verbSet.add('puar');        // dual, monosyllables                  'puar': { 'N': [ 'actuar', { 'actuar': { 'MS': 'true' } } ] },
verbSet.add('redecir');     // the decir family of differences
verbSet.add('reír');
verbSet.add('reponer');     // ogmorfo                              'reponer': { 'N': [ 'poner', { 'poner': { 'D': 'ogmorfo' } } ], 'P': 'poner' },
verbSet.add('responder');   // in the list already, quite unique, repuse version         'responder': { 'N': [ 'temer', 'responder' ] },
verbSet.add('serenar');     // triple, defective in one, N&P        'serenar': { 'N': [ 'hablar', { 'hablar': { 'D': 'imper' } } ], 'P': 'hablar' },
verbSet.add('sofreír');
verbSet.add('soler');       // the name said it all                 'soler': { 'N': [ { 'mover': { 'D': 'osmorfo' } }, { 'mover': { 'D': 'omorfo' } } ] },
verbSet.add('tronar');      // from contar                          'tronar': { 'N': [ { 'contar': { 'D': 'imper' } }, 'contar' ], 'P': 'contar' },
verbSet.add('ventar');      // triple, defective                    'ventar': { 'N': [ { 'pensar': { 'D': 'imper' } }, 'hablar', 'pensar' ] },

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
        delete this.templates;
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
        delete (this.factory);
    }
}

describe('Model Test', () => {
    test('Internals + sync', () => {
        // Corrupted definitions file / missing templates - this should never happen
        const mockjugator = new MockJugator();
        let result: Result[] | ErrorType = mockjugator.conjugateSync('partir', 'formal');
        expect(result).toBeInstanceOf(Array);
        expect(((result as Result[])[0].info as Info).model).toEqual('partir');

        // undefine verb model data in templates
        mockjugator.undefineModelData('partir');
        result = mockjugator.conjugateSync('partir', 'formal');
        expect(result).not.toBeInstanceOf(Array);
        expect(result).toEqual({ ERROR: { message: errorMsg.noModelData.replace('VERB', 'partir') } });

        mockjugator.restore();
        result = mockjugator.conjugateSync('partir', 'formal');
        expect(result).toBeInstanceOf(Array);
        expect(((result as Result[])[0].info as Info).region).toEqual('formal');

        mockjugator.deleteTemplates();
        result = mockjugator.conjugateSync('hablar', 'castellano');
        expect(result).not.toBeInstanceOf(Array);
        expect(result as ErrorType).toEqual({ ERROR: { message: errorMsg.noTemplates } });

        expect(mockjugator.getVerbListSync()).toEqual([errorMsg.noVerbs]);

        mockjugator.deleteFactory();      // really break it
        expect(mockjugator.getModelsSync()).toEqual([errorMsg.noModels]);

        mockjugator.restore();

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

        mockjugator.fakeUnimplemented('totally', 'bad');
        result = mockjugator.conjugateSync('totally', 'bad' as Regions);        // Force bad region
        expect(result).not.toBeInstanceOf(Array);
        expect((result as ErrorType)).toEqual({ ERROR: { message: errorMsg.unknownRegion.replace(/REGION/, 'bad') } });

        mockjugator.restore();
        result = mockjugator.conjugateSync('partir');
        expect((result as Result[])[0].info.defective).toEqual(false);
        result = mockjugator.conjugateSync('hablar');
        expect((result as Result[])[0].info.pronominal).toEqual(false);
        result = mockjugator.conjugateSync('temer');
        expect((result as Result[])[0].info.verb).toEqual('temer');
    });

    test('Async resolve', () => {
        const mockjugator = new MockJugator();
        let a = 0;
        mockjugator.getVerbList()
            .then(value => {
                a = value.length;
                expect(a).toBe(VERB_COUNT);
            })
            .catch(error => console.error(`Should never get here, ${error}`));
        expect(a).toBe(0);

        mockjugator.getModels()
            .then(value => {
                a = value.length;
                expect(a).toBe(MODEL_COUNT);
            })
            .catch(error => console.error(`Should never get here, ${error}`));

        expect(a).toBe(0);             // <<< a should not have changed by now

        // get a verb
        mockjugator.conjugate('dar')
            .then(value => expect(((value as Result[])[0].info.verb)).toEqual('dar'))
            .catch(() => expect(true).not.toBe(true))               // << unreachable, we hope
            .finally(() => expect(true).toBe(true));                   // << always happens
    });

    test('Async reject broken', () => {
        // make a broken mock
        const broken = new MockJugator();
        broken.deleteTemplates();
        broken.getVerbList()
            .then(() => fail())              // we should never get here
            .catch(value => expect(value).toEqual([errorMsg.noVerbs]));

        broken.deleteFactory();      // really break it
        broken.getModels()
            .then(value => fail(value))
            .catch(reason => expect(reason).toEqual([errorMsg.noModels]))
            .finally(() => expect(true).toBe(true));
    });



    const conjugator = new Conjugator();
    test('Bad Input', () => {
        expect(conjugator.conjugateSync('hablarse', 'castellano')).
            toEqual({ ERROR: { message: errorMsg.unknownVerb.replace('VERB', 'hablarse') } });

        conjugator.conjugate('partirse')
            .then(value => console.error(`Should never get here, ${value}`))
            .catch(error => {
                // console.log('Rejected', error);
                expect(error).not.toBeInstanceOf(Array);
                expect(error).toEqual({ ERROR: { message: errorMsg.unknownVerb.replace('VERB', 'partirse') } });
            });

        // force bad region
        expect(conjugator.conjugateSync('temer', 'castillano' as Regions)).
            toEqual({ ERROR: { message: errorMsg.unknownRegion.replace('REGION', 'castillano') } });


        conjugator.conjugate('partir', 'castilgano' as Regions)
            .then(value => console.error(`Should never get here, ${value}`))
            .catch(error => {
                // console.log('Rejected', error);
                expect(error).not.toBeInstanceOf(Array);
                expect(error).toEqual({ ERROR: { message: errorMsg.unknownRegion.replace('REGION', 'castilgano') } });
            });


        expect(conjugator.conjugateSync('yo momma')).
            toEqual({ ERROR: { message: errorMsg.unknownVerb.replace('VERB', 'yo momma') } });

        conjugator.conjugate('yo')
            .then(value => {
                // console.log('Resolved', value);
                fail(value);
            })
            .catch(error => {
                // console.log('Rejected', error);
                expect(error).toEqual({ ERROR: { message: errorMsg.unknownVerb.replace('VERB', 'yo') } });
            });
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
    });

    test('getVerbList()', () => {
        expect(conjugator.getVerbListSync().length).toBe(VERB_COUNT);       // number of verbs in the db
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
        expect((result as Result[])[0].conjugation.Indicativo.Presente[0]).toEqual('yo hablo');

        result = conjugator.conjugateSync('partir');
        expect(result).toBeInstanceOf(Array);
        expect((result as Result[])[0].info.pronominal).toBe(false);
        expect((result as Result[])[0].conjugation.Subjuntivo.Presente[2]).toEqual('él parta');
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

    test('Async', () => {
        let a = 0;
        conjugator.getVerbList().then(value => {
            a = value.length;
            expect(a).toBe(VERB_COUNT);
        });
        expect(a).toBe(0);

    });
});

describe('Conjugation Test', () => {
    const conjugator = new Conjugator();
    verbsToTest = shuffle(conjugator.getVerbListSync().filter(verb => verbs.includes(verb)));
    verbsToTest.forEach(verb => {
        describe(`${verb}`, () => {
            regionsToTest.forEach(region => {
                test(`${region}`, () => {
                    const conjugations: Result[] | ErrorType = conjugator.conjugateSync(verb, region);
                    if (!Array.isArray(conjugations)) {
                        fail(conjugations);
                    }
                    expect((conjugations[0].info as Info)['verb']).
                        toEqual((conjugations[0].info as Info)['pronominal'] === true ? `${verb}se` : verb);
                    expect((conjugations[0].info as Info)['region']).toEqual(region);
                });
            });
        });
    });
});