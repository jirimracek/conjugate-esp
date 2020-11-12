/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
import definitions from '../data/definitions.json';
import { ModelFactory } from './factory';
import { Regions, PronominalKey, Orthography, AnyModeKey, ImpersonalSubKey, ImperativoSubKey, IndicativoSubKey, SubjuntivoSubKey, HighlightTags } from './types';
import { ModelAttributes, ResultTable, Model, ModelWithAttributes } from './basemodel';
import { tagDiffs } from './stringutils';

export { Regions, PronominalKey, ResultTable };
export type VerbModelData = { [key in PronominalKey]?: Model[] | Model };
export type VerbModelTemplates = { [verbname: string]: VerbModelData };

export type Info = {
    verb: string,
    model: string,
    region: string,
    pronominal: boolean,
    defective: boolean,
    ortho?: string,
    highlight?: HighlightTags
};

export type ErrorType = { ERROR: { message: string } };
export type Result = {
    info: Info,
    conjugation: ResultTable
};

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
    private orthography: Orthography = '2010';
    private tags: HighlightTags = { start: '', end: '', deleted: '' };

    /**
     * 
     * @param ortho optional, 1999|2010, default 2010 - use 2010 orthography 
     * @param highlight optional, defaults to nothing, use a single character or strings ({start: <startTag>, end: </startTag>, deleted: string})
     */
    constructor(ortho: Orthography = '2010', highlight: HighlightTags = { start: '', end: '', deleted: '' }) {
        this.setOrthography(ortho);
        this.setHighlightTags(highlight);
    }

    public setOrthography(ortho: Orthography): void {
        if (ortho === '1999' || ortho === '2010') {
            this.orthography = ortho;
        } else {
            console.warn(`Ignored: orthography parameter <${ortho}>, needs to be one of '1999' or '2010'`);
        }
    }

    public getOrthography(): Orthography {
        return this.orthography;
    }

    public setHighlightTags(highlight: HighlightTags): void {
        if (typeof highlight.start !== 'undefined' &&
            typeof highlight.end !== 'undefined' &&
            typeof highlight.deleted !== 'undefined') {
            this.tags = highlight;
        } else {
            console.warn(`Ignored highlight parameter <${highlight}>, ` +
                'needs to be of form { start: \'string\', end: \'string\', deleted: \'string\'}');
        }
    }

    public getHighlightTags(): HighlightTags {
        return this.tags;
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
                    ('' !== this.tags.start || '' !== this.tags.end || '' !== this.tags.deleted)) {

                    info.highlight = this.tags;                // note it in info - de we really need to do this???
                    // get conjugation as if the verb was conjugated per regular model (hablar, temer, partir)
                    const simulatedModel = this.factory.getModel(verb, modelName, pronominalKey, region, {}, true);
                    const simulated = simulatedModel?.getConjugation();
                    /* istanbul ignore else */
                    if (simulated && conjugated) {
                        this.insertTags(simulated, conjugated);
                    }
                }

                result.push({
                    info,
                    conjugation: conjugated
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

    /**
     * compare each line of simulated and real conjugation, markup differences in real conjugation with start/end tags
     */
    private insertTags(simulated: ResultTable, conjugated: ResultTable): void {
        // Iterate over conjugations, send the simulated and real lines to be compared and highlighted
        Object.keys(conjugated).forEach(key => {
            const modeKey = key as AnyModeKey;
            Object.keys(conjugated[modeKey]).forEach(subKey => {
                switch (modeKey) {
                    case 'Impersonal': {
                        const modeSubKey = subKey as ImpersonalSubKey;
                        conjugated[modeKey][modeSubKey] =
                            tagDiffs(simulated[modeKey][modeSubKey], conjugated[modeKey][modeSubKey], this.tags);
                    }
                        break;
                    case 'Indicativo': {
                        const modeSubKey = subKey as IndicativoSubKey;
                        conjugated[modeKey][modeSubKey] =
                            conjugated[modeKey][modeSubKey].map((conjugatedLine, index) => {
                                return tagDiffs(simulated[modeKey][modeSubKey][index], conjugatedLine, this.tags);
                            });
                    }
                        break;
                    case 'Subjuntivo': {
                        const modeSubKey = subKey as SubjuntivoSubKey;
                        conjugated[modeKey][modeSubKey] =
                            conjugated[modeKey][modeSubKey].map((conjugatedLine, index) => {
                                return tagDiffs(simulated[modeKey][modeSubKey][index], conjugatedLine, this.tags);
                            });
                    }
                        break;
                    case 'Imperativo': {
                        const modeSubKey = subKey as ImperativoSubKey;
                        conjugated[modeKey][modeSubKey] =
                            conjugated[modeKey][modeSubKey].map((conjugatedLine, index) => {
                                return tagDiffs(simulated[modeKey][modeSubKey][index], conjugatedLine, this.tags);
                            });
                    }
                        break;
                }
            });
        });
    }

}