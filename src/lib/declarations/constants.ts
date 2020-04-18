/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/

import { ConjugationTable, PronounsTable, DefectiveType } from "./types";

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
export const AUX_HABER: Readonly<ConjugationTable> = {
    Indicativo: {
        Preterito_Perfecto: ['he', 'has', 'ha', 'hemos', 'habéis', 'han'],
        Preterito_Pluscuamperfecto: ['había', 'habías', 'había', 'habíamos', 'habíais', 'habían'],
        Preterito_Anterior: ['hube', 'hubiste', 'hubo', 'hubimos', 'hubisteis', 'hubieron'],
        Futuro_Perfecto: ['habré', 'habrás', 'habrá', 'habremos', 'habréis', 'habrán'],
        Condicional_Compuesto: ['habría', 'habrías', 'habría', 'habríamos', 'habríais', 'habrían']
    },
    Subjuntivo: {
        Preterito_Perfecto: ['haya', 'hayas', 'haya', 'hayamos', 'hayáis', 'hayan'],
        Preterito_Pluscuamperfecto_ra: ['hubiera', 'hubieras', 'hubiera', 'hubiéramos', 'hubierais', 'hubieran'],
        Preterito_Pluscuamperfecto_se: ['hubiese', 'hubieses', 'hubiese', 'hubiésemos', 'hubieseis', 'hubiesen'],
        Futuro_Perfecto: ['hubiere', 'hubieres', 'hubiere', 'hubiéremos', 'hubiereis', 'hubieren']
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
        Preterito_Imperfecto: ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban'],
        Preterito_Indefinido: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'],
        Futuro_Imperfecto: ['aré', 'arás', 'ará', 'aremos', 'aréis', 'arán'],
        Condicional_Simple: ['aría', 'arías', 'aría', 'aríamos', 'aríais', 'arían']
    },
    Subjuntivo: {
        Presente: ['e', 'es', 'e', 'emos', 'éis', 'en'],
        Preterito_Imperfecto_ra: ['ara', 'aras', 'ara', 'áramos', 'arais', 'aran'],
        Preterito_Imperfecto_se: ['ase', 'ases', 'ase', 'ásemos', 'aseis', 'asen'],
        Futuro_Imperfecto: ['are', 'ares', 'are', 'áremos', 'areis', 'aren']
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
        Preterito_Imperfecto: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
        Preterito_Indefinido: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
        Futuro_Imperfecto: ['eré', 'erás', 'erá', 'eremos', 'eréis', 'erán'],
        Condicional_Simple: ['ería', 'erías', 'ería', 'eríamos', 'eríais', 'erían']
    },
    Subjuntivo: {
        Presente: ['a', 'as', 'a', 'amos', 'áis', 'an'],
        Preterito_Imperfecto_ra: ['iera', 'ieras', 'iera', 'iéramos', 'ierais', 'ieran'],
        Preterito_Imperfecto_se: ['iese', 'ieses', 'iese', 'iésemos', 'ieseis', 'iesen'],
        Futuro_Imperfecto: ['iere', 'ieres', 'iere', 'iéremos', 'iereis', 'ieren']
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
        Preterito_Imperfecto: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
        Preterito_Indefinido: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
        Futuro_Imperfecto: ['iré', 'irás', 'irá', 'iremos', 'iréis', 'irán'],
        Condicional_Simple: ['iría', 'irías', 'iría', 'iríamos', 'iríais', 'irían']
    },
    Subjuntivo: {
        Presente: ['a', 'as', 'a', 'amos', 'áis', 'an'],
        Preterito_Imperfecto_ra: ['iera', 'ieras', 'iera', 'iéramos', 'ierais', 'ieran'],
        Preterito_Imperfecto_se: ['iese', 'ieses', 'iese', 'iésemos', 'ieseis', 'iesen'],
        Futuro_Imperfecto: ['iere', 'ieres', 'iere', 'iéremos', 'iereis', 'ieren']
    }
}
export const NO_IMPERATIVO_AFIRMATIVO: DefectiveType[] = ['imper', 'tercio', 'terciop', 'bimorfop', 'omorfo', 'osmorfo', 'ogmorfo'];
export const NO_IMPERATIVO_NEGATIVO: DefectiveType[] = ['imper', 'tercio', 'terciop', 'bimorfop', 'ogmorfo'];
export const ERROR_MSG = {
    UndefinedTemplates: 'Undefined templates - check definitions.json file',
    UnknownVerb: 'Unknown verb VERB',
    UnknownRegion: 'Unknown region REGION',
    MissingModelData: 'Missing verb VERB model data - check definitions.json file',
    UnknownModel: 'Model MODEL not implemented, can not conjugate verb VERB, region REGION'
}