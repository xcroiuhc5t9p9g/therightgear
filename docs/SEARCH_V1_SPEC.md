# The Right Gear — Search V1 Specification

## Status

Canonical Search V1 Product & Architecture Specification.

This document defines the behaviour, scope and design principles of the Global Discovery Search of The Right Gear.

The strategic relationship between Discovery Search and the future AI Knowledge Layer is defined separately in:

`docs/SEARCH_AND_AI_LAYER.md`

Search V1 must be designed so that its entity-resolution infrastructure can later be reused by the AI Knowledge Layer, but natural-language question answering is NOT part of Search V1.

---

# 1. Strategic Role

The Global Discovery Search is a primary navigation and knowledge-discovery system of The Right Gear.

It must not behave as a simple database filter or as a flat autocomplete list.

Its purpose is to allow the user to enter a name, partial name, automotive designation, technical identifier or other approved searchable expression and immediately discover the principal paths available inside the Automotive Knowledge Graph.

The Search panel must therefore act as an instant map of relevant knowledge directions.

A query such as:

`Honda`

may expose paths toward:

- Honda as Maker
- Honda Civic as Model
- relevant Generations
- relevant Variants
- relevant Engines
- People such as Soichiro Honda
- relevant Organizations

The result set must balance relevance with semantic diversity.

A single entity class must not unnecessarily monopolize the visible suggestion panel.

---

# 2. Search V1 Scope

Search V1 is an entity and identifier discovery system.

It accepts short textual queries and returns existing searchable entities and their canonical internal destinations.

Search V1 does NOT answer open natural-language questions.

Examples of Search V1 queries:

`Honda`

`Civic`

`Soichiro`

`Soichiro Honda`

`EK9`

`B16B`

`Ferrari 328`

`Pininfarina`

Examples of queries reserved for the future AI Knowledge Layer:

`How many Ferrari 328 have been produced?`

`Which Civic generations used K-series engines?`

`Which designers worked on Ferrari and Pininfarina projects?`

The future AI Knowledge Layer may use Search V1 internally for entity resolution.

Search V1 itself must remain deterministic and knowledge-record driven.

---

# 3. Searchable Entity Types

The Search architecture must support the following first-class entity types:

- MAKER
- MODEL
- GENERATION
- VARIANT
- ENGINE
- PERSON
- ORGANIZATION

These entity types apply across the complete The Right Gear automotive scope, including Cars and Motorcycles.

The existence of an entity type in the Search contract does not mean that canonical records for that type already exist.

Entity activation may happen progressively as the corresponding entity sources and public pages become available.

No Search implementation must require page-specific hardcoding for individual entities.

---

# 4. Universal Searchability Contract

Every public searchable knowledge entity must become discoverable automatically from its own structured data.

Searchable entity data must be indexed from entity data sources and must not be manually duplicated inside page components.

Adding a new properly structured Maker, Model, Generation, Variant, Engine, Person or Organization must make that entity searchable according to the common Search rules.

Search must support meaningful terms belonging to an entity without requiring the user to know the complete canonical expression.

Example:

Canonical Person:

`Soichiro Honda`

must allow:

`Soichiro Honda`

and:

`Soichiro`

to discover the Person through the normal matching engine.

A manually created fake alias `Soichiro` must not be required.

Similarly:

`Daisuke Sawai`

must eventually be discoverable through:

`Daisuke`

`Sawai`

`Daisuke Sawai`

once that actual Person entity exists.

Search must never invent an entity merely because the entered term resembles a known real-world name.

If an entity does not exist in the searchable knowledge source, Search must not fabricate it.

---

# 5. Search Keys

Searchable entities may expose structured Search Keys.

The Search V1 key contract includes:

- CANONICAL_NAME
- DISPLAY_NAME
- TECHNICAL_CODE
- GENERATION_CODE
- ENGINE_CODE
- CHASSIS_CODE
- PLATFORM_CODE
- MARKET_DESIGNATION
- ALIAS
- RELATIONAL_CONTEXT

Aliases must exist explicitly in approved entity data.

Search must never invent aliases from model memory.

## RELATIONAL_CONTEXT

