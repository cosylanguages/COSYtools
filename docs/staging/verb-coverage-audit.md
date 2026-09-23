# Multilingual Verb Coverage Audit Report (CEFR A0–A1)

## Overview
This report presents a comprehensive coverage and quality gap analysis comparing the CEFR A0–A1 master verb source list (`docs/staging/a0-a1-master-verb-list-raw.md`) against all 9 core verb reference datasets in `COSYtools`.

### Source List Parsing Summary
- **Total Deduplicated Concepts Analyzed**: `354`
- **A0 Level Concepts**: `68`
- **A1 Level Concepts**: `286`

---

## Summary Coverage Table Across All 9 Engines

| Language | Engine Name | Target File Path | Source Evaluated | Present in Engine | Missing | Lower Quality Entries |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| English | English Verb-Prep Engine | `tools/en/verb-prep/data/verbs.json` | 354 | **137** | **217** | **0** |
| English | English Irregular Verbs Engine | `tools/en/irregular-verbs/data/verbs.json` | 354 | **108** | **246** | **0** |
| French | French Prepositional Regime Engine | `tools/fr/regime/data/verbs.json` | 354 | **118** | **236** | **0** |
| French | French Conjugeur Engine | `tools/fr/conjugeur/data/verbs.json` | 345 | **220** | **125** | **0** |
| Italian | Italian Reggenza Engine | `tools/it/reggenza/data/verbs.json` | 349 | **71** | **278** | **0** |
| Italian | Italian Coniugatore Engine | `tools/it/coniugatore/data/verbs.json` | 349 | **217** | **132** | **11** |
| Russian | Russian Spryazhenie Engine | `tools/ru/spryazhenie/data/verbs.json` | 349 | **167** | **182** | **7** |
| Greek | Greek Syntaxi Engine | `tools/el/syntaxi/data/verbs.json` | 349 | **127** | **222** | **127** |
| Greek | Greek Klisi-Rimaton Engine | `tools/el/klisi-rimaton/data/verbs.json` | 349 | **164** | **185** | **0** |

---

## English Verb-Prep Engine
**Target Dataset File**: `tools/en/verb-prep/data/verbs.json`

### Coverage Statistics
- **Total Source Concepts Evaluated**: `354`
- **Present in Engine**: `137` (A0: `18`, A1: `119`)
- **Genuinely Missing**: `217` (A0: `50`, A1: `167`)
- **Lower Quality Engine Entries**: `0`

### Present Concepts (Covered)
| Source Concept Key | Level | Matched Key in Engine |
| :--- | :---: | :--- |
| `accept` | **A1** | `agree to` |
| `accept yourself` | **A1** | `agree to` |
| `access` | **A1** | `enter` |
| `achieve` | **A1** | `succeed in` |
| `agree on` | **A1** | `agree` |
| `agree that` | **A1** | `agree` |
| `agree with` | **A1** | `agree with` |
| `answer` | **A1** | `answer` |
| `answer someone` | **A1** | `answer` |
| `apologize for` | **A1** | `apologize` |
| `apologize to` | **A1** | `apologize to` |
| `appear` | **A1** | `turn up` |
| `apply for` | **A1** | `apply` |
| `arrive at` | **A1** | `arrive at` |
| `arrive from` | **A1** | `arrive` |
| `ask about` | **A1** | `ask` |
| `ask for` | **A1** | `request` |
| `ask someone for something` | **A1** | `ask` |
| `avoid` | **A1** | `get out of` |
| `believe` | **A0** | `believe` |
| `believe in` | **A1** | `believe in` |
| `belong to` | **A1** | `belong to` |
| `call` | **A1** | `phone` |
| `call someone` | **A1** | `phone` |
| `care about` | **A1** | `care` |
| `cause` | **A1** | `bring about` |
| `come from` | **A1** | `come` |
| `come from someone` | **A1** | `come` |
| `come out of` | **A1** | `come` |
| `come to` | **A1** | `come` |
| `complain about` | **A1** | `complain` |
| `concentrate on` | **A1** | `focus on` |
| `consider` | **A1** | `deliberate on` |
| `contact` | **A1** | `contact` |
| `continue doing` | **A1** | `get on with` |
| `contribute to` | **A1** | `contribute to` |
| `deal with` | **A1** | `deal with` |
| `depend on` | **A1** | `hinge on` |
| `discuss` | **A1** | `discuss` |
| `dream about` | **A1** | `dream` |
| `dream of` | **A1** | `dream` |
| `enter` | **A1** | `enter` |
| `exercise` | **A0** | `work out` |
| `explain something to someone` | **A1** | `account for` |
| `explain to` | **A1** | `account for` |
| `explain why` | **A1** | `account for` |
| `fail at` | **A1** | `break down` |
| `focus on` | **A1** | `focus on` |
| `follow` | **A0** | `obey` |
| `follow someone` | **A1** | `obey` |
| `get` | **A0** | `get` |
| `get better at` | **A1** | `get` |
| `get into` | **A1** | `get` |
| `get out of` | **A1** | `get out of` |
| `get to know` | **A1** | `get` |
| `get up` | **A1** | `get up` |
| `get used to` | **A1** | `get` |
| `go back to` | **A1** | `go` |
| `go into` | **A1** | `enter` |
| `go to` | **A1** | `go` |
| `go to someone` | **A1** | `go` |
| `hope` | **A0** | `hope` |
| `hope for` | **A1** | `hope` |
| `hope to` | **A1** | `hope` |
| `increase` | **A1** | `turn up` |
| `influence` | **A1** | `influence` |
| `laugh` | **A0** | `laugh` |
| `lead to` | **A1** | `conduce to` |
| `leave a place` | **A1** | `walk out on` |
| `leave exit` | **A1** | `walk out on` |
| `listen to` | **A1** | `listen to` |
| `listen to someone` | **A1** | `listen` |
| `live abroad` | **A1** | `live` |
| `live in` | **A1** | `live` |
| `live with` | **A1** | `live` |
| `look after` | **A1** | `look after` |
| `look at` | **A1** | `look at` |
| `look for` | **A1** | `look for` |
| `look forward to` | **A1** | `look forward to` |
| `manage` | **A1** | `cope with` |
| `message` | **A1** | `email` |
| `need` | **A0** | `lack` |
| `need to` | **A1** | `lack` |
| `pay` | **A0** | `pay` |
| `pay for` | **A1** | `pay for` |
| `prepare` | **A0** | `prepare` |
| `prepare for` | **A1** | `prepare` |
| `prevent from` | **A1** | `prevent from` |
| `protect` | **A1** | `protect` |
| `protect from` | **A1** | `protect` |
| `recover from` | **A1** | `get over` |
| `reduce` | **A1** | `cut down on` |
| `refuse` | **A1** | `turn down` |
| `rely on` | **A1** | `rely on` |
| `reply to` | **A1** | `answer` |
| `respect` | **A1** | `look up to` |
| `return to` | **A1** | `come back` |
| `search` | **A0** | `search` |
| `search for` | **A1** | `look for` |
| `search through` | **A1** | `search` |
| `smile` | **A0** | `smile` |
| `solve` | **A1** | `figure out` |
| `speak about` | **A1** | `speak` |
| `speak with` | **A1** | `speak with` |
| `stay at` | **A1** | `stay` |
| `stop doing` | **A1** | `desist from` |
| `succeed in` | **A1** | `succeed in` |
| `suffer from` | **A1** | `suffer from` |
| `support` | **A1** | `stand up for` |
| `take care of` | **A1** | `take care of` |
| `take off` | **A0** | `take off` |
| `talk about` | **A1** | `talk about` |
| `talk about someone` | **A1** | `talk` |
| `talk about something` | **A1** | `talk` |
| `talk to someone` | **A1** | `talk` |
| `talk with someone` | **A1** | `talk` |
| `thank for` | **A1** | `thank` |
| `think about` | **A1** | `think about` |
| `think of` | **A1** | `think of` |
| `travel by bus take a bus` | **A1** | `go` |
| `travel by plane` | **A1** | `go` |
| `travel by train` | **A1** | `go` |
| `travel to` | **A1** | `go` |
| `trust` | **A0** | `believe` |
| `visit` | **A0** | `visit` |
| `wait for` | **A1** | `wait for` |
| `wait for someone` | **A1** | `hold on` |
| `wake up` | **A0** | `wake up` |
| `want` | **A0** | `lack` |
| `warn about` | **A1** | `warn` |
| `work` | **A0** | `work` |
| `work at` | **A1** | `work` |
| `work for` | **A1** | `work` |
| `work on` | **A1** | `work` |
| `work with` | **A1** | `work with` |
| `worry` | **A0** | `worry` |
| `worry about` | **A1** | `worry` |

### Genuinely Missing Concepts
| Missing Concept Key | Implied CEFR Level | Source Term / Equivalent |
| :--- | :---: | :--- |
| `be` | **A0** | `be` |
| `buy` | **A0** | `buy` |
| `check` | **A0** | `check` |
| `click` | **A0** | `click` |
| `connect` | **A0** | `connect` |
| `cook` | **A0** | `cook` |
| `correct` | **A0** | `correct` |
| `cry` | **A0** | `cry` |
| `delete` | **A0** | `delete` |
| `do make` | **A0** | `do, make` |
| `download` | **A0** | `download` |
| `drink` | **A0** | `drink` |
| `eat` | **A0** | `eat` |
| `enjoy` | **A0** | `enjoy` |
| `fare male` | **A0** | `fare male` |
| `fear be afraid` | **A0** | `fear / be afraid` |
| `feel` | **A0** | `feel` |
| `forget` | **A0** | `forget` |
| `give` | **A0** | `give` |
| `have` | **A0** | `have` |
| `have fun` | **A0** | `have fun` |
| `improve` | **A0** | `improve` |
| `invite` | **A0** | `invite` |
| `know` | **A0** | `know` |
| `learn` | **A0** | `learn` |
| `like` | **A0** | `like` |
| `love` | **A0** | `love` |
| `mean` | **A0** | `mean` |
| `meet` | **A0** | `meet` |
| `miss someonesomething` | **A0** | `miss someone/something` |
| `pensare` | **A0** | `pensare` |
| `plan` | **A0** | `plan` |
| `practise` | **A0** | `practise` |
| `put` | **A0** | `put` |
| `put on` | **A0** | `put on` |
| `receive` | **A0** | `receive` |
| `relax` | **A0** | `relax` |
| `remember` | **A0** | `remember` |
| `rest` | **A0** | `rest` |
| `save` | **A0** | `save` |
| `send` | **A0** | `send` |
| `share` | **A0** | `share` |
| `sleep` | **A0** | `sleep` |
| `study` | **A0** | `study` |
| `take` | **A0** | `take` |
| `teach` | **A0** | `teach` |
| `understand` | **A0** | `understand` |
| `use` | **A0** | `use` |
| `wash` | **A0** | `wash` |
| `wear` | **A0** | `wear` |
| `act` | **A1** | `act` |
| `adapt to` | **A1** | `adapt to` |
| `advise` | **A1** | `advise` |
| `argue with` | **A1** | `argue with` |
| `balance` | **A1** | `balance` |
| `be able to` | **A1** | `be able to` |
| `be afraid of` | **A1** | `be afraid of` |
| `be bad at` | **A1** | `be bad at` |
| `be excited about` | **A1** | `be excited about` |
| `be good at` | **A1** | `be good at` |
| `be happy about` | **A1** | `be happy about` |
| `be interested in` | **A1** | `be interested in` |
| `be interested in learning` | **A1** | `be interested in learning` |
| `be part of` | **A1** | `be part of` |
| `be ready for` | **A1** | `be ready for` |
| `be ready to` | **A1** | `be ready to` |
| `be sad about` | **A1** | `be sad about` |
| `be surprised by` | **A1** | `be surprised by` |
| `be tired of` | **A1** | `be tired of` |
| `be worried about` | **A1** | `be worried about` |
| `become` | **A1** | `become` |
| `become interested in` | **A1** | `become interested in` |
| `behave well` | **A1** | `behave well` |
| `blame for` | **A1** | `blame for` |
| `block` | **A1** | `block` |
| `break` | **A1** | `break` |
| `bring from` | **A1** | `bring from` |
| `bring to` | **A1** | `bring to` |
| `buy from` | **A1** | `buy from` |
| `change` | **A1** | `change` |
| `change into` | **A1** | `change into` |
| `change something about` | **A1** | `change something about` |
| `change your mind` | **A1** | `change your mind` |
| `change yourself` | **A1** | `change yourself` |
| `check on` | **A1** | `check on` |
| `choose` | **A1** | `choose` |
| `choose between` | **A1** | `choose between` |
| `comment on` | **A1** | `comment on` |
| `communicate with` | **A1** | `communicate with` |
| `compare with` | **A1** | `compare with` |
| `connect to` | **A1** | `connect to` |
| `control yourself` | **A1** | `control yourself` |
| `create` | **A1** | `create` |
| `cure` | **A1** | `cure` |
| `decide` | **A1** | `decide` |
| `decide about` | **A1** | `decide about` |
| `decide on` | **A1** | `decide on` |
| `decide to` | **A1** | `decide to` |
| `deny` | **A1** | `deny` |
| `describe` | **A1** | `describe` |
| `develop` | **A1** | `develop` |
| `develop into` | **A1** | `develop into` |
| `develop yourself` | **A1** | `develop yourself` |
| `disagree about` | **A1** | `disagree about` |
| `disagree with` | **A1** | `disagree with` |
| `disappear` | **A1** | `disappear` |
| `discover` | **A1** | `discover` |
| `discover yourself` | **A1** | `discover yourself` |
| `download from` | **A1** | `download from` |
| `drive to` | **A1** | `drive to` |
| `earn` | **A1** | `earn` |
| `enjoy doing` | **A1** | `enjoy doing` |
| `exist` | **A1** | `exist` |
| `expect` | **A1** | `expect` |
| `experience` | **A1** | `experience` |
| `explore` | **A1** | `explore` |
| `express` | **A1** | `express` |
| `express yourself` | **A1** | `express yourself` |
| `face` | **A1** | `face` |
| `fear` | **A1** | `fear` |
| `feel better` | **A1** | `feel better` |
| `feel like doing` | **A1** | `feel like doing` |
| `feel sad` | **A1** | `feel sad` |
| `find something` | **A1** | `find something` |
| `finish doing` | **A1** | `finish doing` |
| `finish work` | **A1** | `finish work` |
| `forget to` | **A1** | `forget to` |
| `forgive` | **A1** | `forgive` |
| `forgive for` | **A1** | `forgive for` |
| `grow as` | **A1** | `grow as` |
| `grow into` | **A1** | `grow into` |
| `happen` | **A1** | `happen` |
| `hate` | **A1** | `hate` |
| `have to` | **A1** | `have to` |
| `help someone` | **A1** | `help someone` |
| `help someone with` | **A1** | `help someone with` |
| `help someone with something` | **A1** | `help someone with something` |
| `help with` | **A1** | `help with` |
| `imagine` | **A1** | `imagine` |
| `improve at` | **A1** | `improve at` |
| `improve yourself` | **A1** | `improve yourself` |
| `introduce someone to someone` | **A1** | `introduce someone to someone` |
| `invite to` | **A1** | `invite to` |
| `join` | **A1** | `join` |
| `know about` | **A1** | `know about` |
| `lead` | **A1** | `lead` |
| `learn a language` | **A1** | `learn a language` |
| `learn about` | **A1** | `learn about` |
| `learn from` | **A1** | `learn from` |
| `learn to` | **A1** | `learn to` |
| `log in` | **A1** | `log in` |
| `log in to` | **A1** | `log in to` |
| `log out` | **A1** | `log out` |
| `love doing` | **A1** | `love doing` |
| `matter` | **A1** | `matter` |
| `meet at` | **A1** | `meet at` |
| `meet someone` | **A1** | `meet someone` |
| `meet with someone` | **A1** | `meet with someone` |
| `miss` | **A1** | `miss` |
| `move to` | **A1** | `move to` |
| `move towards` | **A1** | `move towards` |
| `notice` | **A1** | `notice` |
| `plan to` | **A1** | `plan to` |
| `practise speaking` | **A1** | `practise speaking` |
| `practise with` | **A1** | `practise with` |
| `predict` | **A1** | `predict` |
| `prevent` | **A1** | `prevent` |
| `promise` | **A1** | `promise` |
| `prove` | **A1** | `prove` |
| `put into` | **A1** | `put into` |
| `put something on` | **A1** | `put something on` |
| `realize` | **A1** | `realize` |
| `regret` | **A1** | `regret` |
| `remember to` | **A1** | `remember to` |
| `remind of` | **A1** | `remind of` |
| `repeat after` | **A1** | `repeat after` |
| `save from` | **A1** | `save from` |
| `save money for` | **A1** | `save money for` |
| `save time` | **A1** | `save time` |
| `say` | **A1** | `say` |
| `se sentir` | **A1** | `se sentir` |
| `seem` | **A1** | `seem` |
| `sell to` | **A1** | `sell to` |
| `send something to someone` | **A1** | `send something to someone` |
| `sentirsi` | **A1** | `sentirsi` |
| `share with` | **A1** | `share with` |
| `show` | **A1** | `show` |
| `show something to someone` | **A1** | `show something to someone` |
| `sign up for` | **A1** | `sign up for` |
| `sleep at` | **A1** | `sleep at` |
| `spend money on` | **A1** | `spend money on` |
| `spend time on` | **A1** | `spend time on` |
| `spend time with` | **A1** | `spend time with` |
| `start a job` | **A1** | `start a job` |
| `start doing` | **A1** | `start doing` |
| `study at` | **A1** | `study at` |
| `study for` | **A1** | `study for` |
| `subscribe to` | **A1** | `subscribe to` |
| `take from` | **A1** | `take from` |
| `tell` | **A1** | `tell` |
| `train` | **A1** | `train` |
| `translate from` | **A1** | `translate from` |
| `translate into` | **A1** | `translate into` |
| `treat` | **A1** | `treat` |
| `try to` | **A1** | `try to` |
| `try to be` | **A1** | `try to be` |
| `turn into` | **A1** | `turn into` |
| `upload` | **A1** | `upload` |
| `upload to` | **A1** | `upload to` |
| `volere + infinitive` | **A1** | `volere + infinitive` |
| `walk to` | **A1** | `walk to` |
| `waste time` | **A1** | `waste time` |
| `watch` | **A1** | `watch` |
| `write to someone` | **A1** | `write to someone` |
| `κάνω` | **A1** | `κάνω` |
| `носить` | **A1** | `носить` |
| `участвовать в` | **A1** | `участвовать в` |

### Lower Quality Engine Entries
*No lower quality entries detected. All matched entries satisfy core schema quality requirements.*

---

## English Irregular Verbs Engine
**Target Dataset File**: `tools/en/irregular-verbs/data/verbs.json`

### Coverage Statistics
- **Total Source Concepts Evaluated**: `354`
- **Present in Engine**: `108` (A0: `26`, A1: `82`)
- **Genuinely Missing**: `246` (A0: `42`, A1: `204`)
- **Lower Quality Engine Entries**: `0`

### Present Concepts (Covered)
| Source Concept Key | Level | Matched Key in Engine |
| :--- | :---: | :--- |
| `be` | **A0** | `be` |
| `be able to` | **A1** | `be` |
| `be afraid of` | **A1** | `be` |
| `be bad at` | **A1** | `be` |
| `be excited about` | **A1** | `be` |
| `be good at` | **A1** | `be` |
| `be happy about` | **A1** | `be` |
| `be interested in` | **A1** | `be` |
| `be interested in learning` | **A1** | `be` |
| `be part of` | **A1** | `be` |
| `be ready for` | **A1** | `be` |
| `be ready to` | **A1** | `be` |
| `be sad about` | **A1** | `be` |
| `be surprised by` | **A1** | `be` |
| `be tired of` | **A1** | `be` |
| `be worried about` | **A1** | `be` |
| `become` | **A1** | `become` |
| `become interested in` | **A1** | `become` |
| `break` | **A1** | `break` |
| `bring from` | **A1** | `bring` |
| `bring to` | **A1** | `bring` |
| `buy` | **A0** | `buy` |
| `buy from` | **A1** | `buy` |
| `choose` | **A1** | `choose` |
| `choose between` | **A1** | `choose` |
| `come from` | **A1** | `come` |
| `come from someone` | **A1** | `come` |
| `come out of` | **A1** | `come` |
| `come to` | **A1** | `come` |
| `deal with` | **A1** | `deal` |
| `do make` | **A0** | `do` |
| `dream about` | **A1** | `dream` |
| `dream of` | **A1** | `dream` |
| `drink` | **A0** | `drink` |
| `drive to` | **A1** | `drive` |
| `eat` | **A0** | `eat` |
| `feel` | **A0** | `feel` |
| `feel better` | **A1** | `feel` |
| `feel like doing` | **A1** | `feel` |
| `feel sad` | **A1** | `feel` |
| `find something` | **A1** | `find` |
| `forget` | **A0** | `forget` |
| `forget to` | **A1** | `forget` |
| `forgive` | **A1** | `forgive` |
| `forgive for` | **A1** | `forgive` |
| `get` | **A0** | `get` |
| `get better at` | **A1** | `get` |
| `get into` | **A1** | `get` |
| `get out of` | **A1** | `get` |
| `get to know` | **A1** | `get` |
| `get up` | **A1** | `get` |
| `get used to` | **A1** | `get` |
| `give` | **A0** | `give` |
| `go back to` | **A1** | `go` |
| `go into` | **A1** | `go` |
| `go to` | **A1** | `go` |
| `go to someone` | **A1** | `go` |
| `grow as` | **A1** | `grow` |
| `grow into` | **A1** | `grow` |
| `have` | **A0** | `have` |
| `have fun` | **A0** | `have` |
| `have to` | **A1** | `have` |
| `know` | **A0** | `know` |
| `know about` | **A1** | `know` |
| `lead` | **A1** | `lead` |
| `lead to` | **A1** | `lead` |
| `learn` | **A0** | `learn` |
| `learn a language` | **A1** | `learn` |
| `learn about` | **A1** | `learn` |
| `learn from` | **A1** | `learn` |
| `learn to` | **A1** | `learn` |
| `leave a place` | **A1** | `leave` |
| `leave exit` | **A1** | `leave` |
| `mean` | **A0** | `mean` |
| `meet` | **A0** | `meet` |
| `meet at` | **A1** | `meet` |
| `meet someone` | **A1** | `meet` |
| `meet with someone` | **A1** | `meet` |
| `pay` | **A0** | `pay` |
| `pay for` | **A1** | `pay` |
| `prove` | **A1** | `prove` |
| `put` | **A0** | `put` |
| `put into` | **A1** | `put` |
| `put on` | **A0** | `put` |
| `put something on` | **A1** | `put` |
| `say` | **A1** | `say` |
| `sell to` | **A1** | `sell` |
| `send` | **A0** | `send` |
| `send something to someone` | **A1** | `send` |
| `sleep` | **A0** | `sleep` |
| `sleep at` | **A1** | `sleep` |
| `speak about` | **A1** | `speak` |
| `speak with` | **A1** | `speak` |
| `spend money on` | **A1** | `spend` |
| `spend time on` | **A1** | `spend` |
| `spend time with` | **A1** | `spend` |
| `take` | **A0** | `take` |
| `take care of` | **A1** | `take` |
| `take from` | **A1** | `take` |
| `take off` | **A0** | `take` |
| `teach` | **A0** | `teach` |
| `tell` | **A1** | `tell` |
| `think about` | **A1** | `think` |
| `think of` | **A1** | `think` |
| `understand` | **A0** | `understand` |
| `wake up` | **A0** | `wake` |
| `wear` | **A0** | `wear` |
| `write to someone` | **A1** | `write` |

