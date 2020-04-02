/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import definitions from '../data/definitions.json';
import { ModelFactory } from './factory';
import { json2Text } from './utilities/modelutils';
import { PRONOMINAL } from './declarations/constants';
import { ConjugationTable, DB, DefectiveData, Regions, PronominalKeys, VerbModelData, ModelAttributes } from './declarations/types';

export type InfoType = { model: string, region: string, pronominal: boolean, defective: boolean };
export type ResultType = { info: InfoType, conjugation: ConjugationTable };
export type FormatType = 'json' | 'text';
// export type ErrorType = { Message: string, Usage: string };
// export const ERROR = {
//     Message: '',
//     Usage: "conjugate(verb: string, region: 'castellano' | 'voseo' | 'canarias' | 'formal', format: 'json' | 'text')"
// } as ErrorType;

const REGIONS = ['castellano', 'voseo', 'canarias', 'formal'] as Regions[];

/**
 * Create instance of Conjugator, 2 public methods: conjugate() and getVerbList()
 * 
 * conjugator.conjugate(verb, region?, format?)
 * 
 * verb: required
 * 
 * region: optional - 'castellano' | 'voseo' | 'formal' | 'canarias, defaults to 'castellano'
 * 
 * format: optional - 'text' | 'json', defaults to 'json'
 * 
 */
export class Conjugator {
    protected templates: DB = definitions;
    private defective: DefectiveData = definitions['defectives'];
    private factory = new ModelFactory();

    constructor() { }

    /**
     * list of known verbs
     */
    public getVerbList(): string[] {
        try {
            const retVal = Object.keys(this.templates);
            return retVal.slice(0, retVal.length - 1);                // drop defectives
        } catch (error) {
            console.error(`No verbs - check definitions.json file`);
            return [];
        }
    }

    /**
     * 
     * @param verb required
     * @param region optional castellano|voseo|canarias|formal 
     * @param format optional json|text 
     */
    public conjugate(verb: string, region: Regions = 'castellano', format: FormatType = 'json'): string [] | ResultType [] {
        const jsonResult: ResultType [] = [];
        const textResult: string[] = [];
        try {
            if (!this.templates) {
                throw new Error('Undefined templates - check definitions.json file');
            }
            if (!this.getVerbList().includes(verb)) {
                throw new Error(`Unknown verb ${verb}`);
            }
            if (!['castellano', 'voseo', 'canarias', 'formal'].includes(region)) {
                throw new Error(`Unknown region ${region}`);
            }
            if (!['json', 'text'].includes(format)) {
                throw new Error(`Unknown output format ${format}`);
            }

            const verbModelData = this.templates[verb] as VerbModelData;
            if (!verbModelData) {
                throw new Error(`Missing model data for verb ${verb} - check definitions.json file`);
            }

            // Things we need to know to construct the various models (for multiple conjugations)
            const ingredients: [string, PronominalKeys, Regions, ModelAttributes][] = [];
            const pronominalKeys = Object.keys(verbModelData) as PronominalKeys[];
            pronominalKeys.forEach(pronominalKey => {
                const models = [verbModelData[pronominalKey]].flat();          // string | [string | ModelWithAttrs] | ModelWithAttrs
                models.forEach(model => {
                    if (typeof model === 'string') {
                        ingredients.push([model, pronominalKey, region, {}]);
                        // } else if (Array.isArray(model)) {                        // [string, ModelWithAttrs, string, ....]
                        //     model.forEach(modelType => {
                        //         if (typeof modelType === 'string') {             // string
                        //             ingredients.push([modelType, pronominalKey, region, {}]);
                        //         } else {                                         // ModelWithAttrs
                        //             const [name, attributes] = (Object.entries(modelType) as [[string, ModelAttributes]]).flat();
                        //             ingredients.push([name, pronominalKey, region, attributes]);
                        //         }
                        //     });
                    } else {                                                // ModelWithAttrs
                        const [name, attributes] = (Object.entries(model) as [[string, ModelAttributes]]).flat();
                        ingredients.push([name, pronominalKey, region, attributes]);
                    }
                });
            });

            ingredients.forEach(ingredient => {
                const [name, pronominalKey, region, attributes] = ingredient;
                if (!this.factory.isImplemented(name)) {
                    throw new Error(`Model ${name} not implemented, can't do ${verb} ${region}`);
                }
                // List of regions other than current region, use to filter out unnecessary defectives
                const filters = REGIONS.filter(r => r != region);
                // Expand attributes if any
                let modelAttributes = <ModelAttributes>{};
                Object.entries(attributes).forEach(([key, data]) => {
                    if (!filters.includes(key as Regions)) {
                        if (key === region || key === 'A') {
                            modelAttributes[region] = this.defective[data as string] as number[];
                        } else {
                            modelAttributes[key] = data;
                        }
                    }
                });

                const model = this.factory.getModel(name, pronominalKey, region, modelAttributes);

                if (format === 'text') {
                    textResult.push(`model:${name}, region:${region}, pronominal:${pronominalKey === PRONOMINAL}, defective:${!!(modelAttributes[region])}`);
                    textResult.push(...json2Text(model.getConjugationOf(verb)));
                } else {
                    jsonResult.push({
                        info: { model: name, region: region, pronominal: (pronominalKey === PRONOMINAL), defective: !!(modelAttributes[region]) },
                        conjugation: model.getConjugationOf(verb)
                    });
                }
            });
            if (format === 'json') {
                return jsonResult;
            }
            return textResult;

        } catch (error) {
            console.error(error);
            if (format === 'json') {
                return [{} as ResultType];
            }
            return [];
        }
    }
}