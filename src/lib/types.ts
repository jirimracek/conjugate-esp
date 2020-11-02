/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
export type IndicativoSubSimpleKey = 'Presente' | 'PreteritoImperfecto' | 'PreteritoIndefinido' | 'FuturoImperfecto' | 'CondicionalSimple';
export type SubjuntivoSubSimpleKey = 'Presente'| 'PreteritoImperfectoRa'| 'PreteritoImperfectoSe'| 'FuturoImperfecto';
export type PronominalKey = 'N' | 'P';     
export type Regions = 'castellano' | 'voseo' | 'canarias' | 'formal';
export type Orthography = 'pre2010' | '2010';
export type Highlight = true | false;

/*  The M (Monosyllable) and Orthography cooperation
*    the M flag is defined in definitions.json and its meanings in the engine are:
*      M=true means use the 2010 orthography (no accent)
*      M=false means use pre-2010
*      M undefined means let conjugator do its default thing for the given model 
*         this means return 2010 version if one is available, 
*           otherwise return pre2010 - depends on whether we're dealing with a monosyllable or not
*
*      Example configurations in definitions.json
*    "sonreír": { "N": "reír", "P": "reír" }
*        As simple as it gets, both nonprominal as well as pronominal use model reír, no attributes, M is undefined
*
*    "chiar": { "N": [ "vaciar", { "vaciar": { "M": "true" } } ] }
*        A bit more complex, nonpronominal version only (there is no "chiarse") but we have 2 versions, both of
*          which use vaciar as a model.  The second version has

*    "freír": {
*        "N": [ { "reír": { "M": "true" } },
*               { "reír": { "M": "true", "PR": "eíd/it" } },
*               { "reír": { "M": "false" } },
*               { "reír": { "M": "false", "PR": "eíd/it" } } ],
*        "P": [ { "reír": { "M": "true" } },
*               { "reír": { "M": "true", "PR": "eíd/it" } },
*               { "reír": { "M": "false" } },
*               { "reír": { "M": "false", "PR": "eíd/it" } } ]
*    },
*       Both N and P use model reír, note the M attributes
*       PR means Participio Replace - replace "eíd" substring in (what would have been a regular) participio with "it"
*
*      This works in conjuction with the conjugate() method ortho parameter (defaults to '2000')
*      -----------------------------------------------------------
*      | ortho    | M attr    | conjugate()  |  freír  | sonreír |
*      -----------------------------------------------------------
*      | 2000     | true      | use model    |  frio   |   N/A   |
*      | 2000     | false     | drop model   |   N/A   |   N/A   |
*      | 2000     | undefined | use model    |   N/A   |  sonrió |  
*      -----------------------------------------------------------
*      | pre2000  | true      | use model    |  frio   |   N/A   |
*      | pre2000  | false     | use model    |  frió   |   N/A   |
*      | pre2000  | undefined | use model    |   N/A   |  sonrió | 
*      -----------------------------------------------------------
*
*      
*      So, basically with the above config of
*         freír, reír:M=true, reír:M=true:PR=eíd/it, reír:M=false, reír:M=false:PR=eíd/it
*         sonreír, reír
*         chiar, vaciar:M=true, vaciar:M=false
*     |   conjugate (...)            |  Result [participio,3rd person indicativo pret. indefinido] 
*     -----------------------------------------------------------
*     | (freír, ortho = '2000')      | [[freído,frio],[frito,frio]]
*     | (freír)                      | [[freído,frio],[frito,frio]]
*     | (freír, ortho = 'pre2000')   | [[freído,frio],[frito,frio],[freído,frió],[frito,frió]]
*
*     | (sonreír, ortho = '2000')    | [[sonreído,frió]]
*     | (sonreír)                    | [[sonreído,frió]]
*     | (sonreír, ortho = 'pre2000') | [[sonreído,frió]]
*
*     | (chiar, ortho = '2000')      | [[chiado,chio]]
*     | (chiar)                      | [[chiado,chio]]
*     | (chiar, ortho = 'pre2000')   | [[chiado,chio],[chiado,chió]]
*/