### Genuinely Missing Concepts
| Missing Concept Key | Implied CEFR Level | Source Term / Equivalent |
| :--- | :---: | :--- |
| `believe` | **A0** | `believe` |
| `check` | **A0** | `check` |
| `click` | **A0** | `click` |
| `connect` | **A0** | `connect` |
| `cook` | **A0** | `cook` |
| `correct` | **A0** | `correct` |
| `cry` | **A0** | `cry` |
| `delete` | **A0** | `delete` |
| `download` | **A0** | `download` |
| `enjoy` | **A0** | `enjoy` |
| `exercise` | **A0** | `exercise` |
| `fare male` | **A0** | `fare male` |
| `fear be afraid` | **A0** | `fear / be afraid` |
| `follow` | **A0** | `follow` |
| `hope` | **A0** | `hope` |
| `improve` | **A0** | `improve` |
| `invite` | **A0** | `invite` |
| `laugh` | **A0** | `laugh` |
| `like` | **A0** | `like` |
| `love` | **A0** | `love` |
| `miss someonesomething` | **A0** | `miss someone/something` |
| `need` | **A0** | `need` |
| `pensare` | **A0** | `pensare` |
| `plan` | **A0** | `plan` |
| `practise` | **A0** | `practise` |
| `prepare` | **A0** | `prepare` |
| `receive` | **A0** | `receive` |
| `relax` | **A0** | `relax` |
| `remember` | **A0** | `remember` |
| `rest` | **A0** | `rest` |
| `save` | **A0** | `save` |
| `search` | **A0** | `search` |
| `share` | **A0** | `share` |
| `smile` | **A0** | `smile` |
| `study` | **A0** | `study` |
| `trust` | **A0** | `trust` |
| `use` | **A0** | `use` |
| `visit` | **A0** | `visit` |
| `want` | **A0** | `want` |
| `wash` | **A0** | `wash` |
| `work` | **A0** | `work` |
| `worry` | **A0** | `worry` |
| `accept` | **A1** | `accept` |
| `accept yourself` | **A1** | `accept yourself` |
| `access` | **A1** | `access` |
| `achieve` | **A1** | `achieve` |
| `act` | **A1** | `act` |
| `adapt to` | **A1** | `adapt to` |
| `advise` | **A1** | `advise` |
| `agree on` | **A1** | `agree on` |
| `agree that` | **A1** | `agree that` |
| `agree with` | **A1** | `agree with` |
| `answer` | **A1** | `answer` |
| `answer someone` | **A1** | `answer someone` |
| `apologize for` | **A1** | `apologize for` |
| `apologize to` | **A1** | `apologize to` |
| `appear` | **A1** | `appear` |
| `apply for` | **A1** | `apply for` |
| `argue with` | **A1** | `argue with` |
| `arrive at` | **A1** | `arrive at` |
| `arrive from` | **A1** | `arrive from` |
| `ask about` | **A1** | `ask about` |
| `ask for` | **A1** | `ask for` |
| `ask someone for something` | **A1** | `ask someone for something` |
| `avoid` | **A1** | `avoid` |
| `balance` | **A1** | `balance` |
| `behave well` | **A1** | `behave well` |
| `believe in` | **A1** | `believe in` |
| `belong to` | **A1** | `belong to` |
| `blame for` | **A1** | `blame for` |
| `block` | **A1** | `block` |
| `call` | **A1** | `call` |
| `call someone` | **A1** | `call someone` |
| `care about` | **A1** | `care about` |
| `cause` | **A1** | `cause` |
| `change` | **A1** | `change` |
| `change into` | **A1** | `change into` |
| `change something about` | **A1** | `change something about` |
| `change your mind` | **A1** | `change your mind` |
| `change yourself` | **A1** | `change yourself` |
| `check on` | **A1** | `check on` |
| `comment on` | **A1** | `comment on` |
| `communicate with` | **A1** | `communicate with` |
| `compare with` | **A1** | `compare with` |
| `complain about` | **A1** | `complain about` |
| `concentrate on` | **A1** | `concentrate on` |
| `connect to` | **A1** | `connect to` |
| `consider` | **A1** | `consider` |
| `contact` | **A1** | `contact` |
| `continue doing` | **A1** | `continue doing` |
| `contribute to` | **A1** | `contribute to` |
| `control yourself` | **A1** | `control yourself` |
| `create` | **A1** | `create` |
| `cure` | **A1** | `cure` |
| `decide` | **A1** | `decide` |
| `decide about` | **A1** | `decide about` |
| `decide on` | **A1** | `decide on` |
| `decide to` | **A1** | `decide to` |
| `deny` | **A1** | `deny` |
| `depend on` | **A1** | `depend on` |
| `describe` | **A1** | `describe` |
| `develop` | **A1** | `develop` |
| `develop into` | **A1** | `develop into` |
| `develop yourself` | **A1** | `develop yourself` |
| `disagree about` | **A1** | `disagree about` |
| `disagree with` | **A1** | `disagree with` |
| `disappear` | **A1** | `disappear` |
| `discover` | **A1** | `discover` |
| `discover yourself` | **A1** | `discover yourself` |
| `discuss` | **A1** | `discuss` |
| `download from` | **A1** | `download from` |
| `earn` | **A1** | `earn` |
| `enjoy doing` | **A1** | `enjoy doing` |
| `enter` | **A1** | `enter` |
| `exist` | **A1** | `exist` |
| `expect` | **A1** | `expect` |
| `experience` | **A1** | `experience` |
| `explain something to someone` | **A1** | `explain something to someone` |
| `explain to` | **A1** | `explain to` |
| `explain why` | **A1** | `explain why` |
| `explore` | **A1** | `explore` |
| `express` | **A1** | `express` |
| `express yourself` | **A1** | `express yourself` |
| `face` | **A1** | `face` |
| `fail at` | **A1** | `fail at` |
| `fear` | **A1** | `fear` |
| `finish doing` | **A1** | `finish doing` |
| `finish work` | **A1** | `finish work` |
| `focus on` | **A1** | `focus on` |
| `follow someone` | **A1** | `follow someone` |
| `happen` | **A1** | `happen` |
| `hate` | **A1** | `hate` |
| `help someone` | **A1** | `help someone` |
| `help someone with` | **A1** | `help someone with` |
| `help someone with something` | **A1** | `help someone with something` |
| `help with` | **A1** | `help with` |
| `hope for` | **A1** | `hope for` |
| `hope to` | **A1** | `hope to` |
| `imagine` | **A1** | `imagine` |
| `improve at` | **A1** | `improve at` |
| `improve yourself` | **A1** | `improve yourself` |
| `increase` | **A1** | `increase` |
| `influence` | **A1** | `influence` |
| `introduce someone to someone` | **A1** | `introduce someone to someone` |
| `invite to` | **A1** | `invite to` |
| `join` | **A1** | `join` |
| `listen to` | **A1** | `listen to` |
| `listen to someone` | **A1** | `listen to someone` |
| `live abroad` | **A1** | `live abroad` |
| `live in` | **A1** | `live in` |
| `live with` | **A1** | `live with` |
| `log in` | **A1** | `log in` |
| `log in to` | **A1** | `log in to` |
| `log out` | **A1** | `log out` |
| `look after` | **A1** | `look after` |
| `look at` | **A1** | `look at` |
| `look for` | **A1** | `look for` |
| `look forward to` | **A1** | `look forward to` |
| `love doing` | **A1** | `love doing` |
| `manage` | **A1** | `manage` |
| `matter` | **A1** | `matter` |
| `message` | **A1** | `message` |
| `miss` | **A1** | `miss` |
| `move to` | **A1** | `move to` |
| `move towards` | **A1** | `move towards` |
| `need to` | **A1** | `need to` |
| `notice` | **A1** | `notice` |
| `plan to` | **A1** | `plan to` |
| `practise speaking` | **A1** | `practise speaking` |
| `practise with` | **A1** | `practise with` |
| `predict` | **A1** | `predict` |
| `prepare for` | **A1** | `prepare for` |
| `prevent` | **A1** | `prevent` |
| `prevent from` | **A1** | `prevent from` |
| `promise` | **A1** | `promise` |
| `protect` | **A1** | `protect` |
| `protect from` | **A1** | `protect from` |
| `realize` | **A1** | `realize` |
| `recover from` | **A1** | `recover from` |
| `reduce` | **A1** | `reduce` |
| `refuse` | **A1** | `refuse` |
| `regret` | **A1** | `regret` |
| `rely on` | **A1** | `rely on` |
| `remember to` | **A1** | `remember to` |
| `remind of` | **A1** | `remind of` |
| `repeat after` | **A1** | `repeat after` |
| `reply to` | **A1** | `reply to` |
| `respect` | **A1** | `respect` |
| `return to` | **A1** | `return to` |
| `save from` | **A1** | `save from` |
| `save money for` | **A1** | `save money for` |
| `save time` | **A1** | `save time` |
| `se sentir` | **A1** | `se sentir` |
| `search for` | **A1** | `search for` |
| `search through` | **A1** | `search through` |
| `seem` | **A1** | `seem` |
| `sentirsi` | **A1** | `sentirsi` |
| `share with` | **A1** | `share with` |
| `show` | **A1** | `show` |
| `show something to someone` | **A1** | `show something to someone` |
| `sign up for` | **A1** | `sign up for` |
| `solve` | **A1** | `solve` |
| `start a job` | **A1** | `start a job` |
| `start doing` | **A1** | `start doing` |
| `stay at` | **A1** | `stay at` |
| `stop doing` | **A1** | `stop doing` |
| `study at` | **A1** | `study at` |
| `study for` | **A1** | `study for` |
| `subscribe to` | **A1** | `subscribe to` |
| `succeed in` | **A1** | `succeed in` |
| `suffer from` | **A1** | `suffer from` |
| `support` | **A1** | `support` |
| `talk about` | **A1** | `talk about` |
| `talk about someone` | **A1** | `talk about someone` |
| `talk about something` | **A1** | `talk about something` |
| `talk to someone` | **A1** | `talk to someone` |
| `talk with someone` | **A1** | `talk with someone` |
| `thank for` | **A1** | `thank for` |
| `train` | **A1** | `train` |
| `translate from` | **A1** | `translate from` |
| `translate into` | **A1** | `translate into` |
| `travel by bus take a bus` | **A1** | `travel by bus / take a bus` |
| `travel by plane` | **A1** | `travel by plane` |
| `travel by train` | **A1** | `travel by train` |
| `travel to` | **A1** | `travel to` |
| `treat` | **A1** | `treat` |
| `try to` | **A1** | `try to` |
| `try to be` | **A1** | `try to be` |
| `turn into` | **A1** | `turn into` |
| `upload` | **A1** | `upload` |
| `upload to` | **A1** | `upload to` |
| `volere + infinitive` | **A1** | `volere + infinitive` |
| `wait for` | **A1** | `wait for` |
| `wait for someone` | **A1** | `wait for someone` |
| `walk to` | **A1** | `walk to` |
| `warn about` | **A1** | `warn about` |
| `waste time` | **A1** | `waste time` |
| `watch` | **A1** | `watch` |
| `work at` | **A1** | `work at` |
| `work for` | **A1** | `work for` |
| `work on` | **A1** | `work on` |
| `work with` | **A1** | `work with` |
| `worry about` | **A1** | `worry about` |
| `κάνω` | **A1** | `κάνω` |
| `носить` | **A1** | `носить` |
| `участвовать в` | **A1** | `участвовать в` |

### Lower Quality Engine Entries
*No lower quality entries detected. All matched entries satisfy core schema quality requirements.*

---

## French Prepositional Regime Engine
**Target Dataset File**: `tools/fr/regime/data/verbs.json`

### Coverage Statistics
- **Total Source Concepts Evaluated**: `354`
- **Present in Engine**: `118` (A0: `17`, A1: `101`)
- **Genuinely Missing**: `236` (A0: `51`, A1: `185`)
- **Lower Quality Engine Entries**: `0`

### Present Concepts (Covered)
| Source Concept Key | Level | Matched Key in Engine |
| :--- | :---: | :--- |
| `adapt to` | **A1** | `s'adapter` |
| `answer` | **A1** | `répondre` |
| `answer someone` | **A1** | `répondre` |
| `apologize for` | **A1** | `s'excuser` |
| `apologize to` | **A1** | `s'excuser` |
| `ask about` | **A1** | `demander` |
| `ask for` | **A1** | `demander` |
| `ask someone for something` | **A1** | `demander` |
| `be interested in` | **A1** | `s'intéresser à` |
| `be interested in learning` | **A1** | `s'intéresser` |
| `be worried about` | **A1** | `s'inquiéter` |
| `become interested in` | **A1** | `s'intéresser à` |
| `buy from` | **A1** | `acheter` |
| `change` | **A1** | `changer` |
| `change into` | **A1** | `changer` |
| `change something about` | **A1** | `changer` |
| `change your mind` | **A1** | `changer` |
| `change yourself` | **A1** | `changer` |
| `come from` | **A1** | `venir` |
| `come from someone` | **A1** | `venir` |
| `come to` | **A1** | `venir` |
| `contact` | **A1** | `contacter` |
| `continue doing` | **A1** | `continuer` |
| `contribute to` | **A1** | `contribuer` |
| `deal with` | **A1** | `s'occuper` |
| `decide` | **A1** | `décider` |
| `decide about` | **A1** | `décider` |
| `decide on` | **A1** | `décider` |
| `decide to` | **A1** | `décider` |
| `depend on` | **A1** | `dépendre` |
| `eat` | **A0** | `manger` |
| `enjoy` | **A0** | `profiter` |
| `enjoy doing` | **A1** | `aimer` |
| `expect` | **A1** | `s'attendre` |
| `fear be afraid` | **A0** | `avoir peur` |
| `feel better` | **A1** | `aller` |
| `finish doing` | **A1** | `finir` |
| `finish work` | **A1** | `finir` |
| `forget` | **A0** | `oublier` |
| `forget to` | **A1** | `oublier` |
| `get to know` | **A1** | `apprendre` |
| `get used to` | **A1** | `s'habituer` |
| `go to` | **A1** | `aller` |
| `go to someone` | **A1** | `aller` |
| `hate` | **A1** | `détester` |
| `help someone` | **A1** | `aider` |
| `help someone with` | **A1** | `aider` |
| `help someone with something` | **A1** | `aider` |
| `help with` | **A1** | `aider` |
| `hope` | **A0** | `espérer` |
| `hope for` | **A1** | `espérer` |
| `hope to` | **A1** | `espérer` |
| `invite` | **A0** | `inviter` |
| `invite to` | **A1** | `inviter` |
| `learn` | **A0** | `apprendre` |
| `learn a language` | **A1** | `apprendre` |
| `learn about` | **A1** | `apprendre` |
| `learn from` | **A1** | `apprendre` |
| `learn to` | **A1** | `apprendre` |
| `like` | **A0** | `aimer` |
| `listen to` | **A1** | `écouter` |
| `listen to someone` | **A1** | `écouter` |
| `live in` | **A1** | `habiter` |
| `look after` | **A1** | `s'occuper` |
| `look at` | **A1** | `regarder` |
| `look for` | **A1** | `chercher` |
| `love` | **A0** | `aimer` |
| `love doing` | **A1** | `aimer` |
| `matter` | **A1** | `compter` |
| `mean` | **A0** | `vouloir` |
| `meet` | **A0** | `rencontrer` |
| `meet someone` | **A1** | `rencontrer` |
| `meet with someone` | **A1** | `rencontrer` |
| `miss` | **A1** | `manquer` |
| `miss someonesomething` | **A0** | `manquer` |
| `move towards` | **A1** | `aller` |
| `pay` | **A0** | `payer` |
| `pay for` | **A1** | `payer` |
| `promise` | **A1** | `promettre` |
| `refuse` | **A1** | `refuser` |
| `rely on` | **A1** | `compter` |
| `remember to` | **A1** | `penser` |
| `remind of` | **A1** | `rappeler` |
| `reply to` | **A1** | `répondre` |
| `search` | **A0** | `chercher` |
| `search for` | **A1** | `chercher` |
| `search through` | **A1** | `chercher` |
| `speak about` | **A1** | `parler` |
| `speak with` | **A1** | `parler` |
| `start a job` | **A1** | `commencer` |
| `start doing` | **A1** | `commencer` |
| `stop doing` | **A1** | `arrêter` |
| `succeed in` | **A1** | `réussir` |
| `suffer from` | **A1** | `souffrir` |
| `take care of` | **A1** | `s'occuper` |
| `talk about` | **A1** | `parler` |
| `talk about someone` | **A1** | `parler` |
| `talk about something` | **A1** | `parler` |
| `talk to someone` | **A1** | `parler` |
| `talk with someone` | **A1** | `parler` |
| `thank for` | **A1** | `remercier` |
| `think about` | **A1** | `penser` |
| `think of` | **A1** | `penser` |
| `try to` | **A1** | `essayer` |
| `try to be` | **A1** | `essayer` |
| `visit` | **A0** | `visiter` |
| `wait for` | **A1** | `attendre` |
| `wait for someone` | **A1** | `attendre` |
| `walk to` | **A1** | `aller` |
| `want` | **A0** | `vouloir` |
| `watch` | **A1** | `regarder` |
| `work` | **A0** | `travailler` |
| `work at` | **A1** | `travailler` |
| `work for` | **A1** | `travailler` |
| `work on` | **A1** | `travailler` |
| `work with` | **A1** | `travailler` |
| `worry about` | **A1** | `s'inquiéter` |
| `участвовать в` | **A1** | `participer` |

