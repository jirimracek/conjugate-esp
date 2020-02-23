/*!
   Copyright (c) 2020 Jiri Mracek jiri@automationce.com
   Copyright (c) 2020 Automation Controls & Engineering

   MIT License
*/

'use strict';
const {conjugateAr} = require('./conjugate-ar');

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
 *      Futuro Imperfecto                       (amare, amares, ...)       NOTE: rarely used in current Spanish
 *      
 * Subjuntivo Compuesto
 *      Pretérito Perfecto                      (haya amado, hayas amado, ...)
 *      Pretérito Pluscuamperfecto 1            (hubiera amado, hubieras amado, ...)
 *      Pretérito Pluscuamperfecto 2            (hubiese amado, hubieses amado, ...)
 *      Futuro Perfecto                         (hubiere amado, hubieres amado, ...)    NOTE: rarely used (legal texts only)
 * 
 * Imperativo
 *      Afirmativo                              (-, ama, ame, ...)
 *      Negativo                                (-, no ames, no ame, ...)
 * 
 *      
 */

 /**
  * Conjugation regional varieties:
  *     castellano (peninsular Spanish)     yo, tú,    él(ella), nosotros, vosotros, ellos(ellas)
  *     voseo (Río de la Plata)             yo, vos,   él(ella), nosotros, ustedes,  ellos(ellas)
  *     Canarias                            yo, tú,    él(ella), nosotros, ustedes,  ellos(ellas)
  *     formal                              yo, usted, él(ella), nosotros, ustedes,  ellos(ellas)
  */


/**
 * Return complete verb conjugation, all mode/time/persons
 * Optional: use voseo instead of castellano
 * 
 * @param {string} infinitiv     - the verb to conjugate
 * @param {boolean} [voseo]      - use voseo
 * @returns {{indicativo: {...}, subjuntivo: {...}, imperativo: {...}}}
 */

 function conjugate(infinitiv, voseo) {
     if (infinitiv.endsWith('ar')) {
         return conjugateAr(infinitiv, voseo);
     }
     return {};
 }

 module.exports = {
     conjugate
 }