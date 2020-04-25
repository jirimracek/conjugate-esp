/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/

// Conjugation table format used:
//   internally - see constants 
//   externally - json format of what the consumer receives
export type ConjugationTable = { [modekey: string]: { [timekey: string]: string[] } };

// Attributes
// attribute has form of attrname : string | boolean
// attributes are attached to the model by colon = and separated by semicolon ';'
// known attributes:
//    defective types: { D:imorfo | eimorfo | imper | tercio | terciop | mmorfo | bimorfop | bimorfog | trimorfo | omorfo | ogmorfo }
//    PR:RegExp/replacement - _participio r_eplace                - RegExp is the regular expression that Replaces the regular form (inhestar, pensar:PR=estad/iest - from inhestado to inhiesto)
//    PD:RegExp/replacement - _participio d_ual                   - RegExp is the regular expression that creates the irregular participio form from the regular one
//                                                                       AND it gets added as a second participio. The first, REGULAR PARTICIPIO gets used for COMPUESTOS
//    PC:RegExp/replacement - _participio c_ompuesto (irregular)  - same as PD, EXCEPT the second, IRREGULAR PARTICIPIO gets used for COMPUESTOS
//    D:DefectiveType       - one of the Defective Types
//    M:boolean            - monosyllable ortho adjustment, drop accent
//    V:string              - use for slight model changes, ex.: predecir, predeciré & prediré

// Types used to represent data in the verb definitions json file
export type DefectiveType = 'imorfo' | 'eimorfo' | 'imper' | 'tercio' | 'terciop' | 'mmorfo' | 'bimorfop' | 'bimorfog' | 'trimorfo' | 'omorfo' | 'ogmorfo' | 'osmorfo';
export type AttributeValues = DefectiveType | boolean | string;
export type AttributeKeys = 'PR' | 'PD' | 'PS' | 'D' | 'M' | 'V';
export type ModelAttributes = { [attributekey in AttributeKeys]?: AttributeValues };
export type ModelWithAttributes = { [modelname: string]: ModelAttributes };
export type Model = string | ModelWithAttributes;
export type PronominalKeys = 'N' | 'P';                    // Pronominal, Non-pronominal
export type VerbModelData = { [key in PronominalKeys]?: Model[] | Model };
export type DB = { [verbname: string]: VerbModelData };

// Types used in sw
export type Regions = 'castellano' | 'voseo' | 'canarias' | 'formal';

// Use to hold mode pronouns
export type PronounsTable = { [key in PronominalKeys]: { [key in Regions]: string[] } };

export type ModeParam = 'Indicativo' | 'Subjuntivo';
export type ModeTimeParam = 'Presente' | 'PreteritoImperfecto' | 'PreteritoIndefinido' |
    'FuturoImperfecto' | 'CondicionalSimple' | 'PreteritoImperfectoRa' | 'PreteritoImperfectoSe';

