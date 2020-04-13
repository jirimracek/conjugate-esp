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

- [Estudio Sampere Salamanca, namely Esther González, Ester García, María Ballesteros](http://www.sampere.com/learn-spanish/spanish-courses-salamanca.html "Sampere Salamanca")

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
| enviar | &#x2718; |
| errar | &#x2718; |
| estar | &#x2718; |
| forzar | &#x2718; |
| jugar | &#x2718; |
| pagar | &#x2718; |
| ***pensar*** | &#x2714; |
| regar | &#x2718; |
| sacar | &#x2718; |
| trocar | &#x2718; |
| vaciar | &#x2718; |
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
| mecer | &#x2718; |
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
| responder | &#x2718; |
| roer | &#x2718; |
| romper | &#x2718; |
| saber | &#x2718; |
| satisfacer | &#x2718; |
| ser | &#x2718; |
| tañer | &#x2718; |
| tender | &#x2718; |
| tener | &#x2718; |
| torcer | &#x2718; |
| traer | &#x2718; |
| valer | &#x2718; |
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
| bendecir | &#x2718; |
| ceñir | &#x2718; |
| colegir | &#x2718; |
| conducir | &#x2718; |
| contraír | &#x2718; |
| decir | &#x2718; |
| delinquir | &#x2718; |
| discernir | &#x2718; |
| distinguir | &#x2718; |
| dormir | &#x2718; |
| embaír | &#x2718; |
| erguir | &#x2718; |
| escribir | &#x2718; |
| huir | &#x2718; |
| imprimir | &#x2718; |
| ir | &#x2718; |
| lucir | &#x2718; |
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
| servir | &#x2718; |
| surgir | &#x2718; |
| venir | &#x2718; |
| zurcir | &#x2718; |
</td></tr> </table>

____

## Resources

- [Estudio Sampere Salamanca](http://www.sampere.com/learn-spanish/spanish-courses-salamanca.html "Sampere Salamanca")

- [Real Academia Española](https://www.rae.es "RAE")

- [Vadémecum del verbo español, Pedro Gomis Blanco, Laura Segura Calvo](https://www.amazon.es/Vad%C3%A9mecum-verbo-espa%C3%B1ol-Pedro-Blanco/dp/8497783875 "Amazon.es")

- [Rodríguez-Rodríguez, G; Carreras-Riudavets, F; Hernández-Figueroa, Z; (2009). Conjugación de verbos en español - Conjugador IP](https://tulengua.es "Conjugador TIP")

- [Diccionario panhispánico de dudas](https://www.casadellibro.com/libro-diccionario-panhispanico-de-dudas-2-ed/9788429406238/1051481 "Casa del libro" )

- ... and many others

____
