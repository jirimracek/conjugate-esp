/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
/* eslint-disable max-len */
import { Conjugator } from '../../index';
import { InfoType, OutputType, ResultType, ErrorType } from '../conjugator';
import { ModelFactory } from '../factory';
import { Empty } from '../basemodel';
import { Regions, VerbModelData, DB } from '../declarations/types'
import { ERROR_MSG } from '../declarations/constants';

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
verbSet.add('abar');        // the only known trimorfo              'abar': { 'P': { 'amar': { 'D': 'trimorfo' } } },
verbSet.add('abolir');      // interesting imorfo                   'abolir': { 'N': [ 'vivir', { 'vivir': { 'D': 'imorfo' } } ] },
verbSet.add('acostumbrar')  // omorfo                               'acostumbrar': { 'N': [ 'amar', { 'amar': { 'D': 'omorfo' } } ], 'P': 'amar' },
verbSet.add('aclarar');     // dual, defective                      'aclarar': { 'N': [ 'amar', { 'amar': { 'd': 'imper' } } ], 'P': 'amar' },
verbSet.add('acontecer');   // single defective                     'acontecer': { 'N': { 'nacer': { 'D': 'terciop' } } },
verbSet.add('adecuar');     // dual, non defective                  'adecuar': { 'N': [ 'amar', 'actuar' ], 'P': [ 'amar', 'actuar' ]
verbSet.add('antojar');     // defective terciopersonal v2          'antojar': { 'P': { 'amar': { 'D': 'terciop' } } },
verbSet.add('autosatisfacer');     // odd version of hacer          'autosatisfacer': { 'N': [ 'hacer', { 'hacer': { 'V': '1' } } ],
verbSet.add('balbucir');    // combo of ir & ar verb, very unique, in the model list
verbSet.add('colorir');     // imorfo                               'colorir': { 'N': { 'vivir': { 'D': 'imorfo' } } },
verbSet.add('condecir');    // the decir family of differences      'condecir': { 'N': [ { 'decir': { 'V': '1' } }, { 'decir': { 'D': 'terciop' } }, { 'decir': { 'V': '2' } } ] },
verbSet.add('degollar');    // contar, o -> üe
verbSet.add('derrocar');    // dual volcar, sacar                   'derrocar': { 'N': [ 'volcar', 'sacar' ], 'P': 'volcar' },
verbSet.add('desvaír');     // dual, ír, defective in both N&P      'desvaír': { 'N': [ { 'embaír': { 'D': 'imorfo' } }, 'embaír' ], 'P': [ { 'embaír': { 'D': 'imorfo' } }, 'embaír' ] },
verbSet.add('embaír');
verbSet.add('empecer')      // the only known tercio                'empecer': { 'N': { 'nacer': { 'D': 'tercio' } } },
verbSet.add('empedernir');  // the only bimorfop, dual defective    'empedernir': { 'N': [ { 'vivir': { 'D': 'bimorfop' } }, { 'vivir': { 'D': 'imorfo' } } ], 'P': [ { 'vivir': { 'D': 'bimorfop' } }, { 'vivir': { 'D': 'imorfo' } } ] },
verbSet.add('errar');       // err -> yerr                          'errar': { 'N': [ 'errar', 'amar' ], 'P': [ 'errar', 'amar' ] },
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
verbSet.add('serenar');     // triple, defective in one, N&P        'serenar': { 'N': [ 'amar', { 'amar': { 'D': 'imper' } } ], 'P': 'amar' },
verbSet.add('sofreír');
verbSet.add('soler');       // the name said it all                 'soler': { 'N': [ { 'mover': { 'D': 'osmorfo' } }, { 'mover': { 'D': 'omorfo' } } ] },
verbSet.add('tronar');      // from contar                          'tronar': { 'N': [ { 'contar': { 'D': 'imper' } }, 'contar' ], 'P': 'contar' },
verbSet.add('ventar');      // triple, defective                    'ventar': { 'N': [ { 'pensar': { 'D': 'imper' } }, 'amar', 'pensar' ] },

const verbs: string[] = Array.from(verbSet);

