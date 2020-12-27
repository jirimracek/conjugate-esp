/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
import {
    Regions, IndicativoSubSimpleKey, SubjuntivoSubSimpleKey,
    ImperativoSubKey, ImpersonalSubKey, IndicativoSubCompKey, IndicativoSubKey,
    SubjuntivoSubCompKey, SubjuntivoSubKey
} from './types';
import {clearAccents, esdrujula, strongify} from './stringutils';

// Attributes
// attribute has form of attrname : string | boolean
// attributes are attached to the model by colon = and separated by semicolon ';'
// known attributes:
//    defective types: { D:imorfo | eimorfo | imper | tercio | terciop | mmorfo | bimorfop | bimorfog | trimorfo | omorfo | ogmorfo }
//    PR:RegExp/replacement - Participio Replace                - RegExp is the regular expression that Replaces the regular form (inhestar, pensar:PR=estad/iest - from inhestado to inhiesto)
//    // Obsoleted in 2.0.1
//    PD:RegExp/replacement - Participio Dual                   - RegExp is the regular expression that creates the irregular participio form from the regular one
//                                                                       AND it gets added as a second participio. The first, REGULAR PARTICIPIO gets used for COMPUESTOS
//    //
//    PC:RegExp/replacement - Participio Compuesto (irregular)  - same as PD, EXCEPT the second, IRREGULAR PARTICIPIO gets used for COMPUESTOS
//    D:DefectiveType       - one of the Defective Types
//    M:boolean             - Monosyllable ortho adjustment, drop accent
//    V:string              - use for other model changes, duals, triples, ex.: predecir, predeciré & prediré

// Types used to represent data in the verb definitions json file
type DefectiveType = 'imorfo' | 'eimorfo' | 'imper' | 'tercio' | 'terciop'
    | 'mmorfo' | 'bimorfop' | 'bimorfog' | 'trimorfo' | 'omorfo' | 'ogmorfo' | 'osmorfo';
type AttributeValues = DefectiveType | boolean | string;
type AttributeKeys = 'PR' | 'PS' | 'D' | 'M' | 'V';
type CompSubTable = {[modekey: string]: {[timekey: string]: string[]}};
type IndicativoSubjuntivoModeKey = 'Indicativo' | 'Subjuntivo';

export type DesinenceTable = {
    Impersonal: {
        [subkey in ImpersonalSubKey]: string
    },
    Indicativo: {
        [subkey in IndicativoSubSimpleKey]: string[]
    },
    Subjuntivo: {
        [subkey in SubjuntivoSubSimpleKey]: string[]
    }
};

export type ResultTable = {
    Impersonal: {
        [subkey in ImpersonalSubKey]: string
    },
    Indicativo: {
        [subkey in IndicativoSubKey]: string[]
    },
    Subjuntivo: {
        [subkey in SubjuntivoSubKey]: string[]
    },
    Imperativo: {
        [subkey in ImperativoSubKey]: string[]
    }
};

export type ModelAttributes = {[attributekey in AttributeKeys]?: AttributeValues};
export type ModelWithAttributes = {[modelname: string]: ModelAttributes};
export type Model = string | ModelWithAttributes;
export type VerbModelData = Model[] | Model;
export type VerbModelTemplates = {[verbname: string]: VerbModelData};

const NO_IMPERATIVO_AFIRMATIVO: DefectiveType[] = [
    'imper',
    'tercio',
    'terciop',
    'bimorfop',
    'omorfo',
    'osmorfo',
    'ogmorfo'
];

export const INDICATIVO_SIMPLE_KEYS: IndicativoSubSimpleKey[] = [
    'Presente',
    'PreteritoImperfecto',
    'PreteritoIndefinido',
    'FuturoImperfecto',
    'CondicionalSimple'
];

export const SUBJUNTIVO_SIMPLE_KEYS: SubjuntivoSubSimpleKey[] = [
    'Presente',
    'PreteritoImperfectoRa',
    'PreteritoImperfectoSe',
    'FuturoImperfecto'
];

export const INDICATIVO_COMP_KEYS: IndicativoSubCompKey[] = [
    'PreteritoPerfecto',
    'PreteritoPluscuamperfecto',
    'PreteritoAnterior',
    'FuturoPerfecto',
    'CondicionalCompuesto'
];

