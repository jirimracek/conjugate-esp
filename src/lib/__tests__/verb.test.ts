/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { conjugator } from '../../../dist/index';
import { RegionType } from '../../../dist/lib/interfaces';
import fs from 'fs';
import path from 'path';

const TEST_DIR = './testdata';

// AR:
//    amar - base model, nonpronominal only
//    abandonar - abandonar, abandonarse
//    abar - abarse, defective
// ER:
//    temer - base model, pronominal
//    arder - arder, arderse
//    -er doesn't seem to have a single defective
// IR:
//    vivir - base model 
//    batir - batir, batirse
//    abolir - defective
//    
//    
// const verbsToTest = ['abandonar', 'abar', 'amar', 'pasear'];
// const verbsToTest = ['vivir'];
const verbsToTest = ['amar', 'abandonar', 'abar', 'temer', 'arder', 'vivir', 'batir', 'abolir'];
// const regionsToTest: RegionType[] = ['voseo', 'canarias'];
const regionsToTest: RegionType[] = ['castellano', 'voseo', 'formal', 'canarias'];

const list = conjugator.getVerbList().filter(verb => verbsToTest.includes(verb));

test('Verify available', () => {
    verbsToTest.forEach(verb => {
        if (!list.includes(verb)) {
            fail(`FIXME: '${verb}' not available for testing`);
        }
    });
});

shuffle(list);

const linesPerConjugation = 124;    // each text conjugation is 124 lines 

function shuffle(array: string[]) {
    let count = array.length, temp, index;

    // While there remain elements to shuffle…
    while (count) {
        // Pick remaining 
        index = Math.floor(Math.random() * count--);
        // And swap it with the current 
        temp = array[count];
        array[count] = array[index];
        array[index] = temp;
    }
    return array;
}

list.forEach(verb => {
    const testFiles = fs.readdirSync(path.join(TEST_DIR, verb), 'utf8');
    // console.log(testFiles);
    shuffle(regionsToTest);
    regionsToTest.forEach(region => {
        const conjugations: string[][] = [];
        const conjugated = conjugator.conjugate(verb, region, 'text') as string[];
        while (conjugated.length > 0) {
            conjugations.push(conjugated.splice(0, linesPerConjugation));
        }
        const regionFiles = testFiles.filter(file => file.endsWith(region));
        const gold: Map<string, string[]> = new Map();
        regionFiles.forEach(file => gold.set(file, fs.readFileSync(path.join(TEST_DIR, verb, file), 'utf8').split('\n')));

        //// ----
        test(`${verb}:${region}:[${conjugations.length}/${regionFiles.length}]`, () => {
            expect(conjugations.length).toBe(regionFiles.length);
            // });
            // console.log(regionFiles);
            conjugations.forEach(conjugation => {

                const info = conjugation.shift();
                // console.log(info);
                const [model, alias, region, pronominal, defective] = info?.split(',').map(chunk => chunk?.split(':').filter((info, index) => index === 1).join()) as string[];
                // console.log(model, region, pronominal, defective);
                const fileName = `${verb}${pronominal === 'true' ? 'se' : ''}-${alias}-${region}`;
                // console.log(fileName);
                const goldData = gold.get(fileName);
                //// ----
                // test(`${fileName.replace(/-/g, ':')}`, () => {
                goldData?.forEach((line, index) => {
                    // Leave these here to make debug easier
                    if (`${index}:${conjugation[index]}` !== `${index}:${line}`) {
                        const localModel = model;
                        const localAlias = alias;
                        const localRegion = region;
                        const localPronominal = pronominal;
                        const localDefective = defective;
                        const localGoldData = goldData;
                        const localInfo = info;
                        const localGold = gold;
                        const localFileName = fileName;
                        debugger;
                    }
                    // Received                               Expected   
                    expect(`${index}:${conjugation[index]}`).toBe(`${index}:${line}`);
                });
            });
        });
    });
});
