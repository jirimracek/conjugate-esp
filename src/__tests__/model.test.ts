/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
/* eslint-disable max-len */
import { Conjugator, Result, Regions} from '../index';
import { ModelFactory} from '../lib/factory';
import {Orthography} from '../lib/types';

// const VERB_COUNT = 10567;        // without reflexives
const VERB_COUNT = 14456;           // including reflexives
const MODEL_COUNT = 97;
// Disable thrown messages
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { /* empty */});
});
console.warn = jest.fn();

const cng = new Conjugator();
const verbList = cng.getVerbListSync();
let result: Result[] | string;


// Async tests required reading: https://jestjs.io/docs/en/asynchronous
// Test synchronous functions
describe('Model Test', () => {
    test('Random verb sync', () => {
        const index = Math.ceil(Math.random() * VERB_COUNT);
        const verb = verbList[index];
        // expect correct data
        result = cng.conjugateSync(verb, 'formal') as Result[];
        expect(result[0].info.verb).toEqual(verb);
        expect(result[0].info.reflexive).toEqual(verb.endsWith('se') ? true : false);

    });
    test('Random verb async', () => {
        const index = Math.ceil(Math.random() * VERB_COUNT);
        const verb = verbList[index];
        // expect correct data
        return cng.conjugate(verb, 'formal').then((result) => {
            expect((result as Result[])[0].info.verb).toEqual(verb);
            expect((result as Result[])[0].info.reflexive).toEqual(verb.endsWith('se') ? true : false);
        });
    });

    test('Unknown verb sync', () => {
        result = cng.conjugateSync('comemer', 'formal');
        expect(result).not.toBeInstanceOf(Array);
        expect(result).toEqual('Unknown verb comemer');
    });
    test('Unknown verb async', () => {
        return cng.conjugate('what ever', 'formal')
            .then((result) => expect(result).not.toBeInstanceOf(Array))
            .catch((error) =>
                expect(error).toEqual('Unknown verb what ever'));
    });

    test('Known verb sync', () => {
        // Couple of 'normal' tests
        result = cng.conjugateSync('partir');
        expect((result as Result[])[0].info.defective).toEqual(false);
        expect((result as Result[])[0].info.reflexive).toBe(false);
        expect((result as Result[])[0].conjugation.Subjuntivo.Presente[2]).toEqual('parta');

        expect((cng.conjugateSync('hablar') as Result[])[0].info.reflexive).toEqual(false);
        expect((cng.conjugateSync('hablarse') as Result[])[0].info.reflexive).toEqual(true);
        expect((cng.conjugateSync('temer') as Result[])[0].info.verb).toEqual('temer');
    });
    test('ver async', () => {
        return cng.conjugate('ver')
            .then((result) => {
                expect((result as Result[])[0].info.defective).toEqual(false);
                expect((result as Result[])[0].info.reflexive).toBe(false);
                expect((result as Result[])[0].conjugation.Subjuntivo.Presente[3]).toEqual('veamos');
            });
    });
    test('ir async', () => {
        return cng.conjugate('ir').then((result) =>
            expect((result as Result[])[0].info.reflexive).toEqual(false));
    });
    test('ir async', () => {
        return cng.conjugate('irse').then((result) =>
            expect((result as Result[])[0].info.reflexive).toEqual(true));
    });
    test('escabullirse async', () => {
        return cng.conjugate('escabullirse').then((result) =>
            expect((result as Result[])[0].info.verb).toEqual('escabullirse'));
    });

    test('Unknow region sync', () => {
        // force bad region
        const index = Math.ceil(Math.random() * VERB_COUNT);
        const verb = verbList[index];
        expect(cng.conjugateSync(verb, 'former' as Regions)).
            toEqual('Unknown region former');
    });
    test('Unknow region async', () => {
        // force bad region
        const index = Math.ceil(Math.random() * VERB_COUNT);
        const verb = verbList[index];
        return cng.conjugate(verb, 'castillano' as Regions).catch((error) =>
            expect(error).toEqual('Unknown region castillano'));
    });

    test('Verb, model counts sync', () => {
        expect(cng.getVerbListSync().length).toEqual(VERB_COUNT);
        expect(cng.getModelsSync().length).toEqual(MODEL_COUNT);
    });
    test('Verb count async', () => {
        return cng.getVerbList().then((result) => expect(result.length).toEqual(VERB_COUNT));
    });
    test('Model count async', () => {
        return cng.getModels().then((result) => expect(result.length).toEqual(MODEL_COUNT));
    });

    test('Ortho no effect', () => {
        // good input, good answers
        cng.setOrthography('2010');
        expect(cng.getOrthography()).toEqual('2010');
        result = cng.conjugateSync('hablar', 'voseo') as Result[];
        expect(result[0].info.ortho).toBeUndefined();          // ortho has no effect on hablar
    });

    test('Ortho 2010', () => {
        cng.setOrthography('2010');
        result = cng.conjugateSync('reírse') as Result[];
        expect(result[0].info.ortho).toEqual('2010');
    });

    test('Ortho invalid', () => {
        cng.setOrthography('2010');
        cng.setOrthography('2000' as Orthography);
        expect(cng.getOrthography()).toBe('2010');

        cng.setOrthography('1999');
        cng.setOrthography('2001' as Orthography);
        expect(cng.getOrthography()).toBe('1999');
    });

    test('Highlight', () => {
        const tags = {start: '*', end: '+', 'del': '-'};
        cng.setHighlightTags(tags);
        expect(cng.getHighlightTags()).toEqual(tags);
    });
});

describe('Model factory', () => {
    const factory = new ModelFactory();
    // serenar is not a model
    test('Not a model', () => {
        expect(factory.getModel('serenar', 'serenar', 'castellano', {})).toBeUndefined();
        expect(factory.getModel('hablar', 'invalid', 'canarias', {})).toBeUndefined();
    });

    // legit existing models
    test('Valid models', () => {
        expect(factory.getModel('hablar', 'hablar', 'voseo', {})).toBeDefined();
        expect(factory.getModel('partir', 'partir', 'formal', {})).toBeDefined();
        expect(factory.getModel('temer', 'temer', 'castellano', {})).toBeDefined();

        expect(factory.getModel('bs', 'temer', 'castellano', {})).toBeDefined();
        expect(factory.getModel('hablarse', 'hablar', 'voseo', {})).toBeDefined();
        expect(factory.getModel('partirse', 'partir', 'formal', {})).toBeDefined();
        expect(factory.getModel('temerse', 'temer', 'castellano', {})).toBeDefined();
    });

    test('Invalid models', () => {
        expect(factory.getModel('serenar', 'serenar', 'castellano', {} )).toBeUndefined();
        expect(factory.getModel('hablar', 'invalid', 'canarias', {})).toBeUndefined();
    });

    test('Simulated models', () => {
        // Should return base model temer because caer is an er model
        expect(factory.getModel('serenar', 'caer', 'castellano', {}, true)).toBeDefined();
        // Returns hablar, dar is 'ar'
        expect(factory.getModel('caer', 'dar', 'canarias', {}, true)).toBeDefined();
    });
});
