/**
 * @copyright 
 * Copyright (c) 2020-2021 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020-2021 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
import definitions from '../data/definitions.json';
import {ModelFactory} from './factory';
import {Regions, Orthography, HighlightMarks, Info } from './types';
import {ModelAttributes, ResultTable, ModelWithAttributes, VerbModelTemplates, VerbModelData, BaseModel} from './basemodel';
import {insertTags} from './stringutils';


export type Result = {
    info: Info,
    conjugation: ResultTable
};

/**
 * Ex.: const cng = new Conjugator(ortho?, highlightMarks?)
 * 
 */
export class Conjugator {
    protected templates: VerbModelTemplates = definitions;
    protected factory: ModelFactory = new ModelFactory();
    private ortho: Orthography = '2010';
    private highlightMarks: HighlightMarks = { start: '<mark>', end: '</mark>', del: '\u2027' };
    private highlight: boolean | null = false;


    /**
     * @param ortho optional, 1999|2010, default 2010 - use 2010 orthography 
     * @param highlight optional, defaults to { start: '<mark>', end: '</mark>', del: '\u2027' }
     * 
     * See types.ts for detailed documentation on orthography and attributes
     */
    constructor(ortho: Orthography = '2010', highlightMarks?: HighlightMarks) {
        this.setOrthography(ortho);
        if (highlightMarks) {
            this.highlightMarks = highlightMarks;
        }
    }

    public setOrthography(ortho: Orthography): void {       
        /* istanbul ignore else */
        if (ortho === '1999' || ortho === '2010') {
            this.ortho = ortho;
        } else {
            console.error(`Ignoring invalid orthography (${ortho}) `);
        }
    }

    /**
     * 
     * @param use - values true | false | null 
     * - *true* highlight whole word with *start* / *end* marks, ignore *del* 
     * - *false* no highlight 
     * - *null* highlight difference details
     */
    public useHighlight(use: boolean | null = null): void {
        // Don't be a bonehead
        if (this.highlightMarks.start + this.highlightMarks.end + this.highlightMarks.del === '') {
            this.highlight = false;
            return;
        }
        this.highlight = use;
    }

    /**
     * @param verb required
     * @param region castellano|voseo|canarias|formal 
     */
    public conjugateSync(verb: string, region: Regions = 'castellano'): Result[] | string {
        const result: Result[] = [];

        try {
            if (!this.getVerbListSync().includes(verb)) {
                throw new Error(`Unknown verb ${verb}`);
            }
            if (!['castellano', 'voseo', 'canarias', 'formal'].includes(region)) {
                throw new Error(`Unknown region ${region}`);
            }

            // Things we need to know to construct the model 
            const modelTemplates: [string, Regions, ModelAttributes][] = [];
            // string | [string | ModelWithAttrs] | ModelWithAttrs
            // Match reflexive-ness with verb
            const modelData = this.templates[verb] as VerbModelData;
            // Convert to an array of model data so we can iterate over it
            const models: VerbModelData = [];
            if (typeof modelData === 'string' || !Array.isArray(modelData)) {
                models.push(modelData);
            } else {
                models.push(...modelData);
            } 
            models.forEach(model => {
                if (typeof model === 'string') {
                    modelTemplates.push([model, region, {}]);
                } else {   // it's a ModelWithAttrs
                    Object.entries(model).forEach (([name, attributes]) => {
                        const attrs = attributes as unknown as ModelWithAttributes; 
                        // if ortho is not 2010 or M is undefined or M is defined and not false 
                        //   then use this model, otherwise skip it.  See types.ts for more info
                        if (this.ortho !== '2010' || typeof attrs['M'] === 'undefined' ||
                                    attrs['M'] as string !== 'false') {
                            modelTemplates.push([name, region, attrs]);
                        }
                    });
                }
            });
            // Construct each model based on its recipe and get the verb conjugated based on given model
            modelTemplates.forEach(template => {
                const [modelName, region, attributes] = template;
                const model = this.factory.getModel(verb, modelName, region, attributes) as BaseModel;

                const info: Info = {
                    model: modelName,
                    region: region,
                };
                if (attributes['D']) {
                    info.defective = true;
                }

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
                // highlight is on
                // Note: this.highlight values:
                //   true - highlight whole words
                //   false - do not highlight
                //   null - highlight differences
                // The idea: simulate conjugation based on a regular model, then resolve the differences
                const conjugated = model.getConjugation();

                // Mental note - don't change models anymore
                if (!['hablar', 'temer', 'partir'].includes(modelName) && this.highlight !== false) {
                    // get conjugation as if the verb was conjugated per regular model (hablar, temer, partir)
                    const simulatedModel = this.factory.getModel(verb, modelName, region, {}, true) as BaseModel;
                    insertTags(simulatedModel.getConjugation(), conjugated, this.highlightMarks, this.highlight);
                }

                result.push({
                    info,
                    conjugation: conjugated
                });
            });
            return result;
        } catch (error: any) {
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
        return Object.keys(this.templates).sort(function(a,b) {return a.localeCompare(b);});
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

    /**
     * get list of any verb that has a defective version
     * @param pure - if true, return 'version: 2.3.6, Sun 03 Jan 2021 06:52:48 PM CET';
     * list[1] has verbs that only exist as defectives 
     */
    public getDefectiveVerbListSync(pure = false): string[]| string [][] {
        const listAll: string [] = [];
        const listPure: string[] = [];
        Object.entries(this.templates).forEach(([verb, modelsData]) => {
            let count = 0;
            const models: VerbModelData = [];
            // Make an array to iterate over
            if (typeof modelsData === 'string' || !Array.isArray(modelsData)) {
                models.push(modelsData);
            } else {
                models.push(...modelsData);
            } 
            // [string, {}]
            models.forEach(model => {
                if (typeof model !== 'string' ) {
                    Object.values(model).forEach(value => {
                        Object.keys(value).forEach (attrKey => {
                            if (attrKey === 'D') ++count;
                        });
                    });
                }
            });
            if (count === models.length) { 
                listPure.push(verb);
            }
            if (count > 0) {
                listAll.push(verb);
            }
        });
        if (pure) {
            return [listAll.sort((a, b) => a.localeCompare(b)),
                listPure.sort((a,b) => a.localeCompare(b))];
        } else {
            return listAll.sort((a, b) => a.localeCompare(b));
        }
    }

    public getDefectiveVerbList(exact = false): Promise<string[]|string[][]> {
        return new Promise(resolve => resolve(this.getDefectiveVerbListSync(exact)));
    }

    /**
     * return list of verbs affected by 1999/2010 orthography
     */
    public getOrthoVerbListSync(): string[] {
        const set: Set<string> = new Set<string>();
        Object.entries(this.templates).forEach(([verb, modelsData]) => {
            const models: VerbModelData = [];
            // Make an array to iterate over
            if (typeof modelsData === 'string' || !Array.isArray(modelsData)) {
                models.push(modelsData);
            } else {
                models.push(...modelsData);
            } 
            // [string, {}]
            models.forEach(model => {
                if (typeof model !== 'string' ) {
                    Object.values(model).forEach(value => {
                        Object.keys(value).forEach (attrKey => {
                            if (attrKey === 'M') {
                                set.add(verb); 
                            }
                        });
                    });
                }
            });
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }

    public getOrthoVerbList(): Promise<string[]> {
        return new Promise(resolve => resolve(this.getOrthoVerbListSync()));
    }

    public getVersion(): string {
        return 'v2.4.0, Sat Sep 14 08:33:16 PM MDT 2024';
    }
}