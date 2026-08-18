# The Right Gear — Project Manual

**Document:** `PROJECT_MANUAL.md`  
**Version:** 0.2.0  
**Status:** Working Draft / Project Source of Truth  
**Last updated:** 2026-08-09  
**Public product language:** English only  
**Project:** The Right Gear

---

## 1. Purpose of this document

This document defines the stable product, UX, architecture, data-governance and engineering principles of **The Right Gear**.

It exists so the project can be moved between Google AI Studio / Gemini and other AI-assisted development environments without losing context or silently changing core decisions.

Task-specific prompts may change implementation details, but they must not contradict this manual without explicitly proposing and documenting a project decision.

The detailed automotive ontology is defined separately in:

`/docs/KNOWLEDGE_GRAPH_BIBLE.md`

---

## 2. Product definition

**The Right Gear** is an Automotive Intelligence platform dedicated to iconic, collectible, historically significant and investment-relevant automobiles.

The long-term ambition is to become a trusted reference — a digital “Bible” — for enthusiasts, collectors, investors and automotive professionals.

The product combines:

1. **Automotive Knowledge**
2. **Market Intelligence**
3. **AI-assisted discovery and decision support**
4. **A curated professional ecosystem**

The product is not intended to be a generic vehicle database or a conventional classified marketplace.

---

## 3. Product positioning

The Right Gear should help a user answer questions such as:

- What makes this automobile important?
- Which generation or variant am I looking at?
- How does one version differ from another?
- Who designed or engineered it?
- Which engine family does it use?
- Which other vehicles share components, technology or ancestry?
- How many were produced?
- Which data sources support a claim?
- How active is the market?
- Is the market appreciating, declining or too thin to assess reliably?
- Which comparable cars should I consider?
- What are the historical, technical and collector relationships around this vehicle?

The application must transform fragmented automotive information into structured, traceable knowledge.

---

## 4. Core product principles

The product must feel:

- minimal;
- premium;
- fast;
- intuitive;
- authoritative;
- editorial;
- data-driven.

The application must **not** feel like a raw database.

### 4.1 Progressive disclosure

Complexity belongs in the data architecture. Simplicity belongs in the interface.

Public information should be progressively exposed as:

**UNDERSTAND → DISCOVER → ANALYSE → EXPLORE**

A casual visitor should understand a vehicle quickly.

An expert should be able to continue into specifications, production, market data, sources and relationships without changing products.

### 4.2 Trust over completeness

Unknown values are preferable to invented values.

When a reliable value is unavailable, use:

- `NULL`
- `UNKNOWN`
- `N/A`
- `INSUFFICIENT DATA`

Never complete a page with fabricated data simply to make the interface look finished.

---

## 5. MVP language

The public MVP is **English only**.

Do not expose:

- Italian UI;
- an IT/EN switch;
- duplicated records by language.

The system may remain localization-ready internally.

Canonical entity identifiers must always be language-neutral.

---

## 6. Public information architecture

The preferred public desktop navigation is intentionally small:

`[THE RIGHT GEAR] [GLOBAL SEARCH] Explore | Market | Account`

Authenticated users may access Watchlist and user-specific functions contextually without turning the main navigation into a dashboard menu.

### 6.1 Mobile

Mobile should use a compact top header.

If a bottom navigation is useful, it must contain no more than four primary destinations, for example:

- Home
- Explore
- Watchlist
- Profile

Do not expose internal tools such as the Knowledge Graph editor in public navigation.

---

## 7. Homepage

The homepage must be search-led rather than dashboard-led.

Recommended structure:

1. Brand / minimal header
2. Hero statement
3. Primary vehicle search
4. Advanced Search entry point
5. Ask The Right Gear entry point
6. Curated categories
7. Editor's Selection
8. Explore its DNA introduction
9. Minimal footer

Avoid on the homepage:

- large market dashboards;
- dense technical tables;
- auction feeds;
- full graph visualizations;
- news walls;
- excessive cards;
- permanent sidebars.

---

## 8. Search

Search is a core product feature, not a utility.

### 8.1 Canonical hierarchy

Search must distinguish:

**Maker → Model → Generation → Variant**

It must never flatten these concepts into a generic “car” record.

Future search may also include:

- Person
- Engine
- Engine Family
- Factory
- Technology
- Historical Event

### 8.2 Simple search

The main search field should accept maker, model, generation or version names.

Suggested behavior:

