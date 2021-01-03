# Usage details

Sun 03 Jan 2021 03:27:48 PM CET, version 2.3.5
____

## Installation

- clone / download gitHub repository
- npm i @jirimracek/conjugate-esp

### TypeScript

```typescript
    // Uncomment one of the following 2 lines based on install type
    // import { Conjugator } from  <path to install>              // locally installed from repo
    // import { Conjugator } from  '@jirimracek/conjugate-esp';   // npm installed
    //
    const cng = new Conjugator();
    cng.setOrthography('2010');                                   // defaults to '2010'
    // cng.setOrthography('1999');                                // use 1999 orthography rules

    // sync, formal, returns Result[] | string
    const table = cng.conjugateSync('adscribir', 'formal');
    console.log(JSON.stringify(table, null, 1));

    // async, voseo, returns Promise<Result[] | string>
    cng.conjugate('soler', 'voseo')
      .then(table => console.log(JSON.stringify(table, null, 1))) // process result
      .catch(error => console.error(error));                      // process errors
```

### JavaScript

```javascript
    // Uncomment one of the following 2 lines based on install type
    // const CNG = require('<path to install>/dist');       // localy installed from repo
    // const CNG = require("@jirimracek/conjugate-esp");    // npm installed
    const cng = new CNG.Conjugator();
    // cng.setOrthography('2010');                          // defaults to '2010'
    cng.setOrthography('1999');                             // use 1999 orthography rules

    // sync, formal, returns Result[] | string
    const table = cng.conjugateSync('hablar', 'canarias');
    console.log(JSON.stringify(table, null, 1));

    // async, castellano, returns Promise<Result[] | string>
    cng.conjugate('freír')
      .then(table => console.log(JSON.stringify(table, null, 1))) // process result
      .catch(error => console.error(error));                      // process failure
```

____

### Public interfaces

