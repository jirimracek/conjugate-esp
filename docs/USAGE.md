# Usage details

Fri 04 Dec 2020 01:06:29 AM CET, version 2.3.0
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
  - *constructor(ortho: Orthography = '2010', highlight: HighlightTags = { start: '', end: '', del: '' })*
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
    - parameter *highlight* - optional, properties default to empty strings
      - purpose: highlight the differences between irregular conjugation and (what would have been) a regular one
        - the resulting conjugations will be annotated by the *start*, *end* and *del* strings (tags)
        - highlighting only applies to irregular verbs, it makes no sense to annotate regular conjugation with changes, there are none
        - the tags are optional, set one of them or all three, if at least one of them is non-empty string, it will happen and it will be noted in the info
        - Examples: *setHighlightTags({start:., end:-, del:\*})*, tener conjugation
          - if tener was regular, conjugated as temer, it would conjugate like yo teno, tú tenes, el tene
            - what you see below are the changes required to go from regular to irregular conjugation
              - teno &#8594; tengo        // insert g
              - tenes &#8594; tienes      // insert i
              <pre>
                "Indicativo": {
                  "Presente": [
                    "ten.g-o",      // the pair .- is the start & end of changes
                    "t.i-enes",
                    .
                    .
              </pre>
            - the *del* string will be inserted to indicate deletion (if this is desired)
              - again, if tener was regular , the conjugation below would be yo tení
              - tení &#8594; tuve        // insert uv, delete ní
              <pre>  
                    "PreteritoIndefinido": [
                      "t.uv-e.*-",   // note the indicated deletion .*- at the end
                        .
                        .
              </pre>
            - else if the *del* is not specified as in setHighlightTags (start: '.', end: '-')
              <pre>
                    "PreteritoIndefinido": [
                      "t.uv-e",   // note the missing deletion ".*-" at the end
              </pre>
            - there will be multiple changes when required, verb colgar
              <pre>
                  "Subjuntivo": {
                    "Presente": [
                      "c.ue-lg.u-e",
                      "c.ue-lg.u-es",
                      "c.ue-lg.u-e",
              </pre>
            - useful highlight example
              - *cng = new Conjugator('1999', { start: '\<mark>', end: '\</mark>', del: '\u2027' });*
              - *.css:  mark { background-color: inherit; color: red; }*
              - Results in (the **bold** would be rendered in red)
                - t**uv**e **‧**  
                  - note the 'dot' at the end of tuve, it's the delete mark &#x2027;
                - no te c**ue**lg**ue**s

  - *public setOrthography (ortho: Orthography): void* - possible values *'1999'|'2010'*
  - *public getOrthography (): Orthography*

  - *public setHighlightTags (tags: {start: string, end: string, del: string})): void*
  - *public getHighlightTags(): {start: string, end: string, del: string})*
  
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

  - *public getVerbListSync(): string[]* sync method, returns string []
  - *public getVerbList(): Promise<string[]>* async version, returns string []
  - *public getModelsSync(): string[]*  sync method, returns string []
  - *public getModels(): Promise<string[]>* async version, string []

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
      - When ***info.defective === false***, it means that **this particular ResultTable** does not contain defective conjugation, **it does NOT mean that the verb isn't defective**
      - Ditto for reflexives

- ResultTable properties

  ```json
   {
  "info": {
   "verb":       string,
   "model":      string,
   "region":     string,
   "reflexive":  boolean,
   "defective":  boolean,
   "ortho?":     string,
   "highlight?": {start: string, end: string, del: string}
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
   "verb": "hablar",
   "model": "hablar",
   "region": "castellano",
   "pronouns": [
    "yo",
    "tú",
    "él",
    "nosotros",
    "vosotros",
    "ellos"
   ],
   "reflexive": false,
   "defective": false
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
  - note the deletion in gerundio, has both info.ortho and info.highlight as they both apply to this verb
  - pronouns correspond to voseo

```json
[
 {
  "info": {
   "verb": "freír",
   "model": "reír",
   "region": "voseo",
   "pronouns": [
    "yo",
    "vos",
    "él",
    "nosotros",
    "ustedes",
    "ellos"
   ],
   "reflexive": false,
   "defective": false,
   "ortho": "2010",
   "highlight": {
    "start": "<mark>",
    "end": "</mark>",
    "del": "_"
   }
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

- it may be useful to take a look at the info object which holds some interesting facts about the associated ResultTable, for example whether the verb is reflexive or not, the conjugation model used, whether it's defective or now, etc.
- it is probably a good idea to iterate over the Result[]
- the ResultTable is not an array, it is a json formatted object, use it as such