export const SUBJUNTIVO_COMP_KEYS: SubjuntivoSubCompKey[] = [
    'PreteritoPerfecto',
    'PreteritoPluscuamperfectoRa',
    'PreteritoPluscuamperfectoSe',
    'FuturoPerfecto'
];

const NO_IMPERATIVO_NEGATIVO: DefectiveType[] = ['imper', 'tercio', 'terciop', 'bimorfop', 'ogmorfo'];
const DASH6 = '------';

export abstract class BaseModel {
    protected verb: string;
    protected stem = '';
    protected reflexive: boolean;
    protected region: Regions;

    protected desinences: DesinenceTable;
    protected table: ResultTable;
    protected participioCompuesto = '';

    protected version: string;
    protected attributes: ModelAttributes;

    private reflexPronouns: Array<string>;
    private auxHaber: CompSubTable;
    private defectiveAttributes: DefectiveType;

    protected constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        this.verb = verb;
        this.reflexive = verb.endsWith('se');
        this.stem = verb.replace(this.reflexive ? /....$/ : /..$/, '');

        this.region = region;
        this.attributes = attributes;                                     //  exists but empty if there aren't any
        this.defectiveAttributes = attributes['D'] as DefectiveType;      //  undefined if there aren't any 
        this.version = (attributes.V ? attributes.V : '0') as string;

        // The composite verb auxiliar haber forms
        // NOTE on plural voseo: https://www.crisoltranslations.com/our-blog/voseo-latin-american-spanish/
        this.auxHaber = this.initAuxiliaryHaber(region);

        this.reflexPronouns = ((): Array<string> => [
            'me',
            region !== 'formal' ? 'te' : 'se',
            'se',
            'nos',
            region !== 'castellano' ? 'se' : 'os',
            'se'
        ])();

        // initialize empty result conjugation table, imperativo needs to be initialized to ------
        this.table = {
            Impersonal: {
                Infinitivo: '', Gerundio: '', Participio: ''
            },
            Indicativo: {
                Presente: [],
                PreteritoImperfecto: [],
                PreteritoIndefinido: [],
                FuturoImperfecto: [],
                CondicionalSimple: [],
                PreteritoPerfecto: [],
                PreteritoPluscuamperfecto: [],
                PreteritoAnterior: [],
                FuturoPerfecto: [],
                CondicionalCompuesto: []
            },
            Subjuntivo: {
                Presente: [],
                PreteritoImperfectoRa: [],
                PreteritoImperfectoSe: [],
                FuturoImperfecto: [],
                PreteritoPerfecto: [],
                PreteritoPluscuamperfectoRa: [],
                PreteritoPluscuamperfectoSe: [],
                FuturoPerfecto: []
            },
            Imperativo: {
                Afirmativo: Array.from(DASH6),
                Negativo: Array.from(DASH6)
            }
        };

