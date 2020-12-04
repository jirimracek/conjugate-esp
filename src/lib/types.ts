/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
export type ImpersonalKey = 'Impersonal';
export type IndicativoSubSimpleKey = 'Presente' | 'PreteritoImperfecto' | 'PreteritoIndefinido' | 'FuturoImperfecto' | 'CondicionalSimple';
export type SubjuntivoSubSimpleKey = 'Presente'| 'PreteritoImperfectoRa'| 'PreteritoImperfectoSe'| 'FuturoImperfecto';
export type PronominalKey = 'N' | 'P';     
export type Regions = 'castellano' | 'voseo' | 'canarias' | 'formal';
export type Orthography = '1999' | '2010';
export type Tags = { start: string, end: string, del: string };   // start, end tags, insert 'delete' to indicated deleted portion

export type ImperativoSubKey = 'Afirmativo' | 'Negativo';
export type ImpersonalSubKey = 'Infinitivo' | 'Gerundio' | 'Participio';
// Compuestos keys
export type IndicativoSubCompKey = 'PreteritoPerfecto' | 'PreteritoPluscuamperfecto'
    | 'PreteritoAnterior' | 'FuturoPerfecto' | 'CondicionalCompuesto';
export type SubjuntivoSubCompKey = 'PreteritoPerfecto' | 'PreteritoPluscuamperfectoRa'
    | 'PreteritoPluscuamperfectoSe' | 'FuturoPerfecto';
// Combined simple and compuestos
export type IndicativoSubKey = IndicativoSubSimpleKey | IndicativoSubCompKey;
export type SubjuntivoSubKey = SubjuntivoSubSimpleKey | SubjuntivoSubCompKey;

export type AnyModeKey = 'Impersonal' | 'Indicativo' | 'Subjuntivo' | 'Imperativo';

export type Info = {
    verb: string,
    model: string,
    region: string,
    pronouns: string[],
    reflexive: boolean,
    defective: boolean,
    ortho?: string,
    highlight?: Tags
};

