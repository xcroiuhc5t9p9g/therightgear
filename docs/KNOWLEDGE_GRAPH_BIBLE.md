# The Right Gear — Automotive Knowledge Graph Bible

**Document:** `KNOWLEDGE_GRAPH_BIBLE.md`  
**Version:** 0.2.0  
**Status:** Working Draft / Automotive Semantic Source of Truth  
**Last updated:** 2026-08-09  
**Project:** The Right Gear

---

## 1. Purpose

This document defines the semantic model of the **The Right Gear Automotive Knowledge Graph (AKG)**.

It defines:

- what an automotive entity is;
- which entity types exist;
- how vehicle hierarchy is represented;
- how relationships are represented;
- how sources support facts;
- how conflicting claims are preserved;
- how data becomes canonical;
- how graph information is published;
- how automatic import should map web information into structured knowledge.

This document is about **data meaning**, not UI styling.

General product and engineering rules are defined in:

`/docs/PROJECT_MANUAL.md`

---

## 2. Foundational idea

The Right Gear is not a collection of flat vehicle records.

It is a network of automotive entities and evidence-backed relationships.

The fundamental public hierarchy is:

```text
Maker
→ Model
→ Generation
→ Variant
→ Vehicle Instance
```

Around the hierarchy are connected entities such as:

```text
Engine
Engine Family
Transmission
Platform
Person
Design Studio
Factory
Company
Market
Colour
Option
Historical Event
Motorsport Event
Source
Market Observation
Media
```

The graph must answer both hierarchical and cross-domain questions.

---

## 3. Two-layer knowledge architecture

The platform must distinguish:

### 3.1 Canonical Knowledge Layer

The currently selected, reviewable knowledge The Right Gear considers appropriate to expose.

### 3.2 Evidence / Assertion Layer

All claims collected from sources, including:

- supporting claims;
- conflicting claims;
- rejected claims;
- scope-specific claims;
- AI-extracted claims awaiting review.

The conceptual flow is:

```text
Source
  ↓
Assertion
  ↓
Evidence / Conflict Review
  ↓
Canonical Selection
  ↓
Canonical Entity / Relationship
  ↓
Public Knowledge Graph
```

Canonicalization must never erase provenance.

---

## 4. Ontology design rules

### Rule 1 — Do not flatten the vehicle hierarchy

Model, Generation, Variant and Vehicle Instance are separate concepts.

### Rule 2 — Place a fact at the narrowest correct level

If a power value applies only to one Variant, it must not be stored as the power of the Model.

### Rule 3 — Time and market matter

A specification may differ by:

- model year;
- country;
- market;
- homologation;
- production phase.

### Rule 4 — Source scope matters

Two different values are not automatically contradictory if they describe different scopes.

### Rule 5 — Unknown is a valid state

Never infer a value merely because it is expected to exist.

### Rule 6 — Relationships are first-class facts

A relationship such as `DESIGNED_BY` or `POWERED_BY` must have the same provenance discipline as a numeric specification.

### Rule 7 — AI is not provenance

A model response is not itself sufficient factual provenance.

AI may extract or normalize a source, but the source must remain attached.

---

## 5. Global entity identity

Every graph-addressable object should have a stable global entity ID.

Recommended conceptual registry:

`knowledge_entities`

Suggested fields:

```text
id
entity_type
canonical_table
canonical_id
canonical_name
slug
publication_status
visibility
data_status
created_at
updated_at
```

The registry is an index over strongly typed canonical tables.

It must **not** replace domain tables with a single generic JSON structure.

---

## 6. Entity types — MVP Core

Initial MVP graph types:

```text
MANUFACTURER
MODEL
GENERATION
VARIANT
ENGINE
PERSON
FACTORY
SOURCE
```

These are sufficient to validate:

- hierarchy;
- engine relationships;
- people;
- production location;
- source-backed relationships.

---

## 7. Entity types — Extended ontology

The architecture should be able to expand to:

### Corporate

```text
COMPANY
MANUFACTURER
MARQUE
COACHBUILDER
ENGINEERING_COMPANY
TUNER
RACING_TEAM
```

### Vehicle taxonomy

```text
MODEL
GENERATION
VARIANT
VEHICLE_INSTANCE
CONCEPT_CAR
PROTOTYPE
RACE_CAR
```

Special Edition and Homologation Special are normally represented as Variant attributes/subtypes unless a specific implementation requires separate entity types.

### Powertrain / technical

```text
ENGINE_FAMILY
ENGINE
TRANSMISSION
DIFFERENTIAL
DRIVETRAIN_SYSTEM
PLATFORM
CHASSIS_ARCHITECTURE
SUSPENSION_SYSTEM
BRAKE_SYSTEM
STEERING_SYSTEM
COMPONENT
```

