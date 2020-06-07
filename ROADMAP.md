# Things to do, wishlist, crimes committed, etc

- 6/7/2020, version 1.2.0
  - new wishlist
    - reorganize / choose different models.  Reasoning:
      - some models are utterly unknown verbs, it would be nice to use something useful instead
      - would be nice to have a pronominal version of each model.  It's not possible because some models are only models for themselves and the pronominal version just doesn't exist.  But we can try
      - would be nice to have a shortest possible version of each model to maximize screen space.  It would also be easier to read and understand
      - optimization - the definitions file could be made smaller by joining the multitude of N & P duplicates into one NP or some such.  Not going to worry about it now as it's under 340k anyway, not enough bang for the buck
  - things accomplished
    - async interface added some time ago
    - npm package published long time ago
    - as of v 1.2.0 we only have verbs known to be used as per la RAE
    - use pre 1.2.0 version for verbs unknown to la RAE

- 4/27/2020 (0.5.0) - have all models implemented, what's next?
  - take a few days off
  - add async interface
  - clean up and publish to npm
  - there are 12815 known verbs, probably half of them are obsolete.  
    - want to keep all of them to be able to match a verb or its form to old texts, however ...
  - things I'd like to have
    - build a trie to be able to search for any form of any verb
    - have a separate *use only known (per la RAE) verbs* interface option?
    - shrink the size
    - will keep adding options here