// Derive to get access to templates
class MockJugator extends Conjugator {
    private savedTemplates: DB;
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
        let result: OutputType = mockjugator.conjugateSync('vivir', 'formal');
        expect(result).toBeInstanceOf(Array);
        expect(((result as ResultType[])[0].info as InfoType).model).toEqual('vivir');

        // undefine verb model data in templates
        mockjugator.undefineModelData('vivir');
        result = mockjugator.conjugateSync('vivir', 'formal');
        expect(result).not.toBeInstanceOf(Array);
        expect(result).toEqual({ ERROR: { message: ERROR_MSG.MissingModelData.replace('VERB', 'vivir') } });

        mockjugator.restore();
        result = mockjugator.conjugateSync('vivir', 'formal');
        expect(result).toBeInstanceOf(Array);
        expect(((result as ResultType[])[0].info as InfoType).region).toEqual('formal');

        mockjugator.deleteTemplates();
        result = mockjugator.conjugateSync('amar', 'castellano');
        expect(result).not.toBeInstanceOf(Array);
        expect(result as ErrorType).toEqual({ ERROR: { message: ERROR_MSG.UndefinedTemplates } });

        expect(mockjugator.getVerbListSync()).toEqual([ERROR_MSG.NoVerbs]);

        mockjugator.deleteFactory();      // really break it
        expect(mockjugator.getModelsSync()).toEqual([ERROR_MSG.NoModels]);

        mockjugator.restore();

        mockjugator.fakeUnimplemented('foobar', 'bar');
        result = mockjugator.conjugateSync('foobar');
        expect(result).not.toBeInstanceOf(Array);
        expect(result).
            toEqual({
                ERROR: {
                    message: ERROR_MSG.UnknownModel.replace(/MODEL(.*)VERB(.*)REGION/,
                        'bar$1foobar$2castellano')
                }
            });

        mockjugator.fakeUnimplemented('totally', 'bad');
        result = mockjugator.conjugateSync('totally', 'bad' as Regions);        // Force bad region
        expect(result).not.toBeInstanceOf(Array);
        expect((result as ErrorType)).toEqual({ ERROR: { message: ERROR_MSG.UnknownRegion.replace(/REGION/, 'bad') } });

