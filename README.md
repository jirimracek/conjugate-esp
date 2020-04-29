# conjugate-esp

[![Build Status](https://travis-ci.org/jirimracek/conjugate-esp.svg?branch=master)](https://travis-ci.org/jirimracek/conjugate-esp)
[![Coverage Status](https://coveralls.io/repos/github/jirimracek/conjugate-esp/badge.svg?branch=master)](https://coveralls.io/github/jirimracek/conjugate-esp?branch=master)
![GitHub](https://img.shields.io/github/license/jirimracek/conjugate-esp)

Spanish verb conjugator, uses templates, pattern matching & logic to conjugate verbs in any of the regional varieties of castellano, voseo, formal, canarias

- Project goals: correct, detailed, complete, fast & small (yes, you can have it all)
- As of version 0.5.0 all 98 models (see table below) are implemented and tested
- 12815 known verbs, 3 regular, 95 irregular models
- Includes castellano, voseo, formal, canarias varieties & complicated cases
  - defectives
  - multiple (dual & triple) conjugations
  - dual participios
  - orthographical changes

____

- Current version 0.6.0
- Updated on Wed 29 Apr 2020 02:31:20 PM CEST

____

- Many thanks to [Estudio Sampere Salamanca, España](http://www.sampere.com/learn-spanish/spanish-courses-salamanca.html "Sampere Salamanca")
  - ***Esther González, Ester García, María Ballesteros*** you're my heroes

____

## Usage

```typescript
 TypeScript
   // <path to install>/index.ts exports Conjugator
   import { Conjugator } from '<path to install>';
   const cng = new Conjugator();
```

```javascript
 JavaScript
   // You'll need to build the *dist* directory with tsc as it's not pushed to the repository
   const CNG = require('<path to install>/dist');
   const cng = new CNG.Conjugator();
```

```javascript
   const amar = cng.conjugate('amar');                // castellano (tú, vosotros), default region
   console.log(JSON.stringify(amar, null, 1));
   const temer = cng.conjugate('temer', 'formal');    // formal (usted, ustedes)
   console.log(JSON.stringify(temer, null, 1));
   const vivir = cng.conjugate('vivir', 'voseo');     // voseo (vos, ustedes)
   console.log(JSON.stringify(vivir, null, 1));
   const comer = cng.conjugate('comer', 'canarias');  // canarias (tú, ustedes)
   console.log(JSON.stringify(comer, null, 1));
   const verbs = cng.getVerbList();                   // get list of verbs (string[])
   console.log(`${verbs.length} known verbs`);
```

### Returns JSON formatted tables

- Impersonal
  - Infinitivo, Gerundio,Participio
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
| **amar** | &#x2714; |
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
| **vivir** | &#x2714; |
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

- [Real Academia Española](https://www.rae.es "RAE")

- [RAE Enclave](https://enclave.rae.es "Enclave") - paid subscription, much recommended

- [Rodríguez-Rodríguez, G; Carreras-Riudavets, F; Hernández-Figueroa, Z; (2009). Conjugación de verbos en español - Conjugador TIP](https://tulengua.es "Conjugador TIP")

- [Diccionario panhispánico de dudas](https://www.casadellibro.com/libro-diccionario-panhispanico-de-dudas-2-ed/9788429406238/1051481 "Casa del libro" )

- [Vadémecum del verbo español, Pedro Gomis Blanco, Laura Segura Calvo](https://www.amazon.es/Vad%C3%A9mecum-verbo-espa%C3%B1ol-Pedro-Blanco/dp/8497783875 "Amazon.es") - while a good technical reference on verb usage, this book contains many conjugation table and index errors, use with extreme caution

- ... and many others
