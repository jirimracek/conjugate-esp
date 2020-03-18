/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/

export type TableType = Record<string, Record<string, string[]>>;
export type IndexOutputType = Record<string, Record<string, number[]>>;
export type InfoType = { model: string, alias: string, region: string, pronominal: boolean, defective: boolean };

/**
 * @type final JSON format result.  Model name and a complete conjugation list as per that model for given region
 */
export type ResultType = { info: InfoType, conjugation: TableType };
export type FormatType = 'json' | 'text';
export type RegionType = 'castellano' | 'voseo' | 'canarias' | 'formal';
///////////////////
// Verb to model definition types
// "attrs": {"D_1":{[3,4,5]},"D_3":[3,4,5,8,63,64,65,66,67,68,112,114,118,120,121], ...}

// Definition ex.:
// "desvaír": { 
// "N": {                                             // pronominal type, may have multiple models
//     "embaír": {                                    // model name
//         "canarias": "D_7",                         // model attributes: {region: attribute pointer} 
//         "castellano": "D_8",
//         "formal": "D_7",
//         "voseo": "D_9"
//     },
//     "embaír_": {}                                 // model name, no attributes, model has an '_', it's the same conjugation, it  just isn't defective
// },
// "P": {
//     "embaír": {
//         "canarias": "D_7",
//         "castellano": "D_8",
//         "formal": "D_7",
//         "voseo": "D_9"
//     },
//     "embaír_": {}
// }
//          V2M for "Verb to Model" definitions - relates to data in the json file
// "desvaír": { "N": { "embaír": { "canarias": "D_7", "castellano": "D_8", "formal": "D_7", "voseo": "D_9" }, "embaír_": {} }, ... 
export type V2M_AttrKeyType = RegionType | 'A';                                // regions used in attr definitions + 'A'. 'A' means they're all the same
export type V2M_PronType = 'N' | 'P';                                           // Pronominal, Non-pronominal
export type V2M_AttrType = number[];                                            // Defectives array is what we have so far [3,4,5,8,63,64,65,66,67,68,112,114,118,120,121],
export type V2M_AttrDefinitionType = Record<string, V2M_AttrType>;              // Any other attributes??            "D_3":[3,4,5,8,63,64,65,66,67,68,112,114,118,120,121]

export type V2M_AttrIndexedType = { [key in V2M_AttrKeyType]?: string };         //                     { "canarias": "D_7", "castellano": "D_8", "formal": "D_7", "voseo": "D_9" }
export type V2M_ModelType = Record<string, V2M_AttrIndexedType>;                 //        "{ "embaír": { "canarias": "D_7", "castellano": "D_8", "formal": "D_7", "voseo": "D_9" }, "embaír_": {} }
export type V2M_ModelListType = { [key in V2M_PronType]?: V2M_ModelType };       //  { "N": { "embaír": { "canarias": "D_7", "castellano": "D_8", "formal": "D_7", "voseo": "D_9" }, "embaír_": {} }, ...

export type V2M_SectionType = Record<string, V2M_ModelListType | V2M_AttrDefinitionType>;

///////////////////
// const bar: V2M_ModelType = { "embaír": { "E": "D_8", "F": "D_7", "V": "D_9" } };
// const foo: V2M_ModelListType = { "N": { "embaír": { "C": "D_7", "E": "D_8", "F": "D_7", "V": "D_9" } } } ;
// const s: V2M_SectionType = {"desvaír":{"N":  {"embaír":{"C":"D_7","E":"D_8","F":"D_7","V":"D_9"},"embaír_":{}},"P":{"embaír":{"C":"D_7","E":"D_8","F":"D_7","V":"D_9"},"embaír_":{}}}};
// console.log(foo.P);


// Model objects have to implement this
export interface ModelInterface {
    // getConjugationOf(verb: string, type: V2M_PronKeyType, attributes?: AttributeType): TableType;
    getConjugationOf(verb: string, format: FormatType): TableType | string[];
}

export const PRONOMINAL = 'P';
export const NONPRONOMINAL = 'N';
export const PRONOMBRES: { [key in V2M_PronType]: { [key in RegionType]: string[] } } = {
    N: {
        castellano: ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'],
        voseo: ['yo', 'vos', 'él', 'nosotros', 'ustedes', 'ellos'],
        formal: ['yo', 'usted', 'él', 'nosotros', 'ustedes', 'ellos'],
        canarias: ['yo', 'tú', 'él', 'nosotros', 'ustedes', 'ellos']
    },
    P: {
        castellano: ['yo me', 'tú te', 'él se', 'nosotros nos', 'vosotros os', 'ellos se'],
        voseo: ['yo me', 'vos te', 'él se', 'nosotros nos', 'ustedes se', 'ellos se'],
        formal: ['yo me', 'usted se', 'él se', 'nosotros nos', 'ustedes se', 'ellos se'],
        canarias: ['yo me', 'tú te', 'él se', 'nosotros nos', 'ustedes se', 'ellos se']
    }
}

