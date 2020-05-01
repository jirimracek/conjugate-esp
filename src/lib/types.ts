/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/

// Conjugation table format used:
//   internally - see constants 
export type ConjugationTable = { [modekey: string]: { [timekey: string]: string[] | string } };
export type ImpersonalSubKey = 'Infinitivo' | 'Gerundio' | 'Participio';

export type IndicativoSubSimpleKey = 'Presente' | 'PreteritoImperfecto' | 'PreteritoIndefinido' | 'FuturoImperfecto' | 'CondicionalSimple';
export type IndicativoSubCompKey = 'PreteritoPerfecto' | 'PreteritoPluscuamperfecto' | 'PreteritoAnterior' | 'FuturoPerfecto' | 'CondicionalCompuesto';
export type IndicativoSubKey = IndicativoSubSimpleKey | IndicativoSubCompKey;

export type SubjuntivoSubSimpleKey = 'Presente'| 'PreteritoImperfectoRa'| 'PreteritoImperfectoSe'| 'FuturoImperfecto';
export type SubjuntivoSubCompKey = 'PreteritoPerfecto' | 'PreteritoPluscuamperfectoRa' | 'PreteritoPluscuamperfectoSe' | 'FuturoPerfecto';
export type SubjuntivoSubKey = SubjuntivoSubSimpleKey | SubjuntivoSubCompKey;

export type ImperativoSubKey = 'Afirmativo' | 'Negativo';

export type SimpleModeKey = 'Indicativo' | 'Subjuntivo';

export type PronominalKeys = 'N' | 'P';                    // Pronominal, Non-pronominal

// Types used in sw
export type Regions = 'castellano' | 'voseo' | 'canarias' | 'formal';



