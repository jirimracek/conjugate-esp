/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { Conjugator } from '../../index';
import fs from 'fs';
import path from 'path';
import { ResultType, InfoType } from '../conjugator';
import { ModelFactory } from '../factory';
import { Empty } from '../basemodel';
import { Regions, VerbModelData, DB, ConjugationTable } from '../declarations/types'
import { json2Text } from '../utilities/modelutils';
import { ERROR_MSG } from '../declarations/constants';

// Disable thrown messages
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
});

describe("Model Test", () => {
    // shuffle lists so we don't test in the same order every time
    function shuffle(array: string[]) {
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
            public deleteTemplates() {
                delete this.templates;
            }
            public undefineModelData(verb: string) {
                this.templates[verb] = undefined as unknown as VerbModelData;
            }
            public restore() {
                this.templates = JSON.parse(JSON.stringify(this.savedTemplates));
            }
        }
        // Corrupted definitions file / missing templates - this should never happen
        let mockjugator = new MockJugator();
        expect((mockjugator.conjugate('vivir', 'formal')[0].info as InfoType)['model']).toEqual('vivir');

        // undefine verb model data in templates
        mockjugator.undefineModelData('vivir');
        expect(mockjugator.conjugate('vivir', 'formal')).toEqual([{ info: ERROR_MSG.MissingModelData.replace('VERB', 'vivir'), conjugation: {} }]);
        mockjugator.restore();
        expect((mockjugator.conjugate('vivir', 'formal')[0].info as InfoType)['region']).toEqual('formal');

        mockjugator.deleteTemplates();
        expect(mockjugator.conjugate('amar', 'castellano')).toEqual([{ info: ERROR_MSG.UndefinedTemplates, conjugation: {} }]);

        expect(mockjugator.getVerbList()).toEqual([]);
        mockjugator.restore();

        expect((mockjugator.conjugate('amar')[0].info as InfoType)['region']).toEqual('castellano');
        expect(mockjugator.getVerbList()).not.toEqual([]);
        mockjugator.restore();

        expect((mockjugator.conjugate('vivir')[0].info as InfoType)['defective']).toEqual(false);
        expect((mockjugator.conjugate('amar')[0].info as InfoType)['pronominal']).toEqual(false);
    });



    const conjugator = new Conjugator();
    const TEST_DIR = './testdata';
    test('Bad Input', () => {
        expect(conjugator.conjugate('amarse', 'castellano')).toEqual([{ info: ERROR_MSG.UnknownVerb.replace('VERB', 'amarse'), conjugation: {} }]);

        // force bad region
        expect(conjugator.conjugate('temer', 'castillano' as Regions)).toEqual([{ info: ERROR_MSG.UnknownRegion.replace('REGION', 'castillano'), conjugation: {} }]);
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
        expect(conjugator.getVerbList().length).toBe(12819);       // number of verbs in the db
    });

    test('Not implemented', () => {
        // unimplemented model
        expect(conjugator.conjugate('yacer', 'formal')).toEqual([{ info: ERROR_MSG.UnknownModel.replace(/MODEL(.*)VERB(.*)REGION/, `yacer$1yacer$2formal`), conjugation: {} }]);
    });

    test('Optional parameters', () => {
        expect(conjugator.conjugate('amarse')).toEqual([{ info: ERROR_MSG.UnknownVerb.replace('VERB', 'amarse'), conjugation: {} }]);
        // force bad region
        expect(conjugator.conjugate('temer', 'castillano' as Regions)).toEqual([{ info: ERROR_MSG.UnknownRegion.replace('REGION', 'castillano'), conjugation: {} }]);
        // good input, good answers
        expect(conjugator.conjugate('amar')).not.toEqual([]);
        expect((conjugator.conjugate('amar')[0].conjugation as ConjugationTable).Indicativo.Presente[0]).toEqual('yo amo');
        expect((conjugator.conjugate('vivir')[0].conjugation as ConjugationTable).Subjuntivo.Presente[2]).toEqual('él viva');
    });

    const regionsToTest = shuffle(['castellano', 'voseo', 'formal', 'canarias']) as Regions[];
    const verbSet: Set<string> = new Set();
    const models: string[] = ['abrir', 'actuar', 'adquirir', 'agorar', 'aguar', 'ahincar', 'aislar', 'amar', 'andar', 'argüir', 'balbucir', 'cazar', 'contar', 'decir', 'discernir',
        'embaír', 'errar', 'estar', 'haber', 'hacer', 'lucir', 'mover', 'nacer', 'pagar', 'pensar', 'poder', 'poner', 'regar', 'responder', 'sacar',
        'servir', 'surgir', 'temer', 'vaciar', 'vencer', 'vivir', 'volcar'];


    models.forEach(m => verbSet.add(m));
    // some interesting verbs
    verbSet.add('abar');        // the only known trimorfo              "abar": { "P": { "amar": { "d": "trimorfo" } } }
    verbSet.add('abolir');      // interesting imorfo                   "abolir": { "N": [ "vivir", { "vivir": { "d": "imorfo" } } ] },
    verbSet.add('acostumbrar')  // omorfo                               "acostumbrar": { "N": [ "amar", { "amar": { "_d_": "omorfo" } } ], "P": "amar" },
    verbSet.add('aclarar');     // dual, defective                      "aclarar": { "N": [ "amar", { "amar": { "d": "imper" } } ], "P": "amar" },
    verbSet.add('acontecer');   // single defective                     "acontecer": { "N": { "nacer": { "_d_": "terciop" } } },
    verbSet.add('adecuar');     // dual, non defective                  "adecuar": { "N": [ "amar", "actuar" ], "P": [ "amar", "actuar" ]
    verbSet.add('antojar');     // defective terciopersonal v2          "antojar": { "P": { "amar": { "d": "terciop" } } },
    verbSet.add('balbucir');    // combo of ir & ar verb, very unique, in the model list
    verbSet.add('degollar');    // contar, o -> üe
    verbSet.add('derrocar');    // dual volcar, sacar                   "derrocar": { "N": [ "volcar", "sacar" ], "P": "volcar" },
    verbSet.add('desvaír');     // dual, ír, defective in both N&P      "desvaír": { "N": [ { "embaír": { "_d_": "imorfo" } }, "embaír" ], "P": [ { "embaír": { "_d_": "imorfo" } }, "embaír" ] },
    verbSet.add('empecer')      // the only known tercio                "empecer": { "N": { "nacer": { "_d_": "tercio" } } },
    verbSet.add('empedernir');  // the only bimorfop, dual defective    "empedernir": { "N": [ { "vivir": { "_d_": "bimorfop" } }, { "vivir": { "_d_": "imorfo" } } ], "P": [ { "vivir": { "_d_": "bimorfop" } }, { "vivir": { "_d_": "imorfo" } } ] },
    verbSet.add('errar');       // err -> yerr                          "errar": { "N": [ "errar", "amar" ], "P": [ "errar", "amar" ] },
    verbSet.add('guiar');       // dual vaciar with monosyll            "guiar": { "N": [ "vaciar", { "vaciar": { "_ms_": "true" } } ], "P": [ "vaciar", { "vaciar": { "_ms_": "true" } } ] },
    verbSet.add('hidropicar');  // sacar, dual, defective               "hidropicar": { "N": [ "sacar", { "sacar": { "_d_": "imper" } } ], "P": "sacar" },
    verbSet.add('inhestar');    // participio irregular, replace        "inhestar": { "N": { "pensar": { "PR": "estad/iest" } }
    verbSet.add('pringar');     // dual pagar                           "pringar": { "N": [ "pagar", { "pagar": { "_d_": "imper" } } ], "P": "pagar" },
    verbSet.add('puar');        // dual, monosyllables                  "puar": { "N": [ "actuar", { "actuar": { "MS": "true" } } ] },
    verbSet.add('responder');   // in the list already, quite unique, repuse version         "responder": { "N": [ "temer", "responder" ] },
    verbSet.add('serenar');     // triple, defective in one, N&P        "serenar": { "N": [ "amar", { "amar": { "d": "imper" } } ], "P": "amar" },
    verbSet.add('soler');       // the name said it all                 "soler": { "N": [ { "mover": { "_d_": "osmorfo" } }, { "mover": { "_d_": "omorfo" } } ] },
    verbSet.add('tronar');      // from contar                          "tronar": { "N": [ { "contar": { "_d_": "imper" } }, "contar" ], "P": "contar" },
    verbSet.add('ventar');      // triple, defective                    "ventar": { "N": [ { "pensar": { "d": "imper" } }, "amar", "pensar" ] },

    const verbs: string[] = Array.from(verbSet);
    const verbsToTest = shuffle(conjugator.getVerbList().filter(verb => verbs.includes(verb)));

    test('Availability', () => {
        verbs.forEach(verb => {
            // this can happen if something goes wrong with the db (partial db during development)
            if (!verbsToTest.includes(verb)) {
                fail(`FIXME: '${verb}' not available for testing`);
            }
        });
    });


    describe("Conjugation Test", () => {
        verbsToTest.forEach(verb => {
            const testFiles = fs.readdirSync(path.join(TEST_DIR, verb), 'utf8');
            describe(`${verb}`, () => {
                regionsToTest.forEach(region => {
                    test(`${region}`, () => {

                        const conjugations: ResultType[] = conjugator.conjugate(verb, region);

                        const regionFiles = testFiles.filter(file => file.endsWith(region));
                        const goldFiles: Map<string, string[]> = new Map();
                        regionFiles.forEach(file => goldFiles.set(file, fs.readFileSync(path.join(TEST_DIR, verb, file), 'utf8').split('\n')));

                        if (conjugations.length !== regionFiles.length) {
                            debugger;
                        }
                        expect(conjugations.length).toBe(regionFiles.length);

                        let cIndexP = 0;
                        let cIndexN = 0;
                        conjugations.forEach(conjugation => {

                            const info: InfoType = conjugation.info as InfoType;
                            expect(info).not.toBeUndefined();

                            const [model, region, pronominal] = [info.model, info.region, info.pronominal];
                            let fileName = '';
                            if (pronominal) {
                                fileName = `${verb}se-${model}-${cIndexP++}-${region}`;
                            } else {
                                fileName = `${verb}-${model}-${cIndexN++}-${region}`;
                            }
                            const data = json2Text(conjugation.conjugation);

                            const goldData = goldFiles.get(fileName);
                            expect(goldData).not.toBeUndefined();

                            goldData!.forEach((line, index) => {
                                // Received                               Expected   
                                expect(`${index}:${data[index]}`).toBe(`${index}:${line}`);
                            });
                        });
                    });
                });
            });
        });
    });
});