### Genuinely Missing Concepts
| Missing Concept Key | Implied CEFR Level | Source Term / Equivalent |
| :--- | :---: | :--- |
| `be` | **A0** | `être` |
| `believe` | **A0** | `croire` |
| `buy` | **A0** | `buy` |
| `check` | **A0** | `vérifier` |
| `click` | **A0** | `cliquer` |
| `connect` | **A0** | `connecter / se connecter` |
| `cook` | **A0** | `cuisiner` |
| `correct` | **A0** | `corriger` |
| `cry` | **A0** | `pleurer` |
| `delete` | **A0** | `supprimer` |
| `do make` | **A0** | `faire` |
| `download` | **A0** | `télécharger` |
| `drink` | **A0** | `boire` |
| `exercise` | **A0** | `faire du sport` |
| `fare male` | **A0** | `fare male` |
| `feel` | **A0** | `se sentir` |
| `follow` | **A0** | `suivre` |
| `get` | **A0** | `obtenir / recevoir` |
| `give` | **A0** | `donner` |
| `have` | **A0** | `avoir` |
| `have fun` | **A0** | `s’amuser` |
| `improve` | **A0** | `améliorer` |
| `know` | **A0** | `savoir` |
| `laugh` | **A0** | `rire` |
| `need` | **A0** | `avoir besoin de` |
| `pensare` | **A0** | `pensare` |
| `plan` | **A0** | `planifier` |
| `practise` | **A0** | `pratiquer` |
| `prepare` | **A0** | `préparer` |
| `put` | **A0** | `mettre` |
| `put on` | **A0** | `mettre` |
| `receive` | **A0** | `recevoir` |
| `relax` | **A0** | `se détendre` |
| `remember` | **A0** | `se souvenir de` |
| `rest` | **A0** | `se reposer` |
| `save` | **A0** | `enregistrer` |
| `send` | **A0** | `envoyer` |
| `share` | **A0** | `partager` |
| `sleep` | **A0** | `dormir` |
| `smile` | **A0** | `sourire` |
| `study` | **A0** | `étudier` |
| `take` | **A0** | `prendre` |
| `take off` | **A0** | `enlever` |
| `teach` | **A0** | `enseigner` |
| `trust` | **A0** | `faire confiance` |
| `understand` | **A0** | `comprendre` |
| `use` | **A0** | `utiliser` |
| `wake up` | **A0** | `se réveiller` |
| `wash` | **A0** | `laver / se laver` |
| `wear` | **A0** | `porter` |
| `worry` | **A0** | `s’inquiéter` |
| `accept` | **A1** | `accepter` |
| `accept yourself` | **A1** | `s'accepter` |
| `access` | **A1** | `accéder à` |
| `achieve` | **A1** | `atteindre` |
| `act` | **A1** | `agir / se comporter` |
| `advise` | **A1** | `conseiller` |
| `agree on` | **A1** | `se mettre d'accord sur` |
| `agree that` | **A1** | `reconnaître que` |
| `agree with` | **A1** | `être d'accord avec` |
| `appear` | **A1** | `apparaître` |
| `apply for` | **A1** | `postuler à` |
| `argue with` | **A1** | `se disputer avec` |
| `arrive at` | **A1** | `arriver à` |
| `arrive from` | **A1** | `arriver de` |
| `avoid` | **A1** | `éviter` |
| `balance` | **A1** | `équilibrer` |
| `be able to` | **A1** | `pouvoir` |
| `be afraid of` | **A1** | `avoir peur de` |
| `be bad at` | **A1** | `être mauvais en` |
| `be excited about` | **A1** | `être enthousiaste à propos de` |
| `be good at` | **A1** | `être bon en` |
| `be happy about` | **A1** | `être heureux de` |
| `be part of` | **A1** | `faire partie de` |
| `be ready for` | **A1** | `être prêt pour` |
| `be ready to` | **A1** | `être prêt à` |
| `be sad about` | **A1** | `être triste à cause de` |
| `be surprised by` | **A1** | `être surpris par` |
| `be tired of` | **A1** | `en avoir marre de` |
| `become` | **A1** | `devenir` |
| `behave well` | **A1** | `bien se comporter` |
| `believe in` | **A1** | `croire en` |
| `belong to` | **A1** | `appartenir à` |
| `blame for` | **A1** | `blâmer pour` |
| `block` | **A1** | `bloquer` |
| `break` | **A1** | `abandonner` |
| `bring from` | **A1** | `apporter de` |
| `bring to` | **A1** | `apporter à` |
| `call` | **A1** | `appeler` |
| `call someone` | **A1** | `appeler quelqu'un` |
| `care about` | **A1** | `se soucier de` |
| `cause` | **A1** | `causer` |
| `check on` | **A1** | `vérifier comment va` |
| `choose` | **A1** | `choisir` |
| `choose between` | **A1** | `choisir entre` |
| `come out of` | **A1** | `sortir de` |
| `comment on` | **A1** | `commenter` |
| `communicate with` | **A1** | `communiquer avec` |
| `compare with` | **A1** | `comparer avec` |
| `complain about` | **A1** | `se plaindre de` |
| `concentrate on` | **A1** | `se concentrer sur` |
| `connect to` | **A1** | `se connecter à` |
| `consider` | **A1** | `considérer` |
| `control yourself` | **A1** | `se contrôler` |
| `create` | **A1** | `créer` |
| `cure` | **A1** | `guérir` |
| `deny` | **A1** | `nier` |
| `describe` | **A1** | `décrire` |
| `develop` | **A1** | `développer` |
| `develop into` | **A1** | `évoluer vers` |
| `develop yourself` | **A1** | `se développer` |
| `disagree about` | **A1** | `être en désaccord sur` |
| `disagree with` | **A1** | `ne pas être d'accord avec` |
| `disappear` | **A1** | `disparaître` |
| `discover` | **A1** | `découvrir` |
| `discover yourself` | **A1** | `se découvrir` |
| `discuss` | **A1** | `discuter de` |
| `download from` | **A1** | `télécharger depuis` |
| `dream about` | **A1** | `rêver de` |
| `dream of` | **A1** | `rêver de` |
| `drive to` | **A1** | `conduire jusqu'à` |
| `earn` | **A1** | `gagner` |
| `enter` | **A1** | `entrer dans` |
| `exist` | **A1** | `exister` |
| `experience` | **A1** | `découvrir / vivre` |
| `explain something to someone` | **A1** | `expliquer quelque chose à quelqu'un` |
| `explain to` | **A1** | `expliquer à` |
| `explain why` | **A1** | `expliquer pourquoi` |
| `explore` | **A1** | `explorer` |
| `express` | **A1** | `exprimer` |
| `express yourself` | **A1** | `s'exprimer` |
| `face` | **A1** | `faire face à` |
| `fail at` | **A1** | `échouer dans` |
| `fear` | **A1** | `avoir peur de` |
| `feel like doing` | **A1** | `avoir envie de faire` |
| `feel sad` | **A1** | `être triste` |
| `find something` | **A1** | `trouver quelque chose` |
| `focus on` | **A1** | `se concentrer sur` |
| `follow someone` | **A1** | `suivre quelqu'un` |
| `forgive` | **A1** | `pardonner` |
| `forgive for` | **A1** | `pardonner pour` |
| `get better at` | **A1** | `devenir meilleur en` |
| `get into` | **A1** | `monter dans` |
| `get out of` | **A1** | `sortir de` |
| `get up` | **A1** | `GET UP` |
| `go back to` | **A1** | `retourner à` |
| `go into` | **A1** | `entrer dans` |
| `grow as` | **A1** | `évoluer en tant que` |
| `grow into` | **A1** | `devenir progressivement` |
| `happen` | **A1** | `arriver` |
| `have to` | **A1** | `devoir` |
| `imagine` | **A1** | `imaginer` |
| `improve at` | **A1** | `s'améliorer en` |
| `improve yourself` | **A1** | `s'améliorer` |
| `increase` | **A1** | `augmenter` |
| `influence` | **A1** | `influencer` |
| `introduce someone to someone` | **A1** | `présenter quelqu'un à quelqu'un` |
| `join` | **A1** | `rejoindre / participer à` |
| `know about` | **A1** | `savoir quelque chose sur` |
| `lead` | **A1** | `diriger` |
| `lead to` | **A1** | `mener à` |
| `leave a place` | **A1** | `quitter un endroit` |
| `leave exit` | **A1** | `sortir de` |
| `live abroad` | **A1** | `vivre à l'étranger` |
| `live with` | **A1** | `vivre avec` |
| `log in` | **A1** | `se connecter` |
| `log in to` | **A1** | `se connecter à` |
| `log out` | **A1** | `se déconnecter` |
| `look forward to` | **A1** | `avoir hâte de` |
| `manage` | **A1** | `gérer` |
| `meet at` | **A1** | `se retrouver à` |
| `message` | **A1** | `envoyer un message à` |
| `move to` | **A1** | `déménager dans` |
| `need to` | **A1** | `avoir besoin de` |
| `notice` | **A1** | `remarquer` |
| `plan to` | **A1** | `prévoir de` |
| `practise speaking` | **A1** | `pratiquer l'expression orale` |
| `practise with` | **A1** | `pratiquer avec` |
| `predict` | **A1** | `prédire` |
| `prepare for` | **A1** | `se préparer à` |
| `prevent` | **A1** | `empêcher` |
| `prevent from` | **A1** | `empêcher de` |
| `protect` | **A1** | `protéger` |
| `protect from` | **A1** | `protéger de / contre` |
| `prove` | **A1** | `prouver` |
| `put into` | **A1** | `mettre dans` |
| `put something on` | **A1** | `mettre sur` |
| `realize` | **A1** | `se rendre compte de` |
| `recover from` | **A1** | `se remettre de` |
| `reduce` | **A1** | `réduire` |
| `regret` | **A1** | `regretter` |
| `repeat after` | **A1** | `répéter après` |
| `respect` | **A1** | `respecter` |
| `return to` | **A1** | `retourner à` |
| `save from` | **A1** | `sauver de` |
| `save money for` | **A1** | `économiser pour` |
| `save time` | **A1** | `gagner du temps` |
| `say` | **A1** | `dire` |
| `se sentir` | **A1** | `se sentir` |
| `seem` | **A1** | `sembler` |
| `sell to` | **A1** | `vendre à` |
| `send something to someone` | **A1** | `envoyer quelque chose à quelqu'un` |
| `sentirsi` | **A1** | `sentirsi` |
| `share with` | **A1** | `partager avec` |
| `show` | **A1** | `montrer` |
| `show something to someone` | **A1** | `montrer quelque chose à quelqu'un` |
| `sign up for` | **A1** | `s'inscrire à` |
| `sleep at` | **A1** | `dormir chez / à` |
| `solve` | **A1** | `résoudre` |
| `spend money on` | **A1** | `dépenser de l'argent pour` |
| `spend time on` | **A1** | `passer du temps à` |
| `spend time with` | **A1** | `passer du temps avec` |
| `stay at` | **A1** | `rester à` |
| `study at` | **A1** | `étudier à` |
| `study for` | **A1** | `étudier pour` |
| `subscribe to` | **A1** | `s'abonner à` |
| `support` | **A1** | `soutenir` |
| `take from` | **A1** | `prendre de` |
| `tell` | **A1** | `dire / raconter` |
| `train` | **A1** | `s'entraîner` |
| `translate from` | **A1** | `traduire de` |
| `translate into` | **A1** | `traduire en` |
| `travel by bus take a bus` | **A1** | `prendre le bus` |
| `travel by plane` | **A1** | `prendre l'avion` |
| `travel by train` | **A1** | `prendre le train` |
| `travel to` | **A1** | `voyager à / vers` |
| `treat` | **A1** | `traiter` |
| `turn into` | **A1** | `se transformer en` |
| `upload` | **A1** | `télécharger / mettre en ligne` |
| `upload to` | **A1** | `télécharger sur` |
| `volere + infinitive` | **A1** | `volere + infinitive` |
| `warn about` | **A1** | `avertir de` |
| `waste time` | **A1** | `perdre du temps` |
| `write to someone` | **A1** | `écrire à quelqu'un` |
| `κάνω` | **A1** | `κάνω` |
| `носить` | **A1** | `носить` |

### Lower Quality Engine Entries
*No lower quality entries detected. All matched entries satisfy core schema quality requirements.*

---

## French Conjugeur Engine
**Target Dataset File**: `tools/fr/conjugeur/data/verbs.json`

### Coverage Statistics
- **Total Source Concepts Evaluated**: `345`
- **Present in Engine**: `220` (A0: `45`, A1: `175`)
- **Genuinely Missing**: `125` (A0: `20`, A1: `105`)
- **Lower Quality Engine Entries**: `0`

### Present Concepts (Covered)
| Source Concept Key | Level | Matched Key in Engine |
| :--- | :---: | :--- |
| `accept` | **A1** | `accepter` |
| `agree on` | **A1** | `mettre` |
| `agree with` | **A1** | `être` |
| `answer` | **A1** | `répondre` |
| `answer someone` | **A1** | `répondre` |
| `apologize for` | **A1** | `s'excuser` |
| `apologize to` | **A1** | `s'excuser` |
| `arrive at` | **A1** | `arriver` |
| `arrive from` | **A1** | `arriver` |
| `ask about` | **A1** | `demander` |
| `ask for` | **A1** | `demander` |
| `ask someone for something` | **A1** | `demander` |
| `avoid` | **A1** | `éviter` |
| `be` | **A0** | `être` |
| `be able to` | **A1** | `pouvoir` |
| `be afraid of` | **A1** | `avoir` |
| `be bad at` | **A1** | `être` |
| `be excited about` | **A1** | `être` |
| `be good at` | **A1** | `être` |
| `be happy about` | **A1** | `être` |
| `be part of` | **A1** | `faire` |
| `be ready for` | **A1** | `être` |
| `be ready to` | **A1** | `être` |
| `be sad about` | **A1** | `être` |
| `be surprised by` | **A1** | `être` |
| `believe` | **A0** | `croire` |
| `believe in` | **A1** | `croire` |
| `bring from` | **A1** | `apporter` |
| `bring to` | **A1** | `apporter` |
| `buy from` | **A1** | `acheter` |
| `call` | **A1** | `appeler` |
| `call someone` | **A1** | `appeler` |
| `change` | **A1** | `changer` |
| `change into` | **A1** | `changer` |
| `change something about` | **A1** | `changer` |
| `change your mind` | **A1** | `changer` |
| `change yourself` | **A1** | `changer` |
| `choose` | **A1** | `choisir` |
| `choose between` | **A1** | `choisir` |
| `come from` | **A1** | `venir` |
| `come from someone` | **A1** | `venir` |
| `come out of` | **A1** | `sortir` |
| `come to` | **A1** | `venir` |
| `compare with` | **A1** | `comparer` |
| `consider` | **A1** | `considérer` |
| `continue doing` | **A1** | `continuer` |
| `cook` | **A0** | `cuisiner` |
| `correct` | **A0** | `corriger` |
| `create` | **A1** | `créer` |
| `cry` | **A0** | `pleurer` |
| `cure` | **A1** | `guérir` |
| `decide` | **A1** | `décider` |
| `decide about` | **A1** | `décider` |
| `decide on` | **A1** | `décider` |
| `decide to` | **A1** | `décider` |
| `disagree about` | **A1** | `être` |
| `discover` | **A1** | `découvrir` |
| `discover yourself` | **A1** | `découvrir` |
| `discuss` | **A1** | `discuter` |
| `do make` | **A0** | `faire` |
| `dream about` | **A1** | `rêver` |
| `dream of` | **A1** | `rêver` |
| `drink` | **A0** | `boire` |
| `earn` | **A1** | `gagner` |
| `eat` | **A0** | `manger` |
| `enjoy doing` | **A1** | `aimer` |
| `enter` | **A1** | `entrer` |
| `exercise` | **A0** | `faire` |
| `experience` | **A1** | `découvrir` |
| `explain something to someone` | **A1** | `expliquer` |
| `explain to` | **A1** | `expliquer` |
| `explain why` | **A1** | `expliquer` |
| `express` | **A1** | `exprimer` |
| `face` | **A1** | `faire` |
| `fear` | **A1** | `avoir` |
| `fear be afraid` | **A0** | `avoir` |
| `feel better` | **A1** | `aller` |
| `feel like doing` | **A1** | `avoir` |
| `feel sad` | **A1** | `être` |
| `find something` | **A1** | `trouver` |
| `finish doing` | **A1** | `finir` |
| `finish work` | **A1** | `finir` |
| `follow` | **A0** | `suivre` |
| `follow someone` | **A1** | `suivre` |
| `forget` | **A0** | `oublier` |
| `forget to` | **A1** | `oublier` |
| `get into` | **A1** | `monter` |
| `get out of` | **A1** | `sortir` |
| `get to know` | **A1** | `apprendre` |
| `give` | **A0** | `donner` |
| `go back to` | **A1** | `retourner` |
| `go into` | **A1** | `entrer` |
| `go to` | **A1** | `aller` |
| `go to someone` | **A1** | `aller` |
| `happen` | **A1** | `arriver` |
| `have` | **A0** | `avoir` |
| `have to` | **A1** | `devoir` |
| `help someone` | **A1** | `aider` |
| `help someone with` | **A1** | `aider` |
| `help someone with something` | **A1** | `aider` |
| `help with` | **A1** | `aider` |
| `hope` | **A0** | `espérer` |
| `hope for` | **A1** | `espérer` |
| `hope to` | **A1** | `espérer` |
| `imagine` | **A1** | `imaginer` |
| `introduce someone to someone` | **A1** | `présenter` |
| `invite` | **A0** | `inviter` |
| `invite to` | **A1** | `inviter` |
| `know` | **A0** | `savoir` |
| `know about` | **A1** | `savoir` |
| `lead to` | **A1** | `mener` |
| `learn` | **A0** | `apprendre` |
| `learn a language` | **A1** | `apprendre` |
| `learn about` | **A1** | `apprendre` |
| `learn from` | **A1** | `apprendre` |
| `learn to` | **A1** | `apprendre` |
| `leave a place` | **A1** | `quitter` |
| `leave exit` | **A1** | `sortir` |
| `like` | **A0** | `aimer` |
| `listen to` | **A1** | `écouter` |
| `listen to someone` | **A1** | `écouter` |
| `live abroad` | **A1** | `vivre` |
| `live in` | **A1** | `habiter` |
| `live with` | **A1** | `vivre` |
| `look at` | **A1** | `regarder` |
| `look for` | **A1** | `chercher` |
| `look forward to` | **A1** | `avoir` |
| `love` | **A0** | `aimer` |
| `love doing` | **A1** | `aimer` |
| `matter` | **A1** | `compter` |
| `mean` | **A0** | `vouloir` |
| `meet` | **A0** | `rencontrer` |
| `meet someone` | **A1** | `rencontrer` |
| `meet with someone` | **A1** | `rencontrer` |
| `message` | **A1** | `envoyer` |
| `miss` | **A1** | `manquer` |
| `miss someonesomething` | **A0** | `manquer` |
| `move towards` | **A1** | `aller` |
| `need` | **A0** | `avoir` |
| `need to` | **A1** | `avoir` |
| `notice` | **A1** | `remarquer` |
| `pay` | **A0** | `payer` |
| `pay for` | **A1** | `payer` |
| `plan to` | **A1** | `prévoir` |
| `prepare` | **A0** | `préparer` |
| `prepare for` | **A1** | `préparer` |
| `protect` | **A1** | `protéger` |
| `protect from` | **A1** | `protéger` |
| `put` | **A0** | `mettre` |
| `put into` | **A1** | `mettre` |
| `put on` | **A0** | `mettre` |
| `put something on` | **A1** | `mettre` |
| `realize` | **A1** | `rendre` |
| `receive` | **A0** | `recevoir` |
| `refuse` | **A1** | `refuser` |
| `regret` | **A1** | `regretter` |
| `rely on` | **A1** | `compter` |
| `remember` | **A0** | `se souvenir de` |
| `remember to` | **A1** | `penser` |
| `repeat after` | **A1** | `répéter` |
| `reply to` | **A1** | `répondre` |
| `rest` | **A0** | `reposer` |
| `return to` | **A1** | `retourner` |
| `save from` | **A1** | `sauver` |
| `save time` | **A1** | `gagner` |
| `say` | **A1** | `dire` |
| `search` | **A0** | `chercher` |
| `search for` | **A1** | `chercher` |
| `search through` | **A1** | `chercher` |
| `seem` | **A1** | `sembler` |
| `sell to` | **A1** | `vendre` |
| `send` | **A0** | `envoyer` |
| `send something to someone` | **A1** | `envoyer` |
| `share` | **A0** | `partager` |
| `share with` | **A1** | `partager` |
| `show` | **A1** | `montrer` |
| `show something to someone` | **A1** | `montrer` |
| `sleep` | **A0** | `dormir` |
| `sleep at` | **A1** | `dormir` |
| `speak about` | **A1** | `parler` |
| `speak with` | **A1** | `parler` |
| `spend time on` | **A1** | `passer` |
| `spend time with` | **A1** | `passer` |
| `stay at` | **A1** | `rester` |
| `stop doing` | **A1** | `arrêter` |
| `study` | **A0** | `étudier` |
| `study at` | **A1** | `étudier` |
| `study for` | **A1** | `étudier` |
| `succeed in` | **A1** | `réussir` |
| `take` | **A0** | `prendre` |
| `take from` | **A1** | `prendre` |
| `talk about` | **A1** | `parler` |
| `talk about someone` | **A1** | `parler` |
| `talk about something` | **A1** | `parler` |
| `talk to someone` | **A1** | `parler` |
| `talk with someone` | **A1** | `parler` |
| `teach` | **A0** | `enseigner` |
| `tell` | **A1** | `dire` |
| `think about` | **A1** | `penser` |
| `think of` | **A1** | `penser` |
| `travel by bus take a bus` | **A1** | `prendre` |
| `travel by plane` | **A1** | `prendre` |
| `travel by train` | **A1** | `prendre` |
| `travel to` | **A1** | `voyager` |
| `trust` | **A0** | `faire` |
| `try to` | **A1** | `essayer` |
| `try to be` | **A1** | `essayer` |
| `understand` | **A0** | `comprendre` |
| `use` | **A0** | `utiliser` |
| `visit` | **A0** | `visiter` |
| `walk to` | **A1** | `aller` |
| `want` | **A0** | `vouloir` |
| `watch` | **A1** | `regarder` |
| `wear` | **A0** | `porter` |
| `work` | **A0** | `travailler` |
| `work at` | **A1** | `travailler` |
| `work for` | **A1** | `travailler` |
| `work on` | **A1** | `travailler` |
| `work with` | **A1** | `travailler` |
| `write to someone` | **A1** | `écrire` |

