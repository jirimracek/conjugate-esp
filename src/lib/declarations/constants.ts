/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { ConjugationTable, PronounsTable, DefectiveType } from './types';

export const PRONOUNS: Readonly<PronounsTable> = {
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

// The composite verb auxiliar haber forms
export const AUX: Readonly<ConjugationTable> = {
    Indicativo: {
        PreteritoPerfecto: ['he', 'has', 'ha', 'hemos', 'habéis', 'han'],
        PreteritoPluscuamperfecto: ['había', 'habías', 'había', 'habíamos', 'habíais', 'habían'],
        PreteritoAnterior: ['hube', 'hubiste', 'hubo', 'hubimos', 'hubisteis', 'hubieron'],
        FuturoPerfecto: ['habré', 'habrás', 'habrá', 'habremos', 'habréis', 'habrán'],
        CondicionalCompuesto: ['habría', 'habrías', 'habría', 'habríamos', 'habríais', 'habrían']
    },
    Subjuntivo: {
        PreteritoPerfecto: ['haya', 'hayas', 'haya', 'hayamos', 'hayáis', 'hayan'],
        PreteritoPluscuamperfectoRa: ['hubiera', 'hubieras', 'hubiera', 'hubiéramos', 'hubierais', 'hubieran'],
        PreteritoPluscuamperfectoSe: ['hubiese', 'hubieses', 'hubiese', 'hubiésemos', 'hubieseis', 'hubiesen'],
        FuturoPerfecto: ['hubiere', 'hubieres', 'hubiere', 'hubiéremos', 'hubiereis', 'hubieren']
    }
}

// The desinences (endings) of conjugated forms
export const AR: Readonly<ConjugationTable> = {
    Impersonal: {
        Infinitivo: ['ar', 'arse'],
        Gerundio: ['ando', 'ándose'],
        Participio: ['ado']
    },
    Indicativo: {
        Presente: ['o', 'as', 'a', 'amos', 'áis', 'an'],
        PreteritoImperfecto: ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban'],
        PreteritoIndefinido: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'],
        FuturoImperfecto: ['aré', 'arás', 'ará', 'aremos', 'aréis', 'arán'],
        CondicionalSimple: ['aría', 'arías', 'aría', 'aríamos', 'aríais', 'arían']
    },
    Subjuntivo: {
        Presente: ['e', 'es', 'e', 'emos', 'éis', 'en'],
        PreteritoImperfectoRa: ['ara', 'aras', 'ara', 'áramos', 'arais', 'aran'],
        PreteritoImperfectoSe: ['ase', 'ases', 'ase', 'ásemos', 'aseis', 'asen'],
        FuturoImperfecto: ['are', 'ares', 'are', 'áremos', 'areis', 'aren']
    }
}

export const ER: Readonly<ConjugationTable> = {
    Impersonal: {
        Infinitivo: ['er', 'erse'],
        Gerundio: ['iendo', 'iéndose'],
        Participio: ['ido']
    },
    Indicativo: {
        Presente: ['o', 'es', 'e', 'emos', 'éis', 'en'],
        PreteritoImperfecto: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
        PreteritoIndefinido: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
        FuturoImperfecto: ['eré', 'erás', 'erá', 'eremos', 'eréis', 'erán'],
        CondicionalSimple: ['ería', 'erías', 'ería', 'eríamos', 'eríais', 'erían']
    },
    Subjuntivo: {
        Presente: ['a', 'as', 'a', 'amos', 'áis', 'an'],
        PreteritoImperfectoRa: ['iera', 'ieras', 'iera', 'iéramos', 'ierais', 'ieran'],
        PreteritoImperfectoSe: ['iese', 'ieses', 'iese', 'iésemos', 'ieseis', 'iesen'],
        FuturoImperfecto: ['iere', 'ieres', 'iere', 'iéremos', 'iereis', 'ieren']
    }
}

export const IR: Readonly<ConjugationTable> = {
    Impersonal: {
        Infinitivo: ['ir', 'irse'],
        Gerundio: ['iendo', 'iéndose'],
        Participio: ['ido']
    },
    Indicativo: {
        Presente: ['o', 'es', 'e', 'imos', 'ís', 'en'],
        PreteritoImperfecto: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
        PreteritoIndefinido: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
        FuturoImperfecto: ['iré', 'irás', 'irá', 'iremos', 'iréis', 'irán'],
        CondicionalSimple: ['iría', 'irías', 'iría', 'iríamos', 'iríais', 'irían']
    },
    Subjuntivo: {
        Presente: ['a', 'as', 'a', 'amos', 'áis', 'an'],
        PreteritoImperfectoRa: ['iera', 'ieras', 'iera', 'iéramos', 'ierais', 'ieran'],
        PreteritoImperfectoSe: ['iese', 'ieses', 'iese', 'iésemos', 'ieseis', 'iesen'],
        FuturoImperfecto: ['iere', 'ieres', 'iere', 'iéremos', 'iereis', 'ieren']
    }
}
export const NO_IMPERATIVO_AFIRMATIVO: DefectiveType[] = [
    'imper',
    'tercio',
    'terciop', 
    'bimorfop',
    'omorfo',
    'osmorfo',
    'ogmorfo'
];
export const NO_IMPERATIVO_NEGATIVO: DefectiveType[] = ['imper', 'tercio', 'terciop', 'bimorfop', 'ogmorfo'];
export const ERROR_MSG = {
    UndefinedTemplates: 'Undefined templates - check definitions.json file',
    UnknownVerb: 'Unknown verb VERB',
    UnknownRegion: 'Unknown region REGION',
    MissingModelData: 'Missing verb VERB model data - check definitions.json file',
    UnknownModel: 'Model MODEL not implemented, can not conjugate verb VERB, region REGION'
}
export const DASH6 = '------';