/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { Conjugator } from '../../index';
import fs from 'fs';
import path from 'path';
import { ResultType } from '../conjugator';
import { ModelFactory } from '../factory';
import { Empty } from '../basemodel';
import { Regions, VerbModelData, DB } from '../declarations/types'
import { json2Text } from '../utilities/modelutils';

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
        // undefine verb model data in templates
        expect(mockjugator.conjugate('vivir', 'formal')).not.toEqual([{}]);
        mockjugator.undefineModelData('vivir');
        expect(mockjugator.conjugate('vivir', 'formal')).toEqual([{}]);
        mockjugator.restore();
        expect(mockjugator.conjugate('vivir', 'formal')).not.toEqual([{}]);

        mockjugator.deleteTemplates();
        expect(mockjugator.conjugate('amar', 'castellano')).toEqual([{}]);
        expect(mockjugator.getVerbList()).toEqual([]);
        mockjugator.restore();

        expect(mockjugator.conjugate('amar', 'castellano')).not.toEqual([{}]);
        expect(mockjugator.getVerbList()).not.toEqual([]);
        mockjugator.restore();

        expect(mockjugator.conjugate('amar', 'castellano')).not.toEqual([{}]);
    });



    const conjugator = new Conjugator();
    const TEST_DIR = './testdata';
    const linesPerConjugation = 124;    // each text conjugation is 124 lines 
    const models: string[] = ['amar', 'temer', 'vivir'];
    const verbs: string[] = [];
    const regionsToTest = shuffle(['castellano', 'voseo', 'formal', 'canarias']) as Regions[];
    models.push('actuar', 'adquirir', 'agorar', 'aguar', 'ahincar', 'aislar', 'andar', 'cazar', 'pensar');
    models.push('abrir', 'argüir');
    verbs.push(...models);
    // some interesting verbs
    verbs.push('abar');        // the only known trimorfo         "abar": { "P": { "amar": { "d": "trimorfo" } } }
    verbs.push('abolir');      // interesting imorfo              "abolir": { "N": [ "vivir", { "vivir": { "d": "imorfo" } } ] },
    verbs.push('aclarar');     // dual, defective                 "aclarar": { "N": [ "amar", { "amar": { "d": "imper" } } ], "P": "amar" },
    verbs.push('adecuar');     // dual, non defective             "adecuar": { "N": [ "amar", "actuar" ], "P": [ "amar", "actuar" ]
    verbs.push('antojar');     // defective terciopersonal v2     "antojar": { "P": { "amar": { "d": "terciop" } } },

    verbs.push('inhestar');    // participio irregular, replace   "inhestar": { "N": { "pensar": { "PR": "estad/iest" } }
    verbs.push('puar');        // dual, monosyllables             "puar": { "N": [ "actuar", { "actuar": { "MS": "true" } } ] },
    verbs.push('serenar');     // triple, defective, both N + P   "serenar": { "N": [ "amar", { "amar": { "d": "imper" } } ], "P": "amar" },
    verbs.push('ventar');      // triple, defective               "ventar": { "N": [ { "pensar": { "d": "imper" } }, "amar", "pensar" ] },

    const verbsToTest = shuffle(conjugator.getVerbList().filter(verb => verbs.includes(verb)));

    test('Availability', () => {
        verbs.forEach(verb => {
            // this can happen if something goes wrong with the db (partial db during development)
            if (!verbsToTest.includes(verb)) {
                fail(`FIXME: '${verb}' not available for testing`);
            }
        });
    });

    test('Bad Input', () => {
        expect(conjugator.conjugate('amarse', 'castellano')).toEqual([{}]);
        // force bad region
        expect(conjugator.conjugate('temer', 'castillano' as Regions)).toEqual([{}]);
    });

    test('ModelFactory', () => {
        const testFactory = new ModelFactory();
        // serenar is not a model, getModel should return Empty
        expect(testFactory.getModel('serenar', 'N', 'castellano', {})).toBeInstanceOf(Empty);
        expect(testFactory.getModel('invalid', 'N', 'canarias', {})).toBeInstanceOf(Empty);

        // legit existing models
        expect(testFactory.getModel('amar', 'P', 'voseo', {})).not.toBeInstanceOf(Empty);
        expect(testFactory.getModel('vivir', 'P', 'formal', {})).not.toBeInstanceOf(Empty);
        expect(testFactory.getModel('temer', 'P', 'castellano', {})).not.toBeInstanceOf(Empty);

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
        expect(conjugator.conjugate('yacer', 'formal')).toEqual([{}]);
    });

    test('Optional parameters', () => {
        expect(conjugator.conjugate('amarse')).toEqual([{}]);
        // force bad region
        expect(conjugator.conjugate('temer', 'castillano' as Regions)).toEqual([{}]);
        // good input
        expect(conjugator.conjugate('amar')).not.toEqual([]);
        expect(conjugator.conjugate('vivir')).not.toEqual([{}]);
    });


    describe("Conjugation Test", () => {
        verbsToTest.forEach(verb => {
            const testFiles = fs.readdirSync(path.join(TEST_DIR, verb), 'utf8');
            test(`${verb}`, () => {
                regionsToTest.forEach(region => {
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

                        const info = conjugation.info;
                        expect(info).not.toBeUndefined();

                        const [model, region, pronominal, defective] = [info.model, info.region, info.pronominal, info.defective];
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

