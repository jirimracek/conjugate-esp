# Release notes

Wed 09 Dec 2020 10:16:47 PM CET, version 2.3.1
____

## 2.3.x changes vs 2.2.x

- **Info**
  - pronominal renamed to reflexive

- **conjugate()** changes (2)
  - 2.2.2x, old behaviour:
    - conjugate() used to return ***Result[] | ErrorType***
    - conjugate() accepted only base version of the verb
      - the result of conjugation had a mix of reflexive / nonreflexive conjugations
      - Examples
        - conjugate('hablar') would return conjugations for both hablar and hablarse
        - conjugate('abar') would return conjugations for abarse (abar doesn't exist)
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
      - Hint:: getVerbList() returns a complete list of known verbs (with respect to the above, it will contain 'abarse' but not 'abar').  Use to verify your verb before you conjugate.

- Other public interfaces:
  - **getVerbList()**
    - 2.2.x, old behaviour:
      - returned only nonreflexive verb names (made no distinction between reflexive & nonreflexive)
    - 2.3.x, new behaviour:
      - returns full list of exact verb names - if a verb (reflexive or nonreflexive) is in the list, it can be conjugated.  Both hablar and hablarse are present, there is no abar, only abarse, hablar is distinct from hablarse
  - **exports**
    - all necessary exports are now in the index file, nothing prevents you from importing from elsewhere but it should be unnecessary
  - **highlight tags**
    - the tags parameter changed slightly from
      - {start: string, end: string, deleted: string} to
      - {start: string, end: string, del: string}
  - **new methods**
    - *getDefectiveVerbList()*
    - *getDefectiveVerbListSync()*
    - *getVersion()*