export const TERM: Readonly<TableType> = {
    'Impersonal': {},
    'Indicativo': {
        'Pretérito Perfecto': ['he', 'has', 'ha', 'hemos', 'habéis', 'han'],
        'Pretérito Pluscuamperfecto': ['había', 'habías', 'había', 'habíamos', 'habíais', 'habían'],
        'Pretérito Anterior': ['hube', 'hubiste', 'hubo', 'hubimos', 'hubisteis', 'hubieron'],
        'Futuro Perfecto': ['habré', 'habrás', 'habrá', 'habremos', 'habréis', 'habrán'],
        'Condicional Compuesto': ['habría', 'habrías', 'habría', 'habríamos', 'habríais', 'habrían']
    },
    'Subjuntivo': {
        'Pretérito Perfecto': ['haya', 'hayas', 'haya', 'hayamos', 'hayáis', 'hayan'],
        'Pretérito Pluscuamperfecto -ra': ['hubiera', 'hubieras', 'hubiera', 'hubiéramos', 'hubierais', 'hubieran'],
        'Pretérito Pluscuamperfecto -se': ['hubiese', 'hubieses', 'hubiese', 'hubiésemos', 'hubieseis', 'hubiesen'],
        'Futuro Perfecto': ['hubiere', 'hubieres', 'hubiere', 'hubiéremos', 'hubiereis', 'hubieren']
    },
    'Imperativo': {
        'Afirmativo': [],
        'Negativo': []
    }
}

export const AR: Readonly<TableType> = {
    'Impersonal': {
        'Infinitivo': ['ar', 'arse'],
        'Gerundio': ['ando', 'ándose'],
        'Participio': ['ado']
    },
    'Indicativo': {
        'Presente': ['o', 'as', 'a', 'amos', 'áis', 'an'],
        'Pretérito Imperfecto': ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban'],
        'Pretérito Indefinido': ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'],
        'Futuro Imperfecto': ['aré', 'arás', 'ará', 'aremos', 'aréis', 'arán'],
        'Condicional Simple': ['aría', 'arías', 'aría', 'aríamos', 'aríais', 'arían']
    },
    'Subjuntivo': {
        'Presente': ['e', 'es', 'e', 'emos', 'éis', 'en'],
        'Pretérito Imperfecto -ra': ['ara', 'aras', 'ara', 'áramos', 'arais', 'aran'],
        'Pretérito Imperfecto -se': ['ase', 'ases', 'ase', 'ásemos', 'aseis', 'asen'],
        'Futuro Imperfecto': ['are', 'ares', 'are', 'áremos', 'areis', 'aren']
    },
    'Imperativo': {}
}


export const ER: Readonly<TableType> = {
    'Impersonal': {
        'Infinitivo': ['er', 'erse'],
        'Gerundio': ['iendo', 'iéndose'],
        'Participio': ['ido']
    },
    'Indicativo': {
        'Presente': ['o', 'es', 'e', 'emos', 'éis', 'en'],
        'Pretérito Imperfecto': ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
        'Pretérito Indefinido': ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
        'Futuro Imperfecto': ['eré', 'erás', 'erá', 'eremos', 'eréis', 'erán'],
        'Condicional Simple': ['ería', 'erías', 'ería', 'eríamos', 'eríais', 'erían']
    },
    'Subjuntivo': {
        'Presente': ['a', 'as', 'a', 'amos', 'áis', 'an'],
        'Pretérito Imperfecto -ra': ['iera', 'ieras', 'iera', 'iéramos', 'ierais', 'ieran'],
        'Pretérito Imperfecto -se': ['iese', 'ieses', 'iese', 'iésemos', 'ieseis', 'iesen'],
        'Futuro Imperfecto': ['iere', 'ieres', 'iere', 'iéremos', 'iereis', 'ieren']
    },
    'Imperativo': {}
}


export const IR: Readonly<TableType> = {
    'Impersonal': {
        'Infinitivo': ['ir', 'irse'],
        'Gerundio': ['iendo', 'iéndose'],
        'Participio': ['ido']
    },
    'Indicativo': {
        'Presente': ['o', 'es', 'e', 'imos', 'ís', 'en'],
        'Pretérito Imperfecto': ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
        'Pretérito Indefinido': ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
        'Futuro Imperfecto': ['iré', 'irás', 'irá', 'iremos', 'iréis', 'irán'],
        'Condicional Simple': ['iría', 'irías', 'iría', 'iríamos', 'iríais', 'irían']
    },
    'Subjuntivo': {
        'Presente': ['a', 'as', 'a', 'amos', 'áis', 'an'],
        'Pretérito Imperfecto -ra': ['iera', 'ieras', 'iera', 'iéramos', 'ierais', 'ieran'],
        'Pretérito Imperfecto -se': ['iese', 'ieses', 'iese', 'iésemos', 'ieseis', 'iesen'],
        'Futuro Imperfecto': ['iere', 'ieres', 'iere', 'iéremos', 'iereis', 'ieren']
    },
    'Imperativo': {}
}