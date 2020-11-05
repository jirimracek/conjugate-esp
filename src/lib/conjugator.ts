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
export type Info = {
    verb: string,
    model: string,
    region: string,
    pronominal: boolean,
    defective: boolean,
    ortho?: Orthography,
    highlight?: Highlight
};

export type ErrorType = { ERROR: { message: string } };
export type Result = {
    info: Info,
    conjugation: ResultTable
};
export type VerbModelTemplates = { [verbname: string]: VerbModelData };

export const errorMsg = {
    unknownVerb: 'Input error, unknown verb VERB',
    unknownRegion: 'Input error, invalid region REGION',
    unknownModel: 'Internal error, model MODEL not implemented, can\'t conjugate VERB, REGION, contact maintainer',
    noTemplates: 'Internal error, undefined templates, check definitions.json file, contact maintainer',
    noModelData: 'Internal error, missing verb VERB model data?, check definitions.json file, contact maintainer',
    noVerbs: 'Internal error, no verbs, check definitions.json file, contact maintainer',
    noModels: 'Internal error, no models, check definitions.json file, contact maintainer'
};

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
    private orthography: Orthography;
    private highlight: Highlight;

    /**
     * 
     * @param ortho optional, 1999|2010, default 2010 - use 2010 orthography 
     * @param highlight optional, true|false, insert highlight chars, default false
     */
    constructor(ortho: Orthography = '2010', highlight: Highlight = false) {
        this.orthography = ortho;
        this.highlight = highlight;
    }

    public setOrthography (ortho: Orthography): void {
        this.orthography = ortho;
    }

    public getOrthography (): Orthography {
        return this.orthography;
    }

    public setHighlight (highlight: Highlight): void {
        this.highlight = highlight;
    }

    public getHighlight(): Highlight {
        return this.highlight;
    }

    /**
     * Sync version, call conjugate() for async
     * 
     * @param verb required - base verb, no pronominal 'se', use 'hablar', not 'hablarse'  
     * Returned Result[] includes pronominals and defectives if appropriate
     * @param region optional, castellano|voseo|canarias|formal, default castellano
     */
    public conjugateSync(verb: string, region: Regions = 'castellano'): Result[] | ErrorType {
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
                        // if ortho is not 2010 or M is undefined or M is defined and not false 
                        //   then use this model, otherwise skip it.  See types.ts for more info
                        if (this.orthography !== '2010' || typeof attributes['M'] === 'undefined' || 
                            attributes['M'] !== 'false') {
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

                const info: Info = {
                    verb: pronominalKey === 'P' ? `${verb}se` : verb,
                    model: modelName,
                    region: region,
                    pronominal: (pronominalKey === 'P'),
                    defective: !!(attributes['D'])
                };

                if (typeof attributes['M'] !== 'undefined') {
                    if (attributes.M === 'true') {
                        info.ortho = '2010';
                    } else {
                        info.ortho = '1999';
                    }
                }

                if (this.highlight) {
                    info.highlight = this.highlight;
                }

                result.push({
                    info,
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
     * @param verb required - base verb, no pronominal 'se', use 'hablar', not 'hablarse'  
     * Returned Result[] includes pronominals and defectives if appropriate
     * @param region optional, castellano|voseo|canarias|formal, default castellano
     */
    public conjugate(verb: string, region: Regions = 'castellano'): Promise<Result[] | ErrorType> {
        return new Promise((resolve, reject) => {
            const result: Result[] | ErrorType = this.conjugateSync(verb, region);
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