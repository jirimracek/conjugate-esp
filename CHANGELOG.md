# Changelog

DATA, 2.2.0
____

- Mon 09 Nov 2020 09:58:41 PM CET, 2.2.0
  - reverted ts compiler options mainly back to module commonjs
  - publishing to npm under tag v2.2.0, this time preferrably without errors

- Thu 05 Nov 2020 08:16:11 PM CET, 2.1.2
  - trimming for npm publish
  - updated tsconfig to es2020
  - changed Info::ortho type to string, Info::highlight to boolean

- Thu 05 Nov 2020 02:29:31 PM CET, 2.1.0
  - 2010 orthography completed
    - new optional parameters to Conjugator::constructor, *ortho* and *highlight*
    - Conjugator:: constructor(*ortho: Orthography = '2010', highlight: Highlight = false*)
      - (dropped the parameters from Conjugator::conjugate() from publish 2.0.4 - that was a Bad Idea&trade;)
    - info array may have an optional entry 'ortho': '1999'|'2010' - only verbs that are subject to the new rules
    - short &amp; sweet (see [RODMAP](ROADMAP.md) for more info)
      - 2010 (or not specified) - 2010 will be used and you get the monosyllabic versions without accent
      - 1999                    - both monosyllabic versions, one with and the other without accent
    - verification tests added
    - this is for the upcoming desired hightlighting functionality and obviously it doesn't do anything
    - added [USAGE](USAGE.md) document

- Tue 03 Nov 2020 12:13:31 AM CET, 2.0.4
  - 1999 &amp; 2010 orthography rules - this concerns monosyllable orthographical changes as per la RAE
  - see [ROADMAP](ROADMAP.md) for description
  - partially done, still need to add the info header info

- Sun 01 Nov 2020 11:17:31 PM CET, 2.0.3
  - fixed tests - incompetent coding on my part was causing false positives testing async code

- Sun 01 Nov 2020 03:28:31 PM CET, 2.0.2
  - GitHub Actions - added Coveralls again

- Sat 31 Oct 2020 11:02:19 PM CET, 2.0.1
  - likely a **breaking change**, keep reading ...
  - switched from Travis CI to GitHub Actions - Travis CI seemed to be taking forever.  And for some reason coveralls isn't working anymore.  Not willing to investigate, GH Actions offer Linux, Win and OSX as platforms.  And it seems to be working well
  - using node v14.15.0 in dev, build and tests now get verified on matrix of [[12.x, 14.x, 15.x], [Linux, Windows, Macos]]
  - dropped Coveralls, replacing with ... probably Codecov
  - dropped imprimir model - other than the dual participio it follows regular partir conjugation.  If I kept it as a model than I should have added all of the dual participio verbs below as models as well.  There is no need to do that
  - split dual participios into their individual arrays.  They are no longer clumped together as in, for example, *he imprimido/impreso* but separated into their own individual arrays in the results, the regular participio result array always preceeds the irregular one.  So now we have 2 arrays, one with *he imprimido*, the other with *he impreso*.
    - affected verbs
      - imprimir, imprimido / impreso
      - reimprimir, reimprimido / reimpreso
      - sobreimprimir, sobreimprimido / sobreimpreso
      - freír, freído / frito  - freír also has an orthography modification change coming
      - refreír, refreído / refrito
      - sofreír, sofreído / sofrito
      - proveer, proveído / provisto
      - desproveer, desproveído / desprovisto
    - removed code that dealt with PD - Dual Participio attributes, all of the above is now handled by a PR (participio replace attribute) in definitions.json
  - the effect of the above is
    - no change to input/output format
    - additional output arrays for the listed verbs, the order of output arrays may have changed
    - the relevant verb participios and compuestos forms are no longer listed as regular/irregular, insted each regular and irregular gets its own list (array) in the result