- **Conjugator**
  - *constructor(ortho: Orthography = '2010', highlightMarks: HighlightMarks = { start: '\<mark>', end: '\</mark>', del: '\u2027' })*
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
    - parameter *highlightMarks* - optional, defaults to  *{ start: '\<mark>', end: '\</mark>', del: '\u2027' }*
      - purpose: highlight differences between irregular conjugation and (what would have been) a regular one
        - the resulting conjugations will be annotated by the *start*, *end* and *del* strings (marks)
        - highlighting only applies to irregular verbs, it makes no sense to annotate regular conjugation with changes, there are none
        - all marks must be defined (all 3 of start, end and del)
        - highlighting can be on (full words), off, or partial (only the differences)
        - highlighting is **off** by default, turn it on / off / partial by
          - *useHighlight(use = null)*  // true | false | null
        - Examples:
          - constructor with no parameters (*default marks { start: '\<mark>', end: '\</mark>', del: '\u2027' }*)
          - if tener was regular, ***conjugated as temer***, it would conjugate as ***yo teno, tú tenes, él tene**
          - changes required to go from regular to irregular conjugation
            <pre>
            "Indicativo": {
              "Presente": [
                "ten<mark>g</mark>o",       // insert g
                "t<mark>i</mark>enes",      // insert i
                "t<mark>i</mark>ene",       // insert i
            </pre>
          - the *del* string will be inserted to indicate deletion (if this is desired)
            - again, ***if tener was regular***, the conjugation (1st person pretérito indefinido) would be ***yo tení***
            - tení &#8594; tuve        // insert uv, delete ní
            <pre>
              "PreteritoIndefinido": [
                "t<mark>uv</mark>e<mark>‧</mark>",   // deletion character '\u2027' (<mark>‧</mark>) at the end
            </pre>
          - you'll see multiple marks inserted when required, for example verb *colgar*
            <pre>
            "Subjuntivo": {
              "Presente": [
                "c<mark>ue</mark>lg<mark>u</mark>e",
                "c<mark>ue</mark>lg<mark>u</mark>es",
                "c<mark>ue</mark>lg<mark>u</mark>e",
            </pre>
          - use blank for *del* in the constructor call to ignore deleted string portions
            - *{start:'\<mark>', end: '\</mark>', del: ''}*
            - tener
            <pre>
            "Indicativo": {
              "Presente": [
              "PreteritoIndefinido": [
                "t<mark>uv</mark>e",                // no deletion character at the end
            </pre>
          - use *.css:  mark { background-color: inherit; color: red; }* to do your html highlighting

  - *public useHighlight(use = null): void* - turn on/off highlighting
    - parameter *use* can be *true|false|null* (note that highlighting is **off** by default at startup)
      - *true* - highlight whole word, ex.: <mark>tuve</mark>
      - *false* - no highlight, ex: tuve
      - *null* - highlight differences only, ex.: t<mark>uv</mark>e

  - *public setOrthography (ortho: Orthography): void* - possible values *'1999'|'2010'*
  - *public conjugateSync(verb: string, region: Regions = 'castellano'): Result[] | string*
    - sync method, returns a Result[] of conjugations or ErrorType object

  - *public conjugate(verb: string, region: Regions = 'castellano'): Promise<Result[] | string>*
    - async method, returns a Promise<Result[] of conjugations or error string>
      - parameter *verb* - required
        - purpose: the verb to conjugate
        - ***new in 2.3.x*** exact verb form is required, either pronominal (reflexive) or nonpronominal (hablar or hablarse, ir or irse)
        - Example (***new in 2.3.x***):
          - *conjugate('tomar')* returns conjugation of *tomar*
          - *conjugate('tomarse')* returns conjugation of *tomarse*
      - parameter *region* - optional, one of 'castellano' | 'voseo' | 'canarias' | 'formal'
        - see below for more on regional varieties

  - *public getVerbListSync(): string[]*
  - *public getVerbList(): Promise<string[]>* async version
  - *public getDefectiveVerbListSync(pure = false): string[]*
  - *public getDefectiveVerbList(pure = false): Promise<string[]>* async version
    - get a list of defective verbs
      - if pure === false, return string[] of all verbs which exist in defective variety (haber, estar, ...)
      - if pure === true, in addition return list of verbes that only exist as defectives (abarse)
  - *getOrthoVerbList(): string[]*
  - *getOrthoVerbListSync(): string[]*
    - get list of verbs that have been affected by 1999/2010 orthographical changes
  - *public getModelsSync(): string[]*
  - *public getModels(): Promise<string[]>* async version
  - *public getVersion(): string*

____

### Regional varieties - region parameter of conjugate() methods

| Region | 2nd person singular | 2nd person plural|
|-------|:---------------------:|:-:|
| castellano | tú | vosotros |
| voseo | vos | ustedes |
| canarias | tú | ustedes |
| formal | usted | ustedes |

____

### Return values

- conjugate() / conjugateSync() methods will return *Result[] | string*
  - if string is returned, it's an error message
  - Result is defined as *type Result = { info: Info, conjugation: ResultTable }*
    - NOTE that each ResultTable has corresponding Info table

- ResultTable properties

  ```json
   {
  "info": {
   "model":      string,
   "region":     string,
   "defective?":  boolean,
   "ortho?":     string,
  },
  "conjugation": {
   "Impersonal": {
    "Infinitivo": string,
    "Gerundio":   string,
    "Participio": string,
   },
   "Indicativo": {
    "Presente":                  string[6],
    "PreteritoImperfecto":       string[6],
    "PreteritoIndefinido":       string[6],
    "FuturoImperfecto":          string[6],
    "CondicionalSimple":         string[6],
    "PreteritoPerfecto":         string[6],
    "PreteritoPluscuamperfecto": string[6],
    "PreteritoAnterior":         string[6],
    "FuturoPerfecto":            string[6],
    "CondicionalCompuesto":      string[6],
   },
   "Subjuntivo": {
    "Presente":                    string[6],
    "PreteritoImperfectoRa":       string[6],
    "PreteritoImperfectoSe":       string[6],
    "FuturoImperfecto":            string[6],
    "PreteritoPerfecto":           string[6],
    "PreteritoPluscuamperfectoRa": string[6],
    "PreteritoPluscuamperfectoSe": string[6],
    "FuturoPerfecto":              string[6],
   },
   "Imperativo": {
    "Afirmativo": [ "-", string, "-", string, string, "-" ],
    "Negativo":   [ "-", string, "-", string, string, "-" ]
   }
  }

  ```

____

### Example output.  NOTE that you'll get an array of these objects

- ***hablar, castellano, 2010, start:\<mark>, end:\</mark>, del:_***
  - Note that the info (below, the example) has no ortho nor highlight properties - neither applies to hablar, there are no orthographical changes, there is nothing to highlight
  - pronouns correspond to castellano

```json
[
 {
  "info": {
   "model": "hablar",
   "region": "castellano"
  },
  "conjugation": {
   "Impersonal": {
    "Infinitivo": "hablar",
    "Gerundio": "hablando",
    "Participio": "hablado"
   },
   "Indicativo": {
    "Presente": [
     "hablo",
     "hablas",
     "habla",
     "hablamos",
     "habláis",
     "hablan"
    ],
    "PreteritoImperfecto": [
     "hablaba",
     "hablabas",
     .
     .
     .
    ]
   },
   "Imperativo": {
    "Afirmativo": [
     "-",
     "habla",
     "-",
     "hablemos",
     "hablad",
     "-"
    ],
    "Negativo": [
     "-",
     "no hables",
     "-",
     "no hablemos",
     "no habléis",
     "-"
    ]
   }
  }
 },
  {
    "info": ...
  },
  {
    "conjugation": ...
  },
  {
  .
  .
  .
 }
]

```

- ***freír, voseo, 2010, start:\<mark>, end:\</mark>, del:_***
  - note the deletion in gerundio, has info.ortho as it applies to this verb
  - pronouns that you'll need to use (should you desire to do so) correspond to voseo

```json
[
 {
  "info": {
   "model": "reír",
   "region": "voseo",
   "ortho": "2010"
  },
  "conjugation": {
   "Impersonal": {
    "Infinitivo": "freír",
    "Gerundio": "fr<mark>_</mark>iendo",
    "Participio": "fre<mark>í</mark>do"
   },
   "Indicativo": {
    "Presente": [
     "fr<mark>í</mark>o",
     "freís",
     "fr<mark>í</mark>e",
     "fre<mark>í</mark>mos",
     "fr<mark>í</mark>en",
     "fr<mark>í</mark>en"
    ],
    "PreteritoImperfecto": [
     "freía",
     .
     .
     .
     "hubieren fre<mark>í</mark>do"
    ]
   },
   "Imperativo": {
    "Afirmativo": [
     "-",
     "freí",
     "-",
     "fr<mark>i</mark>amos",
     "fr<mark>í</mark>an",
     "-"
    ],
    "Negativo": [
     "-",
     "no fr<mark>í</mark>as",
     "-",
     "no fr<mark>i</mark>amos",
     "no fr<mark>í</mark>an",
     "-"
    ]
   }
  }
 },

```

- as noted above the conjugate method will return one object (Result[]), which may hold multiple ResultTable objects

____

### Processing results

- it may be useful to take a look at the info object which holds some interesting facts about the associated ResultTable, for example the conjugation model used, whether it's defective or not, etc.
- it is probably a good idea to iterate over the Result[]
- the ResultTable is not an array, it is a json formatted object, use it as such
- non-defective conjugations are always listed before defective ones (in the Result[])
