/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/

// Conjugation table format used:
//   internally - see constants 
//   externally - json format of what the consumer receives
// export type ConjugationTable = Record<string, Record<string, string[]>>;
export type ConjugationTable = { [modekey: string]: { [timekey: string]: string[] } };

// Types used to represent data in the verb definitions json file
// Can't use a specific type for attributekey, has to be a string (don't know how many D_x attrs we'll have)
export type ModelAttributes = { [attributekey: string]: string | boolean | number[] | undefined };    
// Ditto for modelnamekey
export type ModelWithAttributes = { [modelname: string]: ModelAttributes };
export type Model = string | ModelWithAttributes;

export type PronominalKeys = 'N' | 'P';                    // Pronominal, Non-pronominal
export type VerbModelData = { [key in PronominalKeys]?: Model[] | Model };

// in defective attributes section in verb definition file, section key is 'defectives'
export type DefectiveData = { [defectivekey: string]: number[] };

export type DB = { [verbname: string]: VerbModelData | DefectiveData };

// DB Attributes:
// Defective attributes are region dependent and have a form of DB_DefectiveKey:D_n, 'A' stands for all regions
export type Regions = 'castellano' | 'voseo' | 'canarias' | 'formal';
export type DefectiveKeys = Regions | 'A';

// Other attributes (not region dependent):
// attribute has form of name attrname:string
// attributes other than defectives are attached to the model by colon : and separated by semicolon ';'
// attribute has form of name attrname=string
// known attributes:
// SN:true               - Strip defective Nouns      - 3rd person only defectives don't carry nouns
// PR:RegExp/replacement - Participio Replace         - RegExp is the regular expression that Replaces the regular form (inhestar, pensar:PR=estad/iest - from inhestado to inhiesto)
// PD:RegExp/replacement - Participio Dual            - RegExp is the regular expression that creates the irregular participio form from the regular one
//                                                                    AND it gets added as a second participio. The first, REGULAR PARTICIPIO gets used for COMPUESTOS
// PC:RegExp/replacement - Participio Compuesto(irregular)  - same as PD, EXCEPT the second, IRREGULAR PARTICIPIO gets used for COMPUESTOS
export type AttributeKeys = 'SN' | 'PR' | 'PD' | 'PC';

// export const g: DB = {
//     "abocanar": {
//         "N": {
//             "amar": {
//                 "A": "D_1"
//             }
//         }
//     },
//     "abolir": {
//         "N": [
//             "vivir",
//             {
//                 "vivir": {
//                     "canarias": "D_2",
//                     "castellano": "D_3",
//                     "formal": "D_2",
//                     "voseo": "D_4"
//                 }
//             }
//         ]
//     },
//     "empedernir": {
//         "N": [
//             {
//                 "vivir": {
//                     "A": "D_11"
//                 }
//             },
//             {
//                 "vivir": {
//                     "canarias": "D_2",
//                     "castellano": "D_3",
//                     "formal": "D_2",
//                     "voseo": "D_4"
//                 }
//             }
//         ],
//         "P": [
//             {
//                 "vivir": {
//                     "A": "D_11"
//                 }
//             },
//             {
//                 "vivir": {
//                     "canarias": "D_2",
//                     "castellano": "D_3",
//                     "formal": "D_2",
//                     "voseo": "D_4"
//                 }
//             }
//         ]
//     },
//     "defectives": {
//         "D_2": [3, 4, 5, 8, 63, 64, 65, 66, 67, 68, 112, 114, 115, 118, 120, 121]
//     }
//    inhestar, pensar=PR:estad/iest   # participio irregular inhiesto

// }
// const sample: DB = {
//     "amar": {                 // amar, amar               files: amar-amar-castellano, ...
//         "N": "amar"
//     },
//     "abolir": {                // abolir, vivir, vivir    files: abolir-vivir-0-castellano, abolir-vivir-1-castellano, ....
//         "N": [
//             "vivir",
//             {
//                 "vivir":
//                     { "canarias": "D_2", "castellano": "D_3", "formal": "D_2", "voseo": "D_4" }
//             }]
//     },
//     "aclarar": {       // aclarar, amar, amar=SN:true        files: aclarar-amar-0-castellano, aclarar-amar-1-castellano, aclararse-amar-0-castellano
//         "N": [
//             "amar",
//             { "amar": { "A": "D_1", "SN": "true" } }   // strict: true - strip nouns on defectives
//         ],
//         "P": "amar"
//     },
//     "granizar": {     // granizar, amar, amar=SN:true          granizar-amar-0-casteallano, granizar-amar-1-castellano
//         "N": [
//             "amar",
//             { "amar": { "A": "D_1", "SN": "true" } }
//         ]
//     },
//     "adecuar": {     // adecuar, amar, actuar               adecuar-amar-0-castellano, adecuar-actuar-1-castellano, adecuarse-amar-0-castellano, adecuarse-actuar-1-castellano
//         "N": ["amar", "actuar"],
//         "P": ["amar", "actuar"]
//     },
//     "ventar": {          // ventar, pensar=SN:true, amar, pensar          // ventar-pensar-0-castellano, ventar-amar-1-castellano, ventar-pensar-2-castellano
//         "N": [
//             { "pensar": { "A": "D_1", "SN": "true" } },
//             "amar",
//             "pensar"
//         ]
//     },
//     "yacer": {         // yacer, yacer, yacer, yacer                                 // yacer-yacer-0-castellano, yacer-yacer-1-castellano, yacer-yacer-2-castellano
//         "N": ["yacer", "yacer", "yacer"]
//     },
//     "defectives": {
//         "D_2": [3, 4, 5, 8, 63, 64, 65, 66, 67, 68, 112, 114, 115, 118, 120, 121]
//     }
// }