### People / organizations

```text
PERSON
DESIGN_STUDIO
FACTORY
```

### Configuration

```text
COLOUR
INTERIOR_SPECIFICATION
OPTION
OPTION_PACKAGE
```

### Production

```text
PRODUCTION_RUN
PRODUCTION_RECORD
MARKET
```

### Historical / sporting

```text
HISTORICAL_EVENT
MOTORSPORT_EVENT
CHAMPIONSHIP
RACE
CIRCUIT
```

### Media

```text
IMAGE
VIDEO
ARTICLE
INTERVIEW
ADVERTISEMENT
PRESS_RELEASE
```

### Market

```text
DEALER
BROKER
AUCTION_HOUSE
AUCTION_EVENT
AUCTION_RESULT
LISTING
MARKET_PRICE_OBSERVATION
MARKET_INDEX
```

### Evidence

```text
SOURCE
ASSERTION
EVIDENCE
DATA_CONFLICT
```

Not every conceptual type must become a graph node immediately.

---

## 8. Maker

A Maker / Marque is the public automotive brand identity used in the catalogue.

Recommended fields:

```text
id
canonical_name
slug
country_code
active_status
founded_year
discontinued_year
maker_type
catalogue_status
created_at
updated_at
```

Suggested `maker_type`:

```text
MANUFACTURER
MARQUE
COACHBUILDER
ENGINEERING_COMPANY
```

### 8.1 Maker aliases

Use a separate alias table.

```text
maker_aliases
- id
- maker_id
- alias
- normalized_alias
```

Alias matching must resolve to one canonical Maker.

---

## 9. Model

A Model is the complete family.

Example:

`BMW M3`

Recommended fields:

```text
id
maker_id
canonical_name
slug
introduced_year
discontinued_year
vehicle_category
catalogue_status
catalogue_tier
created_at
updated_at
```

### Model invariants

- belongs to exactly one canonical Maker in the catalogue hierarchy;
- may have multiple Generations;
- does not own one exact Variant power/weight value;
- may expose derived ranges, but the origin of those ranges must be clear.

### Model aliases

```text
model_aliases
- id
- model_id
- alias
- normalized_alias
```

---

## 10. Generation

A Generation represents a distinct generation of a Model.

Example:

`BMW M3 E30`

Recommended fields:

```text
id
model_id
generation_code
canonical_name
slug
internal_project_code
production_start
production_end
facelift_year
platform_id
production_total
production_total_confidence
catalogue_status
sort_order
created_at
updated_at
```

### Generation invariants

- belongs to exactly one Model;
- contains one or more Variants;
- may be connected to a Platform;
- may have generation-level production records;
- may have shared designers or engineers;
- may have generation-level specifications only when genuinely shared.

---

## 11. Variant

A Variant is the principal technical and collector-specific entity.

Example:

`BMW M3 E30 Sport Evolution`

Recommended fields:

```text
id
generation_id
canonical_name
slug
variant_code
body_style
market_specification
model_year_from
model_year_to
production_start
production_end
limited_edition
numbered_series
homologation_special
production_total
production_total_confidence
original_currency
original_list_price
catalogue_status
sort_order
created_at
updated_at
```

### Variant invariants

- belongs to exactly one Generation;
- may have one or more engine installations;
- may have one or more transmissions;
- may differ by market or year;
- is the preferred level for exact technical specs;
- may have individual Vehicle Instances.

---

## 12. Vehicle Instance

A Vehicle Instance represents one physical automobile.

Recommended fields:

```text
id
variant_id
build_date
production_sequence
current_country_code
current_mileage_km
originality_status
public_visibility
publication_status
created_at
updated_at
```

Vehicle Instance support is optional for the first catalogue-import MVP, but the architecture must not prevent it.

### Privacy

Vehicle Instance data may be:

```text
PUBLIC
REGISTERED
PREMIUM
EDITORIAL
PRIVATE
```

Full identifiers and private ownership history must not be exposed publicly by default.

---

## 13. Vehicle identifiers

Do not treat VIN as the only possible identifier.

Recommended conceptual table:

`vehicle_identifiers`

Identifier types:

```text
VIN
CHASSIS_NUMBER
FRAME_NUMBER
BODY_NUMBER
ENGINE_NUMBER
GEARBOX_NUMBER
PRODUCTION_NUMBER
FACTORY_ORDER_NUMBER
REGISTRATION_NUMBER
```

Suggested fields:

```text
id
vehicle_instance_id
identifier_type
private_value
public_masked_value
issuing_context
verification_status
confidence_score
source_assertion_id
visibility
created_at
updated_at
```

