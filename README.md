# conjugate-esp

[![Build Status](https://travis-ci.org/jirimracek/conjugate-esp.svg?branch=master)](https://travis-ci.org/jirimracek/conjugate-esp)
[![Coverage Status](https://coveralls.io/repos/github/jirimracek/conjugate-esp/badge.svg?branch=master)](https://coveralls.io/github/jirimracek/conjugate-esp?branch=master)
![GitHub](https://img.shields.io/github/license/jirimracek/conjugate-esp)

Spanish verb conjugator, uses templates, pattern matching & logic to conjugate verbs in any of the regional varieties of castellano, voseo, formal, canarias

- Project goals: correct, detailed, complete, fast & small (yes, you can have it all)
- 12815 known verbs, 99 tested models
- castellano, voseo, formal, canarias varieties
- complicated cases
  - defectives
  - multiple (dual & triple) conjugations
  - dual participios
  - orthographical changes

____

- Current version 1.1.2 - last version that includes verbs deemed unused or unknown by the RAE
- Updated on Fri 05 Jun 2020 02:20:07 PM CEST

____

- Many thanks to [Estudio Sampere Salamanca, España](http://www.sampere.com/learn-spanish/spanish-courses-salamanca.html "Sampere Salamanca")
  - ***Esther González, Ester García, María Ballesteros*** you're my heroes

____

## Simple usage

- clone repository / download or
- npm i @jirimracek/conjugate-esp

```typescript
  TypeScript
    // one of
    import { Conjugator } from  <path to install>                 // local install
    import { Conjugator } from  '@jirimracek/conjugate-esp';      // npm installed
    const cng = new Conjugator();

    const table = cng.conjugateSync('adscribir', 'formal');       // sync, formal (usted, ustedes)
    console.log(JSON.stringify(table, null, 1));
    cng.conjugate('soler', 'voseo')                               // async (promise), voseo
      .then(table => console.log(JSON.stringify(table, null, 1))) // returns Result[]
      .catch(error => console.error(error));                      // should not error
```

```javascript
  JavaScript
    // one of:
    const CNG = require('<path to install>/dist');       // local install
    const CNG = require("@jirimracek/conjugate-esp");    // npm installed
    const cng = new CNG.Conjugator();
    // ... same code as above
```

### Returns array of tables or error, either as JSON

- Impersonal
  - Infinitivo, Gerundio, Participio
- Indicativo
  - Simple
    - Presente, Pretérito Imperfecto, Pretérito Indefinido, Futuro Imperfecto, Condicional Simple
  - Compuesto
    - Pretérito Perfecto, Pretérito Pluscuamperfecto, Pretérito Anterior, Futuro Perfecto, Condicional Compuesto
- Subjuntivo
  - Simple
    - Presente, Pretérito Imperfecto Ra, Pretérito Imperfecto Se, Futuro Imperfecto
  - Compuesto
    - Pretérito Perfecto, Pretérito Pluscuamperfecto Ra, Pretérito Pluscuamperfecto Se, Futuro Perfecto
- Imperativo
  - Afirmativo
  - Negativo

____

### Implemented and tested conjugation models

<table>
<tr><td>

| AR            | |
|---------------|:-----------:|
| **hablar** | &#x2714; |
| ***actuar*** | &#x2714; |
| ***agorar*** | &#x2714; |
| ***aguar*** | &#x2714; |
| ***ahincar*** | &#x2714; |
| ***aislar*** | &#x2714; |
| ***andar*** | &#x2714; |
| ***aullar*** | &#x2714; |
| ***avergonzar*** | &#x2714; |
| ***cabrahigar*** | &#x2714; |
| ***cazar*** | &#x2714; |
| ***colgar*** | &#x2714; |
| ***contar*** | &#x2714; |
| ***dar*** | &#x2714; |
| ***desdar*** | &#x2714; |
| ***desosar*** | &#x2714; |
| ***empezar*** | &#x2714; |
| ***enraizar*** | &#x2714; |
| ***errar*** | &#x2714; |
| ***estar*** | &#x2714; |
| ***forzar*** | &#x2714; |
| ***jugar*** | &#x2714; |
| ***pagar*** | &#x2714; |
| ***pensar*** | &#x2714; |
| ***regar*** | &#x2714; |
| ***sacar*** | &#x2714; |
| ***vaciar*** | &#x2714; |
| ***volcar*** | &#x2714; |
|&#x2796;||
|&#x2796;||
|&#x2796;||
|&#x2796;||
|&#x2796;||
|&#x2796;||
|&#x2796;||
|&#x2796;||
|&#x2796;||
|&#x2796;||
|&#x2796;||
</td><td>

| ER            | |
|---------------|:-----------:|
| **temer** | &#x2714; |
| ***caber*** | &#x2714; |
| ***caer*** | &#x2714; |
| ***coger*** | &#x2714; |
| ***haber*** | &#x2714; |
| ***hacer*** | &#x2714; |
| ***leer*** | &#x2714; |
| ***mover*** | &#x2714; |
| ***nacer*** | &#x2714; |
| ***oler*** | &#x2714; |
| ***placer*** | &#x2714; |
| ***poder*** | &#x2714; |
| ***poner*** | &#x2714; |
| ***prever*** | &#x2714; |
| ***querer*** | &#x2714; |
| ***raer*** | &#x2714; |
| ***rehacer*** | &#x2714; |
| ***responder*** | &#x2714; |
| ***roer*** | &#x2714; |
| ***romper*** | &#x2714; |
| ***saber*** | &#x2714; |
| ***ser*** | &#x2714; |
| ***tañer*** | &#x2714; |
| ***tender*** | &#x2714; |
| ***tener*** | &#x2714; |
| ***torcer*** | &#x2714; |
| ***traer*** | &#x2714; |
| ***valer*** | &#x2714; |
| ***vencer*** | &#x2714; |
| ***ver*** | &#x2714; |
| ***volver*** | &#x2714; |
| ***yacer*** | &#x2714; |
|&#x2796;||
|&#x2796;||
|&#x2796;||
|&#x2796;||
|&#x2796;||
|&#x2796;||
|&#x2796;||
</td><td>

| IR            | |
|---------------|:-----------:|
| **partir** | &#x2714; |
| ***abrir*** | &#x2714; |
| ***adquirir*** | &#x2714; |
| ***argüir*** | &#x2714; |
| ***asir*** | &#x2714; |
| ***balbucir*** | &#x2714; |
| ***bendecir*** | &#x2714; |
| ***ceñir*** | &#x2714; |
| ***colegir*** | &#x2714; |
| ***conducir*** | &#x2714; |
| ***decir*** | &#x2714; |
| ***delinquir*** | &#x2714; |
| ***discernir*** | &#x2714; |
| ***distinguir*** | &#x2714; |
| ***dormir*** | &#x2714; |
| ***embaír*** | &#x2714; |
| ***erguir*** | &#x2714; |
| ***escribir*** | &#x2714; |
| ***huir*** | &#x2714; |
| ***imprimir*** | &#x2714; |
| ***ir*** | &#x2714; |
| ***lucir*** | &#x2714; |
| ***oír*** | &#x2714; |
| ***plañir*** | &#x2714; |
| ***podrir*** | &#x2714; |
| ***prohibir*** | &#x2714; |
| ***pudrir*** | &#x2714; |
| ***rehenchir*** | &#x2714; |
| ***rehinchir*** | &#x2714; |
| ***rehuir*** | &#x2714; |
| ***reunir*** | &#x2714; |
| ***reír*** | &#x2714; |
| ***salir*** | &#x2714; |
| ***seguir*** | &#x2714; |
| ***sentir*** | &#x2714; |
| ***servir*** | &#x2714; |
| ***surgir*** | &#x2714; |
| ***venir*** | &#x2714; |
| ***zurcir*** | &#x2714; |
</td></tr> </table>

____

## Resources

- [Estudio Sampere Salamanca](http://www.sampere.com/learn-spanish/spanish-courses-salamanca.html "Sampere Salamanca") - great place to study Spanish

- [RAE main page](https://www.rae.es "RAE") and their (paid subscription, much recommended) [RAE Enclave](https://enclave.rae.es "Enclave")

- [Rodríguez-Rodríguez, G; Carreras-Riudavets, F; Hernández-Figueroa, Z; (2009). Conjugación de verbos en español - Conjugador TIP](https://tulengua.es "Conjugador TIP") - excellent book, about the most accurate and complete web conjugator I found

- [Diccionario panhispánico de dudas](https://www.casadellibro.com/libro-diccionario-panhispanico-de-dudas-2-ed/9788429406238/1051481 "Casa del libro" )

- [Vadémecum del verbo español, Pedro Gomis Blanco, Laura Segura Calvo](https://www.amazon.es/Vad%C3%A9mecum-verbo-espa%C3%B1ol-Pedro-Blanco/dp/8497783875 "Amazon.es") - good technical reference on verb usage, but has many errors (tables, verb to model index), use with extreme caution

- ... and many others