The identity of an entity must be distinguished from contextual names belonging to related entities.

Example:

For the Model:

`Honda Civic`

the canonical identity belongs to the Model itself.

`Honda` may also be useful as relational context because Honda is its Maker.

However, `Honda` must not be treated as though it were the canonical name of the Civic entity.

Likewise, Maker names attached to Generations and Variants are relational context, not the canonical names of those child entities.

This distinction is required to prevent parent names from artificially giving every related child entity the same strongest Search score.

The exact implementation may evolve, but the semantic distinction between entity identity and relational context is mandatory.

---

# 6. Matching Model

Search V1 must remain deterministic.

The fundamental textual match strengths are:

EXACT

greater than

PREFIX

greater than

SUBSTRING

The current conceptual values may remain:

Exact = 3

Prefix = 2

Substring = 1

but final ranking must also consider the semantic class of the Search Key.

An exact match on the entity's own identity or technical identifier must have stronger relevance than an equivalent match that exists only because of relational context.

Technical exact matches must not be diluted by broad textual matches.

Example:

`EK9`

when represented as an approved technical designation, must rank its exact technical entity matches ahead of unrelated partial textual matches.

No aggressive fuzzy matching is allowed in Search V1.

Search must prefer missing a speculative result over returning an incorrect automotive association.

---

# 7. Standard Normalization

Standard textual search must be case-insensitive.

At minimum it must support:

- lowercase comparison
- trim
- normal whitespace handling

Search must not use transformations that can silently change the semantic identity of an automotive term.

---

# 8. Technical Normalization

Technical codes require controlled normalization.

The established Search V1 technical normalization may support:

- case-insensitive comparison
- trimming
- removal of spaces
- removal of hyphens

Example conceptual equivalence:

`B16B`

`B16-B`

`B16 B`

may resolve through technical normalization when the underlying indexed identifier is explicitly defined.

Technical normalization must only apply to technical Search Key classes.

Do not apply aggressive normalization to ordinary names.

---

# 9. Result Relevance and Diversification

Search suggestions must satisfy two objectives simultaneously:

1. relevance
2. knowledge-path diversity

The strongest relevant entity must remain prioritised.

However, a large number of records from one entity type must not hide every other relevant type.

The result-selection model must therefore include diversification after scoring.

Conceptual process:

1. normalize query
2. identify matching Search Keys
3. score matches
4. rank matches
5. diversify matched entity types
6. apply visible suggestion limits
7. render semantic groups

The implementation must remain entity-agnostic.

No code such as:

`if query === "Honda"`

or:

`if person === "Soichiro Honda"`

is acceptable.

---

# 10. Suggestion Panel Limit

The Search suggestion panel is a discovery interface, not a full result catalogue.

The visible panel should have:

Maximum total suggestions: 8

This is a maximum, not a requirement to fill all eight positions.

Search V1 should prefer useful semantic diversity over filling every available slot.

As a target UX rule, the initial suggestion panel should normally expose no more than approximately two results from the same entity type when other meaningful entity types are available.

A single type should not occupy four, five or more visible rows merely because additional lower-value matches exist.

Future full-result views may expose more records.

Search V1 must not invent a `View all` destination until a real approved destination exists.

---

# 11. Diversification Contract

Diversification is applied AFTER relevance scoring.

The first pass should attempt to surface the highest-ranked result from each matched entity type.

A second pass may add additional high-ranked results while respecting the compact nature of the suggestion panel.

Example target behaviour for:

`Honda`

could conceptually expose:

MAKER  
Honda

MODEL  
Honda Civic

PEOPLE  
Soichiro Honda

GENERATIONS  
Honda Civic · 1st Generation  
Honda Civic · 2nd Generation

VARIANTS  
Honda Civic · relevant Variant

ENGINES  
relevant Engine when Engine Search is active

The exact records depend only on data that actually exists.

Search must not manufacture a missing category merely to make the panel visually balanced.

---

# 12. Suggestion Groups

Search results should be presented as recognizable semantic groups.

Public group labels may include:

- MAKERS
- MODELS
- GENERATIONS
- VARIANTS
- ENGINES
- PEOPLE
- ORGANIZATIONS

