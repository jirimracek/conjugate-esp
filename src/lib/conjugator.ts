/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
import definitions from '../data/definitions.json';
import {ModelFactory} from './factory';
import {Regions, PronominalKey, Orthography, Tags, Info } from './types';
import {ModelAttributes, ResultTable, ModelWithAttributes, VerbModelTemplates, VerbModelData, BaseModel} from './basemodel';
import {insertTags} from './stringutils';


export type Result = {
    info: Info,
    conjugation: ResultTable
};

/**
 * Ex.: const cng = new Conjugator(ortho?, tags?)
 * 
 */
export class Conjugator {
    protected templates: VerbModelTemplates = definitions;
    protected factory: ModelFactory = new ModelFactory();
    private ortho: Orthography = '2010';
    private tags: Tags = {start: '', end: '', del: ''};


    /**
     * @param ortho optional, 1999|2010, default 2010 - use 2010 orthography 
     * @param highlight optional, defaults to empty strings, ({start: <startTag>, end: </startTag>, deleted: string})
     * 
     * See types.ts for detailed documentation on orthography and attributes
     */
    constructor(ortho: Orthography = '2010', highlight = {start: '', end: '', del: ''}) {
        this.setOrthography(ortho);
        this.setHighlightTags(highlight);
    }

    public setOrthography(ortho: Orthography): void {
        if (ortho === '1999' || ortho === '2010') {
            this.ortho = ortho;
        } else {
            console.warn(`Ignored parameter ortho: <${ortho}>, use '1999'|'2010'`);
        }
    }

    public getOrthography(): Orthography {
        return this.ortho;
    }

    public setHighlightTags(tags: {start: string, end: string, del: string}): void {
        if (typeof tags.start !== 'undefined' &&
            typeof tags.end !== 'undefined' &&
            typeof tags.del !== 'undefined') {
            this.tags = tags;
        } else {
            console.warn(`Ignored parameter tags: <${tags}>, use { start: 'string', end: 'string', del: 'string'}`);
        }
    }

    public getHighlightTags(): Tags {
        return this.tags;
    }

    /**
     * @param verb required
     * @param region castellano|voseo|canarias|formal 
     */
    public conjugateSync(verb: string, region: Regions = 'castellano'): Result[] | string {
        const result: Result[] = [];
        const reflexive = verb.endsWith('se') ? true : false;
        const base = reflexive ? verb.replace(/..$/, '') : verb;

        try {
            if (!this.getVerbListSync().includes(verb)) {
                throw new Error(`Unknown verb ${verb}`);
            }
            if (!['castellano', 'voseo', 'canarias', 'formal'].includes(region)) {
                throw new Error(`Unknown region ${region}`);
            }

            const verbModelData = this.templates[base] as VerbModelData;

            // Things we need to know to construct the model 
            const modelTemplates: [string, Regions, ModelAttributes][] = [];
            (Object.keys(verbModelData) as PronominalKey[]).forEach(pronominalKey => {
                // string | [string | ModelWithAttrs] | ModelWithAttrs
                // Match reflexive-ness with verb
                if (reflexive && pronominalKey === 'P' || !reflexive && pronominalKey === 'N') {
                    const models = [verbModelData[pronominalKey]].flat();
                    models.forEach(model => {
                        if (typeof model === 'string') {
                            modelTemplates.push([model, region, {}]);
                        } else {
                            // it's a ModelWithAttrs
                            const [name, attributes] =
                                (Object.entries(model as ModelWithAttributes)).flat() as [string, ModelAttributes];
                            // if ortho is not 2010 or M is undefined or M is defined and not false 
                            //   then use this model, otherwise skip it.  See types.ts for more info
                            if (this.ortho !== '2010' || typeof attributes['M'] === 'undefined' ||
                                attributes['M'] !== 'false') {
                                modelTemplates.push([name as string, region, attributes]);
                                // } else {
                                //     console.log(`Skip ${verb}, ${name}, M=${attributes['M']}`);
                            }
                        }
                    });
                }
            });

            // Construct each model based on its recipe and get the verb conjugated based on given model
            modelTemplates.forEach(template => {
                const [modelName, region, attributes] = template;
                const model = this.factory.getModel(verb, modelName, region, attributes) as BaseModel;

                const info: Info = {
                    verb: verb,
                    model: modelName,
                    region: region,
                    pronouns: model.getPronouns(),
                    reflexive: reflexive,
                    defective: !!(attributes['D'])
                };

                if (typeof attributes['M'] !== 'undefined') {
                    if (attributes.M === 'true') {
                        // this indicates the ortho of the resulting column
                        // if this.ortho === 1999, we get both columns, 2010 as well as 1999.
                        // No, you can't just assign info.ortho = this.ortho
                        info.ortho = '2010';
                    } else {
                        info.ortho = '1999';
                    }
                }

                // highlight only if irregular verb and
                // at least one of the tags is defined
                // The idea: simulate conjugation based on a regular model, then resolve the differences
                const conjugated = model.getConjugation();
                if (!['hablar', 'temer', 'partir'].includes(modelName) && // Mental note - don't change models anymore
                    ('' !== this.tags.start || '' !== this.tags.end || '' !== this.tags.del)) {

                    info.highlight = this.tags;                // note it in info - de we really need to do this???
                    // get conjugation as if the verb was conjugated per regular model (hablar, temer, partir)
                    const simulatedModel = this.factory.getModel(verb, modelName, region, {}, true) as BaseModel;
                    insertTags(simulatedModel.getConjugation(), conjugated, this.tags);
                }

                result.push({
                    info,
                    conjugation: conjugated
                });
            });
            return result;
        } catch (error) {
            // console.error(error);
            return error.message;
        }
    }

    /**
     * @param verb required
     * @param region castellano|voseo|canarias|formal 
     */
    public conjugate(verb: string, region: Regions = 'castellano'): Promise<Result[] | string> {
        return new Promise((resolve, reject) => {
            const result = this.conjugateSync(verb, region);
            if (Array.isArray(result)) {
                resolve(result);
            } else {
                reject(result);
            }
        });
    }

    /**
     * get sorted list of all verbs, sync
     */
    public getVerbListSync(): string[] {
        const list: string[] = [];
        Object.keys(this.templates).forEach(verb => {
            if (this.templates[verb].P) {
                list.push(`${verb}se`);
            }
            if (this.templates[verb].N) {
                list.push(verb);
            }
        });
        return list.sort(function (a, b) {return a.localeCompare(b);});
    }

    /**
     * get sorted list of all verbs, async
     * 
     */
    public getVerbList(): Promise<string[]> {
        return new Promise(resolve => resolve(this.getVerbListSync()));
    }

    /**
     * get list of all models, sync
     * 
     */
    public getModelsSync(): string[] {
        return this.factory.getModels();
    }

    /**
     * get list of all models, async
     * 
     */
    public getModels(): Promise<string[]> {
        return new Promise(resolve => resolve(this.factory.getModels())); 
    }
}