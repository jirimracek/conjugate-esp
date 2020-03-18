/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import definitions from './data/definitions.json';
// import fs from 'fs';
import { Factory } from './lib/factory';
import { RegionType, FormatType, V2M_SectionType, V2M_AttrDefinitionType, V2M_AttrIndexedType, V2M_PronType, V2M_AttrType, ResultType, TableType } from './lib/interfaces.js';


/**
 * @classdesc the instance is exported as 'conjugator'  Usage: 
 * conjugator.conjugate(verb, region?, format?)
 * 
 * regions: 'castellano'|'voseo'|'formal'|'canarias, defaults to 'castellano'
 * format: 'text'|'json', defaults to 'json'
 * 
 */
class Conjugator {
    /** @private object of verb to verb model relationship, multiple conjugations, reflexives, defectiveness, etc. */
    private allDefinitions: V2M_SectionType = definitions;
    /** @private expanded attributes definitions.  Verb model may contain attributes.  Attributes describe special version of the verb/model, for example defectiveness.  */
    private attributeDefinitions: V2M_AttrDefinitionType = definitions['attrs'];
    /** @private model maker */
    private factory = new Factory();

    constructor() { }

    /**
     * @returns list of known verbs
     */
    public getVerbList(): string[] {
        return Object.keys(this.allDefinitions).slice(1);
    }

    public conjugate(verb: string, region: RegionType = 'castellano', format: FormatType = 'json'): Array<string> | Array<ResultType> {
        const results: Array<ResultType> = [];
        const resultStringArray: string[] = [];
        // get models and their config data 
        // "desvaír": { "N": { "embaír": { "canarias": "D_7", "castellano": "D_8", "formal": "D_7", "voseo": "D_9" }, "embaír_": {} }, ... 
        const verbDefinition = this.allDefinitions[verb];
        Object.entries(verbDefinition).forEach(([pronominalType, modelTypes]) => {      // each pronominal type section (N|P)- 
            // console.log(`${pronominalType}`);
            Object.entries(modelTypes).forEach(([alias, indexedAttribute]) => {         // model: {attributes?}
                // so far the only known possible attributes are array of defective indexes
                // try the region, if it doesn't work try 'A' (all), if it doesn't work, return '' instead of undefined
                const attributeIndex: string = (indexedAttribute as V2M_AttrIndexedType)[region] ?? (indexedAttribute as V2M_AttrIndexedType)['A'] ?? '';
                const attributes: V2M_AttrType = this.attributeDefinitions[attributeIndex] ?? [];         // if attributeIndex was '', we'll get empty [] here
                const name = alias.replace(/_*$/, '');
                const model = this.factory.getModel(name, alias, (pronominalType as V2M_PronType), region, attributes);
                if (format === 'text') {
                    resultStringArray.push(`model:${name}, alias:${alias}, region:${region}, pronominal:${pronominalType === 'P'}, defective:${attributes.length !== 0}`);
                    resultStringArray.push(... (model.getConjugationOf(verb, format) as string[]));
                } else {
                    results.push({
                        info: { model: name, alias: alias, region: region, pronominal: (pronominalType === 'P'), defective: (attributes.length !== 0) },
                        conjugation: (model.getConjugationOf(verb, format) as TableType)
                    });
                }
            });
        });
        if (results.length > 0) {
            return results;
        }
        return resultStringArray;
    }
}
const conjugator = new Conjugator();
export { conjugator };


// const verb = 'amar';
// const verb = 'temer';
// const verb = 'abatir';
// const verb = 'abolir';
// const verb = 'abar';
// const verb = 'acuantiar';
// const region = 'castellano';
// let format: any = 'json';
// const j = conjugator.conjugate(verb, region, format);
// fs.writeFileSync(`${verb}.${region}.${format}`, JSON.stringify(j), 'utf8');
// format = 'text';
// const t = conjugator.conjugate(verb, region, format);
// fs.writeFileSync(`${verb}.${region}.${format}`, t.join('\n'), 'utf8');