/*  The M attribute ([M]onosyllable) and Orthography cooperation
    the M flag is defined in definitions.json and its meanings in the engine are:
      M=true means use the 2010 orthography (no accent)
      M=false means use 1999

      Orthography monosyllable explanation, 3rd person indicative indefinite of freír is used as an example here 
        In pre 1999 orthography, the accepted version is frió
        In 1999 the new orthography rules the accent to be dropped but both frió and frio are accepted as correct
        In 2010 the new orthography rules the pre 1999 version of frió no longer acceptable, it is an error

      M undefined means let conjugator do its default thing for the given model, this means
        return 2010 version if one is available 
        return 1999 version if there are no differences, depends on whether we're dealing with a monosyllable
        - see table below

    Example configurations in definitions.json
    "sonreír": { "N": "reír", 
                 "P": "reír" }
        As simple as it gets, both nonprominal as well as pronominal use model reír 
        No attributes, M is undefined

    "chiar": { "N": [ { "vaciar": { "M": "true" } }, 
                      { "vaciar": { "M": "false" } } ] }
        A bit more complex, nonpronominal version only (there is no "chiarse") but we have 2 versions, both of
          which use vaciar as a model.  
          The first version M==='true'   which means use 2010 restrictions (chio) 
          The second version M==='false' which means use pre-2010 version (chió)

    "freír": { "N": [ { "reír": { "M": "true" } },
                      { "reír": { "M": "true", "PR": "eíd/it" } },
                      { "reír": { "M": "false" } },
                      { "reír": { "M": "false", "PR": "eíd/it" } } ],
               "P": [ { "reír": { "M": "true" } },
                      { "reír": { "M": "true", "PR": "eíd/it" } },
                      { "reír": { "M": "false" } },
                      { "reír": { "M": "false", "PR": "eíd/it" } } ] }
    Both N and P use model reír, note the M attributes
    PR means Participio Replace - replace "eíd" substring in (what would have been a regular) participio with "it"

    The above works in conjuction with the conjugate() method ortho parameter (defaults to '2010')
    This is what happens with the above configs and the ortho parameter in conjugate()
    ----------------------------------------------------------------------------------------------------------------------
    | ortho | M attr        | conjugate() action  |  freír  | sonreír |  chiar | info array {'ortho': }   |
    ----------------------------------------------------------------------------------------------------------------------
    | 2010  | M = true      |     use model       |  frio   |    -    |  chio  |    2010
    | 2010  | M = false     |     drop model      |   -     |    -    |    -   |      -
    | 2010  | M = undefined |     use model       |   -     |  sonrió |    -   |      -
    -----------------------------------------------------------------------------------------------------------------------
    | 1999  | M = true      |     use model       |  frio   |    -    |  chio  |    2010
    | 1999  | M = false     |     use model       |  frió   |    -    |  chió  |    1999
    | 1999  | M = undefined |     use model       |   -     |  sonrió |   -    |      -
    ----------------------------------------------------------------------------------------------------------------------

    The truth expression for inclusion of 'ortho' in info array:
      if M is defined 
        if M === true then
           include info { 'ortho': '2010' } 
        else 
           include info { 'ortho': '1999' }
      else 
        dont include 'ortho' in info array

    The truth expressions for whether we use the model or not:
      if ortho is 2010 && M is defined && is false then skip this model

      if (ortho === '2010' && attributes['M'] !== 'undefined' && attributes['M'] === 'false') {
          console.log(`Skip ${verb}, ${name}, M=${attributes['M']}`);
      } else {
          modelTemplates.push([name as string, pronominalKey, region, attributes]);
      }

      or we can say 
      if ortho isn't 2010 || M is undefined || M is defined !false, then use the model
      if (ortho !== '2010' || attributes['M'] === 'undefined' || attributes['M'] !== 'false') {
        modelTemplates.push([name as string, pronominalKey, region, attributes]);
      } else {
        console.log(`Skip ${verb}, ${name}, M=${attributes['M']}`);
      }

      So, basically with the above configurations of freír, sonreír, chiar we get these results.  
      Note that the resulting number of arrays is per region.  
      So in reality there are 16 arrays of all possible conjugations of freír and another 16 for freírse

     * freír config is a combination of 4 model configurations, uses model reír with combinations of 
     *    1999 ortho     | 2010 ortho
     *    participio ído | participio ito
     ----------------------------------------------------------------------------------------------------------------------
     | conjugate (parameters)   |  Result of calling conjugate() [shown participio,3rd person indicativo pret. indefinido] 
     ----------------------------------------------------------------------------------------------------------------------
     | (freír, ortho='2010')    | [[freído,frio],[frito,frio]]  - 2010 ortho, frio, both participios, 
     |                          |      array of 2 arrays, each array header info includes 'ortho'
     ----------------------------------------------------------------------------------------------------------------------
     | (freír)                  | [[freído,frio],[frito,frio]]  - default param, 2010, frio, both participios, 
     |                          |      array of 2 arrays, each array header info includes 'ortho'
     ----------------------------------------------------------------------------------------------------------------------
     | (freír, ortho='1999')    | [[freído,frio],[frito,frio],[freído,frió],[frito,frió]]  - 1999 ortho, both frio and frió, 
     |                          |     both participios, array of 4 arrays - each array header info includes 'ortho'
     ----------------------------------------------------------------------------------------------------------------------

     ----------------------------------------------------------------------------------------------------------------------
     * sonreír config has no M flag (M is undefined), there are no differences between pre and post 2010, so
     ----------------------------------------------------------------------------------------------------------------------
     | (sonreír, ortho='2010')  | [[sonreído,sonrió]]           - 2010 ortho - sonrió, 
     |                          |    array of 1 array, header info doesn't include 'ortho'
     ----------------------------------------------------------------------------------------------------------------------
     | (sonreír)                | [[sonreído,sonrió]]           - default param, 2010, 
     |                          |   array of 1 array, header info doesn't include 'ortho'
     ----------------------------------------------------------------------------------------------------------------------
     | (sonreír, ortho='1999')  | [[sonreído,sonrió]]           - 1999 makes no difference, there is no 2010 monosyllable adjustment, 
     |                          |    array of 1 array, header info doesn't include 'ortho'
     ----------------------------------------------------------------------------------------------------------------------

     ----------------------------------------------------------------------------------------------------------------------
     * chiar config has 2 configurations, model vaciar, one with M='true', the other with M='false'
     ----------------------------------------------------------------------------------------------------------------------
     | (chiar, ortho='2010')    | [[chiado,chio]]               - 2010 ortho, chio 
     |                          |   array of 1 array, header info includes 'ortho'
     ----------------------------------------------------------------------------------------------------------------------
     | (chiar)                  | [[chiado,chio]]               - default param, 2010, chio, 
     |                          |   array of 1 array, header info includes 'ortho'
     ----------------------------------------------------------------------------------------------------------------------
     | (chiar, ortho='1999')    | [[chiado,chio],[chiado,chió]] - 1999 ortho, both chio and chió, 
     |                          |   array of 2 arrays, each header info includes 'ortho'
     ----------------------------------------------------------------------------------------------------------------------
*/




