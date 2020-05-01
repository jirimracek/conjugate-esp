/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
import definitions from '../data/definitions.json';
import { ModelFactory } from './factory';
import { Regions, PronominalKeys } from './types';
import { VerbModelTemplates, VerbModelData, ModelAttributes, ResultTable } from './basemodel';

export type InfoType = { verb: string, model: string, region: string, pronominal: boolean, defective: boolean };
export type ErrorType = { ERROR: { message: string } };
export type ResultType = { info: InfoType, conjugation: ResultTable };
export type OutputType = ResultType[] | ErrorType;

export const ERROR_MSG = {
    UnknownVerb: 'Input error, unknown verb VERB',
    UnknownRegion: 'Input error, invalid region REGION',
    UnknownModel: 'Internal error, model MODEL not implemented, can\'t conjugate VERB, REGION, contact maintainer',
    UndefinedTemplates: 'Internal error, undefined templates, check definitions.json file, contact maintainer',
    MissingModelData: 'Internal error, missing verb VERB model data?, check definitions.json file, contact maintainer',
    NoVerbs: 'Internal error, no verbs, check definitions.json file, contact maintainer',
    NoModels: 'Internal error, no models, check definitions.json file, contact maintainer'
};

/**
 * Create instance of Conjugator, then
 * 
 * conjugator.conjugate(verb, region?)
 * 
 * verb: required
 * 
 * region: optional - 'castellano' | 'voseo' | 'formal' | 'canarias, defaults to 'castellano'
 * 
 */
export class Conjugator {
    protected templates: VerbModelTemplates = definitions;
    protected factory = new ModelFactory();

    constructor() { /* empty */ }

    /**
     * Sync version
     * 
     * @param verb required
     * @param region optional castellano|voseo|canarias|formal 
     */
    public conjugateSync(verb: string, region: Regions = 'castellano'): ResultType[] | ErrorType {
        const result: ResultType[] = [];
        try {
            if (!this.templates) {
                throw new Error(ERROR_MSG.UndefinedTemplates);
            }
            if (!this.getVerbListSync().includes(verb)) {
                throw new Error(ERROR_MSG.UnknownVerb.replace('VERB', verb));
            }
            if (!['castellano', 'voseo', 'canarias', 'formal'].includes(region)) {
                throw new Error(ERROR_MSG.UnknownRegion.replace('REGION', region));
            }

            const verbModelData = this.templates[verb] as VerbModelData;
            if (!verbModelData) {
                throw new Error(ERROR_MSG.MissingModelData.replace('VERB', verb));
            }

            // Things we need to know to construct the model 
            const modelTemplates: [string, PronominalKeys, Regions, ModelAttributes][] = [];
            (Object.keys(verbModelData) as PronominalKeys[]).forEach(pronominalKey => {
                // string | [string | ModelWithAttrs] | ModelWithAttrs
                const models = [verbModelData[pronominalKey]].flat();
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
                    throw new Error(
                        ERROR_MSG.UnknownModel.replace(/MODEL(.*)VERB(.*)REGION/,
                            `${modelName}$1${verb}$2${region}`));
                }

                const model = this.factory.getModel(verb, modelName, pronominalKey, region, attributes);

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
     * async version
     * 
     * @param verb to conjugate
     * @param region 
     */
    public conjugate(verb: string, region: Regions = 'castellano'): Promise<ResultType[]> {
        return new Promise((resolve, reject) => {
            const result: OutputType = this.conjugateSync(verb, region);
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
            console.error(ERROR_MSG.NoVerbs, error.message);
            return [ERROR_MSG.NoVerbs];
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
            console.error(ERROR_MSG.NoModels, error.message);
            return [ERROR_MSG.NoModels];
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