Historical vehicles may use non-standard identifier systems.

---

## 14. Engine model

Engine information must not be stored as a single free-text field.

### 14.1 Engine Family

Represents technical ancestry/family.

Conceptual fields:

```text
id
manufacturer_id
family_name
family_code
architecture
cylinder_count
development_start_year
development_end_year
created_at
updated_at
```

### 14.2 Engine

Represents a specific engine specification/code.

Fields may include:

```text
id
engine_family_id
engine_code
displacement_cc
bore_mm
stroke_mm
compression_ratio
cylinders
valves
valvetrain
aspiration
fuel_system
fuel_type
block_material
head_material
dry_sump
intercooler
turbo_count
supercharger_count
nominal_power_kw
nominal_power_hp
nominal_torque_nm
power_rpm
torque_rpm
redline_rpm
created_at
updated_at
```

### 14.3 Engine Installation

The same Engine may produce different outputs in different vehicles, markets or years.

Use an installation/junction entity containing:

```text
id
engine_id
variant_id
market_id
model_year_from
model_year_to
power_kw
power_hp
torque_nm
power_rpm
torque_rpm
emission_configuration
notes
```

This allows queries such as:

- Which vehicles use the same Engine?
- Which vehicles use the same Engine Family?
- Which installation has a different output?

---

## 15. Transmission and drivetrain

Recommended concepts:

```text
transmissions
variant_transmissions
differentials
drivetrain_systems
```

Transmission types may include:

```text
MANUAL
AUTOMATIC
DCT
SEQUENTIAL
CVT
OTHER
```

Drivetrain types may include:

```text
RWD
FWD
AWD
4WD
```

Avoid duplicating a transmission definition for every Variant when the same unit is reused.

---

## 16. Platform and chassis

Recommended concepts:

```text
platforms
chassis_specifications
suspension_systems
brake_systems
steering_systems
```

Useful relationships include:

```text
BUILT_ON
SHARES_PLATFORM_WITH
SHARES_BRAKE_SYSTEM_WITH
SHARES_SUSPENSION_WITH
```

Shared-component relationships should preferably be derived from common canonical component entities rather than manually duplicated whenever feasible.

---

## 17. Technical specifications

Exact technical data usually belongs to Variant.

Specifications may optionally be scoped to:

- Market
- Model Year

Candidate fields include:

```text
length_mm
width_mm
height_mm
wheelbase_mm
front_track_mm
rear_track_mm

dry_weight_kg
kerb_weight_kg
gross_weight_kg

drag_coefficient

fuel_capacity_l
luggage_capacity_l

top_speed_kph

acceleration_0_100_kph
acceleration_0_160_kph
acceleration_0_200_kph

braking_100_0_m

front_tyre
rear_tyre
front_wheel
rear_wheel

front_brake_type
front_brake_size_mm
rear_brake_type
rear_brake_size_mm

front_suspension
rear_suspension

steering_type

power_to_weight_hp_per_tonne
seats
```

All fields must permit unknown values unless they are structurally required.

---

## 18. Person

A Person is one canonical human entity with multiple possible roles.

Roles may include:

```text
DESIGNER
CHIEF_DESIGNER
ENGINEER
CHIEF_ENGINEER
ENGINE_DESIGNER
TEST_DRIVER
RACING_DRIVER
FOUNDER
EXECUTIVE
ENTREPRENEUR
```

Suggested person fields:

```text
id
full_name
birth_year
death_year
nationality
publication_status
created_at
updated_at
```

Employment and roles should be temporal where appropriate:

```text
person_id
organisation_id
role
valid_from
valid_to
```

---

## 19. Design organizations

Concepts may include:

```text
DESIGN_STUDIO
COACHBUILDER
ENGINEERING_COMPANY
```

Useful predicates:

```text
DESIGNED_BY
STYLED_BY
INTERIOR_DESIGNED_BY
ENGINEERED_BY
ENGINE_DESIGNED_BY
BODIED_BY
```

Do not encode a designer name only as free text if it is intended to participate in graph navigation.

---

## 20. Factory

A Factory is a canonical production location.

Suggested fields:

```text
id
manufacturer_id
name
city
country_code
latitude
longitude
created_at
updated_at
```

Useful relationship:

```text
PRODUCED_AT
```

A vehicle may have different factories by production period or market.

---

## 21. Production

Production data is often incomplete and scope-dependent.

Do not reduce it to one universal `production_total`.

Recommended concepts:

```text
production_runs
production_records
```

A Production Record may be scoped by:

```text
model_id
generation_id
variant_id
production_run_id
factory_id
year
market_id
body_style
steering_side
exterior_colour_id
interior_id
quantity
confidence_score
data_status
source_assertion_id
```