- Thu 29 Oct 2020 07:46:44 PM CET, 2.0.0
  - updated .travis.yml to node 13.14.0 - seems that it no longer worked with 13.8.x
  - possible **breaking changes**
    - removed exports from index.ts as they're not needed for basic functionality
      - INDICATIVO_SIMPLE_KEYS
      - INDICATIVO_COMP_KEYS
      - SUBJUNTIVO_SIMPLE_KEYS
      - SUBJUNTIVO_COMP_KEYS
      - IMPERATIVO_KEYS
      - if needed, they can still be imported from lib/basemodel
    - models changed
      - AR
        - agorar -> engorar/se
        - aullar -> aunar/se
        - cazar -> rozar/se
        - empezar -> tropezar/se
        - pensar -> acertar/se
      - ER
        - leer -> creer/se
        - prever -> rever/se
        - roer -> corroer/se
      - IR
        - colegir -> corregir/se
        - prohibir -> cohibir/se
        - surgir -> dirigir/se

- Tue 27 Oct 2020 07:56:09 PM CET, version 1.2.2
  - sync packaged-lock.jso

- Tue 27 Oct 2020 06:07:18 PM CET, version 1.2.1
  - toolset update to current npm packages, TypeScript 4.0 updates
  - updated ROADMAP with planned changes - please read, there may be some breaking changes coming down the pipe, I was inert for way too long ;)

- 6/7/2020 (1.2.0)
  - removed 2248 verbs unknown to or deemed unused by la RAE
  - this may be a content breaking change, as model rehinchir was removed (unknown)

- 6/5/2020 (1.1.2)
  - more exports made available in the index file
  - this is likely the last version that supports unknown / unused (per la RAE) verbs

- 5/29/2020 (1.1.1)
  - exported a few basemodel.ts constants

- 5/19/2020 (1.1.0)
  - changed regular models from [amar, temer, vivir ] to [hablar, temer, partir] so the reflexives can be shown in models table
  - this is potentially an interface breaking change if you counted on [amar, temer, vivir]
  - added a few exports

- 5/4/2020 (1.0.2)
  - more def file shrinking, sync with npm

- 5/1/2020 (1.0.1)
  - bumping version, npm published
  - README update for npm
  - shrank the definitions file as (hopefully) it's unlikely that we'll be modifying it again

- 5/1/2020 (0.7.0)
  - major cleanup, one more round
  - **interface change** - old sync only methods renamed to <*>Sync()
  - simplified directory structure, removed unneeded complexity
  - type, export, const isolation to live only where they are needed
  - ready to publish to npm, I think

- 4/29/2020 (0.6.0)
  - minor changes to imperativo afirmativo
  - fix to getModels()
  - consolidated a few string arrays into constants
  - readability, cleanup
  - consistent copyright
  - preparing for publish to npm

- 4/27/2020 (0.5.0)
  - aullar, avergonzar, cabrahigar, colgar, dar, desdar, desosar, empezar, forzar, jugar
  - all models done, have 12815 verbs that can be conjugated
  - version bump
  - taking a few days off to think about it

- 4/27/2020 (0.4.0)
  - added caber, caer, coger, leer, oler, rehacer
  - drop joguer - unused
  - done with -er models
  - version bump

- 4/26/2020 (0.4.0)
  - added models prever, romper, saber, ser, tener, torcer, traer, valer, ver, volver

- 4/25/2020 (0.4.0)
  - asir, bendecir, ceñir, colegir, conducir, delinquir, distinguir, dormir, ir, imprimir, escribir, erguir
  - dual participios
  - finished -ir verbs, version bump

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

____

## Rough initial stats, notes

- Gathered verbs from various resources, internet lists, books, etc.
- Of which
  - Probably at least half are unused as per la RAE but it's a fun challenge to try them all
  - Majority is conjugated per regular models (amar 8600+, temer 140+, vivir 290+)
  - There are about 130 defectives of 11 categories, some are single model, others are duals
  - There are about 180 dual verbs conjugated as per 2 models (different models or same model non-defective / defective) and about 6 triples (yacer, roer, ...)
- Models involved in defectives
  - actuar aislar amar cazar contar discernir embaír estar haber hacer lucir mover nacer pagar pensar poder poner querer responder sacar servir surgir tañer temer tender vaciar vivir zurcir
- Additional models involved in multiples
  - enraizar errar huir vencer placer podrir pudrir raer regar reír responder roer volcar yacer