- suggestions after 2 characters;
- approximately 150–200 ms debounce;
- maximum ~8 primary suggestions;
- keyboard navigation;
- `Enter`, arrows and `Escape`;
- `Cmd/Ctrl + K`;
- `/` shortcut where appropriate.

Search results should expose enough context to disambiguate entities.

Typical result information:

- image thumbnail, if approved;
- maker;
- model;
- generation;
- variant;
- years;
- category;
- selected technical highlights;
- production total when verified;
- data status.

### 8.3 Advanced Search

Advanced Search uses progressive disclosure.

Initial filters:

- Maker
- Model
- Generation
- Year From
- Year To
- Category

Additional filters may include:

- Variant
- Country
- Body style
- Engine architecture
- Aspiration
- Power
- Transmission
- Drivetrain
- Production volume
- Limited edition
- Homologation special
- Designer
- Collector relevance
- Market price range

Do not expose every filter at once.

### 8.4 Ask The Right Gear

Natural-language search may translate a user's request into structured filters and graph queries.

AI may interpret the request.

AI must **not invent matching vehicles**.

The final result set must come from canonical application data.

---

## 9. Vehicle hierarchy

The following hierarchy is mandatory:

```text
Maker
└── Model
    └── Generation
        └── Variant
            └── Vehicle Instance
```

Example:

```text
BMW
└── M3
    └── E30
        └── Sport Evolution
            └── one physical chassis
```

### 9.1 Model

A Model represents the complete vehicle family.

Example: `BMW M3`

A model page may contain:

- family history;
- production period;
- generation timeline;
- overall market context;
- featured variants;
- competitors;
- family-level collector context.

Do not store a single-variant technical specification at Model level unless it is explicitly an aggregate or range.

### 9.2 Generation

A Generation represents a distinct model generation.

Example: `BMW M3 E30`

A generation page may contain:

- history;
- shared architecture;
- production period;
- body styles;
- engine families;
- markets;
- updates;
- variants;
- generation production data;
- common media.

### 9.3 Variant

A Variant is the primary technical and collector-specific level.

Example: `BMW M3 E30 Sport Evolution`

A variant page may contain:

- exact technical specifications;
- production data;
- engines;
- transmissions;
- options;
- colours;
- markets;
- market observations;
- media;
- provenance;
- graph relationships.

### 9.4 Vehicle Instance

A Vehicle Instance represents one physical automobile.

Vehicle Instance support is architecturally important but does not need to be populated for every catalogue item during the MVP.

It may later contain:

- VIN / chassis identifiers;
- production sequence;
- build date;
- original configuration;
- provenance;
- auction history;
- maintenance;
- restoration;
- ownership history;
- matching-number evidence.

Vehicle Instance data receives higher privacy protection than public Variant data.

---

## 10. Preferred public routes

Preferred semantic route structure:

```text
/brands/:makerSlug
/cars/:makerSlug/:modelSlug
/cars/:makerSlug/:modelSlug/:generationSlug
/cars/:makerSlug/:modelSlug/:generationSlug/:variantSlug
/market
/explore
/editor/import-lab
/editor/graph-preview/:entityId
```

Routes may be adapted to the existing router, but semantics must remain clear.

---

## 11. Vehicle page UX

Variant pages should reveal information in four depths.

### Level 1 — Understand

- Hero image
- Why it matters
- Key facts

### Level 2 — Discover

- History
- Timeline
- Production
- Versions / context

### Level 3 — Analyse

- Full specifications
- Market
- Comparables
- Transaction / auction intelligence when available

### Level 4 — Explore

- Explore its DNA
- Sources
- Evidence
- Relationships

Preferred contextual tabs:

`Overview | Specifications | History | Production | Market | Media | DNA`

---

## 12. Public graph terminology

Internally, the project uses the term:

**Automotive Knowledge Graph**

Publicly, prefer:

**Explore its DNA**

or contextually:

**Car DNA**

Do not force technical graph terminology on ordinary users.

---

## 13. Market Intelligence

`Market` is a primary product area.

It is **not** primarily a classifieds marketplace.

The Market section should answer:

> What is happening in the collectible car market right now?

### 13.1 Market landing page

The page may include:

- Market Movers
- Top Appreciating
- Top Declining
- Most Active
- Search Market
- Maker / Model / Generation / Variant exploration

Supported periods may include:

- 3M
- 12M
- 3Y
- 5Y

### 13.2 Market data integrity

Never silently mix:

- asking prices;
- dealer prices;
- auction hammer prices;
- final transaction prices;
- valuations.

Market metrics must identify the type of source data used.

If there is not enough data, display:

`N/A` or `INSUFFICIENT DATA`