### Genuinely Missing Concepts
| Missing Concept Key | Implied CEFR Level | Source Term / Equivalent |
| :--- | :---: | :--- |
| `check` | **A0** | `vérifier` |
| `click` | **A0** | `cliquer` |
| `connect` | **A0** | `connecter / se connecter` |
| `delete` | **A0** | `supprimer` |
| `download` | **A0** | `télécharger` |
| `enjoy` | **A0** | `profiter de / aimer` |
| `feel` | **A0** | `se sentir` |
| `get` | **A0** | `obtenir / recevoir` |
| `have fun` | **A0** | `s’amuser` |
| `improve` | **A0** | `améliorer` |
| `laugh` | **A0** | `rire` |
| `plan` | **A0** | `planifier` |
| `practise` | **A0** | `pratiquer` |
| `relax` | **A0** | `se détendre` |
| `save` | **A0** | `enregistrer` |
| `smile` | **A0** | `sourire` |
| `take off` | **A0** | `enlever` |
| `wake up` | **A0** | `se réveiller` |
| `wash` | **A0** | `laver / se laver` |
| `worry` | **A0** | `s’inquiéter` |
| `accept yourself` | **A1** | `s'accepter` |
| `access` | **A1** | `accéder à` |
| `achieve` | **A1** | `atteindre` |
| `act` | **A1** | `agir / se comporter` |
| `adapt to` | **A1** | `s'adapter à` |
| `advise` | **A1** | `conseiller` |
| `agree that` | **A1** | `reconnaître que` |
| `appear` | **A1** | `apparaître` |
| `apply for` | **A1** | `postuler à` |
| `argue with` | **A1** | `se disputer avec` |
| `balance` | **A1** | `équilibrer` |
| `be interested in` | **A1** | `s'intéresser à` |
| `be interested in learning` | **A1** | `s'intéresser à apprendre` |
| `be tired of` | **A1** | `en avoir marre de` |
| `be worried about` | **A1** | `s'inquiéter de` |
| `become` | **A1** | `devenir` |
| `become interested in` | **A1** | `s'intéresser à` |
| `behave well` | **A1** | `bien se comporter` |
| `belong to` | **A1** | `appartenir à` |
| `blame for` | **A1** | `blâmer pour` |
| `block` | **A1** | `bloquer` |
| `break` | **A1** | `abandonner` |
| `care about` | **A1** | `se soucier de` |
| `cause` | **A1** | `causer` |
| `check on` | **A1** | `vérifier comment va` |
| `comment on` | **A1** | `commenter` |
| `communicate with` | **A1** | `communiquer avec` |
| `complain about` | **A1** | `se plaindre de` |
| `concentrate on` | **A1** | `se concentrer sur` |
| `connect to` | **A1** | `se connecter à` |
| `contact` | **A1** | `contacter` |
| `contribute to` | **A1** | `contribuer à` |
| `control yourself` | **A1** | `se contrôler` |
| `deal with` | **A1** | `s'occuper de / gérer` |
| `deny` | **A1** | `nier` |
| `depend on` | **A1** | `dépendre de` |
| `describe` | **A1** | `décrire` |
| `develop` | **A1** | `développer` |
| `develop into` | **A1** | `évoluer vers` |
| `develop yourself` | **A1** | `se développer` |
| `disagree with` | **A1** | `ne pas être d'accord avec` |
| `disappear` | **A1** | `disparaître` |
| `download from` | **A1** | `télécharger depuis` |
| `drive to` | **A1** | `conduire jusqu'à` |
| `exist` | **A1** | `exister` |
| `expect` | **A1** | `s'attendre à` |
| `explore` | **A1** | `explorer` |
| `express yourself` | **A1** | `s'exprimer` |
| `fail at` | **A1** | `échouer dans` |
| `focus on` | **A1** | `se concentrer sur` |
| `forgive` | **A1** | `pardonner` |
| `forgive for` | **A1** | `pardonner pour` |
| `get better at` | **A1** | `devenir meilleur en` |
| `get used to` | **A1** | `s'habituer à` |
| `grow as` | **A1** | `évoluer en tant que` |
| `grow into` | **A1** | `devenir progressivement` |
| `hate` | **A1** | `détester` |
| `improve at` | **A1** | `s'améliorer en` |
| `improve yourself` | **A1** | `s'améliorer` |
| `increase` | **A1** | `augmenter` |
| `influence` | **A1** | `influencer` |
| `join` | **A1** | `rejoindre / participer à` |
| `lead` | **A1** | `diriger` |
| `log in` | **A1** | `se connecter` |
| `log in to` | **A1** | `se connecter à` |
| `log out` | **A1** | `se déconnecter` |
| `look after` | **A1** | `s'occuper de` |
| `manage` | **A1** | `gérer` |
| `meet at` | **A1** | `se retrouver à` |
| `move to` | **A1** | `déménager dans` |
| `practise speaking` | **A1** | `pratiquer l'expression orale` |
| `practise with` | **A1** | `pratiquer avec` |
| `predict` | **A1** | `prédire` |
| `prevent` | **A1** | `empêcher` |
| `prevent from` | **A1** | `empêcher de` |
| `promise` | **A1** | `promettre` |
| `prove` | **A1** | `prouver` |
| `recover from` | **A1** | `se remettre de` |
| `reduce` | **A1** | `réduire` |
| `remind of` | **A1** | `rappeler` |
| `respect` | **A1** | `respecter` |
| `save money for` | **A1** | `économiser pour` |
| `sign up for` | **A1** | `s'inscrire à` |
| `solve` | **A1** | `résoudre` |
| `spend money on` | **A1** | `dépenser de l'argent pour` |
| `start a job` | **A1** | `commencer un travail` |
| `start doing` | **A1** | `commencer à faire` |
| `subscribe to` | **A1** | `s'abonner à` |
| `suffer from` | **A1** | `souffrir de` |
| `support` | **A1** | `soutenir` |
| `take care of` | **A1** | `s'occuper de` |
| `thank for` | **A1** | `remercier pour` |
| `train` | **A1** | `s'entraîner` |
| `translate from` | **A1** | `traduire de` |
| `translate into` | **A1** | `traduire en` |
| `treat` | **A1** | `traiter` |
| `turn into` | **A1** | `se transformer en` |
| `upload` | **A1** | `télécharger / mettre en ligne` |
| `upload to` | **A1** | `télécharger sur` |
| `wait for` | **A1** | `attendre` |
| `wait for someone` | **A1** | `attendre quelqu'un` |
| `warn about` | **A1** | `avertir de` |
| `waste time` | **A1** | `perdre du temps` |
| `worry about` | **A1** | `s'inquiéter de` |
| `участвовать в` | **A1** | `participer à` |

### Lower Quality Engine Entries
*No lower quality entries detected. All matched entries satisfy core schema quality requirements.*

---

## Italian Reggenza Engine
**Target Dataset File**: `tools/it/reggenza/data/verbs.json`

### Coverage Statistics
- **Total Source Concepts Evaluated**: `349`
- **Present in Engine**: `71` (A0: `7`, A1: `64`)
- **Genuinely Missing**: `278` (A0: `61`, A1: `217`)
- **Lower Quality Engine Entries**: `0`

### Present Concepts (Covered)
| Source Concept Key | Level | Matched Key in Engine |
| :--- | :---: | :--- |
| `adapt to` | **A1** | `adattarsi a` |
| `answer` | **A1** | `rispondere a` |
| `arrive at` | **A1** | `arrivare a` |
| `ask about` | **A1** | `chiedere di` |
| `be able to` | **A1** | `potere` |
| `be interested in` | **A1** | `interessarsi a` |
| `be worried about` | **A1** | `preoccuparsi di` |
| `become interested in` | **A1** | `interessarsi a` |
| `believe in` | **A1** | `credere in` |
| `buy` | **A0** | `comprare` |
| `buy from` | **A1** | `comprare` |
| `call` | **A1** | `chiamare` |
| `call someone` | **A1** | `chiamare` |
| `care about` | **A1** | `preoccuparsi di` |
| `come from` | **A1** | `venire da` |
| `come out of` | **A1** | `uscire da` |
| `complain about` | **A1** | `lamentarsi di` |
| `contribute to` | **A1** | `contribuire a` |
| `decide to` | **A1** | `decidere di` |
| `depend on` | **A1** | `dipendere da` |
| `dream about` | **A1** | `sognare di` |
| `dream of` | **A1** | `sognare di` |
| `enter` | **A1** | `entrare in` |
| `get to know` | **A1** | `conoscere` |
| `get used to` | **A1** | `abituarsi a` |
| `go back to` | **A1** | `tornare a` |
| `go into` | **A1** | `entrare in` |
| `go to` | **A1** | `andare a` |
| `have to` | **A1** | `dovere` |
| `hope to` | **A1** | `sperare di` |
| `invite to` | **A1** | `invitare a` |
| `know` | **A0** | `sapere` |
| `know about` | **A1** | `sapere` |
| `leave exit` | **A1** | `uscire da` |
| `listen to` | **A1** | `ascoltare` |
| `listen to someone` | **A1** | `ascoltare` |
| `live in` | **A1** | `abitare a` |
| `look after` | **A1** | `occuparsi di` |
| `look at` | **A1** | `guardare` |
| `look for` | **A1** | `cercare` |
| `look forward to` | **A1** | `aspettare` |
| `love` | **A0** | `amare` |
| `love doing` | **A1** | `amare` |
| `meet someone` | **A1** | `conoscere` |
| `pay` | **A0** | `pagare` |
| `pay for` | **A1** | `pagare` |
| `plan to` | **A1** | `pensare di` |
| `protect from` | **A1** | `proteggere da` |
| `regret` | **A1** | `pentirsi di` |
| `remember` | **A0** | `ricordarsi di` |
| `reply to` | **A1** | `rispondere a` |
| `return to` | **A1** | `tornare a` |
| `search` | **A0** | `cercare` |
| `search for` | **A1** | `cercare` |
| `search through` | **A1** | `cercare` |
| `speak about` | **A1** | `parlare di` |
| `succeed in` | **A1** | `riuscire a` |
| `take care of` | **A1** | `occuparsi di` |
| `talk about` | **A1** | `parlare di` |
| `thank for` | **A1** | `ringraziare per` |
| `think about` | **A1** | `pensare a` |
| `think of` | **A1** | `pensare a` |
| `try to` | **A1** | `provare a` |
| `try to be` | **A1** | `cercare` |
| `volere + infinitive` | **A1** | `volere` |
| `wait for` | **A1** | `aspettare` |
| `wait for someone` | **A1** | `aspettare` |
| `want` | **A0** | `volere` |
| `watch` | **A1** | `guardare` |
| `worry about` | **A1** | `preoccuparsi di` |
| `участвовать в` | **A1** | `partecipare a` |

### Genuinely Missing Concepts
| Missing Concept Key | Implied CEFR Level | Source Term / Equivalent |
| :--- | :---: | :--- |
| `be` | **A0** | `essere` |
| `believe` | **A0** | `credere` |
| `check` | **A0** | `controllare` |
| `click` | **A0** | `cliccare` |
| `connect` | **A0** | `collegare / connettersi` |
| `cook` | **A0** | `cucinare` |
| `correct` | **A0** | `correggere` |
| `cry` | **A0** | `piangere` |
| `delete` | **A0** | `cancellare` |
| `do make` | **A0** | `fare` |
| `download` | **A0** | `scaricare` |
| `drink` | **A0** | `bere` |
| `eat` | **A0** | `mangiare` |
| `enjoy` | **A0** | `divertirsi / godersi` |
| `exercise` | **A0** | `fare sport` |
| `fare male` | **A0** | `fare male` |
| `fear be afraid` | **A0** | `avere paura` |
| `feel` | **A0** | `sentirsi` |
| `follow` | **A0** | `seguire` |
| `forget` | **A0** | `dimenticare` |
| `get` | **A0** | `ottenere / ricevere` |
| `give` | **A0** | `dare` |
| `have` | **A0** | `avere` |
| `have fun` | **A0** | `divertirsi` |
| `hope` | **A0** | `sperare` |
| `improve` | **A0** | `migliorare` |
| `invite` | **A0** | `invitare` |
| `laugh` | **A0** | `ridere` |
| `learn` | **A0** | `imparare` |
| `like` | **A0** | `piacere` |
| `mean` | **A0** | `significare` |
| `meet` | **A0** | `incontrare` |
| `miss someonesomething` | **A0** | `mancare` |
| `need` | **A0** | `avere bisogno di` |
| `pensare` | **A0** | `pensare` |
| `plan` | **A0** | `pianificare` |
| `practise` | **A0** | `praticare` |
| `prepare` | **A0** | `preparare` |
| `put` | **A0** | `mettere` |
| `put on` | **A0** | `mettere` |
| `receive` | **A0** | `ricevere` |
| `relax` | **A0** | `rilassarsi` |
| `rest` | **A0** | `riposarsi` |
| `save` | **A0** | `salvare` |
| `send` | **A0** | `mandare / inviare` |
| `share` | **A0** | `condividere` |
| `sleep` | **A0** | `dormire` |
| `smile` | **A0** | `sorridere` |
| `study` | **A0** | `studiare` |
| `take` | **A0** | `prendere` |
| `take off` | **A0** | `togliere` |
| `teach` | **A0** | `insegnare` |
| `trust` | **A0** | `fidarsi` |
| `understand` | **A0** | `capire` |
| `use` | **A0** | `usare` |
| `visit` | **A0** | `visitare` |
| `wake up` | **A0** | `svegliarsi` |
| `wash` | **A0** | `lavare / lavarsi` |
| `wear` | **A0** | `indossare / portare` |
| `work` | **A0** | `lavorare` |
| `worry` | **A0** | `preoccuparsi` |
| `accept` | **A1** | `accettare` |
| `accept yourself` | **A1** | `accettarsi` |
| `access` | **A1** | `accedere a` |
| `achieve` | **A1** | `raggiungere` |
| `act` | **A1** | `agire / comportarsi` |
| `advise` | **A1** | `consigliare` |
| `agree on` | **A1** | `mettersi d'accordo su` |
| `agree that` | **A1** | `ammettere che` |
| `agree with` | **A1** | `essere d'accordo con` |
| `answer someone` | **A1** | `rispondere a qualcuno` |
| `apologize for` | **A1** | `scusarsi per` |
| `apologize to` | **A1** | `scusarsi con` |
| `appear` | **A1** | `apparire` |
| `apply for` | **A1** | `candidarsi per` |
| `argue with` | **A1** | `litigare con` |
| `arrive from` | **A1** | `arrivare da` |
| `ask for` | **A1** | `chiedere` |
| `ask someone for something` | **A1** | `chiedere qualcosa a qualcuno` |
| `avoid` | **A1** | `evitare` |
| `balance` | **A1** | `bilanciare` |
| `be afraid of` | **A1** | `avere paura di` |
| `be bad at` | **A1** | `essere scarso in` |
| `be excited about` | **A1** | `essere entusiasta di` |
| `be good at` | **A1** | `essere bravo in` |
| `be happy about` | **A1** | `essere felice di` |
| `be interested in learning` | **A1** | `essere interessato a imparare` |
| `be part of` | **A1** | `fare parte di` |
| `be ready for` | **A1** | `essere pronto per` |
| `be ready to` | **A1** | `essere pronto a` |
| `be sad about` | **A1** | `essere triste per` |
| `be surprised by` | **A1** | `essere sorpreso da` |
| `be tired of` | **A1** | `essere stanco di` |
| `become` | **A1** | `diventare` |
| `behave well` | **A1** | `comportarsi bene` |
| `belong to` | **A1** | `appartenere a` |
| `blame for` | **A1** | `dare la colpa per` |
| `block` | **A1** | `bloccare` |
| `break` | **A1** | `rompere` |
| `bring from` | **A1** | `portare da` |
| `bring to` | **A1** | `portare a` |
| `cause` | **A1** | `causare` |
| `change` | **A1** | `cambiare` |
| `change into` | **A1** | `trasformare in` |
| `change something about` | **A1** | `cambiare qualcosa di` |
| `change your mind` | **A1** | `cambiare idea` |
| `change yourself` | **A1** | `cambiare se stessi` |
| `check on` | **A1** | `controllare come sta` |
| `choose` | **A1** | `scegliere` |
| `choose between` | **A1** | `scegliere tra` |
| `come from someone` | **A1** | `venire da qualcuno` |
| `come to` | **A1** | `venire a` |
| `comment on` | **A1** | `commentare` |
| `communicate with` | **A1** | `comunicare con` |
| `compare with` | **A1** | `confrontare con` |
| `concentrate on` | **A1** | `concentrarsi su` |
| `connect to` | **A1** | `connettersi a` |
| `consider` | **A1** | `considerare` |
| `contact` | **A1** | `contattare` |
| `continue doing` | **A1** | `continuare a fare` |
| `control yourself` | **A1** | `controllarsi` |
| `create` | **A1** | `creare` |
| `cure` | **A1** | `curare` |
| `deal with` | **A1** | `occuparsi di / gestire` |
| `decide` | **A1** | `decidere` |
| `decide about` | **A1** | `decidere su` |
| `decide on` | **A1** | `decidere su` |
| `deny` | **A1** | `negare` |
| `describe` | **A1** | `descrivere` |
| `develop` | **A1** | `sviluppare` |
| `develop into` | **A1** | `svilupparsi in` |
| `develop yourself` | **A1** | `svilupparsi` |
| `disagree about` | **A1** | `essere in disaccordo su` |
| `disagree with` | **A1** | `non essere d'accordo con` |
| `disappear` | **A1** | `sparire` |
| `discover` | **A1** | `scoprire` |
| `discover yourself` | **A1** | `scoprire se stessi` |
| `discuss` | **A1** | `discutere di` |
| `download from` | **A1** | `scaricare da` |
| `drive to` | **A1** | `guidare fino a` |
| `earn` | **A1** | `guadagnare` |
| `enjoy doing` | **A1** | `piacere fare` |
| `exist` | **A1** | `esistere` |
| `expect` | **A1** | `aspettarsi` |
| `experience` | **A1** | `vivere` |
| `explain something to someone` | **A1** | `spiegare qualcosa a qualcuno` |
| `explain to` | **A1** | `spiegare a` |
| `explain why` | **A1** | `spiegare perché` |
| `explore` | **A1** | `esplorare` |
| `express` | **A1** | `esprimere` |
| `express yourself` | **A1** | `esprimersi` |
| `face` | **A1** | `affrontare` |
| `fail at` | **A1** | `fallire in` |
| `fear` | **A1** | `avere paura di` |
| `feel better` | **A1** | `stare meglio` |
| `feel like doing` | **A1** | `avere voglia di fare` |
| `feel sad` | **A1** | `sentirsi triste` |
| `find something` | **A1** | `trovare qualcosa` |
| `finish doing` | **A1** | `finire di fare` |
| `finish work` | **A1** | `finire il lavoro` |
| `focus on` | **A1** | `concentrarsi su` |
| `follow someone` | **A1** | `seguire qualcuno` |
| `forget to` | **A1** | `dimenticare di fare` |
| `forgive` | **A1** | `perdonare` |
| `forgive for` | **A1** | `perdonare per` |
| `get better at` | **A1** | `migliorare in` |
| `get into` | **A1** | `salire su` |
| `get out of` | **A1** | `scendere da` |
| `go to someone` | **A1** | `andare da qualcuno` |
| `grow as` | **A1** | `crescere come` |
| `grow into` | **A1** | `diventare` |
| `happen` | **A1** | `succedere` |
| `hate` | **A1** | `odiare` |
| `help someone` | **A1** | `aiutare qualcuno` |
| `help someone with` | **A1** | `aiutare qualcuno con` |
| `help someone with something` | **A1** | `aiutare qualcuno con qualcosa` |
| `help with` | **A1** | `aiutare con` |
| `hope for` | **A1** | `sperare in` |
| `imagine` | **A1** | `immaginare` |
| `improve at` | **A1** | `migliorare in` |
| `improve yourself` | **A1** | `migliorarsi` |
| `increase` | **A1** | `aumentare` |
| `influence` | **A1** | `influenzare` |
| `introduce someone to someone` | **A1** | `presentare qualcuno a qualcuno` |
| `join` | **A1** | `unirsi a / partecipare a` |
| `lead` | **A1** | `guidare` |
| `lead to` | **A1** | `portare a` |
| `learn a language` | **A1** | `imparare una lingua` |
| `learn about` | **A1** | `imparare su` |
| `learn from` | **A1** | `imparare da` |
| `learn to` | **A1** | `imparare a` |
| `leave a place` | **A1** | `lasciare un posto` |
| `live abroad` | **A1** | `vivere all'estero` |
| `live with` | **A1** | `vivere con` |
| `log in` | **A1** | `accedere` |
| `log in to` | **A1** | `accedere a` |
| `log out` | **A1** | `disconnettersi` |
| `manage` | **A1** | `gestire` |
| `matter` | **A1** | `importare` |
| `meet at` | **A1** | `incontrarsi a` |
| `meet with someone` | **A1** | `incontrare qualcuno / vedersi con qualcuno` |
| `message` | **A1** | `mandare un messaggio a` |
| `miss` | **A1** | `mancare` |
| `move to` | **A1** | `trasferirsi in` |
| `move towards` | **A1** | `andare verso` |
| `need to` | **A1** | `avere bisogno di` |
| `notice` | **A1** | `notare` |
| `practise speaking` | **A1** | `esercitarsi a parlare` |
| `practise with` | **A1** | `esercitarsi con` |
| `predict` | **A1** | `prevedere` |
| `prepare for` | **A1** | `prepararsi a` |
| `prevent` | **A1** | `prevenire` |
| `prevent from` | **A1** | `impedire di` |
| `promise` | **A1** | `promettere` |
| `protect` | **A1** | `proteggere` |
| `prove` | **A1** | `dimostrare` |
| `put into` | **A1** | `mettere in` |
| `put something on` | **A1** | `mettere su` |
| `realize` | **A1** | `rendersi conto di` |
| `recover from` | **A1** | `riprendersi da` |
| `reduce` | **A1** | `ridurre` |
| `refuse` | **A1** | `rifiutare` |
| `rely on` | **A1** | `contare su` |
| `remember to` | **A1** | `ricordarsi di fare` |
| `remind of` | **A1** | `ricordare` |
| `repeat after` | **A1** | `ripetere dopo` |
| `respect` | **A1** | `rispettare` |
| `save from` | **A1** | `salvare da` |
| `save money for` | **A1** | `risparmiare per` |
| `save time` | **A1** | `risparmiare tempo` |
| `say` | **A1** | `dire` |
| `seem` | **A1** | `sembrare` |
| `sell to` | **A1** | `vendere a` |
| `send something to someone` | **A1** | `mandare qualcosa a qualcuno` |
| `share with` | **A1** | `condividere con` |
| `show` | **A1** | `mostrare` |
| `show something to someone` | **A1** | `mostrare qualcosa a qualcuno` |
| `sign up for` | **A1** | `iscriversi a` |
| `sleep at` | **A1** | `dormire da / in` |
| `solve` | **A1** | `risolvere` |
| `speak with` | **A1** | `parlare con` |
| `spend money on` | **A1** | `spendere soldi per` |
| `spend time on` | **A1** | `passare tempo a` |
| `spend time with` | **A1** | `passare tempo con` |
| `start a job` | **A1** | `iniziare un lavoro` |
| `start doing` | **A1** | `iniziare a fare` |
| `stay at` | **A1** | `stare a` |
| `stop doing` | **A1** | `smettere di fare` |
| `study at` | **A1** | `studiare a` |
| `study for` | **A1** | `studiare per` |
| `subscribe to` | **A1** | `iscriversi a` |
| `suffer from` | **A1** | `soffrire di` |
| `support` | **A1** | `sostenere` |
| `take from` | **A1** | `prendere da` |
| `talk about someone` | **A1** | `parlare di qualcuno` |
| `talk about something` | **A1** | `parlare di qualcosa` |
| `talk to someone` | **A1** | `parlare a qualcuno` |
| `talk with someone` | **A1** | `parlare con qualcuno` |
| `tell` | **A1** | `dire / raccontare` |
| `train` | **A1** | `allenarsi` |
| `translate from` | **A1** | `tradurre da` |
| `translate into` | **A1** | `tradurre in` |
| `travel by bus take a bus` | **A1** | `prendere l'autobus` |
| `travel by plane` | **A1** | `prendere l'aereo` |
| `travel by train` | **A1** | `prendere il treno` |
| `travel to` | **A1** | `viaggiare verso` |
| `treat` | **A1** | `curare / trattare` |
| `turn into` | **A1** | `trasformarsi in` |
| `upload` | **A1** | `caricare` |
| `upload to` | **A1** | `caricare su` |
| `walk to` | **A1** | `andare a piedi a` |
| `warn about` | **A1** | `avvertire di` |
| `waste time` | **A1** | `perdere tempo` |
| `work at` | **A1** | `lavorare a / presso` |
| `work for` | **A1** | `lavorare per` |
| `work on` | **A1** | `lavorare su` |
| `work with` | **A1** | `lavorare con` |
| `write to someone` | **A1** | `scrivere a qualcuno` |

