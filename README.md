# Spanish verb conjugator

Wed 09 Dec 2020 11:30:56 PM CET, version 2.3.2
____

![Build Matrix](https://github.com/jirimracek/conjugate-esp/workflows/Build%20Matrix/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/jirimracek/conjugate-esp/badge.svg?branch=main)](https://coveralls.io/github/jirimracek/conjugate-esp?branch=main)
![GitHub](https://img.shields.io/github/license/jirimracek/conjugate-esp)

Uses templates, pattern matching & logic to conjugate Spanish verbs
____

## Goals

- correct, detailed, complete, fast & small
- 14456 tested verbs based on 97 models
- includes
  - only current, RAE recognized as known &amp; used verbs
  - castellano, voseo, formal, canarias
  - reflexives
  - defectives
  - multiple (dual & triple) conjugations
  - dual participios
  - orthographical changes (1999 and 2010)

____

### TL;DR

- new in 2.3.x
  - public interface changes
  - new public methods
  - internal changes, code cleanup

____

### Want to read

- see [Release notes](docs/RELEASE.md) for major / minor version updates
- see [Changelog](docs/CHANGELOG.md) for current details
- see [Roadmap](docs/ROADMAP.md) for future changes and ideas
- see [Usage](docs/USAGE.md) for usage, interfaces, return values description, sample output and more

____

### Credits

- Many thanks to [Estudio Sampere Salamanca, España](http://www.sampere.com/learn-spanish/spanish-courses-salamanca.html)
  - ***Esther González, Ester García, María Ballesteros*** you're my heroes
- many thanks to contributors to [fast-diff](https://github.com/jhchen/fast-diff) - I really didn't feel like writing yet another text comparison, you saved me a lot of time

____

### Compatibility

- browsers
  - see [caniuse](https://caniuse.com/?search=array.flat)
- node.js >= 12.11
  - uses ES2019 features, namely Array.flat
  - see [ECMAScript compatibility](https://kangax.github.io/compat-table/es2016plus/)

____

### Installation

- clone / download gitHub repository
- npm i @jirimracek/conjugate-esp

____

### Modes / Times

- Impersonal
  - Infinitivo, Gerundio, Participio
- Indicativo
  - Simple
    - Presente, Pretérito Imperfecto, Pretérito Indefinido, Futuro Imperfecto, Condicional Simple
  - Compuesto
    - Pretérito Perfecto, Pretérito Pluscuamperfecto, *Pretérito Anterior*, Futuro Perfecto, Condicional Compuesto
- Subjuntivo
  - Simple
    - Presente, Pretérito Imperfecto Ra, Pretérito Imperfecto Se, *Futuro Imperfecto*
  - Compuesto
    - Pretérito Perfecto, Pretérito Pluscuamperfecto Ra, Pretérito Pluscuamperfecto Se, *Futuro Perfecto*
- Imperativo
  - Afirmativo, Negativo

(rarely employed *Indicativo Pretérito Anterior &amp; Subjuntivo Futuro Perfecto / Imperfecto*)
____

### Implemented and tested conjugation models

<table>
<tr><td>

| AR            | |
|---------------|:-----------:|
| ***hablar*** | &#x2714; |
| *acertar* | &#x2714; |
| *actuar* | &#x2714; |
| *aguar* | &#x2714; |
| *ahincar* | &#x2714; |
| *aislar* | &#x2714; |
| *andar* | &#x2714; |
| *aunar* | &#x2714; |
| *avergonzar* | &#x2714; |
| *cabrahigar* | &#x2714; |
| *colgar* | &#x2714; |
| *contar* | &#x2714; |
| *dar* | &#x2714; |
| *desdar* | &#x2714; |
| *desosar* | &#x2714; |
| *engorar* | &#x2714; |
| *enraizar* | &#x2714; |
| *errar* | &#x2714; |
| *estar* | &#x2714; |
| *forzar* | &#x2714; |
| *jugar* | &#x2714; |
| *pagar* | &#x2714; |
| *regar* | &#x2714; |
| *rozar* | &#x2714; |
| *sacar* | &#x2714; |
| *tropezar* | &#x2714; |
| *vaciar* | &#x2714; |
| *volcar* | &#x2714; |
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
| ***temer*** | &#x2714; |
| *caber* | &#x2714; |
| *caer* | &#x2714; |
| *coger* | &#x2714; |
| *corroer* | &#x2714; |
| *creer* | &#x2714; |
| *haber* | &#x2714; |
| *hacer* | &#x2714; |
| *mover* | &#x2714; |
| *nacer* | &#x2714; |
| *oler* | &#x2714; |
| *placer* | &#x2714; |
| *poder* | &#x2714; |
| *poner* | &#x2714; |
| *querer* | &#x2714; |
| *raer* | &#x2714; |
| *rehacer* | &#x2714; |
| *responder* | &#x2714; |
| *rever* | &#x2714; |
| *romper* | &#x2714; |
| *saber* | &#x2714; |
| *ser* | &#x2714; |
| *tañer* | &#x2714; |
| *tender* | &#x2714; |
| *tener* | &#x2714; |
| *torcer* | &#x2714; |
| *traer* | &#x2714; |
| *valer* | &#x2714; |
| *vencer* | &#x2714; |
| *ver* | &#x2714; |
| *volver* | &#x2714; |
| *yacer* | &#x2714; |
|&#x2796;||
|&#x2796;||
|&#x2796;||
|&#x2796;||
|&#x2796;||
</td><td>

| IR            | |
|---------------|:-----------:|
| ***partir*** | &#x2714; |
| *abrir* | &#x2714; |
| *adquirir* | &#x2714; |
| *argüir* | &#x2714; |
| *asir* | &#x2714; |
| *balbucir* | &#x2714; |
| *bendecir* | &#x2714; |
| *ceñir* | &#x2714; |
| *cohibir* | &#x2714; |
| *conducir* | &#x2714; |
| *corregir* | &#x2714; |
| *decir* | &#x2714; |
| *delinquir* | &#x2714; |
| *dirigir* | &#x2714; |
| *discernir* | &#x2714; |
| *distinguir* | &#x2714; |
| *dormir* | &#x2714; |
| *embaír* | &#x2714; |
| *erguir* | &#x2714; |
| *escribir* | &#x2714; |
| *huir* | &#x2714; |
| *ir* | &#x2714; |
| *lucir* | &#x2714; |
| *oír* | &#x2714; |
| *plañir* | &#x2714; |
| *podrir* | &#x2714; |
| *pudrir* | &#x2714; |
| *rehenchir* | &#x2714; |
| *rehuir* | &#x2714; |
| *reunir* | &#x2714; |
| *reír* | &#x2714; |
| *salir* | &#x2714; |
| *seguir* | &#x2714; |
| *sentir* | &#x2714; |
| *servir* | &#x2714; |
| *venir* | &#x2714; |
| *zurcir* | &#x2714; |
</td></tr> </table>

____

### Resources Used

- [Estudio Sampere Salamanca](http://www.sampere.com/learn-spanish/spanish-courses-salamanca.html "Sampere Salamanca") - great place to study Spanish

- [RAE main page](https://www.rae.es "RAE") and their (paid subscription, much recommended) [RAE Enclave](https://enclave.rae.es "Enclave")

- [Rodríguez-Rodríguez, G; Carreras-Riudavets, F; Hernández-Figueroa, Z; (2009). Conjugación de verbos en español - Conjugador TIP](https://tulengua.es "Conjugador TIP") - excellent book, about the most accurate and complete web conjugator I found

- [Diccionario panhispánico de dudas](https://www.casadellibro.com/libro-diccionario-panhispanico-de-dudas-2-ed/9788429406238/1051481 "Casa del libro" )

- [Vadémecum del verbo español, Pedro Gomis Blanco, Laura Segura Calvo](https://www.amazon.es/Vad%C3%A9mecum-verbo-espa%C3%B1ol-Pedro-Blanco/dp/8497783875 "Amazon.es") - good technical reference on verb usage, but has many errors (tables, verb to model index), use with extreme caution

- ... and many others