Never invent an appreciation or depreciation percentage.

### 13.3 Market data levels

Market intelligence can exist at:

- Model
- Generation
- Variant

Variant-level intelligence is preferred when data volume is sufficient.

---

## 14. Catalogue strategy

The Right Gear is editorially curated.

It is not intended to contain every ordinary car ever manufactured.

The catalogue focuses on:

- iconic cars;
- collector cars;
- historically significant automobiles;
- classics;
- youngtimers;
- supercars;
- hypercars;
- homologation specials;
- limited editions;
- future classics;
- investment-relevant automobiles.

### 14.1 Maker vs Model scope

The Maker Registry may be broad.

The Model Registry is curated.

Do not automatically import every production model of every maker.

### 14.2 Catalogue status

Recommended lifecycle:

```text
OUT_OF_SCOPE
CANDIDATE
SELECTED
IN_RESEARCH
IN_REVIEW
PUBLISHED
ARCHIVED
```

### 14.3 Catalogue tier

Recommended editorial tiers:

```text
HERO
CORE
DISCOVERY
```

The initial long-term catalogue target is approximately 300 highly relevant vehicle families / generations / variants, but the MVP must not import them all before the acquisition pipeline is validated.

---

## 15. Current controlled test catalogue

The first controlled catalogue used to validate the architecture is intentionally small.

### BMW

```text
M3
└── E30
    ├── M3 2.3
    ├── M3 Evolution II
    └── M3 Sport Evolution
```

### Ferrari

```text
F40
└── F40
    └── F40 European specification
```

### Porsche

```text
911
└── 993
    ├── Carrera
    └── Turbo
```

### Lancia

```text
Delta
└── HF Integrale
    └── Evoluzione II
```

All test records begin as:

`IN_RESEARCH`

No technical values are to be invented to populate these records.

---

## 16. Automatic data acquisition

A primary MVP question is:

> How much essential automotive data can The Right Gear acquire automatically from the web, with provenance, without inventing facts?

The internal tool for this experiment is:

`Import Lab`

Preferred route:

`/editor/import-lab`

### 16.1 Import flow

```text
Editorial Import Directive
→ Source Discovery
→ Source Retrieval
→ Structured Extraction
→ Normalisation
→ Entity Resolution
→ Assertions
→ Conflict Detection
→ Editorial Review
→ Canonical Selection
→ Knowledge Graph
→ Public Preview
```

No imported value becomes public automatically.

### 16.2 Provider architecture

External sources must be accessed through adapters.

Initial provider candidates:

- Gemini with Google Search grounding
- Gemini URL Context
- Wikidata SPARQL
- Wikimedia Commons
- YouTube Data API
- Europeana

Future commercial providers must also use adapters.

Never invent an API endpoint or pretend a mocked provider is live.

Provider state should be explicit:

```text
LIVE
MOCK
DEMO
NOT_CONFIGURED
```

---

## 17. Essential data test set

The first importer should attempt a controlled set of essential information.

### Identity

- maker
- model
- generation
- variant
- internal code
- model year range
- production date range

### Engine

- engine code
- engine family
- architecture
- cylinders
- displacement
- aspiration
- fuel system
- power
- torque
- relevant RPM values

### Transmission / drivetrain

- transmission type
- gear count
- drivetrain

### Dimensions

- length
- width
- height
- wheelbase

### Weight

- dry weight
- kerb weight

### Performance

- top speed
- 0–100 km/h

### Production

- production total
- limited-edition status
- homologation status

### History

- designer
- engineer
- factory
- country of production
- original price/currency when reliably available

### Configuration

- known factory colours

### Media

- image candidates
- video candidates

Unavailable data remains unknown.

---

## 18. Data provenance model

The conceptual data flow is:

```text
SOURCE
→ ASSERTION
→ EVIDENCE / REVIEW
→ CANONICAL KNOWLEDGE
→ APPLICATION
```

Imported information is not canonical merely because it was successfully extracted.

Every important imported factual value should preserve its source.

Detailed rules are defined in `KNOWLEDGE_GRAPH_BIBLE.md`.

---

## 19. Editorial control

Recommended editorial states:

```text
DISCOVERED
PENDING_REVIEW
APPROVED
REJECTED
CONFLICT
SUPERSEDED
PUBLISHED
ARCHIVED
```

The exact enum implementation may vary by entity type.

AI may assist with:

- discovery;
- extraction;
- normalisation;
- classification;
- entity matching;
- duplicate detection;
- conflict detection;
- relationship suggestions;
- canonical-value recommendations.