### Lower Quality Engine Entries
*No lower quality entries detected. All matched entries satisfy core schema quality requirements.*

---

## Italian Coniugatore Engine
**Target Dataset File**: `tools/it/coniugatore/data/verbs.json`

### Coverage Statistics
- **Total Source Concepts Evaluated**: `349`
- **Present in Engine**: `217` (A0: `43`, A1: `174`)
- **Genuinely Missing**: `132` (A0: `25`, A1: `107`)
- **Lower Quality Engine Entries**: `11`

### Present Concepts (Covered)
| Source Concept Key | Level | Matched Key in Engine |
| :--- | :---: | :--- |
| `accept` | **A1** | `accettare` |
| `achieve` | **A1** | `raggiungere` |
| `advise` | **A1** | `consigliare` |
| `agree that` | **A1** | `ammettere` |
| `agree with` | **A1** | `essere` |
| `answer` | **A1** | `rispondere` |
| `answer someone` | **A1** | `rispondere` |
| `apologize for` | **A1** | `scusarsi` |
| `apologize to` | **A1** | `scusarsi` |
| `argue with` | **A1** | `litigare` |
| `arrive at` | **A1** | `arrivare` |
| `arrive from` | **A1** | `arrivare` |
| `ask about` | **A1** | `chiedere` |
| `ask for` | **A1** | `chiedere` |
| `ask someone for something` | **A1** | `chiedere` |
| `avoid` | **A1** | `evitare` |
| `be` | **A0** | `essere` |
| `be able to` | **A1** | `potere` |
| `be afraid of` | **A1** | `avere` |
| `be bad at` | **A1** | `essere` |
| `be excited about` | **A1** | `essere` |
| `be good at` | **A1** | `essere` |
| `be happy about` | **A1** | `essere` |
| `be interested in learning` | **A1** | `essere` |
| `be part of` | **A1** | `fare` |
| `be ready for` | **A1** | `essere` |
| `be ready to` | **A1** | `essere` |
| `be sad about` | **A1** | `essere` |
| `be surprised by` | **A1** | `essere` |
| `be tired of` | **A1** | `essere` |
| `become` | **A1** | `diventare` |
| `believe` | **A0** | `credere` |
| `believe in` | **A1** | `credere` |
| `belong to` | **A1** | `appartenere` |
| `blame for` | **A1** | `dare` |
| `block` | **A1** | `bloccare` |
| `break` | **A1** | `rompere` |
| `bring from` | **A1** | `portare` |
| `bring to` | **A1** | `portare` |
| `buy` | **A0** | `comprare` |
| `buy from` | **A1** | `comprare` |
| `call` | **A1** | `chiamare` |
| `call someone` | **A1** | `chiamare` |
| `change` | **A1** | `cambiare` |
| `change something about` | **A1** | `cambiare` |
| `change your mind` | **A1** | `cambiare` |
| `change yourself` | **A1** | `cambiare` |
| `choose` | **A1** | `scegliere` |
| `choose between` | **A1** | `scegliere` |
| `come from` | **A1** | `venire` |
| `come from someone` | **A1** | `venire` |
| `come out of` | **A1** | `uscire` |
| `come to` | **A1** | `venire` |
| `complain about` | **A1** | `lamentarsi` |
| `continue doing` | **A1** | `continuare` |
| `cook` | **A0** | `cucinare` |
| `correct` | **A0** | `correggere` |
| `cry` | **A0** | `piangere` |
| `decide` | **A1** | `decidere` |
| `decide about` | **A1** | `decidere` |
| `decide on` | **A1** | `decidere` |
| `decide to` | **A1** | `decidere` |
| `describe` | **A1** | `descrivere` |
| `disagree about` | **A1** | `essere` |
| `discover` | **A1** | `scoprire` |
| `discover yourself` | **A1** | `scoprire` |
| `discuss` | **A1** | `discutere` |
| `do make` | **A0** | `fare` |
| `dream about` | **A1** | `sognare` |
| `dream of` | **A1** | `sognare` |
| `drink` | **A0** | `bere` |
| `drive to` | **A1** | `guidare` |
| `earn` | **A1** | `guadagnare` |
| `eat` | **A0** | `mangiare` |
| `enjoy doing` | **A1** | `piacere` |
| `enter` | **A1** | `entrare` |
| `exercise` | **A0** | `fare` |
| `experience` | **A1** | `vivere` |
| `explain something to someone` | **A1** | `spiegare` |
| `explain to` | **A1** | `spiegare` |
| `explain why` | **A1** | `spiegare` |
| `fare male` | **A0** | `fare` |
| `fear` | **A1** | `avere` |
| `fear be afraid` | **A0** | `avere` |
| `feel better` | **A1** | `stare` |
| `feel like doing` | **A1** | `avere` |
| `find something` | **A1** | `trovare` |
| `finish doing` | **A1** | `finire` |
| `finish work` | **A1** | `finire` |
| `forget` | **A0** | `dimenticare` |
| `forget to` | **A1** | `dimenticare` |
| `get into` | **A1** | `salire` |
| `get out of` | **A1** | `scendere` |
| `get to know` | **A1** | `conoscere` |
| `give` | **A0** | `dare` |
| `go back to` | **A1** | `tornare` |
| `go into` | **A1** | `entrare` |
| `go to` | **A1** | `andare` |
| `go to someone` | **A1** | `andare` |
| `grow into` | **A1** | `diventare` |
| `have` | **A0** | `avere` |
| `have to` | **A1** | `dovere` |
| `help someone` | **A1** | `aiutare` |
| `help someone with` | **A1** | `aiutare` |
| `help someone with something` | **A1** | `aiutare` |
| `help with` | **A1** | `aiutare` |
| `hope` | **A0** | `sperare` |
| `hope for` | **A1** | `sperare` |
| `hope to` | **A1** | `sperare` |
| `increase` | **A1** | `aumentare` |
| `invite` | **A0** | `invitare` |
| `invite to` | **A1** | `invitare` |
| `know` | **A0** | `sapere` |
| `know about` | **A1** | `sapere` |
| `laugh` | **A0** | `ridere` |
| `lead` | **A1** | `guidare` |
| `lead to` | **A1** | `portare` |
| `learn` | **A0** | `imparare` |
| `learn a language` | **A1** | `imparare` |
| `learn about` | **A1** | `imparare` |
| `learn from` | **A1** | `imparare` |
| `learn to` | **A1** | `imparare` |
| `leave a place` | **A1** | `lasciare` |
| `leave exit` | **A1** | `uscire` |
| `like` | **A0** | `piacere` |
| `listen to` | **A1** | `ascoltare` |
| `listen to someone` | **A1** | `ascoltare` |
| `live abroad` | **A1** | `vivere` |
| `live in` | **A1** | `abitare` |
| `live with` | **A1** | `vivere` |
| `look at` | **A1** | `guardare` |
| `look for` | **A1** | `cercare` |
| `look forward to` | **A1** | `aspettare` |
| `love` | **A0** | `amare` |
| `love doing` | **A1** | `amare` |
| `meet` | **A0** | `incontrare` |
| `meet someone` | **A1** | `conoscere` |
| `meet with someone` | **A1** | `incontrare` |
| `miss` | **A1** | `mancare` |
| `miss someonesomething` | **A0** | `mancare` |
| `move towards` | **A1** | `andare` |
| `need` | **A0** | `avere` |
| `need to` | **A1** | `avere` |
| `pay` | **A0** | `pagare` |
| `pay for` | **A1** | `pagare` |
| `pensare` | **A0** | `pensare` |
| `plan to` | **A1** | `pensare` |
| `predict` | **A1** | `prevedere` |
| `prepare` | **A0** | `preparare` |
| `promise` | **A1** | `promettere` |
| `prove` | **A1** | `dimostrare` |
| `put` | **A0** | `mettere` |
| `put into` | **A1** | `mettere` |
| `put on` | **A0** | `mettere` |
| `put something on` | **A1** | `mettere` |
| `receive` | **A0** | `ricevere` |
| `refuse` | **A1** | `rifiutare` |
| `rely on` | **A1** | `contare` |
| `remember` | **A0** | `ricordarsi` |
| `remember to` | **A1** | `ricordarsi` |
| `remind of` | **A1** | `ricordare` |
| `repeat after` | **A1** | `ripetere` |
| `reply to` | **A1** | `rispondere` |
| `return to` | **A1** | `tornare` |
| `save` | **A0** | `salvare` |
| `save from` | **A1** | `salvare` |
| `say` | **A1** | `dire` |
| `search` | **A0** | `cercare` |
| `search for` | **A1** | `cercare` |
| `search through` | **A1** | `cercare` |
| `seem` | **A1** | `sembrare` |
| `sell to` | **A1** | `vendere` |
| `show` | **A1** | `mostrare` |
| `show something to someone` | **A1** | `mostrare` |
| `speak about` | **A1** | `parlare` |
| `speak with` | **A1** | `parlare` |
| `spend time on` | **A1** | `passare` |
| `spend time with` | **A1** | `passare` |
| `stay at` | **A1** | `stare` |
| `study` | **A0** | `studiare` |
| `study at` | **A1** | `studiare` |
| `study for` | **A1** | `studiare` |
| `take` | **A0** | `prendere` |
| `take from` | **A1** | `prendere` |
| `talk about` | **A1** | `parlare` |
| `talk about someone` | **A1** | `parlare` |
| `talk about something` | **A1** | `parlare` |
| `talk to someone` | **A1** | `parlare` |
| `talk with someone` | **A1** | `parlare` |
| `teach` | **A0** | `insegnare` |
| `tell` | **A1** | `dire` |
| `thank for` | **A1** | `ringraziare` |
| `think about` | **A1** | `pensare` |
| `think of` | **A1** | `pensare` |
| `travel by bus take a bus` | **A1** | `prendere` |
| `travel by plane` | **A1** | `prendere` |
| `travel by train` | **A1** | `prendere` |
| `travel to` | **A1** | `viaggiare` |
| `try to` | **A1** | `provare` |
| `try to be` | **A1** | `cercare` |
| `understand` | **A0** | `capire` |
| `use` | **A0** | `usare` |
| `visit` | **A0** | `visitare` |
| `volere + infinitive` | **A1** | `volere` |
| `wait for` | **A1** | `aspettare` |
| `wait for someone` | **A1** | `aspettare` |
| `walk to` | **A1** | `andare` |
| `want` | **A0** | `volere` |
| `wash` | **A0** | `lavare` |
| `waste time` | **A1** | `perdere` |
| `watch` | **A1** | `guardare` |
| `work` | **A0** | `lavorare` |
| `work at` | **A1** | `lavorare` |
| `work for` | **A1** | `lavorare` |
| `work on` | **A1** | `lavorare` |
| `work with` | **A1** | `lavorare` |
| `write to someone` | **A1** | `scrivere` |

### Genuinely Missing Concepts
| Missing Concept Key | Implied CEFR Level | Source Term / Equivalent |
| :--- | :---: | :--- |
| `check` | **A0** | `controllare` |
| `click` | **A0** | `cliccare` |
| `connect` | **A0** | `collegare / connettersi` |
| `delete` | **A0** | `cancellare` |
| `download` | **A0** | `scaricare` |
| `enjoy` | **A0** | `divertirsi / godersi` |
| `feel` | **A0** | `sentirsi` |
| `follow` | **A0** | `seguire` |
| `get` | **A0** | `ottenere / ricevere` |
| `have fun` | **A0** | `divertirsi` |
| `improve` | **A0** | `migliorare` |
| `mean` | **A0** | `significare` |
| `plan` | **A0** | `pianificare` |
| `practise` | **A0** | `praticare` |
| `relax` | **A0** | `rilassarsi` |
| `rest` | **A0** | `riposarsi` |
| `send` | **A0** | `mandare / inviare` |
| `share` | **A0** | `condividere` |
| `sleep` | **A0** | `dormire` |
| `smile` | **A0** | `sorridere` |
| `take off` | **A0** | `togliere` |
| `trust` | **A0** | `fidarsi` |
| `wake up` | **A0** | `svegliarsi` |
| `wear` | **A0** | `indossare / portare` |
| `worry` | **A0** | `preoccuparsi` |
| `accept yourself` | **A1** | `accettarsi` |
| `access` | **A1** | `accedere a` |
| `act` | **A1** | `agire / comportarsi` |
| `adapt to` | **A1** | `adattarsi a` |
| `agree on` | **A1** | `mettersi d'accordo su` |
| `appear` | **A1** | `apparire` |
| `apply for` | **A1** | `candidarsi per` |
| `balance` | **A1** | `bilanciare` |
| `be interested in` | **A1** | `interessarsi a` |
| `be worried about` | **A1** | `preoccuparsi di` |
| `become interested in` | **A1** | `interessarsi a` |
| `behave well` | **A1** | `comportarsi bene` |
| `care about` | **A1** | `preoccuparsi di` |
| `cause` | **A1** | `causare` |
| `change into` | **A1** | `trasformare in` |
| `check on` | **A1** | `controllare come sta` |
| `comment on` | **A1** | `commentare` |
| `communicate with` | **A1** | `comunicare con` |
| `compare with` | **A1** | `confrontare con` |
| `concentrate on` | **A1** | `concentrarsi su` |
| `connect to` | **A1** | `connettersi a` |
| `consider` | **A1** | `considerare` |
| `contact` | **A1** | `contattare` |
| `contribute to` | **A1** | `contribuire a` |
| `control yourself` | **A1** | `controllarsi` |
| `create` | **A1** | `creare` |
| `cure` | **A1** | `curare` |
| `deal with` | **A1** | `occuparsi di / gestire` |
| `deny` | **A1** | `negare` |
| `depend on` | **A1** | `dipendere da` |
| `develop` | **A1** | `sviluppare` |
| `develop into` | **A1** | `svilupparsi in` |
| `develop yourself` | **A1** | `svilupparsi` |
| `disagree with` | **A1** | `non essere d'accordo con` |
| `disappear` | **A1** | `sparire` |
| `download from` | **A1** | `scaricare da` |
| `exist` | **A1** | `esistere` |
| `expect` | **A1** | `aspettarsi` |
| `explore` | **A1** | `esplorare` |
| `express` | **A1** | `esprimere` |
| `express yourself` | **A1** | `esprimersi` |
| `face` | **A1** | `affrontare` |
| `fail at` | **A1** | `fallire in` |
| `feel sad` | **A1** | `sentirsi triste` |
| `focus on` | **A1** | `concentrarsi su` |
| `follow someone` | **A1** | `seguire qualcuno` |
| `forgive` | **A1** | `perdonare` |
| `forgive for` | **A1** | `perdonare per` |
| `get better at` | **A1** | `migliorare in` |
| `get used to` | **A1** | `abituarsi a` |
| `grow as` | **A1** | `crescere come` |
| `happen` | **A1** | `succedere` |
| `hate` | **A1** | `odiare` |
| `imagine` | **A1** | `immaginare` |
| `improve at` | **A1** | `migliorare in` |
| `improve yourself` | **A1** | `migliorarsi` |
| `influence` | **A1** | `influenzare` |
| `introduce someone to someone` | **A1** | `presentare qualcuno a qualcuno` |
| `join` | **A1** | `unirsi a / partecipare a` |
| `log in` | **A1** | `accedere` |
| `log in to` | **A1** | `accedere a` |
| `log out` | **A1** | `disconnettersi` |
| `look after` | **A1** | `occuparsi di` |
| `manage` | **A1** | `gestire` |
| `matter` | **A1** | `importare` |
| `meet at` | **A1** | `incontrarsi a` |
| `message` | **A1** | `mandare un messaggio a` |
| `move to` | **A1** | `trasferirsi in` |
| `notice` | **A1** | `notare` |
| `practise speaking` | **A1** | `esercitarsi a parlare` |
| `practise with` | **A1** | `esercitarsi con` |
| `prepare for` | **A1** | `prepararsi a` |
| `prevent` | **A1** | `prevenire` |
| `prevent from` | **A1** | `impedire di` |
| `protect` | **A1** | `proteggere` |
| `protect from` | **A1** | `proteggere da` |
| `realize` | **A1** | `rendersi conto di` |
| `recover from` | **A1** | `riprendersi da` |
| `reduce` | **A1** | `ridurre` |
| `regret` | **A1** | `pentirsi di` |
| `respect` | **A1** | `rispettare` |
| `save money for` | **A1** | `risparmiare per` |
| `save time` | **A1** | `risparmiare tempo` |
| `send something to someone` | **A1** | `mandare qualcosa a qualcuno` |
| `share with` | **A1** | `condividere con` |
| `sign up for` | **A1** | `iscriversi a` |
| `sleep at` | **A1** | `dormire da / in` |
| `solve` | **A1** | `risolvere` |
| `spend money on` | **A1** | `spendere soldi per` |
| `start a job` | **A1** | `iniziare un lavoro` |
| `start doing` | **A1** | `iniziare a fare` |
| `stop doing` | **A1** | `smettere di fare` |
| `subscribe to` | **A1** | `iscriversi a` |
| `succeed in` | **A1** | `riuscire a` |
| `suffer from` | **A1** | `soffrire di` |
| `support` | **A1** | `sostenere` |
| `take care of` | **A1** | `occuparsi di` |
| `train` | **A1** | `allenarsi` |
| `translate from` | **A1** | `tradurre da` |
| `translate into` | **A1** | `tradurre in` |
| `treat` | **A1** | `curare / trattare` |
| `turn into` | **A1** | `trasformarsi in` |
| `upload` | **A1** | `caricare` |
| `upload to` | **A1** | `caricare su` |
| `warn about` | **A1** | `avvertire di` |
| `worry about` | **A1** | `preoccuparsi di` |
| `участвовать в` | **A1** | `partecipare a` |

### Lower Quality Engine Entries
| Concept Key | Matched Engine Key | Level | Quality Issues Detected |
| :--- | :--- | :---: | :--- |
| `achieve` | `raggiungere` | **A1** | flagged needs_review |
| `belong to` | `appartenere` | **A1** | flagged needs_review |
| `choose` | `scegliere` | **A1** | flagged needs_review |
| `choose between` | `scegliere` | **A1** | flagged needs_review |
| `decide` | `decidere` | **A1** | flagged needs_review |
| `decide about` | `decidere` | **A1** | flagged needs_review |
| `decide on` | `decidere` | **A1** | flagged needs_review |
| `decide to` | `decidere` | **A1** | flagged needs_review |
| `feel better` | `stare` | **A1** | flagged needs_review |
| `repeat after` | `ripetere` | **A1** | flagged needs_review |
| `stay at` | `stare` | **A1** | flagged needs_review |

---

## Russian Spryazhenie Engine
**Target Dataset File**: `tools/ru/spryazhenie/data/verbs.json`

### Coverage Statistics
- **Total Source Concepts Evaluated**: `349`
- **Present in Engine**: `167` (A0: `39`, A1: `128`)
- **Genuinely Missing**: `182` (A0: `29`, A1: `153`)
- **Lower Quality Engine Entries**: `7`