The internal Search entity type remains singular:

`PERSON`

while the public group label may be:

`PEOPLE`

Presentation labels must not alter ontology.

Group ordering should be driven primarily by the relevance of their strongest result, with deterministic tie-breaking.

The Search panel must not become a rigid menu independent of the entered query.

---

# 13. Search Result Contract

Every searchable result must have a stable entity identity and a canonical internal destination.

At minimum a Search result must be able to provide:

- stable entity id
- entity type
- title / canonical display identity
- canonical URL
- relevant Search Keys

Optional presentation metadata may include:

- subtitle
- thumbnail
- maker context
- model context
- generation context
- roles
- other concise entity-specific context

Presentation metadata must not redefine entity identity.

---

# 14. Canonical Internal Navigation

Every Search result representing an actual public entity must point to a real canonical internal URL.

Examples:

Maker:

`/brands/honda`

Model:

`/cars/honda/civic`

Person:

`/people/soichiro-honda`

Future Generation, Variant, Engine and Organization routes must follow their approved canonical routing contracts.

Search must not generate fake or provisional public routes merely to satisfy the result UI.

Search result UI should ultimately use semantic internal links with real `href` destinations while preserving SPA navigation behaviour where appropriate.

Native browser actions such as:

- open in new tab
- copy link
- crawler discovery

must remain possible.

This is part of the global Semantic Internal Linking Contract.

---

# 15. Public Search Safety

Public Search must index only records explicitly eligible for public search.

Target canonical rule:

public
+
searchable
+
approved publication state

Draft, private, internal-review or unpublished canonical entities must not automatically appear in public Search.

During the current UI-lab phase, explicitly designated UI Fixture entities may be searchable for product testing.

This fixture allowance must remain clearly separated from the future canonical publication policy.

Fixture exceptions must not weaken canonical public Search rules globally.

---

# 16. No Hallucinated Search Results

Search is record-driven.

If the knowledge source does not contain a searchable entity or identifier, the system must not fabricate a result using external model knowledge.

Example current negative test:

`Sawai`

must return no Person result while no Daisuke Sawai searchable entity exists.

Once a real Daisuke Sawai fixture or canonical Person record is added and made searchable, the standard Search architecture should make it discoverable without special-case Search code.

This principle is fundamental for the future AI Knowledge Layer as well.

---

# 17. Current Reference Fixture

Honda Civic is the current UI Fixture Dataset used to test Search behaviour.

The current fixture environment provides examples across:

- Maker
- Model
- Generation
- Variant
- Person

Engine and other entity Search capabilities may be activated progressively.

Fixture records are not canonical automotive database records.

They exist to validate product architecture, UI and Search behaviour before canonical database population.

---

# 18. Current Reference Search Tests

The following behaviours are reference acceptance tests for the current Search implementation.

## Soichiro

Query:

`Soichiro`

Expected:

Soichiro Honda

Entity type:

PERSON

Canonical destination:

`/people/soichiro-honda`

## Soichiro Honda

Query:

`Soichiro Honda`

Expected:

Soichiro Honda

Entity type:

PERSON

## Honda

Query:

`Honda`

Expected:

Honda Maker must remain the strongest direct result.

The visible suggestion set should also expose other relevant knowledge paths when records exist, such as:

- Model
- Person
- Generation
- Variant
- Engine in future

A single child-entity class must not unnecessarily monopolize the panel.

## Sawai

Query:

`Sawai`

Expected:

No Person result until an actual Daisuke Sawai searchable entity exists.

---

# 19. Future Entity Search Acceptance

When additional entity types become active, equivalent tests must be defined.

Examples:

ENGINE CODE

exact technical code
→ corresponding Engine entity

GENERATION CODE

exact generation/chassis designation
→ corresponding relevant Generation or Variant entity/entities

PERSON

first name
surname
full canonical name
approved aliases

ORGANIZATION

canonical organization name
approved alternative names

No test may be made to pass by accepting the absence of a result that the test explicitly requires to be visible.

Tests must evaluate the actual final Search result array returned to the UI.

---

# 20. Mobile Search

