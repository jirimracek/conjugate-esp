# conjugate-esp

[![Build Status](https://travis-ci.org/jirimracek/conjugate-esp.svg?branch=master)](https://travis-ci.org/jirimracek/conjugate-esp)
[![Coverage Status](https://coveralls.io/repos/github/jirimracek/conjugate-esp/badge.svg?branch=master)](https://coveralls.io/github/jirimracek/conjugate-esp?branch=master)
![GitHub](https://img.shields.io/github/license/jirimracek/conjugate-esp)

Spanish verb conjugator, uses model templates, pattern matching & logic to conjugate Spanish verbs in any of the regional varieties of castellano, voseo, formal, canarias

- Defectives, multiple conjugations, exceptional cases (triple conjugations, dual participios, orthographical exceptions), etc.

- Goals: correct, fast, small footprint

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

____

### Many thanks for never getting tired of my questions

- [Estudio Sampere Salamanca, España, namely Esther González, Ester García, María Ballesteros](http://www.sampere.com/learn-spanish/spanish-courses-salamanca.html "Sampere Salamanca")

____

### Models

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
| aullar | &#x2718; |
| avergonzar | &#x2718; |
| cabrahigar | &#x2718; |
| ***cazar*** | &#x2714; |
| colgar | &#x2718; |
| ***contar*** | &#x2714; |
| dar | &#x2718; |
| desdar | &#x2718; |
| desosar | &#x2718; |
| empezar | &#x2718; |
| enraizar | &#x2718; |
| ***errar*** | &#x2714; |
| ***estar*** | &#x2714; |
| forzar | &#x2718; |
| jugar | &#x2718; |
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
|&#x2796;||
</td><td>

| ER            | |
|---------------|:-----------:|
| **temer** | &#x2714; |
| caber | &#x2718; |
| caer | &#x2718; |
| coger | &#x2718; |
| haber | &#x2718; |
| hacer | &#x2718; |
| joguer | &#x2718; |
| leer | &#x2718; |
| mover | &#x2718; |
| ***nacer*** | &#x2714; |
| oler | &#x2718; |
| placer | &#x2718; |
| poder | &#x2718; |
| poner | &#x2718; |
| prever | &#x2718; |
| querer | &#x2718; |
| raer | &#x2718; |
| rehacer | &#x2718; |
| reponer | &#x2718; |
| ***responder*** | &#x2714; |
| roer | &#x2718; |
| romper | &#x2718; |
| saber | &#x2718; |
| satisfacer | &#x2718; |
| ser | &#x2718; |
| soler | &#x2718; |
| tañer | &#x2718; |
| tender | &#x2718; |
| tener | &#x2718; |
| torcer | &#x2718; |
| traer | &#x2718; |
| valer | &#x2718; |
| ***vencer*** | &#x2714; |
| ver | &#x2718; |
| volver | &#x2718; |
| yacer | &#x2718; |
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
| asir | &#x2718; |
| ***balbucir*** | &#x2714; |
| bendecir | &#x2718; |
| ceñir | &#x2718; |
| colegir | &#x2718; |
| conducir | &#x2718; |
| contraír | &#x2718; |
| decir | &#x2718; |
| delinquir | &#x2718; |
| ***discernir*** | &#x2714; |
| distinguir | &#x2718; |
| dormir | &#x2718; |
| ***embaír*** | &#x2714; |
| erguir | &#x2718; |
| escribir | &#x2718; |
| huir | &#x2718; |
| imprimir | &#x2718; |
| ir | &#x2718; |
| ***lucir*** | &#x2714; |
| oír | &#x2718; |
| plañir | &#x2718; |
| podrir | &#x2718; |
| predecir | &#x2718; |
| prohibir | &#x2718; |
| pudrir | &#x2718; |
| rehenchir | &#x2718; |
| rehuir | &#x2718; |
| reunir | &#x2718; |
| reír | &#x2718; |
| salir | &#x2718; |
| seguir | &#x2718; |
| sentir | &#x2718; |
| ***servir*** | &#x2714; |
| ***surgir*** | &#x2714; |
| venir | &#x2718; |
| zurcir | &#x2718; |
</td></tr> </table>

____

## Resources

- [Estudio Sampere Salamanca](http://www.sampere.com/learn-spanish/spanish-courses-salamanca.html "Sampere Salamanca")

- [Real Academia Española](https://www.rae.es "RAE")

- [Vadémecum del verbo español, Pedro Gomis Blanco, Laura Segura Calvo](https://www.amazon.es/Vad%C3%A9mecum-verbo-espa%C3%B1ol-Pedro-Blanco/dp/8497783875 "Amazon.es")

- [Rodríguez-Rodríguez, G; Carreras-Riudavets, F; Hernández-Figueroa, Z; (2009). Conjugación de verbos en español - Conjugador TIP](https://tulengua.es "Conjugador TIP")

- [Diccionario panhispánico de dudas](https://www.casadellibro.com/libro-diccionario-panhispanico-de-dudas-2-ed/9788429406238/1051481 "Casa del libro" )

- ... and many others

____

## Rough stats

- Gathered **12819** verbs from various resources, internet lists, books, etc.
- Of which
  - Probably at least half are unused as per la RAE but it's a fun challenge to try them all
  - Majority is conjugated per regular models (amar 8600+, temer 140+, vivir 290+)
  - There are about 130 defectives of 11 categories, some are single model, others are duals
  - There are about 180 dual verbs conjugated as per 2 models (different models or same model non-defective / defective) and about 6 triples (yacer, roer, ...)
- Models needed to do all defectives (todo / **done**)
  - **actuar aislar amar cazar contar** **discernir** **embaír** **estar** haber hacer **lucir** mover **nacer** **pagar** **pensar** poder poner predecir querer reponer **responder** **sacar** **servir** **surgir** tañer **temer** tender **vaciar** **vivir** zurcir
- Additional models needed to do all multiples
  - enraizar **errar** huir **vencer** placer podrir predecir pudrir raer **regar** reír **responder** roer satisfacer **volcar** yacer

____

## Changelog

- 4/17/2020
  - started noticing some common regularities in irregular conjugations. Code shrinking is in order
  - models discernir, lucir, balbucir, regar, estar

- 4/17/2020
  - added pagar, sacar, vaciar, volcar, vencer, responder, errar
  - consolidated imperativo afirmativo, all is now handled in the base class, **mental note** - probably can make a lot of things private now.  Or later. Maybe.  
  - implemented bimorfop - infinitivo & participio (empedernir)
  - implemented omorfo - acostumbrar & soler defectivos
  - string helper strongify - make an nth syllable strong unless it already is
  - tested
- 4/16/2020
  - major cleanup, changed the construction mechanism
  - cleaner structure, simpler code, regexps are much simpler now and easy to read  
  - changed internal interfaces, model gets to know its verb at construction time now, system is much easier to follow
  - better use of inheritance & poly, looks more production than experimental code
- 4/15/2020 - add surgir, servir, embaír. Started changelog
- 4/13/2020 - added nacer, contar, maybe finalized what the definitions file should look like
- ... have basic system in place, tests, coverage, etc.