### Present Concepts (Covered)
| Source Concept Key | Level | Matched Key in Engine |
| :--- | :---: | :--- |
| `access` | **A1** | `получать` |
| `agree that` | **A1** | `соглашаться` |
| `agree with` | **A1** | `соглашаться` |
| `answer` | **A1** | `отвечать` |
| `answer someone` | **A1** | `отвечать` |
| `apologize for` | **A1** | `извиняться` |
| `apologize to` | **A1** | `извиняться` |
| `argue with` | **A1** | `спорить` |
| `arrive at` | **A1** | `приходить` |
| `ask about` | **A1** | `спрашивать` |
| `ask for` | **A1** | `просить` |
| `ask someone for something` | **A1** | `просить` |
| `be` | **A0** | `быть` |
| `be able to` | **A1** | `мочь` |
| `be afraid of` | **A1** | `бояться` |
| `be excited about` | **A1** | `быть` |
| `be happy about` | **A1** | `быть` |
| `be part of` | **A1** | `быть` |
| `be ready for` | **A1** | `быть` |
| `be ready to` | **A1** | `быть` |
| `be sad about` | **A1** | `грустить` |
| `believe` | **A0** | `верить` |
| `believe in` | **A1** | `верить` |
| `break` | **A1** | `ломать` |
| `buy` | **A0** | `покупать` |
| `buy from` | **A1** | `покупать` |
| `call` | **A1** | `звонить` |
| `call someone` | **A1** | `звонить` |
| `cause` | **A1** | `вызывать` |
| `change` | **A1** | `менять` |
| `change yourself` | **A1** | `менять` |
| `choose` | **A1** | `выбирать` |
| `choose between` | **A1** | `выбирать` |
| `come from` | **A1** | `приходить` |
| `come from someone` | **A1** | `идти` |
| `come out of` | **A1** | `выходить` |
| `come to` | **A1** | `приходить` |
| `complain about` | **A1** | `жаловаться` |
| `cook` | **A0** | `готовить` |
| `correct` | **A0** | `исправлять` |
| `cry` | **A0** | `плакать` |
| `decide` | **A1** | `решать` |
| `decide about` | **A1** | `решать` |
| `decide on` | **A1** | `решить` |
| `decide to` | **A1** | `решить` |
| `discover` | **A1** | `открывать` |
| `discuss` | **A1** | `обсуждать` |
| `do make` | **A0** | `делать` |
| `dream about` | **A1** | `мечтать` |
| `dream of` | **A1** | `мечтать` |
| `drink` | **A0** | `пить` |
| `drive to` | **A1** | `ехать` |
| `eat` | **A0** | `есть` |
| `enjoy doing` | **A1** | `любить` |
| `exercise` | **A0** | `заниматься` |
| `explain something to someone` | **A1** | `объяснять` |
| `explain to` | **A1** | `объяснять` |
| `explain why` | **A1** | `объяснять` |
| `fare male` | **A0** | `болеть` |
| `fear` | **A1** | `бояться` |
| `fear be afraid` | **A0** | `бояться` |
| `feel` | **A0** | `чувствовать` |
| `feel better` | **A1** | `чувствовать` |
| `feel like doing` | **A1** | `хотеть` |
| `feel sad` | **A1** | `чувствовать` |
| `finish doing` | **A1** | `закончить` |
| `finish work` | **A1** | `закончить` |
| `forget` | **A0** | `забывать` |
| `forget to` | **A1** | `забыть` |
| `get` | **A0** | `получать` |
| `get into` | **A1** | `садиться` |
| `get out of` | **A1** | `выходить` |
| `give` | **A0** | `давать` |
| `go to` | **A1** | `идти` |
| `go to someone` | **A1** | `идти` |
| `grow into` | **A1** | `вырасти` |
| `hate` | **A1** | `ненавидеть` |
| `help someone` | **A1** | `помогать` |
| `help someone with` | **A1** | `помогать` |
| `help someone with something` | **A1** | `помогать` |
| `help with` | **A1** | `помогать` |
| `hope` | **A0** | `надеяться` |
| `hope for` | **A1** | `надеяться` |
| `hope to` | **A1** | `надеяться` |
| `know` | **A0** | `знать` |
| `know about` | **A1** | `знать` |
| `laugh` | **A0** | `смеяться` |
| `lead to` | **A1** | `вести` |
| `learn` | **A0** | `учить` |
| `learn a language` | **A1** | `изучать` |
| `leave exit` | **A1** | `выходить` |
| `listen to` | **A1** | `слушать` |
| `listen to someone` | **A1** | `слушать` |
| `live abroad` | **A1** | `жить` |
| `live in` | **A1** | `жить` |
| `live with` | **A1** | `жить` |
| `log out` | **A1** | `выходить` |
| `look at` | **A1** | `смотреть` |
| `look for` | **A1** | `искать` |
| `look forward to` | **A1** | `ждать` |
| `love` | **A0** | `любить` |
| `love doing` | **A1** | `любить` |
| `meet` | **A0** | `встречать` |
| `message` | **A1** | `писать` |
| `move towards` | **A1** | `идти` |
| `need` | **A0** | `нуждаться` |
| `notice` | **A1** | `замечать` |
| `pay` | **A0** | `платить` |
| `pay for` | **A1** | `платить` |
| `pensare` | **A0** | `думать` |
| `prepare` | **A0** | `готовить` |
| `prepare for` | **A1** | `готовиться` |
| `promise` | **A1** | `обещать` |
| `put` | **A0** | `класть` |
| `put into` | **A1** | `класть` |
| `put something on` | **A1** | `класть` |
| `receive` | **A0** | `получать` |
| `remember` | **A0** | `помнить` |
| `remember to` | **A1** | `помнить` |
| `repeat after` | **A1** | `повторять` |
| `reply to` | **A1** | `отвечать` |
| `rest` | **A0** | `отдыхать` |
| `say` | **A1** | `говорить` |
| `search` | **A0** | `искать` |
| `search for` | **A1** | `искать` |
| `search through` | **A1** | `искать` |
| `sell to` | **A1** | `продавать` |
| `show` | **A1** | `показывать` |
| `show something to someone` | **A1** | `показывать` |
| `sleep` | **A0** | `спать` |
| `sleep at` | **A1** | `спать` |
| `smile` | **A0** | `улыбаться` |
| `solve` | **A1** | `решать` |
| `speak about` | **A1** | `говорить` |
| `speak with` | **A1** | `говорить` |
| `spend time with` | **A1** | `проводить` |
| `start a job` | **A1** | `начать` |
| `start doing` | **A1** | `начинать` |
| `study for` | **A1** | `готовиться` |
| `take` | **A0** | `брать` |
| `take from` | **A1** | `брать` |
| `talk about` | **A1** | `говорить` |
| `talk about someone` | **A1** | `говорить` |
| `talk about something` | **A1** | `говорить` |
| `talk to someone` | **A1** | `говорить` |
| `teach` | **A0** | `учить` |
| `tell` | **A1** | `рассказывать` |
| `think about` | **A1** | `думать` |
| `think of` | **A1** | `думать` |
| `travel by bus take a bus` | **A1** | `ехать` |
| `travel by train` | **A1** | `ехать` |
| `travel to` | **A1** | `путешествовать` |
| `treat` | **A1** | `лечить` |
| `understand` | **A0** | `понимать` |
| `volere + infinitive` | **A1** | `хотеть` |
| `wait for` | **A1** | `ждать` |
| `wait for someone` | **A1** | `ждать` |
| `walk to` | **A1** | `идти` |
| `want` | **A0** | `хотеть` |
| `wash` | **A0** | `мыть` |
| `watch` | **A1** | `смотреть` |
| `work` | **A0** | `работать` |
| `work at` | **A1** | `работать` |
| `work for` | **A1** | `работать` |
| `work on` | **A1** | `работать` |
| `work with` | **A1** | `работать` |
| `write to someone` | **A1** | `писать` |

### Genuinely Missing Concepts
| Missing Concept Key | Implied CEFR Level | Source Term / Equivalent |
| :--- | :---: | :--- |
| `check` | **A0** | `проверять` |
| `click` | **A0** | `нажимать` |
| `connect` | **A0** | `подключать(ся)` |
| `delete` | **A0** | `удалить` |
| `download` | **A0** | `скачать` |
| `enjoy` | **A0** | `наслаждаться` |
| `follow` | **A0** | `следовать` |
| `have` | **A0** | `иметь` |
| `have fun` | **A0** | `веселиться` |
| `improve` | **A0** | `улучшать` |
| `invite` | **A0** | `приглашать` |
| `like` | **A0** | `нравиться` |
| `mean` | **A0** | `значить` |
| `miss someonesomething` | **A0** | `скучать по` |
| `plan` | **A0** | `планировать` |
| `practise` | **A0** | `практиковать` |
| `put on` | **A0** | `надевать` |
| `relax` | **A0** | `расслабляться` |
| `save` | **A0** | `сохранять` |
| `send` | **A0** | `отправлять` |
| `share` | **A0** | `делиться` |
| `study` | **A0** | `учиться` |
| `take off` | **A0** | `снимать` |
| `trust` | **A0** | `доверять` |
| `use` | **A0** | `использовать` |
| `visit` | **A0** | `посещать` |
| `wake up` | **A0** | `просыпаться` |
| `wear` | **A0** | `носить` |
| `worry` | **A0** | `беспокоиться` |
| `accept` | **A1** | `принимать` |
| `accept yourself` | **A1** | `принимать себя` |
| `achieve` | **A1** | `достигать` |
| `act` | **A1** | `действовать / вести себя` |
| `adapt to` | **A1** | `адаптироваться к` |
| `advise` | **A1** | `советовать` |
| `agree on` | **A1** | `договориться о` |
| `appear` | **A1** | `появляться` |
| `apply for` | **A1** | `подавать заявление на` |
| `arrive from` | **A1** | `приезжать из` |
| `avoid` | **A1** | `избегать` |
| `balance` | **A1** | `балансировать` |
| `be bad at` | **A1** | `плохо уметь` |
| `be good at` | **A1** | `хорошо уметь` |
| `be interested in` | **A1** | `интересоваться` |
| `be interested in learning` | **A1** | `интересоваться изучением` |
| `be surprised by` | **A1** | `удивляться чему-то` |
| `be tired of` | **A1** | `устать от` |
| `be worried about` | **A1** | `беспокоиться о` |
| `become` | **A1** | `становиться` |
| `become interested in` | **A1** | `заинтересоваться` |
| `behave well` | **A1** | `хорошо себя вести` |
| `belong to` | **A1** | `принадлежать кому-то` |
| `blame for` | **A1** | `винить за` |
| `block` | **A1** | `блокировать` |
| `bring from` | **A1** | `приносить из` |
| `bring to` | **A1** | `приносить в` |
| `care about` | **A1** | `заботиться о` |
| `change into` | **A1** | `превращаться в` |
| `change something about` | **A1** | `изменить что-то в` |
| `change your mind` | **A1** | `изменить мнение` |
| `check on` | **A1** | `проверять состояние` |
| `comment on` | **A1** | `комментировать` |
| `communicate with` | **A1** | `общаться с` |
| `compare with` | **A1** | `сравнивать с` |
| `concentrate on` | **A1** | `концентрироваться на` |
| `connect to` | **A1** | `подключаться к` |
| `consider` | **A1** | `рассматривать` |
| `contact` | **A1** | `связываться с` |
| `continue doing` | **A1** | `продолжать делать` |
| `contribute to` | **A1** | `способствовать` |
| `control yourself` | **A1** | `контролировать себя` |
| `create` | **A1** | `создавать` |
| `cure` | **A1** | `вылечивать` |
| `deal with` | **A1** | `справляться с` |
| `deny` | **A1** | `отрицать` |
| `depend on` | **A1** | `зависеть от` |
| `describe` | **A1** | `описывать` |
| `develop` | **A1** | `развивать` |
| `develop into` | **A1** | `развиваться в` |
| `develop yourself` | **A1** | `развиваться` |
| `disagree about` | **A1** | `не соглашаться по поводу` |
| `disagree with` | **A1** | `не соглашаться с` |
| `disappear` | **A1** | `исчезать` |
| `discover yourself` | **A1** | `узнавать себя` |
| `download from` | **A1** | `скачать с` |
| `earn` | **A1** | `зарабатывать` |
| `enter` | **A1** | `входить в` |
| `exist` | **A1** | `существовать` |
| `expect` | **A1** | `ожидать` |
| `experience` | **A1** | `испытывать` |
| `explore` | **A1** | `исследовать` |
| `express` | **A1** | `выражать` |
| `express yourself` | **A1** | `выражать себя` |
| `face` | **A1** | `сталкиваться с` |
| `fail at` | **A1** | `потерпеть неудачу в` |
| `find something` | **A1** | `найти что-то` |
| `focus on` | **A1** | `сосредоточиться на` |
| `follow someone` | **A1** | `следовать за кем-то` |
| `forgive` | **A1** | `прощать` |
| `forgive for` | **A1** | `прощать за` |
| `get better at` | **A1** | `становиться лучше в` |
| `get to know` | **A1** | `узнавать кого-то` |
| `get used to` | **A1** | `привыкать к` |
| `go back to` | **A1** | `вернуться в` |
| `go into` | **A1** | `входить в` |
| `grow as` | **A1** | `развиваться как` |
| `happen` | **A1** | `происходить` |
| `have to` | **A1** | `должен / нужно` |
| `imagine` | **A1** | `представлять` |
| `improve at` | **A1** | `улучшать навыки в` |
| `improve yourself` | **A1** | `улучшать себя` |
| `increase` | **A1** | `увеличивать` |
| `influence` | **A1** | `влиять` |
| `introduce someone to someone` | **A1** | `представить кого-то кому-то` |
| `invite to` | **A1** | `приглашать на` |
| `join` | **A1** | `присоединяться к` |
| `lead` | **A1** | `руководить` |
| `learn about` | **A1** | `узнавать о` |
| `learn from` | **A1** | `учиться у` |
| `learn to` | **A1** | `учиться делать` |
| `leave a place` | **A1** | `уходить из / уезжать из` |
| `log in` | **A1** | `входить` |
| `log in to` | **A1** | `войти в` |
| `look after` | **A1** | `заботиться о` |
| `manage` | **A1** | `управлять` |
| `matter` | **A1** | `иметь значение` |
| `meet at` | **A1** | `встречаться в` |
| `meet someone` | **A1** | `познакомиться с кем-то` |
| `meet with someone` | **A1** | `встречаться с кем-то` |
| `miss` | **A1** | `скучать по` |
| `move to` | **A1** | `переезжать в` |
| `need to` | **A1** | `нужно / надо` |
| `plan to` | **A1** | `планировать` |
| `practise speaking` | **A1** | `практиковать разговорную речь` |
| `practise with` | **A1** | `практиковаться с` |
| `predict` | **A1** | `предсказывать` |
| `prevent` | **A1** | `предотвращать` |
| `prevent from` | **A1** | `предотвращать` |
| `protect` | **A1** | `защищать` |
| `protect from` | **A1** | `защищать от` |
| `prove` | **A1** | `доказывать` |
| `realize` | **A1** | `осознавать` |
| `recover from` | **A1** | `восстановиться после` |
| `reduce` | **A1** | `уменьшать` |
| `refuse` | **A1** | `отказываться` |
| `regret` | **A1** | `сожалеть о` |
| `rely on` | **A1** | `полагаться на` |
| `remind of` | **A1** | `напоминать о` |
| `respect` | **A1** | `уважать` |
| `return to` | **A1** | `возвращаться в` |
| `save from` | **A1** | `спасать от` |
| `save money for` | **A1** | `копить деньги на` |
| `save time` | **A1** | `экономить время` |
| `seem` | **A1** | `казаться` |
| `send something to someone` | **A1** | `отправлять что-то кому-то` |
| `share with` | **A1** | `делиться с` |
| `sign up for` | **A1** | `зарегистрироваться на` |
| `spend money on` | **A1** | `тратить деньги на` |
| `spend time on` | **A1** | `тратить время на` |
| `stay at` | **A1** | `оставаться в` |
| `stop doing` | **A1** | `перестать делать` |
| `study at` | **A1** | `учиться в` |
| `subscribe to` | **A1** | `подписываться на` |
| `succeed in` | **A1** | `преуспеть в` |
| `suffer from` | **A1** | `страдать от` |
| `support` | **A1** | `поддерживать` |
| `take care of` | **A1** | `заботиться о` |
| `talk with someone` | **A1** | `разговаривать с кем-то` |
| `thank for` | **A1** | `благодарить за` |
| `train` | **A1** | `тренироваться` |
| `translate from` | **A1** | `переводить с` |
| `translate into` | **A1** | `переводить на` |
| `travel by plane` | **A1** | `лететь на самолёте` |
| `try to` | **A1** | `пытаться` |
| `try to be` | **A1** | `стараться быть` |
| `turn into` | **A1** | `превращаться в` |
| `upload` | **A1** | `загружать` |
| `upload to` | **A1** | `загружать на` |
| `warn about` | **A1** | `предупреждать о` |
| `waste time` | **A1** | `тратить время зря` |
| `worry about` | **A1** | `беспокоиться о` |
| `участвовать в` | **A1** | `участвовать в` |

### Lower Quality Engine Entries
| Concept Key | Matched Engine Key | Level | Quality Issues Detected |
| :--- | :--- | :---: | :--- |
| `decide on` | `решить` | **A1** | flagged needs_review |
| `decide to` | `решить` | **A1** | flagged needs_review |
| `finish doing` | `закончить` | **A1** | flagged needs_review |
| `finish work` | `закончить` | **A1** | flagged needs_review |
| `forget to` | `забыть` | **A1** | flagged needs_review |
| `spend time with` | `проводить` | **A1** | flagged needs_review |
| `start a job` | `начать` | **A1** | flagged needs_review |

---

## Greek Syntaxi Engine
**Target Dataset File**: `tools/el/syntaxi/data/verbs.json`

### Coverage Statistics
- **Total Source Concepts Evaluated**: `349`
- **Present in Engine**: `127` (A0: `24`, A1: `103`)
- **Genuinely Missing**: `222` (A0: `44`, A1: `178`)
- **Lower Quality Engine Entries**: `127`

### Present Concepts (Covered)
| Source Concept Key | Level | Matched Key in Engine |
| :--- | :---: | :--- |
| `accept` | **A1** | `αποδέχομαι` |
| `accept yourself` | **A1** | `αποδέχομαι` |
| `advise` | **A1** | `συμβουλεύω` |
| `agree on` | **A1** | `συμφωνώ` |
| `agree that` | **A1** | `συμφωνώ` |
| `agree with` | **A1** | `συμφωνώ` |
| `answer someone` | **A1** | `απαντάω` |
| `apologize for` | **A1** | `ζητάω` |
| `arrive at` | **A1** | `φτάνω` |
| `arrive from` | **A1** | `φτάνω` |
| `ask about` | **A1** | `ρωτάω` |
| `ask for` | **A1** | `ζητάω` |
| `ask someone for something` | **A1** | `ζητάω` |
| `avoid` | **A1** | `αποφεύγω` |
| `be happy about` | **A1** | `χαίρομαι` |
| `be interested in` | **A1** | `ενδιαφέρομαι` |
| `be interested in learning` | **A1** | `ενδιαφέρομαι` |
| `be worried about` | **A1** | `ανησυχώ` |
| `become interested in` | **A1** | `ενδιαφέρομαι` |
| `believe` | **A0** | `πιστεύω` |
| `believe in` | **A1** | `πιστεύω` |
| `belong to` | **A1** | `ανήκω` |
| `blame for` | **A1** | `κατηγορώ` |
| `buy` | **A0** | `αγοράζω` |
| `buy from` | **A1** | `αγοράζω` |
| `care about` | **A1** | `ενδιαφέρομαι` |
| `cause` | **A1** | `προκαλώ` |
| `come from` | **A1** | `έρχομαι` |
| `come from someone` | **A1** | `έρχομαι` |
| `come to` | **A1** | `έρχομαι` |
| `connect` | **A0** | `συνδέω` |
| `consider` | **A1** | `εξετάζω` |
| `continue doing` | **A1** | `συνεχίζω` |
| `contribute to` | **A1** | `συμβάλλω` |
| `cook` | **A0** | `μαγειρεύω` |
| `create` | **A1** | `δημιουργώ` |
| `delete` | **A0** | `διαγράφω` |
| `depend on` | **A1** | `εξαρτώμαι` |
| `disagree about` | **A1** | `διαφωνώ` |
| `disagree with` | **A1** | `διαφωνώ` |
| `drink` | **A0** | `πίνω` |
| `eat` | **A0** | `τρώω` |
| `enjoy` | **A0** | `απολαμβάνω` |
| `expect` | **A1** | `περιμένω` |
| `find something` | **A1** | `βρίσκω` |
| `finish doing` | **A1** | `τελειώνω` |
| `finish work` | **A1** | `τελειώνω` |
| `forget` | **A0** | `ξεχνάω` |
| `forget to` | **A1** | `ξεχνάω` |
| `forgive` | **A1** | `συγχωρώ` |
| `forgive for` | **A1** | `συγχωρώ` |
| `get` | **A0** | `παίρνω` |
| `get used to` | **A1** | `συνηθίζω` |
| `give` | **A0** | `δίνω` |
| `help someone` | **A1** | `βοηθάω` |
| `help someone with` | **A1** | `βοηθάω` |
| `help someone with something` | **A1** | `βοηθάω` |
| `help with` | **A1** | `βοηθάω` |
| `hope` | **A0** | `ελπίζω` |
| `hope to` | **A1** | `ελπίζω` |
| `influence` | **A1** | `επηρεάζω` |
| `invite` | **A0** | `προσκαλώ` |
| `invite to` | **A1** | `προσκαλώ` |
| `join` | **A1** | `συμμετέχω` |
| `lead` | **A1** | `ηγούμαι` |
| `leave a place` | **A1** | `φεύγω` |
| `listen to` | **A1** | `ακούω` |
| `listen to someone` | **A1** | `ακούω` |
| `live in` | **A1** | `μένω` |
| `live with` | **A1** | `μένω` |
| `look after` | **A1** | `φροντίζω` |
| `love` | **A0** | `αγαπάω` |
| `manage` | **A1** | `διαχειρίζομαι` |
| `message` | **A1** | `στέλνω` |
| `move towards` | **A1** | `πηγαίνω` |
| `need` | **A0** | `χρειάζομαι` |
| `pay` | **A0** | `πληρώνω` |
| `pay for` | **A1** | `πληρώνω` |
| `pensare` | **A0** | `σκέφτομαι` |
| `promise` | **A1** | `υπόσχομαι` |
| `protect` | **A1** | `προστατεύω` |
| `protect from` | **A1** | `προστατεύω` |
| `rely on` | **A1** | `βασίζομαι` |
| `remember` | **A0** | `θυμάμαι` |
| `remember to` | **A1** | `θυμάμαι` |
| `sell to` | **A1** | `πουλάω` |
| `send` | **A0** | `στέλνω` |
| `send something to someone` | **A1** | `στέλνω` |
| `speak about` | **A1** | `μιλάω` |
| `speak with` | **A1** | `μιλάω` |
| `start a job` | **A1** | `αρχίζω` |
| `start doing` | **A1** | `αρχίζω` |
| `stay at` | **A1** | `μένω` |
| `study for` | **A1** | `διαβάζω` |
| `take` | **A0** | `παίρνω` |
| `take care of` | **A1** | `φροντίζω` |
| `take from` | **A1** | `παίρνω` |
| `talk about` | **A1** | `μιλάω` |
| `talk about someone` | **A1** | `μιλάω` |
| `talk about something` | **A1** | `μιλάω` |
| `talk to someone` | **A1** | `μιλάω` |
| `talk with someone` | **A1** | `μιλάω` |
| `thank for` | **A1** | `ευχαριστώ` |
| `think about` | **A1** | `σκέφτομαι` |
| `think of` | **A1** | `σκέφτομαι` |
| `travel by bus take a bus` | **A1** | `παίρνω` |
| `travel by plane` | **A1** | `ταξιδεύω` |
| `travel by train` | **A1** | `παίρνω` |
| `travel to` | **A1** | `ταξιδεύω` |
| `trust` | **A0** | `εμπιστεύομαι` |
| `volere + infinitive` | **A1** | `θέλω` |
| `wait for` | **A1** | `περιμένω` |
| `wait for someone` | **A1** | `περιμένω` |
| `walk to` | **A1** | `πηγαίνω` |
| `want` | **A0** | `θέλω` |
| `warn about` | **A1** | `προειδοποιώ` |
| `waste time` | **A1** | `χάνω` |
| `watch` | **A1** | `βλέπω` |
| `work` | **A0** | `δουλεύω` |
| `work at` | **A1** | `δουλεύω` |
| `work for` | **A1** | `δουλεύω` |
| `work on` | **A1** | `δουλεύω` |
| `work with` | **A1** | `δουλεύω` |
| `worry` | **A0** | `ανησυχώ` |
| `worry about` | **A1** | `ανησυχώ` |
| `write to someone` | **A1** | `γράφω` |
| `участвовать в` | **A1** | `συμμετέχω` |

