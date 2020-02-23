/*!
   Copyright (c) 2020 Jiri Mracek jiri@automationce.com
   Copyright (c) 2020 Automation Controls & Engineering

   MIT License
*/

'use strict';
/**
 * conjugate-esp module
 * @module
 */

/**
 * Using Spanish terminology
 * Legal mode/time combinations 
 * 
 * Indicativo Simple
 *      Presente                                (amo, amas, ...)
 *      Pretérito Imperfecto                    (amaba, amabas, ...)
 *      Pretérito Indefinido                    (amé, amaste, ...)
 *      Futuro Imperfecto                       (amaré, amarás, ...)
 *      Condicional simple                      (amaría, amarías, ...)
 * 
 * Indicativo Compuesto
 *      Pretérito Perfecto                      (he amado, has amado, ...)
 *      Pretérito Pluscuamperfecto              (había amado, habías amado, ...)
 *      Pretérito Anterior                      (hubo amado, hubiste amado, ...)
 *      Futuro Perfecto                         (habré amado, habrás amado, ...)
 *      Condicional Compuesto                   (habría amado, habrías amado, ...)
 * 
 * Subjuntivo Simple
 *      Presente                                (ame, ames, ...)
 *      Pretérito Imperfecto 1                  (amara, amaras, ...)
 *      Pretérito Imperfecto 2                  (amase, amases, ...)
 *  *1) Futuro Imperfecto                       (amare, amares, ...)
 *      
 * Subjuntivo Compuesto
 *      Pretérito Perfecto                      (haya amado, hayas amado, ...)
 *      Pretérito Pluscuamperfecto 1            (hubiera amado, hubieras amado, ...)
 *      Pretérito Pluscuamperfecto 2            (hubiese amado, hubieses amado, ...)
 *  *1) Futuro Perfecto                         (hubiere amado, hubieres amado, ...)
 * 
 * Imperativo
 *      Afirmativo                              (-, ama, ame, ...)
 *      Negativo                                (-, no ames, no ame, ...)
 * 
 * 
 *  *1) Futuro Imperfecto & Futuro Perfecto de Subjuntivo is unused in current 'normal' Spanish, it will be seen in legal texts     
 */

/**
 * Regional varieties:
 *     castellano (peninsular Spanish)     yo, tú,    él(ella), nosotros, vosotros, ellos(ellas)
 *     voseo (Río de la Plata)             yo, vos,   él(ella), nosotros, ustedes,  ellos(ellas)
 *     Canarias                            yo, tú,    él(ella), nosotros, ustedes,  ellos(ellas)
 *     formal                              yo, usted, él(ella), nosotros, ustedes,  ellos(ellas)
 */


/**
 * Conjugate a single verb.
 * Returned object is organized by Indicative, Subjuntive, Imperative, 
 * each key has subobjects of time/mode (Presente, Pretérito ...),
 * each subobject contains a final object, ex.: {yo: 'amo', tú: 'amas', ...}
 *   
 * 
 * @param {string} infinitiv              - the infinitive to conjugate
 * @param {string} [region=castellano]    - castellano | voseo | canarias | formal 
 * @param {boolean} [split=false]         - if true and the verb is irregular
 *                                          its irregular conjugations will be returned as a string[3]: [start, irregularity, end]
 *                                          This allows for the irregular parts to be noted, annotated, highlighted, assigned a CSS class etc.  
 *                                          The start and/or end parts may be empty (['', 'quep', 'o'], ['', 'voy', '']) 
 * @returns {}                            - Returned object contains complete conjugation tables
 * 
 */

function conjugate(infinitiv, region, split) {
    return {};
}

/**
 * Get infinitiv from conjugated form
 *   yes, it is possible to get more than one match (ex.: infinitiv('siento') returns [sentar, sentir])
 * @param {string} conjugatedForm
 * @returns {string[]} 
 */
function infinitiv(conjugated) {
    return [];
}

module.exports = {
    getConjugation: conjugate,
    getInfinitiv: infinitiv
}