### Production rule

Do not sum partial records into a total unless the dataset is known to be complete for the relevant scope.

---

## 22. Market geography

Create canonical Market entities.

A Market may represent:

- country;
- region;
- homologation market.

Examples conceptually include Europe, Italy, Germany, United Kingdom, United States, Japan and Switzerland.

Technical specifications, engines, options and production may be Market-specific.

---

## 23. Colours

Colour must be modeled as structured data when possible.

Candidate fields:

```text
id
manufacturer_id
commercial_name
paint_code
colour_family
finish_type
metallic
pearlescent
valid_from
valid_to
```

Variant availability should be separate:

```text
variant_id
colour_id
market_id
model_year_from
model_year_to
standard_or_optional
```

Vehicle Instance may later relate to:

```text
ORIGINAL_COLOUR
CURRENT_COLOUR
```

---

## 24. Interiors

Recommended concept:

`interior_specifications`

Potential attributes:

- material;
- commercial name;
- colour;
- trim;
- seat type;
- market;
- validity period.

Availability to a Variant should be modeled separately where useful.

---

## 25. Options

Recommended concepts:

```text
options
option_packages
variant_options
vehicle_instance_options
```

Potential fields:

```text
option_code
manufacturer_id
name
description
original_price
currency
market_id
valid_from
valid_to
standard_or_optional
```

This enables future analysis of configuration rarity and desirability.

---

## 26. Historical events

Recommended event types:

```text
WORLD_PREMIERE
MOTOR_SHOW
PRODUCTION_START
PRODUCTION_END
FACELIFT
HOMOLOGATION
RECORD
ANNIVERSARY
TECHNICAL_MILESTONE
CORPORATE_EVENT
```

Historical Events may connect to:

- Maker
- Model
- Generation
- Variant
- Person
- Factory

---

## 27. Motorsport

The ontology should eventually support:

```text
CHAMPIONSHIP
RACE
CIRCUIT
RACING_TEAM
RACE_CAR
DRIVER
RESULT
HOMOLOGATION
```

Useful relationships:

```text
ROAD_CAR_DERIVED_INTO
HOMOLOGATED_FOR
COMPETED_IN
DRIVEN_BY
ENTERED_BY
WON
RELATED_TO_ROAD_MODEL
```

Full racing statistics are not an initial MVP requirement.

---

## 28. Media

Media may attach to any relevant entity.

Supported scopes include:

```text
MODEL
GENERATION
VARIANT
VEHICLE_INSTANCE
ENGINE
PERSON
EVENT
FACTORY
```

Relationships may include:

```text
DEPICTS
FEATURED_IN
REVIEWS
INTERVIEWS
DOCUMENTS
```

### Media rights

Every external image candidate should preserve where available:

```text
source_provider
source_page
file_url
author
licence_code
licence_url
attribution
commercial_use_allowed
derivative_use_allowed
share_alike
copyright_status
editorial_status
image_role
```

Suggested image roles:

```text
HERO
EXTERIOR
INTERIOR
ENGINE
DETAIL
HISTORICAL
RACING
PRODUCTION
```

No candidate becomes public solely because it was found.

---

## 29. Video

YouTube video records should store metadata rather than downloaded content.

Recommended fields:

```text
video_id
title
channel
language
video_type
thumbnail
editorial_status
last_checked_at
```

Possible video types:

```text
OVERVIEW
ROAD_TEST
TECHNICAL
HISTORICAL
BUYING_GUIDE
AUCTION
RESTORATION
DRIVING
```

Use official embeds.

---

## 30. Market Intelligence ontology

Market information must distinguish observed facts from derived metrics.

### 30.1 Core market concepts

```text
MARKET_PRICE_OBSERVATION
MARKET_TRANSACTION
MARKET_LISTING
MARKET_SNAPSHOT
MARKET_INDEX
MARKET_COMPARABLE
MARKET_RANKING
```

### 30.2 Price type

Every observation must identify the type:

```text
ASKING_PRICE
DEALER_PRICE
HAMMER_PRICE
FINAL_TRANSACTION_PRICE
VALUATION
```

Never silently combine incompatible types.

### 30.3 Market observation fields

Conceptually:

```text
id
entity_type
entity_id
observed_at
price
currency
normalized_price_eur
country_code
source_id
price_type
mileage_km
condition
sold_status
confidence_score
created_at
```

### 30.4 Derived market metrics

Potential derived values:

```text
median_price
observation_count
transaction_count
change_3m
change_12m
change_3y
change_5y
liquidity_score
market_confidence
```