        mockjugator.restore();
        result = mockjugator.conjugateSync('vivir');
        expect((result as ResultType[])[0].info.defective).toEqual(false);
        result = mockjugator.conjugateSync('amar');
        expect((result as ResultType[])[0].info.pronominal).toEqual(false);
        result = mockjugator.conjugateSync('temer');
        expect((result as ResultType[])[0].info.verb).toEqual('temer');
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
            .then(value => expect(((value as ResultType[])[0].info.verb)).toEqual('dar'))
            .catch(() => expect(true).not.toBe(true))               // << unreachable, we hope
            .finally(() => expect(true).toBe(true));                   // << always happens
    });

    test('Async reject broken', () => {
        // make a broken mock
        const broken = new MockJugator();
        broken.deleteTemplates();
        broken.getVerbList()
            .then(() => fail())              // we should never get here
            .catch(value => expect(value).toEqual([ERROR_MSG.NoVerbs]));

        broken.deleteFactory();      // really break it
        broken.getModels()
            .then(value => fail(value))
            .catch(reason => expect(reason).toEqual([ERROR_MSG.NoModels]))
            .finally(() => expect(true).toBe(true));
    });



    const conjugator = new Conjugator();
    test('Bad Input', () => {
        expect(conjugator.conjugateSync('amarse', 'castellano')).
            toEqual({ ERROR: { message: ERROR_MSG.UnknownVerb.replace('VERB', 'amarse') } });

        conjugator.conjugate('vivirse')
            .then(value => console.error(`Should never get here, ${value}`))
            .catch(error => {
                // console.log('Rejected', error);
                expect(error).not.toBeInstanceOf(Array);
                expect(error).toEqual({ ERROR: { message: ERROR_MSG.UnknownVerb.replace('VERB', 'vivirse') } });
            });

        // force bad region
        expect(conjugator.conjugateSync('temer', 'castillano' as Regions)).
            toEqual({ ERROR: { message: ERROR_MSG.UnknownRegion.replace('REGION', 'castillano') } });


        conjugator.conjugate('vivir', 'castilgano' as Regions)
            .then(value => console.error(`Should never get here, ${value}`))
            .catch(error => {
                // console.log('Rejected', error);
                expect(error).not.toBeInstanceOf(Array);
                expect(error).toEqual({ ERROR: { message: ERROR_MSG.UnknownRegion.replace('REGION', 'castilgano') } });
            });


        expect(conjugator.conjugateSync('yo momma')).
            toEqual({ ERROR: { message: ERROR_MSG.UnknownVerb.replace('VERB', 'yo momma') } });

        conjugator.conjugate('yo')
            .then(value => {
                // console.log('Resolved', value);
                fail(value);
            })
            .catch(error => {
                // console.log('Rejected', error);
                expect(error).toEqual({ ERROR: { message: ERROR_MSG.UnknownVerb.replace('VERB', 'yo') } });
            });
    });

    test('ModelFactory', () => {
        const testFactory = new ModelFactory();
        // serenar is not a model, getModel should return Empty
        expect(testFactory.getModel('serenar', 'serenar', 'N', 'castellano', {})).toBeInstanceOf(Empty);
        expect(testFactory.getModel('amar', 'invalid', 'N', 'canarias', {})).toBeInstanceOf(Empty);

        // legit existing models
        expect(testFactory.getModel('amar', 'amar', 'P', 'voseo', {})).not.toBeInstanceOf(Empty);
        expect(testFactory.getModel('amar', 'vivir', 'P', 'formal', {})).not.toBeInstanceOf(Empty);
        expect(testFactory.getModel('amar', 'temer', 'P', 'castellano', {})).not.toBeInstanceOf(Empty);

        expect(testFactory.isImplemented('amar')).toBeTruthy();
        expect(testFactory.isImplemented('temer')).toBeTruthy();
        expect(testFactory.isImplemented('vivir')).toBeTruthy();

        expect(testFactory.isImplemented('amar_')).toBeFalsy();
        expect(testFactory.isImplemented('teemar')).toBeFalsy();
        expect(testFactory.isImplemented('.vivir')).toBeFalsy();

    });

    test('getVerbList()', () => {
        expect(conjugator.getVerbListSync().length).toBe(VERB_COUNT);       // number of verbs in the db
    });

    test('Optional parameters', () => {
        let result: OutputType = conjugator.conjugateSync('amarse');
        expect(result).not.toBeInstanceOf(Array);
        expect(result).toEqual({ ERROR: { message: ERROR_MSG.UnknownVerb.replace('VERB', 'amarse') } });

        // force bad region
        result = conjugator.conjugateSync('temer', 'castillano' as Regions);
        expect(result).not.toBeInstanceOf(Array);
        expect(result).toEqual({ ERROR: { message: ERROR_MSG.UnknownRegion.replace('REGION', 'castillano') } });

        // good input, good answers
        result = conjugator.conjugateSync('amar');
        expect(result).toBeInstanceOf(Array);
        expect(result).not.toEqual([]);

        result = conjugator.conjugateSync('amar');
        expect(result).toBeInstanceOf(Array);
        expect((result as ResultType[])[0]['info']).toBeDefined();
        expect((result as ResultType[])[0].info.model).toEqual('amar');
        expect((result as ResultType[])[0].conjugation.Indicativo.Presente[0]).toEqual('yo amo');

        result = conjugator.conjugateSync('vivir');
        expect(result).toBeInstanceOf(Array);
        expect((result as ResultType[])[0].info.pronominal).toBe(false);
        expect((result as ResultType[])[0].conjugation.Subjuntivo.Presente[2]).toEqual('él viva');
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
                    const conjugations: OutputType = conjugator.conjugateSync(verb, region);
                    if (!Array.isArray(conjugations)) {
                        fail(conjugations);
                    }
                    expect((conjugations[0].info as InfoType)['verb']).
                        toEqual((conjugations[0].info as InfoType)['pronominal'] === true ? `${verb}se` : verb);
                    expect((conjugations[0].info as InfoType)['region']).toEqual(region);
                });
            });
        });
    });
});