AI may not silently:

- publish;
- overwrite verified facts;
- destroy conflicting evidence;
- merge entities irreversibly;
- invent missing data.

---

## 20. Media policy

An image found online is not automatically reusable.

External media must preserve, where available:

- source;
- source page;
- author;
- licence;
- licence URL;
- attribution requirements;
- commercial-use permission;
- derivative-use permission;
- copyright status;
- editorial status.

Suggested media candidate states:

```text
ELIGIBLE
NEEDS_REVIEW
REJECTED
APPROVED
```

Only approved media may appear publicly.

For YouTube:

- store metadata;
- use official embeds;
- do not download video files.

---

## 21. Architecture — target/current direction

The codebase should remain portable and avoid unnecessary vendor lock-in.

Expected application architecture:

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- reusable component system
- accessible Radix-style primitives where already used
- D3 / Recharts where visualization is justified

### Backend

- Node.js
- Express or the existing server framework
- TypeScript
- server-side external provider access
- validation at API boundaries

### Canonical automotive data

- PostgreSQL

### User/application state

- Firestore where already appropriate

### Authentication

- Firebase Authentication / Identity Platform where already implemented

### Google Cloud

Preferred deployment components may include:

- Cloud Run
- Cloud SQL for PostgreSQL
- Firestore
- Firebase Auth
- Secret Manager
- Cloud Storage
- Cloud Logging / Monitoring
- Cloud Build / Artifact Registry

This section describes the target architecture. When the actual repository differs, the AI agent must inspect the code before changing it and must not rewrite working architecture merely to match this document.

---

## 22. Portability and vendor independence

The project must remain transferable between AI development platforms.

### Rules

1. Keep core product decisions in repository Markdown documents.
2. Keep business logic out of prompts.
3. Keep provider-specific code behind interfaces/adapters.
4. Do not hardcode Gemini-specific assumptions into the automotive domain model.
5. Do not store permanent project knowledge only in an AI chat history.
6. Prefer standard TypeScript, SQL and documented APIs.
7. Keep schema migrations in source control.
8. Keep important prompts or data-extraction schemas versioned when they materially affect data quality.

The application should be able to replace one AI provider without redesigning the canonical automotive database.

---

## 23. Recommended repository documentation

```text
/docs
  PROJECT_MANUAL.md
  KNOWLEDGE_GRAPH_BIBLE.md
```

Future recommended documents:

```text
CATALOGUE_MASTER.md
DATA_SOURCE_POLICY.md
MARKET_METHODOLOGY.md
EDITORIAL_GUIDE.md
API_CONTRACTS.md
DECISION_LOG.md
```

Do not create documents merely for volume. Add them when the project has enough stable decisions to justify them.

---

## 24. Engineering structure

Prefer logical separation:

```text
UI
↓
API / Controllers
↓
Services
↓
Repositories
↓
Database / External Providers
```

Do not put:

- SQL;
- secret API keys;
- provider credentials;
- privileged business logic

inside React components.

Use repository/provider interfaces so in-memory/demo implementations can be replaced by PostgreSQL/live providers without rewriting the UI.

---

## 25. Security principles

Never expose in frontend code:

- API keys;
- database credentials;
- service-account secrets;
- private tokens;
- full private VIN/chassis information;
- private user data.

Sensitive third-party operations belong server-side.

Use environment configuration and secret management.

Vehicle Instance information should support visibility levels such as:

```text
PUBLIC
REGISTERED
PREMIUM
EDITORIAL
PRIVATE
```

---

## 26. Authentication and permissions

Authentication and authorization are separate.

Frontend role checks are for UX only.

Permission enforcement belongs server-side.

The project should prefer capability/permission checks over scattered role-name comparisons.

Do not change an existing working authentication architecture unless explicitly required.

---

## 27. Data storage boundaries

### PostgreSQL

Use for canonical automotive knowledge such as:

- Makers
- Models
- Generations
- Variants
- Engines
- Technical specifications
- Production records
- Sources / assertions
- Relationships
- Market observations
- Listings / auction data
- Canonical selections

### Firestore

Use for user/application state where appropriate, such as:

- profiles;
- preferences;
- watchlists;
- notification state;
- AI conversation state;
- organization application workflow.

Do not move the automotive catalogue to Firestore merely for implementation convenience.

---

## 28. Database principles

Prefer:

- normalized records;
- foreign keys;
- explicit identifiers;
- explicit relationships;
- indexes;
- constraints;
- migrations;
- typed fields.