Derived metrics must be reproducible from stored observations and methodology.

No fake appreciation values.

---

## 31. Relationship model

Recommended table:

`knowledge_relationships`

Fields:

```text
id
subject_entity_id
predicate
object_entity_id
valid_from
valid_to
market_id
confidence_score
verification_status
publication_status
source_assertion_id
created_by
created_at
updated_at
```

A relationship is not considered fully trustworthy merely because both nodes exist.

The relationship itself requires provenance.

---

## 32. Relationship predicates — Core

Initial MVP predicates:

```text
MANUFACTURED_BY
PART_OF_MODEL
PART_OF_GENERATION
POWERED_BY
DESIGNED_BY
ENGINEERED_BY
PRODUCED_AT
PREDECESSOR_OF
SUCCESSOR_OF
SUPPORTED_BY
```

---

## 33. Relationship predicates — Extended

Recommended future predicates:

### Hierarchy / corporate

```text
OWNED_BY
PART_OF
ACQUIRED_BY
MANUFACTURED_BY
PART_OF_MODEL
PART_OF_GENERATION
HAS_GENERATION
HAS_VARIANT
HAS_INSTANCE
```

### Technical

```text
POWERED_BY
EQUIPPED_WITH
BUILT_ON
USES_COMPONENT
SHARES_ENGINE_WITH
SHARES_ENGINE_FAMILY_WITH
SHARES_TRANSMISSION_WITH
SHARES_PLATFORM_WITH
SHARES_BRAKE_SYSTEM_WITH
SHARES_SUSPENSION_WITH
```

### People / design

```text
DESIGNED_BY
STYLED_BY
INTERIOR_DESIGNED_BY
ENGINEERED_BY
ENGINE_DESIGNED_BY
TESTED_BY
FOUNDED_BY
WORKED_FOR
```

### Production / availability

```text
PRODUCED_AT
PRODUCED_DURING
AVAILABLE_IN
AVAILABLE_WITH
FACTORY_EQUIPPED_WITH
```

### Lineage / comparison

```text
PREDECESSOR_OF
SUCCESSOR_OF
DERIVED_FROM
EVOLVED_FROM
INSPIRED_BY
COMPETES_WITH
CONTEMPORARY_OF
ALTERNATIVE_TO
SIMILAR_TO
SPIRITUAL_SUCCESSOR_OF
```

### Historical / motorsport

```text
ASSOCIATED_WITH_EVENT
HOMOLOGATED_FOR
COMPETED_IN
DRIVEN_BY
ENTERED_BY
ROAD_CAR_DERIVED_INTO
```

### Market

```text
LISTED_BY
AUCTIONED_BY
SOLD_AT
```

### Configuration / identity

```text
HAS_IDENTIFIER
ORIGINAL_COLOUR
CURRENT_COLOUR
```

### Media / evidence

```text
DEPICTED_IN
FEATURED_IN
SUPPORTED_BY
CONTRADICTED_BY
```

---

## 34. Relationship semantics

`relationship_types` should describe predicate behavior.

Recommended metadata:

```text
predicate
inverse_predicate
is_symmetric
subject_type_constraints
object_type_constraints
description
```

### Directional examples

```text
SUCCESSOR_OF ↔ PREDECESSOR_OF
PART_OF_GENERATION ↔ HAS_VARIANT
POWERED_BY ↔ POWERS
```

### Symmetric examples

```text
COMPETES_WITH
CONTEMPORARY_OF
SHARES_PLATFORM_WITH
SHARES_ENGINE_FAMILY_WITH
```

Do not manually store duplicate reverse relationships unless the implementation intentionally denormalizes them.

---

## 35. Assertions

Assertions are central to The Right Gear.

A factual value discovered from a source must first become an Assertion.

Recommended table:

`data_assertions`

Fields:

```text
id
subject_entity_id
field_name
raw_value
normalized_value
unit
source_id
source_locator
retrieved_at
confidence_score
verification_status
verified_by
verified_at
notes
supersedes_assertion_id
created_at
updated_at
```

Recommended verification states:

```text
DISCOVERED
AI_EXTRACTED
PENDING_REVIEW
APPROVED
VERIFIED
DISPUTED
REJECTED
SUPERSEDED
CONFLICT
```

The exact implementation can consolidate states where appropriate, but the semantics must remain explicit.

---

## 36. Evidence

An Assertion may have multiple supporting or contradicting evidence records.

Recommended table:

`evidence`

Fields:

```text
id
assertion_id
source_id
evidence_type
source_locator
support_type
confidence_score
notes
created_at
```

`support_type`:

```text
SUPPORTS
CONTRADICTS
PARTIALLY_SUPPORTS
```

---