Search is a primary mobile interaction.

The Search suggestion panel must remain:

- immediately understandable
- compact
- scrollable when necessary
- touch-friendly
- semantically grouped
- free of unnecessary visual complexity

Important entity categories must not become inaccessible merely because a large group appears first.

Mobile and desktop must use the same Search semantics even if their presentation differs.

---

# 21. Search and the Automotive Knowledge Graph

Search is not an independent catalogue maintained separately from the Knowledge Graph.

The intended flow is:

Entity Data
↓
Search Keys
↓
Search Index
↓
Entity Resolution
↓
Canonical Internal Destination

As the canonical architecture evolves:

Sources
↓
Assertions
↓
Validation
↓
Canonical Knowledge
↓
Searchable Entity Representation

Search must therefore consume knowledge entities rather than become a second uncontrolled source of automotive facts.

---

# 22. Compatibility with the Future AI Knowledge Layer

Search V1 is the foundation for future AI entity resolution.

A future natural-language query such as:

`Which cars used the B16B engine?`

will first require the system to resolve:

`B16B`

to the correct Engine entity.

The same structured Search identity, Search Keys and canonical entity relationships established for Discovery Search should therefore be reusable by the AI Knowledge Layer.

The future architecture is conceptually:

MAIN SEARCH
↓
Query Understanding
↓
Discovery Search OR AI Knowledge Layer
↓
Automotive Knowledge Graph

Discovery Search finds and navigates knowledge.

The AI Knowledge Layer interrogates, connects, compares and explains knowledge.

Both operate on the same underlying knowledge system.

---

# 23. Search V1 Non-Goals

Search V1 does NOT currently include:

- general chatbot behaviour
- free model-memory automotive answers
- natural-language Knowledge Graph question answering
- generative factual completion
- aggressive fuzzy matching
- invented aliases
- invented entities
- external web Search answers
- marketplace Search
- canonical database creation

These capabilities must not be introduced implicitly while implementing Search V1.

---

# 24. Core Search Principles

The following principles are mandatory.

## Universal Searchability

Every eligible knowledge entity and approved identifier must be discoverable through the main Search.

## Entity-Driven Indexing

Search data comes from entity sources, not manual duplication inside UI pages.

## Relevance

Exact and semantically strong matches outrank weaker associations.

## Diversity

The suggestion panel exposes different useful knowledge paths instead of being dominated by one entity class.

## Determinism

Search behaviour is based on explicit data and rules.

## No Hallucination

Search never creates a knowledge entity that does not exist in its searchable source.

## Canonical Navigation

Every real Search result leads to a real canonical internal destination.

## Knowledge Graph Alignment

Search remains an access layer over The Right Gear knowledge rather than an independent source of facts.

## AI Readiness

Search V1 must provide reliable entity resolution that can later support the AI Knowledge Layer.

---

# 25. Transversal Product Contracts

Search V1 operates together with the other transversal The Right Gear UI principles.

## Primary Media Contract

Primary media belongs to the introduction of an entity and must remain immediately understandable in responsive layouts.

## Semantic Internal Linking Contract

Known internal entity destinations must use real semantic links.

## Universal Searchability Contract

Eligible entities and approved identifiers must be discoverable through the main Search.

These principles must be applied consistently across future Maker, Model, Generation, Variant, Engine, Person and Organization experiences.

---

# 26. Search V1 Definition of Success

Search V1 is successful when a user can begin with a fragment of automotive knowledge and immediately discover the meaningful directions available inside The Right Gear.

The user should not need to know:

- the internal ontology
- the correct menu
- the complete entity name
- the exact page hierarchy

The Search should provide the path.

The long-term progression is:

Find the knowledge
→
Navigate the knowledge
→
Connect the knowledge
→
Ask questions about the knowledge

Search V1 establishes the first two steps and the entity-resolution foundation for the next two.
# 27. Search V1 Specific Requirements
- Global Search suggestions are text-only.
- RELATIONAL_CONTEXT alone does not create eligibility.
- deterministic multi-token matching is supported.
- fuzzy Search is NOT part of Search V1.
- Discovery actions are not Knowledge Graph entity types.
