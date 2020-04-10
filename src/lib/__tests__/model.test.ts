/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { Conjugator } from '../../index';
import fs from 'fs';
import path from 'path';
import { ResultType, FormatType } from '../conjugator';
import { ModelFactory } from '../factory';
import { Empty } from '../basemodel';
import { Regions, VerbModelData, DB } from '../declarations/types'

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
        expect(mockjugator.conjugate('vivir', 'formal', 'text')).not.toEqual([]);
        expect(mockjugator.conjugate('vivir', 'formal', 'json')).not.toEqual([{}]);
        mockjugator.undefineModelData('vivir');
        expect(mockjugator.conjugate('vivir', 'formal', 'text')).toEqual([]);
        expect(mockjugator.conjugate('vivir', 'formal', 'json')).toEqual([{}]);
        mockjugator.restore();
        expect(mockjugator.conjugate('vivir', 'formal', 'text')).not.toEqual([]);
        expect(mockjugator.conjugate('vivir', 'formal', 'json')).not.toEqual([{}]);

        mockjugator.deleteTemplates();
        expect(mockjugator.conjugate('amar', 'castellano', 'text')).toEqual([]);
        expect(mockjugator.conjugate('amar', 'castellano', 'json')).toEqual([{}]);
        expect(mockjugator.getVerbList()).toEqual([]);
        mockjugator.restore();

        expect(mockjugator.conjugate('amar', 'castellano', 'text')).not.toEqual([]);
        expect(mockjugator.conjugate('amar', 'castellano', 'json')).not.toEqual([{}]);
        expect(mockjugator.getVerbList()).not.toEqual([]);
        mockjugator.restore();

        expect(mockjugator.conjugate('amar', 'castellano', 'text')).not.toEqual([]);
        expect(mockjugator.conjugate('amar', 'castellano', 'json')).not.toEqual([{}]);
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
    verbs.push('inhestar');    // participio irregular  {"N":{"pensar":{"PR":"estad/iest"}}}
    verbs.push('ventar');      // {"N":[{"pensar":{"A":"D_1","SN":"true"}}
    verbs.push('serenar');     // {"N":["amar",{"amar":{"A":"D_1","SN":"true"}}],"P":"amar"}
    verbs.push('adecuar');     // dual {"N":["amar","actuar"],"P":["amar","actuar"]}
    verbs.push('aclarar');     // aclarar":{"N":["amar",{"amar":{"A":"D_1","SN":"true"}}],"P":"amar"}
    verbs.push('abolir');      // {"N":["vivir",{"vivir":{"canarias":"D_2","castellano":"D_3","formal":"D_2","voseo":"D_4"}}]}
    verbs.push('puar');        // dual conjugation, monosyllables accentuation rules {"N":["actuar",{"actuar":{"MS":"true"}}]}



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
        expect(conjugator.conjugate('amarse', 'castellano', 'json')).toEqual([{}]);
        // force bad region
        expect(conjugator.conjugate('temer', 'castillano' as Regions, 'json')).toEqual([{}]);
        // force bad format
        expect(conjugator.conjugate('vivir', 'voseo', 'jsn' as FormatType)).toEqual([]);
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
        expect(conjugator.conjugate('yacer', 'formal', 'text')).toEqual([]);
        expect(conjugator.conjugate('yacer', 'formal', 'json')).toEqual([{}]);
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
                    const conjugations: string[][] = [];
                    const conjugated = conjugator.conjugate(verb, region, 'text') as string[];

                    while (conjugated.length > 0) {
                        conjugations.push(conjugated.splice(0, linesPerConjugation));
                    }

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

                        const info = conjugation.shift();
                        expect(info).not.toBeUndefined();

                        const [model, region, pronominal, defective] = info!.split(',').map(chunk => chunk!.split(':').filter((info, index) => index === 1).join()) as string[];
                        let fileName = '';
                        if (pronominal === 'true') {
                            fileName = `${verb}se-${model}-${cIndexP++}-${region}`;
                        } else {
                            fileName = `${verb}-${model}-${cIndexN++}-${region}`;
                        }

                        // console.log(fileName);
                        const goldData = goldFiles.get(fileName);
                        expect(goldData).not.toBeUndefined();

                        goldData!.forEach((line, index) => {
                            // Leave these here to make debug easier
                            if (`${index}:${conjugation[index]}` !== `${index}:${line}`) {
                                const dbgModel = model;
                                const dbgRegion = region;
                                const dbgPronominal = pronominal;
                                const dbgDefective = defective;
                                const dbgGoldData = goldData;
                                const dbgInfo = info;
                                const dbgGold = goldFiles;
                                const dbgFileName = fileName;
                                debugger;
                            }
                            // Received                               Expected   
                            expect(`${index}:${conjugation[index]}`).toBe(`${index}:${line}`);
                        });
                    });
                });
            });
        });

    });


    // Verify json and text headers have the same data
    test(`Info Header Test`, () => {
        verbsToTest.forEach(verb => {
            regionsToTest.forEach(region => {
                const conjugations: string[][] = [];
                const conjugated = conjugator.conjugate(verb, region, 'text') as string[];
                const jsonConjugations = conjugator.conjugate(verb, region, 'json') as Array<ResultType>;

                while (conjugated.length > 0) {
                    conjugations.push(conjugated.splice(0, linesPerConjugation));
                }

                conjugations.forEach((textArray, index) => {
                    const jsonConjugation = jsonConjugations[index];
                    expect(jsonConjugation).not.toBeUndefined();

                    const textShifted = textArray.shift();
                    expect(textShifted).not.toBeUndefined();

                    const textSplit = textShifted!.split(',');
                    expect(textSplit).not.toBeUndefined();

                    const info = textSplit.map(data => data.split(':')[1]);
                    expect(info).not.toBeUndefined();

                    const jInfo = Object.values(jsonConjugation.info);
                    expect(jInfo).not.toBeUndefined();

                    info!.forEach((info, index) => {
                        expect(info).toEqual(jInfo[index].toString());
                    });
                });
            });
        });
    });
});