        this.desinences = {
            Impersonal: {
                Infinitivo: '', Gerundio: '', Participio: ''
            },
            Indicativo: {
                Presente: [],
                PreteritoImperfecto: [],
                PreteritoIndefinido: [],
                FuturoImperfecto: [],
                CondicionalSimple: []
            },
            Subjuntivo: {
                Presente: [],
                PreteritoImperfectoRa: [],
                PreteritoImperfectoSe: [],
                FuturoImperfecto: []
            }
        };
    }
    // NOTE on plural voseo: https://www.crisoltranslations.com/our-blog/voseo-latin-american-spanish/
    private initAuxiliaryHaber(region: Regions): CompSubTable {
        return {
            Indicativo: {
                PreteritoPerfecto: ['he',
                    region !== 'formal' ? 'has' : 'ha',
                    'ha',
                    'hemos',
                    region !== 'castellano' ? 'han' : 'habéis',
                    'han'],
                PreteritoPluscuamperfecto: ['había',
                    region !== 'formal' ? 'habías' : 'había',
                    'había',
                    'habíamos',
                    region !== 'castellano' ? 'habían' : 'habíais',
                    'habían'],
                PreteritoAnterior: ['hube',
                    region !== 'formal' ? 'hubiste' : 'hubo',
                    'hubo',
                    'hubimos',
                    region !== 'castellano' ? 'hubieron' : 'hubisteis',
                    'hubieron'],
                FuturoPerfecto: ['habré',
                    region !== 'formal' ? 'habrás' : 'habrá',
                    'habrá',
                    'habremos',
                    region !== 'castellano' ? 'habrán' : 'habréis',
                    'habrán'],
                CondicionalCompuesto: ['habría',
                    region !== 'formal' ? 'habrías' : 'habría',
                    'habría',
                    'habríamos',
                    region !== 'castellano' ? 'habrían' : 'habríais',
                    'habrían']
            },
            Subjuntivo: {
                PreteritoPerfecto: ['haya',
                    region !== 'formal' ? 'hayas' : 'haya',
                    'haya',
                    'hayamos',
                    region !== 'castellano' ? 'hayan' : 'hayáis',
                    'hayan'],
                PreteritoPluscuamperfectoRa: ['hubiera',
                    region !== 'formal' ? 'hubieras' : 'hubiera',
                    'hubiera',
                    'hubiéramos',
                    region !== 'castellano' ? 'hubieran' : 'hubierais',
                    'hubieran'],
                PreteritoPluscuamperfectoSe: ['hubiese',
                    region !== 'formal' ? 'hubieses' : 'hubiese',
                    'hubiese',
                    'hubiésemos',
                    region !== 'castellano' ? 'hubiesen' : 'hubieseis',
                    'hubiesen'],
                FuturoPerfecto: ['hubiere',
                    region !== 'formal' ? 'hubieres' : 'hubiere',
                    'hubiere',
                    'hubiéremos',
                    region !== 'castellano' ? 'hubieren' : 'hubiereis',
                    'hubieren']
            }
        };
    }


    public getConjugation(): ResultTable {

        this.setInfinitivo();
        this.setGerundio();
        this.setParticipio();

        // Overriden
        this.setIndicativoPresente();
        this.setIndicativoPreteritoImperfecto();
        this.setIndicativoPreteritoIndefinido();
        this.setIndicativoFuturoImperfecto();
        this.setIndicativoCondicionalSimple();

        this.setSubjuntivoPresente();
        this.setSubjuntivoPreteritoImperfectoRa();
        this.setSubjuntivoPreteritoImperfectoSe();
        this.setSubjuntivoFuturoImperfecto();

        // Compuestos never get overriden in derived classes
        this.setCompuestos();

        this.setImperativoAfirmativo();
        this.setImperativoNegativo();

        this.applyDefectiveAttributes();

        return this.table;
    }

    private setInfinitivo(): void {
        this.table.Impersonal.Infinitivo =
            `${this.stem}${this.desinences.Impersonal.Infinitivo}`;
    }

    protected setGerundio(root?: string): void {
        this.table.Impersonal.Gerundio =
            `${root ? root : this.stem}${this.desinences.Impersonal.Gerundio}`;
    }

    protected setParticipio(): void {
        this.participioCompuesto = `${this.stem}${this.desinences.Impersonal.Participio}`;
        this.table.Impersonal.Participio = this.participioCompuesto;
    }

    /////////////////////////////////////////////////////////////////
    /**
     * 
     * Iterate over desinences table, form a table of conjugations.
     * Called from the base class if the verb stem doesn't change or
     * from derived, which may change stems per each person.  
     * @param mode 
     * @param key 
     * @param roots optional array of desired stems, set it in derived class
     */
    // protected setTable(mode: ModeParam, key: ModeTimeParam , roots?: string[]): void {
    protected setTable(mode: IndicativoSubjuntivoModeKey, key: IndicativoSubSimpleKey | SubjuntivoSubSimpleKey, roots?: string[]): void {
        if (mode === 'Indicativo') {
            this.table[mode][key as IndicativoSubSimpleKey] = this.desinences[mode][key as IndicativoSubSimpleKey]
                .map((desinence: string, index: number) =>
                    `${this.reflexive ? this.reflexPronouns[index] : ''} ${roots ?
                        roots[index] : this.stem}${desinence}`.trim());
        }
        if (mode === 'Subjuntivo') {
            this.table[mode][key as SubjuntivoSubSimpleKey] = this.desinences[mode][key as SubjuntivoSubSimpleKey]
                .map((desinence: string, index: number) =>
                    `${this.reflexive ? this.reflexPronouns[index] : ''} ${roots ?
                        roots[index] : this.stem}${desinence}`.trim());
        }
    }

    // // Indicativo simple
    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente');
    }

    protected setIndicativoPreteritoImperfecto(): void {
        this.setTable('Indicativo', 'PreteritoImperfecto');
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setTable('Indicativo', 'PreteritoIndefinido');
    }

    protected setIndicativoFuturoImperfecto(): void {
        this.setTable('Indicativo', 'FuturoImperfecto');
    }

    protected setIndicativoCondicionalSimple(): void {
        this.setTable('Indicativo', 'CondicionalSimple');
    }

    /////////////////////////////////////////////////////////////////
    // Subjuntivo simple set methods
    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente');
    }

    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa');
    }

    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe');
    }

    protected setSubjuntivoFuturoImperfecto(): void {
        this.setTable('Subjuntivo', 'FuturoImperfecto');
    }

    /////////////////////////////////////////////////////////////////
    // compuestos
    private setCompuestos(): void {
        INDICATIVO_COMP_KEYS.forEach(time =>
            this.table.Indicativo[time] =
            this.auxHaber.Indicativo[time].map((aux, index) =>
                `${this.reflexive ? this.reflexPronouns[index] : ''} ${aux} ${this.participioCompuesto}`.trim()));

        SUBJUNTIVO_COMP_KEYS.forEach(time =>
            this.table.Subjuntivo[time] =
            this.auxHaber.Subjuntivo[time].map((aux, index) =>
                `${this.reflexive ? this.reflexPronouns[index] : ''} ${aux} ${this.participioCompuesto}`.trim()));
    }

    // Imperatives
    protected setImperativoAfirmativo(): void {
        if (NO_IMPERATIVO_AFIRMATIVO.includes(this.defectiveAttributes)) {
            return;
        }
        // 2nd person singular
        if (!this.reflexive) {
            if (this.region !== 'formal') {
                this.table.Imperativo.Afirmativo[1] = this.table.Indicativo.Presente[1].replace(/s$/, '');
            } else {
                this.table.Imperativo.Afirmativo[1] = this.table.Subjuntivo.Presente[1];
            }
        } else {         // Pronominal
            switch (this.region) {
                case 'formal':
                    this.table.Imperativo.Afirmativo[1] =
                        esdrujula(this.table.Subjuntivo.Presente[1].replace(/^(.*) (.*)$/, '$2$1'));
                    break;
                case 'voseo':
                    // https://enclave.rae.es/consultas-linguisticas/buscar?search=voseo
                    this.table.Imperativo.Afirmativo[1] =
                        clearAccents(this.table.Indicativo.Presente[1].replace(/^(.*) (.*)s$/, '$2$1'));
                    break;
                default:         // castellano & canarias
                    this.table.Imperativo.Afirmativo[1] =
                        //                                                  te hablas -> háblate
                        esdrujula(this.table.Indicativo.Presente[1].replace(/^(.*) (.*)s$/, '$2$1'));
                    break;
            }
        }

        // nosotros
        if (!this.reflexive) {
            this.table.Imperativo.Afirmativo[3] = this.table.Subjuntivo.Presente[3];
        } else {
            this.table.Imperativo.Afirmativo[3] =
                esdrujula(this.table.Subjuntivo.Presente[3].replace(/^(.*) (.*)s$/, '$2$1'));
        }

        // 2nd person plural
        if (this.region === 'castellano') {
            if (!this.reflexive) {
                this.table.Imperativo.Afirmativo[4] =
                    `${this.verb.replace(/r$/, 'd')}`;
            } else {
                // Tricky. Sounds simple, take infinitive, replace the 'rse' with 'os'.  Accents matter
                // Last syllable before 'os' needs to be strong.  Clear accents before strong-ifying 
                this.table.Imperativo.Afirmativo[4] =
                    `${strongify(clearAccents(this.verb.replace(/rse$/, '')), 1)}os`;
            }
        } else {
            if (!this.reflexive) {
                this.table.Imperativo.Afirmativo[4] = this.table.Subjuntivo.Presente[4];
            } else {
                this.table.Imperativo.Afirmativo[4] =
                    esdrujula(this.table.Subjuntivo.Presente[4].replace(/^(.*) (.*)$/, '$2$1'));
            }
        }
    }

    /**
     * Special case Imperativo Affirmativo 2nd person castellano & canarias, deals with monosyllabics
     * 
     * Usage (venir): setImperativoAfirmativoMono(/(.*)vi[eé]ne/, 'ven', 'vén');
     * 
     * Expects the imperativo to be built so it must be preceeded by a call to super.setImperativoAfirmativo();
     * 
     * Used by decir, poner, venir, ... the monos, means look for viene/viéne, pronominal substitute 'ven', nonpronominal 'vén'
     * 
     * @param regex regex to look for (/(.*)vi[eé]ne/)
     * @param subP pronominal version substitution (ven)
     * @param subNP nonpronominal substitution (vén);
     */
    protected setImperativoAfirmativoMono(regex: RegExp, subP: string, subNP: string): void {
        if (this.region === 'castellano' || this.region === 'canarias') {
            this.table.Imperativo.Afirmativo[1] =
                this.table.Imperativo.Afirmativo[1].replace(regex, (match: string, p1: string): string => {
                    // if p1 is empty (is 'pone', isn't 'repone'), it's the mono we're looking for
                    if (/^$/.test(p1) || this.reflexive) return `${p1}${subP}`;
                    return `${p1}${subNP}`;   //  else p1 wasn't blank (ex.: 'repon': p1 === 're')
                });
        }
    }

    protected setImperativoNegativo(): void {
        if (NO_IMPERATIVO_NEGATIVO.includes(this.defectiveAttributes)) {
            return;
        }
        // All regions are formed the same, directly from corresponding subjuntives, 
        //    insert 'no' after the first pronominal
        [1, 3, 4].forEach(index => this.table.Imperativo.Negativo[index] =
            `no ${this.table.Subjuntivo.Presente[index]}`);
        // this.table.Subjuntivo.Presente[index].replace(/^(.+?) (.*)$/, '$1 no $2'));
    }
    /**
     * When all is done, wead out the defectives.  Not pretty but works
     */
    private applyDefectiveAttributes(): void {
        switch (this.defectiveAttributes) {
            case 'imorfo':
                // use only forms whose desinence starts with i or í, zap the rest
                // Tricky, need to look at the original desinence this was built with
                if (/^[^ií]/.test(this.desinences.Impersonal.Gerundio)) {
                    this.table.Impersonal.Gerundio = '-';
                }

                Object.keys(this.desinences.Indicativo).forEach(time => {
                    this.desinences.Indicativo[time as IndicativoSubSimpleKey].forEach((d, i) => {
                        if (/^[^ií]/.test(d)) {
                            this.table.Indicativo[time as IndicativoSubSimpleKey][i] = '-';
                        }
                    });
                });
                Object.keys(this.desinences.Subjuntivo).forEach(time => {
                    this.desinences.Subjuntivo[time as SubjuntivoSubSimpleKey].forEach((d, i) => {
                        if (/^[^ií]/.test(d)) {
                            this.table.Subjuntivo[time as SubjuntivoSubSimpleKey][i] = '-';
                        }
                    });
                });

                // Imperativos zapping time: look at the last word, the next character just past the stem.length.  
                // If it's [ií], let it through, zap otherwise
                [1, 3, 4].forEach(index => {
                    const last = this.table.Imperativo.Afirmativo[index].split(' ').pop();
                    if (last && /^[^ií]/.test(last[this.stem.length])) {
                        this.table.Imperativo.Afirmativo[index] = '-';
                    }
                    // It's always true for negatives
                    //   last = this.table.Imperativo.Negativo[index].split(' ').pop();
                    // This should always be true, we should never run into anything else
                    //   if (last && /^[^ií]/.test(last[this.stem.length])) {
                    this.table.Imperativo.Negativo[index] = '-';
                    //   } else {     // we should never run into this condition, so test for it
                    //   this.table.Imperativo.Negativo[index] = 'X';   
                    //   }
                });
                break;
            case 'eimorfo':     // only ones whose desinence starts with  e or i, zap everything else
                Object.keys(this.desinences.Indicativo).forEach(time => {
                    this.desinences.Indicativo[time as IndicativoSubSimpleKey].forEach((d, i) => {
                        if (/^[^iíeé]/.test(d)) {
                            this.table.Indicativo[time as IndicativoSubSimpleKey][i] = '-';
                        }
                    });
                });
                Object.keys(this.desinences.Subjuntivo).forEach(time => {
                    this.desinences.Subjuntivo[time as SubjuntivoSubSimpleKey].forEach((d, i) => {
                        if (/^[^iíeé]/.test(d)) {
                            this.table.Subjuntivo[time as SubjuntivoSubSimpleKey][i] = '-';
                        }
                    });
                });

                [1, 3, 4].forEach(index => {
                    const last = this.table.Imperativo.Afirmativo[index].split(' ').pop();
                    if (last && /^[^iíeé]/.test(last[this.stem.length])) {
                        this.table.Imperativo.Afirmativo[index] = '-';
                    }
                    // Same as above, always true for negatives
                    //   last = this.table.Imperativo.Negativo[index].split(' ').pop();
                    //   if (last && /^[^iíeé]/.test(last[this.stem.length])) {
                    this.table.Imperativo.Negativo[index] = '-';
                    //   } else {     // we should never run into this condition, so test for it
                    //       this.table.Imperativo.Negativo[index] = 'X';   
                    //   }
                });
                // for some reason beyond my understanding, the following are also excluded ????
                this.table.Indicativo.PreteritoPerfecto[0] = '-';
                this.table.Subjuntivo.PreteritoPerfecto = Array.from(DASH6);
                break;
            // Normally we use the pronouns.  A few defective forms dictate that the pronouns
            // are not to be used. imper, tercio and terciop
            // only in infinitivo, gerundio, participio y en las terceras personas del singular
            case 'imper':
                Object.keys(this.table.Indicativo).forEach(time => {
                    [0, 1, 3, 4, 5].forEach(index =>
                        this.table.Indicativo[time as IndicativoSubKey][index] = '-');
                    this.table.Indicativo[time as IndicativoSubKey][2] =
                        this.table.Indicativo[time as IndicativoSubKey][2].replace(/^se /, '');
                });

                Object.keys(this.table.Subjuntivo).forEach(time => {
                    [0, 1, 3, 4, 5].forEach(index =>
                        this.table.Subjuntivo[time as SubjuntivoSubKey][index] = '-');
                    this.table.Subjuntivo[time as SubjuntivoSubKey][2] =
                        this.table.Subjuntivo[time as SubjuntivoSubKey][2].replace(/^se /, '');
                });
                break;
            case 'tercio':
                // terciopersonal - infinitivo y en terceras personas, simple only??? no compuestos D= tercio
                // Verbo empecer
                (['Gerundio', 'Participio'] as ImpersonalSubKey[]).forEach(v => this.table.Impersonal[v] = '-');
                // Simple indicative
                INDICATIVO_SIMPLE_KEYS.forEach(time => [0, 1, 3, 4].forEach(i => this.table.Indicativo[time][i] = '-'));

                // Simple subjuntive
                SUBJUNTIVO_SIMPLE_KEYS.forEach(time => [0, 1, 3, 4].forEach(i => this.table.Subjuntivo[time][i] = '-'));

                // Indicative compuesto
                INDICATIVO_COMP_KEYS.forEach(time => this.table.Indicativo[time] = Array.from(DASH6));    // all 6x
                SUBJUNTIVO_COMP_KEYS.forEach(time => this.table.Subjuntivo[time] = Array.from(DASH6));

                break;

            case 'terciop':
                // terciopersonal, v2 - infinitivo, gerundio, participio y en terceras personas
                // Verbo: acaecer, acontecer
                Object.keys(this.table.Indicativo).forEach(time => {
                    [0, 1, 3, 4].forEach(index =>
                        this.table.Indicativo[time as IndicativoSubKey][index] = '-');
                    [2, 5].forEach(index =>
                        this.table.Indicativo[time as IndicativoSubKey][index] =
                        this.table.Indicativo[time as IndicativoSubKey][index].replace(/^se /, ''));
                });

                Object.keys(this.table.Subjuntivo).forEach(time => {
                    [0, 1, 3, 4].forEach(index =>
                        this.table.Subjuntivo[time as SubjuntivoSubKey][index] = '-');
                    [2, 5].forEach(index =>
                        this.table.Subjuntivo[time as SubjuntivoSubKey][index] =
                        this.table.Subjuntivo[time as SubjuntivoSubKey][index].replace(/^se /, ''));
                });
                break;

                // case 'mmorfo':
                // break;

            case 'bimorfop':
                //  bimorfo(p) - sólo en infinitivo y en participio - zap everything else indiscriminantly
                this.table.Impersonal.Gerundio = '-';
                Object.keys(this.table.Indicativo).forEach(time =>
                    this.table.Indicativo[time as IndicativoSubKey] = Array.from(DASH6));

                Object.keys(this.table.Subjuntivo).forEach(time =>
                    this.table.Subjuntivo[time as SubjuntivoSubKey] = Array.from(DASH6));

                Object.keys(this.table.Imperativo).forEach(time =>
                    this.table.Imperativo[time as ImperativoSubKey] = Array.from(DASH6));
                break;

            case 'bimorfog':
                //  bimorfo(g) - sólo en infinitivo y en gerundio - zap everything else indiscriminantly
                this.table.Impersonal.Participio = '-';
                Object.keys(this.table.Indicativo).forEach(time =>
                    this.table.Indicativo[time as IndicativoSubKey] = Array.from(DASH6));

                Object.keys(this.table.Subjuntivo).forEach(time =>
                    this.table.Subjuntivo[time as SubjuntivoSubKey] = Array.from(DASH6));

                Object.keys(this.table.Imperativo).forEach(time =>
                    this.table.Imperativo[time as ImperativoSubKey] = Array.from(DASH6));
                break;

            case 'trimorfo':
                // trimorfo infinitivo y en las segundas personas del imperativo
                // Verbo abar
                ['Gerundio', 'Participio'].forEach(v =>
                    this.table.Impersonal[v as ImpersonalSubKey] = '-');

                Object.keys(this.table.Indicativo).forEach(time =>
                    this.table.Indicativo[time as IndicativoSubKey] = Array.from(DASH6));

                Object.keys(this.table.Subjuntivo).forEach(time =>
                    this.table.Subjuntivo[time as SubjuntivoSubKey] = Array.from(DASH6));

                Object.keys(this.table.Imperativo).forEach(mode =>
                    [2, 3].forEach(index => this.table.Imperativo[mode as ImperativoSubKey][index] = '-'));
                break;

            case 'omorfo':
                ['PreteritoIndefinido',
                    'FuturoImperfecto',
                    'CondicionalSimple',
                    'PreteritoAnterior',
                    'FuturoPerfecto',
                    'CondicionalCompuesto'].forEach(mode =>
                    this.table.Indicativo[mode as IndicativoSubKey] = Array.from(DASH6));

                ['FuturoImperfecto', 'FuturoPerfecto'].forEach(time =>
                    this.table.Subjuntivo[time as SubjuntivoSubKey] = Array.from(DASH6));

                this.table.Imperativo.Negativo[3] = '-';
                break;
            case 'ogmorfo':
                ['Infinitivo', 'Gerundio', 'Participio'].forEach(v =>
                    this.table.Impersonal[v as ImpersonalSubKey] = '-');

                ['Presente',
                    'PreteritoImperfecto',
                    'FuturoImperfecto',
                    'CondicionalSimple',
                    ...INDICATIVO_COMP_KEYS].forEach(mode =>
                    this.table.Indicativo[mode as IndicativoSubKey] = Array.from(DASH6));

                ['Presente',
                    'FuturoImperfecto',
                    ...SUBJUNTIVO_COMP_KEYS].forEach(mode =>
                    this.table.Subjuntivo[mode as SubjuntivoSubKey] = Array.from(DASH6));

                break;
            case 'osmorfo':
                this.table.Impersonal.Participio = '-';

                ['PreteritoIndefinido',
                    'FuturoImperfecto',
                    'CondicionalSimple',
                    ...INDICATIVO_COMP_KEYS].forEach(mode =>
                    this.table.Indicativo[mode as IndicativoSubKey] = Array.from(DASH6));

                ['FuturoImperfecto', ...SUBJUNTIVO_COMP_KEYS].forEach(mode =>
                    this.table.Subjuntivo[mode as SubjuntivoSubKey] = Array.from(DASH6));

                this.table.Imperativo.Negativo[3] = '-';
                break;
        }
    }

    // Patterns - named after the pertinent castellan person '125' (tú, él, ellos), etc.
    /**
     * Indicativo presente common pattern
     * 
     *           person: 0 1 2 3 4 5
     *       castellano: . * *     *
     *            voseo: .   *   * *
     *         canarias: . * *   * *
     *           formal: . * *   * *
     * 
     * @param dot marked as . 
     * @param star marked as *
     */
    protected setIndicativoPresentePattern125(dot: string, star: string): void {
        switch (this.region) {
            case 'castellano':
                this.setTable('Indicativo', 'Presente', [dot, star, star, this.stem, this.stem, star]);
                break;
            case 'voseo':
                this.setTable('Indicativo', 'Presente', [dot, this.stem, star, this.stem, star, star]);
                break;
            case 'canarias':
            case 'formal':
                this.setTable('Indicativo', 'Presente', [dot, star, star, this.stem, star, star]);
                break;
        }
    }
    /**
     * Subjuntivo presente common pattern
     * 
     *            person: 0 1 2 3 4 5
     *        castellano: . . . * * .
     *            others: . . . * . .
     * 
     * @param dot marked as .
     * @param star marked as * optional, defaults to original this.stem
     */
    protected setSubjuntivoPresentePattern0125(dot: string, star = this.stem): void {
        switch (this.region) {
            case 'castellano':
                this.setTable('Subjuntivo', 'Presente', [dot, dot, dot, star, star, dot]);
                break;
            case 'voseo':
            case 'canarias':
            case 'formal':
                this.setTable('Subjuntivo', 'Presente', [dot, dot, dot, star, dot, dot]);
                break;
        }
    }
    // Preterito Indefinido repeating pattern
    /**
     * Preterito Indefinido pattern 0
     * 
     *             person: 0 1 2 3 4 5
     *         castellano: . 
     *             others: .
     * 
     * @param dot marked as .  (others use this.stem)
     */
    protected setIndicativoPreteritoIndefinidoPattern0(dot: string): void {
        this.setTable('Indicativo', 'PreteritoIndefinido', [dot, ...Array.from('12345').map(() => this.stem)]);
    }

    // Another very common group
    /**
     * 
     * Preterito Indefinido pattern 25
     * 
     *             person: 0 1 2 3 4 5
     *         castellano:     .     .
     *    voseo, canarias:     .   . .
     *             formal:   . .   . .
     * 
     * @param dot marked as .
     */
    protected setIndicativoPreteritoIndefinidoPattern25(dot: string): void {
        switch (this.region) {
            case 'castellano':
                /* eslint-disable-next-line max-len */
                this.setTable('Indicativo', 'PreteritoIndefinido', [this.stem, this.stem, dot, this.stem, this.stem, dot]);
                break;
            case 'voseo':
            case 'canarias':
                this.setTable('Indicativo', 'PreteritoIndefinido', [this.stem, this.stem, dot, this.stem, dot, dot]);
                break;
            case 'formal':
                this.setTable('Indicativo', 'PreteritoIndefinido', [this.stem, dot, dot, this.stem, dot, dot]);
                break;
        }
    }
}