## 37. Sources

Recommended table:

`data_sources`

Potential fields:

```text
id
provider_name
source_title
source_type
source_url
licence_type
commercial_use_allowed
derived_data_allowed
attribution_required
contract_reference
trust_level
active
retrieved_at
created_at
updated_at
```

Source trust categories:

```text
LEVEL_1_OFFICIAL_MANUFACTURER
LEVEL_2_OFFICIAL_INSTITUTION
LEVEL_3_STRUCTURED_OPEN_DATA
LEVEL_4_SPECIALIST_EDITORIAL
LEVEL_5_COMMUNITY
UNKNOWN
```

Trust level is a review heuristic, not an automatic truth function.

---

## 38. Conflicts

When two Assertions disagree for the same canonical concept:

Do not overwrite either.

Create a conflict.

Recommended table:

`data_conflicts`

Potential fields:

```text
id
subject_entity_id
field_name
status
resolution_type
resolution_notes
resolved_by
resolved_at
created_at
updated_at
```

Conflict resolution may be:

```text
SELECT_ASSERTION
DIFFERENT_SCOPE
INSUFFICIENT_EVIDENCE
REJECT_ASSERTION
MERGED_INTERPRETATION
UNRESOLVED
```

This is important because numeric differences may reflect:

- different body styles;
- different markets;
- different model years;
- production vs sales;
- different inclusion criteria;
- rounding;
- source error.

---

## 39. Canonical selection

The current public canonical value should remain traceable to an approved Assertion.

Recommended table:

`canonical_field_selections`

Fields:

```text
entity_id
field_name
selected_assertion_id
selected_by
selected_at
selection_reason
```

Canonical typed tables may cache the selected value for performance.

The Assertion remains the provenance source.

---

## 40. Confidence

Recommended numeric range:

`0.00` to `1.00`

Illustrative UI mapping:

```text
0.90–1.00  HIGH
0.70–0.89  MEDIUM
0.50–0.69  LOW
<0.50      UNVERIFIED
```

Confidence is not equivalent to objective truth.

It represents factors such as:

- source authority;
- extraction certainty;
- evidence agreement;
- scope clarity;
- editorial verification.

The confidence methodology must be documented if it becomes user-facing.

---

## 41. Temporal validity

Any time-sensitive fact or relationship should support:

```text
valid_from
valid_to
```

Examples:

- Person worked for Company
- Colour available on Variant
- Engine installed in Variant
- Option available in a Market
- Company owned a Marque
- Factory produced a Generation

Do not encode changing historical relations as timeless unless their scope is inherently timeless.

---

## 42. Entity resolution

Automatic import must resolve raw source terms into canonical entities.

The resolver may:

```text
LINK_EXISTING
CREATE_CANDIDATE
SUGGEST_MERGE
FLAG_AMBIGUOUS
```

AI may suggest a match.

Destructive merge requires editorial approval.

### Resolution signals

Possible signals:

- canonical name;
- aliases;
- maker;
- generation;
- production years;
- engine code;
- market;
- source identifiers;
- Wikidata identifiers;
- internal codes.

Do not match only by a short name when ambiguity exists.

---

## 43. Normalisation

Imported values must preserve both:

```text
raw_value
normalized_value
```

Examples of normalization:

- hp / CV / kW;
- mph / km/h;
- lb / kg;
- inch / mm;
- localized decimals;
- date formats;
- manufacturer naming variants.

Never discard the raw source value.

Derived values must be identifiable as derived rather than source-observed.

---

## 44. Publication

Canonical data and graph data must have publication lifecycle controls.

Suggested statuses:

```text
DRAFT
REVIEW
APPROVED
SCHEDULED
PUBLISHED
UNPUBLISHED
ARCHIVED
```

Imported data never becomes public automatically.

Graph endpoints for public users must exclude unpublished nodes and relationships.

---

## 45. Data status

Recommended status dimension:

```text
DEMO
PROVISIONAL
VERIFIED
LICENSED
```

Demo seed data must be explicitly marked.

Do not let demo data appear indistinguishable from verified knowledge.

---

## 46. Import pipeline

The controlled import pipeline is:

```text
Editorial Directive
      ↓
Import Job
      ↓
Source Discovery
      ↓
Source Retrieval
      ↓
Structured Extraction
      ↓
Normalisation
      ↓
Entity Resolution
      ↓
Assertions
      ↓
Conflict Detection
      ↓
Editorial Review
      ↓
Canonical Selection
      ↓
Relationship Construction
      ↓
Publication
```

### Import job states

Recommended:

```text
DRAFT
DISCOVERING
FETCHING
EXTRACTING
NORMALISING
RESOLVING
REVIEW
APPROVED
FAILED
```