### Genuinely Missing Concepts
| Missing Concept Key | Implied CEFR Level | Source Term / Equivalent |
| :--- | :---: | :--- |
| `be` | **A0** | `είμαι` |
| `check` | **A0** | `ελέγχω` |
| `click` | **A0** | `κάνω κλικ` |
| `correct` | **A0** | `διορθώνω` |
| `cry` | **A0** | `κλαίω` |
| `do make` | **A0** | `κάνω` |
| `download` | **A0** | `κατεβάζω` |
| `exercise` | **A0** | `γυμνάζομαι` |
| `fare male` | **A0** | `πονάω` |
| `fear be afraid` | **A0** | `φοβάμαι` |
| `feel` | **A0** | `νιώθω` |
| `follow` | **A0** | `ακολουθώ` |
| `have` | **A0** | `έχω` |
| `have fun` | **A0** | `διασκεδάζω` |
| `improve` | **A0** | `βελτιώνω` |
| `know` | **A0** | `ξέρω` |
| `laugh` | **A0** | `γελάω` |
| `learn` | **A0** | `μαθαίνω` |
| `like` | **A0** | `μου αρέσει` |
| `mean` | **A0** | `σημαίνω` |
| `meet` | **A0** | `συναντάω` |
| `miss someonesomething` | **A0** | `μου λείπει` |
| `plan` | **A0** | `σχεδιάζω` |
| `practise` | **A0** | `εξασκούμαι` |
| `prepare` | **A0** | `ετοιμάζω / προετοιμάζομαι` |
| `put` | **A0** | `βάζω` |
| `put on` | **A0** | `βάζω` |
| `receive` | **A0** | `λαμβάνω` |
| `relax` | **A0** | `χαλαρώνω` |
| `rest` | **A0** | `ξεκουράζομαι` |
| `save` | **A0** | `αποθηκεύω` |
| `search` | **A0** | `ψάχνω` |
| `share` | **A0** | `μοιράζομαι` |
| `sleep` | **A0** | `κοιμάμαι` |
| `smile` | **A0** | `χαμογελάω` |
| `study` | **A0** | `σπουδάζω / μελετάω` |
| `take off` | **A0** | `βγάζω` |
| `teach` | **A0** | `διδάσκω` |
| `understand` | **A0** | `καταλαβαίνω` |
| `use` | **A0** | `χρησιμοποιώ` |
| `visit` | **A0** | `επισκέπτομαι` |
| `wake up` | **A0** | `ξυπνάω` |
| `wash` | **A0** | `πλένω / πλένομαι` |
| `wear` | **A0** | `φοράω` |
| `access` | **A1** | `έχω πρόσβαση σε` |
| `achieve` | **A1** | `πετυχαίνω` |
| `act` | **A1** | `ενεργώ / συμπεριφέρομαι` |
| `adapt to` | **A1** | `προσαρμόζομαι σε` |
| `answer` | **A1** | `απαντώ σε` |
| `apologize to` | **A1** | `ζητώ συγγνώμη από` |
| `appear` | **A1** | `εμφανίζομαι` |
| `apply for` | **A1** | `κάνω αίτηση για` |
| `argue with` | **A1** | `μαλώνω με` |
| `balance` | **A1** | `ισορροπώ` |
| `be able to` | **A1** | `μπορώ να` |
| `be afraid of` | **A1** | `φοβάμαι` |
| `be bad at` | **A1** | `δεν είμαι καλός σε` |
| `be excited about` | **A1** | `ενθουσιάζομαι για` |
| `be good at` | **A1** | `είμαι καλός σε` |
| `be part of` | **A1** | `είμαι μέρος του` |
| `be ready for` | **A1** | `είμαι έτοιμος για` |
| `be ready to` | **A1** | `είμαι έτοιμος να` |
| `be sad about` | **A1** | `λυπάμαι για` |
| `be surprised by` | **A1** | `εκπλήσσομαι από` |
| `be tired of` | **A1** | `βαριέμαι / κουράζομαι από` |
| `become` | **A1** | `γίνομαι` |
| `behave well` | **A1** | `συμπεριφέρομαι καλά` |
| `block` | **A1** | `μπλοκάρω` |
| `break` | **A1** | `κόβω` |
| `bring from` | **A1** | `φέρνω από` |
| `bring to` | **A1** | `φέρνω σε` |
| `call` | **A1** | `τηλεφωνώ` |
| `call someone` | **A1** | `τηλεφωνώ σε κάποιον` |
| `change` | **A1** | `αλλάζω` |
| `change into` | **A1** | `αλλάζω σε` |
| `change something about` | **A1** | `αλλάζω κάτι σε` |
| `change your mind` | **A1** | `αλλάζω γνώμη` |
| `change yourself` | **A1** | `αλλάζω τον εαυτό μου` |
| `check on` | **A1** | `ελέγχω αν είναι καλά` |
| `choose` | **A1** | `επιλέγω` |
| `choose between` | **A1** | `επιλέγω μεταξύ` |
| `come out of` | **A1** | `βγαίνω από` |
| `comment on` | **A1** | `σχολιάζω` |
| `communicate with` | **A1** | `επικοινωνώ με` |
| `compare with` | **A1** | `συγκρίνω με` |
| `complain about` | **A1** | `παραπονιέμαι για` |
| `concentrate on` | **A1** | `συγκεντρώνομαι σε` |
| `connect to` | **A1** | `συνδέομαι με` |
| `contact` | **A1** | `επικοινωνώ με` |
| `control yourself` | **A1** | `ελέγχω τον εαυτό μου` |
| `cure` | **A1** | `θεραπεύω` |
| `deal with` | **A1** | `αντιμετωπίζω` |
| `decide` | **A1** | `αποφασίζω` |
| `decide about` | **A1** | `αποφασίζω για` |
| `decide on` | **A1** | `αποφασίζω για` |
| `decide to` | **A1** | `αποφασίζω να` |
| `deny` | **A1** | `αρνούμαι` |
| `describe` | **A1** | `περιγράφω` |
| `develop` | **A1** | `αναπτύσσω` |
| `develop into` | **A1** | `εξελίσσομαι σε` |
| `develop yourself` | **A1** | `αναπτύσσομαι` |
| `disappear` | **A1** | `εξαφανίζομαι` |
| `discover` | **A1** | `ανακαλύπτω` |
| `discover yourself` | **A1** | `ανακαλύπτω τον εαυτό μου` |
| `discuss` | **A1** | `συζητώ` |
| `download from` | **A1** | `κατεβάζω από` |
| `dream about` | **A1** | `ονειρεύομαι` |
| `dream of` | **A1** | `ονειρεύομαι` |
| `drive to` | **A1** | `οδηγώ μέχρι` |
| `earn` | **A1** | `κερδίζω` |
| `enjoy doing` | **A1** | `μου αρέσει να κάνω` |
| `enter` | **A1** | `μπαίνω σε` |
| `exist` | **A1** | `υπάρχω` |
| `experience` | **A1** | `βιώνω` |
| `explain something to someone` | **A1** | `εξηγώ κάτι σε κάποιον` |
| `explain to` | **A1** | `εξηγώ σε` |
| `explain why` | **A1** | `εξηγώ γιατί` |
| `explore` | **A1** | `εξερευνώ` |
| `express` | **A1** | `εκφράζω` |
| `express yourself` | **A1** | `εκφράζομαι` |
| `face` | **A1** | `αντιμετωπίζω` |
| `fail at` | **A1** | `αποτυγχάνω σε` |
| `fear` | **A1** | `φοβάμαι` |
| `feel better` | **A1** | `νιώθω καλύτερα` |
| `feel like doing` | **A1** | `έχω όρεξη να κάνω` |
| `feel sad` | **A1** | `νιώθω λυπημένος` |
| `focus on` | **A1** | `συγκεντρώνομαι σε` |
| `follow someone` | **A1** | `ακολουθώ κάποιον` |
| `get better at` | **A1** | `γίνομαι καλύτερος σε` |
| `get into` | **A1** | `μπαίνω σε` |
| `get out of` | **A1** | `βγαίνω από` |
| `get to know` | **A1** | `γνωρίζω καλύτερα` |
| `go back to` | **A1** | `γυρίζω πίσω σε` |
| `go into` | **A1** | `μπαίνω σε` |
| `go to` | **A1** | `πάω σε / πάω στο(στη)` |
| `go to someone` | **A1** | `πάω σε κάποιον` |
| `grow as` | **A1** | `εξελίσσομαι ως` |
| `grow into` | **A1** | `γίνομαι` |
| `happen` | **A1** | `συμβαίνω` |
| `hate` | **A1** | `μισώ` |
| `have to` | **A1** | `πρέπει να` |
| `hope for` | **A1** | `надеύομαι για / ελπίζω σε` |
| `imagine` | **A1** | `φαντάζομαι` |
| `improve at` | **A1** | `βελτιώνομαι σε` |
| `improve yourself` | **A1** | `βελτιώνομαι` |
| `increase` | **A1** | `αυξάνω` |
| `introduce someone to someone` | **A1** | `συστήνω κάποιον σε κάποιον` |
| `know about` | **A1** | `ξέρω για` |
| `lead to` | **A1** | `οδηγώ σε` |
| `learn a language` | **A1** | `μαθαίνω μια γλώσσα` |
| `learn about` | **A1** | `μαθαίνω για` |
| `learn from` | **A1** | `μαθαίνω από` |
| `learn to` | **A1** | `μαθαίνω να` |
| `leave exit` | **A1** | `βγαίνω από` |
| `live abroad` | **A1** | `ζω στο εξωτερικό` |
| `log in` | **A1** | `συνδέομαι` |
| `log in to` | **A1** | `συνδέομαι σε` |
| `log out` | **A1** | `αποσυνδέομαι` |
| `look at` | **A1** | `κοιτάω` |
| `look for` | **A1** | `ψάχνω` |
| `look forward to` | **A1** | `ανυπομονώ για` |
| `love doing` | **A1** | `αγαπώ να κάνω` |
| `matter` | **A1** | `έχει σημασία` |
| `meet at` | **A1** | `συναντιέμαι σε` |
| `meet someone` | **A1** | `γνωρίζω κάποιον` |
| `meet with someone` | **A1** | `συναντιέμαι με κάποιον` |
| `miss` | **A1** | `μου λείπει` |
| `move to` | **A1** | `μετακομίζω σε` |
| `need to` | **A1** | `χρειάζεται να` |
| `notice` | **A1** | `παρατηρώ` |
| `plan to` | **A1** | `σχεδιάζω να` |
| `practise speaking` | **A1** | `εξασκούμαι στην ομιλία` |
| `practise with` | **A1** | `εξασκούμαι με` |
| `predict` | **A1** | `προβλέπω` |
| `prepare for` | **A1** | `ετοιμάζομαι για` |
| `prevent` | **A1** | `предотвращω / εμποδίζω` |
| `prevent from` | **A1** | `εμποδίζω` |
| `prove` | **A1** | `αποδεικνύω` |
| `put into` | **A1** | `βάζω μέσα σε` |
| `put something on` | **A1** | `βάζω πάνω σε` |
| `realize` | **A1** | `συνειδητοποιώ` |
| `recover from` | **A1** | `αναρρώνω από` |
| `reduce` | **A1** | `μειώνω` |
| `refuse` | **A1** | `αρνούμαι` |
| `regret` | **A1** | `μετανιώνω για` |
| `remind of` | **A1** | `θυμίζω` |
| `repeat after` | **A1** | `επαναλαμβάνω μετά από` |
| `reply to` | **A1** | `απαντώ σε` |
| `respect` | **A1** | `σέβομαι` |
| `return to` | **A1** | `επιστρέφω σε` |
| `save from` | **A1** | `σώζω από` |
| `save money for` | **A1** | `αποταμιεύω για` |
| `save time` | **A1** | `εξοικονομώ χρόνο` |
| `say` | **A1** | `λέω` |
| `search for` | **A1** | `ψάχνω` |
| `search through` | **A1** | `ψάχνω μέσα σε` |
| `seem` | **A1** | `φαίνομαι` |
| `share with` | **A1** | `μοιράζομαι με` |
| `show` | **A1** | `δείχνω` |
| `show something to someone` | **A1** | `δείχνω κάτι σε κάποιον` |
| `sign up for` | **A1** | `εγγράφομαι σε` |
| `sleep at` | **A1** | `κοιμάμαι σε` |
| `solve` | **A1** | `λύνω` |
| `spend money on` | **A1** | `ξοδεύω χρήματα για` |
| `spend time on` | **A1** | `περνάω χρόνο σε` |
| `spend time with` | **A1** | `περνάω χρόνο με` |
| `stop doing` | **A1** | `σταματάω να κάνω` |
| `study at` | **A1** | `σπουδάζω σε` |
| `subscribe to` | **A1** | `εγγράφομαι σε` |
| `succeed in` | **A1** | `καταφέρνω να` |
| `suffer from` | **A1** | `υποφέρω από` |
| `support` | **A1** | `υποστηρίζω` |
| `tell` | **A1** | `λέω / διηγούμαι` |
| `train` | **A1** | `προπονούμαι` |
| `translate from` | **A1** | `μεταφράζω από` |
| `translate into` | **A1** | `μεταφράζω στα` |
| `treat` | **A1** | `θεραπεύω` |
| `try to` | **A1** | `προσπαθώ να` |
| `try to be` | **A1** | `προσπαθώ να είμαι` |
| `turn into` | **A1** | `μετατρέπομαι σε` |
| `upload` | **A1** | `ανεβάζω` |
| `upload to` | **A1** | `ανεβάζω σε` |

### Lower Quality Engine Entries
| Concept Key | Matched Engine Key | Level | Quality Issues Detected |
| :--- | :--- | :---: | :--- |
| `accept` | `αποδέχομαι` | **A1** | missing prepositions field |
| `accept yourself` | `αποδέχομαι` | **A1** | missing prepositions field |
| `advise` | `συμβουλεύω` | **A1** | missing prepositions field |
| `agree on` | `συμφωνώ` | **A1** | missing prepositions field |
| `agree that` | `συμφωνώ` | **A1** | missing prepositions field |
| `agree with` | `συμφωνώ` | **A1** | missing prepositions field |
| `answer someone` | `απαντάω` | **A1** | missing prepositions field |
| `apologize for` | `ζητάω` | **A1** | missing prepositions field |
| `arrive at` | `φτάνω` | **A1** | missing prepositions field |
| `arrive from` | `φτάνω` | **A1** | missing prepositions field |
| `ask about` | `ρωτάω` | **A1** | missing prepositions field |
| `ask for` | `ζητάω` | **A1** | missing prepositions field |
| `ask someone for something` | `ζητάω` | **A1** | missing prepositions field |
| `avoid` | `αποφεύγω` | **A1** | missing prepositions field |
| `be happy about` | `χαίρομαι` | **A1** | missing prepositions field |
| `be interested in` | `ενδιαφέρομαι` | **A1** | missing prepositions field |
| `be interested in learning` | `ενδιαφέρομαι` | **A1** | missing prepositions field |
| `be worried about` | `ανησυχώ` | **A1** | missing prepositions field |
| `become interested in` | `ενδιαφέρομαι` | **A1** | missing prepositions field |
| `believe` | `πιστεύω` | **A0** | missing prepositions field |
| `believe in` | `πιστεύω` | **A1** | missing prepositions field |
| `belong to` | `ανήκω` | **A1** | missing prepositions field |
| `blame for` | `κατηγορώ` | **A1** | missing prepositions field |
| `buy` | `αγοράζω` | **A0** | missing prepositions field |
| `buy from` | `αγοράζω` | **A1** | missing prepositions field |
| `care about` | `ενδιαφέρομαι` | **A1** | missing prepositions field |
| `cause` | `προκαλώ` | **A1** | missing prepositions field |
| `come from` | `έρχομαι` | **A1** | missing prepositions field |
| `come from someone` | `έρχομαι` | **A1** | missing prepositions field |
| `come to` | `έρχομαι` | **A1** | missing prepositions field |
| `connect` | `συνδέω` | **A0** | missing prepositions field |
| `consider` | `εξετάζω` | **A1** | missing prepositions field |
| `continue doing` | `συνεχίζω` | **A1** | missing prepositions field |
| `contribute to` | `συμβάλλω` | **A1** | missing prepositions field |
| `cook` | `μαγειρεύω` | **A0** | missing prepositions field |
| `create` | `δημιουργώ` | **A1** | missing prepositions field |
| `delete` | `διαγράφω` | **A0** | missing prepositions field |
| `depend on` | `εξαρτώμαι` | **A1** | missing prepositions field |
| `disagree about` | `διαφωνώ` | **A1** | missing prepositions field |
| `disagree with` | `διαφωνώ` | **A1** | missing prepositions field |
| `drink` | `πίνω` | **A0** | missing prepositions field |
| `eat` | `τρώω` | **A0** | missing prepositions field |
| `enjoy` | `απολαμβάνω` | **A0** | missing prepositions field |
| `expect` | `περιμένω` | **A1** | missing prepositions field |
| `find something` | `βρίσκω` | **A1** | missing prepositions field |
| `finish doing` | `τελειώνω` | **A1** | missing prepositions field |
| `finish work` | `τελειώνω` | **A1** | missing prepositions field |
| `forget` | `ξεχνάω` | **A0** | missing prepositions field |
| `forget to` | `ξεχνάω` | **A1** | missing prepositions field |
| `forgive` | `συγχωρώ` | **A1** | missing prepositions field |
| `forgive for` | `συγχωρώ` | **A1** | missing prepositions field |
| `get` | `παίρνω` | **A0** | missing prepositions field |
| `get used to` | `συνηθίζω` | **A1** | missing prepositions field |
| `give` | `δίνω` | **A0** | missing prepositions field |
| `help someone` | `βοηθάω` | **A1** | missing prepositions field |
| `help someone with` | `βοηθάω` | **A1** | missing prepositions field |
| `help someone with something` | `βοηθάω` | **A1** | missing prepositions field |
| `help with` | `βοηθάω` | **A1** | missing prepositions field |
| `hope` | `ελπίζω` | **A0** | missing prepositions field |
| `hope to` | `ελπίζω` | **A1** | missing prepositions field |
| `influence` | `επηρεάζω` | **A1** | missing prepositions field |
| `invite` | `προσκαλώ` | **A0** | missing prepositions field |
| `invite to` | `προσκαλώ` | **A1** | missing prepositions field |
| `join` | `συμμετέχω` | **A1** | missing prepositions field |
| `lead` | `ηγούμαι` | **A1** | missing prepositions field |
| `leave a place` | `φεύγω` | **A1** | missing prepositions field |
| `listen to` | `ακούω` | **A1** | missing prepositions field |
| `listen to someone` | `ακούω` | **A1** | missing prepositions field |
| `live in` | `μένω` | **A1** | missing prepositions field |
| `live with` | `μένω` | **A1** | missing prepositions field |
| `look after` | `φροντίζω` | **A1** | missing prepositions field |
| `love` | `αγαπάω` | **A0** | missing prepositions field |
| `manage` | `διαχειρίζομαι` | **A1** | missing prepositions field |
| `message` | `στέλνω` | **A1** | missing prepositions field |
| `move towards` | `πηγαίνω` | **A1** | missing prepositions field |
| `need` | `χρειάζομαι` | **A0** | missing prepositions field |
| `pay` | `πληρώνω` | **A0** | missing prepositions field |
| `pay for` | `πληρώνω` | **A1** | missing prepositions field |
| `pensare` | `σκέφτομαι` | **A0** | missing prepositions field |
| `promise` | `υπόσχομαι` | **A1** | missing prepositions field |
| `protect` | `προστατεύω` | **A1** | missing prepositions field |
| `protect from` | `προστατεύω` | **A1** | missing prepositions field |
| `rely on` | `βασίζομαι` | **A1** | missing prepositions field |
| `remember` | `θυμάμαι` | **A0** | missing prepositions field |
| `remember to` | `θυμάμαι` | **A1** | missing prepositions field |
| `sell to` | `πουλάω` | **A1** | missing prepositions field |
| `send` | `στέλνω` | **A0** | missing prepositions field |
| `send something to someone` | `στέλνω` | **A1** | missing prepositions field |
| `speak about` | `μιλάω` | **A1** | missing prepositions field |
| `speak with` | `μιλάω` | **A1** | missing prepositions field |
| `start a job` | `αρχίζω` | **A1** | missing prepositions field |
| `start doing` | `αρχίζω` | **A1** | missing prepositions field |
| `stay at` | `μένω` | **A1** | missing prepositions field |
| `study for` | `διαβάζω` | **A1** | missing prepositions field |
| `take` | `παίρνω` | **A0** | missing prepositions field |
| `take care of` | `φροντίζω` | **A1** | missing prepositions field |
| `take from` | `παίρνω` | **A1** | missing prepositions field |
| `talk about` | `μιλάω` | **A1** | missing prepositions field |
| `talk about someone` | `μιλάω` | **A1** | missing prepositions field |
| `talk about something` | `μιλάω` | **A1** | missing prepositions field |
| `talk to someone` | `μιλάω` | **A1** | missing prepositions field |
| `talk with someone` | `μιλάω` | **A1** | missing prepositions field |
| `thank for` | `ευχαριστώ` | **A1** | missing prepositions field |
| `think about` | `σκέφτομαι` | **A1** | missing prepositions field |
| `think of` | `σκέφτομαι` | **A1** | missing prepositions field |
| `travel by bus take a bus` | `παίρνω` | **A1** | missing prepositions field |
| `travel by plane` | `ταξιδεύω` | **A1** | missing prepositions field |
| `travel by train` | `παίρνω` | **A1** | missing prepositions field |
| `travel to` | `ταξιδεύω` | **A1** | missing prepositions field |
| `trust` | `εμπιστεύομαι` | **A0** | missing prepositions field |
| `volere + infinitive` | `θέλω` | **A1** | missing prepositions field |
| `wait for` | `περιμένω` | **A1** | missing prepositions field |
| `wait for someone` | `περιμένω` | **A1** | missing prepositions field |
| `walk to` | `πηγαίνω` | **A1** | missing prepositions field |
| `want` | `θέλω` | **A0** | missing prepositions field |
| `warn about` | `προειδοποιώ` | **A1** | missing prepositions field |
| `waste time` | `χάνω` | **A1** | missing prepositions field |
| `watch` | `βλέπω` | **A1** | missing prepositions field |
| `work` | `δουλεύω` | **A0** | missing prepositions field |
| `work at` | `δουλεύω` | **A1** | missing prepositions field |
| `work for` | `δουλεύω` | **A1** | missing prepositions field |
| `work on` | `δουλεύω` | **A1** | missing prepositions field |
| `work with` | `δουλεύω` | **A1** | missing prepositions field |
| `worry` | `ανησυχώ` | **A0** | missing prepositions field |
| `worry about` | `ανησυχώ` | **A1** | missing prepositions field |
| `write to someone` | `γράφω` | **A1** | missing prepositions field |
| `участвовать в` | `συμμετέχω` | **A1** | missing prepositions field |

