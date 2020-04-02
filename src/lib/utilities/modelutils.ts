/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/

import { ConjugationTable } from "../declarations/types";

/**
 * 
 * @param table json format conjugation
 * @returns string []
 */
export function json2Text(table: ConjugationTable): string[] {
    const retVal: string[] = [];
    retVal.push(...Object.values(table).map(mode =>
        Object.values(mode).map(time => time)).flat(2));
    return retVal;
}

/**
 * 
 * @param table conjugation table, string[]
 * @returns json formated
 */
export function text2Json(table: string[]): ConjugationTable {
    const retVal: ConjugationTable = <ConjugationTable>{};
    const temp = table.map(m => m);   // Make a copy so it doesn't get overwritten

    ['Impersonal', 'Indicativo', 'Subjuntivo', 'Imperativo'].forEach(mode => retVal[mode] = {});

    ['Infinitivo', 'Gerundio', 'Participio'].forEach(type => retVal.Impersonal[type] = [temp.shift() as string]);

    ['Presente', 'Preterito_Imperfecto', 'Preterito_Indefinido', 'Futuro_Imperfecto', 'Condicional_Simple',
        'Preterito_Perfecto', 'Preterito_Pluscuamperfecto', 'Preterito_Anterior',
        'Futuro_Perfecto', 'Condicional_Compuesto'].forEach(time => retVal['Indicativo'][time] = temp.splice(0, 6));

    ['Presente', 'Preterito_Imperfecto_ra', 'Preterito_Imperfecto_se', 'Futuro_Imperfecto',
        'Preterito_Perfecto', 'Preterito_Pluscuamperfecto_ra', 'Preterito_Pluscuamperfecto_se',
        'Futuro_Perfecto'].forEach(time => retVal['Subjuntivo'][time] = temp.splice(0, 6));

    ['Afirmativo', 'Negativo'].forEach(imperativo => retVal['Imperativo'][imperativo] = temp.splice(0, 6));

    return retVal;
}