Use JSON/JSONB when the information is genuinely semi-structured, not as a replacement for a missing domain model.

Do not create one giant generic JSON record for a vehicle.

---

## 29. Knowledge Graph implementation strategy

The MVP Knowledge Graph is represented in PostgreSQL.

Do not add Neo4j merely because the product uses graph concepts.

The architecture should remain Neo4j-ready by using:

- stable global entity IDs;
- explicit predicates;
- subject/object relationships;
- temporal validity;
- provenance;
- confidence;
- relationship metadata.

A graph database may be introduced later if traversal scale or graph analytics justify it.

---

## 30. Market architecture

Prepare domain concepts such as:

- MarketPriceObservation
- MarketTransaction
- MarketListing
- MarketSnapshot
- MarketIndex
- MarketComparable
- MarketRanking

Metrics may include:

- median price;
- observation count;
- transaction count;
- 3M / 12M / 3Y / 5Y change;
- liquidity;
- market confidence.

Metrics must be derived from actual data, not hardcoded.

---

## 31. Source quality

Recommended source trust categories:

```text
LEVEL_1_OFFICIAL_MANUFACTURER
LEVEL_2_OFFICIAL_INSTITUTION
LEVEL_3_STRUCTURED_OPEN_DATA
LEVEL_4_SPECIALIST_EDITORIAL
LEVEL_5_COMMUNITY
UNKNOWN
```

Trust level is a review signal.

It is not a rule that automatically deletes lower-ranked conflicting claims.

A disagreement may be caused by differing scope, market, model year or definition.

---

## 32. Testing and validation

After meaningful implementation changes:

1. run TypeScript type checking;
2. run available automated tests;
3. run production build;
4. fix errors introduced by the change.

Data-import tests must report measurable results such as:

- essential fields requested;
- auto-populated fields;
- missing fields;
- conflict count;
- official source coverage;
- editorial intervention rate;
- image candidates;
- eligible images;
- graph relationship count;
- market-data availability.

Do not hardcode test success metrics.

---

## 33. Change discipline

For significant changes, follow:

```text
INSPECT
→ PLAN
→ IMPLEMENT
→ VALIDATE
→ REPORT
```

Prefer the smallest coherent change.

Avoid unrelated refactoring.

Before an irreversible or destructive operation, report:

- affected tables/files;
- dependencies;
- expected data loss;
- rollback/backup strategy.

---

## 34. AI-agent operating rules

Any AI coding agent working on this repository must:

1. Read this file before significant work.
2. Read `KNOWLEDGE_GRAPH_BIBLE.md` before changing automotive data semantics.
3. Inspect current implementation before editing.
4. Preserve working code unless change is necessary.
5. Never invent automotive data to complete UI.
6. Never claim a mock provider is live.
7. Never silently resolve conflicting facts.
8. Keep the public MVP in English.
9. Validate builds after meaningful changes.
10. Report limitations and remaining mock data.

If code and documentation conflict, do not silently choose one interpretation. Report the discrepancy and propose which source should be updated.

---

## 35. Decision priority

When choosing between alternatives, prioritize:

1. Data integrity
2. Security
3. Usability
4. Maintainability
5. Performance
6. Visual decoration

---

## 36. Current MVP development order

Current strategic order:

1. stabilize project documentation;
2. inspect and clean current automotive demo data safely;
3. establish Maker / Model / Generation / Variant structure;
4. create the controlled test catalogue;
5. implement minimal search-led UX;
6. build Import Lab;
7. test real automatic acquisition;
8. validate Assertions and conflicts;
9. build minimal graph;
10. build vehicle public experience;
11. establish Market foundations;
12. expand catalogue only after the acquisition pipeline is proven.

---

## 37. Project success principle

The Right Gear should make deep automotive knowledge feel simple.

A user should initially experience:

**SEARCH → UNDERSTAND → DISCOVER**

and only progressively reach:

**ANALYSE → MARKET → EXPLORE ITS DNA → SOURCES**

The project should not maximize the number of features visible on screen.

It should maximize the quality, traceability and usefulness of automotive knowledge.

---

## 38. Change log

### 0.2.0 — 2026-08-09

Updated version to 0.2.0 per user specification.

### 0.1.0 — 2026-08-09

Initial project manual established for:

- product identity;
- English-only MVP;
- search-led UX;
- Market Intelligence;
- curated catalogue;
- controlled test catalogue;
- Import Lab;
- data provenance;
- PostgreSQL Knowledge Graph direction;
- media rights;
- AI-agent rules;
- platform portability.
