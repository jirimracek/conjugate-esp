/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
/* eslint-disable max-len */
import { Conjugator } from '../index';
import { Info, Result, ErrorType, VerbModelData, VerbModelTemplates, errorMsg } from '../lib/conjugator';
import { ModelFactory } from '../lib/factory';
import { Regions } from '../lib/types';
import { shuffle, verbsToTest } from './include';

const VERB_COUNT = 10567;
const MODEL_COUNT = 97;
// Disable thrown messages
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { /* empty */ });
});

const temp = new Conjugator();
const models: string[] = temp.getModelsSync();
const verbs = shuffle([...verbsToTest(), ...models]);

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

    const toTest = shuffle(conjugator.getVerbListSync().filter(verb => verbs.includes(verb)));
    test('Availability', () => {
        verbs.forEach(verb => {
            // this can happen if something goes wrong with the db (partial db during development)
            if (!toTest.includes(verb)) {
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
