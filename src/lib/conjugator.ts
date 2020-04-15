/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import definitions from '../data/definitions.json';
import { ModelFactory } from './factory';
import { ConjugationTable, DB, Regions, PronominalKeys, VerbModelData, ModelAttributes } from './declarations/types';

export type InfoType = { model: string, region: string, pronominal: boolean, defective: boolean };
export type ResultType = { info: InfoType, conjugation: ConjugationTable };

/**
 * Create instance of Conjugator, 2 public methods: conjugate() and getVerbList()
 * 
 * conjugator.conjugate(verb, region?)
 * 
 * verb: required
 * 
 * region: optional - 'castellano' | 'voseo' | 'formal' | 'canarias, defaults to 'castellano'
 * 
 */
export class Conjugator {
    protected templates: DB = definitions;
    protected factory = new ModelFactory();

    constructor() { }

    /**
     * get sorted list of known verbs
     */
    public getVerbList(): string[] {
        try {
            return Object.keys(this.templates).sort(function (a, b) { return a.localeCompare(b); });
        } catch (error) {
            console.error(`No verbs - check definitions.json file`);
            return [];
        }
    }

    /**
     * 
     * @param verb required
     * @param region optional castellano|voseo|canarias|formal 
     */
    public conjugate(verb: string, region: Regions = 'castellano'): ResultType[] {
        const result: ResultType[] = [];
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

            const verbModelData = this.templates[verb] as VerbModelData;
            if (!verbModelData) {
                throw new Error(`Missing model data for verb ${verb} - check definitions.json file`);
            }

            // Things we need to know to construct the model 
            const modelTemplates: [string, PronominalKeys, Regions, ModelAttributes][] = [];
            (Object.keys(verbModelData) as PronominalKeys[]).forEach(pronominalKey => {
                const models = [verbModelData[pronominalKey]].flat();          // string | [string | ModelWithAttrs] | ModelWithAttrs
                models.forEach(model => {
                    if (typeof model === 'string') {
                        modelTemplates.push([model, pronominalKey, region, {}]);
                    } else {                                                   // ModelWithAttrs
                        const [name, attributes] = (Object.entries(model) as [[string, ModelAttributes]]).flat();
                        modelTemplates.push([name, pronominalKey, region, attributes]);
                    }
                });
            });

            // Construct each model based on its recipe and get the verb conjugated based on given model
            modelTemplates.forEach(template => {
                const [modelName, pronominalKey, region, attributes] = template;
                if (!this.factory.isImplemented(modelName)) {
                    throw new Error(`Model ${modelName} not implemented, can't do ${verb} ${region}`);
                }

                const model = this.factory.getModel(verb, modelName, pronominalKey, region, attributes);

                result.push({
                    info: { model: modelName, region: region, pronominal: (pronominalKey === 'P'), defective: !!(attributes['_d_']) },
                    conjugation: model.getConjugationOf()
                });
            });
            return result;

        } catch (error) {
            console.error(error);
            return [{} as ResultType];
        }
    }
}