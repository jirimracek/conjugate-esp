# Basic usage details

- updated on Thu 05 Nov 2020 07:38:28 PM CET, version 2.1.1
- Simple usage

## Simple installation and use

### Installation

- clone / download gitHub repository
- npm i @jirimracek/conjugate-esp

### TypeScript use

```typescript
    // Uncomment one of the following 2 lines based on install type
    // import { Conjugator } from  <path to install>                 // locally installed from repository
    // import { Conjugator } from  '@jirimracek/conjugate-esp';      // npm installed
    //
    const cng = new Conjugator();
    cng.setOrthography('2010');                                   // defaults to '2010'
    // cng.setOrthography('1999');                                // use 1999 orthography rules
    /*
    * main entry points (see below for more details, parameters, return types)
    * sync:  conjugateSync()
    * async: conjugate()
    */
    const table = cng.conjugateSync('adscribir', 'formal');       // sync, formal, returns Result[] | ErrorType
    console.log(JSON.stringify(table, null, 1));
    cng.conjugate('soler', 'voseo')                               // async, voseo, returns Promise<Result[] | ErrorType>
      .then(table => console.log(JSON.stringify(table, null, 1))) // process correct result
      .catch(error => console.error(error));                      // catch error
```

### JavaScript use

```javascript
    // Uncomment one of the following 2 lines based on install type
    // const CNG = require('<path to install>/dist');       // localy installed from repository
    // const CNG = require("@jirimracek/conjugate-esp");    // npm installed
    const cng = new CNG.Conjugator();
    // ... same code as TypeScript above
```

____

## Public interfaces

- **Conjugator**
  - *constructor(ortho: Orthography = '2010', highlight: Highlight = false)*
    - parameter *ortho* - possible values '1999' | '2010', defaults to '2010'
      - purpose: determine the result based on different orthography rules
        - 2010 - use strict 2010 rules
        - 1999 - use 1999 - 2010 rules
        - more info <https://www.rae.es/espanol-al-dia/palabras-como-guion-truhan-fie-liais-etc-se-escriben-sin-tilde>
      - short explanation, conjugation of 3rd person singular, indicativo pretérito indefinido, reír
        - before year 1999 ***rió*** is the accepted version
        - years 1999 - 2010 both ***rió*** and ***rio*** are tolerated
        - year 2010 and after, it is no longer acceptable to write ***rió***, the new correct written form is ***rio*** with *no accent*
      - affected verbs - NOTE: the *ortho* parameter **has no effect on any other verb**
        - model actuar
          - puar, ruar
        - model vaciar
          - chiar, ciar, criar, fiar, guiar, liar, miar, piar, triar
        - model huir
          - fluir, fruir, gruir, huir, luir, muir
        - model reír
          - freír, reír
      - effect on data received from Conjugator::conjugate() / Conjugator::conjugateSync()
        - *Result::info* object will contain an optional field info.*ortho*, possible values *'2010'|'1999'*
        - *Result::conjugation* object will contain
          - with *constructor(ortho: Orthography = '1999')* both pre 2010 and post 2010 conjugations (*rio* and *rió*) arrays are included
          - with *constructor(ortho: Orthography = '2010')* only post 2010 conjugation (*rio*)
    - parameter *highlight* - possible values true | false, defaults to false
      - purpose: highlight the differences between irregular conjugation and (what would have been) a regular one
        - ***NOTE*** not implemented yet, has no effect

  - *public setOrthography (ortho: Orthography): void* - possible values *'1999'|'2010'*
  - *public getOrthography (): Orthography*

  - *public setHighlight (highlight: Highlight): void* - possible values *true | false*, ***NOTE*** not implemented yet, has no effect
  - *public getHighlight(): Highlight*
  
  - *public conjugateSync(verb: string, region: Regions = 'castellano'): Result[] | ErrorType*
    - sync method, returns a Result[] of conjugations or ErrorType object

  - *public conjugate(verb: string, region: Regions = 'castellano'): Promise<Result[] | ErrorType>*
    - async method, returns a Promise<Result[] of conjugations or ErrorType>
      - parameter *verb* - required
        - purpose: the verb to conjugate
        - ***NOTE*** only the non-pronominal verb form is accepted
          - Example:
            - *conjugate('tomar')* returns conjugations for both *tomar* and *tomarse*
            - _conjugate('tomar***se***')_ returns ***error*** (unknown verb)
          - Admittedly this may have been an unfortunate design decision and it may change in the future
      - parameter *region* - optional, one of 'castellano' | 'voseo' | 'canarias' | 'formal'
        - see below for more on regional varieties

  - *public getVerbListSync(): string[]* sync method, returns string [] of all known verbs, empty on error
  - *public getVerbList(): Promise<string[]>* async version, string [] on fulfilled, empty on rejected
  - *public getModelsSync(): string[]*  sync method, returns string [] of known models, empty on error
  - *public getModels(): Promise<string[]>* async version, string [] on fullfilled, will be empty on rejected

____

### Regional varieties - region parameter of conjugate() methods

| Region | 2nd person singular | 2nd person plural|
|-------|:---------------------:|:-:|
| castellano | tú | vosotros |
| voseo | vos | vosotros |
| canarias | tú | ustedes |
| formal | usted | ustedes |

____

## Result values

- conjugate() methods will return either a *Result[]* or *ErrorType*
  - ErrorType is defined as *type ErrorType = { ERROR: { message: string } }*
  - Result is defined as *type Result = { info: Info, conjugation: ResultTable }*
  - see conjugator.ts for error messages, definitions of *ErrorType* and *Result*
  - see basemodel.ts for definition of *Info* and *ResultTable*
  - the structure of ResultTable is as follows
  - Impersonal
    - Infinitivo, Gerundio, Participio
  - Indicativo
    - Simple
      - Presente
      - Pretérito Imperfecto
      - Pretérito Indefinido
      - Futuro Imperfecto
      - Condicional Simple
    - Compuesto
      - Pretérito Perfecto
      - Pretérito Pluscuamperfecto
      - Pretérito Anterior
      - Futuro Perfecto
      - Condicional Compuesto
  - Subjuntivo
    - Simple
      - Presente
      - Pretérito Imperfecto Ra
      - Pretérito Imperfecto Se
      - Futuro Imperfecto
    - Compuesto
      - Pretérito Perfecto
      - Pretérito Pluscuamperfecto Ra
      - Pretérito Pluscuamperfecto Se
      - Futuro Perfecto
  - Imperativo
    - Afirmativo
    - Negativo

- as noted above the conjugate method will return one object (Result[]), which will normally hold multiple ResultTable objects

### Processing the resulting data

- it may be useful to take a look at the info object which holds some interesting facts about the associated ResultTable, for example whether the verb is pronominal or not, the conjugation model used, whether it's defective or now, etc.
- it is probably a good idea to iterate over the Result[]
- the ResultTable is not an array, it is a json formatted object, use it as such
