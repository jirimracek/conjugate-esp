/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
import definitions from '../data/definitions.json';
import { ModelFactory } from './factory';
import { Regions, PronominalKey, Orthography, Highlight } from './types';
import { ModelAttributes, ResultTable, Model, ModelWithAttributes } from './basemodel';

export { Regions, PronominalKey, ResultTable };


export type VerbModelData = { [key in PronominalKey]?: Model[] | Model };
export type Info = { verb: string, model: string, region: string, pronominal: boolean, defective: boolean };
export type ErrorType = { ERROR: { message: string } };
export type Result = { info: Info, conjugation: ResultTable };

export const errorMsg = {
    unknownVerb: 'Input error, unknown verb VERB',
    unknownRegion: 'Input error, invalid region REGION',
    unknownModel: 'Internal error, model MODEL not implemented, can\'t conjugate VERB, REGION, contact maintainer',
    noTemplates: 'Internal error, undefined templates, check definitions.json file, contact maintainer',
    noModelData: 'Internal error, missing verb VERB model data?, check definitions.json file, contact maintainer',
    noVerbs: 'Internal error, no verbs, check definitions.json file, contact maintainer',
    noModels: 'Internal error, no models, check definitions.json file, contact maintainer'
};

export type VerbModelTemplates = { [verbname: string]: VerbModelData };

/**
 * Create instance of Conjugator, then
 * 
 * conjugator.conjugate(verb, region?)
 * 
 * verb: required
 * 
 * region: optional - 'castellano' | 'voseo' | 'formal' | 'canarias, defaults to 'castellano'
 * See types.ts for detailed documentation on orthography and attributes
 * 
 */
export class Conjugator {
    protected templates: VerbModelTemplates = definitions;
    protected factory: ModelFactory = new ModelFactory();

    constructor() { /* empty */ }

    /**
     * Sync version, call conjugate() for async
     * 
     * @param verb required - base verb form (no pronominal ending 'se'). Ex.: 'hablar', not 'hablarse'.  
     * Returned Result[] includes pronominal as well as defective conjugations where appropriate
     * @param region optional, castellano | voseo | canarias | formal, default: castellano
     * @param ortho optional, pre2010 | 2010, default: 2010 - use 2010 orthography only (rio only), pre2010 returns both (rio and rió)
     * @param highlight optional, true | false, default: false - if true, insert highlight characters
     */
    public conjugateSync(verb: string, region: Regions = 'castellano', ortho: Orthography = '2010', highlight: Highlight = false): Result[] | ErrorType {
        const result: Result[] = [];
        try {
            if (!this.templates) {
                throw new Error(errorMsg.noTemplates);
            }
            if (!this.getVerbListSync().includes(verb)) {
                throw new Error(errorMsg.unknownVerb.replace('VERB', verb));
            }
            if (!['castellano', 'voseo', 'canarias', 'formal'].includes(region)) {
                throw new Error(errorMsg.unknownRegion.replace('REGION', region));
            }

            const verbModelData = this.templates[verb] as VerbModelData;
            if (!verbModelData) {
                throw new Error(errorMsg.noModelData.replace('VERB', verb));
            }

            // Things we need to know to construct the model 
            const modelTemplates: [string, PronominalKey, Regions, ModelAttributes][] = [];
            (Object.keys(verbModelData) as PronominalKey[]).forEach(pronominalKey => {
                // string | [string | ModelWithAttrs] | ModelWithAttrs
                const models = [verbModelData[pronominalKey]].flat();
                models.forEach(model => {
                    if (typeof model === 'string') {
                        modelTemplates.push([model, pronominalKey, region, {}]);
                    } else {                                                   
                        // it's a ModelWithAttrs
                        const [name, attributes] =
                            (Object.entries(model as ModelWithAttributes)).flat() as [string, ModelAttributes];
                        // if ortho is strict 2010 and M attr exists and it's falue is 'false' then skip this model
                        // if (ortho === '2010' && attributes['M'] !== 'undefined' && attributes['M'] === 'false') {
                        //     console.log(`Skip ${verb}, ${name}, M=${attributes['M']}`);
                        // } else {
                        //     modelTemplates.push([name as string, pronominalKey, region, attributes]);
                        // }
                        if (ortho !== '2010' || attributes['M'] === 'undefined' || attributes['M'] !== 'false') {
                            modelTemplates.push([name as string, pronominalKey, region, attributes]);
                        // } else {
                        //     console.log(`Skip ${verb}, ${name}, M=${attributes['M']}`);
                        }
                    }
                });
            });

            // Construct each model based on its recipe and get the verb conjugated based on given model
            modelTemplates.forEach(template => {
                const [modelName, pronominalKey, region, attributes] = template;
                const model = this.factory.getModel(verb, modelName, pronominalKey, region, attributes);
                if (!model) {
                    throw new Error(
                        errorMsg.unknownModel.replace(/MODEL(.*)VERB(.*)REGION/,
                            `${modelName}$1${verb}$2${region}`));
                }

                result.push({
                    info: {
                        verb: pronominalKey === 'P' ? `${verb}se` : verb,
                        model: modelName,
                        region: region,
                        pronominal: (pronominalKey === 'P'),
                        defective: !!(attributes['D'])
                    },
                    conjugation: model.getConjugation()
                });
            });
            return result;
        } catch (error) {
            console.error(error);
            return { ERROR: { message: error.message } };
        }
    }

    /**
     * Async version, conjugateSync() for sync version
     * 
     * @param verb required - base verb form (no pronominal ending 'se'). Ex.: 'hablar', not 'hablarse'.  
     * Returned Result[] includes pronominal as well as defective conjugations where appropriate
     * @param region optional, castellano | voseo | canarias | formal, default: castellano
     * @param ortho optional, pre2010 | 2010, default: 2010 - use 2010 orthography
     * @param highlight optional, true | false, default: false - if true, insert highlight characters
     */
    public conjugate(verb: string, region: Regions = 'castellano', ortho: Orthography = '2010', highlight: Highlight = false): Promise<Result[] | ErrorType> {
        return new Promise((resolve, reject) => {
            const result: Result[] | ErrorType = this.conjugateSync(verb, region, ortho, highlight);
            if (Array.isArray(result)) {
                resolve(result);
            } else {
                reject(result);
            }
        });
    }

    /**
     * get sorted list of known verbs,
     */
    public getVerbListSync(): string[] {
        try {
            return Object.keys(this.templates).sort(function (a, b) { return a.localeCompare(b); });
        } catch (error) {
            console.error(errorMsg.noVerbs, error.message);
            return [errorMsg.noVerbs];
        }
    }

    public getVerbList(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const result = this.getVerbListSync();
            if (result.length > 1) {
                resolve(result);
            } else {
                reject(result);
            }
        });
    }


    /**
     * list of all models, sync version
     * 
     */
    public getModelsSync(): string[] {
        try {
            return this.factory.getModels();
        } catch (error) {
            console.error(errorMsg.noModels, error.message);
            return [errorMsg.noModels];
        }
    }

    /**
     * list of all models
     * 
     */
    public getModels(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const result = this.getModelsSync();
            if (result.length > 1) {
                resolve(result);
            } else {
                reject(result);
            }
        });
    }
}