# Changelog

- 4/25/2020 (0.4.0)
  - asir, bendecir, ceñir, colegir, conducir, delinquir, distinguir, dormir, ir, imprimir, escribir, erguir
  - dual participios
  - finished IR verbs, version bump

- 4/23/2020 (0.3.2)
  - last round of cleanups, consolidated imperativo afirmativo monosyllabics
  - implemented models oír, plañir, prohibir, rehenchir, rehuir, reunir, salir, seguir, sentir, venir

- 4/22/2020 (0.3.1)
  - took some time to do a cleanup, setup lint and make the code a bit more readable and organized
  - removing dead code, cleaning the experimental before implementing the rest of the irregular models

- 4/20/2020
  - monosyllabic accentuation rework, base class handles it now
  - time for cleanup

- 4/19/2020
  - enraizar, yacer, huir, placer, podrir, pudrir, raer, reír, roer
  - offloaded model satisfacer, handled by hacer
  - defectives: **done**
  - dual, triple conjugations: **done**

- 4/18/2020
  - condecir, contradecir, desdecir, predecir, entredecir, redecir, antedecir, decir, esperdecir, interdecir - difficult variety
  - got rid of predecir model - handled by decir
  - got rid of reponer model - handled by poner
  - zurcir, querer, tañer, tender - **done with defectives**
  - changed the database attributes configuration one more time, hopefully for the last time to verb:attrname=attrvalue:attrname=value ...

- 4/17/2020
  - noticing some common regularities in irregular conjugations. Code shrinking is in order
  - models discernir, lucir, balbucir, regar, estar, haber, hacer, mover, poder, poner, decir
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
