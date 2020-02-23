/*!
   Copyright (c) 2020 Jiri Mracek jiri@automationce.com
   Copyright (c) 2020 Automation Controls & Engineering

   MIT License
*/

/**
 * Regular verbs terminations + auxiliary verb haber
 * It's convenient to construct all simple versions first 
 * Compound versions can be inserted later, 
 * after the verb irregularities are resolved
 * 
 */
'use strict';
module.exports = {
    terminationsAr: [
        'ando', 'ado',                                          // Gerundio, Participio
        'o', 'as', 'a', 'amos', 'áis', 'an',                    // Indicativo Presente
        'aba', 'abas', 'aba', 'ábamos', 'abais', 'aban',        //    Preterito imperfecto
        'é', 'aste', 'ó', 'amos', 'asteis', 'aron',             //    Preterito indefinido
        'aré', 'arás', 'ará', 'aremos', 'aréis', 'arán',        //    Futuro imperfecto
        'aría', 'arías', 'aría', 'aríamos', 'aríais', 'arían',  //    Condicional simple
        'e', 'es', 'e', 'emos', 'éis', 'en',                    // Subjuntivo Presente
        'ara', 'aras', 'ara', 'áramos', 'arais', 'aran',        //    Preterito imperfecto 1
        'ase', 'ases', 'ase', 'ásemos', 'aseis', 'asen',        //    Preterito imperfecto 2
        'are', 'ares', 'are', 'áremos', 'areis', 'aren'         //    Futuro imperfecto
    ],
    er: [
        'iendo', 'ido',                                         // Gerundio, Participio
        'o', 'es', 'e', 'emos', 'éis', 'en',                    // Indicativo Presente
        'ía', 'ías', 'ía', 'íamos', 'íais', 'ían',              //    Preterito imperfecto
        'í', 'iste', 'ió', 'imos', 'isteis', 'ieron',           //    Preterito indefinido
        'eré', 'erás', 'erá', 'eremos', 'eréis', 'erán',        //    Futuro imperfecto
        'ería', 'erías', 'ería', 'eríamos', 'eríais', 'erían',  //    Condicional simple
        'a', 'as', 'a', 'amos', 'áis', 'an',                    // Subjuntivo Presente
        'iera', 'ieras', 'iera', 'iéramos', 'ierais', 'ieran',  //    Preterito imperfecto 1
        'iese', 'ieses', 'iese', 'iésemos', 'ieseis', 'iesen',  //    Preterito imperfecto 2
        'iere', 'ieres', 'iere', 'iéremos', 'iereis', 'ieren'   //    Futuro imperfecto
    ],
    ir: [
        'iendo', 'ido',                                         // Gerundio, Participio
        'o', 'es', 'e', 'imos', 'ís', 'en',                     // Indicativo Presente
        'ía', 'ías', 'ía', 'íamos', 'íais', 'ían',              //    Preterito imperfecto
        'í', 'iste', 'ió', 'imos', 'isteis', 'ieron',           //    Preterito indefinido
        'iré', 'irás', 'irá', 'iremos', 'iréis', 'irán',        //    Futuro imperfecto
        'iría', 'irías', 'iría', 'iríamos', 'iríais', 'irían',  //    Condicional simple
        'a', 'as', 'a', 'amos', 'áis', 'an',                    // Subjuntivo Presente
        'iera', 'ieras', 'iera', 'iéramos', 'ierais', 'ieran',  //    Preterito imperfecto 1
        'iese', 'ieses', 'iese', 'iésemos', 'ieseis', 'iesen',  //    Preterito imperfecto 2
        'iere', 'ieres', 'iere', 'iéremos', 'iereis', 'ieren'   //    Futuro imperfecto
    ],
    // No point of reconstructing haber every time
    haber: [
        'habiendo', 'habido',
        'he', 'has', 'ha', 'hemos', 'habéis', 'han',                             // Indicativo Preterito Perfecto
        'había', 'habías', 'había', 'habíamos', 'habíais', 'habían',             //    Preterito Pluscuamperfecto
        'hube', 'hubiste', 'hubo', 'hubimos', 'hubisteis', 'hubieron',           //    Preterito Anterior
        'habré', 'habrás', 'habrá', 'habremos', 'habréis', 'habrán',             //    Futuro Perfecto
        'habría', 'habrías', 'habría', 'habríamos', 'habríais', 'habrían',       //    Condicional Compuesto
        'haya', 'hayas', 'haya', 'hayamos', 'hayáis', 'hayan',                   // Subjuntivo Preterito Perfecto
        'hubiera', 'hubieras', 'hubiera', 'hubiéramos', 'hubierais', 'hubieran', //    Preterito imperfecto 1
        'hubiese', 'hubieses', 'hubiese', 'hubiésemos', 'hubieseis', 'hubiesen', //    Preterito imperfecto 2
        'hubiere', 'hubieres', 'hubiere', 'hubiéremos', 'hubiereis', 'hubieren'  //    Futuro imerfecto
    ]
} 
