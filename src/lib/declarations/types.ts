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
//    defective types: { _d_:imorfo | eimorfo | imper | tercio | terciop | mmorfo | bimorfop | bimorfog | trimorfo | omorfo | ogmorfo }
//    _pr_:RegExp/replacement - _participio r_eplace                - RegExp is the regular expression that Replaces the regular form (inhestar, pensar:PR=estad/iest - from inhestado to inhiesto)
//    _pd_:RegExp/replacement - _participio d_ual                   - RegExp is the regular expression that creates the irregular participio form from the regular one
//                                                                       AND it gets added as a second participio. The first, REGULAR PARTICIPIO gets used for COMPUESTOS
//    _pc_:RegExp/replacement - _participio c_ompuesto (irregular)  - same as PD, EXCEPT the second, IRREGULAR PARTICIPIO gets used for COMPUESTOS
//    _d_:DefectiveType       - one of the Defective Types
//    _ms_:boolean            - monosyllable ortho adjustment, drop accent
//    _v_:string              - use for slight model changes, ex.: predecir, predeciré & prediré

export type DefectiveType = 'imorfo' | 'eimorfo' | 'imper' | 'tercio' | 'terciop' | 'mmorfo' | 'bimorfop' | 'bimorfog' | 'trimorfo' | 'omorfo' | 'ogmorfo' | 'osmorfo';
export type AttributeValues = DefectiveType | boolean | string;

export type AttributeKeys = 'PR' | 'PD' | 'PC' | 'D' | 'M' | 'V';
// Types used to represent data in the verb definitions json file
export type ModelAttributes = { [attributekey in AttributeKeys]?: AttributeValues };
// Ditto for modelnamekey
export type ModelWithAttributes = { [modelname: string]: ModelAttributes };
export type Model = string | ModelWithAttributes;

export type PronominalKeys = 'N' | 'P';                    // Pronominal, Non-pronominal
export type VerbModelData = { [key in PronominalKeys]?: Model[] | Model };

export type DB = { [verbname: string]: VerbModelData };

export type Regions = 'castellano' | 'voseo' | 'canarias' | 'formal';


// Use to hold mode pronouns
export type PronounsTable = { [key in PronominalKeys]: { [key in Regions]: string[] } };