---

## Greek Klisi-Rimaton Engine
**Target Dataset File**: `tools/el/klisi-rimaton/data/verbs.json`

### Coverage Statistics
- **Total Source Concepts Evaluated**: `349`
- **Present in Engine**: `164` (A0: `39`, A1: `125`)
- **Genuinely Missing**: `185` (A0: `29`, A1: `156`)
- **Lower Quality Engine Entries**: `0`

### Present Concepts (Covered)
| Source Concept Key | Level | Matched Key in Engine |
| :--- | :---: | :--- |
| `access` | **A1** | `έχω` |
| `achieve` | **A1** | `πετυχαίνω` |
| `agree on` | **A1** | `συμφωνώ` |
| `agree that` | **A1** | `συμφωνώ` |
| `agree with` | **A1** | `συμφωνώ` |
| `answer someone` | **A1** | `απαντάω` |
| `apologize for` | **A1** | `ζητάω` |
| `apply for` | **A1** | `κάνω` |
| `argue with` | **A1** | `μαλώνω` |
| `arrive at` | **A1** | `φτάνω` |
| `arrive from` | **A1** | `φτάνω` |
| `ask about` | **A1** | `ρωτάω` |
| `ask for` | **A1** | `ζητάω` |
| `ask someone for something` | **A1** | `ζητάω` |
| `be` | **A0** | `είμαι` |
| `be able to` | **A1** | `μπορώ` |
| `be afraid of` | **A1** | `φοβάμαι` |
| `be good at` | **A1** | `είμαι` |
| `be happy about` | **A1** | `χαίρομαι` |
| `be part of` | **A1** | `είμαι` |
| `be ready for` | **A1** | `είμαι` |
| `be ready to` | **A1** | `είμαι` |
| `be sad about` | **A1** | `λυπάμαι` |
| `believe` | **A0** | `πιστεύω` |
| `believe in` | **A1** | `πιστεύω` |
| `belong to` | **A1** | `ανήκω` |
| `buy` | **A0** | `αγοράζω` |
| `buy from` | **A1** | `αγοράζω` |
| `change` | **A1** | `αλλάζω` |
| `change into` | **A1** | `αλλάζω` |
| `change something about` | **A1** | `αλλάζω` |
| `change your mind` | **A1** | `αλλάζω` |
| `change yourself` | **A1** | `αλλάζω` |
| `click` | **A0** | `κάνω` |
| `come from` | **A1** | `έρχομαι` |
| `come from someone` | **A1** | `έρχομαι` |
| `come to` | **A1** | `έρχομαι` |
| `complain about` | **A1** | `παραπονιέμαι` |
| `continue doing` | **A1** | `συνεχίζω` |
| `cook` | **A0** | `μαγειρεύω` |
| `cry` | **A0** | `κλαίω` |
| `decide` | **A1** | `αποφασίζω` |
| `decide about` | **A1** | `αποφασίζω` |
| `decide on` | **A1** | `αποφασίζω` |
| `decide to` | **A1** | `αποφασίζω` |
| `disagree about` | **A1** | `διαφωνώ` |
| `disagree with` | **A1** | `διαφωνώ` |
| `discuss` | **A1** | `συζητώ` |
| `do make` | **A0** | `κάνω` |
| `drink` | **A0** | `πίνω` |
| `drive to` | **A1** | `οδηγώ` |
| `earn` | **A1** | `κερδίζω` |
| `eat` | **A0** | `τρώω` |
| `expect` | **A1** | `περιμένω` |
| `fail at` | **A1** | `αποτυγχάνω` |
| `fear` | **A1** | `φοβάμαι` |
| `fear be afraid` | **A0** | `φοβάμαι` |
| `feel` | **A0** | `νιώθω` |
| `feel better` | **A1** | `νιώθω` |
| `feel like doing` | **A1** | `έχω` |
| `feel sad` | **A1** | `νιώθω` |
| `find something` | **A1** | `βρίσκω` |
| `finish doing` | **A1** | `τελειώνω` |
| `finish work` | **A1** | `τελειώνω` |
| `follow` | **A0** | `ακολουθώ` |
| `follow someone` | **A1** | `ακολουθώ` |
| `forgive` | **A1** | `συγχωρώ` |
| `forgive for` | **A1** | `συγχωρώ` |
| `get` | **A0** | `παίρνω` |
| `get to know` | **A1** | `γνωρίζω` |
| `give` | **A0** | `δίνω` |
| `go back to` | **A1** | `γυρίζω` |
| `go to` | **A1** | `πάω` |
| `go to someone` | **A1** | `πάω` |
| `hate` | **A1** | `μισώ` |
| `have` | **A0** | `έχω` |
| `have to` | **A1** | `πρέπει` |
| `hope` | **A0** | `ελπίζω` |
| `hope to` | **A1** | `ελπίζω` |
| `know` | **A0** | `ξέρω` |
| `know about` | **A1** | `ξέρω` |
| `laugh` | **A0** | `γελάω` |
| `lead to` | **A1** | `οδηγώ` |
| `learn` | **A0** | `μαθαίνω` |
| `learn a language` | **A1** | `μαθαίνω` |
| `learn about` | **A1** | `μαθαίνω` |
| `learn from` | **A1** | `μαθαίνω` |
| `learn to` | **A1** | `μαθαίνω` |
| `leave a place` | **A1** | `φεύγω` |
| `listen to` | **A1** | `ακούω` |
| `listen to someone` | **A1** | `ακούω` |
| `live abroad` | **A1** | `ζω` |
| `live in` | **A1** | `μένω` |
| `live with` | **A1** | `μένω` |
| `look for` | **A1** | `ψάχνω` |
| `love` | **A0** | `αγαπάω` |
| `meet someone` | **A1** | `γνωρίζω` |
| `message` | **A1** | `στέλνω` |
| `move towards` | **A1** | `πηγαίνω` |
| `need` | **A0** | `χρειάζομαι` |
| `pay` | **A0** | `πληρώνω` |
| `pay for` | **A1** | `πληρώνω` |
| `pensare` | **A0** | `σκέφτομαι` |
| `predict` | **A1** | `προβλέπω` |
| `prepare` | **A0** | `ετοιμάζω` |
| `put` | **A0** | `βάζω` |
| `put into` | **A1** | `βάζω` |
| `put on` | **A0** | `βάζω` |
| `put something on` | **A1** | `βάζω` |
| `remember` | **A0** | `θυμάμαι` |
| `remember to` | **A1** | `θυμάμαι` |
| `rest` | **A0** | `ξεκουράζομαι` |
| `say` | **A1** | `λέω` |
| `search` | **A0** | `ψάχνω` |
| `search for` | **A1** | `ψάχνω` |
| `search through` | **A1** | `ψάχνω` |
| `sell to` | **A1** | `πουλάω` |
| `send` | **A0** | `στέλνω` |
| `send something to someone` | **A1** | `στέλνω` |
| `show` | **A1** | `δείχνω` |
| `show something to someone` | **A1** | `δείχνω` |
| `sleep` | **A0** | `κοιμάμαι` |
| `sleep at` | **A1** | `κοιμάμαι` |
| `speak about` | **A1** | `μιλάω` |
| `speak with` | **A1** | `μιλάω` |
| `start a job` | **A1** | `αρχίζω` |
| `start doing` | **A1** | `αρχίζω` |
| `stay at` | **A1** | `μένω` |
| `stop doing` | **A1** | `σταματάω` |
| `study for` | **A1** | `διαβάζω` |
| `take` | **A0** | `παίρνω` |
| `take from` | **A1** | `παίρνω` |
| `take off` | **A0** | `βγάζω` |
| `talk about` | **A1** | `μιλάω` |
| `talk about someone` | **A1** | `μιλάω` |
| `talk about something` | **A1** | `μιλάω` |
| `talk to someone` | **A1** | `μιλάω` |
| `talk with someone` | **A1** | `μιλάω` |
| `tell` | **A1** | `λέω` |
| `think about` | **A1** | `σκέφτομαι` |
| `think of` | **A1** | `σκέφτομαι` |
| `travel by bus take a bus` | **A1** | `παίρνω` |
| `travel by plane` | **A1** | `ταξιδεύω` |
| `travel by train` | **A1** | `παίρνω` |
| `travel to` | **A1** | `ταξιδεύω` |
| `try to` | **A1** | `προσπαθώ` |
| `try to be` | **A1** | `προσπαθώ` |
| `understand` | **A0** | `καταλαβαίνω` |
| `use` | **A0** | `χρησιμοποιώ` |
| `volere + infinitive` | **A1** | `θέλω` |
| `wait for` | **A1** | `περιμένω` |
| `wait for someone` | **A1** | `περιμένω` |
| `wake up` | **A0** | `ξυπνάω` |
| `walk to` | **A1** | `πηγαίνω` |
| `want` | **A0** | `θέλω` |
| `wash` | **A0** | `πλένω` |
| `waste time` | **A1** | `χάνω` |
| `watch` | **A1** | `βλέπω` |
| `work` | **A0** | `δουλεύω` |
| `work at` | **A1** | `δουλεύω` |
| `work for` | **A1** | `δουλεύω` |
| `work on` | **A1** | `δουλεύω` |
| `work with` | **A1** | `δουλεύω` |
| `write to someone` | **A1** | `γράφω` |

### Genuinely Missing Concepts
| Missing Concept Key | Implied CEFR Level | Source Term / Equivalent |
| :--- | :---: | :--- |
| `check` | **A0** | `ελέγχω` |
| `connect` | **A0** | `συνδέω / συνδέομαι` |
| `correct` | **A0** | `διορθώνω` |
| `delete` | **A0** | `διαγράφω` |
| `download` | **A0** | `κατεβάζω` |
| `enjoy` | **A0** | `απολαμβάνω` |
| `exercise` | **A0** | `γυμνάζομαι` |
| `fare male` | **A0** | `πονάω` |
| `forget` | **A0** | `ξεχνάω` |
| `have fun` | **A0** | `διασκεδάζω` |
| `improve` | **A0** | `βελτιώνω` |
| `invite` | **A0** | `προσκαλώ` |
| `like` | **A0** | `μου αρέσει` |
| `mean` | **A0** | `σημαίνω` |
| `meet` | **A0** | `συναντάω` |
| `miss someonesomething` | **A0** | `μου λείπει` |
| `plan` | **A0** | `σχεδιάζω` |
| `practise` | **A0** | `εξασκούμαι` |
| `receive` | **A0** | `λαμβάνω` |
| `relax` | **A0** | `χαλαρώνω` |
| `save` | **A0** | `αποθηκεύω` |
| `share` | **A0** | `μοιράζομαι` |
| `smile` | **A0** | `χαμογελάω` |
| `study` | **A0** | `σπουδάζω / μελετάω` |
| `teach` | **A0** | `διδάσκω` |
| `trust` | **A0** | `εμπιστεύομαι` |
| `visit` | **A0** | `επισκέπτομαι` |
| `wear` | **A0** | `φοράω` |
| `worry` | **A0** | `ανησυχώ` |
| `accept` | **A1** | `αποδέχομαι` |
| `accept yourself` | **A1** | `αποδέχομαι τον εαυτό μου` |
| `act` | **A1** | `ενεργώ / συμπεριφέρομαι` |
| `adapt to` | **A1** | `προσαρμόζομαι σε` |
| `advise` | **A1** | `συμβουλεύω` |
| `answer` | **A1** | `απαντώ σε` |
| `apologize to` | **A1** | `ζητώ συγγνώμη από` |
| `appear` | **A1** | `εμφανίζομαι` |
| `avoid` | **A1** | `αποφεύγω` |
| `balance` | **A1** | `ισορροπώ` |
| `be bad at` | **A1** | `δεν είμαι καλός σε` |
| `be excited about` | **A1** | `ενθουσιάζομαι για` |
| `be interested in` | **A1** | `ενδιαφέρομαι για` |
| `be interested in learning` | **A1** | `ενδιαφέρομαι να μάθω` |
| `be surprised by` | **A1** | `εκπλήσσομαι από` |
| `be tired of` | **A1** | `βαριέμαι / κουράζομαι από` |
| `be worried about` | **A1** | `ανησυχώ για` |
| `become` | **A1** | `γίνομαι` |
| `become interested in` | **A1** | `ενδιαφέρομαι για` |
| `behave well` | **A1** | `συμπεριφέρομαι καλά` |
| `blame for` | **A1** | `κατηγορώ για` |
| `block` | **A1** | `μπλοκάρω` |
| `break` | **A1** | `κόβω` |
| `bring from` | **A1** | `φέρνω από` |
| `bring to` | **A1** | `φέρνω σε` |
| `call` | **A1** | `τηλεφωνώ` |
| `call someone` | **A1** | `τηλεφωνώ σε κάποιον` |
| `care about` | **A1** | `ενδιαφέρομαι για` |
| `cause` | **A1** | `προκαλώ` |
| `check on` | **A1** | `ελέγχω αν είναι καλά` |
| `choose` | **A1** | `επιλέγω` |
| `choose between` | **A1** | `επιλέγω μεταξύ` |
| `come out of` | **A1** | `βγαίνω από` |
| `comment on` | **A1** | `σχολιάζω` |
| `communicate with` | **A1** | `επικοινωνώ με` |
| `compare with` | **A1** | `συγκρίνω με` |
| `concentrate on` | **A1** | `συγκεντρώνομαι σε` |
| `connect to` | **A1** | `συνδέομαι με` |
| `consider` | **A1** | `εξετάζω` |
| `contact` | **A1** | `επικοινωνώ με` |
| `contribute to` | **A1** | `συμβάλλω σε` |
| `control yourself` | **A1** | `ελέγχω τον εαυτό μου` |
| `create` | **A1** | `δημιουργώ` |
| `cure` | **A1** | `θεραπεύω` |
| `deal with` | **A1** | `αντιμετωπίζω` |
| `deny` | **A1** | `αρνούμαι` |
| `depend on` | **A1** | `εξαρτώμαι από` |
| `describe` | **A1** | `περιγράφω` |
| `develop` | **A1** | `αναπτύσσω` |
| `develop into` | **A1** | `εξελίσσομαι σε` |
| `develop yourself` | **A1** | `αναπτύσσομαι` |
| `disappear` | **A1** | `εξαφανίζομαι` |
| `discover` | **A1** | `ανακαλύπτω` |
| `discover yourself` | **A1** | `ανακαλύπτω τον εαυτό μου` |
| `download from` | **A1** | `κατεβάζω από` |
| `dream about` | **A1** | `ονειρεύομαι` |
| `dream of` | **A1** | `ονειρεύομαι` |
| `enjoy doing` | **A1** | `μου αρέσει να κάνω` |
| `enter` | **A1** | `μπαίνω σε` |
| `exist` | **A1** | `υπάρχω` |
| `experience` | **A1** | `βιώνω` |
| `explain something to someone` | **A1** | `εξηγώ κάτι σε κάποιον` |
| `explain to` | **A1** | `εξηγώ σε` |
| `explain why` | **A1** | `εξηγώ γιατί` |
| `explore` | **A1** | `εξερευνώ` |
| `express` | **A1** | `εκφράζω` |
| `express yourself` | **A1** | `εκφράζομαι` |
| `face` | **A1** | `αντιμετωπίζω` |
| `focus on` | **A1** | `συγκεντρώνομαι σε` |
| `forget to` | **A1** | `ξεχνάω να κάνω` |
| `get better at` | **A1** | `γίνομαι καλύτερος σε` |
| `get into` | **A1** | `μπαίνω σε` |
| `get out of` | **A1** | `βγαίνω από` |
| `get used to` | **A1** | `συνηθίζω` |
| `go into` | **A1** | `μπαίνω σε` |
| `grow as` | **A1** | `εξελίσσομαι ως` |
| `grow into` | **A1** | `γίνομαι` |
| `happen` | **A1** | `συμβαίνω` |
| `help someone` | **A1** | `βοηθάω κάποιον` |
| `help someone with` | **A1** | `βοηθάω κάποιον με` |
| `help someone with something` | **A1** | `βοηθάω κάποιον με κάτι` |
| `help with` | **A1** | `βοηθάω με` |
| `hope for` | **A1** | `надеύομαι για / ελπίζω σε` |
| `imagine` | **A1** | `φαντάζομαι` |
| `improve at` | **A1** | `βελτιώνομαι σε` |
| `improve yourself` | **A1** | `βελτιώνομαι` |
| `increase` | **A1** | `αυξάνω` |
| `influence` | **A1** | `επηρεάζω` |
| `introduce someone to someone` | **A1** | `συστήνω κάποιον σε κάποιον` |
| `invite to` | **A1** | `προσκαλώ σε` |
| `join` | **A1** | `συμμετέχω σε / μπαίνω σε` |
| `lead` | **A1** | `ηγούμαι` |
| `leave exit` | **A1** | `βγαίνω από` |
| `log in` | **A1** | `συνδέομαι` |
| `log in to` | **A1** | `συνδέομαι σε` |
| `log out` | **A1** | `αποσυνδέομαι` |
| `look after` | **A1** | `φροντίζω` |
| `look at` | **A1** | `κοιτάω` |
| `look forward to` | **A1** | `ανυπομονώ για` |
| `love doing` | **A1** | `αγαπώ να κάνω` |
| `manage` | **A1** | `διαχειρίζομαι` |
| `matter` | **A1** | `έχει σημασία` |
| `meet at` | **A1** | `συναντιέμαι σε` |
| `meet with someone` | **A1** | `συναντιέμαι με κάποιον` |
| `miss` | **A1** | `μου λείπει` |
| `move to` | **A1** | `μετακομίζω σε` |
| `need to` | **A1** | `χρειάζεται να` |
| `notice` | **A1** | `παρατηρώ` |
| `plan to` | **A1** | `σχεδιάζω να` |
| `practise speaking` | **A1** | `εξασκούμαι στην ομιλία` |
| `practise with` | **A1** | `εξασκούμαι με` |
| `prepare for` | **A1** | `ετοιμάζομαι για` |
| `prevent` | **A1** | `предотвращω / εμποδίζω` |
| `prevent from` | **A1** | `εμποδίζω` |
| `promise` | **A1** | `υπόσχομαι` |
| `protect` | **A1** | `προστατεύω` |
| `protect from` | **A1** | `προστατεύω από` |
| `prove` | **A1** | `αποδεικνύω` |
| `realize` | **A1** | `συνειδητοποιώ` |
| `recover from` | **A1** | `αναρρώνω από` |
| `reduce` | **A1** | `μειώνω` |
| `refuse` | **A1** | `αρνούμαι` |
| `regret` | **A1** | `μετανιώνω για` |
| `rely on` | **A1** | `βασίζομαι σε` |
| `remind of` | **A1** | `θυμίζω` |
| `repeat after` | **A1** | `επαναλαμβάνω μετά από` |
| `reply to` | **A1** | `απαντώ σε` |
| `respect` | **A1** | `σέβομαι` |
| `return to` | **A1** | `επιστρέφω σε` |
| `save from` | **A1** | `σώζω από` |
| `save money for` | **A1** | `αποταμιεύω για` |
| `save time` | **A1** | `εξοικονομώ χρόνο` |
| `seem` | **A1** | `φαίνομαι` |
| `share with` | **A1** | `μοιράζομαι με` |
| `sign up for` | **A1** | `εγγράφομαι σε` |
| `solve` | **A1** | `λύνω` |
| `spend money on` | **A1** | `ξοδεύω χρήματα για` |
| `spend time on` | **A1** | `περνάω χρόνο σε` |
| `spend time with` | **A1** | `περνάω χρόνο με` |
| `study at` | **A1** | `σπουδάζω σε` |
| `subscribe to` | **A1** | `εγγράφομαι σε` |
| `succeed in` | **A1** | `καταφέρνω να` |
| `suffer from` | **A1** | `υποφέρω από` |
| `support` | **A1** | `υποστηρίζω` |
| `take care of` | **A1** | `φροντίζω` |
| `thank for` | **A1** | `ευχαριστώ για` |
| `train` | **A1** | `προπονούμαι` |
| `translate from` | **A1** | `μεταφράζω από` |
| `translate into` | **A1** | `μεταφράζω στα` |
| `treat` | **A1** | `θεραπεύω` |
| `turn into` | **A1** | `μετατρέπομαι σε` |
| `upload` | **A1** | `ανεβάζω` |
| `upload to` | **A1** | `ανεβάζω σε` |
| `warn about` | **A1** | `προειδοποιώ για` |
| `worry about` | **A1** | `ανησυχώ για` |
| `участвовать в` | **A1** | `συμμετέχω σε` |

### Lower Quality Engine Entries
*No lower quality entries detected. All matched entries satisfy core schema quality requirements.*

---