More detailed workflow states may be added later.

---

## 47. Provider adapters

Initial provider adapters may include:

```text
Gemini Search Grounding
Gemini URL Context
Wikidata SPARQL
Wikimedia Commons
YouTube Data API
Europeana
```

Commercial sources must use separate adapters later.

Every adapter should identify:

```text
provider name
live/mock status
supported data types
source rights
rate-limit / quota behavior
errors
retrieval timestamp
```

Do not bind canonical domain objects directly to a vendor-specific response schema.

---

## 48. Essential Import Test v0.1

The first importer should attempt to resolve the following data categories.

### Identity

```text
maker
model
generation
variant
internalCode
modelYearFrom
modelYearTo
productionStart
productionEnd
```

### Engine

```text
engineCode
engineFamily
engineArchitecture
cylinders
displacementCc
aspiration
fuelSystem
powerHp
powerKw
torqueNm
powerRpm
torqueRpm
redlineRpm
```

### Transmission

```text
transmissionType
gearCount
drivetrain
```

### Dimensions

```text
lengthMm
widthMm
heightMm
wheelbaseMm
```

### Weight

```text
dryWeightKg
kerbWeightKg
```

### Performance

```text
topSpeedKph
acceleration0To100
```

### Production

```text
productionTotal
limitedEdition
homologationSpecial
```

### History

```text
designer
engineer
factory
countryOfProduction
originalPrice
originalCurrency
```

### Configuration

```text
knownFactoryColours
```

### Media

```text
imageCandidates
videoCandidates
```

Unavailable fields remain `NULL`.

---

## 49. Import metrics

For each test Variant, compute from real stored data:

```text
essentialFieldCount
autoPopulatedCount
approvedCount
missingCount
conflictCount
automationCoveragePercent
sourceCount
officialSourceCount
imageCandidateCount
eligibleImageCount
videoCandidateCount
relationshipCount
marketDataAvailability
```

Formula:

```text
automationCoveragePercent =
autoPopulatedCount / essentialFieldCount * 100
```

Do not hardcode the result.

---

## 50. Graph API principles

The API should eventually support operations equivalent to:

```text
GET /api/v1/graph/entities/:entityId
GET /api/v1/graph/entities/:entityId/relationships
GET /api/v1/graph/entities/:entityId/neighborhood?depth=1
GET /api/v1/graph/path?from=:entityId&to=:entityId
GET /api/v1/graph/related-vehicles/:variantId
GET /api/v1/graph/shared-components/:variantId
GET /api/v1/graph/people/:personId/vehicles
GET /api/v1/graph/engines/:engineId/vehicles
GET /api/v1/graph/models/:modelId/lineage
```

Public endpoints must:

- filter unpublished data;
- apply permissions;
- include confidence where appropriate;
- include data status;
- avoid leaking private Vehicle Instance identifiers.

---

## 51. Explore its DNA

The public graph experience is called:

**Explore its DNA**

For a Variant, it should eventually expose:

```text
ANCESTRY
ENGINE FAMILY
SHARED ENGINES
SHARED PLATFORM
DESIGNER
ENGINEERS
FACTORY
PREDECESSOR
SUCCESSOR
CONTEMPORARIES
COMPETITORS
MOTORSPORT DERIVATIVES
RELATED SPECIAL EDITIONS
```

The public UI should initially show a comprehensible relationship summary.

A full graph is optional and should be opened when the user wants deeper exploration.

---

## 52. Graph validation questions

The data model must eventually be able to answer:

1. Show every generation of a Model.
2. Show every Variant of a Generation.
3. Which Variants share the same Engine Family?
4. Which other Models used this Engine Family?
5. Who designed this Generation?
6. Which other vehicles were designed by the same Person?
7. Where was this Generation or Variant produced?
8. Which Variants were contemporaries or competitors?
9. Which colours were available for this Variant in a given Market?
10. What Production Records exist for this Variant?
11. Which Assertions support the production total?
12. Which Sources disagree about a technical value?
13. What is the lineage from one Generation to another?
14. Which components are shared between two vehicles?
15. What is the shortest meaningful graph path between two entities?

If the schema cannot answer these questions without special-case hacks, revisit the model.

---

## 53. Current graph validation case

The first validation family is:

```text
BMW
└── M3
    └── E30
        ├── M3 2.3
        ├── M3 Evolution II
        └── M3 Sport Evolution
```

The graph must initially validate structural relationships, not fabricated technical completeness.

Expected structural pattern:

```text
BMW
  ↑ MANUFACTURED_BY
M3
  ↑ PART_OF_MODEL
E30
  ↑ PART_OF_GENERATION
Sport Evolution
  ├── POWERED_BY → Engine
  ├── DESIGNED_BY → Person (when sourced)
  ├── ENGINEERED_BY → Person (when sourced)
  ├── PRODUCED_AT → Factory (when sourced)
  └── SUPPORTED_BY → Source / Assertions
```

Do not create a relationship if reliable evidence has not been discovered.

---

## 54. Controlled test catalogue

The broader first test catalogue contains:

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

All begin in `IN_RESEARCH`.

The catalogue should not expand until import quality and semantic structure are validated.

---

## 55. Integrity invariants

These rules should be enforceable through schema, service validation or automated tests where practical.

### Hierarchy

- A Generation must reference one Model.
- A Variant must reference one Generation.
- A Vehicle Instance must reference one Variant.

### Provenance

- Imported factual values require a Source.
- Canonical selections of imported important values should reference an approved Assertion.
- A graph relationship created from imported knowledge should preserve provenance.

### Publication

- An imported candidate cannot become public directly.
- Rejected Assertions cannot be canonical selections.
- Private Vehicle Instance identifiers cannot be returned by public endpoints.

### Market

- A market observation must specify price type.
- Derived appreciation must not combine incompatible observation classes without an explicit methodology.

### Media

- Non-approved media cannot be public.
- Unknown image rights must not be treated as commercial reuse permission.

---

## 56. AI behavior around the graph

AI may:

- identify candidate entities;
- extract source claims;
- normalize values;
- propose links;
- propose relationship predicates;
- detect possible duplicates;
- detect conflicts;
- explain graph paths;
- translate natural-language search into structured graph filters.

AI may not:

- create unsupported factual relationships;
- invent missing facts;
- silently merge entities;
- silently choose a disputed canonical value;
- publish without authorization;
- delete contradictory evidence.

---

## 57. PostgreSQL first, graph database later

The MVP Knowledge Graph is implemented with PostgreSQL.

Recommended architecture:

```text
Strongly typed canonical tables
+
Global entity registry
+
Relationship table
+
Assertions / Evidence / Sources
```

Do not introduce Neo4j during the first prototype.

A later graph database remains possible because entities and relationships use stable identifiers and explicit predicates.

---

## 58. Data-model evolution policy

This ontology will evolve.

When adding a new entity or relationship type:

1. define its semantic meaning;
2. define its canonical identity;
3. define valid subject/object types;
4. define provenance requirements;
5. define temporal scope if relevant;
6. define publication behavior;
7. define an example;
8. add a migration;
9. add validation tests;
10. update this document.

Do not create ad-hoc predicates for one specific vehicle if a reusable semantic concept exists.

---

## 59. Naming conventions

Use singular domain names for TypeScript types:

```text
VehicleModel
VehicleGeneration
VehicleVariant
VehicleInstance
Engine
Person
Factory
DataAssertion
KnowledgeRelationship
```

Use plural snake_case for SQL table names where consistent with the existing project:

```text
vehicle_models
vehicle_generations
vehicle_variants
vehicle_instances
data_assertions
knowledge_relationships
```

Use uppercase snake case for stable enum/predicate values where practical:

```text
POWERED_BY
DESIGNED_BY
PUBLISHED
PENDING_REVIEW
```

Do not change established repository conventions merely for stylistic preference.

---

## 60. Future semantic areas

These areas are intentionally deferred but should remain compatible with the ontology:

- complete ownership provenance;
- matching numbers;
- restorations;
- maintenance history;
- originality score;
- detailed homologation records;
- deep motorsport statistics;
- historical document OCR;
- parts compatibility;
- option desirability;
- vehicle-level due diligence;
- portfolio analytics;
- advanced market indices;
- graph analytics;
- Neo4j replication.

Deferred does not mean excluded from the model.

---

## 61. Documentation precedence

When working on automotive semantics:

1. This file defines intended semantic meaning.
2. Database migrations define currently implemented schema.
3. TypeScript domain types define application contracts.
4. Tests define enforced behavior.

If these disagree, report the inconsistency.

Do not silently “fix” semantics in only one layer.

---

## 62. Change log

### 0.2.0 — 2026-08-09

Updated version to 0.2.0 per user specification.

### 0.1.0 — 2026-08-09

Initial Knowledge Graph Bible established, including:

- mandatory vehicle hierarchy;
- entity registry;
- core and extended ontology;
- relationships;
- assertions;
- evidence;
- source provenance;
- conflicts;
- canonical selection;
- temporal validity;
- entity resolution;
- production;
- engine modeling;
- market intelligence;
- media rights;
- Import Lab semantics;
- graph validation queries;
- controlled test catalogue.
