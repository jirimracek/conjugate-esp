# Release notes

Sun 03 Jan 2021 07:14:54 PM CET, version 2.3.6
____

## 2.3.x changes vs 2.2.x

- **Info array trimmed down**
  - dropped the verb name (it's what you asked for, isn't it?).  And it's the infinitive
  - dropped pronominal (reflexive) from the Info array - it should be plenty obvious from the verb name
  - dropped the list of pronouns.  They are region dependent, look them up in [USAGE](USAGE.md)
  - defective is optional now
  - the info array has this left in it now
    - *model*
    - *region*
    - *defective?*
    - *ortho?*
- **conjugation array (results) order**
  - non-defective conjugations are always listed before defective ones (this affects the order or Result[])

- **conjugate()** changes (2)
  - 2.2.2x, old behaviour:
    - conjugate() used to return ***Result[] | ErrorType***
    - conjugate() accepted only base version of the verb
      - the result of conjugation had a mix of reflexive / nonreflexive conjugations
      - Examples
        - conjugate('hablar') would return conjugations for both hablar and hablarse
        - conjugate('abar') would return conjugation for abarse (abar doesn't exist)
      - Inconsistency
        - user asks for 'abar' and gets 'abarse', asks for 'hablar' and gets both 'hablar' and 'hablarse'
  - 2.3.x, new behaviour:
    - conjugate() returns ***Result[] | string***  (error string, ErrorType got nuked as an overkill)
    - conjugate() requires exact version of the verb, either reflexive or not, the return array will contain only the version requested
      - Examples
        - conjugate ('hablar') will result in hablar conjugation only
        - conjugate ('hablarse') will result in hablarse conjugation only
        - conjugate ('abar') will result in unknown verb error
        - conjugate ('abarse') will return 'abarse' conjugation
      - Hint: Call *getVerbList()* to get a complete list of known verbs (with respect to the above, it will contain 'abarse' but not 'abar').  Use to verify your verb before you conjugate.

- Other public interfaces:
  - **getVerbList()**
    - 2.2.x, old behaviour:
      - returned only nonreflexive verb names (made no distinction between reflexive & nonreflexive)
    - 2.3.x, new behaviour:
      - returns full list of exact verb names - if a verb (reflexive or nonreflexive) is in the list, it can be conjugated.  Both hablar and hablarse are present, there is no abar, only abarse, hablar is distinct from hablarse
  - **exports**
    - all necessary exports are now in the index file, nothing prevents you from importing from elsewhere but it should be unnecessary
  - **highlight tags**
    - the tags constructor parameter changed slightly from
      - {start: string, end: string, deleted: string} to
      - {start: string, end: string, del: string}
  - **obsoleted (removed) methods**
    - *setHighlightTags()*
    - *getHighlightTags()*
  - **new methods**
    - get list of defective verbs
      - if pure === false, return string[] of all verbs which exist in **any defective variety** (haber, estar, ...)
      - if pure === true, in addition return list of verbs that **only exist as defectives** (abarse)
      - *getDefectiveVerbList(pure = false): string [] | string [][]*
      - *getDefectiveVerbListSync(pure = false)*
    - get list of verbs that have been affected by 1999/2010 orthographical changes
      - *getOrthoVerbList(): string[]*
      - *getOrthoVerbListSync(): string[]*
    - turn highlighting on / off / partial (default setting is *off* at startup)
      - *useHighlight(use: boolean | null = null): void*
        - use = true|false|null
          - *true* - full highlightint
          - *false* - highlight off (startup default)
          - *null* - partial highlight (character changes only)
    - get current version
      - *getVersion(): string*

- Internal
  - db changes, dropped one level of nesting, simplified access, has no effect on public interfaces
