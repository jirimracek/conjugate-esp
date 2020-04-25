/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
/* eslint-disable max-len */
import { Conjugator } from '../../index';
import { ResultType, InfoType } from '../conjugator';
import { ModelFactory } from '../factory';
import { Empty } from '../basemodel';
import { Regions, VerbModelData, DB, ConjugationTable } from '../declarations/types'
import { ERROR_MSG } from '../declarations/constants';

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
const models: string[] = temp.getImplementedModels();
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

describe('Model Test', () => {
    test('Internals', () => {
        // Derive to get access to templates
        class MockJugator extends Conjugator {
            private savedTemplates: DB;
            constructor() {
                super();
                // Make duplicates
                this.templates = JSON.parse(JSON.stringify(this.templates));
                this.savedTemplates = JSON.parse(JSON.stringify(this.templates));
            }
            public deleteTemplates(): void {
                delete this.templates;
            }
            public undefineModelData(verb: string): void {
                this.templates[verb] = undefined as unknown as VerbModelData;
            }
            public restore(): void {
                this.templates = JSON.parse(JSON.stringify(this.savedTemplates));
            }
            public fakeUnimplemented(verb: string, model: string): void {
                this.templates[verb] = { 'N': model } as VerbModelData;
            }
        }
        // Corrupted definitions file / missing templates - this should never happen
        const mockjugator = new MockJugator();
        expect((mockjugator.conjugate('vivir', 'formal')[0].info as InfoType)['model']).toEqual('vivir');

        // undefine verb model data in templates
        mockjugator.undefineModelData('vivir');
        expect(mockjugator.conjugate('vivir', 'formal')).
            toEqual([{ info: ERROR_MSG.MissingModelData.replace('VERB', 'vivir'), conjugation: {} }]);
        mockjugator.restore();
        expect((mockjugator.conjugate('vivir', 'formal')[0].info as InfoType)['region']).toEqual('formal');

        mockjugator.deleteTemplates();
        expect(mockjugator.conjugate('amar', 'castellano')).toEqual([{ info: ERROR_MSG.UndefinedTemplates, conjugation: {} }]);

        expect(mockjugator.getVerbList()).toEqual([]);
        mockjugator.restore();

        expect((mockjugator.conjugate('amar')[0].info as InfoType)['region']).toEqual('castellano');
        expect(mockjugator.getVerbList()).not.toEqual([]);
        mockjugator.restore();

        mockjugator.fakeUnimplemented('foobar', 'bar');
        expect(mockjugator.conjugate('foobar')).
            toEqual([{ info: ERROR_MSG.UnknownModel.replace(/MODEL(.*)VERB(.*)REGION/, 'bar$1foobar$2castellano'), conjugation: {} }]);
        mockjugator.fakeUnimplemented('totally', 'bad');
        expect(mockjugator.conjugate('totally', 'canarias')).
            toEqual([{ info: ERROR_MSG.UnknownModel.replace(/MODEL(.*)VERB(.*)REGION/, 'bad$1totally$2canarias'), conjugation: {} }]);
        mockjugator.restore();

        expect((mockjugator.conjugate('vivir')[0].info as InfoType)['defective']).toEqual(false);
        expect((mockjugator.conjugate('amar')[0].info as InfoType)['pronominal']).toEqual(false);
        expect((mockjugator.conjugate('temer')[0].info as InfoType)['verb']).toEqual('temer');
    });



    const conjugator = new Conjugator();
    test('Bad Input', () => {
        expect(conjugator.conjugate('amarse', 'castellano')).
            toEqual([{ info: ERROR_MSG.UnknownVerb.replace('VERB', 'amarse'), conjugation: {} }]);

        // force bad region
        expect(conjugator.conjugate('temer', 'castillano' as Regions)).
            toEqual([{ info: ERROR_MSG.UnknownRegion.replace('REGION', 'castillano'), conjugation: {} }]);
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
        expect(conjugator.getVerbList().length).toBe(12817);       // number of verbs in the db
    });

    test('Optional parameters', () => {
        expect(conjugator.conjugate('amarse')).
            toEqual([{ info: ERROR_MSG.UnknownVerb.replace('VERB', 'amarse'), conjugation: {} }]);
        // force bad region
        expect(conjugator.conjugate('temer', 'castillano' as Regions)).
            toEqual([{ info: ERROR_MSG.UnknownRegion.replace('REGION', 'castillano'), conjugation: {} }]);
        // good input, good answers
        expect(conjugator.conjugate('amar')).not.toEqual([]);
        expect((conjugator.conjugate('amar')[0].conjugation as ConjugationTable).Indicativo.Presente[0]).toEqual('yo amo');
        expect((conjugator.conjugate('vivir')[0].conjugation as ConjugationTable).Subjuntivo.Presente[2]).toEqual('él viva');
    });

    verbsToTest = shuffle(conjugator.getVerbList().filter(verb => verbs.includes(verb)));
    test('Availability', () => {
        verbs.forEach(verb => {
            // this can happen if something goes wrong with the db (partial db during development)
            if (!verbsToTest.includes(verb)) {
                fail(`FIXME: '${verb}' not available for testing`);
            }
        });
    });
});

describe('Conjugation Test', () => {
    const conjugator = new Conjugator();
    verbsToTest = shuffle(conjugator.getVerbList().filter(verb => verbs.includes(verb)));
    verbsToTest.forEach(verb => {
        describe(`${verb}`, () => {
            regionsToTest.forEach(region => {
                test(`${region}`, () => {
                    const conjugations: ResultType[] = conjugator.conjugate(verb, region);
                    expect((conjugations[0].info as InfoType)['verb']).
                        toEqual((conjugations[0].info as InfoType)['pronominal'] === true ? `${verb}se` : verb);
                    expect((conjugations[0].info as InfoType)['region']).toEqual(region);
                });
            });
        });
    });
});