/* eslint-disable max-len */
// Imperativo afirmativo notes for ar. ir & er follow the same mechanism
// Castellano
// 2nd singular, idx 1:
//   N: 2nd singular indicativo presente: tú abandonas             => tú abandona   - drop 's'    
//   P:                                   tú te abandonas          => tú abandónate - drop 's', switch pronombre te, esdrujula
// 2nd plural, idx 4:
//   N: use infinitiv, strip r, add  d:   abandonar                => vosotros abandonar - replace 'r' with 'd'
//   P:                         add os:   abandonar                => vosotros abandonar - drop 'r', drop accent, make last syllable strong, add 'os' 
// Voseo
// 2nd singular, idx 1:
//   N: 2nd singular indicativo presente: vos abandonás             => vos abandona   - drop 's'
//   P:                                   vos te abandonás          => vos abandonate - drop 's', switch pronombre te, drop accent
// 2nd plural, idx 4:
//   N: 2nd plural subjuntivo presente:   ustedes abandonen         => ustedes abandonen   - no change
//   P:                                   ustedes se abandonen      => ustedes abandónense - switch pronombre se, esdrujula
// Formal
// 2nd singular, idx 1:
//   N: 2nd singular subjuntivo presente:  usted abandone             => usted abandone - no change    
//   P:                                    usted se abandone          => usted abandónese - switch pronombre se, esdrujula
// 2nd plural, idx 4: 
//   N: 2nd plural subjuntivo presente:    ustedes abandonen        => ustedes abandonen   - no change
//   P:                                    ustedes se abandonen     => ustedes abandónense - switch pronombre se, esdrujula
// Canarias
// 2nd singular, idx 1:
//   N: 2nd singular indicativo presente:  tú abandonas             => tú abandona   - drop 's'    
//   P:                                    tú te abandonas          => tú abandónate - drop 's', switch pronombre te, esdrujula
// 2nd plural, idx 4:
//   N: 2nd plural subjuntivo presente:    ustedes abandonen        => ustedes abandonen   - no change
//   P:                                    ustedes se abandonen     => ustedes abandónense - switch pronombre se, esdrujula
// 1st plural, idx 3 - same for all regions
//   N: 1st plural subjuntivo presente:    nosotros abandonemos     => nosotros abandonemos   - no change
//   P:                                    nosotros nos abandonemos => nosotros abandonémonos - drop 's' switch pronombre nos, esdrujula
/* eslint-enable max-len */