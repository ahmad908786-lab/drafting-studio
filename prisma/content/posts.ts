/** Blog content — 56 posts across 6 categories, all 5 templates. */

export type PostSeed = {
  slug: string;
  title: string;
  excerpt: string;
  template: "STANDARD" | "TECHNICAL_GUIDE" | "CASE_STUDY" | "LISTICLE" | "EDITORIAL";
  category: string; // category slug
  tags: string[];
  discipline?: string; // for cover art
  readMinutes: number;
  featured: boolean;
  daysAgo: number; // publishedAt = seedNow - daysAgo
  bodyMdx: string;
  meta?: Record<string, unknown>;
};

export const BLOG_CATEGORIES = [
  { slug: "design-drafting", name: "Design & Drafting", description: "How we produce clean, permit-ready 2D sets.", color: "#0a1f44", order: 1 },
  { slug: "electrical", name: "Electrical", description: "Power, lighting, single-line and load topics.", color: "#f59e0b", order: 2 },
  { slug: "hvac-plumbing", name: "HVAC & Plumbing", description: "Air-side and water-side drafting and calcs.", color: "#0ea5e9", order: 3 },
  { slug: "fire-protection", name: "Fire Protection", description: "Sprinkler, alarm and hydraulic topics.", color: "#ef4444", order: 4 },
  { slug: "lighting", name: "Lighting & Photometrics", description: "Layouts, controls and footcandle studies.", color: "#a855f7", order: 5 },
  { slug: "franchise", name: "Franchise & Rollout", description: "Scaling prototype sets across locations.", color: "#16a34a", order: 6 },
];

export const POSTS: PostSeed[] = [
  {
    slug: "why-2d-autocad-still-wins-for-permit-drafting",
    title: "Why 2D AutoCAD Still Wins for Permit Drafting",
    template: "EDITORIAL",
    category: "design-drafting",
    tags: ["AutoCAD", "workflow", "permitting"],
    readMinutes: 6, featured: true, daysAgo: 4,
    excerpt: "Everyone sells modeling. For most permit sets, disciplined 2D AutoCAD is faster, cheaper, and exactly what the plan reviewer wants.",
    bodyMdx: `The industry spent a decade insisting every drawing had to become a model. Software vendors, conference keynotes, and RFP checklists all pushed the same message: if your deliverable is not model-based, you are behind. For a lot of buildings, that was never true — and pretending otherwise slowed projects down, raised fees, and delivered files nobody on the review side asked for.

> A plan reviewer does not stamp a model. They stamp sheets. Clean, complete, coordinated sheets.

This is not nostalgia for the drafting board. It is a practical observation about what a permit submittal actually is, who reads it, and what the fastest path through review looks like. For most of the buildings that actually get built — tenant fit-outs, franchise rollouts, restaurants, clinics, light commercial — disciplined 2D AutoCAD is faster, cheaper, and exactly what the plan reviewer wants.

## What the Reviewer Actually Receives

Follow a permit submittal through the process. The engineer exports sheets — power plans, panel schedules, a single-line diagram, ductwork layouts, plumbing risers, a sprinkler grid — and uploads PDFs to the AHJ portal. The reviewer opens PDFs. The comments come back as markups on PDFs. At no point in this chain does a model add value, because at no point in this chain does anyone open one.

Every deliverable that matters in a permit review is a 2D artifact: a plan, a schedule, a diagram, a detail. Producing those artifacts through a heavy modeling pipeline means building a model, maintaining it, coordinating it, and then extracting 2D sheets from it — three steps of work to produce the one thing the reviewer reads. Drawing the sheets directly skips the overhead without changing the deliverable.

## The Cost Math Nobody Runs

Modeling carries real costs that rarely appear in the fee comparison: licenses priced per seat, hardware that can actually run the software, staff training and the productivity dip that comes with it, and the ongoing tax of model maintenance — every design change touched in two places, the model and the sheets. For a 2,100 sq ft drive-thru or a 6,000 sq ft clinic, that overhead can exceed the drafting fee itself.

2D AutoCAD inverts the math. The deliverable is the drawing, so the work is the drawing: correct geometry, disciplined layers, complete schedules, coordinated disciplines. A focused [electrical system](/services/electrical-design/electrical-system-design) set — power plans, panel schedules, single-line — goes from kickoff to submittal in days, not weeks, because there is no model in the middle demanding attention.


![A drafter refining a 2D floor plan detail by hand, showing why precise CAD linework still anchors permit sets.](/generated/blog/inline/why-2d-autocad-still-wins-for-permit-drafting-1.webp)


## Focus Is a Feature

When a studio commits to 2D AutoCAD, the whole workflow tightens around the thing that matters: correct, legible, code-compliant sheets delivered fast. Layer standards stay disciplined because layers are the entire organization system — there is no model to hide sloppy drafting behind. Files stay small and portable: a layered DWG moves between your team, the landlord's engineer, and the AHJ without friction, opens on any machine, and redlines cleanly.

That portability compounds on multi-site work. A fifty-location franchise rollout lives or dies on file discipline — one prototype, adapted per site, readable by every local engineer of record. Small, layered DWGs make that pace possible in a way that model handoffs, with their version dependencies and linked-file chains, never have.

Your engineer of record opens the DWG, redlines, and stamps. No round-trip through a model nobody asked for. No export surprises. The file your team can actually use is the file you receive.

## The Honest Exceptions

This argument has limits, and naming them is what makes it honest. Complex, heavily coordinated new construction — hospitals, high-rises, labs with dozens of trades stacked in a tight plenum — can justify a model, because the coordination problem is genuinely three-dimensional and the cost of a field clash dwarfs the modeling overhead. Large design teams working concurrently on one building also benefit from a shared model as a coordination database.

But those projects are the exception, not the rule. The mistake is treating every project like a hospital when most are clinics, restaurants, and retail boxes. The right question is never "model or 2D" in the abstract — it is "what does this permit submittal need, and what is the cheapest reliable way to produce it?" For a [mechanical](/services/mechanical-design/mechanical-design) TI set or a [sprinkler layout](/services/fire-protection/sprinkler-layout-plan), the answer is sheets, drawn well.

<Callout type="note">The test we apply to every project: if the permit deliverable is a set of sheets and the coordination fits on a reflected ceiling plan, 2D is the faster path. If the building needs true 3D clash detection across a dozen trades, say so upfront — and price the modeling honestly.</Callout>

## What "Disciplined" Actually Means

The 2D argument only holds if the 2D is good. Sloppy CAD is not an argument against modeling; it is just sloppy. Disciplined 2D means a published layer standard enforced on every sheet, xrefs for backgrounds instead of inserted geometry, title blocks with no blank fields, revision clouds with delta numbers, and a coordination pass across disciplines before anything is issued. That is the unglamorous work that makes a set read as professional — and reviewers issue permits to the professional one.

The result of choosing 2D deliberately is not a compromise. It is a faster path to a permit, at a lower cost, with a file your whole team can actually use. If your next project needs permit-ready sheets without the modeling overhead, [request a quote](/request-quote) — send your scope and see what disciplined 2D drafting delivers.`,
    meta: { pullQuotes: ["A plan reviewer does not stamp a model. They stamp sheets."] },
  },
  {
    slug: "electrical-load-calculation-nec-220-walkthrough",
    title: "Electrical Load Calculations: An NEC Article 220 Walkthrough",
    template: "TECHNICAL_GUIDE",
    category: "electrical",
    tags: ["NEC", "load calculation", "service sizing"],
    discipline: "electrical",
    readMinutes: 11, featured: true, daysAgo: 9,
    excerpt: "A practical, step-by-step tour of a standard-method service load calculation — from connected loads to demand factors to feeder sizing.",
    bodyMdx: `A load calculation answers one question: how big does the service need to be? Get it wrong high and you overpay for gear; get it wrong low and you fail review. Here is the standard-method flow we use on every calc.

## 1. Inventory the connected load

List every load by category: general lighting and receptacles (by area), fixed appliances, HVAC, motors, kitchen equipment, EV charging, and any special loads. Capture nameplate data — volts, amps, kVA — for each.

## 2. Apply the right demand factors

Not everything runs at once. NEC Article 220 lets you apply demand factors by category:

| Load category | Typical basis |
| --- | --- |
| General lighting | VA per sq ft, then 220.42 demand |
| Receptacles (non-dwelling) | First 10 kVA at 100%, remainder at 50% |
| Kitchen equipment | 220.56 demand by count |
| Largest motor | +25% per 430.24 |


![An electrician measuring conductor current inside a panelboard, the field data behind NEC Article 220 load calculations.](/generated/blog/inline/electrical-load-calculation-nec-220-walkthrough-1.webp)


## 3. Add the continuous-load and motor adjustments

Continuous loads are taken at 125%. The largest motor gets an additional 25%. These two adjustments catch more first-time reviewers than anything else.

## 4. Total and size the service

Sum the demand load, convert to amps at the service voltage, and select the next standard service size. Document every assumption — a reviewer wants to trace your number back to the code.

<Callout type="tip">Keep the panel schedule and the load summary in the same file. When the two disagree, the reviewer notices — and so does the inspector.</Callout>

## 5. Produce the load letter

Utilities and many AHJs want a load letter: connected load, demand load, and service size on one page, ready for your PE to stamp. That single sheet keeps the service application moving.

## A quick checklist

<Checklist items="Inventory every connected load;Apply Article 220 demand factors;Take continuous loads at 125%;Add 25% for the largest motor;Select the next standard service size;Document assumptions and produce the load letter" />

Done in this order, a standard-method calc is fast, defensible, and easy to review.

Need the calculation behind your next service? Our [electrical load calculation](/services/calculations-reports/electrical-load-calculation) service produces the NEC Article 220 basis — connected and demand loads, panel schedules, and the utility load letter — and the [single-line diagram](/services/electrical-design/single-line-diagram) turns it into the reviewer's roadmap. [Request a quote](/request-quote) with your equipment list and we will size the service.`,
    meta: { downloadable: "NEC 220 Load-Calc Checklist" },
  },
  {
    slug: "sprinkler-hydraulic-calculations-explained",
    title: "Sprinkler Hydraulic Calculations, Explained Simply",
    template: "TECHNICAL_GUIDE",
    category: "fire-protection",
    tags: ["NFPA 13", "hydraulics", "sprinkler"],
    discipline: "fire-protection",
    readMinutes: 9, featured: false, daysAgo: 15,
    excerpt: "Density, area, and the demand-versus-supply graph — what a hydraulic calculation actually proves and the inputs you need to run one.",
    bodyMdx: `A hydraulic calculation proves your sprinkler layout can deliver enough water, everywhere it needs to, at the available supply. Here is the logic in plain terms.

## Start with density and area

The occupancy hazard sets a **design density** (gpm per sq ft) over a **design area** (the most demanding area of operation). Light, ordinary, and extra-hazard occupancies each have their own density/area curve.

## Walk the system node by node

From the most remote area back to the source, the calc tracks pressure and flow at each node using pipe sizes, lengths, C-factors, fittings, and elevation changes. Each sprinkler's discharge is a function of its K-factor and the pressure at its node.

<Callout type="note">The "most remote area" is not always the farthest one geometrically — it is the hydraulically most demanding. The calc finds it.</Callout>


![A pendent sprinkler head on red steel piping, the endpoint every hydraulic calculation is designed to protect.](/generated/blog/inline/sprinkler-hydraulic-calculations-explained-1.webp)


## Compare demand to supply

Plot the system **demand** against the **water supply** curve from your flow test. If demand sits comfortably under supply with margin to spare, the design works. If it pokes above, you resize pipe, adjust the layout, or flag that a pump may be required.

| Input | Why it matters |
| --- | --- |
| Occupancy hazard | Sets density and area |
| Flow test (static/residual/flow) | Defines the supply curve |
| Pipe schedule & C-factors | Drives friction loss |
| Elevations | Adds/removes pressure |

## What you receive

A clean report: the demand/supply graph, node and pipe schedules, the remote-area analysis, and a summary the fire department can accept. Pair it with the sprinkler layout and the set is submission-ready.

Our [sprinkler layout](/services/fire-protection/sprinkler-layout-plan) service pairs every head layout with the hydraulic report described above — demand versus supply, node schedules, and the remote-area analysis — so the fire department gets one coordinated package. Where alarm scope rides along, our [fire alarm system design](/services/electrical-design/fire-alarm-system-design) covers devices, risers, and calcs to NFPA 72. [Request a quote](/request-quote) with your flow test data and floor plans.`,
  },
  {
    slug: "franchise-rollout-mep-adaptation-playbook",
    title: "The Franchise Rollout Playbook: Adapting One Prototype to Fifty Sites",
    template: "LISTICLE",
    category: "franchise",
    tags: ["franchise", "rollout", "prototype"],
    readMinutes: 8, featured: true, daysAgo: 20,
    excerpt: "Seven moves that keep a multi-location MEP rollout fast, consistent, and permit-ready in every jurisdiction.",
    bodyMdx: `Rolling a prototype across fifty sites is a logistics problem as much as a drafting one. These seven moves keep it fast and consistent.

## 1. Lock the prototype set first

Before site one, freeze a clean prototype: layered DWG, brand equipment schedule, standard details. Every adaptation starts from this baseline, not from the last site's file.

## 2. Build a jurisdiction checklist

Each city has amendments. Keep a living checklist of the code deltas you hit per state and jurisdiction so nothing surprises you at review.

## 3. Separate brand-standard from site-variable

Mark what never changes (equipment, circuiting logic, layouts) versus what always changes (service point, landlord conditions, local amendments). Adaptation is then a fast, bounded edit.


![A prototype storefront taking shape on site, where one standard drawing set adapts to local conditions.](/generated/blog/inline/franchise-rollout-mep-adaptation-playbook-1.webp)


## 4. Template the title block and sheet index

One title block, one sheet order, every location. Reviewers and your own team move faster when every set reads identically.

## 5. Standardize the load and equipment basis

If the equipment package is fixed, the load calc is nearly fixed too. Template it and adjust only the service point and local factors.

## 6. Track revisions like a program, not a project

A shared log of what changed and why — across all sites — prevents re-solving the same landlord or AHJ issue twice.

## 7. Keep files 2D and portable

Small, layered DWGs move between your team, the landlord's engineer, and the AHJ without friction. That portability is what makes a fifty-site pace possible.

Run the program this way and each new site becomes a 48-hour adaptation instead of a fresh design.

We run this playbook for a living: our [electrical system design](/services/electrical-design/electrical-system-design) and [mechanical design](/services/mechanical-design/mechanical-design) teams adapt prototype sets to new sites in as little as 48 hours, drafting to your CAD standard so every location reads identically. [Request a quote](/request-quote) with your prototype set and the next site address.`,
  },
  {
    slug: "urgent-care-clinic-electrical-case-study",
    title: "Case Study: Urgent Care Clinic Electrical & Life-Safety in 6 Days",
    template: "CASE_STUDY",
    category: "electrical",
    tags: ["healthcare", "fire alarm", "case study"],
    discipline: "electrical",
    readMinutes: 7, featured: false, daysAgo: 26,
    excerpt: "How we turned an architectural set into a permit-ready electrical and NFPA 72 fire-alarm package for a 6,400 sq ft urgent care — in six business days.",
    bodyMdx: `## Challenge: A Clinic That Could Not Wait

A healthcare developer needed a 6,400 sq ft urgent-care fit-out through permit fast. The program was code-critical in a way a standard office TI is not: dedicated and isolated power for medical equipment, complete egress and exit lighting tied to the life-safety plan, and a full NFPA 72 fire-alarm design with battery and voltage-drop calculations. Their in-house engineer would stamp the set — but had no bandwidth to draft it, and the lease clock was already running.

Urgent care is a demanding occupancy for electrical design. Exam rooms carry receptacle densities and dedicated circuits that a standard office plan never sees. Imaging and lab equipment need isolated-ground circuits and clean power. The waiting and triage areas need lighting that is bright, comfortable, and fully on the emergency system. And the fire alarm has to cover a space where patients may be immobile — notification, audibility, and the sequence of operations all get scrutinized harder than in a typical commercial shell.

## Solution: Full Electrical and Fire-Alarm Package in 6 Days

We took the architectural floor and reflected-ceiling plans and produced the complete electrical construction set in 2D AutoCAD, drafted to the firm's CAD standard so their engineer could redline and stamp without cleanup:

- **Dedicated and isolated circuits** for exam and imaging equipment, with isolated-ground receptacles and home runs that kept medical loads separate from general loads.
- **Power and receptacle plans** covering every exam room, the lab, triage, waiting, and back-of-house — device densities matched to the actual equipment list, not a generic office template.
- **Egress and exit lighting** coordinated to the life-safety plan, with emergency fixtures and exit signs circuited to the emergency source and shown on dedicated life-safety sheets.
- **Fire-alarm device layout** with candela ratings and spacing verified per NFPA 72, SLC/NAC circuiting drawn and tagged, and a riser diagram tying every device back to the panel.
- **Battery and voltage-drop calculations** backing the fire-alarm design — standby and alarm loads totaled, battery sized, and the longest NAC run verified for voltage at the last device.
- **Panel schedules and a coordinated single-line diagram**, built from the same load data so the two sheets agreed exactly.

### Coordination That Made It Stamp-Ready

Two things made the set land cleanly with the stamping engineer. First, everything was drawn on the firm's title block, layer standard, and symbol library — the deliverable looked like their own production, because it was built to their spec. Second, the [fire alarm system design](/services/electrical-design/fire-alarm-system-design) and the electrical scope were drafted as one package, not two: device addresses on the floor plans matched the riser, the riser matched the battery calc, and the candela schedule matched the plans. That internal consistency is what lets an engineer stamp someone else's drafting with confidence.

The lighting scope — general, exam, and egress — was laid out as a coordinated [lighting design](/services/electrical-design/lighting-design) with fixture schedules and controls, so the clinic's lighting read as one system rather than three overlapping ones.


![Illuminated exit signage in a clinic corridor, part of the life-safety systems delivered on a six-day schedule.](/generated/blog/inline/urgent-care-clinic-electrical-case-study-1.webp)


## Results

| Metric | Result |
| --- | --- |
| Turnaround | 6 business days |
| Review submissions | 1 — cleared on first submittal |
| Revisions used | 2 (included in scope) |
| Stamp-ready | Yes — engineer stamped without redrafting |
| Fire alarm basis | NFPA 72, with battery and voltage-drop calcs |
| Building area | 6,400 sq ft |

The set went to the AHJ and cleared on the first submission. The two review comments — both minor, both about labeling — were resolved inside the included revision window without touching the design.

<Callout type="tip">For healthcare fit-outs, draft the fire alarm and the electrical scope as one package from day one. Device addresses, candela ratings, and circuiting that agree across the floor plans, the riser, and the calculations are what make a set stamp-ready for an engineer who did not draft it.</Callout>

## The Pattern Since

The developer has since sent three more clinic locations through the same pipeline: same CAD standard, same [electrical system design](/services/electrical-design/electrical-system-design) and [single-line diagram](/services/electrical-design/single-line-diagram) structure, adapted per site. The first location took six days; the repeat locations take less, because the template is proven and the stamping engineer already trusts it.

Healthcare drafting rewards studios that treat life-safety scope with the same rigor as power scope. If your clinic, dental, or medical office needs a permit-ready electrical and fire-alarm package your engineer can stamp, [request a quote](/request-quote) — send the architectural plans and the equipment list, and we will scope the full set.`,
    meta: { stats: [ { value: "6 days", label: "Turnaround" }, { value: "1", label: "Submission to approve" }, { value: "6,400", label: "Square feet" }, { value: "NFPA 72", label: "Fire alarm basis" } ] },
  },
  {
    slug: "photometric-studies-what-ahjs-look-for",
    title: "Photometric Studies: What AHJs Actually Look For",
    template: "STANDARD",
    category: "lighting",
    tags: ["photometrics", "IES", "code"],
    discipline: "lighting",
    readMinutes: 6, featured: false, daysAgo: 30,
    excerpt: "Average footcandles are only the start. Here's what a reviewer checks on a photometric plan — and how to pass the first time.",
    bodyMdx: `A photometric plan looks simple: a grid of numbers over a floor or a parking lot. Reviewers read more into it than the average, and knowing what they check helps you pass on the first pass.

## Uniformity, not just average

An average footcandle number can hide dark corners. Reviewers look at the **max-to-min and average-to-min ratios**. A lot that averages 3 fc but drops to 0.2 fc in a corner is a safety problem, and it shows up in the uniformity ratio.

## The right IES files

The study is only as good as its photometry. Using the actual manufacturer **IES files** for the specified fixtures — not a generic stand-in — is what makes the numbers defensible.

## Light trespass at the property line

For site lighting, spill onto neighboring property and the sky matters. Many jurisdictions cap footcandles at the property line and require full-cutoff optics. We check trespass at the line against the ordinance.


![A wall pack casting its light pattern at dusk, the real-world result a photometric study predicts.](/generated/blog/inline/photometric-studies-what-ahjs-look-for-1.webp)


## Mounting height and tilt

Illuminance falls off with the square of distance. The study has to reflect the real mounting height and any tilt — an optimistic height inflates the grid and invites a correction.

## A clean, readable deliverable

Finally, the plan itself has to be legible: the calc grid, the summary table (avg/min/max, ratios), the fixture schedule with IES types, and the compliance note. A tidy sheet gets read quickly and approved quickly.

Get these five right and a photometric study clears review without a second look.

Our [photometric design](/services/electrical-design/photometric-design) service delivers the point-by-point studies reviewers accept — real IES files, uniformity ratios, and property-line trespass checks — and pairs naturally with our [lighting design](/services/electrical-design/lighting-design) layouts. [Request a quote](/request-quote) with your site or floor plan and the fixture IES files.`,
  },
  {
    slug: "hvac-load-calculations-manual-j-vs-ashrae",
    title: "HVAC Load Calculations: Manual-J vs. ASHRAE, and When to Use Each",
    template: "STANDARD",
    category: "hvac-plumbing",
    tags: ["Manual-J", "ASHRAE", "load calculation"],
    discipline: "hvac",
    readMinutes: 7, featured: false, daysAgo: 34,
    excerpt: "Two recognized methods, two use cases. Here's how we pick the right heating and cooling load basis for a building.",
    bodyMdx: `Sizing HVAC starts with a load calculation — but which method? The two you will see on permit submittals are Manual-J and the ASHRAE approach. They are both recognized, both defensible, and they are not interchangeable. Picking the wrong one is one of the fastest ways to earn a correction letter, because the reviewer will check your basis against the building type before they check a single number.

## Why the Method Matters

A load calculation is the engineering basis behind every ton of equipment and every CFM of ductwork on the drawings. The reviewer reads it to answer two questions: did you account for all the heat gains and losses, and did you use a method that fits this building? A Manual-J on a 40,000 sq ft office reads as wrong on sight, and an ASHRAE commercial calculation on a single-family home raises the same flag in reverse. The method is the first thing the reviewer sees and the last thing you want to defend.

## Manual-J: The Residential Standard

Manual-J is the ACCA-recognized standard for residential heating and cooling loads, and it is what most residential AHJs expect behind a permit. It is room-by-room and envelope-driven: for each space it walks through the walls, roof, windows, doors, floors, and infiltration, then adds internal gains from occupants, lighting, and appliances, and ventilation air. The output is a sensible and latent load per room, a block load for the whole house, and the equipment tonnage and BTU basis.

Where Manual-J is non-negotiable:

- **Single-family homes** — nearly every residential AHJ names Manual-J (or its local equivalent) as the required basis.
- **Townhomes and duplexes** — each unit gets its own room-by-room calc; shared walls get the right boundary treatment.
- **ADUs and additions** — small loads, but the reviewer still wants the basis documented.

The inputs that drive a Manual-J are the envelope: R-values of walls and roof, glazing area and orientation by room, infiltration rate, and the local design conditions. Get the glazing wrong and the cooling load follows it — which is why we ask for the window schedule, not just the floor plan.

<Callout type="note">Manual-J is occasionally misapplied to small commercial spaces. If the space has commercial occupancy, commercial ventilation rates, or packaged rooftop equipment, the ASHRAE method is the defensible choice even when the building is small.</Callout>

## ASHRAE: The Commercial Method

Commercial buildings — offices, retail, healthcare, hospitality, restaurants — use the ASHRAE load calculation method (the Radiant Time Series / heat-balance family), which handles the things commercial buildings do that houses do not: **diversity** across zones that peak at different times, **ventilation per ASHRAE 62.1** at commercial occupancy densities, large zoned air systems, and internal gains from equipment that dwarf residential loads.

The ASHRAE calc is organized by zone and by hour. Each zone's envelope, solar, occupancy, lighting, and equipment gains are profiled across the design day, and the system block load is the coincident peak — not the sum of the zone peaks. That distinction is where the tonnage savings live: an east office and a west office do not peak together, and the calc knows it.

Where the ASHRAE method is expected:

- **Offices and retail** — zoned systems with real diversity.
- **Healthcare and hospitality** — strict ventilation and pressure relationships that Manual-J never models.
- **Restaurants** — kitchen equipment gains that dominate the load.


![Rooftop units and supply ductwork in daylight, the equipment that Manual-J and ASHRAE load calculations size.](/generated/blog/inline/hvac-load-calculations-manual-j-vs-ashrae-1.webp)


## Side-by-Side Comparison

| | Manual-J | ASHRAE method |
| --- | --- | --- |
| Building type | Residential | Commercial |
| Granularity | Room-by-room | Zone-by-zone, hourly |
| Diversity | Minimal | Full zone diversity |
| Ventilation | Residential rates | ASHRAE 62.1 commercial rates |
| Typical reviewer | Residential plans examiner | Mechanical plans examiner |
| Equipment output | Tonnage / BTU per home | Block + zone loads, system CFM |

## What Both Methods Need From You

Whichever method fits, the calculation is only as good as its inputs. Before we run either one, we need:

<Checklist items="Architectural floor plans with room names and areas;Envelope assemblies: wall and roof R-values, glazing type and orientation;Occupancy counts and schedules;Internal gains: lighting, equipment, and process loads;Ventilation requirements per the adopted code;Design conditions: indoor setpoints and ASHRAE outdoor design temperatures" />

The two inputs that cause the most rework are glazing (area and orientation by room, not a building total) and occupancy (the owner's program number, not a guess). Nail those and the calc holds up.

## Why Right-Sizing Matters

Oversized equipment short-cycles: it satisfies the thermostat before it has run long enough to dehumidify, leaving a cold, clammy space and a compressor that dies young. Undersized equipment cannot hold setpoint on a design day, and no amount of ductwork fixes a unit that was never big enough. The load calc is what keeps the selection honest — and it feeds straight into the ductwork sizing on the drawings, because every CFM on the plan traces back to a load in the report.

<Callout type="warning">Rule-of-thumb sizing — "500 sq ft per ton" and its cousins — is the most expensive shortcut in HVAC. It oversizes most buildings, and reviewers who see round-number tonnage with no calculation behind it will ask for the basis.</Callout>

## From Load to Drawings

The load report is the beginning, not the end. Room-by-room or zone-by-zone loads become the airflow schedule on the mechanical plans; the block load becomes the equipment selection; the ventilation numbers become the outdoor-air intakes and the ASHRAE 62.1 compliance table. Our [HVAC heating and cooling load](/services/calculations-reports/hvac-heating-cooling-load) service produces the report, and our [HVAC design](/services/mechanical-design/hvac-design) drafting service carries it straight onto the construction drawings — one continuous chain from basis to permit set.

Pick the method to match the building, document the assumptions, and the equipment selection defends itself. Need the calculation behind your next mechanical permit? [Request a quote](/request-quote) — send the plans and the envelope details, and we will run the right basis for the building.`,
  },
  {
    slug: "single-line-diagram-mistakes-that-fail-review",
    title: "5 Single-Line Diagram Mistakes That Fail Plan Review",
    template: "LISTICLE",
    category: "electrical",
    tags: ["single-line", "one-line", "plan review"],
    discipline: "electrical",
    readMinutes: 5, featured: false, daysAgo: 40,
    excerpt: "The single-line is the first thing a reviewer reads. These five omissions are the ones that bounce it back.",
    bodyMdx: `The single-line diagram is the map of your electrical system, and it is the first thing a plan reviewer reads. A complete one-line sets the tone for the whole submittal; an incomplete one tells the reviewer to read everything else with suspicion. These five omissions are the ones that bounce a single-line back — and each one is avoidable before the set ever leaves your desk.

## 1. Missing AIC / Interrupting Ratings

Overcurrent devices without an interrupting rating — or ratings that do not reflect the available fault current — are an instant comment. NEC 110.9 requires equipment intended to interrupt current at fault levels to have an interrupting rating sufficient for the available fault current at its line terminals, and the reviewer will check it.

The fix is a column, not a guess. Show the available fault current at each distribution point alongside the device AIC rating, and make sure the rating exceeds the available current with margin. Copying one AIC value across panels at different fault levels is worse than leaving it blank — it tells the reviewer the fault study was never coordinated with the drawing. Our [single-line diagram](/services/electrical-design/single-line-diagram) service shows fault current and AIC side by side at every device, so the coordination is visible on the sheet.

## 2. Unlabeled Feeder and Conductor Sizes

Every feeder needs its conductor and conduit size on the one-line. A diagram with unlabeled runs forces the reviewer to cross-reference the panel schedules or guess — and reviewers do not guess in your favor. This is the most common drafting-level omission we see, and it is purely a completeness issue: the sizes were decided during design, they just never made it onto the sheet.

Label every feeder segment with conductor size, count, and conduit size (e.g., 4#500 kcmil + #1/0 G in 3" C). When a feeder changes size mid-run — a tap or a long run upsized for voltage drop — show the transition point. The one-line should be buildable from the sheet alone.

## 3. No Grounding and Bonding

The grounding electrode system and the bonding path belong on the single-line. Grounding electrode conductors, the main bonding jumper location, separately derived system grounding, and the electrode itself (ground rods, concrete-encased electrode, building steel, water pipe) all have a place on the diagram. Leaving them off reads as incomplete because the system is incomplete without them — the reviewer cannot verify a safe installation from a one-line that ends at the main breaker.

This is also where separately derived systems get drawn explicitly: transformers and generators with their grounding electrode conductor paths shown, so the reviewer can trace the fault path from any point back to the source.


![Breakers and bus bars inside switchgear, the equipment a clean single-line diagram must represent accurately.](/generated/blog/inline/single-line-diagram-mistakes-that-fail-review-1.webp)


## 4. Panel Hierarchy That Doesn't Match the Schedules

If the single-line says one thing and the panel schedules say another — a 225-amp main on the riser and 200 amps on the schedule, a panel fed from MDP-1 on one sheet and MDP-2 on the other — the reviewer notices immediately, and the correction letter writes itself. Worse, the reviewer now distrusts both sheets and checks everything twice.

<Callout type="warning">The single-line and the panel schedules must be built from the same load data in a single pass. Drafting one from the other, weeks apart, is how the numbers drift.</Callout>

The discipline that prevents this is a coordination pass between the two sheets before issue: every panel on the one-line appears in the schedules with the same rating, the same feeder, and the same upstream source. Our [electrical system design](/services/electrical-design/electrical-system-design) sets are produced this way — one-line and schedules from one data pass, then cross-checked.

## 5. Service and Metering Ambiguity

Utility service, metering, and the main disconnect have to be unambiguous: service configuration (voltage, phase, wire count), service rating, metering arrangement, and the physical location of the service equipment. Vagueness here delays the whole set because everything downstream — the service size, the AIC ratings, the grounding — keys off the service point.

Show the utility point of connection, the service entrance conductors, the meter location and type (self-contained vs. CT-metered), and the main disconnect with its rating. If the utility has issued a service letter, the one-line should reflect it. If the service size is still being negotiated, note it as such rather than drawing a placeholder.

## What a Complete Single-Line Includes

Beyond avoiding the five mistakes, a submission-ready one-line carries a short list of positive content: the utility service and metering, the full distribution hierarchy down to the last panelboard, feeder and conductor sizes on every run, overcurrent device ratings with AIC, the grounding and bonding system, available fault current at key points, and a legend defining every symbol. When all of that is present and the panel schedules agree, the reviewer moves on to the floor plans in a cooperative mood — which is exactly the impression you want them to start with.

## The Load Basis Behind It

A one-line is only as defensible as the numbers behind it. The service size, the feeder sizes, and the panel ratings all trace back to the [electrical load calculation](/services/calculations-reports/electrical-load-calculation) — NEC Article 220, demand factors applied, assumptions documented. When the reviewer can trace a feeder size on your one-line back to a stated load basis in one step, the review moves. When they cannot, you get a correction asking for the basis, and you lose two to three weeks.

Fix these five, keep the schedules in sync, and document the load basis, and your single-line reads as complete. Need a one-line drafted or an existing set cleaned up for resubmittal? [Request a quote](/request-quote) — send your panel schedules and load data, and we will turn them into a reviewer-ready diagram.`,
  },
  {
    slug: "distribution-center-esfr-case-study",
    title: "Case Study: 65,000 sq ft Distribution Center — ESFR & High-Bay Photometrics",
    template: "CASE_STUDY",
    category: "fire-protection",
    tags: ["warehouse", "ESFR", "photometrics", "case study"],
    discipline: "fire-protection",
    readMinutes: 8, featured: true, daysAgo: 46,
    excerpt: "An ESFR sprinkler layout, a passing hydraulic report, and a compliant high-bay lighting grid for a big-box distribution center.",
    bodyMdx: `## The Brief

A general contractor landed a 65,000 sq ft distribution center on a tight build schedule: a 36-foot clear storage height, rack storage running nearly the full height, a dense roof-joist grid, and a fire department that would hold the certificate of occupancy until both the sprinkler system and the lighting were signed off. They needed two deliverables, and they needed them together: an ESFR sprinkler layout with a hydraulic report the fire department would accept, and a high-bay lighting design with a photometric grid proving adequate footcandles across the aisles and rack faces.

The job came to us with eight business days of float before the submittal deadline. We took both scopes in one coordinated pass — because in a warehouse, the sprinkler mains and the high-bay fixtures live in the same ten feet of ceiling, and drawing them separately is how conflicts get built.

## Challenge: Storage Height Changes Everything

ESFR (Early Suppression Fast Response) protection is powerful, but it is picky. Heads under a 36-foot ceiling leave no room for improvisation: deflector clearances, maximum spacing, and the exclusion zones around obstructions are all measured in inches. The roof structure was a joist grid at 5-foot centers with chords, bridging, and a forest of small mechanical penetrations — exactly the kind of ceiling that turns a clean head layout into a field reroute if the drafter is not paying attention.

The storage arrangement added its own constraints. Rack aisles had to stay clear of drops, flue spaces had to remain unobstructed, and the uprights created a hard grid the head layout had to respect. Commodity classification drove the design criteria, and we confirmed the classification with the engineer of record before a single head was placed — guessing at commodity class is how ESFR submittals die in review.

On the lighting side, the challenge was the mirror image: high-bay fixtures had to deliver uniform footcandles down 36 feet to the aisle floor and the rack faces, with uniformity ratios the owner could accept, while staying clear of the sprinkler branch lines and the deflector exclusion zones. Light the aisles and you light the racks; get the mounting wrong and the racks shadow the aisles.

## Solution: One Coordinated 2D Pass

We drafted both disciplines from the same rack-and-structure background in 2D AutoCAD, in this order:

1. **Shared background.** Racking footprints, aisle widths, joist layout, and obstructions went on one coordinated base so both disciplines designed against the same building.
2. **ESFR head layout to NFPA 13.** Heads placed for coverage under the 36-foot deck, coordinated to the joist grid, with branch lines routed to avoid flue-space violations and deflector obstructions. Every head got a tag that carried into the hydraulic node schedule.
3. **High-bay lighting layout.** Fixture rows aligned to the aisles, not the joists — aisles are where the light has to land. Mounting heights and spacing were iterated against the photometric grid until the numbers held.
4. **Cross-discipline deconfliction.** Sprinkler branch lines versus fixture rows, drops versus fixtures, head deflectors versus high-bay housings. The two systems were checked against each other on the plan, not discovered in the field.

### The Hydraulic Report

The hydraulic calculation ran node by node from the most remote area back to the supply, comparing system demand against the municipal flow test the contractor provided. On the first run, demand sat uncomfortably close to the supply curve — close enough that a hot-day pressure dip could have pushed it over. We resized two cross-mains, re-ran the calc, and opened up a margin the fire department could accept. The final report shipped with the demand/supply graph, the node schedule, and the remote-area analysis — the package our [sprinkler layout service](/services/fire-protection/sprinkler-layout-plan) produces as standard.

### The Photometric Grid

The lighting package paired the layout with a point-by-point [photometric study](/services/electrical-design/photometric-design): footcandle grids at the aisle floor and at the rack faces, average/min/max values, and uniformity ratios. Two fixture spacings were tested; the tighter spacing won on uniformity at a modest fixture-count cost, and the grid proved it before anything was ordered.

### Power Behind the Building

The building's electrical backbone — dock door power, office and restroom panels, equipment drops, and the service distribution — was drafted as a coordinated [electrical system set](/services/electrical-design/electrical-system-design) with panel schedules and a single-line diagram, so the whole building read as one package at review.

<Callout type="tip">In a warehouse, sequence the hydraulic calculation before freezing the sprinkler layout. A pipe resize discovered during the calc is a two-hour CAD change; discovered by the reviewer, it is a two-week correction cycle.</Callout>


![An ESFR sprinkler beneath a high-bay fixture in a distribution center, pairing fire protection with photometric design.](/generated/blog/inline/distribution-center-esfr-case-study-1.webp)


## Results

| Metric | Result |
| --- | --- |
| Building area | 65,000 sq ft |
| Sprinkler basis | ESFR, NFPA 13 |
| Hydraulic margin | Passed after cross-main resize |
| Lighting | Uniform footcandle grid at aisles and rack faces |
| Fire department review | Approved, no resubmittal |
| Turnaround | 9 business days |

Both packages cleared review together on the first submission, and the contractor kept the aggressive site schedule. The cross-main resize — a two-hour CAD change — is exactly the kind of decision that costs a week when it is discovered by the reviewer instead of the drafter.

## Why It Worked

Three things made this submittal fast. First, the sprinkler and lighting scopes were drafted against the same background, so the deflector zones and the fixture rows never fought. Second, the hydraulic calculation ran before the layout froze, so pipe resizing was a design decision, not a correction response. Third, the photometric grid rode with the submittal instead of arriving as an afterthought — when the reviewer can see the numbers at the rack faces, there is nothing left to ask.

Have a warehouse or distribution project heading for review? [Request a quote](/request-quote) — send the building footprint and storage heights, and we will scope the sprinkler, lighting, and power package together.`,
    meta: { stats: [ { value: "65,000", label: "Square feet" }, { value: "ESFR", label: "Sprinkler basis" }, { value: "9 days", label: "Turnaround" }, { value: "1", label: "Coordinated submission" } ] },
  },
  {
    slug: "outsourcing-mep-drafting-when-it-makes-sense",
    title: "When Outsourcing MEP Drafting Actually Makes Sense",
    template: "EDITORIAL",
    category: "design-drafting",
    tags: ["outsourcing", "engineering firms", "capacity"],
    readMinutes: 6, featured: false, daysAgo: 52,
    excerpt: "Outsourcing isn't about replacing your engineers. It's about giving them their time back.",
    bodyMdx: `There's a quiet assumption that outsourcing drafting means giving up control — that the moment production leaves your office, quality, consistency, and institutional knowledge go with it. In practice, the firms that outsource well keep more control, not less. The reason is simple: they stop spending senior engineering time on production drafting, and they replace an informal in-house workflow with a documented standard that any competent studio can execute.

> Your PE's signature is the product. The hours spent moving lines in CAD are not.

## The Math of a Stamp

An engineer's value is judgment and their stamp. When that person spends a day drafting a panel schedule or routing ductwork, you have bought the most expensive drafting in the building. The work still has to be done — permit sets do not draw themselves — but the question is who does it and at what cost.

Handing production drafting to a dedicated [electrical](/services/electrical-design/electrical-system-design), [HVAC](/services/mechanical-design/hvac-design), and [plumbing](/services/mechanical-design/plumbing-design) drafting studio frees that judgment for design decisions, review responses, and client work — the things only a licensed engineer can do. The drafting gets done by people who draft all day, every day, which usually means it gets done faster and with fewer errors than by an engineer squeezing it between higher-value tasks.

This is not about replacing your engineers. It is about giving them their time back. The firms that understand this treat drafting as production capacity and engineering as judgment capacity, and they stop confusing the two.

## Control Is in the Standard, Not the Mouse

The fear that keeps firms from outsourcing is that outsourced sets will not match house style — different layers, different symbols, a title block that looks like a stranger's. That fear is legitimate, and the answer is not trust. It is a CAD standard.

A real standard is a document: title block files, layer naming, text styles, dimension styles, symbol libraries, sheet order, revision protocol. Draft to the standard and the output is indistinguishable from in-house work — because it was made to your spec, not to the studio's habits. The handoff that matters is not the first project; it is the standards package that precedes it. Any studio worth hiring will ask for yours before quoting, and will draft a sample sheet to it before the first real project.

Where firms get burned is skipping this step — sending a PDF and a deadline, then acting surprised when the deliverable does not look like their own work. That is not an outsourcing failure. That is a procurement failure.

## Capacity That Flexes

Workload is not flat. Every firm has a busy quarter and a quiet one, a big project that lands the same week two engineers are on vacation, a rollout client that needs six sites adapted in a month. In-house drafting is a fixed cost against a variable workload: you are either paying drafters to wait or paying engineers to draft.

Outsourcing turns a fixed drafting headcount into capacity you scale up for the busy quarter and down when it is quiet — without hiring, layoffs, or the three-month ramp of a new employee learning your standard. The studio absorbs the peaks; your core team stays focused on the work that needs their license.


![A marked-up drawing sheet under review, the kind of coordination handoff that makes outsourcing work.](/generated/blog/inline/outsourcing-mep-drafting-when-it-makes-sense-1.webp)


## What Stays In-House (and What Shouldn't)

Outsourcing works when the boundary is explicit. Engineering judgment — system selection, load calculation review, code interpretation, the stamp — stays in-house. Production drafting — plans, schedules, risers, details, revisions — goes to the studio. The gray zone is coordination: someone has to own the clash between the ductwork and the sprinkler main, and the contract should say who.

<Callout type="note">The cleanest outsourcing boundary we have seen: the engineer owns every decision, the studio owns every line. Decisions arrive as redlines and narratives; lines arrive as CAD. Nothing in between is ambiguous.</Callout>

## How to Evaluate a Drafting Partner

Not every studio is set up for this relationship. Before you commit a project, check:

<Checklist items="They ask for your CAD standard before quoting — not after;They produce a sample sheet to your standard, not their portfolio style;Turnaround is stated in business days with a rush option, not 'as soon as possible';Revisions are defined in the quote — how many, what counts as minor;They deliver editable DWG files, not just PDFs;They have a QC pass separate from the drafter who produced the set;References from engineering firms, not just end clients" />

The sample sheet is the whole interview. If they cannot match your standard on one sheet, they will not match it on fifty.

## The Firms That Do It Best

The pattern we see in the firms that outsource successfully: they start with one project, not ten. They invest the hour it takes to hand over the CAD standard properly. They keep the engineer of record in the review loop on the first two sets, then step back once the output is proven. And they treat the studio as production capacity with a name and a phone number — a relationship, not a transaction.

Done deliberately, outsourcing production drafting is not a loss of control. It is a decision about where your most expensive people should spend their day — and a good CAD standard is what makes that decision safe.

If your engineers are drafting instead of engineering, [request a quote](/request-quote) — send your CAD standard and a sample project, and we will show you what the production side of your practice looks like when it is someone else's full-time job.`,
    meta: { pullQuotes: ["Your PE's signature is the product. The hours spent moving lines in CAD are not."] },
  },
  {
    slug: "restaurant-kitchen-mep-coordination-guide",
    title: "Restaurant Kitchen MEP: A Coordination Guide",
    template: "TECHNICAL_GUIDE",
    category: "hvac-plumbing",
    tags: ["restaurant", "hood exhaust", "coordination"],
    discipline: "hvac",
    readMinutes: 10, featured: false, daysAgo: 58,
    excerpt: "Type-I hoods, make-up air, heavy equipment power, and grease and gas piping — coordinating the hardest 1,500 sq ft in the building.",
    bodyMdx: `A commercial kitchen packs more MEP conflict per square foot than anywhere else in a building. In roughly 1,500 square feet you have Type-I hood exhaust moving thousands of CFM, make-up air that must balance it, electrically heavy cooking equipment, grease waste with an interceptor, gas piping sized to the connected load, and fire suppression covering the cooking line — all fighting for the same ceiling plane. Here's how we keep it coordinated, system by system.

## Start With the Hood: Everything Keys Off Exhaust

The Type-I hood is the anchor of the kitchen design. Its exhaust CFM — set by the cooking equipment type, the hood style (wall canopy, island, backshelf), and the local code — determines nearly everything downstream. A typical quick-service line might exhaust 3,000–6,000 CFM; a full cooking battery with charbroilers runs higher. The hood schedule on the drawings should state the exhaust CFM per hood section, the static pressure, and the duct size, because every other system sizes itself against that number.

Grease duct routing deserves early attention: it must run as directly as possible to the exterior, maintain clearances to combustibles (18 inches unless a listed assembly reduces it), and provide cleanout access at every change of direction. A grease duct drawn as an afterthought becomes a field reroute through structure — draw the real path on the plan.

## Balance It With Make-Up Air

Exhaust without make-up air is a building trying to breathe through a straw. The make-up air unit (MUA) must supply roughly 80–90% of the exhaust volume as tempered outdoor air; the remaining 10–20% comes from the dining room and building transfer air, which keeps the kitchen slightly negative relative to dining — containing odors and heat where they belong.

<Callout type="warning">Under-supplying make-up air is the single most common kitchen failure. An unbalanced kitchen starves the hood, spills cooking effluent into the dining room, and slams exterior doors. Balance it on the drawings, not on site.</Callout>

The MUA needs tempering — heating in winter, and in many climates cooling or at least ventilation tempering in summer — sized in the [HVAC design](/services/mechanical-design/hvac-design) with its own equipment schedule entry. Show the MUA duct routing to its discharge points (typically a perforated perimeter supply around the hood), and coordinate its location with the exhaust fan: both usually live on the roof, and their separation matters for recirculation.

## Power the Equipment: Dedicated Circuits Per the Schedule

Kitchen equipment is electrically heavy and electrically specific. Fryers, ovens, steamers, and dish machines each need dedicated circuits at the correct voltage and phase, with receptacle or hardwired connections that match the equipment schedule exactly. A one-off receptacle in the wrong place — or at the wrong voltage — stalls the whole line at inspection.

| System | Coordination point |
| --- | --- |
| Type-I hood | Exhaust CFM ↔ make-up air balance |
| Equipment power | Dedicated circuits per equipment schedule |
| Grease waste | Interceptor sizing, slope, and venting |
| Gas piping | Connected load, sizing, and shutoff locations |
| Fire suppression | Nozzle coverage over each appliance |

The electrical scope also carries the kitchen's share of the building load: the [electrical system design](/services/electrical-design/electrical-system-design) includes the panel schedules with the kitchen equipment loads, so the service size reflects the real connected load — not an office-TI guess. Confirm the equipment list early and freeze it; every late equipment swap ripples through the panel schedule, the gas sizing, and the suppression coverage.


![A stainless exhaust hood and duct riser over a restaurant cooking line, the heart of kitchen MEP coordination.](/generated/blog/inline/restaurant-kitchen-mep-coordination-guide-1.webp)


## Route the Plumbing: Grease, Gas, and Water

Grease waste needs an interceptor sized to the fixture load and the local code, correct slope on the waste lines, and a clear, vented path to the building drain. Hand sinks, prep sinks, mop sinks, and floor drains all land on the plan with their trap and vent arrangement. The interceptor location matters — it needs service access, and health departments check it.

Gas piping is sized to the total connected BTUH load using the longest-run method, with a shutoff at each appliance and the meter capacity verified against the total. The [plumbing design](/services/mechanical-design/plumbing-design) scope carries the gas isometric, the demand table, and the riser — and the gas load feeds back into the building's overall utility coordination, which is why late equipment changes hurt here most.

Domestic water rounds it out: hot water sizing for the dish machine and prep sinks (recovery rate matters more than tank size for commercial dishwashing), backflow prevention where the jurisdiction requires it, and hose bibbs for washdown.

## Coordinate the Ceiling: The Plane Everything Fights For

Hood ductwork, make-up air ductwork, sprinkler branch lines, lighting, and the fire suppression piping all occupy the same ceiling plane above the cooking line. This is the highest-value coordination drawing in the set. We lay them out together and check:

<Checklist items="Hood outline and grease duct path drawn against the structural framing;Make-up air duct routing coordinated with the exhaust duct — no crossings without clearance;Sprinkler heads placed for coverage with the hood and ducts as obstructions;Lighting fixtures clear of the hood and ductwork, with grease-rated fixtures over the line;Fire suppression piping and nozzles coordinated to the final appliance layout;Access panels and cleanouts reachable — not buried above equipment" />

The fire suppression system deserves its own coordination pass: nozzle aiming points per the appliance layout, the manual pull station in the path of egress (10–20 feet from the equipment, never behind the cooking line), and the fuel shutoff interlocks shown on the drawings. Our [fire alarm system design](/services/electrical-design/fire-alarm-system-design) scope covers the detection and interlock side where the project needs it.

## The Payoff: Health and Building Review Together

A kitchen coordinated on paper is a kitchen that passes health-department and building-department review together — and opens on schedule. The two agencies look at different things (the health reviewer cares about sinks, surfaces, and temperatures; the building reviewer cares about the hood, the gas, and the electrics), but they both read the same drawings. One coordinated set that answers both reviewers is the difference between a smooth opening and a month of corrections.

<Callout type="tip">Freeze the kitchen equipment list before the MEP drawings start. Every appliance swap after drafting ripples through the electrical panel schedule, the gas sizing, the suppression nozzle layout, and the hood CFM — four disciplines, one late change.</Callout>

Opening a restaurant or rolling out a kitchen prototype? [Request a quote](/request-quote) — send the equipment list and the floor plan, and we will draft the coordinated kitchen MEP package.`,
  },
  {
    slug: "reading-a-drawing-set-for-non-engineers",
    title: "How to Read an MEP Drawing Set (For Non-Engineers)",
    template: "STANDARD",
    category: "design-drafting",
    tags: ["basics", "drawing set", "owners"],
    readMinutes: 6, featured: false, daysAgo: 64,
    excerpt: "Owners, GCs, and project managers: a quick orientation to what's in an MEP set and how the sheets fit together.",
    bodyMdx: `You don't need an engineering degree to get useful information out of an MEP drawing set. Owners, general contractors, and project managers review these sets every week — approving scopes, spotting conflicts, and asking the questions that keep projects on track. Here's a practical orientation to what's in the set, how the sheets fit together, and what to look at first.

## The Sheet Index Is the Map

Every set opens with a sheet index — the table of contents. Electrical sheets are usually prefixed **E**, mechanical **M**, plumbing **P**, and fire protection **FP** (sometimes F or FS). The index tells you what exists and in what order: plans first, then schedules, then details within each discipline.

If you are new to a set, read the index before anything else. It tells you the scope at a glance: how many electrical sheets (a scope with E-101 through E-601 is a full building, not a TI), whether fire protection is included, and whether there are separate demolition sheets. When a sheet is referenced on another sheet but missing from the index, that is worth a question — it may be a drafting error, or scope that was cut.

## Legends and General Notes: The Rosetta Stone

Before the plans, you'll find legends (what each symbol means) and general notes (the code basis and standard requirements). When a symbol on a plan confuses you, the legend is the answer — every diamond, triangle, and letter code on the plans is defined there.

The general notes are worth a skim even for non-engineers, because they state the design basis in plain terms: which code edition the set was drawn to, the design voltages, the plumbing code, the fire protection standard. If your project is in a jurisdiction with strict amendments, the notes will say so. This is also where the drafter states assumptions — and assumptions you disagree with are cheapest to challenge now.

## The Plans: Where Things Go

Plans are scaled top-down views showing where devices, ducts, pipes, fixtures, and heads go. A few things help a non-engineer read them:

- **Tags connect plans to schedules.** A diffuser tagged D-12 on the mechanical plan appears as D-12 in the diffuser schedule with its size and airflow. A panel labeled LP-3 on the electrical plan has a full schedule on the electrical sheets. Follow one tag through and the set stops looking like noise.
- **Line weights carry meaning.** Heavy lines are usually new work; screened (light gray) lines are existing; dashed lines are often demolition or future work. The legend confirms the convention for your set.
- **Callouts point to details.** A hexagon or circle with a number and a sheet reference ("5/E-401") means the real information lives in a detail on that sheet. Details are enlarged drawings of the tricky parts — and they are where the quality of a set shows.


![Layered drawing sheets fanned out, showing how architectural, electrical, and mechanical plans stack into one set.](/generated/blog/inline/reading-a-drawing-set-for-non-engineers-1.webp)


## Discipline by Discipline: What You're Looking At

**Electrical sheets (E).** Power and receptacle plans show outlets, equipment connections, and home runs back to panels. Lighting plans show fixtures and switching. The [electrical system](/services/electrical-design/electrical-system-design) scope also includes panel schedules (tables listing every breaker, load, and spare) and the single-line diagram — the one-page map of the whole electrical distribution from the utility service down.

**Mechanical sheets (M).** HVAC plans show equipment, ductwork routing, diffusers, and thermostats. The equipment schedule lists every unit with its capacity and electrical characteristics. A [mechanical design](/services/mechanical-design/mechanical-design) set covers both the air side (HVAC) and the plumbing side when both are in scope.

**Plumbing sheets (P).** Water, waste, vent, and gas piping plans, plus the riser diagram — a vertical schematic showing how the whole system stacks up floor to floor. The fixture schedule lists every sink, toilet, and water heater.

**Fire protection sheets (FP).** Sprinkler head layouts, the system riser, and hydraulic calculation summaries. If your building needs sprinklers, the [sprinkler layout](/services/fire-protection/sprinkler-layout-plan) sheets show head coverage coordinated to the ceiling — worth a look even for non-engineers, because head locations affect ceiling aesthetics.

## Schedules and Diagrams: The Tables That Matter

Schedules are tables — panels, equipment, fixtures, diffusers — listing sizes, capacities, and specifications. For a non-engineer, schedules are the fastest way to verify scope: count the panels, check the equipment tags against the equipment you bought, confirm the fixture types match what the interior designer specified.

Diagrams like the single-line and the risers show how systems connect vertically and electrically — which a flat plan cannot show. You do not need to understand every symbol; you need to confirm the diagram exists, is labeled, and agrees with the schedules. A panel on the single-line that does not appear in the schedules is a coordination error, and you just caught it without an engineering degree.

## Revision Clouds: What's Changed

Revised sheets carry revision clouds — wavy outlines around changed areas — with a delta number (triangle with a number) tied to a revision block in the title block. When someone tells you "we addressed the review comments," the clouds show you where. Ask for a revision narrative that maps each cloud to the comment it answers; it is the fastest way to verify a resubmittal.

## How It All Ties Together

A device on a plan carries a tag; that tag appears in a schedule with its specification; the schedule ties back to a diagram that shows how it is fed. Follow one item through those three views and you understand the set's logic. Then use that logic to ask good questions:

<Callout type="tip">The three most useful questions a non-engineer can ask about any MEP set: Does the sheet index match what's actually in the set? Do the tags on the plans match the schedules? And what changed since the last version — show me the clouds?</Callout>

That's enough to review a set with confidence, approve scopes, and run a productive project meeting. And when the set needs to be produced in the first place — or revised after review — [request a quote](/request-quote) and we will draft it to your standard.`,
  },
{
    slug: "what-makes-mep-drawings-permit-ready",
    title: "What Makes an MEP Drawing Set Truly Permit-Ready?",
    template: "STANDARD",
    category: "design-drafting",
    tags: ["mep drafting", "permit sets", "plan review", "drawing standards"],
    readMinutes: 6,
    featured: false,
    daysAgo: 1,
    excerpt: "Geometry alone does not get a permit issued. Here is what plan reviewers check on the sheets first — and what we build into every set we draft.",
    bodyMdx: `We draft permit sets every week, and we have watched plan reviewers work. They do not start by admiring your ductwork routing. They start by asking three questions: can I navigate this set, can I verify the design basis, and can I trust that the disciplines agree with each other? A permit-ready MEP set is an argument, not just geometry. Here is what that argument looks like at the sheet level.

## The Sheet Index Tells the Reviewer Where to Look

A sheet index is the table of contents of your permit argument. When it is missing, incomplete, or out of order, the reviewer spends the first ten minutes hunting — and every minute spent hunting is a minute spent doubting. We list every sheet by number and title, group them by discipline, and keep the numbering consistent from the index to the title blocks. If a sheet is referenced on another sheet, it exists in the index. Most jurisdictions also require the index to match the submitted file names on electronic submittals. A mismatch is an easy administrative correction that costs you a full review cycle.

## Legends That Answer Questions Before They Are Asked

Every symbol on your plans should be defined on the same set: abbreviations, symbols, line types, hatch patterns, and equipment tags. We keep discipline-specific legends on the first sheet of each discipline rather than burying them in the general notes, so the electrical reviewer never has to flip to the mechanical sheets to decode a symbol. Abbreviations follow a single project list, and the same abbreviation never means two things. This sounds basic, and it is — which is exactly why sets fail on it. A reviewer who cannot decode your symbols cannot approve your design.

## Keyed Details Instead of Scattered Notes

General notes are necessary, but notes scattered across plans as ad-hoc text are a red flag. They suggest the design was figured out on the sheet rather than coordinated beforehand. We use keyed notes tied to a numbered key on each sheet: the plan stays clean, the key carries the specifics, and the reviewer can verify each callout against the detail it references. Details themselves get a detail number, a sheet reference, and a scale. A detail that says "see detail" with no number is a correction waiting to happen.


![A completed title block with an approval checkmark in ink, the finishing details of a permit-ready set.](/generated/blog/inline/what-makes-mep-drawings-permit-ready-1.webp)


## Calculations Referenced on the Sheet

Plan reviewers approve designs against numbers: NEC Article 220 load calculations, ASHRAE heating and cooling loads, plumbing fixture counts against the IPC, available fault current for the service. The calculations do not need to live on the plan sheets, but the sheets must point to them. We add a schedule or note on the relevant sheet stating the calculation basis, for example noting that lighting and receptacle loads follow NEC 220 with the full calculation on the referenced sheet. When the reviewer can trace a feeder size back to a stated load basis in one step, the review moves. When they cannot, you get a correction asking for the basis — and you lose two to three weeks.

## Coordination the Reviewer Can Actually See

The fastest way to lose a reviewer's confidence is a visible conflict: a duct drawn through a sprinkler main, a panel schedule that does not match the single-line diagram, a diffuser layout that ignores the reflected ceiling plan. Reviewers cross-check disciplines, and every conflict they find makes them look harder for the next one. Before a set leaves our office, it goes through a coordination pass across shared backgrounds — aligned grids, matched equipment tags, one architectural reference. We would rather find the conflict in CAD than have the AHJ find it in review.

<Callout type="tip">Before every submittal, we read the finished set the way the reviewer sees it — full sheets, in order — checking the index, legends, and keyed notes as a stranger would. Ten minutes of cold reading catches what a week of drafting misses.</Callout>

This is the standard every set we draft is held to — whether it is an [electrical system](/services/electrical-design/electrical-system-design) package, a coordinated [mechanical](/services/mechanical-design/mechanical-design) set, or a [sprinkler layout](/services/fire-protection/sprinkler-layout-plan). [Request a quote](/request-quote) and send your plans; we will return a permit-ready set built the way reviewers read.`,
  },
  {
    slug: "clearing-mep-plan-review-corrections",
    title: "How to Clear MEP Plan-Review Corrections Without Losing Weeks",
    template: "TECHNICAL_GUIDE",
    category: "design-drafting",
    tags: ["plan review", "corrections", "resubmittal", "permit process"],
    readMinutes: 8,
    featured: false,
    daysAgo: 2,
    excerpt: "A correction letter is not a rejection — it is a punch list. Our workflow for reading, classifying, clouding, and resubmitting corrections in a single cycle.",
    meta: { downloadable: "Plan-Review Correction Response Checklist" },
    bodyMdx: `A correction letter is not a rejection. It is the reviewer's punch list, and clearing it is a process problem, not a design problem. Most of the weeks lost to corrections are lost to disorganization: comments answered out of order, changes made without clouding, resubmittals missing the narrative that ties it all together. Here is the workflow we use to clear MEP plan-review corrections in a single cycle.

## Step 1: Read the Letter Like the Reviewer Wrote It

Start by reading the entire correction letter before touching CAD. Reviewers write comments in the order they encountered issues, not in priority order — and several comments often trace back to one root cause. A comment about panel schedules and a comment about feeder sizes may both come from an unclear service calculation. Map every comment to a sheet, a discipline, and a root cause before you change anything. Then check the letter for administrative items: missing signatures, wrong application forms, expired licenses. Those hold up the permit just as hard as a code issue, and they take five minutes to fix.

## Step 2: Classify Every Comment Before Opening CAD

We sort every comment into one of four buckets: code compliance, coordination, clarification, and administrative. Code compliance comments change the design and may need the engineer of record to sign off before we redraw. Coordination comments mean two disciplines disagree and the fix belongs on both sheets. Clarification comments are answered with a note, a detail, or a clouded addition — no redesign. Administrative comments never touch CAD at all. This classification decides who does the work, whether the engineer of record needs to be involved, and how the response letter is organized. Skipping it is how a one-day clarification turns into a two-week redesign.


![A revision cloud circling a corrected detail, the mark of a plan-review comment resolved cleanly.](/generated/blog/inline/clearing-mep-plan-review-corrections-1.webp)


## Step 3: Cloud Changes and Run a Revision Delta

Every change gets a revision cloud, a delta number, and a date — on the sheet, in the title block, and on the sheet index. The revision cloud is not decoration; it is how the reviewer verifies that every comment was addressed without re-reading the whole set. We keep a revision log that maps each delta to the specific correction-letter comment it answers. After clouding, we run a delta check: open the previous submittal next to the new one and confirm that every cloud corresponds to a comment, and every comment corresponds to a cloud. Changes made without clouds are invisible to the reviewer and read as ignored comments — the fastest route to a second correction letter.

## Step 4: Assemble a Resubmittal Package, Not Just New Sheets

The resubmittal is a package with four parts: the response letter, the revised sheets, the unchanged sheets, and the supporting documents. The response letter answers every comment by number, states what changed, and cites the sheet and delta where the reviewer can find it. We resubmit the complete set, not just the changed sheets, because reviewers check context — a changed detail on one sheet affects the plan on another, and they want to see both. Supporting documents — updated load calculations, cut sheets for substituted equipment, energy compliance forms — go in with the package, referenced from the response letter. A complete package gets re-reviewed in days. A partial one gets a new correction letter asking for the missing pieces.

<Callout type="warning">Never resubmit only the changed sheets. Reviewers verify corrections in context, and a partial set almost always triggers a second correction letter asking for the rest — resetting your review clock.</Callout>

<Checklist items="Read the full correction letter and map each comment to a sheet and root cause;Classify every comment as code, coordination, clarification, or administrative;Confirm engineer-of-record sign-off on any design changes;Cloud every change with a delta number and date;Update the revision log mapping each delta to its comment;Run a delta check against the previous submittal;Update the sheet index and title block revision blocks;Write the numbered response letter citing sheet and delta for each comment;Attach updated calcs, cut sheets, and compliance forms;Resubmit the complete set, not just the changed sheets" />

Staring at a correction letter right now? We clear them for clients every week — clouded revisions, numbered response letters, and resubmittal packages for [electrical](/services/electrical-design/electrical-system-design) and [HVAC](/services/mechanical-design/hvac-design) scope alike. [Request a quote](/request-quote) with the correction letter and the current set.`,
  },
  {
    slug: "pdf-to-cad-conversion-permit-ready",
    title: "PDF to CAD Conversion: Getting Legacy Drawings Permit-Ready Again",
    template: "STANDARD",
    category: "design-drafting",
    tags: ["pdf to cad", "as-builts", "legacy drawings", "cad conversion"],
    readMinutes: 6,
    featured: false,
    daysAgo: 3,
    excerpt: "Scanned as-builts and hand-drafted originals cannot carry a permit application. Here is how we convert legacy drawings into editable, layered, code-compliant CAD sets.",
    bodyMdx: `Somewhere in a file cabinet — or a scanned PDF on a server — sits the only record of a building's MEP systems: hand-drafted originals from decades ago, a scanned as-built set, a permit set drawn by a firm that no longer exists. When that building needs a renovation, an addition, or a change of occupancy, the AHJ will not accept those drawings as the basis for a permit. The design has to live in editable, layered CAD that reflects current code. That is what PDF-to-CAD conversion does, and the cleanup matters more than the tracing.

## Why Legacy Drawings Stall Permits

A scanned PDF is a picture, not a drawing. You cannot snap to it, you cannot verify dimensions, and you cannot show the reviewer a layered set where the mechanical background and the electrical plan separate cleanly. Worse, legacy drawings carry legacy code: feeder sizes from an older NEC cycle, plumbing fixture counts from a superseded code, egress paths that predate current IBC requirements. Submitting them as-is — even "for reference" — invites the reviewer to hold your new work to the old drawing's assumptions. The conversion has to be more than a trace; it has to be a translation into today's standards.

## The Conversion Process, Step by Step

We start by assessing the source: scale accuracy, legibility, and completeness. A clean plotted set converts faster than a third-generation scan, and we tell clients that upfront. Then we rebuild the geometry in AutoCAD at true scale — walls, openings, and grid lines first, because every MEP system hangs off the architecture. MEP systems come next, each on its own layer system: ductwork, piping, conduit, and fixtures drawn as editable entities, not dead linework. Text becomes real text with a consistent style. Dimensions get verified against the stated scale, and anything that does not close or align gets flagged — legacy drawings are full of small geometric inaccuracies, and we do not carry them forward silently.


![A faded legacy sheet beside its crisp CAD redraw, showing PDF-to-CAD conversion bringing old drawings back to life.](/generated/blog/inline/pdf-to-cad-conversion-permit-ready-1.webp)


## Cleanup Is Where the Permit Value Lives

Tracing alone produces a CAD file. Cleanup produces a permit set. We rebuild the layer structure to a standard convention, purge the junk, and set line types and weights so the set plots correctly. Equipment schedules get recreated as real schedules with tags that match the plans. Title blocks get the current project information, the engineer of record, and the code edition the permit will be reviewed under. And we add what the legacy set never had: a sheet index, legends, and keyed notes — the navigation layer that turns an old drawing into a submittable set. This is the work clients do not see in a thumbnail but reviewers feel on the first page.

## What the AHJ Receives

The deliverable is a complete DWG set: layered, scaled, editable, and organized to the same standard as a new-construction set. Alongside it, we provide conversion notes documenting what was verified, what was assumed, and what the client should field-verify — because honesty about a decades-old building's as-builts is part of permit readiness. From there, the renovation design proceeds on a reliable background instead of a scanned guess. The permit review starts from a set the reviewer can actually review, which is the entire point.

<Callout type="tip">If you only have scans, provide the earliest-generation original you can find. Every generation of copying adds dimensional drift that has to be corrected by hand — and that correction time shows up in your fee.</Callout>

Have a legacy set that needs to become a permit set? We convert scanned and hand-drafted originals into layered, editable CAD — [electrical](/services/electrical-design/electrical-system-design), [plumbing](/services/mechanical-design/plumbing-design), and full MEP backgrounds — with the sheet index, legends, and keyed notes reviewers expect. [Request a quote](/request-quote) with your scans.`,
  },
  {
    slug: "cad-layer-sheet-standards-multi-discipline",
    title: "7 CAD Layer and Sheet Standards That Keep Multi-Discipline Sets Clean",
    template: "LISTICLE",
    category: "design-drafting",
    tags: ["cad standards", "layer management", "sheet setup", "multi-discipline"],
    readMinutes: 7,
    featured: false,
    daysAgo: 4,
    excerpt: "Multi-discipline MEP sets fall apart in details nobody on the design team notices and every plan reviewer does. These seven standards prevent that.",
    bodyMdx: `Multi-discipline MEP sets fall apart in the details that nobody on the design team notices and every plan reviewer does: a layer that means different things on different sheets, a title block with yesterday's date, a revision cloud with no delta. These are the seven standards we enforce on every set. They are boring, and they are the reason our sets pass review.

## 1. A Layer-Naming Convention Everyone Follows

Every entity in the set lives on a layer whose name describes it: discipline, element, and status. A typical pattern is discipline-element-status, for example E-LITE-FIXT for electrical lighting fixtures or M-DUCT-SUPP for mechanical supply ductwork. The exact pattern matters less than the enforcement: no one creates a layer called Layer1, and no one draws ductwork on the electrical layer because it was convenient. When a reviewer or contractor freezes a layer group, the set behaves predictably. We publish the layer list in the project CAD standards document at kickoff, and any layer outside it gets purged before submittal.

## 2. Colors and Linetypes That Mean Something

Color in CAD is information, not decoration. We assign colors by system so that even a plotted black-and-white set reads through line weight: new work heavy, existing work screened, demolition dashed. Linetypes follow the same logic — hidden lines for above-ceiling work shown on floor plans, phantom lines for future-phase work. The legend defines every one of them. A set where the same color means new duct on one sheet and existing pipe on another is a set the reviewer cannot trust at a glance.

## 3. Xref Discipline: One Source of Truth per Background

Architectural backgrounds, structural grids, and reflected ceiling plans each live in exactly one xref file, referenced — never inserted — into the discipline sheets. When the architect moves a wall, we update one background and every discipline sheet follows. Inserted or exploded backgrounds are how sets drift: the mechanical plan shows the old wall location while the electrical plan shows the new one, and the reviewer finds the conflict. We freeze unneeded xref layers rather than turning them off, so they plot correctly and the file stays light.


![Color-coded layer swatches beside a floor plan, the layer discipline that keeps multi-trade sets clean.](/generated/blog/inline/cad-layer-sheet-standards-multi-discipline-1.webp)


## 4. Sheet Order That Matches How Reviewers Read

Sheets follow a fixed order: cover and index, general notes and legends, then architectural backgrounds, then mechanical, electrical, plumbing, and fire protection — plans first, then schedules, then details within each discipline. Numbering carries the discipline prefix: M-201 is always a mechanical plan, E-601 always an electrical detail. Reviewers learn the pattern once and navigate every set the same way. A set with sheets in random order forces the reviewer to build a mental map before evaluating the design, and that friction shows up as pickier comments.

## 5. Title Block Fields With No Blanks

Every title block carries the same complete information: project name and address, client, engineer of record with license number, code edition, sheet number and title, scale, date, and drawn and checked initials. No blanks, no TBD, no placeholder text — a blank field reads as an unfinished set, and reviewers treat unfinished sets accordingly. Dates update on every submittal so the revision history is unambiguous. This is administrative, it takes minutes, and we have seen it hold up permits.

## 6. A Revision Protocol That Survives Resubmittals

Revisions follow one protocol from the first correction letter to the final permit: cloud, delta, date, log. Each change gets a cloud with a delta number tied to the correction comment it answers; the title block revision block records the delta, date, and description; the sheet index flags revised sheets. The revision log maps every delta to its source comment. When the third resubmittal arrives, nobody has to reconstruct what changed in the second — the protocol already says so. Reviewers notice this discipline, and it shortens every subsequent review.

## 7. File Naming That Tells You What Is Inside

File names carry project, discipline, content, and version: a name like 24017-M-FP-201_R2 tells anyone — drafter, engineer, or reviewer downloading the submittal — exactly what the file is without opening it. No "final," no "final-final," no prose dates. Version suffixes increment on every issued set, and superseded versions move to an archive folder instead of lingering next to current files. Clean file naming is the cheapest quality control in the office, and it is the first thing a reviewer sees on an electronic submittal portal.

None of these seven standards is difficult on its own. Together, they are the difference between a set that reads as professional and one that reads as improvised — and reviewers issue permits to the professional one.

These seven standards govern every set that leaves our office, from [electrical](/services/electrical-design/electrical-system-design) packages to coordinated [mechanical](/services/mechanical-design/mechanical-design) sets. Send us your CAD standard and we will draft to it — or adopt ours. [Request a quote](/request-quote) to start your next set.`,
  },
{
    slug: "electrical-room-layouts-that-pass-plan-review",
    title: "Electrical Room Layouts That Pass Plan Review",
    template: "TECHNICAL_GUIDE",
    category: "electrical",
    tags: ["electrical-room", "nec-110-26", "plan-review"],
    discipline: "electrical",
    readMinutes: 8,
    featured: false,
    daysAgo: 5,
    excerpt: "Electrical rooms collect more plan-review comments than almost any other space. Here is how we lay out clearances, dedicated space, and egress to NEC 110.26 so the room clears review the first time.",
    bodyMdx: `Electrical rooms get more plan-review comments than almost any other space on a commercial project. The reason is rarely the equipment itself — it is the space around it. Reviewers check clearances before they check anything else, and a room that looked fine as a schematic sketch can fail the moment someone scales the 36-inch working space in front of a 400-amp panelboard.

We draw electrical rooms every week, and the corrections we see are almost always the same handful of issues. Here is how we lay out a room so it clears review the first time.

## NEC 110.26 Working Clearances, Drawn to Scale

Article 110.26 is the section reviewers know by heart, so we draw to it explicitly. Table 110.26(A)(1) sets the depth of working space: for most commercial equipment at 600 volts or less, that means 3 feet of clear depth in front of the equipment under Condition 1, increasing to 3-1/2 or 4 feet where live parts are exposed on both sides or grounded surfaces face the equipment.

Width is 30 inches minimum or the width of the equipment, whichever is greater per 110.26(A)(2), and headroom is 6-1/2 feet or the height of the equipment, whichever is greater per 110.26(A)(3). We draw the full clearance envelope as a dashed polyline on the plan and dimension it. When the reviewer can see the 36-inch depth without measuring it themselves, the comment never gets written.

## Dedicated Equipment Space: NEC 110.26(E)

The zone directly above and below switchboards, panelboards, and motor control centers is reserved for the electrical installation. NEC 110.26(E) requires dedicated space equal to the width and depth of the equipment, extending from the floor to 6 feet above the equipment or to the structural ceiling, whichever is lower. No piping, ducts, or unrelated equipment is permitted in that zone, and the installation must be protected against leaks and condensation.

This is where coordination pays for itself. We ask for the mechanical routing early and hold the dedicated zone on the plan before ductwork gets drawn through it. Finding the conflict in CAD costs nothing. Finding it during rough-in costs a change order.


![A row of panelboards with clear working space, the layout discipline reviewers check first.](/generated/blog/inline/electrical-room-layouts-that-pass-plan-review-1.webp)


## Door Swing and Egress

For large equipment rated 1,200 amps or more and over 6 feet wide, NEC 110.26(C)(2) requires two entrances to the working space — one at each end. Personnel doors must open in the direction of egress and carry listed panic hardware per 110.26(C)(3).

We draw both door swings on the electrical room plan, not just on the architectural sheets, and we verify that an open door does not trap anyone behind energized equipment. We also confirm illumination per 110.26(D): the working space must be illuminated, and control of that lighting cannot depend on automatic means only. A wall switch at each entrance, shown on the plan, closes that comment before it opens.

## Equipment Placement and Adjacencies

Transformers need ventilation clearance per Article 450. Separately derived systems need their grounding electrode conductor paths shown. Working space for one piece of equipment may overlap another's, but it cannot extend into the dedicated space of different equipment or block access to disconnects required for motors under Article 430.

We place the largest equipment first — typically the switchboard or main distribution panel — then lay out panelboards, transformers, and transfer switches around the required envelopes rather than fitting envelopes around placed equipment. Order of operations matters: clearances first, equipment second.

## Electrical Room Layout Checklist

Before a room layout leaves our desk, it passes this list:

<Checklist items="Working-space depth dimensioned per Table 110.26(A)(1) for each voltage and condition;30-inch minimum width and 6-1/2-foot headroom verified at every lineup;Dedicated space per 110.26(E) held clear of piping, ducts, and foreign systems;Two entrances shown for equipment rated 1,200A or more and over 6 ft wide;Personnel doors swing in the direction of egress with panic hardware noted;Working-space illumination shown with manual control at each entrance;Clearance envelopes drawn as dashed polylines and dimensioned, not assumed" />

We draw electrical rooms like this every week as part of our [electrical system design](/services/electrical-design/electrical-system-design) service — clearances dimensioned, dedicated space held, and the [single-line diagram](/services/electrical-design/single-line-diagram) to tie the room back to the service. [Request a quote](/request-quote) with your floor plan and equipment list.`,
    meta: { downloadable: "Electrical Room Layout Checklist" },
  },
  {
    slug: "ev-charging-permit-drawings-what-ahjs-want-to-see",
    title: "EV Charging Permit Drawings: What AHJs Want to See",
    template: "STANDARD",
    category: "electrical",
    tags: ["ev-charging", "evse", "permit-drawings"],
    discipline: "electrical",
    readMinutes: 6,
    featured: false,
    daysAgo: 6,
    excerpt: "EVSE additions are one of the fastest-growing permit categories. This is the drawing package AHJs expect: 125-percent load calcs, panel schedules that tie out, and a site plan showing where the power actually goes.",
    bodyMdx: `EV charging is one of the fastest-growing permit categories we draw for. A retail center adding twenty EVSE stalls, an apartment garage retrofitting chargers, a fleet depot electrifying overnight — the electrical scope is real, and the AHJ treats it like any other service addition. The submittals that sail through review share the same anatomy: a defensible load calculation, a panel schedule that tells the whole story, and a site plan that shows where the power actually goes.

## Start With the Load Calculation

Every EVSE is a continuous load. NEC 625.41 requires the branch circuit to be sized at 125 percent of the EVSE nameplate rating, and that 125 percent carries straight into the service and feeder calculations under Article 220. A 48-amp charger is a 60-amp load on paper before you have added a single other watt.

Reviewers do their own math, so ours has to be airtight: existing connected and demand loads from the last approved calculation or utility data, plus the new EVSE at 125 percent, compared against the service rating. If the existing service absorbs it, we say so explicitly and show the spare capacity. If it does not, the service upgrade — new panel, new feeders, utility coordination — becomes part of the same permit set rather than a surprise correction letter.

## The Panel Schedule Tells the Story

The panel schedule is where most EVSE submittals stumble. Each new EVSE breaker must appear with its 125-percent sizing, the correct voltage and phase, and an AIC rating that matches the available fault current at that panel. Load totals on the schedule must tie to the calculation — when the schedule says one number and the calc says another, the reviewer stops trusting both.

We also show what is left: spare spaces, spare ampacity, and the resulting service demand after the addition. A reviewer who can see headroom at a glance has one less reason to ask questions. Label every EVSE circuit by stall or location so the field installation matches the paper without interpretation.


![An EV charging pedestal glowing in a parking structure, the equipment AHJs want fully detailed on permit drawings.](/generated/blog/inline/ev-charging-permit-drawings-what-ahjs-want-to-see-1.webp)


## Site Plan: Where the Conduit Actually Goes

EVSE lives in parking lots and garages, so the site plan does real work. We show each charger location, bollard protection, accessible stall layouts where required, and the complete conduit route from the electrical room to the last pedestal — including trenching, boring, or surface raceway. Disconnecting means per NEC 625.43 get located on the plan for equipment rated over 60 amps or over 150 volts to ground.

Setbacks, clearances, and equipment pads go on the plan too. The reviewer is checking that the installation can actually be built where it is drawn, and the inspector will hold you to the same drawing in the field.

## What Reviewers Ask For (Almost) Every Time

Beyond the drawings, expect the AHJ to ask for utility confirmation that the service can take the added load, equipment cut sheets for the EVSE with listings to UL 2594, and confirmation of local amendments — some jurisdictions layer EV-capable or EV-ready parking counts on top of the NEC through their energy codes. GFCI protection per 625.54 and proper labeling round out the typical correction list.

<Callout type="tip">Package the cut sheets, load calc, and panel schedules with the drawing set on the first submittal. One complete package beats three rounds of corrections every time.</Callout>

Adding EVSE to a site? Our [electrical load calculation](/services/calculations-reports/electrical-load-calculation) service sizes the addition at the NEC 125 percent — and where the service cannot take it, our [power upgrade](/services/electrical-design/power-upgrade) drawings document the new service for the same permit. [Request a quote](/request-quote) with your stall count and existing panel schedules.`,
  },
  {
    slug: "panel-schedule-mistakes-that-trigger-plan-review-corrections",
    title: "7 Panel Schedule Mistakes That Trigger Plan-Review Corrections",
    template: "LISTICLE",
    category: "electrical",
    tags: ["panel-schedule", "plan-review", "corrections"],
    discipline: "electrical",
    readMinutes: 6,
    featured: false,
    daysAgo: 7,
    excerpt: "Seven panel-schedule errors that reliably trigger correction letters — mismatched breakers, missing AIC ratings, load totals that do not tie — and how we keep each one off your submittal.",
    bodyMdx: `The panel schedule is the most-read sheet in an electrical permit set after the one-line diagram, and it is where reviewers go looking for reasons to write corrections. We have seen the same seven mistakes trigger comment letters across dozens of jurisdictions. Each one is avoidable, and each one costs a review cycle when it is not.

## 1. Breaker Sizes That Do Not Match the One-Line

The schedule shows a 225-amp main while the riser diagram shows 200 amps, or a branch breaker is 30 amps on one sheet and 40 on another. Reviewers cross-check the two sheets as a matter of habit. We build the schedule and the one-line from the same load data in a single pass, then run a dedicated coordination check between the two sheets before anything is issued.

## 2. Missing AIC Ratings

Every overcurrent device needs an interrupting rating equal to or greater than the available fault current at its location per NEC 110.9. A schedule with blank AIC columns — or a single AIC value copied across panels at different fault levels — tells the reviewer the fault study was never coordinated with the schedule. We show the available fault current and the device AIC rating side by side at every panel.

## 3. Load Totals That Do Not Tie to the Calculation

The schedule totals 184 kVA of demand load while the Article 220 calculation says 211 kVA. The moment the numbers disagree, the reviewer stops trusting both documents and asks for a full reconciliation. We tie the schedule's connected and demand columns directly to the calculation line items, and the totals match to the decimal.


![Rows of breakers and terminations inside a panelboard, where schedule mistakes become field problems.](/generated/blog/inline/panel-schedule-mistakes-that-trigger-plan-review-corrections-1.webp)


## 4. Mystery Spares and Unlabeled Spaces

Blank rows labeled "spare" with no breaker size, or spaces with no indication of intended load, raise the question of what is really being permitted. Some AHJs treat unlabeled spares as unreviewed future load and reject them outright. We label every space: breaker size for spares, or the specific future load for spaces, so there is nothing for the reviewer to guess at.

## 5. Voltage or Phase That Disagrees With the Service

A 208Y/120V schedule fed from a 480Y/277V service with no transformer shown, or single-phase loads landed on a three-phase panel schedule with no phase balancing. These are drafting errors, not engineering errors, but the reviewer cannot tell the difference. We verify the service voltage against the utility letter and show every transformation point on the riser before the schedule is finalized.

## 6. Conductors That Cannot Carry the Breaker

NEC 240.4 requires conductors to be protected against overcurrent in accordance with their ampacity. A 100-amp breaker on a conductor sized for 85 amps is a correction every time — and it usually comes from updating the breaker during value engineering without updating the wire size. Our schedules carry the conductor size in the same row as the breaker, so a change to one forces a check of the other.

## 7. Connected Load With No Demand Summary

A schedule that lists every load at 100 percent connected kVA with no demand factors applied is technically a load list, not a load calculation. Reviewers need to see Article 220 demand factors — lighting, receptacle, motor, and HVAC diversity — applied and totaled so the service and feeder sizing can be verified. We show connected load, demand factor, and demand load in separate columns with a summary total that feeds the riser.

A clean panel schedule does not just avoid corrections — it shortens review time, because the reviewer spends their effort verifying good work instead of hunting for errors. That is the standard we hold every schedule to before it leaves our desk.

Our [electrical system design](/services/electrical-design/electrical-system-design) sets are built schedule-first: panel schedules, [single-line diagram](/services/electrical-design/single-line-diagram), and load calculation from one data pass, cross-checked before issue. [Request a quote](/request-quote) and we will hold your next schedule to this standard.`,
  },
  {
    slug: "emergency-power-drawing-packages-generators-transfer-switches",
    title: "Emergency Power Drawing Packages: Generators, Transfer Switches, and Egress",
    template: "TECHNICAL_GUIDE",
    category: "electrical",
    tags: ["emergency-power", "generator", "transfer-switch"],
    discipline: "electrical",
    readMinutes: 9,
    featured: false,
    daysAgo: 8,
    excerpt: "A complete emergency power permit set covers the generator plant, transfer equipment, and egress loads as one coordinated system. Here is the anatomy, from sizing notes to riser.",
    bodyMdx: `An emergency power package is really three systems sharing one set of drawings: the generator plant, the transfer equipment, and the life-safety loads they serve. Reviewers evaluate it against Articles 700, 701, and 702 simultaneously, and a drawing set that blurs the lines between emergency, legally required standby, and optional standby loads is asking for corrections.

We build these packages as a system — sizing notes, transfer configurations, egress coordination, and a riser that ties it all together — so the reviewer can trace any load from the generator terminals to the last exit sign.

## Generator Sizing Notes That Belong on the Drawings

NEC 700.4 requires emergency system capacity to handle all loads intended to operate simultaneously, and the same principle applies to legally required standby under 701.4. We put the sizing basis on the drawings, not just in the engineer's file: connected emergency load, largest motor starting kVA, alternator temperature rise, and the resulting generator kW and kVA rating with the margin stated.

Selective coordination gets a note and a settings table reference — reviewers increasingly ask for it by name under 700.32 and 701.31. Fuel source, on-site runtime, and the remote annunciator location per NFPA 110 go on the site or equipment plan. When the sizing story is printed on the sheet, the reviewer does not have to request the study behind it.

## ATS Configurations, Drawn Clearly

NEC 700.5 requires transfer equipment to be automatic, listed for emergency use, and approved by the AHJ. We draw each automatic transfer switch with its normal and emergency sources labeled and the loads it serves grouped by system — emergency, legally required standby, and optional standby each on their own transfer equipment so the systems stay distinct on paper the way the Code requires them to be in the field.

Transition type matters: open versus closed transition is noted on the ATS schedule, and bypass-isolation is shown wherever the specification calls for it. Neutral switching is drawn explicitly — 3-pole versus 4-pole — with grounding notes, because a switched neutral changes the separately derived system design downstream. Each ATS gets a schedule row: source breakers, loads served, transition type, and time-delay settings.


![An automatic transfer switch with status lights glowing, the heart of an emergency power system.](/generated/blog/inline/emergency-power-drawing-packages-generators-transfer-switches-1.webp)


## Egress Lighting Coordination

Emergency illumination for the means of egress is required by NEC 700.16, and 700.12 lists the permitted sources, including generators, batteries, and unit equipment. We coordinate every egress fixture with the architectural reflected ceiling plan so the lighting layout on our sheets matches the ceiling the architect is permitting. Mismatched ceiling plans are a classic, entirely avoidable correction.

Exit signs and unit equipment are circuited back to the emergency distribution and shown on dedicated emergency lighting plans, with battery-pack locations called out. Where the AHJ asks for it, we add photometric values along the egress path. The goal is simple: anyone reading our lighting plan and the architect's ceiling plan should see the same building.

## The Riser Diagram Ties It Together

The riser — the one-line diagram — is the reviewer's roadmap: utility service, generator, each ATS, the emergency distribution, and every downstream panel on one sheet. We show the normal and emergency source for each transfer switch, breaker sizes with AIC ratings coordinated for selective operation, and clear labeling of which panels carry Article 700 emergency loads versus 701 or 702 loads.

Wiring separation notes per 700.10(B) go on the riser too. Emergency wiring kept independent of normal wiring is one of the first things a reviewer checks, and stating it on the drawing answers the question before it is asked. When the riser tells a coherent story, the floor plans just confirm it.

## Emergency Power Drawing Checklist

Every emergency power set we issue passes this list first:

<Checklist items="Generator sizing basis on the drawings: connected load, motor starting kVA, margin stated;Selective coordination noted per 700.32 and 701.31 with settings table reference;Each ATS shown with sources, loads grouped by system, transition type, bypass where required;Neutral switching explicit (3-pole vs 4-pole) with grounding notes;Emergency, legally required standby, and optional standby loads on correct transfer equipment;Egress lighting coordinated with the architectural reflected ceiling plan;Exit signs and unit equipment circuited to emergency distribution;Riser shows full source-to-load path with breaker sizes and AIC ratings;Wiring separation per 700.10(B) noted on the riser;Fuel source, runtime, and NFPA 110 remote annunciator located on the plans" />

We draft emergency power packages as part of our [electrical system design](/services/electrical-design/electrical-system-design) service — generator sizing notes, ATS configurations, egress coordination, and the [single-line diagram](/services/electrical-design/single-line-diagram) riser that ties it together. [Request a quote](/request-quote) with your generator spec and load list.`,
    meta: { downloadable: "Emergency Power Drawing Checklist" },
  },
{
    slug: "fire-alarm-drawings-device-layouts-risers-sequence-tables",
    title: "Fire Alarm Drawings: Device Layouts, Risers, and Sequence Tables",
    template: "TECHNICAL_GUIDE",
    category: "fire-protection",
    tags: ["fire alarm", "NFPA 72", "permit drawings"],
    discipline: "fire-protection",
    readMinutes: 9,
    featured: false,
    daysAgo: 13,
    excerpt: "A complete fire alarm permit package is more than device dots on a floor plan. Here is what we include on every set: spacing per NFPA 72, riser diagrams, battery and voltage-drop calculations, and the sequence of operations table.",
    bodyMdx: `## What the AHJ Expects to See

A fire alarm permit submittal that comes back with review comments almost always fails in the same places: missing calculations, a riser diagram that does not match the floor plans, or a sequence of operations that reads like a guess. We treat the fire alarm package as five deliverables that must agree with each other: floor plans with device layouts, a riser diagram, battery calculations, voltage-drop calculations, and a sequence of operations table. If any one of the five contradicts the others, the reviewer will find it.

## Device Spacing on the Floor Plan

Device layout is where NFPA 72 turns into geometry on the plan. Smoke detectors get a 30-foot listed spacing on smooth ceilings, reduced where beams, joists, or sloped ceilings interrupt coverage. Heat detectors typically carry a 50-foot listed spacing, also reduced for the actual ceiling construction. Manual pull stations go within 5 feet of each exit doorway, mounted with the operable part between 42 and 48 inches above the finished floor, and arranged so travel distance to a station never exceeds 200 feet.

Notification appliances get the same discipline. We show candela ratings on the plan and verify wall-mounted strobes against the spacing tables for the room sizes, keeping in mind that a 15-candela device covers a 20-by-20-foot area while larger rooms step up through the table. Audible devices must deliver at least 15 dBA above the average ambient sound level. Every device gets a unique address or circuit ID on the drawing, because the riser and the sequence table both reference those IDs.

## The Riser Diagram

The riser diagram is the electrical one-line of the fire alarm system. Ours shows the fire alarm control panel, each signaling line circuit loop with its device count, every notification appliance circuit with its load, auxiliary power supplies, and all monitor and control modules with the equipment they supervise or shut down. We draw the riser at a scale where a reviewer can trace any device from the floor plan to the riser without guessing.

<Callout type="tip">Draw the riser from the floor plans, not the other way around. When the riser is built first, the device counts drift and the two sheets stop matching by the second revision.</Callout>


![A smoke detector and notification strobe on a dark ceiling, the devices a fire alarm layout must place precisely.](/generated/blog/inline/fire-alarm-drawings-device-layouts-risers-sequence-tables-1.webp)


## Battery Calculations and Voltage Drop

NFPA 72 requires standby batteries sized for 24 hours of standby followed by 5 minutes of alarm operation, or 15 minutes of alarm for emergency voice and alarm communications systems. Our calculation sheet lists every device on standby current and alarm current, totals both columns, applies the required safety factor, and states the selected battery size in amp-hours. The reviewer checks the math against the device schedule, so the two must use the same quantities.

Voltage drop gets its own sheet for the longest notification appliance circuit run. We calculate using the actual conductor size, the circuit length from the riser, and the total alarm current on that run, confirming the last device still sees voltage within the listed operating range of the appliance. When a run fails, we upsize the conductor or split the circuit before the submittal goes out, not after the first review comment.

## Sequence of Operations Table

The sequence table is a matrix: every initiating input down the left column, every output function across the top, and the required actions marked at each intersection. A smoke detector in the elevator lobby recalls the cars, shuts down the associated air handler, releases the door holders, and activates notification on the alarm floor. A duct detector shuts down its unit without a general alarm. A sprinkler waterflow switch starts the same outputs as a manual pull station. We write the table from the actual system programming intent, because the commissioning agent will test against it.

## Common Review Comments We Design Around

Most fire alarm review comments trace back to coordination. The FACP location conflicts with the electrical room layout. The annunciator is not at the fire department entrance the AHJ uses. Candela ratings on the plan do not match the schedule. Our drafting checklist catches these before submittal, which is why our packages clear review in fewer rounds.

<Checklist items="Device legend with NFPA 170 symbols and a complete device count schedule;Detector spacing verified against NFPA 72 for the actual ceiling construction;Manual pull stations within 5 ft of exits with 200 ft maximum travel distance;Notification appliance candela ratings and spacing verified per the coverage tables;Riser diagram showing every SLC loop, NAC circuit, and auxiliary power supply;Battery calculations showing 24-hour standby plus 5-minute alarm load;Voltage-drop calculations for the longest NAC run with conductor sizes stated;Sequence of operations table covering every input-output combination;FACP and annunciator locations coordinated with the electrical plans and the fire department entrance" />

This five-deliverable package is exactly what our [fire alarm system design](/services/electrical-design/fire-alarm-system-design) service produces — device layouts, riser, battery and voltage-drop calcs, and the sequence table — coordinated with the building's [electrical system](/services/electrical-design/electrical-system-design). [Request a quote](/request-quote) with your floor and ceiling plans.`,
    meta: { downloadable: "Fire Alarm Drawing Checklist" },
  },
  {
    slug: "9-sprinkler-head-layout-rules-every-drafter-should-know",
    title: "9 Sprinkler Head Layout Rules Every Drafter Should Know",
    template: "LISTICLE",
    category: "fire-protection",
    tags: ["sprinklers", "NFPA 13", "permit drawings"],
    discipline: "fire-protection",
    readMinutes: 7,
    featured: false,
    daysAgo: 14,
    excerpt: "NFPA 13 reads like an engineering manual, but on a plan it comes down to nine layout rules. Here is how we translate each one into head placement that passes review.",
    bodyMdx: `## 1. Maximum Spacing and Protection Area

Every hazard classification sets two numbers: the maximum area one sprinkler can protect and the maximum distance between sprinklers. Light hazard allows 225 square feet per sprinkler at up to 15-foot spacing. Ordinary hazard drops to 130 square feet, still at 15-foot spacing. Extra hazard allows 100 square feet at 12-foot spacing. We lay out the grid from these numbers first, because everything else is a refinement of this grid.

## 2. Deflector Distance from the Ceiling

For standard spray sprinklers under unobstructed construction, NFPA 13 requires deflectors positioned between 1 inch and 12 inches below the ceiling. This is not a suggestion. A deflector buried tight to the deck or hanging 18 inches below it changes the spray pattern enough to fail the intent of the standard, and reviewers do check the section details for it.

## 3. Distance from Walls

Sprinklers must sit at least 4 inches from a wall, and no farther from the wall than one-half of the allowable spacing between sprinklers. The half-spacing rule is the one that gets missed on narrow rooms and corridors, where a single row of heads centered in the space is usually the correct answer.

## 4. The Beam Obstruction Rule

Beams and joists block spray, so NFPA 13 requires sprinklers to be positioned away from them based on the deflector-to-beam distance, or dropped below the bottom of the beam. The practical version we draft to: keep sprinklers at least three times the beam width away from the beam when the deflector is near the beam bottom, and drop the sprinkler below the beam wherever the geometry does not allow the offset. We show this on reflected ceiling plans where the structure is visible.


![Sprinkler heads spaced along red supply piping, where layout rules meet the ceiling grid.](/generated/blog/inline/9-sprinkler-head-layout-rules-every-drafter-should-know-1.webp)


## 5. Sprinklers Below Wide Ducts and Obstructions

Any continuous obstruction wider than 4 feet, such as a large duct or a cable tray bank, needs sprinklers installed below it. This rule surprises project teams because the ductwork is often not on the fire protection drawings. We coordinate with the mechanical plans specifically to find obstructions over 4 feet wide and add the heads before the AHJ does it for us in a review comment.

## 6. Small Rooms and Closets

NFPA 13 grants exemptions for small closets and bathrooms under specific size limits, but the exemption depends on the occupancy and the edition of the standard in force. We never leave a room unprotected on the assumption that an exemption applies. The drafter confirms the exemption with the engineer of record and notes it on the plan, because an unexplained gap in coverage reads as an error.

## 7. Orientation: Pendant, Upright, and Sidewall

Deflectors must face the correct direction: upright sprinklers throw upward, pendent sprinklers throw downward, and sidewall sprinklers throw outward from the wall. It sounds obvious, but on reflected ceiling plans with mixed ceiling types, the wrong symbol in the wrong room is a common drafting error. We use distinct symbols for each orientation and verify them against the ceiling types room by room.

## 8. Concealed Combustible Spaces

Attics, ceiling plenums, and other concealed spaces with combustible construction generally require sprinkler protection unless a specific exemption is met, such as noncombustible insulation or limited access with fireblocking. These spaces are invisible on the architectural floor plan, which is exactly why they get missed. Our plans include a concealed-space note block that states the protection approach for every such space in the building.

## 9. Show Pipe Sizes and Hangers on the Plan

The head layout is only half the drawing. We show branch line pipe sizes from the hydraulic calculations or pipe schedule, mark hanger locations and types per the hanging rules, and dimension the layout so the installing contractor can build from the sheet without interpretation. A beautiful head layout with no pipe sizes is a sketch, not a permit drawing.

Our [sprinkler layout](/services/fire-protection/sprinkler-layout-plan) service drafts every one of these nine rules into the plan — head placement, pipe sizes, hangers, and the hydraulic basis behind them — and coordinates with our [fire alarm system design](/services/electrical-design/fire-alarm-system-design) where the AHJ wants both scopes together. [Request a quote](/request-quote) with your reflected ceiling plans and hazard classification.`,
  },
  {
    slug: "standpipe-system-drawings-mid-rise-buildings",
    title: "Standpipe System Drawings for Mid-Rise Buildings",
    template: "STANDARD",
    category: "fire-protection",
    tags: ["standpipe", "NFPA 14", "permit drawings"],
    discipline: "fire-protection",
    readMinutes: 6,
    featured: false,
    daysAgo: 15,
    excerpt: "Mid-rise buildings live in the standpipe gray zone: tall enough to need one, varied enough that the class and layout are never obvious. Here is what we put on the permit drawings.",
    bodyMdx: `## What Goes on the Permit Set

A standpipe permit package has three parts: floor plans showing every hose connection location, a riser diagram showing the full vertical distribution with valves and drains, and details covering the fire department connection, hose valves, and pressure-regulating devices. The calculations behind it, flow and pressure per NFPA 14, belong in the submittal too, but the drawings are what the reviewer marks up first.

## Class I, Class II, or Class III

The class determines the hardware on every floor. Class I systems provide 2-1/2-inch hose connections for fire department use and are the standard choice for most mid-rise buildings required to have standpipes. Class II systems provide 1-1/2-inch hose stations for trained building occupants and appear in specific occupancies where the code calls for them. Class III systems provide both, giving the fire department its 2-1/2-inch outlets and occupants their 1-1/2-inch stations from the same riser.

We confirm the class with the code analysis before drawing a single valve, because changing classes mid-project means reworking every floor plan, the riser, and the details.

## Riser Details That Matter

The riser diagram shows each standpipe riser from the water supply to the roof manifold, with sectional control valves, check valves, drain risers, and air vents at the high points. Every hose connection gets a symbol with its size and floor elevation. Where the hydraulics require it, we show pressure-regulating valves with their set points, because NFPA 14 caps static pressure at 175 psi and limits residual pressure at 1-1/2-inch occupant outlets to 100 psi.

> A riser diagram that omits drains and vents will still get approved, and then the installing contractor will ask where they go. We would rather answer that question on the drawing.


![A standpipe hose valve in a stairwell, the firefighter connection every mid-rise riser drawing must locate.](/generated/blog/inline/standpipe-system-drawings-mid-rise-buildings-1.webp)


## Hose Connection Placement

Hose connections go at each floor level and intermediate landing of every required stairway, positioned so firefighters can stretch hose to any point on the floor. The practical test we draft to: no portion of the floor area should be beyond a reasonable hose lay from a connection, and the AHJ will apply its own interpretation of reasonable. We also show the roof manifold where required, with the connections the fire department expects to find there.

## FDC Placement and Access

The fire department connection must be visible and accessible from the street front or another approved location, with signage the responding crew can read from the apparatus. We show the FDC on the site plan and the building elevations, coordinate its location with the civil grading so it is not buried behind landscaping, and detail the check valve arrangement behind it. An FDC the fire department cannot find quickly is a design failure no calculation can fix.

## Pressure, Testing, and the Notes Block

Our drawing notes state the required residual pressures, the hydrostatic test pressure of 200 psi held for two hours, and the flow test procedure. These notes are not decoration. They tell the reviewer the system was designed to NFPA 14 end to end, and they give the installing contractor the acceptance criteria before the pipe goes in the wall.

We draft standpipe packages as part of our [sprinkler layout](/services/fire-protection/sprinkler-layout-plan) scope — floor plans, riser diagrams, and FDC details — coordinated with the building's [fire alarm system](/services/electrical-design/fire-alarm-system-design) where the AHJ wants both. [Request a quote](/request-quote) with your floor plans and water supply data.`,
  },
  {
    slug: "kitchen-hood-suppression-drawings-what-ahjs-check",
    title: "Kitchen Hood Suppression Drawings: What AHJs Check",
    template: "STANDARD",
    category: "fire-protection",
    tags: ["kitchen hood", "suppression systems", "NFPA 96"],
    discipline: "fire-protection",
    readMinutes: 6,
    featured: false,
    daysAgo: 16,
    excerpt: "Commercial kitchen suppression submittals fail review over the same handful of items: nozzle aiming, pull station location, and fuel shutoffs. Here is what the AHJ looks for on your drawings.",
    bodyMdx: `## The Suppression Plan View

The core sheet is a plan view of the cooking line drawn over the kitchen equipment layout, showing every protected appliance, the exhaust hood outline, the duct riser, and the suppression system piping with nozzle locations. We draw the appliance schedule next to it with the equipment type and dimensions for each item, because nozzle selection and placement depend on what is actually being protected: fryers, griddles, ranges, and broilers each get their own nozzle treatment under a UL 300 listed wet chemical system.

## Nozzle Coverage and Aiming Points

This is the first thing the reviewer checks. Each nozzle symbol on our drawings carries an aiming point, shown as a leader to the exact hazard it protects: the plenum, the duct, or the cooking surface. Appliance nozzles are aimed at the hazard area of each piece of equipment per the manufacturer's listed design manual, and we note the nozzle part numbers so the reviewer can verify coverage against the listing. A plan with nozzle dots and no aiming information will come back with questions every time.

## Manual Pull Stations and Fuel Shutoffs

NFPA 96 requires a remote manual pull station located in the path of egress, no less than 10 feet and no more than 20 feet from the protected cooking equipment. We dimension this distance on the plan rather than leaving the reviewer to scale it. Actuation of the system must also shut off the fuel supply: the gas valve closes and electric cooking equipment drops out through a shunt trip or contactor. Our drawings show the fuel shutoff devices, their locations, and the interlock wiring back to the suppression control head or releasing panel.

<Callout type="warning">The most common field failure we see on as-builts is the pull station mounted behind the cooking line instead of in the egress path. If the kitchen staff cannot reach it while leaving, it is in the wrong place.</Callout>


![Suppression nozzles on red piping inside a kitchen exhaust hood, the details AHJs scrutinize.](/generated/blog/inline/kitchen-hood-suppression-drawings-what-ahjs-check-1.webp)


## Detection and Interlocks

Detection is shown as fusible links or electric thermal detectors positioned over each appliance and in the duct, rated for the temperatures the listing requires. The drawings also show the system microswitches and what they control: typically the makeup air unit shuts down on actuation while the exhaust fan keeps running to clear smoke, and a shunt trip drops power to outlets under the hood. Every interlock gets a line on the sequence notes so the electrician and the suppression contractor are working from the same sheet.

## Coordinating with the Hood and Duct Drawings

Suppression drawings do not stand alone. We coordinate the hood outline, duct routing, and clearances against the mechanical hood drawings, verifying the 18-inch clearance to combustible construction or the reduced clearance of a listed assembly. Grease duct access panels, the fan location, and the discharge termination all affect where detection and nozzles can physically go. When we find a conflict, such as a duct offset that breaks the nozzle coverage, we resolve it on the drawings before submittal instead of letting the installer discover it with a lift in the kitchen.

Our [sprinkler layout](/services/fire-protection/sprinkler-layout-plan) service covers suppression coordination for commercial kitchens — and our [fire alarm system design](/services/electrical-design/fire-alarm-system-design) handles the detection and interlock side. [Request a quote](/request-quote) with your cooking equipment layout.`,
  },
{
    slug: "multi-site-permit-tracking-across-jurisdictions",
    title: "Multi-Site Permit Management: Tracking 50 Jurisdictions at Once",
    template: "STANDARD",
    category: "franchise",
    tags: ["permitting", "jurisdictions", "AHJ", "rollout management"],
    readMinutes: 7,
    featured: false,
    daysAgo: 21,
    excerpt: "When you are opening dozens of locations, every building department is its own obstacle. Here is the system we use to track differing AHJ requirements, contacts, and timelines without losing the schedule.",
    bodyMdx: `## Every Jurisdiction Is Its Own Country

When you are rolling out fifty locations, the building department is not a single obstacle. It is fifty of them. Each authority having jurisdiction runs its own submittal portal — or still wants paper — enforces its own adopted code cycle, and applies its own local amendments. We have watched an identical prototype TI package get approved in nine days in one Texas city and sit for six weeks in the next county over because the plans examiner wanted a different energy compliance form. The drawings were not the problem. The process was.

The mistake most rollout teams make is treating permitting as a local problem to solve site by site. That works for three stores. At thirty, it collapses. What you need is a system: one that captures every jurisdiction's requirements once, keeps them current, and feeds them into your drawing and submittal workflow before the first sheet is plotted.

## Build a Jurisdiction Profile for Every Market

Before design starts on a site, someone should know the answers to a fixed set of questions: which code cycle is adopted, and what local amendments apply? Does the AHJ require separate MEP permits or a single combined permit? What submittal format — PDF upload, a specific portal, paper sets, and how many copies? What are the plan-check fees, and who pays them? Is a pre-submittal meeting available, and is it actually useful?

We keep a jurisdiction profile for every market a client operates in, and we update it after every submittal. The profile is a living document, not a one-time research task, because code cycles turn over and portals change without warning. The cheapest correction cycle is the one you never enter because the profile told you what the examiner wanted before you submitted.

## Standardize the Core, Localize the Edges

Your prototype MEP drawings should be ninety percent identical from site to site. The remaining ten percent is where permits live or die: the energy compliance forms for that state, the local plumbing fixture count calculations, the fire sprinkler submittal format the local fire marshal prefers, the electrical load calculation presented the way that examiner expects to see it.

We structure our drawing sets so the core sheets are locked and the jurisdiction-specific sheets and forms are a defined, swappable layer. When a new city comes online, we are not redrawing the set. We are adapting it. That discipline is also what keeps a correction in Phoenix from accidentally shipping in a set going to Tampa.

## The Submittal Tracker That Actually Works

Generic spreadsheets fail because they track everything and drive nothing. A rollout tracker needs exactly the columns that force decisions. This is the minimum we run on every multi-site program:

| Column | Why it matters |
|---|---|
| AHJ and sub-permits | Many cities split building, electrical, plumbing, and fire into separate permits with separate timelines |
| Submittal requirements | Format, copies, forms, and fees, pulled straight from the jurisdiction profile |
| Reviewer name and direct contact | A name and a direct line beats a general inbox every time |
| Target vs. actual dates | Submitted, first review, corrections returned, resubmitted, issued |
| Correction themes | Patterns across sites tell you what to fix in the prototype itself |

Review the tracker weekly with the whole team — drafter, permit expediter, GC, and the client's rollout manager. Permits are a production line. Treat them like one.


![A retail plaza with several units under construction, the multi-site reality behind tracking fifty jurisdictions.](/generated/blog/inline/multi-site-permit-tracking-across-jurisdictions-1.webp)


## Talk to People, Not Just Portals

Portals will not tell you that the plans examiner dislikes combined single-line diagrams, or that the fire marshal will fast-track your review if sprinkler calcs come in as a separate deferred submittal. People tell you that. For every new jurisdiction, we recommend a short pre-submittal call with the AHJ before the first drawing goes in. Fifteen minutes on the phone routinely saves three weeks of correction cycles.

And when you find a reviewer who is reasonable and responsive, write their name in the jurisdiction profile and treat that relationship like the asset it is. On a fifty-site rollout, three good relationships are worth more than three good templates.

## What We Put in Every Rollout Package

<Callout type="tip">Freeze the prototype, version the jurisdiction layer. Every site-adapted set we issue carries a revision block that separates prototype revisions from jurisdiction-specific changes, so a site correction never contaminates the core set.</Callout>

Multi-site permitting is not about working harder on each submittal. It is about building the machine once — profiles, templates, trackers, relationships — and letting each new site ride on what the last fifty taught you. That is how fifty jurisdictions stop feeling like fifty surprises.

We operate this machine for rollout clients: jurisdiction profiles, prototype [electrical](/services/electrical-design/electrical-system-design) and [mechanical](/services/mechanical-design/mechanical-design) templates, and site adaptations that keep the core set clean. [Request a quote](/request-quote) with your market list and prototype drawings.`,
  },
  {
    slug: "tenant-improvement-drawing-checklist-rollout",
    title: "Tenant Improvement Drawing Checklists for Fast Rollout Sites",
    template: "TECHNICAL_GUIDE",
    category: "franchise",
    tags: ["tenant improvement", "permit package", "checklist", "quick-service", "retail"],
    readMinutes: 8,
    featured: false,
    daysAgo: 22,
    excerpt: "TI permits for quick-service and retail rollouts stall on incomplete packages, not bad design. This is the full permit-package checklist we run on every site before anything gets submitted.",
    meta: { downloadable: "TI Permit Package Checklist" },
    bodyMdx: `## Why TI Packages Stall in Plan Check

Tenant improvement permits for quick-service restaurants and retail rollouts should be the simplest submittals in commercial construction. The shell exists. The use is established. And yet TI packages stall constantly — not because the design is wrong, but because the package is incomplete. A missing energy form, a load calculation that does not match the panel schedule, a plumbing fixture count with no code citation: any one of these buys you a correction cycle, and correction cycles are where rollout schedules go to die.

The fix is not heroic drafting. It is a checklist, applied the same way on every site, by everyone on the team.

## Mechanical Scope: What the Examiner Looks For

For a typical QSR or retail TI, the mechanical sheets need to tell the full story: demolition and new HVAC plans, equipment schedules with capacities and electrical characteristics, outside air calculations per the adopted mechanical code, and controls sequences clear enough that the examiner can verify compliance without guessing. If the space ties into a landlord or base-building system, show the tie-in points and note who owns what.

The single most common mechanical correction we see is an outside air calculation referencing the wrong code section — usually because the prototype was developed under a different code cycle than the site's jurisdiction. Check the adopted cycle first, on every site, before a single calculation is run.

## Electrical Scope: Make the Numbers Agree Everywhere

Electrical TI packages live or die on consistency. The load calculation, the panel schedules, the single-line diagram, and the equipment schedules must all tell the same story with the same numbers. Examiners cross-check: if the NEC Article 220 load calculation says 168 amps and the panel schedule totals 142, you are getting a correction letter.

Include lighting plans with fixture schedules, lighting power density calculations for energy compliance, receptacle and equipment plans coordinated against the kitchen equipment list, and fire alarm device layouts where the scope triggers them. For restaurants, confirm service size with the utility early — a service upgrade discovered during plan check can add months, not weeks.

## Plumbing Scope: Fixtures, Gas, and Grease

Plumbing TI scope centers on three things: fixture counts justified against the adopted plumbing code chapter, gas piping sizing with total connected load and confirmed meter capacity, and grease waste handling for food service — interceptor sizing calculations plus the waste layout serving it. Show water heater sizing and recovery, and do not forget backflow prevention where the jurisdiction requires it.

Restaurants answer to the health department as well as the building department. Coordinate the plumbing scope with health plan review so the two agencies never receive conflicting drawings — that conflict is a special kind of delay that no checklist can fix after the fact.


![Interior framing during a tenant build-out, where a tight drawing checklist keeps fast rollouts on schedule.](/generated/blog/inline/tenant-improvement-drawing-checklist-rollout-1.webp)


## The TI Permit Package Checklist

Run this on every site before anything is submitted. If an item does not apply, mark it N/A with a reason. Never leave it blank.

<Checklist items="Architectural background drawings current and coordinated with MEP scope;Demolition plans showing all MEP removals and capping points;New HVAC plans with equipment tags matching the schedule;Mechanical equipment schedule with capacities, voltages, and MCA/MOCP;Outside air calculations with the adopted code section cited;Electrical load calculations per NEC Article 220;Panel schedules matching the load calculation and single-line diagram;Single-line diagram showing service, distribution, and grounding;Lighting plans, fixture schedule, and lighting power density calculations;Plumbing fixture count calculations with code citations;Gas piping isometric with total connected load and meter size;Grease interceptor sizing calculations for food service;Water heater sizing and recovery calculations;Fire alarm device layout and riser where required;Energy compliance forms for the adopted state code;AHJ submittal forms, fee calculations, and required copies or uploads" />

## The Five Items Most Often Missing

| Missing item | Why examiners flag it |
|---|---|
| Energy compliance forms | State-specific and easy to forget when the prototype came from another state |
| Load calc vs. panel schedule mismatch | The numbers must agree across every sheet, no exceptions |
| Plumbing fixture count backup | A fixture count without a code citation is just an opinion |
| Grease interceptor sizing | Health and building departments both ask for it, independently |
| Deferred submittal list | Sprinkler and fire alarm scopes must be declared upfront, not discovered later |

## Handling Plan-Check Corrections

<Callout type="note">Never submit a partial response to a correction letter. Answer every comment by number, with a written response and a clouded revision on the drawings — even the ones you disagree with. Note the disagreement, cite the code section, and let the examiner rule. Silence reads as concession.</Callout>

Corrections are normal. What kills schedules is treating each correction letter as a surprise. Log every correction by theme, respond completely, and resubmit the package the way that AHJ wants it — some want full sets, some want only revised sheets.

Then feed the pattern back into the prototype. If three jurisdictions in a row flag the same detail, the prototype is wrong, not the examiners. That feedback loop is the difference between a rollout that gets faster with every site and one that makes the same mistakes fifty times.

We run this checklist on every TI site before submittal — [electrical](/services/electrical-design/electrical-system-design), [mechanical](/services/mechanical-design/mechanical-design), and [sprinkler](/services/fire-protection/sprinkler-layout-plan) scope coordinated into one permit package. [Request a quote](/request-quote) with your site plan and prototype.`,
  },
  {
    slug: "phasing-drawings-occupied-space-rollouts",
    title: "Phasing Drawings for Occupied-Space Rollouts",
    template: "STANDARD",
    category: "franchise",
    tags: ["phasing", "occupied space", "life safety", "construction sequencing"],
    readMinutes: 6,
    featured: false,
    daysAgo: 23,
    excerpt: "When the restaurant keeps serving lunch during its own kitchen conversion, the drawing set has two jobs: show the finished work, and show exactly how you get there without shutting the business down.",
    bodyMdx: `## The Store Has to Stay Open

The hardest rollout drawings we produce are not for new construction. They are for the restaurant that keeps serving lunch while its kitchen is converted, or the retail store that cannot miss a single weekend of sales during a full MEP upgrade. When the space stays occupied, the drawing set has to do two jobs at once: show the finished work, and show exactly how you get there without shutting the business down.

That second job is the phasing plan. Most drawing sets treat it as an afterthought — a single note that says "work to be phased" and leaves the rest to the field. It should be a first-class part of the package, drawn with the same care as the final condition.

## What a Phasing Set Actually Contains

A proper phasing set starts with a phasing floor plan for each phase — hatched or color-coded areas showing what is under construction, what stays open to the public, and the barrier between them. Each phase gets its own demolition extent, its own new-work scope, and, critically, its own MEP systems narrative: which panels stay live, which HVAC units serve the occupied zone, where temporary power and lighting come from.

Include a phasing schedule keyed to the plans, so the GC, the owner, and the inspector can all point at the same drawing and agree on what happens in week three. If the phases are not on the drawings, they do not exist as far as the AHJ is concerned — and the inspector will enforce the most conservative reading of whatever is ambiguous.

## Temporary MEP: The Drawing Nobody Wants to Do

Temporary systems are real engineering, and they belong on the drawings. Show temporary panel locations and feeder routing, temporary lighting levels for occupied areas and egress paths, temporary HVAC provisions or the sequencing that keeps existing units serving occupied zones, and temporary plumbing or sanitation where fixtures are taken offline.

Size it honestly. A restaurant kitchen running on a temporary 60-amp panel that was sketched as an afterthought is how you get a mid-project shutdown ordered by the inspector. We draw temporary MEP to the same standard as permanent work, because the AHJ will hold it to the same standard. The temporary panel schedule is not a courtesy — it is a permit document.


![A temporary partition dividing an active sales floor from renovation work, the phasing challenge in occupied spaces.](/generated/blog/inline/phasing-drawings-occupied-space-rollouts-1.webp)


## Life Safety During Construction

This is the section examiners read first and contractors skip at their peril. Every phase must maintain code-compliant egress: exit paths, exit signage, and emergency lighting that keep working while walls move and ceilings open up. Fire alarm and sprinkler coverage must be maintained or explicitly addressed — if sprinkler heads come down in a phase area, the drawings need to show interim protection or a fire watch arrangement the AHJ has accepted.

<Callout type="warning">Never assume the AHJ will accept a fire watch in place of sprinkler coverage. Get it in writing during pre-submittal and show the approved arrangement on the life-safety phasing plan. Verbal approval evaporates the day the inspector changes.</Callout>

Dust and fume separation between construction zones and occupied areas is not just courtesy either. In food service it is a health code issue, and the health inspector can stop work just as fast as the building inspector.

## Handing the Phases to the GC

Phasing drawings only work if the general contractor actually builds to them. Walk the phasing set with the GC before mobilization, confirm the sequence against their schedule, and make sure the temporary MEP tie-in points match what is really in the ceiling — field-verify, because as-builts lie.

When the inevitable mid-project change hits, revise the phasing plan first and the schedule second. The drawing is the contract for how the work happens around the open business. Occupied-space rollouts reward the team that draws the construction process, not just the finished product. Phase it on paper, and the store stays open.

Renovating around an open business? We draft phasing sets — temporary [electrical](/services/electrical-design/electrical-system-design) and [fire alarm](/services/electrical-design/fire-alarm-system-design) coverage, life-safety phasing plans, and the finished condition — as one coordinated package. [Request a quote](/request-quote) with your phasing schedule.`,
  },
  {
    slug: "site-adapt-handoff-prototype-set-local-architect",
    title: "The Site-Adapt Handoff: What the Local Architect Needs From Your Prototype Set",
    template: "EDITORIAL",
    category: "franchise",
    tags: ["prototype", "site adapt", "architect of record", "handoff"],
    readMinutes: 6,
    featured: false,
    daysAgo: 24,
    excerpt: "Your prototype set is not a permit set — it is a handoff package for a licensed professional taking legal responsibility for your work. Here is what that package should contain, what to leave out, and where handoffs usually break.",
    meta: { pullQuotes: ["The handoff is not a file transfer. It is the moment you ask another licensed professional to take legal responsibility for your work — and the package should show you understand what that costs them."] },
    bodyMdx: `## The Prototype Set Is Not a Permit Set

Here is the opinion that gets us in trouble at rollout conferences: your prototype drawing set is not a drawing set. It is a very expensive suggestion. We have received prototype packages that were beautiful — coordinated, detailed, clearly produced by talented people — and completely unusable for permitting, because nobody designed them for the handoff.

A prototype set has one real job: to give the local architect or engineer of record everything they need to produce a permit-ready, site-adapted set without reverse-engineering your intent. Most of them fail that job, and the failure costs weeks on every single site.

## What the Local Architect Actually Needs

The local architect of record is stamping these drawings. That means they are legally responsible for them, which means they need to understand every decision you made and why. Give them a complete MEP design narrative — the loads, the systems selected, and the reasoning behind the selection. Provide equipment selections with basis-of-design data, not just model numbers that may be discontinued or unavailable in their market. Include load calculations with the assumptions stated plainly, so they can verify rather than redo.

And keep a clean, explicit record of what is prototype-standard versus what must be site-verified. The best handoff packages we have seen read like an engineering story, not a pile of CAD files. The worst ones read like a puzzle the local team is expected to solve under a permit deadline.

## What to Leave Out

Just as important is what does not belong in the handoff. Do not ship unresolved coordination problems labeled "field verify" — that is not delegation, it is abdication, and the local architect knows the difference immediately. Do not include jurisdiction-specific forms or calculations from the last site; they create the false impression that the work is already done.

And do not bury the prototype's known compromises. Every prototype has them — the panel sitting at ninety-two percent loaded, the duct run that only works if the ceiling is exactly nine feet, the plumbing layout that assumes a fixture the local code may not allow. Document them plainly. A local architect who discovers your compromises on their own will trust nothing else in the package.

> The handoff is not a file transfer. It is the moment you ask another licensed professional to take legal responsibility for your work — and the package should show you understand what that costs them.


![Drawings unrolled on site, the handoff moment when a prototype set meets local conditions.](/generated/blog/inline/site-adapt-handoff-prototype-set-local-architect-1.webp)


## Where Handoffs Usually Break

In our experience, handoffs break in three predictable places. First, the gray zone of responsibility: nobody wrote down who owns the site-specific structural coordination, the utility service applications, or the energy compliance forms, so everyone assumes someone else is doing it — until the permit is due.

Second, the CAD standards collision: the prototype arrives in a layering and xref structure the local firm cannot use, and two weeks burn while drafters translate files instead of designing buildings. Agree on deliverable formats before the first site, not during it.

Third, silence after delivery: the prototype team ships the package and disappears, so the first round of plan-check corrections lands on a local architect with no access to the people who made the original decisions. All three failures are preventable with a written handoff protocol — which, tellingly, almost nobody has.

## A Better Handoff, in Practice

Write the protocol before the first site. Name the deliverables, the file formats, the decision log, and the support window after delivery — including who answers the local architect's questions during plan check and how fast. Treat the local architect as a partner absorbing your liability, not a vendor executing your drawings.

Get this right and site adaptation becomes the fastest part of your rollout instead of the part everyone dreads. Get it wrong and you will pay for the same missing information fifty times, in fifty cities, with fifty different architects wondering why the prototype team could not be bothered to explain itself.

We build handoff-ready prototype sets: complete MEP narratives, [electrical](/services/electrical-design/electrical-system-design) and [mechanical](/services/mechanical-design/mechanical-design) drawings to your CAD standard, and a clean record of what is prototype-standard versus site-variable. [Request a quote](/request-quote) to scope your rollout program.`,
  },
{
    slug: "ductwork-layout-drawings-load-calc-to-coordinated-plan",
    title: "Ductwork Layout Drawings: From Load Calc to Coordinated Plan",
    template: "TECHNICAL_GUIDE",
    category: "hvac-plumbing",
    tags: ["ductwork", "hvac design", "permit drawings"],
    discipline: "hvac",
    readMinutes: 8,
    featured: false,
    daysAgo: 9,
    excerpt: "Load calculations give you CFM values. This guide covers how we translate those numbers into buildable, coordinated ductwork layouts — sizing, takeoffs, diffusers, and clash-free routing.",
    bodyMdx: `A load calculation tells you how much air each room needs. It does not tell the contractor where the trunk runs, how it gets past a steel beam, or which takeoff feeds which diffuser. That translation — from CFM values to a buildable duct layout — is where most permit delays and field change orders originate. We draft ductwork layouts every week, and the pattern is consistent: the calculations are clean, but the translation onto the plan is where information gets lost.

## Start With the Numbers That Matter

Before routing a single duct, freeze the room-by-room airflow schedule: supply CFM, return CFM, and outdoor-air CFM for every space, taken from the Manual J or ASHRAE-based load report. Show it on the plan or on a dedicated schedule sheet — reviewers check diffuser totals against it, and the TAB contractor balances against it. Include the design conditions behind the numbers (indoor setpoints and ASHRAE outdoor design temperatures) so a reviewer can spot a schedule borrowed from a different climate zone. If the load numbers change mid-project, the duct plan changes with them; lock the schedule first.

## Size and Label Every Segment

Size trunks by the equal-friction method — typically 0.08 to 0.10 inches w.g. per 100 feet for low-velocity commercial systems — or by static regain for long runs with many takeoffs. Label every segment with both size and CFM: a size without CFM cannot be verified, and a CFM without a size cannot be built. Hold main velocities in the 1,000 to 1,500 fpm range to control noise and pressure loss, and drop branch velocities near diffusers. Draw fittings to scale — radius elbows with turning vanes where tight turns are unavoidable, and transitions that actually fit the available depth. A fitting drawn as a sketch is a fitting the shop will guess at.


![Spiral ductwork with hangers in an open ceiling, the coordinated result of a clean duct layout.](/generated/blog/inline/ductwork-layout-drawings-load-calc-to-coordinated-plan-1.webp)


## Takeoffs, Diffusers, and Return Paths

Every takeoff gets a location, a size, and a balancing damper — not just at the air handler, but at each branch, so the system can actually be balanced. The diffuser schedule should list neck size, throw, NC rating, and mounting type for every outlet; reviewers increasingly check NC ratings in offices and classrooms. Show return paths explicitly: ducted returns, transfer grilles, or door undercuts noted on the plan. Unplanned return air is the most common comfort complaint we see traced back to drawings — rooms starved of return go positive, doors whistle, and nobody can find the cause on paper.

## Coordinate Before You Call It Done

Ductwork shares the ceiling cavity with structure, plumbing, sprinklers, and lighting. On every layout we verify: bottom-of-steel and beam depths against duct depths plus insulation; sprinkler mains and waste piping crossing the trunk; diffuser locations aligned with the reflected ceiling plan and light fixtures; fire and smoke dampers at every rated partition, with access panels noted. A trunk that fits on the plan but not under a beam becomes a field reroute — draw the critical sections or do not run the duct there.

<Checklist items="Room-by-room supply, return, and outdoor-air CFM schedule shown;Every duct segment labeled with size and CFM;Sizing method and friction rate noted (equal friction or static regain);Diffuser schedule with neck size, throw, and NC rating;Balancing damper at each branch takeoff;Return-air paths shown and coordinated;Fire and smoke dampers at rated partitions with access panels;Critical sections drawn where ducts pass beams or congested zones" />

Our [HVAC design](/services/mechanical-design/hvac-design) service carries the load report straight onto the drawings — sized ductwork, labeled segments, diffuser schedules, and coordinated routing — backed by our [HVAC heating and cooling load](/services/calculations-reports/hvac-heating-cooling-load) calculation. [Request a quote](/request-quote) with your floor plans.`,
    meta: { downloadable: "Ductwork Layout Checklist" },
  },
  {
    slug: "plumbing-riser-diagrams-what-goes-on-the-sheet",
    title: "Plumbing Riser Diagrams: What Goes on the Sheet",
    template: "STANDARD",
    category: "hvac-plumbing",
    tags: ["plumbing", "riser diagram", "permit drawings"],
    discipline: "plumbing",
    readMinutes: 6,
    featured: false,
    daysAgo: 10,
    excerpt: "The riser diagram is the sheet the reviewer reads first. Here is the full anatomy of a permit-ready plumbing riser — and the omissions that slow permits down.",
    bodyMdx: `The plumbing riser diagram is the sheet the plan reviewer reads first and the installer studies longest. It shows the entire drainage, waste, vent, and water distribution system in one vertical view — every stack, every branch, every size. A floor plan shows where fixtures are; the riser proves the system behind them works. When risers are thin or missing, review comments multiply.

## The Anatomy of a Permit-Ready Riser

A complete riser shows the DWV side and the water side together. On the drainage side: each soil and waste stack with pipe sizes, horizontal branches with fixture connections, vent stacks and revent connections, and cleanouts at the base of stacks and at required intervals. On the water side: cold, hot, and hot-water recirculation risers with sizes, the water heater or heating plant connection, pressure-regulating valves where street pressure requires them, and backflow devices at hose bibbs, irrigation, and equipment connections. Every fixture appears with its water-supply fixture units (WSFU) per the adopted IPC or UPC, and cumulative totals are carried down each stack segment so the reviewer can verify sizing without doing your math.

## What the Reviewer Is Actually Checking

| Reviewer check | What must appear on the sheet |
|---|---|
| Fixture unit totals | WSFU per fixture with cumulative totals at each stack segment |
| Vent sizing | Vent stack sizes, revent connection points, trap-to-vent distances |
| Cleanout access | Cleanouts at stack bases and horizontal direction changes |
| Water pipe sizing | Pipe sizes with the fixture-unit or pressure-loss basis noted |
| Backflow protection | Device type and location at every cross-connection point |
| Materials | Pipe and fitting material schedule for DWV and water piping |


![Vertical riser pipes with valves and fittings, the systems a plumbing riser diagram documents.](/generated/blog/inline/plumbing-riser-diagrams-what-goes-on-the-sheet-1.webp)


## Keep the Riser and the Plan in Sync

The riser and the floor plans are two views of one system, and they must agree exactly: fixture counts, pipe sizes at connections, and cleanout locations. Our drafting pass always ends with a cross-check — count fixtures on the plan, count them on the riser, and reconcile before the set goes out. On multi-story buildings, carry the same discipline floor to floor: a stack that changes size between levels needs the transition fitting drawn and the reason noted. Consistency across sheets is what makes a reviewer trust the set.

## Common Omissions That Slow Permits

The comments we see most often are avoidable: island-sink vents missing where the local amendment prohibits air-admittance valves; cleanouts shown on the floor plan but absent from the riser; no pipe material schedule, leaving the reviewer to guess; temperature-and-pressure relief discharge termination not shown or not piped to an approved location; expansion tanks missing on water heaters in closed systems; and grease-interceptor sizing notes absent on restaurant work. Each one is a one-line fix on the drawing and a two-week delay if it becomes a review comment.

<Callout type="tip">Draw the riser from the same fixture count as the floor plan. Nothing fails review faster than a riser showing six water closets on a floor where the plan shows eight — the reviewer stops trusting the whole set.</Callout>

We draft permit-ready risers as part of our [plumbing design](/services/mechanical-design/plumbing-design) service — DWV and water sides together, fixture-unit totals carried down every stack — coordinated within the full [mechanical](/services/mechanical-design/mechanical-design) set. [Request a quote](/request-quote) with your floor plans and fixture schedule.`,
  },
  {
    slug: "gas-piping-drawings-sizing-tables-riser-diagram-ifgc",
    title: "Gas Piping Drawings: Sizing Tables and Riser Diagrams per IFGC",
    template: "TECHNICAL_GUIDE",
    category: "hvac-plumbing",
    tags: ["gas piping", "IFGC", "permit drawings"],
    discipline: "plumbing",
    readMinutes: 8,
    featured: false,
    daysAgo: 11,
    excerpt: "Per the IFGC, gas pipe sizing is a calculation — and the drawing set has to show its work. How we document the longest-run method, demand tables, and riser diagrams so reviewers can verify every size.",
    bodyMdx: `Fuel-gas drawings fail review for one consistent reason: the reviewer cannot verify the pipe sizes. The plan shows a 1-inch line running to a rooftop unit, but without the developed length, the connected load, and the sizing table behind it, that 1 inch is just a guess on paper. Per the IFGC, gas pipe sizing is a calculation, and the drawing set has to show its work.

## The Longest-Run Method, On the Sheet

IFGC Section 402 sizing starts with the longest run — the developed length from the meter to the most remote appliance outlet, including equivalent lengths for fittings. Show that length on the drawings: dimension the run on the plan or state the total equivalent length in the sizing notes, and cite the table used (for example, IFGC Table 402.4(2) for low-pressure natural gas at 0.5-inch w.c. pressure drop). Size each segment for the load downstream of it, and label every segment with size and the BTUH it carries. Note the supply pressure, the pressure-drop basis, and the pipe material and schedule — typically Schedule 40 steel for interior commercial gas. When any of these inputs is missing, the reviewer cannot reproduce your sizes, and the comment writes itself.

## Build the Demand Table

Every gas drawing needs an appliance demand table: equipment tag, location, and input rating in BTUH, with a total connected load at the bottom. Compare that total against the meter capacity and state the result on the sheet — if the utility must upsize the meter, say so now, not after rough-in. Size conservatively: the IFGC works from full connected load for most commercial applications, so do not apply diversity factors the code does not grant. The table is also the coordination record — when the mechanical schedule changes a rooftop unit, the gas table tells you exactly which segments need resizing.

| Segment | From to To | Developed length (ft) | Load served (BTUH) | Pipe size |
|---|---|---|---|---|
| G-1 | Meter to Tee A | 85 | 1,250,000 | 2 in. |
| G-2 | Tee A to RTU-1 | 40 | 400,000 | 1-1/4 in. |
| G-3 | Tee A to WH-1 | 55 | 199,000 | 1 in. |


![A gas meter and shutoff valve on yellow-jacketed piping, the service entry every gas drawing must detail.](/generated/blog/inline/gas-piping-drawings-sizing-tables-riser-diagram-ifgc-1.webp)


## Shutoffs, Regulators, and the Riser Diagram

Show a shutoff valve at each appliance — accessible, within 6 feet, per IFGC 409.5 — plus the main service shutoff location. Draw the riser diagram from the meter through every branch to each appliance, with sizes labeled; the riser is where the reviewer traces your longest run. Show line regulators with vent piping routed to the outdoors where required, sediment traps at equipment connections, and seismic shutoff valves where the jurisdiction requires them. Add the bonding note: gas piping bonded per IFGC 310.1 and NEC 250.104. These details are small on the sheet and large in the field — the inspector will check every one.

<Checklist items="Longest-run developed length shown with fitting allowances;Appliance demand table with input BTUH and total connected load;Every segment labeled with size and BTUH served;Meter capacity verified against total connected load;Shutoff at each appliance, within 6 ft and accessible;Regulator vent piping routed to outdoors;Sediment traps at equipment connections;Bonding note per IFGC 310.1 included" />

Our [plumbing design](/services/mechanical-design/plumbing-design) service documents the full gas scope — longest-run sizing, demand tables, and riser diagrams per the IFGC — as part of the coordinated [mechanical](/services/mechanical-design/mechanical-design) set. [Request a quote](/request-quote) with your appliance list and floor plan.`,
    meta: { downloadable: "Gas Piping Drawing Checklist" },
  },
  {
    slug: "ashrae-621-ventilation-compliance-on-drawings",
    title: "ASHRAE 62.1 Ventilation: Showing Compliance on Your Drawings",
    template: "STANDARD",
    category: "hvac-plumbing",
    tags: ["ASHRAE 62.1", "ventilation", "code compliance"],
    discipline: "hvac",
    readMinutes: 7,
    featured: false,
    daysAgo: 12,
    excerpt: "The AHJ wants to see the ASHRAE 62.1 ventilation math on the drawings, not in a buried report. What belongs in the rate table, which occupancy inputs get scrutinized, and the notes that prevent comments.",
    bodyMdx: `ASHRAE 62.1 sets the ventilation math. The AHJ wants to see that math on the drawings — not buried in a report nobody opens. A ventilation compliance sheet with the rate table, the occupancy inputs, and the calculation notes answers the reviewer's questions before they become comments.

## The Ventilation Rate Table

Build a zone-by-zone table the reviewer can audit in minutes. For each zone show: occupancy category, zone floor area (Az), design zone population (Pz), people outdoor-air rate (Rp) and area outdoor-air rate (Ra) from ASHRAE 62.1 Table 6.2.2.1, and the resulting breathing-zone airflow Vbz = Rp x Pz + Ra x Az. For multiple-zone recirculating systems, show the system ventilation efficiency (Ev) calculation and the resulting system outdoor airflow (Vot) — the critical zone drives the result, so identify it. Include exhaust rates from Table 6.5 for spaces like janitor closets, copy rooms, and kitchens. State the 62.1 edition used; rates and requirements shift between editions, and the reviewer will check against the adopted one.

| Zone | Occupancy category | Az (sq ft) | Pz | Rp | Ra | Vbz (cfm) |
|---|---|---|---|---|---|---|
| Open office | Office space | 2,400 | 24 | 5 | 0.06 | 264 |
| Conference | Conference/meeting | 450 | 22 | 5 | 0.06 | 137 |


![An outdoor air intake louver, the ventilation hardware ASHRAE 62.1 compliance starts with.](/generated/blog/inline/ashrae-621-ventilation-compliance-on-drawings-1.webp)


## Occupancy Inputs the Reviewer Expects

Two inputs draw the most scrutiny. First, Pz: state whether the population comes from the owner's program or from the Table 6.2.2.1 default occupant densities — and use the same number everywhere. Second, Az: the net occupiable floor area from the architectural plan, not the gross building area. The single most common comment we help resolve is a ventilation table whose occupant count does not match the occupant load on the life-safety plan. Reconcile the two before submitting; if they legitimately differ, add a note explaining why.

## Calculation Notes That Prevent Comments

Place a short general-note block next to the table, not buried in the specifications: the 62.1 edition and the compliance path; outdoor-air intake locations with minimum separation distances per Section 5; demand-controlled ventilation where required — 62.1 calls for DCV in densely occupied spaces over 500 square feet, so flag those zones; and energy-recovery triggers where the adopted energy code requires them. Notes are cheap; review cycles are not.

<Callout type="note">Keep the ventilation table, the diffuser schedule, and the equipment schedule in agreement. A Vot of 1,200 cfm on the compliance sheet and an outdoor-air intake sized for 800 cfm on the mechanical plan is a guaranteed comment.</Callout>

We put the 62.1 math on the drawings as part of our [HVAC design](/services/mechanical-design/hvac-design) service — rate tables, occupancy inputs, and compliance notes — backed by the [HVAC heating and cooling load](/services/calculations-reports/hvac-heating-cooling-load) calculation. [Request a quote](/request-quote) with your floor plans and occupancy program.`,
  },
{
    slug: "title-24-iecc-lighting-control-drawings",
    title: "Title 24 and IECC Lighting Controls: What to Show on Drawings",
    template: "TECHNICAL_GUIDE",
    category: "lighting",
    tags: ["lighting controls", "Title 24", "IECC", "code compliance"],
    discipline: "lighting",
    readMinutes: 8,
    featured: false,
    daysAgo: 17,
    excerpt: "Lighting control drawings are where energy code compliance lives or dies. What Title 24 and the IECC require on the plans — zoning, sensors, and the documentation that passes review.",
    bodyMdx: `## Why Controls Drawings Get Flagged

Ask a plan reviewer what slows down lighting submittals and the answer is rarely the fixtures. It is the controls. Title 24 Part 6 and the IECC both treat lighting controls as a first-class compliance item, and both require the drawings to prove it. A lighting plan with fixtures but no control zoning, no sensor schedule, and no sequence narrative forces the reviewer to guess — and reviewers do not guess in your favor.

We draw lighting control plans as their own layer of information, coordinated with the architectural reflected ceiling plan. Here is what goes on them.

## Control Zoning on the Plan

Every controlled zone gets a boundary on the drawing: daylight zones along the perimeter and under skylights, occupancy-sensor zones in offices and support spaces, and manual-control zones where the code requires them. We draw zone boundaries as closed polylines with a zone tag that matches the sequence table — Z-L1 for the first daylight zone, Z-O3 for an occupancy zone, and so on. The tag is the link between the plan, the schedule, and the narrative. Without it, the three documents drift apart by the second revision.

Title 24 is specific about what each zone must do: multi-level daylighting controls in primary and secondary sidelit zones, automatic shutoff in most occupancies, and demand-responsive controls above certain load thresholds. The IECC has parallel requirements with its own thresholds. We note the applicable section next to each zone type so the reviewer can verify without opening the code book.

## Sensors, Switches, and the Schedule

The device schedule is the second half of the package. Every occupancy sensor, vacancy sensor, daylight sensor, and wall station appears with its type, coverage pattern, mounting height, and the zone it serves. Coverage patterns matter: an ultrasonic sensor drawn in the middle of a private office with a coverage radius that ignores the partition layout is a design error the reviewer will catch. We verify sensor coverage against the actual room geometry, not the open-plan ideal.

Manual controls get the same rigor. Title 24 requires manual area controls that allow occupants to reduce lighting, and the drawings must show where those controls are and what they switch. A wall station symbol with no zone assignment is just decoration.


![A wall-mounted lighting control keypad glowing at dusk, the control hardware Title 24 drawings must show.](/generated/blog/inline/title-24-iecc-lighting-control-drawings-1.webp)


## The Sequence of Operations

The sequence narrative is a plain-language table: for each zone, what happens on occupancy, on vacancy, on daylight contribution, and on time-clock events. A daylight zone dims to 40 percent when photosensor readings exceed the setpoint. An open office shuts off 20 minutes after vacancy. The sequence table is also what the commissioning agent tests against, so we write it to be testable — every row states a sensor input, a control action, and the resulting light level.

<Callout type="note">Title 24 acceptance testing is not optional. Our drawings include an acceptance-test note block listing the required functional tests per Part 6, because the inspector will ask for the completed forms before sign-off.</Callout>

## Documentation That Prevents Corrections

Beyond the plans, we assemble the compliance forms the AHJ expects: the lighting power density calculations with the allowed-versus-proposed comparison, the control credits claimed, and the mandatory-measures checklist. These ride with the drawing set on the first submittal. The most common correction we help resolve is a control drawing that is technically correct but unaccompanied by the forms — the reviewer cannot approve what they cannot document.

<Checklist items="Control zone boundaries drawn and tagged on the reflected ceiling plan;Daylight zones shown at perimeter and skylights with multi-level control noted;Occupancy and vacancy sensor schedule with coverage patterns and mounting heights;Manual area controls shown with zone assignments;Sequence of operations table written to be testable;Lighting power density calculations with allowed vs proposed;Acceptance-test note block per Title 24 Part 6;Compliance forms packaged with the first submittal, not added later" />

Our [lighting design](/services/electrical-design/lighting-design) service drafts the full controls package — zoning, sensor schedules, and testable sequences — and our [photometric design](/services/electrical-design/photometric-design) proves the light levels behind it. [Request a quote](/request-quote) with your reflected ceiling plans.`,
    meta: { downloadable: "Lighting Controls Drawing Checklist" },
  },
  {
    slug: "egress-lighting-drawings-what-reviewers-look-for",
    title: "Egress Lighting Drawings: What Reviewers Look For",
    template: "STANDARD",
    category: "lighting",
    tags: ["egress lighting", "life safety", "IBC", "NEC 700"],
    discipline: "lighting",
    readMinutes: 6,
    featured: false,
    daysAgo: 18,
    excerpt: "Egress lighting is life safety drawn on a plan. The foot-candle minimums, battery and generator sources, and coordination details reviewers check before they approve.",
    bodyMdx: `## The Life-Safety Layer of the Lighting Plan

Egress lighting is the one part of the lighting drawings where the reviewer's job is not aesthetics or energy — it is keeping people alive in a dark building. The IBC and NEC Article 700 set hard numbers, and the drawings must prove every one of them. We draw egress lighting as a distinct layer over the general lighting plan so the reviewer can read the life-safety story without distraction.

## Foot-Candle Minimums on the Egress Path

IBC Section 1008 requires a minimum of 1 foot-candle at the walking surface along the means of egress, with an average of 1 foot-candle and a maximum-to-minimum uniformity ratio that keeps the path readable. The initial illumination may decline to an average of 0.6 foot-candles at the end of the required emergency duration. We show photometric calculations along every egress path — corridors, stairs, exit discharge — with values at the walking surface, not at the ceiling. A photometric plan that reports fixture lumens without path-level values answers a question nobody asked.

Stairs get special attention: every step needs the minimum, and handrail-adjacent fixtures must not create blinding contrast. We coordinate stair lighting with the architectural sections so the reviewer sees the same geometry we calculated from.


![An emergency egress light glowing in a dark corridor, the life-safety fixture reviewers trace on plans.](/generated/blog/inline/egress-lighting-drawings-what-reviewers-look-for-1.webp)


## Sources: Battery Packs, Inverters, and Generators

NEC 700.12 lists the permitted emergency sources, and the drawings must show which one serves each fixture. Unit equipment with integral batteries is the simplest to document: each fixture gets a battery-pack symbol and a note stating the 90-minute rating. Central inverters and generators serve grouped fixtures, and the drawings must show the circuiting back to the source with the transfer equipment identified.

The 90-minute duration is non-negotiable. Our fixture schedule carries a column for the emergency source and duration, and every egress fixture has an entry. A fixture on the egress path with a blank source column is a correction waiting to happen.

## Coordination With Fire Alarm and Architecture

Egress lighting does not stand alone. Exit signs are part of the same system and appear on the same sheets, circuited to the emergency source. We coordinate fixture locations with the reflected ceiling plan — a recessed emergency fixture drawn over a sprinkler head or a duct is a field conflict the reviewer will spot. Fire alarm notification appliances share the corridors, so we check candela ratings and fixture spacing together rather than letting two disciplines collide in the ceiling.

<Callout type="tip">Show the exit discharge path on the site plan, not just the building plans. Reviewers check that emergency illumination continues from the exit door to the public way, and that segment is the most commonly missed.</Callout>

We draw the egress layer as part of our [lighting design](/services/electrical-design/lighting-design) service — path photometrics, emergency sources, and exit signage — coordinated with the building's [fire alarm system](/services/electrical-design/fire-alarm-system-design). [Request a quote](/request-quote) with your floor plans.`,
  },
  {
    slug: "dark-sky-compliance-site-lighting-ordinances",
    title: "Dark-Sky Compliance: Drawing Site Lighting for Local Ordinances",
    template: "STANDARD",
    category: "lighting",
    tags: ["dark sky", "site lighting", "light pollution", "ordinances"],
    discipline: "lighting",
    readMinutes: 7,
    featured: false,
    daysAgo: 19,
    excerpt: "Local dark-sky ordinances are stricter than the energy code and vary city by city. How we draw site lighting plans — cutoffs, curfews, and photometrics — that satisfy the strictest local rules.",
    bodyMdx: `## The Ordinance Is Stricter Than the Code

The energy code limits how much light you use. The dark-sky ordinance limits where it goes. More than a thousand US municipalities now enforce some form of outdoor lighting regulation, and the strict ones go well beyond the IECC: full-cutoff fixtures, maximum initial foot-candles at the property line, curfew dimming after business hours, and color temperature caps. We have seen identical site lighting packages approved in one city and rejected in the next because the second city capped correlated color temperature at 3000K and nobody checked.

The first step on every site lighting project is reading the actual municipal ordinance — not the state energy code, not the IES recommendations, the local law. Ordinances change without the fanfare of a code cycle, so we verify the current text on every project.

## Full-Cutoff Fixtures and BUG Ratings

The workhorse requirement is full cutoff: no light emitted above the horizontal plane. On the drawings, every site fixture gets a BUG rating (backlight-uplight-glare) from its IES file, and we schedule the U component explicitly — U0 is the target in strict jurisdictions. A fixture schedule with lumens and wattage but no BUG rating tells the dark-sky reviewer nothing.

Mounting height and tilt matter as much as the fixture. A full-cutoff shoebox tilted five degrees to throw light farther is no longer full cutoff, and we note zero-tilt installation on the details. House-side shields get drawn where fixtures sit near residential property lines.


![A full-cutoff fixture against a starry sky, the dark-sky-friendly hardware local ordinances require.](/generated/blog/inline/dark-sky-compliance-site-lighting-ordinances-1.webp)


## Property-Line Photometrics

The photometric plan is the centerpiece of the submittal. We calculate illuminance on a grid that extends past the property line, with values reported at the line itself — most ordinances set a maximum, often 0.5 foot-candles or less at residential boundaries, and some require zero measurable light. The calculation grid must be fine enough to catch hotspots between poles; a coarse grid hides the violations the reviewer's software will find.

> A photometric plan that stops at the property line is incomplete. The ordinance regulates what crosses the line, so the calculation has to show it.

## Curfews, Dimming, and Controls

Many ordinances impose lighting curfews: after closing or after a set hour, site lighting must dim to a fraction of full output or shut off entirely except for security lighting. Our drawings show the control zones and the curfew schedule — which fixtures dim, to what level, at what time — with the sequence tied to the time-clock or astronomical controls on the plan. Motion-sensor override for security zones is drawn and noted where the ordinance permits it.

## What We Put on the Plan Set

<Checklist items="Current municipal ordinance verified and section cited on the cover sheet;Every site fixture scheduled with BUG rating, U0 uplight where required;Zero-tilt mounting noted on details; house-side shields where adjacent to residential;Photometric grid extending past property lines with values at the line;Maximum property-line foot-candles verified against the ordinance;Curfew dimming schedule with zones, levels, and times;Color temperature verified against local caps;Cut sheets with IES files packaged with the submittal" />

Our [photometric design](/services/electrical-design/photometric-design) service proves dark-sky compliance — property-line grids, BUG ratings, and curfew schedules — drawn on the [site electrical plan](/services/electrical-design/site-electrical-plan) so the whole exterior reads as one submittal. [Request a quote](/request-quote) with your site plan and the local ordinance.`,
  },
  {
    slug: "fixture-schedule-details-that-prevent-rfis",
    title: "Fixture Schedules and Details That Prevent RFIs",
    template: "LISTICLE",
    category: "lighting",
    tags: ["fixture schedule", "lighting details", "RFIs", "construction documents"],
    discipline: "lighting",
    readMinutes: 6,
    featured: false,
    daysAgo: 20,
    excerpt: "Most lighting RFIs trace back to a fixture schedule that left questions unanswered. The columns, details, and mounting notes that keep contractors from having to ask.",
    bodyMdx: `Most lighting RFIs are not caused by complicated design. They are caused by a fixture schedule that left the contractor guessing: a type with no mounting detail, a control note that contradicts the plan, a lumen package that does not match the photometrics. Every RFI costs days, and most are preventable on the drawing. Here is what a complete fixture schedule and detail package looks like.

## 1. A Type for Every Fixture, and Nothing Without a Type

Every luminaire on the plans carries a type designation — A1, B2, X1 — and every type appears exactly once in the schedule. The reverse must also hold: no schedule row without fixtures on the plan. Orphan types and typeless fixtures are the two most common schedule errors, and both generate RFIs before the first conduit is run.

## 2. Description Columns That Actually Describe

Manufacturer, catalog number, lamp or LED source, delivered lumens, input watts, color temperature, CRI, voltage, and finish. Each column answers a question the contractor would otherwise ask. Delivered lumens — not lamp lumens — because the photometric calculation was built on delivered values. Input watts including the driver, because the energy compliance forms use that number. When any column is blank, the contractor substitutes their judgment for yours.

## 3. Mounting Information on Every Row

Recessed, surface, pendant, wall, pole — and the specifics: pendant length or stem kit, recessed housing type for the ceiling construction, pole height and base detail reference. Mounting is where the fixture meets the architecture, and it is the detail most often left to "coordinate in field." We reference a mounting detail number on every row that needs one.


![A pendant fixture with its mounting canopy, the kind of detail a complete fixture schedule nails down.](/generated/blog/inline/fixture-schedule-details-that-prevent-rfis-1.webp)


## 4. Controls Assignment per Fixture Type

Each schedule row states its control: switched, dimmed, occupancy-sensor controlled, daylight-zone assignment. The assignment must match the control zoning on the reflected ceiling plan exactly — a fixture type shown in a daylight zone on the plan but scheduled as "switched" is a contradiction the contractor cannot resolve without an RFI.

## 5. Emergency and Egress Designation

Fixtures serving the egress path carry their emergency source in the schedule: integral battery pack with 90-minute rating, central inverter circuit, or generator-backed emergency circuit. Exit signs get their own rows with the same treatment. The life-safety reviewer reads this column first.

## 6. Details That Match the Schedule

For every mounting condition, a detail: pendant mounting with seismic bracing where required, recessed housing in rated ceilings with the fire rating maintained, pole base with anchor bolts and handhole, wall-pack with junction box coordination. Each detail carries the fixture types it applies to. A schedule that references detail 5/E-601 must find detail 5 on sheet E-601.

## 7. The Coordination Pass Before Issue

Before the set goes out, we run the schedule against the plans one final time: every type on the plan in the schedule, every control assignment matching the zoning, every detail reference resolving to a real detail, every lumen value matching the photometrics. Thirty minutes of checking prevents three weeks of RFIs. The schedule is a contract document — treat it like one.

Our [lighting design](/services/electrical-design/lighting-design) sets ship with schedules built this way — every type on the plan in the schedule, controls matching the zoning, details resolving — coordinated within the full [electrical system](/services/electrical-design/electrical-system-design) package. [Request a quote](/request-quote) with your fixture selections.`,
  },
  {
    slug: "commercial-hvac-design-requirements-2026-usa",
    title: "2026 HVAC Design Requirements for Commercial Buildings in the USA",
    excerpt: "Commercial HVAC design in 2026 sits at the intersection of ASHRAE 90.1-2022, the 2024 IECC, and local amendments. Here is exactly what your permit drawings must prove to clear plan review.",
    template: "TECHNICAL_GUIDE",
    category: "hvac-plumbing",
    tags: ["HVAC", "commercial", "ASHRAE 90.1", "IECC"],
    discipline: "hvac",
    readMinutes: 8,
    featured: false,
    daysAgo: 1,
    bodyMdx: `Designing HVAC for a commercial building in the United States in 2026 is no longer just about keeping occupants comfortable. Energy codes have tightened, ventilation expectations have risen, and plan reviewers now ask for documented calculations behind nearly every equipment selection. A permit set that would have sailed through review five years ago can come back covered in redlines today — not because the design is wrong, but because the drawings do not prove it is right.

This guide covers the requirements that actually shape commercial HVAC design now: the energy code baseline, ventilation rates, equipment efficiency minimums, mandatory controls, and the documentation reviewers expect on the drawings. Whether you are an architect coordinating consultants or a contractor pricing a design-build job, these are the rules your permit set will be judged against.

## The code baseline: ASHRAE 90.1-2022 and the 2024 IECC

The first thing to pin down on any commercial project is which energy code governs, because it controls everything downstream. ASHRAE 90.1-2022 is the current edition of the national energy standard for commercial buildings, covering envelope (Section 5), mechanical systems (Section 6), and power and lighting (Section 9). The 2024 IECC's commercial provisions point directly to ASHRAE 90.1 as the primary compliance path, so in practice the two documents work as a pair.

Adoption is uneven. As of 2026, most U.S. jurisdictions enforce either ASHRAE 90.1-2019 or 90.1-2022, frequently with state or city amendments layered on top — California's Title 24 being the most demanding example. Never assume the national edition applies verbatim. The compliance path also matters: the prescriptive path demands that every component meet its minimum, while the Energy Cost Budget method trades efficiency between systems against a modeled baseline. Your drawings must declare which path you used, because the reviewer checks against it.

Running alongside the energy code is the International Mechanical Code (IMC), which governs safe installation rather than efficiency — refrigerant piping, condensate disposal, combustion air, duct construction, and equipment clearances. A design can satisfy 90.1 and still fail review on IMC grounds, so both codes need a seat at the drafting table from day one.

## Ventilation and indoor air quality: ASHRAE 62.1

Ventilation is where many commercial designs quietly fail, because the required outdoor airflow is larger than most people expect and it becomes a direct heating and cooling load. ASHRAE 62.1's Ventilation Rate Procedure calculates the breathing-zone outdoor airflow for each space as the sum of a per-person component and a per-area component: Vbz equals Rp times Pz plus Ra times Az. For a typical office, that works out to 5 cfm per person plus 0.06 cfm per square foot — and densely occupied spaces like conference rooms, classrooms, and gyms land far higher.

Multi-zone systems add another layer. The system ventilation efficiency factor, Ev, corrects for the fact that air distribution is never perfect in a VAV system serving zones with different ventilation needs; the zone with the highest ventilation fraction drives outdoor air intake for the whole system. Get this calculation wrong and you either under-ventilate (a health and code problem) or massively over-ventilate (an energy and equipment-sizing problem).

Do not forget exhaust. Restrooms, janitor closets, kitchens, and parking areas carry dedicated exhaust rates under 62.1 and the IMC, and that exhaust air has to be made up from somewhere — usually as additional outdoor air through the HVAC system.

> Every cubic foot per minute of outdoor air is a heating and cooling load. Ventilation air is never free — account for it in your load calculations or it will account for itself in your callbacks.

## Equipment efficiency minimums

ASHRAE 90.1 Section 6.8 publishes minimum efficiency tables for virtually every category of commercial HVAC equipment, organized by equipment type and capacity range. Depending on what you are specifying, the governing metric may be EER, IEER, SEER2, HSPF2, or COP — and since the DOE efficiency updates that took effect in 2023, residential-scale equipment is rated in SEER2, EER2, and HSPF2 under tougher test procedures. An older cut sheet quoting legacy SEER does not demonstrate compliance.

Your equipment schedule is the reviewer's proof. It must list each unit's rated efficiency at AHRI conditions alongside the 90.1 table minimum it satisfies. Generic schedules that show tons and voltage but no efficiency ratings are one of the most common sources of review comments.

Sizing discipline matters too. Section 6.4.2 requires heating and cooling loads to be calculated per ACCA Manual N, the ASHRAE Handbook fundamentals, or an approved equivalent — rules of thumb do not comply. And 90.1 places limits on oversizing, because an oversized plant wastes energy at part load even when every component meets its efficiency minimum.

<Callout type="warning">Never submit an equipment schedule without rated efficiency values. Reviewers treat a missing EER or IEER the same as a failing one — either way, the submittal goes back for correction.</Callout>


![Ceiling diffusers and spiral ductwork deliver ventilation air sized per ASHRAE 62.1 in a typical commercial office.](/generated/blog/inline/commercial-hvac-design-requirements-2026-usa-1.webp)


## Controls: economizers, demand control ventilation, and energy recovery

Controls draw more redlines than any other section of a commercial HVAC submittal, because the requirements are specific and easy to verify on paper. Three dominate:

**Economizers.** Air-side or water-side economizers are required above certain cooling capacity thresholds, with the threshold varying by climate zone. They must be integrated — meaning mechanical cooling stages up only as the economizer reaches its limit — and fault detection and diagnostics (FDD) is required on larger systems so a stuck damper does not silently waste energy for years.

**Demand control ventilation (DCV).** Spaces with high occupant density and variable occupancy — conference rooms, auditoriums, dining areas — must modulate outdoor air based on actual occupancy, typically via CO2 sensors. Designing constant-volume ventilation for a 200-seat assembly space is a guaranteed review comment.

**Energy recovery.** When a system's supply airflow and outdoor-air fraction cross the thresholds in 90.1 Section 6.5.6.1, an energy recovery device with minimum effectiveness becomes mandatory. Dedicated outdoor air systems (DOAS) paired with energy recovery have become the default compliant architecture for many building types precisely because they handle this requirement gracefully.

<Callout type="tip">Write your control sequences as narrative text on the drawings, not just points lists. A reviewer can verify "economizer modulates from minimum position to full open before first-stage mechanical cooling energizes" in seconds; a cryptic points table takes ten times longer and invites questions.</Callout>

## What plan reviewers actually check

It helps to think like the reviewer. They are not redesigning your system — they are verifying a short list of high-leverage items. In our experience producing [commercial HVAC designs](/services/mechanical-design/hvac-design), the items below generate the overwhelming majority of comments:

- **Load calculations.** A summary showing block and zone-by-zone heating and cooling loads, design conditions used, and the method (Manual N or equivalent). No summary, no approval.
- **Ventilation calculations.** A table listing every space, its Rp and Ra values, calculated Vbz, and the system-level outdoor air intake with Ev applied.
- **Equipment schedules.** Capacity, efficiency rating, and the 90.1 table reference for every unit.
- **Control sequences.** Economizer, DCV, morning warm-up, optimal start, and unoccupied setback described in plain language.
- **Ductwork.** Layout with SMACNA construction class, sealing class, and insulation R-values called out. Leakage assumptions must match the energy model or prescriptive tables.
- **IMC items.** Condensate disposal routing, refrigerant piping, combustion air for fuel-fired equipment, and outdoor-air intake locations separated from exhaust and contaminant sources per code distances.

## Commercial HVAC permit drawing checklist

<Checklist>
- [ ] Heating and cooling load calculations (block plus zone-by-zone) summarized on the drawings with design conditions stated
- [ ] Ventilation calculations per ASHRAE 62.1 for every occupied space, with system ventilation efficiency shown
- [ ] Equipment schedule listing capacity, rated efficiency (EER, IEER, SEER2, HSPF2, or COP), and the ASHRAE 90.1 Table 6.8.1 reference
- [ ] Control sequences written as narrative: economizer staging, DCV setpoints, morning warm-up, unoccupied setback
- [ ] Ductwork layout with SMACNA construction class, sealing class, and insulation R-values
- [ ] Refrigerant piping, condensate drainage, and outdoor equipment placement per IMC
- [ ] Energy code compliance documentation (COMcheck or the jurisdiction's equivalent) completed and signed
</Checklist>

Getting these seven items right on the first submittal is the difference between a two-week review and a two-month one. If your project needs permit-ready commercial HVAC drawings backed by real calculations, [request a quote](/request-quote) — our drafting team produces code-compliant mechanical sets with the documentation reviewers ask for, the first time.`,
    meta: { pullQuotes: ["Every cubic foot per minute of outdoor air is a heating and cooling load. Ventilation air is never free.", "A permit set that would have sailed through review five years ago can now come back covered in redlines — not because the design is wrong, but because the documentation does not prove it is right."] },
  },
  {
    slug: "residential-hvac-cooling-load-calculation",
    title: "How to Calculate HVAC Cooling Load for a Residential Building",
    excerpt: "A proper residential cooling load follows ACCA Manual J room by room — envelope, solar gain, internal loads, and infiltration. Here is the complete workflow, from design conditions to the final block load.",
    template: "TECHNICAL_GUIDE",
    category: "hvac-plumbing",
    tags: ["cooling load", "Manual J", "residential"],
    discipline: "hvac",
    readMinutes: 7,
    featured: false,
    daysAgo: 2,
    bodyMdx: `Ask three contractors what size air conditioner a 2,000-square-foot house needs and you will get three different answers — usually somewhere between three and five tons, usually justified by nothing more than habit. The correct answer is not a round number. It is a calculation: ACCA Manual J, performed room by room, that adds up every path by which heat enters the house on a design cooling day.

Oversized equipment short-cycles, leaves humidity behind, and costs more to install. Undersized equipment runs all day and still loses ground every August afternoon. This guide walks through the full cooling load workflow the way a professional designer does it — and the way code requires it, since the IRC (Section M1401.3) mandates Manual J-based sizing for residential HVAC.

## Start with design conditions, not record weather

Every load calculation begins with the weather it is designed for. Manual J uses ASHRAE 1% cooling design conditions: the dry-bulb temperature and coincident wet-bulb (or mean daily range) that is exceeded only about 1% of annual cooling hours for the project location. Indoor conditions are standardized at 75°F and 50% relative humidity.

This is a deliberate choice, not a shortcut. Designing to the hottest day in recorded history produces oversized equipment that misbehaves the other 364 days. The 1% value covers real heat waves while keeping equipment in its efficient operating range. Always pull design temperatures from ACCA-approved climate data or ASHRAE fundamentals for the specific city — conditions can shift several degrees within a single metro area, and altitude adjustments matter in mountain regions.

## Envelope loads: walls, roof, and windows

Heat moves through the building envelope by conduction, driven by the temperature difference across each assembly. The basic relationship is simple: heat transfer equals the assembly U-factor times its area times the cooling temperature difference. In practice, the work is in the inputs — you need accurate wall, ceiling, and floor areas, correct R-values for each assembly, and the right U-factors for every window and door.

Windows deserve special attention because they usually dominate the cooling load. Solar gain through glazing can exceed all other envelope components combined on a west-facing elevation. Three properties control it: the U-factor (conductive transfer), the solar heat gain coefficient or SHGC (how much solar radiation passes through), and orientation with shading. A west-facing slider with a high SHGC and no overhang is a load problem that no reasonable equipment size fixes elegantly — this is why good designers flag glazing issues before they size anything.

Do not forget the attic and duct location. Ductwork running through a 140°F vented attic picks up sensible gain that lands directly on the cooling load, which is one reason Manual J applies distribution losses and why conditioned or encapsulated attics are so valuable in hot climates.

## Internal gains: people, lights, and appliances

Everything inside the house that uses energy eventually becomes heat the air conditioner must remove. Manual J accounts for this with standardized allowances rather than an inventory of every device:

- **Occupants.** Each person contributes roughly 230 Btu/h of sensible heat plus a latent component from respiration and perspiration. Bedroom counts drive this — Manual J ties occupancy to the number of bedrooms, not the homeowner's headcount.
- **Appliances.** The kitchen carries a default sensible allowance for the refrigerator, range, and small appliances, with additional latent load from cooking. Home offices, laundry equipment, and large electronics add their own increments.
- **Lighting.** Interior lighting wattage converts directly to sensible heat. LED retrofits have genuinely reduced this component compared to the incandescent era, and the calculation should reflect what is actually installed.

These numbers look small individually, but a family of four with a working kitchen contributes several thousand Btu/h — the better part of half a ton — before the envelope is even counted.


![Solar gain through glazing is often the largest single component of a residential cooling load.](/generated/blog/inline/residential-hvac-cooling-load-calculation-1.webp)


## Infiltration and ventilation: the invisible load

Air leaking into the house carries both sensible and latent heat, and in humid climates the latent portion can dominate. Manual J estimates infiltration from the building's airtightness (blower-door test results when available), exposure, and number of stories, converting air changes per hour into a cfm load at design conditions.

> In a humid climate, the moisture carried in by infiltration and ventilation is often the load that actually sizes the equipment — not the sensible heat through the walls. Ignore latent load and you will install a system that cools fine and dehumidifies poorly.

Mechanical ventilation adds to the total. ASHRAE 62.2 requires whole-dwelling ventilation for indoor air quality, and that outdoor air arrives at design temperature and humidity. In green, tight homes, ventilation can exceed infiltration as a load component — a sign the envelope is doing its job and the ventilation strategy needs engineering attention.

## Block load versus room-by-room loads

A Manual J report produces two different answers, and each has its own job. The **block load** is the whole-house total at the single peak hour — it sizes the equipment. The **room-by-room loads** break that total into individual spaces — they size the ductwork and registers via ACCA Manual D.

This distinction is where many bad designs are born. Equipment selected from a block load but fed by ducts sized on square footage alone will starve distant rooms and blast nearby ones. The chain only works in order: Manual J room loads feed Manual D duct design, which determines the airflow each room actually receives.

The report also separates sensible and latent capacity, yielding the sensible heat ratio (SHR). Equipment selection under ACCA Manual S must match both — a unit with the right total tons but the wrong SHR will satisfy the thermostat while leaving the house clammy.

## The calculation workflow

<Checklist>
- [ ] Confirm the project location and pull ASHRAE 1% cooling design temperatures and indoor design conditions (75°F, 50% RH)
- [ ] Take off envelope areas by orientation: walls, windows, doors, ceilings, floors, with assembly R-values and glazing U-factor and SHGC
- [ ] Document shading: overhangs, orientation-specific solar exposure, and any external shading devices
- [ ] Count bedrooms for occupancy, note kitchen and laundry appliances, and record lighting type
- [ ] Establish infiltration from blower-door data or construction-quality defaults, and add ASHRAE 62.2 ventilation airflow
- [ ] Calculate room-by-room sensible and latent loads, then sum to the block load
- [ ] Verify the sensible heat ratio and hand the report to Manual S equipment selection — never size from the block total alone
</Checklist>

<Callout type="tip">If a proposed equipment size differs from the Manual J block load by more than half a ton, ask why. Legitimate reasons exist — planned additions, unusual internal loads — but "we always install this size" is not one of them.</Callout>

A Manual J calculation does not guess at the load. It builds it, room by room, from the physics of the house — and that is the only foundation a reliable residential system can stand on. If you need a documented [heating and cooling load calculation](/services/calculations-reports/hvac-heating-cooling-load) for a permit set or an equipment replacement, [request a quote](/request-quote) and our team will run the full Manual J, S, and D sequence for your project.`,
    meta: { pullQuotes: ["A Manual J calculation does not guess at the load. It builds it, room by room, from the physics of the house.", "Oversized equipment short-cycles, leaves humidity behind, and costs more to install. Undersized equipment runs all day and still loses."] },
  },
  {
    slug: "manual-j-vs-manual-s-vs-manual-d",
    title: "Manual J vs Manual S vs Manual D: Complete Guide",
    excerpt: "Manual J sizes the load, Manual S selects the equipment, Manual D designs the ducts. Mix up the order or skip one and the system fails — here is how the three ACCA manuals fit together.",
    template: "LISTICLE",
    category: "hvac-plumbing",
    tags: ["Manual J", "Manual S", "Manual D", "ACCA"],
    discipline: "hvac",
    readMinutes: 6,
    featured: false,
    daysAgo: 3,
    bodyMdx: `Residential HVAC has a three-step engineering sequence, published by ACCA, required by code, and ignored with remarkable consistency. Manual J calculates the heating and cooling load. Manual S selects equipment that can meet that load. Manual D designs the duct system that delivers the air. Each manual answers a different question, each depends on the one before it, and skipping any of them is how houses end up with hot bedrooms, clammy basements, and utility bills nobody can explain.

Here is what each manual does, how they connect, and the mistakes that fail plan review.

## 1. Manual J: how much heating and cooling does the house need?

Manual J (currently the 8th edition) is the load calculation — the physics of the house expressed in Btu/h. It accounts for envelope conduction, solar gain through glazing, internal gains from people and appliances, and infiltration and ventilation loads, producing both sensible and latent totals for every room plus a whole-house block load.

Its inputs are the building itself: orientation, wall and ceiling assemblies, window U-factors and SHGC values, airtightness, occupancy, and ASHRAE design temperatures for the location. Its outputs are two numbers per room (sensible and latent load) and the block load that sizes the equipment. The IRC requires heating and cooling loads to be calculated per Manual J or an approved equivalent, and most jurisdictions now ask to see the report — or at least its summary — with the permit application.

What Manual J does not do is pick equipment or size ducts. It tells you the size of the problem. Solving it is the next manual's job.

## 2. Manual S: which equipment can actually deliver it?

Manual S takes the Manual J block load and matches it to real equipment with published performance data. This step exists because nominal tonnage is a fiction — a "3-ton" air conditioner does not deliver 36,000 Btu/h under your design conditions. Actual capacity varies with outdoor temperature, indoor wet-bulb, and airflow, so Manual S requires comparing the Manual J loads against the manufacturer's expanded performance tables at design conditions.

Three match-ups matter. Total capacity must cover the block load within Manual S oversizing limits. Sensible capacity must cover the sensible load. Latent capacity must cover the latent load — which means the equipment's sensible heat ratio has to suit the climate, a critical check in humid regions. Manual S also verifies blower performance: the air handler must deliver the required airflow against the duct system's static pressure, a handoff point directly into Manual D.

The oversizing limits are the teeth of Manual S. Cooling equipment may exceed the load only within strict bounds, and heating equipment has its own caps (with specific allowances for heat pumps and their supplemental heat). These limits exist because the industry's historic habit — rounding up "just to be safe" — is the primary cause of short-cycling, poor dehumidification, and comfort complaints.

## 3. Manual D: how does the air get to each room?

Manual D designs the duct system so that every room receives the airflow its Manual J room load requires. It starts with the available static pressure — the blower's rated external static pressure minus the pressure drops of the coil, filter, grilles, and dampers — and converts that budget into a friction rate per 100 feet of duct. Every trunk, branch, and run is then sized so its pressure drop fits the budget.

This is the manual most often skipped, and its absence is visible in every house with a freezing bonus room over the garage. Ducts sized by rule of thumb or by "whatever fits in the chase" cannot deliver design airflow to distant rooms; the blower pushes air down the path of least resistance, nearby registers get too much, and far rooms get too little. Manual D also covers register and grille selection, because the throw and spread of the supply outlet determine whether conditioned air actually mixes in the room or short-circuits back to the return.

<Callout type="note">Manual D depends on Manual J room-by-room loads, not the block load. Ducts sized from the whole-house total with airflow "balanced" later by eyeball are not a Manual D design — they are a guess with dampers.</Callout>


![A Manual D duct layout balances airflow so every room receives its Manual J room load.](/generated/blog/inline/manual-j-vs-manual-s-vs-manual-d-1.webp)


## 4. Side-by-side comparison

| | Manual J | Manual S | Manual D |
|---|---|---|---|
| Question it answers | How much load? | Which equipment? | What ducts? |
| Key inputs | Envelope, glazing, infiltration, occupancy, climate | Manual J loads, manufacturer performance data | Manual J room loads, blower static pressure |
| Key outputs | Room-by-room and block sensible and latent loads | Selected model, capacity verification, airflow requirement | Duct sizes, friction rate, register selection |
| Code status | Required by IRC M1401.3 | Required by IECC for equipment sizing | Required wherever ducted systems are installed |

## 5. The correct sequence — and what breaks when you skip one

The order is non-negotiable: J, then S, then D. Manual S needs Manual J's loads; Manual D needs Manual J's room loads and Manual S's airflow. Common failure modes map directly to skipped steps:

- **Sizing equipment without Manual J** produces the classic oversized system: short cycles, high humidity, wasted money. This is the single most common residential HVAC defect in the country.
- **Selecting equipment without Manual S** produces the nominal-tonnage trap — a 3-ton box that delivers 2.4 tons of sensible cooling at design conditions in a humid climate, running constantly and never quite catching up.
- **Installing ducts without Manual D** produces the comfortable-living-room, miserable-bedroom house. The equipment is fine; the air simply never arrives where it is needed.

> Run the manuals in order — J, then S, then D. Every shortcut through that sequence shows up later as a comfort complaint with your company's name on it.

## 6. Mistakes that fail plan review

Reviewers who ask for Manual J documentation tend to check the same handful of errors. Watch for these before you submit:

- Design temperatures that do not match the jurisdiction's climate data, or indoor conditions other than 75°F cooling without justification.
- Window areas or SHGC values that do not match the architectural drawings — the energy model and the floor plan must agree.
- Infiltration inputs that assume a blower-door result the house has not earned; new construction without testing should use conservative defaults.
- Equipment schedules showing nominal tons with no Manual S capacity verification at design conditions.
- Duct layouts with no friction-rate calculation and no grille schedule — a drawing of rectangles is not a Manual D design.

Get the sequence right and the system practically designs itself: the load tells you the equipment, the equipment tells you the airflow, and the airflow tells you the ducts. If you need the full J, S, and D package documented for a permit set, our [heating and cooling load calculation](/services/calculations-reports/hvac-heating-cooling-load) service delivers all three — and if the project is already at the drawing stage, [request a quote](/request-quote) for a complete permit-ready mechanical set.`,
    meta: { pullQuotes: ["Manual J answers how much heating and cooling the house needs. Manual S answers which equipment can deliver it. Manual D answers how the air gets there.", "Run the manuals in order — J, then S, then D. Every shortcut through that sequence shows up later as a comfort complaint."] },
  },
  {
    slug: "heat-pump-vs-gas-furnace-design",
    title: "Heat Pump vs Gas Furnace: HVAC Design Considerations",
    excerpt: "Heat pumps win on efficiency; furnaces win on simplicity and cold-weather capacity. The right choice depends on climate zone, utility rates, and electrical service — here is the designer's breakdown.",
    template: "LISTICLE",
    category: "hvac-plumbing",
    tags: ["heat pump", "furnace", "electrification"],
    discipline: "hvac",
    readMinutes: 6,
    featured: false,
    daysAgo: 4,
    bodyMdx: `Few equipment decisions generate more debate right now than heat pump versus gas furnace. Electrification incentives push one way; gas infrastructure and cold-climate performance pull the other. As a designer, the question is not which technology is "better" in the abstract — it is which one fits the project's climate zone, utility rates, electrical service, and venting constraints.

Here is the comparison that actually drives the decision, point by point.

## 1. How efficiency is measured — and what the numbers mean

The two systems do not even share a rating scale, which is the first source of confusion. Gas furnaces are rated by AFUE (Annual Fuel Utilization Efficiency): a 96% AFUE furnace converts 96 cents of every fuel dollar into heat. It is a straightforward combustion efficiency number, and it caps out just under 100%.

Heat pumps are rated by HSPF2 for heating season performance and COP (Coefficient of Performance) at specific conditions. A heat pump does not create heat; it moves it from outdoors to indoors, so a COP of 3.0 means three units of heat delivered for every unit of electricity consumed — effectively 300% efficient. That single fact explains both the heat pump's operating-cost advantage and its vulnerability: as outdoor temperature falls, there is less heat to move, and capacity and efficiency both slide.

For cooling, both system types use the same metrics — SEER2 and EER2 — since a heat pump cools exactly like a conventional air conditioner. In a dual-fuel setup, the heat pump handles cooling and mild-weather heating while the furnace takes over below the economic balance point.

## 2. Cold-climate performance: the derate curve rules

This is where furnace advocates make their stand, and the physics backs them — partially. A gas furnace delivers its full rated output at any outdoor temperature. A heat pump's heating capacity declines as ambient temperature drops, following the manufacturer's derate curve, and at some point the house's heat loss exceeds what the pump can deliver. That crossover is the thermal balance point.

Modern cold-climate heat pumps have pushed that point far lower than the old reputation suggests, with many units maintaining useful capacity well below 0°F. But "useful capacity" is not "rated capacity," and Manual S selection must use the expanded performance tables at the ASHRAE 99% heating design temperature for the location — not the nominal rating. Below the balance point, the design needs supplemental heat: electric resistance strips, or a gas furnace in a dual-fuel arrangement.

> A heat pump does not create heat; it moves it. That single fact explains both its efficiency and its limits — size from the derate curve at design temperature, never from the nominal rating.

The design implication is concrete: in climate zones 6 and 7, a heat-pump design is a systems engineering exercise involving balance-point analysis, defrost strategy, and supplemental heat staging. In zones 1 through 4, it is usually the straightforward choice.

## 3. Operating cost: do the math on local rates

Efficiency only converts to savings through utility rates, and rates vary enormously. The honest comparison is dollars per delivered MMBtu: take the local gas price per therm divided by furnace AFUE, versus the electricity price per kWh divided by the heat pump's seasonal COP, with both converted to the same units.

Heat pumps typically win this math in mild climates with moderate electric rates, and the advantage grows where gas utilities impose high monthly fixed charges that persist even when the furnace barely runs. Furnaces hold their own where natural gas is cheap and electricity is expensive — a rate structure still common across much of the Midwest. Never let a national-average comparison substitute for the project's actual tariffs; the crossover point moves by utility, not by state.

<Callout type="tip">Model operating cost with the project's actual utility tariffs, including demand charges and fixed monthly fees — not national averages. The heat-pump-versus-furnace answer changes completely between two neighboring utilities.</Callout>


![Backup electric heat for a heat pump can add 40 to 80 amps of load — the panel and service must be verified first.](/generated/blog/inline/heat-pump-vs-gas-furnace-design-1.webp)


## 4. Electrical service and panel impact

Here is the consideration most often discovered too late. A gas furnace needs only a 120V circuit for its blower and controls — a negligible electrical load. A heat pump with electric supplemental heat can add 10 to 20 kW of resistance heating, which translates to 40 to 80 amps at 240V hitting the panel exactly when the heat pump is working hardest.

That load lands directly on the NEC dwelling load calculation (Article 220.82 or 220.83) and the fixed electric heating rules of Article 220.51 and Article 424. On an existing home with a 100-amp service, a cold-climate heat pump retrofit very often triggers a service upgrade to 200 amps — a cost and a permit scope that belongs in the project budget from day one, not discovered at rough-in. Our [electrical system design](/services/electrical-design/electrical-system-design) team treats this as a standard coordination check on every heat pump project: verify the panel, verify the service, and size the backup heat circuits before the mechanical drawings go out.

Even all-electric new construction needs the load calculation done properly. Heat pump compressors, backup strips, water heating, cooking, and EV charging stack up fast, and the service size follows the math.

## 5. Venting, combustion air, and siting

A gas furnace is a combustion appliance, and the IMC treats it like one. Category I furnaces need a metal flue vented through the roof with proper clearances; high-efficiency condensing (Category IV) furnaces vent through PVC out a sidewall but produce acidic condensate that must be drained and neutralized. All fuel-fired equipment needs combustion air per IMC Chapter 7 — either from the room volume, ducted from outdoors, or engineered — and the furnace room layout must accommodate it.

Heat pumps dodge combustion entirely but bring their own siting constraints. The outdoor unit needs manufacturer-specified clearances for airflow and service, must sit above expected snow lines in northern zones, and should be placed with noise in mind — a bedroom window three feet from a defrosting outdoor unit is a design failure. Defrost condensate needs somewhere to drain that does not become an ice sheet on the walkway in January.

## 6. Refrigerant rules and the A2L transition

One more factor now belongs on every heat pump specification: refrigerants are changing. Under the AIM Act phase-down, new equipment is transitioning to mildly flammable A2L refrigerants such as R-454B, replacing R-410A. This affects leak detection, ventilation of indoor equipment spaces, and labeling — with ASHRAE 15 and IMC provisions governing machinery rooms and refrigerant concentration limits.

For the designer, the practical steps are to specify equipment with the current refrigerant, confirm the installing contractor is certified for A2L handling, and verify that any indoor equipment room meets the updated ventilation and detection requirements. Furnaces sidestep this entirely — another quiet point in the simplicity column.

## 7. Choosing for your project

Strip away the ideology and the decision follows a short checklist: climate zone and 99% design temperature, local gas and electric tariffs, available electrical service capacity, venting and siting constraints, and the client's appetite for complexity. Mild climate plus moderate electric rates plus adequate service: heat pump, usually by a wide margin. Deep-cold climate with cheap gas and a 100-amp panel: furnace or dual-fuel deserves serious consideration. Everything in between gets the full analysis — balance point, operating cost model, and service load calculation.

Whichever direction the project goes, the equipment decision has to be engineered, not assumed. If you need the load calculations, Manual S selection, electrical coordination, and permit-ready drawings to back the choice, [request a quote](/request-quote) — our team handles the full mechanical and electrical package so the design decision on paper matches the system that gets installed.`,
    meta: { pullQuotes: ["A heat pump does not create heat; it moves it. That single fact explains both its efficiency and its limits.", "The cheapest system to install is rarely the cheapest to own. Run the operating-cost math on local utility rates before you choose."] },
  },
  {
    slug: "sizing-hvac-system-new-construction-home",
    title: "How to Size an HVAC System for a New Construction Home",
    excerpt: "Rule-of-thumb sizing costs homeowners comfort and money for decades. Here is how professional designers size residential HVAC with ACCA Manual J, S, and D — and what your permit drawings must show.",
    template: "TECHNICAL_GUIDE",
    category: "hvac-plumbing",
    tags: ["system sizing", "new construction", "Manual J"],
    discipline: "hvac",
    readMinutes: 7,
    featured: false,
    daysAgo: 5,
    bodyMdx: `New construction is the one moment in a building's life when everything about its thermal behavior is knowable. The wall assemblies are on the plans. The window schedule lists every U-factor and SHGC. The orientation is fixed, the insulation values are specified, and the air barrier strategy is documented. There is no excuse for guessing at equipment size — yet rule-of-thumb sizing remains the most common residential HVAC mistake in America.

An oversized air conditioner does not cool a house "better." It cools it too fast, short-cycles, and shuts off before it has removed enough moisture, leaving the homeowner with a cold, clammy house and elevated energy bills. An undersized system runs constantly on design days and still falls behind. Getting it right is a three-step engineering process: calculate the loads (Manual J), select equipment against those loads (Manual S), and design the duct system to deliver the air (Manual D). Here is how each step works and what belongs on your permit drawing set.

## Start With the Envelope, Not the Equipment

Every accurate load calculation begins with the building envelope, because the envelope is the load. Before touching equipment catalogs, the designer needs the full architectural picture: above-grade and below-grade wall R-values, ceiling and floor insulation, window and door schedules with U-factors and solar heat gain coefficients, the home's orientation, overhang depths, and the target airtightness.

New construction has a decisive advantage here. In a retrofit, infiltration rates and existing insulation are educated guesses. On a new build, the plans specify R-21 walls, R-49 ceilings, low-E double-pane windows, and a blower-door target of 3 ACH50 or better — and the load calculation can use those specified values with confidence. That precision is exactly why IECC 2024 Section R403.7 requires heating and cooling equipment to be sized from loads calculated per ACCA Manual J (or another approved methodology) rather than from square footage.

> The load calculation is a property of the house, not the equipment. If two designers get different Manual J results for the same plans, one of them entered the wrong inputs.

Orientation deserves special attention because it is free to optimize and expensive to ignore. A house with most of its glazing facing west carries a substantially larger late-afternoon cooling load than the same house rotated ninety degrees. The load calculation captures this automatically — but only if the designer enters the true orientation instead of a default.

## Run a Room-by-Room Manual J Load Calculation

ACCA Manual J, 8th edition, is the industry standard for residential load calculations, and it produces two numbers that drive everything downstream: the sensible load (heat that changes air temperature) and the latent load (moisture that must be removed). Both matter. In humid climates, latent load can be a third or more of the total, and equipment selected on sensible capacity alone will leave a home damp.

Use ACCA design conditions, not record extremes. Manual J Table 1A gives the 1% summer dry-bulb (with mean coincident wet-bulb) and 99% winter dry-bulb for thousands of US locations. Designing to record temperatures oversizes equipment for conditions that occur a few hours per decade; designing to the 1%/99% values covers roughly 8,760 hours of the year with margin built into the method itself.

Run the calculation room by room, not just as a whole-house block load. The block load sizes the equipment, but the room-by-room loads size the ductwork — each room needs a known CFM requirement, and you cannot get that from a single whole-house number. Bedrooms over garages, bonus rooms, and rooms with large west glass routinely need more airflow than their floor area suggests.

<Callout type="tip">Always document the design conditions and the Manual J edition on the drawings. When a plan reviewer questions equipment size, the fastest answer is a schedule that shows location, outdoor design temperatures, total sensible and latent loads, and the Manual J version used.</Callout>

<Checklist>
- [ ] Architectural plans with wall, ceiling, and floor R-values confirmed
- [ ] Window and door schedule with U-factor and SHGC for every opening
- [ ] True building orientation and overhang/shading details
- [ ] Blower-door / airtightness target from the energy compliance documents
- [ ] ACCA Table 1A design conditions for the project city
- [ ] Room-by-room sensible and latent loads, plus the whole-house block load
</Checklist>


![A designer reviews room-by-room Manual J load calculations against installed ductwork during a new-construction rough-in inspection.](/generated/blog/inline/sizing-hvac-system-new-construction-home-1.webp)


## Translate Loads Into Equipment With Manual S

The Manual J tells you the load. ACCA Manual S tells you which equipment is allowed to serve it. This is the step most often skipped — and the one code officials care about most, because IECC 2024 R403.7 explicitly requires equipment sizing per Manual S.

The headline rule: for single-stage equipment, total cooling capacity must not exceed 115 percent of the Manual J total cooling load. Staged and variable-capacity equipment gets somewhat more headroom under Manual S, but the principle is the same — the code wants equipment matched to the load, not two sizes bigger "just in case." Sensible capacity must also cover the sensible load at design conditions, which is where many selections fail: a unit with adequate total capacity but weak sensible capacity will not hold temperature on a design afternoon.

For heat pumps, check both modes. The heating load at the 99% winter design temperature must be met by the heat pump's capacity at that temperature (from the manufacturer's extended performance data, not the 47°F rating point), with supplemental heat sized for the balance. Then verify the cooling side independently — in mixed climates the cooling selection often governs, in cold climates the heating selection does.

Oversizing penalties are real and measurable: short cycling that cuts dehumidification, wider temperature swings, higher peak demand, and larger ducts, wire, and breakers than the house needs. A correctly sized single-stage system that runs long, steady cycles will outperform an oversized two-stage system that never leaves low stage.

> Size the equipment to the load calculation, then defend the selection with the manufacturer's performance data at design conditions — not the glossy nominal tonnage on the brochure.

## Design the Duct System With Manual D

The best-sized equipment in the world cannot fix bad ductwork. ACCA Manual D sizes every trunk and branch from the room-by-room CFM requirements, the available static pressure of the selected air handler or furnace, and a target friction rate. On new construction, this should happen while the framing plans are still flexible — moving a chase on paper costs nothing; reframing around a duct conflict costs thousands.

Key Manual D inputs include the equipment's external static pressure rating, the total effective length of the longest supply and return runs (including fitting equivalent lengths, which dominate), and the design airflow per room from the Manual J. Undersized returns are the classic failure: the system is starved for air, static pressure climbs, airflow drops, and capacity that existed on paper never reaches the rooms.

Show the duct layout on the mechanical plans with sizes, CFM per register, and the design friction rate. If the project uses a third-party energy rater or HERS verification, the rated duct design must match what gets installed — discrepancies found at rough-in inspection are among the most common sources of failed inspections and change orders.

## Avoid the Five Classic New-Construction Sizing Mistakes

**1. The 500-square-feet-per-ton rule.** This relic from the era of leaky, uninsulated houses has no place on a modern build. A tight, well-insulated 2,400-square-foot home might need two tons; a leaky one with single-pane west glass might need four. Only the load calculation knows.

**2. Sizing to the "worst room."** Upsizing the whole system because the bonus room runs warm punishes every other room. Fix the room with targeted airflow, duct design, or envelope improvements — not with a bigger condenser.

**3. Ignoring latent load.** In humid climates, selecting equipment on sensible capacity alone is how you get a 72-degree house at 65 percent relative humidity. Check the latent capacity at design conditions.

**4. Forgetting ventilation.** ASHRAE 62.2 whole-house ventilation adds load that must appear in the Manual J. It is small but nonzero, and inspectors increasingly check for it.

**5. Treating ducts as an afterthought.** Duct design belongs in the drawing set alongside the equipment schedule, sized before framing begins — not improvised by the installer in the attic.

<Callout type="warning">Never let equipment be ordered before the Manual J, S, and D are complete and coordinated. Once the condenser is on the pad and the air handler is hung, every sizing error becomes a demolition project.</Callout>

## What Your Permit Drawing Set Should Show

A permit-ready residential mechanical set tells the sizing story on paper so the reviewer never has to ask. At minimum, include a load calculation summary (design conditions, block sensible/latent/total loads, Manual J edition), an equipment schedule (model numbers, capacities at design conditions, efficiency ratings, electrical data), a duct layout with sizes and CFM per outlet, and the Manual S compliance statement tying equipment capacity to the calculated loads. Thermostat locations, ventilation strategy, and refrigerant line routing complete the picture.

Getting this package right the first time is the difference between a permit issued in one review cycle and a month of correction letters. If you need a complete, code-compliant sizing and drawing package for your project, our team produces [permit-ready HVAC designs](/services/mechanical-design/hvac-design) with full [heating and cooling load calculations](/services/calculations-reports/hvac-heating-cooling-load). [Request a quote](/request-quote) and we will scope your project within one business day.`,
    meta: { pullQuotes: ["The load calculation is a property of the house, not the equipment. If two designers get different Manual J results for the same plans, one of them entered the wrong inputs.", "An oversized air conditioner does not cool a house better. It cools it too fast, short-cycles, and leaves the homeowner with a cold, clammy house."] },
  },
  {
    slug: "hvac-equipment-sizing-iecc-ashrae-90-1",
    title: "HVAC Equipment Sizing Requirements Under IECC & ASHRAE 90.1",
    excerpt: "Both the IECC and ASHRAE 90.1 require HVAC equipment to be sized from calculated loads — not rules of thumb. Here is exactly what each code demands and how to document compliance on permit drawings.",
    template: "TECHNICAL_GUIDE",
    category: "hvac-plumbing",
    tags: ["IECC", "ASHRAE 90.1", "equipment sizing"],
    discipline: "hvac",
    readMinutes: 7,
    featured: false,
    daysAgo: 6,
    bodyMdx: `Every few months, a plan reviewer somewhere in America red-lines a drawing set with the same comment: "Provide heating and cooling load calculations and equipment sizing per code." The designer scrambles, the permit slips, and the project loses weeks — all because sizing documentation was treated as optional. It is not. Both the International Energy Conservation Code and ASHRAE Standard 90.1 contain explicit sizing requirements, and understanding exactly what each one demands is the difference between a clean first review and a correction cycle.

This guide walks through the sizing provisions in IECC 2024 (residential and commercial) and ASHRAE 90.1 (commercial), explains the oversizing limits, and shows what compliance documentation belongs on a permit set.

## IECC 2024 Residential: Manual J In, Manual S Out

IECC 2024 Section R403.7, "Systems sizing," is admirably direct: heating and cooling equipment must be sized in accordance with ACCA Manual S, based on building loads calculated in accordance with ACCA Manual J or another approved heating and cooling calculation methodology. Two standards, linked in sequence — loads first, equipment second.

For the designer, this creates a clear compliance chain. The Manual J establishes the block sensible, latent, and heating loads using the code-recognized method. The Manual S selection then proves the chosen equipment falls within the standard's capacity limits — total cooling capacity within 115 percent of the total cooling load for single-stage equipment, sensible capacity covering the sensible load, and heating capacity matched to the heating load. When a reviewer asks how the equipment was sized, the answer is a one-page Manual S summary referencing the Manual J report, not a paragraph of justification.

Note the word "approved" in the code language. Alternative load calculation methods are permitted, but they must be approved by the code official — which in practice means recognized engineering methods with documented assumptions, not a contractor's spreadsheet or a square-foot rule. If you deviate from Manual J, be prepared to defend the methodology.

> IECC R403.7 creates a chain of custody for sizing: Manual J establishes the load, Manual S justifies the equipment. Break either link and the compliance argument collapses.

The International Mechanical Code reinforces this from the mechanical side. IMC Section 312 requires heating and cooling load calculations to be submitted in accordance with ASHRAE/ACCA Standard 183 or an approved equivalent computational procedure. Between the IECC and the IMC, a residential permit set without documented load calculations has no code basis to stand on.

## IECC 2024 Commercial: Loads Drive Everything

On the commercial side, IECC 2024 Chapter 4 [CE] requires mechanical systems to be designed around calculated loads. Section C403 requires that heating and cooling equipment be sized based on design loads, and the compliance documentation must show the relationship between the calculated loads and the selected equipment capacities. Many jurisdictions enforce this through the COMcheck or ASHRAE 90.1 compliance forms, which ask for equipment capacities, efficiencies, and the design loads they serve.

Commercial sizing introduces variables that residential designers rarely face: ventilation loads under ASHRAE 62.1 that can dominate in high-occupancy spaces, simultaneous heating and cooling in different zones, diversity factors across zones served by shared equipment, and part-load performance that matters more than full-load ratings. The load calculation method must account for all of them — which is why most commercial work uses hourly simulation or ASHRAE Radiant Time Series methods rather than simplified block calculations.

<Callout type="note">On commercial projects, keep the load calculation report as a separate bound document referenced by the drawings — not buried in the plan set. Reviewers, energy modelers, and commissioning agents all need it, and a standalone report with a revision history survives value engineering far better than numbers printed on a plan sheet.</Callout>

## ASHRAE 90.1: Sizing Inside the Energy Standard

ASHRAE 90.1 approaches sizing as an energy problem, which it is: oversized equipment costs energy twice, once in the larger equipment and again in the degraded part-load efficiency of short-cycling operation. Section 6.4.2, "Calculations," requires heating and cooling system design loads to be determined using a recognized method such as ANSI/ASHRAE/ACCA Standard 183, and equipment to be selected based on those calculated loads.

The standard then layers efficiency requirements on top of the sizing through its equipment efficiency tables (Section 6.8), which set minimum EER, IEER, COP, and other ratings by equipment type and capacity bracket. This is where sizing and efficiency interact in a way designers sometimes miss: the efficiency requirement that applies to a piece of equipment depends on its capacity bracket, so an oversized selection can push the equipment into a stricter bracket — or a designer can game a lenient bracket by oversizing, which is exactly what the sizing provisions exist to prevent.

Several 90.1 provisions effectively constrain sizing choices. Fan power limitations (Section 6.5.3) cap the brake horsepower of supply fans, which limits how much air — and therefore how much capacity — a system can push. Economizer requirements (Section 6.5.1) mandate air economizers on most cooling systems at or above 54,000 Btu/h, changing the effective capacity and control strategy of larger systems. Energy recovery thresholds require exhaust energy recovery on larger ventilation systems, which reduces the heating and cooling loads the equipment must meet. Each of these must be reflected in the documented design.


![A bound load calculation report and equipment schedule prepared for code compliance review under IECC and ASHRAE 90.1.](/generated/blog/inline/hvac-equipment-sizing-iecc-ashrae-90-1-1.webp)


## The Oversizing Limits, Explained

Strip away the section numbers and both codes converge on one principle: equipment capacity must track the calculated load within defined limits. The practical limits designers work to:

- **Cooling (ACCA Manual S):** total capacity at or below 115 percent of the total cooling load for single-stage equipment, with modestly higher allowances for staged and variable-capacity systems. Sensible capacity must meet or exceed the sensible load at design conditions.
- **Heating (ACCA Manual S):** heating output matched to the heating load within the standard's limits — the days of installing a furnace at double the required output are over under modern codes.
- **Heat pumps:** capacity verified at the winter design temperature from extended performance data, with supplemental heat sized only for the documented shortfall.

Why do the codes care so much? Because oversizing is an energy penalty the code cannot recover elsewhere. An oversized single-stage unit short-cycles through its most efficient operating range, dehumidifies poorly (driving occupants to overcool), and draws higher peak demand. The sizing limits are among the cheapest efficiency measures in either code — they cost nothing to comply with when the design is done correctly.

<Checklist>
- [ ] Design loads calculated per an approved method (Manual J residential; Standard 183 or RTS commercial)
- [ ] Equipment schedule showing capacity at design conditions, not just nominal ratings
- [ ] Manual S compliance summary (residential) or load-to-capacity comparison (commercial)
- [ ] Efficiency ratings meeting IECC/90.1 tables for the equipment's capacity bracket
- [ ] Economizer, energy recovery, and fan power compliance where thresholds are triggered
- [ ] Load calculation report referenced on the drawings and available for review
</Checklist>

## What Plan Reviewers Actually Ask For

After the section numbers, here is the practical reality: most sizing comments from plan reviewers fall into a handful of patterns. "Provide load calculations" means the set had an equipment schedule with no documented basis — attach the Manual J summary or the commercial load report. "Equipment appears oversized" means the schedule shows capacities far above any plausible load — provide the Manual S comparison showing the ratio. "Verify efficiency compliance" means the schedule lists nominal SEER2 or EER without the code-required minimum for that equipment class and capacity — add the code table reference.

<Callout type="tip">Put a small "Basis of Design" box on the mechanical cover sheet: design outdoor temperatures, indoor setpoints, load calculation method and edition, and the sizing standard used. Reviewers read the cover sheet first, and a complete basis of design answers half their questions before they ask.</Callout>

The fastest permits go to sets where the sizing documentation is boring — complete, referenced, and consistent between the calculations, the schedules, and the plans. Inconsistency is what triggers scrutiny: a load report that says 3 tons, a schedule that says 5 tons, and plans that show ductwork for neither will earn a correction letter every time.

> The goal is not to survive plan review. The goal is a set so well documented that the reviewer has nothing to ask — because every number on the schedule traces back to a calculation.

Whether your project falls under the IECC residential provisions or ASHRAE 90.1 commercial requirements, the workflow is the same: calculate rigorously, select honestly, and document completely. Our engineers produce [code-compliant HVAC designs](/services/mechanical-design/hvac-design) backed by full [heating and cooling load calculations](/services/calculations-reports/hvac-heating-cooling-load) that satisfy IECC and 90.1 reviewers nationwide. [Request a quote](/request-quote) to get your project scoped within one business day.`,
    meta: { pullQuotes: ["IECC R403.7 creates a chain of custody for sizing: Manual J establishes the load, Manual S justifies the equipment. Break either link and the compliance argument collapses.", "An oversized selection can push equipment into a stricter efficiency bracket — which is exactly what the sizing provisions exist to prevent."] },
  },
  {
    slug: "2024-iecc-vs-ashrae-90-1-mep-guide",
    title: "2024 IECC vs ASHRAE 90.1: What MEP Designers Need to Know",
    excerpt: "Two energy codes, one building. Learn how the 2024 IECC and ASHRAE 90.1 differ in scope, compliance paths, and mechanical requirements — and how to choose the right path for your project.",
    template: "STANDARD",
    category: "hvac-plumbing",
    tags: ["IECC 2024", "ASHRAE 90.1", "energy code"],
    discipline: "hvac",
    readMinutes: 6,
    featured: false,
    daysAgo: 7,
    bodyMdx: `Ask which energy code governs your commercial project and you may get two answers: the IECC, adopted into law by the state or city, and ASHRAE 90.1, referenced as an alternative compliance path inside the IECC itself. For MEP designers, the practical question is never which code is "better" in the abstract — it is which path gets the building permitted with the least rework, and what each path demands on the drawings.

The 2024 IECC and ASHRAE 90.1-2022 (the edition the 2024 IECC references) overlap heavily but differ in structure, stringency details, and compliance options. Here is how they relate and how to navigate the choice on real projects.

## How the Two Codes Relate

Start with jurisdiction, because that decides everything. The IECC is a model code: it has no legal force until a state or municipality adopts it, and adopters routinely amend it, delay it, or adopt an older edition. ASHRAE 90.1 is a standard, not a code — it becomes enforceable when a jurisdiction adopts it directly or when the adopted IECC points to it.

The 2024 IECC commercial provisions explicitly allow compliance through ASHRAE 90.1. Section C401.2 gives the applicant a choice: comply with the IECC commercial chapter, or comply with ASHRAE 90.1 in its entirety. That "in its entirety" matters — you cannot cherry-pick the easier envelope table from one and the easier lighting table from the other. Pick a path and follow it end to end.

In practice, most commercial projects in the United States end up on the ASHRAE 90.1 path, for a simple reason: the engineers, energy modelers, and COMcheck-style tools the industry uses are built around 90.1's structure, and many design teams know its tables by heart. But the IECC prescriptive path is often simpler for small or straightforward buildings, and some jurisdictions or utility programs require one path specifically. Always confirm with the authority having jurisdiction before committing.

> You cannot mix and match. Choose the IECC path or the 90.1 path in full — the code official will enforce whichever one you declare on the compliance forms.

## Compliance Paths Side by Side

Both documents offer the same three fundamental routes to compliance, with different labels. The prescriptive path requires every component — envelope, mechanical, lighting, service water heating — to meet the code's minimum tables independently. It is the simplest to document and the hardest to optimize: no trade-offs allowed. The 2024 IECC commercial chapter and 90.1 Chapter 5/6/7/9/10 prescriptive sections work this way.

The performance path (energy cost budget in 90.1 Section 11, total building performance in IECC C407) models the proposed building against a code-minimum baseline and requires the proposed design to use less energy or cost. This is the path for designs that trade a better-than-code HVAC system against a weaker envelope, or vice versa. It demands a qualified energy model and a modeler who understands the baseline rules — the baseline is not "whatever the modeler assumes," it is defined line by line in the code.

The third route is the IECC's additional efficiency credits (Section C406), which the 2024 edition expanded into a structured points system: beyond meeting the prescriptive minimums, the building must earn a required number of efficiency credits from a menu of measures — improved HVAC performance, better lighting, energy recovery, on-site renewables, and others, with required credits varying by occupancy. Designers sometimes treat C406 as an afterthought; it is not. On many projects, selecting the credits early drives real design decisions, like whether to add energy recovery or upgrade to higher-efficiency equipment.

## Envelope and Mechanical Differences That Matter

For MEP designers, the envelope differences between the paths mostly matter as load inputs: whichever path you choose sets the baseline envelope the mechanical system is sized against. The 2024 IECC tightened residential and commercial envelope requirements relative to 2021 — lower U-factors and SHGC limits in several climate zones — which directly reduces block loads and can drop equipment a size. When the architect upgrades glazing to satisfy the envelope tables, tell the mechanical engineer before equipment is selected, not after.

On the mechanical side, both paths require load calculations, equipment efficiency minimums, controls, economizers, energy recovery, and duct and pipe insulation — but the thresholds and table values differ in the details. ASHRAE 90.1's equipment efficiency tables are updated with each edition and are generally the industry's reference point; the IECC commercial tables align closely but not identically. Fan power budgets, economizer capacity thresholds, and energy recovery triggers each have their own numbers in each document.

Controls are where recent editions have moved fastest. Both the 2024 IECC and 90.1-2022 expanded requirements for demand control ventilation, occupancy-based controls, and fault detection and diagnostics on larger systems. These are drawing-set items: sensor locations, control sequences, and points lists must appear on the plans, because a reviewer cannot verify a control requirement from an equipment schedule alone.

<Callout type="note">When the project uses the performance path, freeze the baseline assumptions early and document them. Most performance-path review comments are not about the proposed design — they are about a baseline that does not match the code's definition.</Callout>


![Energy code compliance forms and reference standards on a designer's desk during commercial permit documentation.](/generated/blog/inline/2024-iecc-vs-ashrae-90-1-mep-guide-1.webp)


## Lighting and Power: The MEP Overlap

MEP designers sometimes treat lighting as the electrical engineer's problem and the energy code as the mechanical engineer's problem. The energy code disagrees: lighting power density limits, occupancy and daylight controls, and receptacle controls all count toward compliance on whichever path you choose, and the 2024 editions pushed further on automatic controls.

Coordinate the lighting compliance with the mechanical design because internal gains connect them. A lighting design that beats the power allowance by 20 percent reduces the cooling load — which the energy model captures on the performance path but the prescriptive path ignores. On performance-path projects, that coordination is worth real modeled savings; on prescriptive projects, it is still worth doing for the client's operating costs, even if the code gives no credit.

## Choosing the Right Path for Your Project

For most commercial buildings, the decision tree is short. If the building is small, simple, and every system comfortably beats the prescriptive tables, use the prescriptive path — it is the cheapest to document and the fastest through review. If the design needs trade-offs (a glassy facade, an unusual HVAC approach, aggressive efficiency targets), use the performance path and hire the modeler early. If the jurisdiction or the client's utility incentive program names a path, that decides it regardless of engineering preference.

Whatever path you choose, declare it on the compliance forms and keep every discipline on the same path. The classic failure mode is a project where the architect documents IECC prescriptive envelope, the mechanical engineer models a 90.1 performance baseline, and the electrical engineer submits neither — and the reviewer rejects the package because the paths do not reconcile.

<Checklist>
- [ ] Confirm the adopted code edition and any local amendments with the AHJ
- [ ] Declare one compliance path (IECC prescriptive, IECC C407, or ASHRAE 90.1) on the forms
- [ ] Verify every discipline is documenting against the same path
- [ ] Select C406 additional efficiency credits early if on the IECC path
- [ ] Show controls, sensors, and sequences on the drawings — not just in the specs
- [ ] Keep the energy model baseline assumptions documented and code-referenced
</Checklist>

<Callout type="tip">The 2024 IECC added electric-ready and all-electric appendix provisions that several states are adopting. Even where they are appendices rather than mandatory, designing electric-ready now avoids expensive retrofits when the mandate arrives.</Callout>

Navigating two overlapping codes is genuinely complex, but it is also routine work for experienced MEP designers — the key is deciding the path early, documenting consistently, and coordinating across disciplines. Our team delivers [permit-ready MEP drawing sets](/services/mechanical-design/hvac-design) with full energy code compliance documentation, backed by detailed [load calculations and reports](/services/calculations-reports/hvac-heating-cooling-load). [Request a quote](/request-quote) and we will help you pick the cleanest compliance path for your project.`,
    meta: { pullQuotes: ["You cannot mix and match. Choose the IECC path or the 90.1 path in full — the code official will enforce whichever one you declare on the compliance forms.", "Most performance-path review comments are not about the proposed design — they are about a baseline that does not match the code's definition."] },
  },
  {
    slug: "commercial-hvac-rtu-vs-vrf-vs-split",
    title: "Commercial HVAC Design: RTU vs VRF vs Split System",
    excerpt: "Rooftop units, VRF, or split systems? Compare first cost, efficiency, zoning, footprint, and code impacts across the three dominant commercial HVAC approaches — with a decision framework for your project.",
    template: "LISTICLE",
    category: "hvac-plumbing",
    tags: ["RTU", "VRF", "split system", "commercial"],
    discipline: "hvac",
    readMinutes: 7,
    featured: false,
    daysAgo: 8,
    bodyMdx: `Few decisions shape a commercial building's first cost, energy bills, and occupant comfort like the choice of HVAC system architecture. For the great majority of light and medium commercial projects in the United States — offices, retail, restaurants, clinics, small schools — the choice comes down to three approaches: packaged rooftop units (RTUs), variable refrigerant flow (VRF) systems, and split systems.

Each one is the right answer for a certain building and the wrong answer for others. Here is how they compare across the seven factors that actually drive the decision.

## 1. First Cost: RTUs Win, VRF Costs More Upfront

Packaged rooftop units are the cost leader for straightforward commercial space. A single factory-assembled box containing the compressor, condenser, evaporator, and supply fan sets on a roof curb, connects to ductwork, and serves a zone. Installed costs per ton are typically the lowest of the three options, the trades that install them are everywhere, and replacement twenty years later is a crane lift rather than a renovation.

Split systems sit in the middle: a condensing unit outside (or on the roof) paired with an indoor air handler or furnace. They are economical at small capacities, but costs climb as you multiply systems to cover a larger building — ten 5-ton splits cost more installed than two 25-ton RTUs serving the same load.

VRF carries the highest first cost, often 20 to 40 percent above a comparable RTU design. The outdoor units, branch controllers, refrigerant piping network, and specialized controls add up, and the installing contractor pool is smaller, which shows in bid prices. The business case for VRF is lifecycle, not first cost — which brings us to efficiency.

## 2. Energy Efficiency and Part-Load Performance: VRF Leads

This is VRF's home turf. Inverter-driven compressors modulate continuously to match the load, and heat-recovery configurations move rejected heat from zones in cooling to zones in heating simultaneously — a trick neither RTUs nor splits can perform. Part-load efficiencies (IEER and the seasonal metrics in ASHRAE 90.1's tables) are typically the best of the three, and the zoning granularity means unoccupied zones simply idle instead of being conditioned.

Modern RTUs have closed much of the gap. High-efficiency packaged units with variable-speed compressors, variable-air-volume supply fans, and advanced economizer controls post strong IEER numbers and satisfy ASHRAE 90.1's efficiency tables comfortably. For single-zone spaces with uniform loads — a warehouse office, a big-box retail floor — a well-selected RTU is genuinely efficient because the load profile matches what packaged equipment does best.

Split systems are efficient at small scale but lose ground as buildings grow. Each system is an island: no heat recovery between zones, duplicated standby losses across many compressors, and limited modulation on basic single-stage equipment. High-end variable-capacity mini-split and multi-split variants improve the picture for small zones but do not scale to whole-building efficiency the way VRF does.

> Match the system to the load profile, not the brochure. A high-efficiency RTU serving a uniform retail floor will beat a VRF system forced to serve that same uniform load at a 30 percent cost premium.

## 3. Zoning and Occupant Control: VRF Dominates

If the building needs many independently controlled zones — a medical office with exam rooms, a restaurant with dining, kitchen, and bar, a multi-tenant retail strip — VRF is purpose-built for the job. Dozens of indoor units on one refrigerant network, each with its own thermostat, each heating or cooling independently, all coordinated by the system controller. Tenant improvement becomes a piping branch and an indoor unit rather than a new rooftop unit.

RTUs zone through the duct system: VAV boxes with reheat, or multiple RTUs each serving a zone. It works well and every controls contractor understands it, but each additional zone adds ductwork, boxes, and controls cost, and the granularity tops out well below VRF's.

Split systems zone by multiplication — one system per zone. That is simple and robust for a handful of zones (a small office with four splits is perfectly reasonable) but becomes a maintenance and aesthetic headache at scale: a roof or pad crowded with condensing units, each needing service clearance and electrical.

<Callout type="tip">Count the zones before choosing the system. Under about six zones, splits or RTUs are usually the economical answer. Past a dozen independently controlled zones, VRF's zoning advantage starts to pay for its premium.</Callout>

## 4. Footprint, Routing, and Structural Impact

RTUs live on the roof, which keeps mechanical equipment out of rentable space — but the roof must carry them. Structural engineers need unit weights, curb locations, and seismic anchorage early; a late RTU substitution that adds two tons of steel to the roof is a structural change order. Ductwork runs below the roof deck, which suits single-story buildings and top floors but gets awkward serving lower floors.

VRF's outdoor units also sit outside (roof, grade, or balcony), but the indoor units are compact — wall, ceiling cassette, or concealed ducted — and the refrigerant piping between them is small-diameter copper that threads through tight spaces far more easily than ductwork. The trade-off is refrigerant charge: long piping runs mean large refrigerant quantities, which triggers ASHRAE 15 safety limits on refrigerant concentration in occupied spaces. Large VRF systems need a documented refrigerant concentration calculation, and some layouts require mitigation like ventilation or shutoff valves.

Split systems need an outdoor spot for every condensing unit plus indoor space for every air handler. On a small building that is trivial; on a large one it consumes real estate and complicates the electrical distribution, since each system needs its own circuit, disconnect, and breaker.


![A VRF outdoor unit installed alongside conventional ducted rooftop equipment on a commercial building.](/generated/blog/inline/commercial-hvac-rtu-vs-vrf-vs-split-1.webp)


## 5. Maintenance and Lifecycle: Simplicity Has Value

RTUs are the easiest to maintain and replace. Filters, belts, and coils are accessible from the roof, parts are standardized across manufacturers, and any commercial HVAC technician can service them. At end of life, a crane swaps the box in a day.

VRF demands factory-trained technicians. The systems are reliable, but diagnostics run through proprietary controllers, and a failed inverter board or branch controller is a specialized part with a specialized price. Owner teams without VRF experience should budget for a service contract with a qualified contractor — and verify that contractor exists in the project market before committing to the design.

Split systems are simple individually but multiply the maintenance burden: twenty condensing units means twenty sets of filters, coils, and contactors to service, and twenty eventual replacements scattered across the site.

## 6. Code and Refrigerant Considerations

All three approaches must clear the same code hurdles, but different ones bind. ASHRAE 90.1's economizer requirement (air economizers on cooling systems at or above 54,000 Btu/h in most climate zones) applies naturally to RTUs, which integrate economizers as factory options — it is a design constraint for larger VRF and split applications that must meet it another way. Demand control ventilation for high-occupancy spaces, energy recovery thresholds, and fan power limits in 90.1 Section 6.5 shape the airside design regardless of system type.

Refrigerant safety under ASHRAE 15 and the IMC deserves special attention for VRF: the total system charge relative to the smallest occupied space served must stay within allowable concentration limits, or mitigation is required. Document this calculation in the drawing set — it is increasingly a plan review comment on VRF projects. Also note the industry's refrigerant transition: new equipment is moving to lower-GWP refrigerants (A2L classifications), which carry their own handling and code requirements. Specify the refrigerant explicitly and confirm local code acceptance.

<Callout type="warning">Never finalize a VRF layout without the ASHRAE 15 refrigerant concentration calculation. Finding out at plan review that the smallest conference room exceeds the limit means rerouting piping or adding mitigation — both expensive after the drawings are done.</Callout>

## 7. How to Choose: A Quick Decision Framework

There is no universal winner, but most projects fall into a clear answer once the criteria are scored honestly:

<Checklist>
- [ ] Under 6 zones with uniform loads and a tight budget: packaged RTUs
- [ ] 6 to 12 zones, or a mix of heating and cooling needs: compare high-efficiency RTUs with VAV against VRF on lifecycle cost
- [ ] Over 12 independently controlled zones, or simultaneous heating and cooling: VRF with heat recovery
- [ ] Small building, phased tenant fit-out, simple ownership: split systems
- [ ] Roof structure cannot take packaged unit weights: VRF or splits to reduce structural demand
- [ ] Owner lacks access to VRF-trained service: default to RTUs regardless of efficiency modeling
- [ ] Utility incentives or energy targets demand peak part-load performance: model VRF against high-efficiency RTUs and let the numbers decide
</Checklist>

Run the lifecycle math before deciding: first cost, modeled energy cost over 15 to 20 years, maintenance contracts, and replacement timing. VRF's premium frequently pays back in buildings with diverse, simultaneous loads and high energy rates; it rarely pays back in a single-zone warehouse in a mild climate. The honest analysis beats brand loyalty every time.

> The right system is the one that fits the building's zones, the owner's maintenance capability, and the local code — in that order. Efficiency ratings only matter after those three are satisfied.

Selecting the system architecture is the first mechanical decision on a commercial project, and everything downstream — duct routing, electrical loads, structural coordination, controls — follows from it. Our engineers design all three approaches and produce [permit-ready commercial HVAC drawings](/services/mechanical-design/hvac-design) with the load calculations, equipment schedules, and code documentation reviewers expect. [Request a quote](/request-quote) and we will help you pick the right system for your building.`,
    meta: { pullQuotes: ["Match the system to the load profile, not the brochure. A high-efficiency RTU serving a uniform retail floor will beat a VRF system forced to serve that same uniform load at a 30 percent cost premium.", "The right system is the one that fits the building's zones, the owner's maintenance capability, and the local code — in that order."] },
  },
  {
    slug: "residential-electrical-load-calculation-nec",
    title: "Electrical Load Calculation for Residential Buildings: NEC Guide",
    excerpt: "Sizing a home's electrical service is not guesswork — it is a code-prescribed calculation. This guide walks through both NEC Article 220 methods with a fully worked 2,000 sq ft example, so your service size, panel schedule, and permit set all agree.",
    template: "TECHNICAL_GUIDE",
    category: "electrical",
    tags: ["NEC Article 220", "load calculation", "residential"],
    discipline: "electrical",
    readMinutes: 8,
    featured: false,
    daysAgo: 9,
    bodyMdx: `Every residential electrical plan set starts in the same place: the load calculation. Before a single breaker is scheduled or a feeder is sized, NEC Article 220 requires you to prove — on paper — how many volt-amperes the dwelling will demand. Get this number right and everything downstream (service size, feeder conductors, panel schedule, utility approval) falls into place. Get it wrong and you will either pay for copper you do not need or fail plan review with an undersized service.

This guide covers both code-approved paths for dwellings, works a complete numerical example using the standard method, and flags the five mistakes we see most often on residential permit sets.

## Why the load calculation decides everything

The service size is the single most expensive decision in a residential electrical design. A 200-amp service versus a 400-amp service changes the meter equipment, the service conductors, the panel, and often the utility's transformer assessment. Article 220 exists so that decision rests on a documented calculation rather than a rule of thumb.

> The load calculation is the only part of the design the plan reviewer can verify with a calculator. Make it clean, make it traceable, and the rest of your review goes faster.

A proper calculation also protects the homeowner. Undersized services show up years later as nuisance main-breaker trips when an EV charger, a hot tub, or a heat-pump conversion gets added. A good drafter sizes for the house as built — and leaves documented headroom for what comes next.

## Two approved paths: the standard method and the optional method

NEC Article 220 gives you two ways to calculate a dwelling load:

**The standard method (220.40 through 220.61)** breaks the house into load categories — general lighting and receptacles, small-appliance and laundry circuits, fixed appliances, dryer, range, and HVAC — and applies a specific demand factor to each. It is more arithmetic, but it is always permitted and it usually produces the smaller number.

**The optional method (220.82)** is a streamlined alternative for a single dwelling unit served by a single set of service or feeder conductors, where the service is rated 100 amperes or more. You total the connected load, apply one demand structure (the first 10 kVA of general and appliance load at 100 percent, the remainder at 40 percent), take HVAC at 100 percent of the larger system, and add 25 percent of the largest motor.

<Callout type="tip">When in doubt, run both methods. The code lets you use either one, so the smaller result is the one you are allowed to build to — and showing both on your calc sheet impresses plan reviewers.</Callout>

Neither method is a suggestion. Your permit set must state which method was used, and the numbers on the panel schedule must match the calculation exactly.

## The standard method, step by step

Here is the sequence we follow on every residential project:

<Checklist>
- [ ] Measure the floor area from outside dimensions and multiply by 3 VA per sq ft for general lighting (Table 220.12)
- [ ] Add two small-appliance circuits at 1,500 VA each and one laundry circuit at 1,500 VA (220.52)
- [ ] Apply the 220.42 demand: the first 3,000 VA at 100 percent, the next 117,000 VA at 35 percent, the remainder at 25 percent
- [ ] List every fixed appliance at nameplate; if there are four or more, apply the 75 percent demand of 220.53
- [ ] Size the dryer at 5,000 VA or its nameplate rating, whichever is greater (220.54)
- [ ] Size the range from Table 220.55, Column C — a 12 kW range counts as 8 kW of demand
- [ ] Take the larger of the air-conditioning or heating load at 100 percent (220.60 — you never count both)
- [ ] Add 25 percent of the largest motor load (220.50)
- [ ] Divide total volt-amperes by the service voltage to get amperes, and select the next standard service size
</Checklist>

Two details drafters get wrong: the range demand comes from the table, not the nameplate, and HVAC is an either/or proposition — the code assumes you are not heating and cooling the house at the same time.


![An open residential load center with neatly landed branch circuits — the panel schedule for this panel must trace back to the NEC Article 220 load calculation.](/generated/blog/inline/residential-electrical-load-calculation-nec-1.webp)


## Worked example: a 2,000 sq ft home, gas heat, 240/120V service

Let us run the standard method on a typical new home: 2,000 sq ft, gas furnace with a 4-ton air conditioner, a 12 kW electric range, a 5 kW electric dryer, a 4.5 kW water heater, a 1.2 kW dishwasher, and an 800 VA disposal.

**General loads.** Lighting: 2,000 × 3 = 6,000 VA. Small-appliance: 2 × 1,500 = 3,000 VA. Laundry: 1,500 VA. Subtotal: 10,500 VA. Apply 220.42: the first 3,000 VA at 100 percent = 3,000 VA; the remaining 7,500 VA at 35 percent = 2,625 VA. Demand total: **5,625 VA**.

**Fixed appliances.** Dryer 5,000 + water heater 4,500 + dishwasher 1,200 + disposal 800 = 11,500 VA. Four or more appliances, so 220.53 allows 75 percent: **8,625 VA**.

**Range.** 12 kW nameplate → Table 220.55, Column C → **8,000 VA** of demand.

**HVAC.** The 4-ton A/C nameplates at 6,700 VA. The gas furnace blower is smaller, so the A/C governs at 100 percent: **6,700 VA**.

**Largest motor.** The compressor draws roughly 4,800 VA of the A/C total; 25 percent = **1,200 VA**.

**Total:** 5,625 + 8,625 + 8,000 + 6,700 + 1,200 = **30,150 VA**. Divide by 240 volts: **125.6 amperes**.

A 125-amp service is not a standard size, so the minimum code-legal service is 150 amps — but no experienced designer would stop there. The industry standard for a home like this is a **200-amp service**, which leaves roughly 75 amps of headroom for an EV charger or future electrification. Note that 220.61 also permits a reduced neutral calculation, which is why the neutral conductor on the drawings is often smaller than the phase conductors.

## The optional method as a cross-check

Run the same house through 220.82: the general load of 10,500 VA becomes 10,000 at 100 percent plus 500 at 40 percent = 10,200 VA. Fixed appliances go in at 100 percent of nameplate = 11,500 VA. The range still takes its Column C demand of 8,000 VA. HVAC at 6,700 VA, plus the 1,200 VA motor adder. Total: **37,600 VA**, or **156.7 amps** — which forces a 200-amp service.

The optional method is faster but less forgiving: it lands about 25 percent higher here. That is the trade the code offers you — less arithmetic for a larger service. On this house both methods agree on the practical answer: install 200 amps.

## Five mistakes that fail plan review

**1. Sizing everything at 100 percent.** Demand factors are not optional adjustments; they are the calculation. A reviewer who sees no 220.42 or 220.53 math will redline the sheet.

**2. Forgetting the 25 percent largest-motor adder.** It is a small number that reviewers always check, because 220.50 is one of the most commonly skipped sections.

**3. Treating the EV charger like a receptacle.** EV supply equipment is a continuous load. Per 625.41 the circuit must be sized at 125 percent of the maximum load — a 48-amp charger needs a 60-amp circuit — and that 125 percent figure belongs in the service calculation. A 48-amp charger adds 14,400 VA at 240 volts, which is more than the entire general-lighting demand of our example house.

**4. Using range nameplate instead of Table 220.55.** The table exists because cooking loads are inherently diverse. Using 12 kW instead of 8 kW inflates the service for no reason.

**5. A panel schedule that disagrees with the calc.** The connected load on the schedule and the demand load on the calculation are different numbers, and both must appear — but the service size must trace back to the calculation, not the schedule total.

> If the plan reviewer cannot follow your arithmetic from the floor area to the service size in under two minutes, the sheet is not done.

## What your permit set should show

A complete residential electrical submittal includes the load calculation sheet (method stated, every line item labeled with its code section), a panel schedule whose demand column matches the calculation, and a single-line diagram showing the service size the calculation justifies. When those three documents agree, the electrical portion of plan review is usually the fastest part of the permit.

If you would rather have the calculation done right the first time, our [electrical load calculation service](/services/calculations-reports/electrical-load-calculation) produces stamped, reviewer-ready calc sheets with matching [single-line diagrams](/services/electrical-design/single-line-diagram) for permit submittals in all 50 states. Send your floor plans to [/request-quote](/request-quote) and we will turn a complete electrical package around in days, not weeks.`,
    meta: { pullQuotes: ["The load calculation is the only part of the design the plan reviewer can verify with a calculator.", "A 48-amp EV charger adds more load than the entire general lighting of a typical home — size for it now."] },
  },
  {
    slug: "commercial-electrical-load-calculation-nec",
    title: "Commercial Electrical Load Calculation: Step-by-Step NEC Guide",
    excerpt: "Commercial load calculations punish guesswork: lighting, receptacles, kitchen equipment, and HVAC each carry their own demand factors. This step-by-step NEC guide works a full restaurant example from floor area to service size.",
    template: "TECHNICAL_GUIDE",
    category: "electrical",
    tags: ["NEC 220", "commercial", "demand factors"],
    discipline: "electrical",
    readMinutes: 8,
    featured: false,
    daysAgo: 10,
    bodyMdx: `Commercial electrical load calculations are where residential rules of thumb go to die. A restaurant, an office, or a retail space mixes lighting, receptacle, motor, kitchen, and HVAC loads that each follow different NEC Article 220 demand rules — and the plan reviewer will check every one of them. This guide walks the standard method for non-dwelling occupancies step by step, works a complete restaurant example with real numbers, and covers the optional methods the code allows when the standard path does not fit.

## Why commercial calculations are a different animal

In a dwelling, the code hands you generous demand factors because residential loads are diverse by nature — not every appliance runs at once. Commercial occupancies get no such charity. Under 220.42, most non-dwelling occupancies take their general lighting load at 100 percent, because in a restaurant or office the lights genuinely are all on at the same time.

The stakes are also higher. An undersized commercial service means a main breaker trip during Friday dinner service or a failed inspection that delays a certificate of occupancy. An oversized one means thousands of dollars in switchgear, conductors, and utility charges for capacity nobody uses. The calculation is the document that keeps both outcomes off the table.

> In commercial work, the load calculation is a financial document as much as an engineering one — it sizes the most expensive equipment in the building.

## The standard method for non-dwelling occupancies

The standard method lives in 220.40 through 220.61, and the sequence for a commercial building looks like this:

<Checklist>
- [ ] Compute general lighting from Table 220.12 using the occupancy type and floor area
- [ ] Add receptacle loads at 180 VA per outlet (220.14) and apply the 220.44 demand
- [ ] Add fixed multi-outlet assemblies, signs, and show-window lighting per 220.43 and 220.44
- [ ] List motors and take 125 percent of the largest motor (220.50, Article 430)
- [ ] Add commercial cooking equipment with Table 220.56 demand factors
- [ ] Add HVAC at 100 percent of the largest system — heating or cooling, never both (220.60)
- [ ] Total the volt-amperes, divide by the system voltage, and select the service size
</Checklist>

The single biggest conceptual shift from residential work: each load category keeps its own identity all the way to the total. You do not blend lighting and receptacles into one "general" number the way the dwelling methods do.

## Demand factors that actually move the number

Four demand rules do most of the work in a commercial calculation:

**Lighting (Table 220.12 and 220.42).** The volt-amperes per square foot come from Table 220.12 by occupancy — a restaurant dining area is 2 VA per sq ft, for example. Then 220.42 applies: dwelling units, hospitals, hotels, and warehouses get reduced demand factors, but nearly every other commercial occupancy takes lighting at 100 percent.

**Receptacles (220.44).** The first 10 kVA of receptacle load counts at 100 percent; everything above that counts at 50 percent. On a receptacle-heavy occupancy this single rule can shave 20 percent off the service size, so count your outlets carefully — 220.14(I) values each receptacle at 180 VA.

**Motors (220.50).** Take 125 percent of the full-load current of the highest-rated motor, plus 100 percent of the rest. For HVAC-heavy buildings this adder is significant, and it applies to the largest motor in the entire calculation, not per system.

**Kitchen equipment (Table 220.56).** Commercial cooking equipment gets its own demand table based on the number of units: six or more pieces of equipment may be calculated at 65 percent of the connected load. This is the rule that keeps restaurant services sane — without it, every fryer, oven, and warmer at nameplate would demand absurd service sizes.

<Callout type="warning">Do not apply Table 220.56 to dwelling-unit cooking equipment or 220.55 to commercial kitchens. The two tables look similar and serve opposite occupancies — mixing them up is a classic plan-review red flag.</Callout>


![A commercial panelboard with three-phase breakers — receptacle, lighting, motor, and kitchen loads each keep their own demand factors all the way to the service total.](/generated/blog/inline/commercial-electrical-load-calculation-nec-1.webp)


## Worked example: a 3,000 sq ft restaurant, 208Y/120V three-phase

Consider a 3,000 sq ft restaurant with a dining room, a commercial kitchen with six pieces of electric cooking equipment, a 10-ton rooftop unit, and an illuminated sign.

**General lighting.** 3,000 sq ft × 2 VA per sq ft (Table 220.12, restaurants) = 6,000 VA. Restaurants fall under "all others" in 220.42, so demand is 100 percent: **6,000 VA**.

**Receptacles.** Sixty duplex receptacles × 180 VA = 10,800 VA. Per 220.44: the first 10,000 VA at 100 percent = 10,000 VA; the remaining 800 VA at 50 percent = 400 VA. Demand total: **10,400 VA**.

**Kitchen equipment.** Fryer 12 kW, convection oven 9 kW, range 10 kW, food warmer 3 kW, dishwasher booster heater 6 kW, mixer 2 kW — six units totaling 42 kW. Table 220.56 permits 65 percent for six or more units: 42,000 × 0.65 = **27,300 VA**.

**HVAC.** The 10-ton rooftop unit nameplates at MCA 45 amps. At 208 volts three-phase: 45 × 208 × 1.732 = 16,211 VA, taken at 100 percent: **16,200 VA**.

**Sign.** One electric sign per 220.43(A): **1,200 VA**.

**Largest motor.** The RTU compressor is the largest motor at roughly 30 amps: 30 × 208 × 1.732 × 25 percent = **2,700 VA**.

**Total:** 6,000 + 10,400 + 27,300 + 16,200 + 1,200 + 2,700 = **63,800 VA**. Divide by (208 × 1.732 = 360.3): **177 amperes**.

The minimum code-legal service is 200 amps, the next standard size above 177. In practice, most restaurant owners approve a 400-amp service here — the incremental cost of the larger gear is small compared to the cost of a second service upgrade when the menu (and the kitchen equipment list) grows.

A note on the neutral: 220.61 permits a reduced neutral calculation based on maximum unbalanced load, but in a three-phase wye system serving significant nonlinear kitchen and lighting loads, engineers frequently keep the neutral at full size. Document whichever choice you make.

## When you may use the optional methods

The standard method is always permitted, but Article 220 Part IV offers alternatives for specific situations:

**Existing buildings (220.87).** If the building has 12 months of recorded maximum demand data — typically from the utility, in 15-minute intervals — you may calculate the existing load at 125 percent of that peak plus 100 percent of all new loads. This is the fastest legitimate path for tenant improvements and additions, but the data must be real: estimated or extrapolated demand does not qualify.

**Schools (220.86).** New schools get their own simplified VA-per-square-foot method, which usually produces a smaller service than the standard calculation.

**New restaurants (220.88).** All-electric kitchens and not-all-electric kitchens each get prescribed volt-amperes per square foot applied separately to kitchen and dining areas. It is purpose-built for exactly the occupancy in our example, and it is worth running as a cross-check — the code lets you use whichever method you prefer.

> Run the optional method as a cross-check even when you submit the standard one. If the two answers disagree wildly, one of them has an arithmetic error.

## Mistakes that stall commercial permits

The errors we correct most often on commercial submittals: applying dwelling demand factors to commercial occupancies, counting both heating and cooling in 220.60, omitting the 125 percent largest-motor adder, sizing the service from the panel schedule total instead of the calculated demand load, and submitting a calculation with no stated method. A reviewer who cannot tell which Article 220 part you used will assume the worst and ask for a resubmittal.

Another quiet killer is the receptacle count. Designers routinely underestimate outlets in dining and retail spaces, and 180 VA per receptacle adds up fast. Walk the floor plan and count honestly — the reviewer will.

## What a permit-ready calculation package looks like

A commercial electrical submittal that sails through review contains the load calculation with the method and every code section labeled, panel schedules whose demand columns match the calculation, a riser or [single-line diagram](/services/electrical-design/single-line-diagram) showing the service size the math justifies, and an [electrical system design](/services/electrical-design/electrical-system-design) narrative tying the numbers to the actual equipment. When all four agree, the electrical review becomes a formality.

Our [electrical load calculation service](/services/calculations-reports/electrical-load-calculation) delivers exactly that package — stamped calculations, coordinated panel schedules, and permit-ready drawings for restaurants, retail, offices, and mixed-use buildings nationwide. Upload your plans at [/request-quote](/request-quote) and get a fixed-fee proposal within one business day.`,
    meta: { pullQuotes: ["In commercial work, the load calculation is a financial document as much as an engineering one.", "Count your receptacles honestly — at 180 VA each, the reviewer certainly will."] },
  },
  {
    slug: "amps-watts-breaker-size-hvac-equipment",
    title: "How to Calculate Amps, Watts and Breaker Size for HVAC Equipment",
    excerpt: "HVAC nameplates list MCA and MOCP — two numbers that confuse even experienced electricians. Learn what they mean, how NEC Article 440 sizes the wire and breaker differently, and work two complete examples from condenser to rooftop unit.",
    template: "TECHNICAL_GUIDE",
    category: "electrical",
    tags: ["MCA", "MOCP", "breaker sizing", "NEC 440"],
    discipline: "electrical",
    readMinutes: 6,
    featured: false,
    daysAgo: 11,
    bodyMdx: `Few things on a set of electrical drawings generate more RFIs than the HVAC schedule. The mechanical engineer lists MCA 29 and MOCP 50, the electrician asks why the breaker is bigger than the wire, and the inspector wants to see the Article 440 math. This guide settles it: the three formulas that convert between amps and watts, what MCA and MOCP actually require, and two fully worked examples — a residential condenser and a three-phase rooftop unit.

## The three formulas you actually need

Everything in this article derives from three relationships. For single-phase resistive loads like electric heat strips:

Watts = Volts × Amps, so Amps = Watts ÷ Volts. A 5 kW heat strip at 240 volts draws 5,000 ÷ 240 = 20.8 amps.

For single-phase motors and anything with a power factor below unity:

Amps = Watts ÷ (Volts × Power Factor). A motor delivering real power at 0.85 power factor draws more current than the resistive formula suggests, because some current sustains the magnetic field without doing work.

For three-phase equipment — which is most commercial HVAC:

Amps = Watts ÷ (1.732 × Volts × Power Factor), and kVA = (Volts × Amps × 1.732) ÷ 1,000.

> If you remember only one number from this article, make it 1.732 — the square root of 3 — because it separates single-phase arithmetic from three-phase arithmetic, and mixing them up is the most common math error on HVAC schedules.

## Why the nameplate wins: MCA and MOCP

Every piece of HVAC equipment carries a nameplate with two ratings that govern the entire branch circuit design:

**MCA — Minimum Circuit Ampacity.** The smallest conductor ampacity the manufacturer allows. It already includes the NEC's 125 percent sizing for the compressor motor plus every other load that runs concurrently (condenser fan, controls). Size your wire to MCA and you are done with conductor sizing.

**MOCP — Maximum Overcurrent Protection.** The largest breaker or fuse permitted. This is a ceiling, not a target: any standard breaker size at or below MOCP is acceptable, provided it is large enough to start the equipment without nuisance tripping.

The nameplate values already encode the Article 440 calculations, and 440.4(C) effectively requires you to follow them. When the nameplate and your own math disagree, the nameplate wins — it reflects the manufacturer's tested combination of components.

## Sizing conductors: the 125 percent rule

Article 440 sizes HVAC conductors differently from ordinary branch circuits because hermetic refrigerant motors cannot be overloaded in the conventional sense — the equipment's internal overload protection handles that. The branch-circuit conductors only need to carry the running current with margin:

Per 440.32 and 440.33, conductor ampacity must be at least 125 percent of the rated-load current (RLA) of the largest motor, plus 100 percent of every other concurrent load. In formula form:

MCA = (1.25 × compressor RLA) + (all other loads at 100 percent)

This is exactly the number printed on the nameplate as MCA. If the nameplate says MCA 29, your conductors need 29 amps of ampacity — a 10 AWG copper conductor (30 amps at 60°C terminations) satisfies it, with no further upsizing required.

<Callout type="note">Watch your termination temperature ratings under 110.14(C). Most breakers and disconnects under 100 amps are rated 60°C or 75°C — use the lower of the two ratings at each end of the conductor when checking ampacity.</Callout>


![The equipment nameplate's MCA and MOCP ratings govern the entire branch circuit — when the nameplate and your math disagree, the nameplate wins.](/generated/blog/inline/amps-watts-breaker-size-hvac-equipment-1.webp)


## Sizing the breaker: the 225 percent rule

Here is the part that surprises people: the breaker protecting an HVAC circuit is routinely much larger than the wire it protects. That is not a mistake — it is the design.

Per 440.22, the overcurrent device for a hermetic motor-compressor circuit must not exceed 225 percent of the rated-load current (or the branch-circuit selection current, if the nameplate lists one). If 225 percent does not land on a standard breaker size, you are permitted to go up to the next standard size. The breaker provides short-circuit and ground-fault protection; the equipment's internal overloads protect the motor and, by extension, the conductors.

This split responsibility is the entire philosophy of Article 440: the breaker handles faults, the equipment handles overloads, and the wire is sized for the running current it will actually carry.

## Worked example 1: residential condenser

A residential condensing unit nameplates at: compressor RLA 21.6 amps, outdoor fan FLA 1.5 amps, 240 volts single-phase.

**Conductors.** MCA = (1.25 × 21.6) + 1.5 = 27 + 1.5 = 28.5 amps. The manufacturer will round this to MCA 29 on the nameplate. Conductors need 28.5 amps of ampacity: 10 AWG copper (30 amps at 60°C) is the correct minimum.

**Breaker.** MOCP limit = 2.25 × 21.6 = 48.6 amps. That is not a standard size, so the next size up is permitted: a **50-amp breaker**.

**Disconnect.** Per 440.12, the disconnecting means must be rated at least 115 percent of the nameplate current: 1.15 × (21.6 + 1.5) = 26.6 amps, so a 30-amp disconnect, located within sight of the unit per 440.14.

The finished circuit: 10 AWG copper conductors on a 50-amp breaker with a 30-amp disconnect. To anyone trained on ordinary branch circuits, a 50-amp breaker protecting 10 AWG wire looks like a violation. Under Article 440, it is the textbook-correct answer — and it is exactly what the inspector expects to see.

## Worked example 2: three-phase rooftop unit

A 10-ton rooftop unit nameplates at MCA 45 amps, MOCP 60 amps, 208 volts three-phase.

**Conductors.** MCA is given as 45 amps, so conductors need 45 amps of ampacity: 6 AWG copper (55 amps at 60°C) is the minimum. No calculation needed — the nameplate already did it.

**Breaker.** MOCP is 60 amps maximum. Select a **60-amp breaker** — or smaller if starting characteristics allow, but never larger than 60.

**Power check.** Apparent power: (208 × 45 × 1.732) ÷ 1,000 = 16.2 kVA. At 0.85 power factor, that is roughly 13.8 kW of real power — the number the mechanical engineer needs for the building load summary, and the number that belongs in your panel schedule's demand column.

<Callout type="tip">Always record both the MCA/MOCP pair and the computed kVA on your panel schedule. The electrician sizes wire and breaker from MCA/MOCP; the engineer verifying the service size needs the kVA.</Callout>

## Mistakes that cause nuisance trips or failed inspections

**Sizing the breaker to MCA.** A 30-amp breaker on our example condenser will start the unit most days — and trip on the hottest afternoon of the year when starting current peaks. The breaker must clear MOCP headroom for starting; that is what the 225 percent rule is for.

**Exceeding nameplate MOCP.** The 225 percent calculation is a ceiling that the nameplate then lowers. If your math says 70 amps but the nameplate says MOCP 50, the answer is 50. Installing the larger breaker is a direct violation.

**No disconnect within sight.** 440.14 requires the disconnect within sight of the equipment — not "in the same building," not "around the corner." This is one of the most cited HVAC violations in the field.

**Ignoring termination temperatures.** Conductors sized from the 90°C column but landed on 60°C-rated terminations are undersized, full stop. Check both ends under 110.14(C).

**Forgetting the HVAC load in the service calculation.** Every one of these branch circuits rolls up into the Article 220 service calculation at 100 percent of the larger of heating or cooling. An [electrical system design](/services/electrical-design/electrical-system-design) that sizes beautiful branch circuits but omits them from the service math will fail review at the last step.

Getting HVAC circuits right is a small part of every project and a frequent source of inspection failures. If you want the branch-circuit math, the panel schedules, and the service calculation to agree on the first submittal, send your mechanical schedules to [/request-quote](/request-quote) — we will produce a coordinated, permit-ready electrical package built around your actual equipment nameplates.`,
    meta: { pullQuotes: ["The breaker provides short-circuit protection; the equipment's internal overloads protect the motor. That split is the entire philosophy of Article 440.", "10 AWG wire on a 50-amp breaker looks like a violation. Under Article 440, it is the textbook-correct answer."] },
  },
  {
    slug: "commercial-electrical-service-upgrade",
    title: "Electrical Service Upgrade Requirements for Commercial Buildings",
    excerpt: "Adding load to a commercial building? A service upgrade touches the utility, the code, and the building's daily operations all at once. Here is the full sequence — load study, sizing, utility coordination, and cutover — done the way inspectors expect.",
    template: "STANDARD",
    category: "electrical",
    tags: ["service upgrade", "utility coordination", "NEC 230"],
    discipline: "electrical",
    readMinutes: 6,
    featured: false,
    daysAgo: 12,
    bodyMdx: `Nothing in commercial electrical work concentrates risk like a service upgrade. You are replacing the single point through which every watt in the building flows — which means the utility, the code, the inspector, and the building's tenants all get a vote. This guide covers the complete sequence: proving the existing service is inadequate, sizing the new one, coordinating with the utility, meeting the code requirements that changed in recent NEC cycles, and cutting over without shutting the business down.

## The five signs your service is undersized

Service upgrades are rarely elective. The usual triggers: the main breaker trips under normal operation; new loads are planned (EV charging, kitchen expansion, electrification of gas equipment) that the Article 220 calculation cannot absorb; the existing gear is obsolete, damaged, or has no available fault-current rating for today's utility system; the utility notifies you that the transformer or lateral is at capacity; or an insurance or sale inspection flags the service as a deficiency.

> A main breaker that trips "only in summer" or "only during events" is not a nuisance — it is the service telling you, in the clearest language it has, that the load has outgrown it.

The first step is never to order bigger gear. It is to document the inadequacy with numbers, because the utility and the authority having jurisdiction will both ask for proof before they approve anything.

## Step 1: prove the need with a real load study

You have two legitimate ways to establish the existing load. The gold standard for an operating building is NEC 220.87: take 12 months of recorded maximum demand data from the utility (in 15-minute intervals, the actual peaks, not averages), multiply the peak by 125 percent, and add 100 percent of every new load at its calculated value. Real metered data beats theoretical calculation every time, and most utilities will provide it on request.

When metered data is unavailable — a change of occupancy, a building that sat vacant, a gut renovation — run the full Article 220 standard calculation for the building as it will operate after the upgrade. Either way, the deliverable is a signed load study showing existing demand, new demand, and the total the new service must carry. Our [electrical load calculation service](/services/calculations-reports/electrical-load-calculation) produces exactly this document, formatted the way plan reviewers expect.

<Callout type="warning">Do not size the new service from the existing panel schedule total. The schedule shows connected load; the service must be sized from calculated demand. Sizing from connected load is how 400-amp buildings end up with 1,200-amp services.</Callout>

## Step 2: size the new service

Take a concrete case: an existing 400-amp, 208Y/120-volt service in a small commercial building. Twelve months of utility data show a peak demand of 290 amps. Per 220.87, the existing load counts as 290 × 125 percent = 362.5 amps. Planned additions: 60 amps of EV charging and an 80-amp kitchen expansion, both at 100 percent = 140 amps. Total calculated load: 502.5 amps.

502.5 amps is not a standard service size, so the new service must be the next standard size up: **600 amps** (per 240.6 standard ratings). That single decision cascades through the entire design — the meter equipment, the service conductors, the main disconnect, the grounding electrode conductor, and the available fault current all change.

Two judgments hide inside this step. First, growth allowance: if the owner has any credible plan for further expansion, stepping to 800 amps now is dramatically cheaper than a second upgrade later. Second, voltage: buildings still on 208Y/120 that are adding large motor or heating loads should evaluate 480Y/277 service, which cuts current nearly in half for the same power — but requires transformers for all 120-volt loads and a full distribution redesign.

## Step 3: coordinate with the utility — the step everyone underestimates

The utility is not a vendor; it is a co-designer of the service, and its timeline governs your project. Start coordination before you finish the drawings, not after. The utility will require a load letter stating the new demand, a service application with the proposed service size and voltage, and often an electrical site plan showing the proposed meter location, conduit routing, and transformer pad or vault.

Expect the utility to evaluate its own system: is the serving transformer large enough, does the lateral or overhead drop need upsizing, and where does metering live? Above roughly 400 amps, most utilities require current-transformer (CT) metering in a utility-approved CT cabinet rather than a self-contained meter — our 600-amp example will need one. The utility may also require a shutdown window for the cutover, temporary service arrangements, and a witness test before energizing.

<Checklist>
- [ ] Submit the load letter and service application with the calculated demand
- [ ] Confirm transformer and lateral capacity with the utility planner
- [ ] Verify metering requirements — CT cabinet above 400 amps in most territories
- [ ] Agree on the cutover date, shutdown window, and temporary power plan
- [ ] Confirm inspection and witness-test sequencing with both the AHJ and the utility
</Checklist>

Utility lead times of eight to sixteen weeks for transformer upgrades are normal. Every week you delay the application is a week added to the project, and no permit expedites the utility.


![A commercial service upgrade in progress — new switchgear and CT metering set alongside the existing service before the planned cutover.](/generated/blog/inline/commercial-electrical-service-upgrade-1.webp)


## Code requirements that bite on upgrades

A service upgrade must meet the current NEC, not the code the building was wired under. The requirements that most often surprise owners:

**Surge protection (230.67).** Since the 2020 NEC, all services require a listed surge protective device. On an upgrade, this is new equipment with its own breaker space and wiring — plan for it in the gear layout.

**Service disconnects (230.71).** The six-disconnect rule survives, but the 2020 NEC requires each service disconnect to be in a separate enclosure. Existing multi-disconnect lineups grandfathered under older codes cannot simply be swapped like-for-like.

**Disconnect location (230.70).** The service disconnect must be readily accessible and located nearest the point of entrance of the service conductors. Moving the service entrance to accommodate new gear often forces a redesign of the disconnect location.

**Fault current (110.9, 110.24).** Every piece of new service equipment must have an interrupting rating (AIC) at least equal to the available fault current, and the service equipment must be field-marked with the maximum available fault current. A larger service on the same utility transformer usually means higher fault current — verify the AIC ratings rather than assuming the old values still work.

**Working clearances (110.26).** New gear needs 3 feet of clear working depth, 30 inches of width, and 6.5 feet of headroom, dedicated and unobstructed. In retrofit electrical rooms, finding this space is frequently the hardest part of the design.

**Selective coordination.** Elevators (620.62) and fire pumps (695.27) require selective coordination of overcurrent devices — the upstream device must not trip before the downstream one clears the fault. New service gear serving these loads needs a coordination study, not just a breaker schedule.

## Grounding and bonding on a new service

A new service gets a new grounding electrode system, sized from scratch. The grounding electrode conductor is sized per Table 250.66 based on the new service conductor size — our 600-amp example with parallel 350 kcmil conductors needs a significantly larger GEC than the 400-amp service it replaces. Where a concrete-encased electrode (ufer ground) exists in the foundation, 250.52(A)(3) requires it to be used; supplement with ground rods only where the ufer is absent or tests above 25 ohms.

Bonding jumps out as the field failure point: the main bonding jumper at the service disconnect, bonding of the CT cabinet and meter enclosures, and bonding of all metallic piping systems per 250.104. On upgrades, the existing bonding is almost always undersized for the new service — include its replacement in the scope, not as an afterthought.

## Permitting and cutover: keeping the building running

The permit package for a service upgrade typically includes a demolition plan showing removed equipment, a new [single-line diagram](/services/electrical-design/single-line-diagram) from the utility point of connection through the new service gear, panel schedules, the Article 220 load study justifying the new size, a site plan with the service routing, and grounding details. Some jurisdictions also require an arc-flash risk assessment label per 110.16 on the new gear — confirm with the AHJ before submittal, because adding it after inspection is expensive.

The cutover itself is a construction plan, not just an electrical detail. For an occupied building, sequence the work: set and wire the new gear while the old service carries the building, schedule the utility shutdown (usually nights or weekends), land the new service conductors, and cut over in a single planned outage. Temporary power — a generator or a temporary utility feed — keeps life-safety systems, refrigeration, and IT loads alive during the window. Then comes the inspection sequence: rough/service inspection, utility witness test, and final — in that order, with no step skipped.

A [commercial power upgrade](/services/electrical-design/power-upgrade) done right is invisible to the tenants and uneventful for the inspector — which is exactly the outcome the planning buys. If you are weighing an upgrade, send your current one-line and twelve months of utility bills to [/request-quote](/request-quote). We will run the load study, size the new service, coordinate the drawings with your utility's requirements, and deliver a permit-ready package that keeps the building running through the cutover.`,
    meta: { pullQuotes: ["A main breaker that trips 'only in summer' is not a nuisance — it is the service telling you the load has outgrown it.", "Utility lead times of eight to sixteen weeks are normal. No permit expedites the utility."] },
  },
  {
    slug: "sizing-electrical-panels-feeders-nec",
    title: "How to Size Electrical Panels and Feeders Using NEC",
    excerpt: "Panel and feeder sizing is where a load calculation becomes hardware. This guide walks through NEC Article 215 — continuous loads at 125 percent, conductor ampacity with derating, overcurrent protection, voltage drop, and neutral sizing — with a fully worked commercial example.",
    template: "TECHNICAL_GUIDE",
    category: "electrical",
    tags: ["panel sizing", "feeders", "NEC 215"],
    discipline: "electrical",
    readMinutes: 7,
    featured: false,
    daysAgo: 13,
    bodyMdx: `A panel schedule is a promise: every breaker on it will carry its load without nuisance-tripping, overheating a termination, or starving equipment of voltage. Feeder and panel sizing is where that promise gets engineered. Size too small and you inherit callbacks, failed inspections, and overheated lugs. Size too big and you have paid for copper and gear the building will never use.

NEC Article 215 governs feeders — the conductors between the service equipment and the final branch-circuit overcurrent devices — and by extension the panels they land in. The sizing sequence never changes: calculate the load, size the conductor, size the overcurrent protection, check voltage drop, then size the neutral and ground. Do it in that order and the numbers defend themselves in plan review. Skip a step and the reviewer will find the one you skipped.

## 1. Start from the load, not the catalog

Article 215.2(A)(1) states the feeder rule plainly: feeder conductors must have an ampacity not less than the noncontinuous load plus 125 percent of the continuous load. A continuous load is one where the maximum current continues for three hours or more — commercial lighting is the classic example. The 125 percent factor is not a comfort margin; it accounts for heat buildup at terminations and in enclosed raceways when current flows for hours at a time.

Apply it before anything else. A 90-amp continuous lighting load needs 112.5 amps of conductor before you even think about derating — not 90. This single step is where most undersized feeders are born: the designer sizes to the connected load, forgets the continuous multiplier, and the feeder runs hot for its entire life.

> The feeder does not care what the panel is rated. Size the conductor to the calculated load, then pick hardware around it.

## 2. Worked example: sizing a 208Y/120V commercial feeder

Panel LP-1 serves a small retail tenant: 18 kVA of general lighting (continuous), 6 kVA of receptacles (noncontinuous), one rooftop unit with a 34-amp minimum circuit ampacity, and a 4.8-amp exhaust fan.

First convert everything to a common unit. The rooftop unit: 34 amps times 208 volts times 1.732, divided by 1000, equals 12.25 kVA. The exhaust fan: 4.8 times 208 times 1.732 divided by 1000 equals 1.73 kVA.

Now apply the feeder rule. Continuous load: 18 times 1.25 equals 22.5 kVA. Noncontinuous load: 6 plus 12.25 plus 1.73 equals 19.98 kVA. Total demand load equals 42.48 kVA.

Convert back to amps at the system voltage: 42,480 divided by (208 times 1.732) equals 117.9 amps. The feeder conductors must carry at least 118 amps — and that is the minimum before any temperature or bundling derating is applied.

## 3. Pick the conductor — then derate honestly

Table 310.16 gives 1/0 AWG copper THHN 150 amps in the 75-degree column. That looks generous against 118 amps, but the table value is a starting point, not an answer. Two adjustments apply.

First, the number of current-carrying conductors. This feeder runs in one raceway with three phase conductors plus a neutral. With LED lighting and other nonlinear loads, the neutral carries harmonic current and counts as current-carrying, so we have four conductors — an 80 percent adjustment factor. 150 times 0.80 equals 120 amps, still above 118. It passes, but barely, which is exactly the kind of margin a reviewer will probe.

Second, ambient temperature. At 30 degrees C the correction factor is 1.0 and we are done. But in a hot mechanical room at 40 degrees, the factor drops to 0.91: 150 times 0.91 times 0.80 equals 109 amps — now the 1/0 fails and the design moves up to 2/0. Always run both adjustments; the one you skip is the one that fails inspection.

<Callout type="warning">The 90-degree column in Table 310.16 is for derating math only. Section 110.14(C) limits most terminations to the 75-degree column, so your final ampacity can never exceed the 75-degree value no matter what the 90-degree math says.</Callout>


![Checking voltage at a panel under load — the field verification behind every voltage-drop calculation.](/generated/blog/inline/sizing-electrical-panels-feeders-nec-1.webp)


## 4. Size the overcurrent protection

Section 215.3 mirrors the conductor rule: the feeder overcurrent device must be rated not less than the noncontinuous load plus 125 percent of the continuous load — 118 amps in our example. Standard breaker sizes in 240.6 run 100, 110, 125 amps and up, so 118 lands between standards.

Section 240.4(B), the next-size-up rule, permits the next higher standard rating when the conductor ampacity does not match a standard size, for circuits up to 800 amps. Our derated conductor carries 120 amps, so a 125-amp breaker is permitted and it satisfies the 118-amp minimum. The panel becomes a 125-amp, 208Y/120-volt, 3-phase, 4-wire panelboard with a 125-amp main breaker.

Note what the next-size-up rule does not do: it does not let you protect a 100-amp conductor with a 125-amp breaker. The breaker steps up from the conductor ampacity — it never leaps past what the conductor can carry.

## 5. Check voltage drop before you finalize

Voltage drop lives in an informational note rather than a hard code limit — 215.2(A)(4) suggests 3 percent on the feeder and 5 percent total from service to outlet — but plan reviewers and owners both treat chronic undervoltage as a defect. Motors run hot, LED drivers misbehave, and the fix after drywall costs ten times what upsizing copper costs now.

The three-phase formula: voltage drop equals 1.732 times K times I times L, divided by circular mils, with K equal to 12.9 for copper. Our feeder runs 140 feet one-way in 1/0 copper (105,600 circular mils) at 118 amps: 1.732 times 12.9 times 118 times 140, divided by 105,600, equals 3.5 volts. That is 1.68 percent of 208 volts — comfortably inside the 3 percent guideline. Had it landed at 4 percent, the answer would be the next conductor size up, not a debate about whether the note is enforceable.

## 6. Size the neutral and the equipment ground

Section 220.61 sizes the feeder neutral for the maximum unbalanced load between the neutral and any one phase. In our retail panel the lighting is the dominant 120-volt load, and with LED drivers generating harmonics the conservative and common answer is a full-size neutral — 1/0 AWG, the same as the phase conductors. On feeders with genuinely balanced three-phase loads and little neutral current, 220.61 permits a reduced neutral, but the calculation must be shown on the drawings. Never reduce it by habit.

The equipment grounding conductor comes from Table 250.122, keyed to the overcurrent device: a 125-amp breaker requires 6 AWG copper. For the raceway, four 1/0 conductors plus a 6 AWG ground fit in 1-1/2-inch EMT on paper, but the pull is miserable — a 2-inch raceway is the professional choice, and it leaves room for the future circuit the tenant will inevitably add.

## Panel and feeder checklist

<Checklist items="Total the load at 100 percent noncontinuous plus 125 percent continuous;Convert the demand load to amps at the system voltage;Select a conductor from Table 310.16 and apply bundling and temperature derating;Verify the final ampacity against the 75-degree column per 110.14(C);Size the breaker to 215.3 using the next-size-up rule in 240.4(B);Check feeder voltage drop against the 3 percent guideline;Size the neutral per 220.61 and the ground per Table 250.122" />

Feeder sizing is arithmetic, but it is arithmetic the inspector redoes. Show every step — the load summary, the derating factors, the voltage-drop check — in the calculation set, and the review goes quiet. Our [electrical load calculation](/services/calculations-reports/electrical-load-calculation) service produces exactly that defensible package, and our [electrical system design](/services/electrical-design/electrical-system-design) turns it into permit-ready panel schedules and one-line diagrams. [Request a quote](/request-quote) with your equipment list and floor plans.`,
    meta: { pullQuotes: ["Size the conductor to the calculated load, then pick hardware around it.", "The 90-degree column is for derating math only — terminations drag you back to 75 degrees."] },
  },
  {
    slug: "ev-charger-load-calculation-panel-sizing",
    title: "EV Charger Electrical Load Calculation and Panel Sizing",
    excerpt: "Twelve 40-amp EV chargers can demand a 400-amp service addition — or fit on a 200-amp feeder. The difference is NEC Article 625 and a listed energy management system. This guide works the full calculation, from branch circuits to the panel schedule.",
    template: "TECHNICAL_GUIDE",
    category: "electrical",
    tags: ["EV charging", "NEC 625", "load management"],
    discipline: "electrical",
    readMinutes: 6,
    featured: false,
    daysAgo: 14,
    bodyMdx: `Electric-vehicle charging has quietly become the largest new load in commercial and multifamily electrical design. A single 40-amp charger is unremarkable. Twelve of them, added to a garage without a plan, is a service upgrade nobody budgeted for. NEC Article 625 governs the whole installation, and it contains one provision — the energy management system — that routinely cuts the calculated load in half or better. This guide works the complete calculation: branch circuits, feeder, panel, and the paperwork the reviewer expects.

## 1. The code treats every charger as a continuous load

Three rules in Article 625 shape everything downstream. First, 625.40 requires each EV charging outlet to be supplied by an individual branch circuit — no sharing a circuit between two chargers. Second, 625.41 sizes those branch-circuit conductors and overcurrent devices at 125 percent of the equipment rating, because EV charging is a continuous load by definition: sessions run for hours, exactly the condition the continuous-load multiplier exists for. Third, 625.42 sets the equipment rating rules and recognizes listed energy management systems, which we will come back to in section 3.

One more requirement to note early: receptacle outlets installed for EV charging require ground-fault personnel protection per 625.54, and most listed charging equipment includes it internally. Either way, the schedule should state which applies — it is a common review comment when it is missing.

## 2. Size each branch circuit from the nameplate

Take a typical commercial EVSE: 40 amps at 208 volts single-phase, fed with two poles from a 208Y/120-volt system. The branch-circuit math is short: 40 times 1.25 equals 50 amps minimum. That means 6 AWG copper conductors (65 amps in the 75-degree column of Table 310.16) on a 50-amp two-pole breaker, in a raceway sized for the run.

Twelve chargers means twelve individual 50-amp branch circuits — 24 pole spaces before you count anything else. Here is the point designers sometimes get wrong:

> Branch circuits are sized to the nameplate. Load management only ever touches the feeder and service calculation — never the circuit feeding the charger itself.

Even when an energy management system caps the total garage draw, each charger still gets its full 50-amp circuit. The 40-amp nameplate governs the branch circuit unconditionally.

## 3. The energy management system changes the feeder math entirely

Now the feeder. Without any management, the service calculation simply adds up the chargers: 12 chargers times 40 amps times 1.25 equals 600 amps of calculated load at 208 volts single-phase. That is 124.8 kVA, which on the three-phase side is 124,800 divided by (208 times 1.732) — about 346 amps. You are looking at a 400-amp service addition for a dozen chargers, plus the switchgear to feed it.

NEC 625.42, working with Article 750, offers the alternative: where a listed energy management system controls the chargers and caps their simultaneous draw, the calculated load may be the EMS-limited maximum rather than the sum of the nameplates. Suppose the EMS is configured — and listed — to cap the garage at 160 amps total. The calculation becomes 160 times 1.25 equals 200 amps at 208 volts single-phase: 41.6 kVA, or about 115 amps on the three-phase side. The same twelve chargers now fit on a 200-amp feeder instead of a 400-amp service addition.

<Callout type="note">The EMS must be listed for energy management, and its maximum current setting must be documented in the submittal. A reviewer will ask for the cut sheet showing the listed maximum — have it in the calculation package, not in a follow-up email.</Callout>


![A listed energy management system limiting simultaneous charger draw — the hardware behind the reduced feeder calculation.](/generated/blog/inline/ev-charger-load-calculation-panel-sizing-1.webp)


## 4. Worked example: the panel schedule for a 12-charger garage

With the EMS-capped calculation at 200 amps, the distribution is straightforward. Panel EV-1: 225-amp rated, 208Y/120-volt, 3-phase, 4-wire, 42-space panelboard with a 200-amp main breaker. The feeder: 200 amps of calculated load calls for 3/0 AWG copper (200 amps in the 75-degree column) protected at 200 amps. The twelve branch circuits are twelve 50-amp two-pole breakers — 24 spaces in a 42-space panel, leaving room for the expansion the owner will request next year.

The load table on the drawings should show both columns: the unmanaged nameplate total and the EMS-limited calculated load. Reviewers approve faster when they can see exactly what the EMS is saving and verify the setting against the cut sheet. The one-line diagram must show the EMS as part of the system, not as an afterthought box in the corner.

## 5. What the plan reviewer wants on the sheets

EV charging submittals fail review on documentation more than on math. The complete package: a one-line diagram showing the service, the EV panel, the EMS, and every charger; an EVSE schedule listing each unit's nameplate amps, voltage, branch-circuit size, and breaker; the load calculation table with the EMS-limited value clearly identified; the panel schedule; and a site or garage plan showing charger locations with raceway routing back to the panel. Required labeling and disconnecting means per Article 625 go on the schedule notes. When any one of these sheets is missing, the review stops until it appears.

## 6. Common review comments — and how to avoid them

The comments we see most often are predictable. The EMS cut sheet is missing, so the reviewer cannot verify the capped value. The load calculation uses the nameplate sum while the one-line shows an EMS, or vice versa — the two must tell the same story. Branch circuits are downsized to each charger's share of the EMS cap, which 625.41 does not permit. The GFCI personnel protection note is absent. The panel schedule has no spare spaces, which reads as a design with no future. And utility coordination is missing — many utilities require notification or a separate meter for EV loads above a threshold, and discovering that at permit time is painful.

<Callout type="tip">Send the utility the EV load letter early, with the EMS-limited value highlighted. Utilities size transformers from your letter, and an early conversation prevents a service upgrade surprise after the permit is issued.</Callout>

## EV charging checklist

<Checklist items="Give each charger its own branch circuit per 625.40;Size branch circuits at 125 percent of nameplate per 625.41;Never downsize a branch circuit because of load management;Document the listed EMS and its maximum setting per 625.42 and Article 750;Calculate the feeder and service from the EMS-limited value;Show managed and unmanaged totals side by side in the load table;Include the EMS cut sheet and the utility load letter in the submittal" />

EV charging is one of the few loads where the code hands you a legal way to cut the calculated total dramatically — but only if the energy management system is real, listed, and documented. Our [electrical load calculation](/services/calculations-reports/electrical-load-calculation) service builds the full NEC 625 package — branch-circuit schedule, EMS-limited feeder calculation, and the utility load letter — and our [electrical system design](/services/electrical-design/electrical-system-design) turns it into permit-ready drawings. [Request a quote](/request-quote) with your charger count and garage layout.`,
    meta: { pullQuotes: ["Twelve 40-amp chargers without management demand a 400-amp service addition. With a listed EMS, the same garage fits on a 200-amp feeder.", "Branch circuits are sized to the nameplate. Load management only ever touches the feeder and service calculation."] },
  },
  {
    slug: "commercial-plumbing-water-supply-pipe-sizing",
    title: "Commercial Plumbing Design: Water Supply Pipe Sizing Guide",
    excerpt: "Oversized pipe wastes money; undersized pipe starves the top floor. This guide works the IPC water-supply fixture-unit method end to end — fixture count to gallons per minute to pipe size — with a full restaurant example and a pressure budget.",
    template: "TECHNICAL_GUIDE",
    category: "hvac-plumbing",
    tags: ["pipe sizing", "IPC", "water supply"],
    discipline: "plumbing",
    readMinutes: 7,
    featured: false,
    daysAgo: 15,
    bodyMdx: `Water pipe sizing looks simple — bigger pipe, more water — until the inspector asks why the top-floor shower trickles when the kitchen is running. Commercial water distribution is sized by probability, not by adding up fixture flows, and the International Plumbing Code gives you the complete method in Appendix E. This guide works it end to end: fixture units, demand conversion, pipe sizing, and the pressure budget that proves the system works at the farthest fixture.

## 1. Fixture units: probability, not flow

The water-supply fixture unit (WSFU) is the currency of the whole method. Each fixture type gets a load value in IPC Table E103.3(1) — a flush-valve water closet in a public restroom carries far more units than a private lavatory, because it uses more water and is more likely to be used at the same time as its neighbors.

The key insight, from Roy Hunter's research that underlies the tables: fixtures in a building are almost never all running at once, and the probability math is well understood. Ten water closets do not need ten times the pipe of one water closet. The WSFU total goes through Table E103.3(2), which converts fixture units into an estimated demand in gallons per minute along that probability curve. The tables come in flush-tank and flush-valve columns — use the flush-valve column whenever flushometer valves are present, because their instantaneous demand dominates.

> Fixture units are not gallons per minute. They are probability — the Hunter curve converts likely simultaneous use into a design flow, and the tables convert that flow into pipe.

## 2. Worked example: counting a restaurant

Take a small restaurant with public restrooms. The fixture count:

- 6 water closets, flush valve, public: 6 times 10 equals 60 WSFU
- 4 urinals, flush valve: 4 times 5 equals 20 WSFU
- 8 lavatories, public: 8 times 2 equals 16 WSFU
- 2 service sinks: 2 times 3 equals 6 WSFU

Cold-water total: 102 WSFU. Running that through Table E103.3(2) on the flush-valve column gives an estimated demand of about 70 gallons per minute. Note how the curve flattens: 102 fixture units do not produce anything close to 102 times a single fixture's flow. That flattening is the entire economic point of the method — it is what keeps commercial pipe sizes sane.

Do the same count separately for the hot-water side using only the fixtures that take hot water. The hot-water main is sized on its own fixture-unit total, not as a fraction of the cold main.

## 3. From gallons per minute to pipe size

Table E103.3(3) converts demand into pipe size, indexed by developed length — the actual pipe run plus the equivalent length of every fitting — and by the available pressure range. Say our restaurant's main has 150 feet of developed length, plus fitting equivalents bringing it to roughly 225 feet, with 70 psi available at the service entrance. At about 70 gpm the table lands between 2-inch and 2-1/2-inch copper, and good practice rounds up: a 2-1/2-inch copper main.

Then verify velocity, the check the tables do not do for you. Velocity equals gpm divided by (2.448 times diameter squared): 70 divided by (2.448 times 6.25) equals about 4.6 feet per second in 2-1/2-inch pipe — comfortably under the 8-feet-per-second design limit that guards against water hammer, noise, and erosion. Had we forced 70 gpm through 2-inch pipe, velocity would approach 7 feet per second: legal on paper, loud and destructive in practice.

The same method sizes every branch. A restroom group totaling 30 WSFU converts to roughly 28 gpm; in 1-1/2-inch pipe that runs about 5 feet per second — fine. Work every segment from the farthest fixture back toward the service, carrying cumulative fixture units, and no segment gets starved.

<Callout type="warning">Velocity above 8 feet per second does more than make noise — it causes water hammer that breaks hangers and erodes copper from the inside at fittings. When a table gives you a size that pushes velocity past 8, the table is telling you to go up a size.</Callout>


![A pressure-reducing valve and gauge on a commercial water main — the field hardware behind the pressure budget.](/generated/blog/inline/commercial-plumbing-water-supply-pipe-sizing-1.webp)


## 4. Budget the pressure like money

Pipe size means nothing without pressure at the fixture. Build the budget from the service entrance to the highest, farthest outlet:

- Static loss from elevation: 0.433 psi per foot of rise. A 15-foot rise to the second floor costs 6.5 psi.
- Friction loss through the developed length: roughly 5 psi for our 225 equivalent feet at 70 gpm in 2-1/2-inch copper.
- Meter loss: allow about 8 psi for the water meter at design flow.
- Starting pressure: 70 psi.

Residual at the top fixture: 70 minus 6.5 minus 5 minus 8 equals about 50 psi — a healthy margin. If the math lands near the minimum the fixtures need, the fixes are upsizing the main, reducing equivalent length with a better route, or adding a booster pump — decided on paper, not discovered at final inspection. Show this budget on the drawings; it is the first thing a sharp reviewer reconstructs.

## 5. Meters, services, and pressure-reducing valves

Size the water meter to the design demand — about 70 gpm here points to a 2-inch meter in most utility standards — and confirm the utility's meter loss figure rather than guessing it, since it sits directly in your pressure budget. The building service from the main to the meter follows the same sizing method.

Where street pressure exceeds 80 psi, IPC 604.8 requires a pressure-reducing valve. Show it on the riser diagram with its set pressure, and remember that the PRV's own pressure drop belongs in the budget downstream of it. Thermal expansion control — an expansion tank on the water heater in a closed system with a PRV or check valve — belongs on the same riser.

## 6. Do not forget the hot-water side

Hot-water piping gets its own fixture-unit count and its own sizing pass; long commercial runs also need hot-water recirculation so the farthest fixture does not wait minutes for hot water, with the recirculation pump and balancing shown on the drawings. And every water heater connection needs its temperature-and-pressure relief discharge piped to an approved termination — drawn, not implied.

## Water supply sizing checklist

<Checklist items="Count water-supply fixture units per IPC Table E103.3(1), hot and cold separately;Convert WSFU to gpm with Table E103.3(2), using the flush-valve column where applicable;Size each segment from Table E103.3(3) using full developed length including fittings;Verify velocity stays under 8 feet per second on every segment;Build the pressure budget: elevation at 0.433 psi per foot, friction, meter, and PRV losses;Show the meter, PRV, and expansion control on the riser diagram" />

A water system sized by the fixture-unit method is economical, quiet, and defensible — every number traces back to a code table. Our [plumbing design](/services/mechanical-design/plumbing-design) service produces the full package: fixture-unit calculations, pipe sizing, pressure budgets, and permit-ready riser diagrams coordinated with the rest of the MEP set. [Request a quote](/request-quote) with your floor plans and fixture schedule.`,
    meta: { pullQuotes: ["Fixture units are not gallons per minute — they are probability.", "Budget pressure like money: elevation, friction, and the meter all take their cut before the top-floor fixture sees a drop."] },
  },
  {
    slug: "residential-drainage-vent-piping-sizing",
    title: "How to Size Drainage and Vent Piping for Residential Buildings",
    excerpt: "Drainage is sized by probability and vents are sized by protection. This IPC-based guide works a complete two-story home — drainage fixture units, building drain, stack, trap arms, and vent sizing — with every table reference you need.",
    template: "TECHNICAL_GUIDE",
    category: "hvac-plumbing",
    tags: ["DWV", "vent sizing", "IPC"],
    discipline: "plumbing",
    readMinutes: 6,
    featured: false,
    daysAgo: 16,
    bodyMdx: `Residential drainage design is gravity engineering with an air problem. The drain pipes carry waste downhill; the vent pipes, which carry nothing at all, keep the whole system working by protecting trap seals from siphonage. Size the drains wrong and fixtures back up. Size the vents wrong and traps siphon dry, letting sewer gas into the house. The IPC gives you both methods — drainage fixture units for the drain side, and vent sizing tables for the air side — and this guide works a complete two-story home through both.

## 1. Drainage fixture units: the currency of the drain side

Every fixture gets a drainage fixture unit (DFU) value in IPC Table 702.1, representing its probable drain load: a private water closet is 4 DFU, a lavatory is 1, a shower or bathtub is 2, a kitchen sink is 2, a dishwasher is 2, and a clothes washer is 3. Like water-supply fixture units, DFUs encode probability — not every fixture drains at once — so the totals convert through Table 710.1(1) into pipe sizes rather than scaling linearly.

One rule to internalize early: water closets dominate residential DFU counts. Three water closets contribute 12 DFU — nearly half of a typical home's total. Any fixture change involving a water closet ripples through the drain sizing, which is why bathroom additions trigger a recheck of the building drain.

## 2. Worked example: a two-story, three-bath home

The fixture count for our example house:

- 3 water closets at 4 DFU equals 12
- 4 lavatories at 1 DFU equals 4
- 2 showers at 2 DFU equals 4
- 1 bathtub at 2 DFU equals 2
- 1 kitchen sink at 2 DFU equals 2
- 1 dishwasher at 2 DFU equals 2
- 1 clothes washer at 3 DFU equals 3

Total: 29 DFU on the building drain. Every downstream sizing decision starts from this number, so put the fixture-unit schedule on the drawings — when the reviewer can follow your count, the review moves fast.

## 3. Size the building drain and the stack

Table 710.1(1) sizes horizontal drains and stacks by DFU at given slopes. A 3-inch building drain at 1/4-inch per foot handles 42 DFU — comfortably above our 29. A 3-inch soil stack handles 48 DFU, so the main stack is 3-inch as well.

Slope comes from IPC 704.1: piping 2-1/2 inches and smaller pitches at 1/4-inch per foot; 3-inch through 6-inch may pitch at 1/8-inch per foot. Note that our 3-inch drain at the steeper 1/4-inch pitch gains capacity (42 DFU versus 36 at 1/8-inch) — one reason 3-inch at quarter-inch pitch is the standard residential answer even when the DFU math would allow less. Do not overslope small pipe either: excessive pitch on a 2-inch line lets water outrun solids.


![Vent piping tying into a main stack in an attic — every trap below depends on this air path.](/generated/blog/inline/residential-drainage-vent-piping-sizing-1.webp)


## 4. Branches, trap arms, and slope

Horizontal fixture branches use the same Table 710.1(1) — a bathroom group branch carrying a water closet, lavatory, and shower totals 7 DFU, which a 3-inch branch handles with room to spare. The subtler limit is the trap arm: the horizontal pipe between a fixture trap and its vent. IPC Table 909.1 caps trap-arm length by size — a 1-1/2-inch trap arm may run 6 feet at 1/4-inch per foot, a 2-inch arm 8 feet. Exceed the length and the vent is too far away to protect the trap.

> Vents do not drain anything. Their job is air: letting air in behind draining water so traps are not siphoned dry.

Keep trap arms as short as the layout allows, even where the table permits more. A lavatory roughed in five feet from its vent works; the same lavatory at eighteen inches works better and inspects easier.

## 5. Size the vents

Vent minimums come first: no vent smaller than 1-1/4 inches (906.1), and individual fixture vents minimum 1-1/4 inches. Table 916.1 then sizes vents by the DFU served and the vent's developed length — longer vent runs need larger pipe to move enough air. Section 916.2 requires a vent stack to be at least one-half the diameter of the drain it serves, never smaller than 1-1/4 inches.

For our 29-DFU house, the standard answer is a 2-inch vent stack through the roof with 1-1/2-inch branch vents picking up the fixture groups. Where a vent run is unusually long — a far bathroom group with 40 feet of developed vent — check Table 916.1 rather than assuming; length is what pushes vents up a size, not fixture count alone.

## 6. Wet venting and cleanouts

IPC Section 912 permits wet venting for bathroom groups on the same floor: the lavatory drain doubles as the vent for the group, with a dry vent taken off at the upstream end. Done correctly it eliminates pipe and roof penetrations; done wrong — wrong fixture order, oversized group, missing dry vent — it is a guaranteed review comment. Draw the wet-vented group clearly on the riser so the reviewer sees the dry vent connection.

Cleanouts per IPC 708 go at the base of each stack, every 100 feet of horizontal run, and at direction changes over 45 degrees. They are the cheapest insurance in the system — show them on both the plan and the riser, because the inspector will look for them in the field.

<Callout type="tip">Draw every vent connection on the riser diagram, not just the drains. A riser that shows drains without vents tells the reviewer the venting was an afterthought — even when it was not.</Callout>

## Drainage and vent checklist

<Checklist items="Count drainage fixture units per IPC Table 702.1 and show the schedule;Size the building drain and stack from Table 710.1(1) at the designed slope;Pitch piping per 704.1: quarter-inch per foot for 2-1/2 inch and smaller;Keep trap arms within Table 909.1 lengths so vents protect the traps;Size vents from Table 916.1 by DFU served and developed length;Detail wet-vented groups per Section 912 with the dry vent shown;Provide cleanouts per 708 at stack bases, long runs, and direction changes" />

Drainage is sized by probability; vents are sized by protection. Get both right and the system works silently for decades — which is exactly what a drain system should do. Our [plumbing design](/services/mechanical-design/plumbing-design) service delivers the complete residential package: DFU calculations, drain and vent sizing, and permit-ready riser diagrams coordinated with the full MEP set. [Request a quote](/request-quote) with your floor plans and fixture schedule.`,
    meta: { pullQuotes: ["Vents do not drain anything. Their job is air — letting it in behind draining water so traps are not siphoned dry.", "Drainage is sized by probability; vents are sized by protection. The trap seal is the whole point of the system."] },
  },
  {
    slug: "plumbing-fixture-units-calculation",
    title: "Plumbing Fixture Requirements and Fixture Unit Calculations",
    excerpt: "Fixture units are the language plan reviewers speak. Here is how the IPC assigns water supply and drainage fixture units, how to convert them to real pipe sizes, and the mistakes that trigger corrections.",
    template: "STANDARD",
    category: "hvac-plumbing",
    tags: ["fixture units", "IPC", "plumbing code"],
    discipline: "plumbing",
    readMinutes: 6,
    featured: false,
    daysAgo: 17,
    bodyMdx: `Every plumbing plan review begins in the same place: the reviewer counts your fixtures, checks your fixture unit math, and decides whether your pipe sizes hold up. Get the fixture unit calculations right and the rest of the plumbing review usually follows. Get them wrong and you will be redrawing risers on a correction cycle.

Fixture units look like an arbitrary scoring system, but they are one of the most practical tools in the plumbing code. They translate a building full of toilets, sinks, and showers — each used intermittently and unpredictably — into pipe sizes that work in the real world. This guide walks through how the International Plumbing Code assigns fixture units, how to turn them into supply and drainage pipe sizes, and where designers most often go wrong.

## How the Fixture Unit Method Actually Works

The fixture unit method comes from research by Roy Hunter at the National Bureau of Standards in the 1940s. Hunter studied how often plumbing fixtures are actually used at the same time in different building types and built a probability curve from the data. A fixture unit is not a flow rate — it is a weighted measure of how much demand a fixture places on the system, accounting for the fact that not every fixture runs at once.

The IPC carries this method in Appendix E, which is the prescriptive path most designers use: assign fixture units from Table E103.3(2), total them, convert the total to an estimated demand in gallons per minute using Table E103.3(3), and size piping from there. The code also permits a fully engineered design as an alternative, but for permit work the Appendix E method is what reviewers expect to see. If your jurisdiction uses the Uniform Plumbing Code instead, the parallel path is UPC Table 610.3 — same concept, different numbers, so never mix the two in one calculation.

> A fixture unit measures the probability of simultaneous use, not the flow rate of the fixture. That single idea explains the entire method.

## Water Supply Fixture Units: Sizing the Supply Side

Table E103.3(2) assigns every fixture three values: hot water fixture units, cold water fixture units, and a total. The split matters because the hot and cold systems are sized separately — the water heater feed, the hot water recirculation loop, and the cold water main each see only their share of the load.

Take a small professional office with two single-occupant restrooms, each containing one flush-tank water closet and one lavatory. Under Table E103.3(2), a private bathroom group with a flush-tank water closet is assigned 6.0 total water supply fixture units: 2.7 on the hot side and 3.6 on the cold. Two restrooms give a building total of 12.0 fixture units — 5.4 hot, 7.2 cold. Those three numbers are the starting point for everything downstream: the service entrance size, the water heater capacity, and the branch piping.

A few rules govern the counting. Fixtures with continuous or semi-continuous flow — hose bibbs, mop sinks in some applications, and any fixture the code flags — are counted at their full fixture unit value with no diversity credit. And when a fixture can be supplied from either the IPC or UPC tables depending on the jurisdiction, the locally adopted code wins; the edition year on your code analysis sheet should match the tables you used.

<Callout type="tip">Keep the hot and cold columns separate all the way through your calculation schedule. Lumping everything into one total is how water heater feeds and recirculation loops end up undersized.</Callout>

## From Fixture Units to Gallons per Minute

Fixture units become useful the moment they are converted to an estimated demand. Table E103.3(3) does this with two curves: one for systems serving predominantly flush-tank water closets, and one for systems with flushometer valves. Find your total fixture units in the left column, read across on the correct curve, and you have the estimated supply demand in gallons per minute.

The two curves exist because flushometer valves create sharp, short bursts of high demand while flush tanks refill slowly. Using the wrong curve is the single most common error in supply-side calculations — a flushometer restroom core sized on the flush-tank curve will starve the valves at peak use, and the pressure drop shows up exactly when the building is busiest.

Once you have the demand in gpm, pipe sizing follows from the IPC's sizing tables with two guardrails every reviewer checks: velocity and pressure. Keep velocities in reasonable ranges to avoid water hammer and noise, respect the minimum pipe sizes in Table 604.3, and remember that IPC Section 604.8 caps static pressure at 80 psi — anything above that needs a pressure-reducing valve shown on the drawings, not just mentioned in the notes.


![A plumbing riser diagram showing how fixture units accumulate floor by floor to size supply risers and drainage stacks.](/generated/blog/inline/plumbing-fixture-units-calculation-1.webp)


## Drainage Fixture Units: Sizing the DWV Side

The drainage side uses its own unit system in Table 709.1. Representative values every plumbing designer should know by heart:

- Lavatory: 1 drainage fixture unit
- Bathtub or shower: 2 drainage fixture units
- Kitchen sink: 2 drainage fixture units
- Water closet, private: 4 drainage fixture units
- Water closet, public: 6 drainage fixture units

Back to the two-restroom office: each restroom contributes 4 for the water closet plus 1 for the lavatory, for 5 drainage fixture units per restroom and 10 total. Table 710.1(1) then sizes the building drain — a 3-inch building drain at minimum slope carries 36 drainage fixture units, so the 10 DFU load fits comfortably on a 3-inch line. For stacks in taller buildings, Table 710.1(2) limits how many fixture units can discharge into each stack interval, which is where multi-story calculations get interesting.

Slope is part of the sizing, not an afterthought. IPC Section 704.1 requires 1/4 inch per foot for piping 2-1/2 inches and smaller, 1/8 inch per foot for 3-inch through 6-inch pipe, and 1/16 inch per foot for 8-inch and larger. Show the slope on the plans with the pipe size — reviewers check both together.

## Mistakes That Trigger Plan Review Corrections

After years of plumbing submittals, the same corrections appear again and again:

1. Mixing IPC and UPC fixture unit values in a single calculation. Pick the adopted code and stay in its tables.
2. Using the flush-tank demand curve for a flushometer system, or vice versa.
3. Collapsing the hot and cold columns into one total, which hides undersized hot water piping.
4. Counting hose bibbs or other continuous-flow fixtures with diversity they are not allowed.
5. Exceeding the fixture unit loading on a stack interval in multi-story buildings.
6. Omitting the calculation schedule from the drawings entirely, leaving the reviewer nothing to verify.
7. Sizing to the tables of a newer code edition than the one the AHJ adopted.

Every one of these is avoidable, and every one costs a review cycle when it is not avoided.

## Showing Your Work on the Drawings

Reviewers do not take fixture unit math on faith — they re-check it. Make that easy and your permit moves faster. Put a water supply fixture unit schedule on the plumbing cover sheet listing every fixture type, its hot, cold, and total values, the code table cited, and the building totals. Do the same for drainage fixture units, tied to each stack and building drain. Draw the sanitary and domestic water riser diagrams with pipe sizes and fixture unit loads labeled at each segment, so the reviewer can trace your logic floor by floor without guessing.

<Callout type="note">Cite the exact code edition on your calculation schedule — for example, 2021 IPC Table E103.3(2). When the AHJ is on a different edition, that one line tells the reviewer which numbers to expect.</Callout>

Fixture unit calculations are not busywork. They are the documented reasoning that connects the fixtures on your floor plan to the pipe sizes in your riser diagram, and they are the first thing a reviewer verifies. Do them carefully, show them clearly, and the plumbing portion of your permit review becomes one of the quiet parts of the project.

*Need permit-ready plumbing drawings with verified fixture unit calculations? [Request a quote](/request-quote) and send us your floor plans — we will handle the schedules, risers, and code analysis.*`,
    meta: { pullQuotes: ["A fixture unit measures the probability of simultaneous use, not the flow rate of the fixture.", "Reviewers do not take fixture unit math on faith — they re-check it. Make that easy and your permit moves faster."] },
  },
  {
    slug: "mep-permit-drawing-requirements-usa",
    title: "MEP Permit Drawing Requirements in the USA: Complete Guide",
    excerpt: "What does an AHJ actually require in an MEP permit set? Sheet organization, calculation packages, code analysis sheets, fire protection tracks, and the digital submittal standards that decide whether your project is accepted or rejected on day one.",
    template: "TECHNICAL_GUIDE",
    category: "design-drafting",
    tags: ["permit drawings", "AHJ", "submittal"],
    discipline: "mep",
    readMinutes: 8,
    featured: false,
    daysAgo: 18,
    bodyMdx: `Submitting MEP drawings for a building permit is one of the most documentation-heavy steps in a construction project. The authority having jurisdiction does not just want to see where the ducts and panels go — it wants proof, in a specific format, that every system complies with the adopted codes. This guide covers what belongs in a US MEP permit set, what calculations must back it up, and how submittals actually get accepted.

## What the AHJ Is Actually Checking

It helps to understand the reviewer's job. The plan reviewer is not evaluating whether your design is elegant or cost-effective. They are verifying life safety and code compliance: that the mechanical system ventilates per code, that the electrical service is sized and protected per the NEC, that plumbing fixture counts and pipe sizing meet the plumbing code, and that fire protection criteria are correctly established.

In most jurisdictions the MEP review is split among separate reviewers — mechanical, electrical, and plumbing are often different people, sometimes different departments, each with their own correction letters. Some cities outsource review to third-party agencies, which tend to be thorough and literal about checklists. Either way, the winning strategy is the same: make each discipline's compliance independently verifiable without hunting through other disciplines' sheets.

> The reviewer is not judging your design. They are verifying compliance, one discipline at a time. Organize your set so each reviewer can do their job without reading the whole package.

## Anatomy of a Complete MEP Permit Set

A permit-ready MEP set typically follows this sheet structure, and reviewers notice when pieces are missing:

- Cover sheet with the code analysis: occupancy classification, construction type, applicable code editions with years, design team information, and the sheet index.
- Plumbing plans: floor plans at 1/4 inch equals 1 foot for most commercial work, with fixture locations, pipe routing, and sizes; sanitary and domestic water riser diagrams; plumbing schedules and details.
- Mechanical plans: floor plans showing ductwork, equipment locations, and piping; reflected ceiling plans coordinated with lighting; roof plans with equipment and curbs; ventilation calculations; equipment schedules; control diagrams or sequences.
- Electrical plans: power and lighting floor plans, panel schedules, the electrical riser diagram from service to branch panels, lighting fixture schedules, and site plans showing the service entrance.
- Fire protection design criteria: even when sprinkler and alarm shop drawings are deferred, the base set must show hazard classifications, design densities, and fire alarm device layouts or performance criteria.
- Details, legends, and general notes for each discipline.

Scales matter. Most AHJs expect floor plans at 1/4 inch equals 1 foot for commercial buildings — small enough to read in PDF review, large enough to show routing clearly. Enlarged plans at 1/2 inch scale belong in congested areas like restroom cores, electrical rooms, and mechanical rooms.

## The Calculation Package Behind the Drawings

Drawings without calculations are just pictures. The calculation package is what proves compliance, and most jurisdictions require it submitted alongside the plans:

- Mechanical: heating and cooling load calculations (ACCA Manual J for residential, ASHRAE-based loads for commercial), equipment selection per Manual S, duct sizing per Manual D, and outdoor air ventilation calculations per ASHRAE 62.1. Energy compliance documentation — COMcheck reports under the IECC or Title 24 compliance forms in California — is effectively mandatory everywhere now.
- Electrical: service load calculations per NEC Article 220, panel schedules showing connected and demand loads, available fault current calculations with equipment ratings to match, and voltage drop verification for long feeders.
- Plumbing: water supply fixture unit calculations with demand conversion, drainage fixture unit schedules with pipe sizing, water heater sizing, and any special systems like grease interceptors or medical gas shown with their own calculations.
- Fire protection: hydraulic calculations for sprinkler systems, usually submitted later as a deferred submittal but with design criteria established in the base permit.

Keep the calculation package organized by discipline with a table of contents. When a reviewer can match each calculation to the sheet it supports, corrections drop dramatically.


![A well-organized sheet index is the first thing a plan reviewer checks in a permit submittal.](/generated/blog/inline/mep-permit-drawing-requirements-usa-1.webp)


## Code Analysis and General Notes Sheets

The code analysis sheet answers the reviewer's first twenty questions before they are asked: occupancy group and occupant load, construction type, whether the building is sprinklered, the exact code editions adopted (including the year — 2021 IPC is not the same submittal as 2018 IPC), energy code compliance path, and a list of deferred submittals.

General notes sheets carry the code-driven requirements that do not fit on plans: seismic bracing requirements for MEP components, firestopping at penetrations, insulation R-values and thicknesses, equipment clearances per NEC 110.26, and accessibility requirements affecting fixture mounting heights and controls. Write these notes from the adopted code, not from a template borrowed from another state's project — nothing signals a careless submittal faster than notes citing the wrong code edition.

<Callout type="tip">Put the code edition year on every calculation sheet and in the code analysis. When the AHJ has amended the base code, add a line listing the local amendments you designed to.</Callout>

## Fire Protection Lives on a Separate Track

In most US jurisdictions, fire sprinkler and fire alarm systems follow a parallel permit path. The base building MEP permit establishes the design criteria — occupancy hazard classification, sprinkler design density and area, water supply information, and fire alarm performance requirements — and the detailed shop drawings, hydraulic calculations, and alarm voltage-drop calculations arrive later as deferred submittals prepared by the licensed fire protection contractor.

This split exists because fire protection design is typically design-build: the installing contractor finalizes routing and hydraulics. Your MEP set needs to give them, and the reviewer, everything required to start: adequate water supply data, clear hazard classifications per NFPA 13, standpipe locations if required, and coordinated ceiling space.

<Callout type="warning">Do not submit full sprinkler shop drawings with the base building permit in jurisdictions that require them deferred — and do not omit the design criteria either. Either mistake earns a correction letter.</Callout>

## Digital Submittal Standards and the Most Common Rejections

Nearly every AHJ now takes submittals electronically, and the file standards are enforced more strictly than many designers expect. Plans must be true vector PDFs with searchable text — not scans of printed sheets, and not raster exports where the reviewer cannot measure or search. Use a consistent sheet naming convention, keep file sizes manageable, and make sure every sheet is legible at 100 percent zoom on a monitor, because that is how it will be reviewed.

The rejections that stop a submittal on day one are almost never about engineering:

1. Missing professional stamp and signature on each discipline's sheets, where the state requires it.
2. No code edition years cited anywhere in the set.
3. Plans drawn at unreadable scales or with text too small to read on screen.
4. Schedules that do not match the plans — equipment tags, panel schedules, and fixture counts must agree.
5. Energy compliance forms missing or completed for the wrong code edition.
6. Deferred submittals not listed, leaving the reviewer unsure what is coming later.
7. Scanned hand markups or flattened raster PDFs the review software cannot process.

A permit set is a legal document that happens to contain drawings. Treat the administrative requirements — stamps, code years, file standards, matching schedules — with the same seriousness as the engineering, and the review process becomes a verification exercise instead of an adversarial one.

*Preparing an MEP permit submittal? [Request a quote](/request-quote) — we produce coordinated, calculation-backed drawing sets built around your AHJ's checklist.*`,
    meta: { pullQuotes: ["The reviewer is not judging your design. They are verifying compliance, one discipline at a time.", "Drawings without calculations are just pictures. The calculation package is what proves compliance."] },
  },
  {
    slug: "mep-requirements-florida-california-texas",
    title: "MEP Design Requirements by State: Florida vs California vs Texas",
    excerpt: "The same building needs three different MEP drawing sets in Florida, California, and Texas. Here is how wind codes, Title 24, and Texas's city-by-city patchwork change what goes on your permit drawings.",
    template: "LISTICLE",
    category: "design-drafting",
    tags: ["Florida Building Code", "Title 24", "Texas"],
    discipline: "mep",
    readMinutes: 7,
    featured: false,
    daysAgo: 19,
    bodyMdx: `Draw the same 10,000-square-foot retail building in Miami, Los Angeles, and Houston, and you will produce three meaningfully different MEP permit sets. The model codes — IBC, IMC, IPC, NEC — provide the shared skeleton, but each state layers on amendments driven by hurricanes, energy politics, or local control. Here is what changes, state by state, and what it means for your drawings.

## 1. Florida: Everything Is Designed for Wind and Water

Florida enforces the Florida Building Code, 8th Edition (2023), built on the 2021 I-codes with state amendments. For MEP designers, Florida's personality comes from its climate:

- Mechanical equipment needs wind anchorage. Rooftop units, exhaust fans, and condensers in hurricane-prone regions require engineered anchorage details on the drawings, with design wind speeds and exposure categories stated. In the High-Velocity Hurricane Zone — Miami-Dade and Broward counties — equipment and components need Florida Product Approval or Miami-Dade Notice of Acceptance documentation referenced in the submittal.
- Flood zones reshape plumbing and electrical. In FEMA-mapped flood areas designed per ASCE 24, electrical equipment must be elevated above the design flood elevation, and plumbing systems need backflow protection detailed accordingly. Show flood elevation data and equipment elevations on the plans, not just in the notes.
- Energy compliance follows the Florida Building Code, Energy Conservation volume, based on the IECC with Florida amendments. COMcheck-style documentation is standard.
- Electrical design follows the NEC 2020 under the 8th edition, with Florida amendments.

The practical takeaway: Florida MEP sets carry more structural coordination — anchorage details, equipment elevations, product approval references — than the same building would need in a non-coastal state.

## 2. California: Title 24 Runs the Show

California's Building Standards Code, Title 24, is the most demanding regulatory environment for MEP design in the country. The parts that shape your drawings:

- Part 6, the Energy Code (2022 standards), drives mechanical and electrical design. Compliance is demonstrated through the state's NRCC compliance forms, and your drawings must match the forms exactly — equipment efficiencies, lighting power densities, control sequences. Discrepancies between the forms and the plans are a leading cause of corrections.
- HERS verification adds field-verified measures. Many energy features — duct sealing, refrigerant charge, lighting controls — require third-party HERS rater verification, and the drawings should carry notes identifying which measures require it.
- Mandatory solar PV applies to many nonresidential occupancies. Your electrical set needs the PV system layout, inverter locations, and interconnection details, or a documented exception.
- Plumbing follows the California Plumbing Code, which is based on the UPC rather than the IPC. Fixture unit values, venting rules, and some sizing tables differ from IPC practice — designers crossing over from IPC states must recheck their calculation tables.
- CALGreen (Part 11) adds water efficiency, commissioning, and indoor air quality requirements that land on the MEP sheets as fixture flow rates, commissioning notes, and ventilation documentation.

The practical takeaway: California submittals are form-driven. The compliance paperwork is not an accessory to the drawings — it is half the submittal, and the two must agree perfectly.


![Florida, California, and Texas each layer different amendments on top of the model codes — your drawings must reflect the local AHJ.](/generated/blog/inline/mep-requirements-florida-california-texas-1.webp)


## 3. Texas: Know Your City, Not Just Your State

Texas has no statewide building code. The state sets a baseline energy code through the State Energy Conservation Office, but building, mechanical, electrical, and plumbing codes are adopted city by city:

- Houston enforces the Houston Building Code, based on the 2021 I-codes, with local amendments.
- Austin adopts the 2021 I-codes with some of the strictest local amendments in the state, including a more aggressive energy code based on the 2021 IECC.
- Dallas and other major cities follow similar 2021 I-code adoptions, each with their own amendment packages.
- In unincorporated county areas, there may be effectively no building permit or MEP review at all — a completely different world from the coastal states.

Electrical editions vary by city — some on NEC 2020, others having moved to NEC 2023 — and plumbing is generally IPC-based in the major metros. The practical takeaway: in Texas, the AHJ's municipal amendments page is the single most important document on the project. Never assume the Houston set works in Austin.

> In Florida the wind shapes your drawings, in California the energy forms do, and in Texas the city limits do. Same model codes, three different submittals.

## 4. Head-to-Head: Seven Differences That Change Your Drawings

1. Energy paperwork: California's Title 24 compliance forms are the heaviest lift; Florida uses IECC-based documentation; Texas varies by city, with Austin the strictest.
2. Plumbing code base: Florida and Texas metros use the IPC; California uses the UPC-based California Plumbing Code. Fixture unit tables and venting details differ.
3. Wind detailing: Florida requires equipment anchorage and product approvals, especially in the High-Velocity Hurricane Zone. California and Texas require far less — except along the Texas Gulf Coast, where wind-borne debris and high wind speeds bring similar concerns.
4. Seismic detailing: California requires seismic bracing and anchorage for MEP components per the CBC; Florida and most of Texas do not.
5. Product approvals: Florida's product approval system has no real equivalent in California or Texas; specified equipment must carry the right certifications.
6. Solar PV: effectively mandatory for covered occupancies in California; optional elsewhere, though Texas's market often includes it voluntarily.
7. Review culture: Florida's state-uniform code means consistent expectations with local amendments; California adds state forms on top of local review; Texas means learning a new amendment package in every city.

## 5. How to Set Up a Multi-State Drawing Practice

If you work across these states, build your standards around a strong base set of master details, then maintain state amendment layers: a Florida layer with anchorage details and product approval notes, a California layer with Title 24 forms coordination and HERS notes, and per-city Texas layers. The most expensive mistake in multi-state work is letting details from one state leak into another's submittal — a California HERS note on a Houston set confuses the reviewer and slows the permit.

And the universal rule: the code edition year on your cover sheet must match the tables you calculated from and the amendments you designed to, for that specific AHJ. Everything else flows from that one line.

*Working on projects across multiple states? [Request a quote](/request-quote) — we build permit-ready MEP sets tuned to each AHJ's amendments, from Miami-Dade to Los Angeles to Houston.*`,
    meta: { pullQuotes: ["In Florida the wind shapes your drawings, in California the energy forms do, and in Texas the city limits do.", "In Texas, the AHJ's municipal amendments page is the single most important document on the project."] },
  },
  {
    slug: "permit-ready-mep-drawings-guide",
    title: "How to Prepare Permit-Ready MEP Drawings for U.S. Construction Projects",
    excerpt: "Permit-ready is a specific standard, not a vague aspiration. The workflow — AHJ checklist, calculation package, coordination, drawing standards, and a ruthless QC pass — that gets MEP sets approved with fewer review cycles.",
    template: "STANDARD",
    category: "design-drafting",
    tags: ["permit-ready", "coordination", "plan review"],
    discipline: "mep",
    readMinutes: 7,
    featured: false,
    daysAgo: 20,
    bodyMdx: `Permit-ready has a specific meaning: a drawing set that a plan reviewer can verify against the adopted codes without guessing, without hunting, and without sending it back for missing information. It is a standard you build toward deliberately, not a label you attach at the end. Here is the workflow that produces it.

## Start with the AHJ's Checklist, Not a Blank Sheet

Every jurisdiction publishes a submittal checklist or permit application guide — sometimes a one-page PDF, sometimes a twenty-page manual. Download it before drawing a single line. The checklist tells you exactly which sheets, calculations, forms, and details the reviewers expect, in the order they expect them.

Build your sheet index directly from that checklist. If the AHJ wants a code analysis sheet, energy compliance forms, and a separate plumbing riser diagram, those become G-001, the energy forms, and P-201 before any design work starts. Designing first and mapping to the checklist later is how sheets get missed and review cycles get burned. Also confirm the adopted code editions and local amendments at this stage — the year on the checklist governs every calculation you are about to do.

> Design to the checklist. The reviewer grades against it, so it is the closest thing to an answer key you will ever get.

## Build the Calculation Package Before Drawing Production

Calculations drive drawings, not the other way around. Before plans go into production, complete the engineering math for each discipline: heating and cooling loads with equipment selections, ventilation rates per ASHRAE 62.1, electrical service and feeder load calculations per NEC Article 220, fault current and voltage drop checks, and plumbing fixture unit calculations with pipe sizing.

This order matters for two reasons. First, the drawings cannot be right if the engineering behind them is incomplete — equipment sizes, panel sizes, and pipe sizes all come from the calculations. Second, the calculation package is itself a submittal document in most jurisdictions, and reviewers cross-check it against the plans. When both are produced from the same source data, they agree. When drawings are produced first and calculations reverse-engineered later, discrepancies creep in, and reviewers find every one of them.

## Coordinate Before You Draw — Especially Above the Ceiling

Most MEP coordination failures happen in the ceiling plenum, where ductwork, piping, conduit, cable tray, and sprinkler lines compete for the same space. Permit reviewers may not run clash detection, but they do look at reflected ceiling plans and sections — and obvious conflicts signal a set that was not coordinated.

Establish the vertical zones early: structure and its required clearances first, then large ductwork, then plumbing and mechanical piping with their required slopes, then electrical conduit and cable tray, then fire sprinkler branch lines. Draw at least one building section through the most congested corridor showing every system at its real elevation. For complex projects, a simple 3D coordination model pays for itself many times over in avoided field conflicts — but even on small projects, disciplined sections and reflected ceiling plans catch the worst clashes before the reviewer does.

Coordinate with the other disciplines too. Structural openings for duct and pipe penetrations, electrical clearances in front of panels per NEC 110.26, plumbing fixture locations against the architectural backgrounds — every one of these is a classic correction letter when missed.

## Drawing Standards That Sail Through Review

Reviewers read dozens of sets a month. Sets that follow consistent, professional standards get the benefit of the doubt; sloppy sets get scrutinized. The standards that matter most:

- Scales: floor plans at 1/4 inch equals 1 foot for commercial work, with enlarged plans at 1/2 inch scale for restroom cores, electrical rooms, and mechanical rooms.
- Text and dimensions legible at 100 percent zoom on a monitor — that is how your set will actually be reviewed.
- Schedules that match the plans exactly: equipment tags, panel schedules, lighting fixture counts, and plumbing fixture counts must agree across every sheet.
- Complete legends and symbol lists for each discipline, so the reviewer never has to guess what a symbol means.
- Keynotes tied to a keynote legend rather than paragraphs of text scattered across plans.
- North arrows, drawing titles, and sheet numbers consistent across architectural backgrounds and MEP sheets.
- Professional stamps and signatures where the state requires them, on each discipline's sheets.

<Callout type="tip">Run a schedule-to-plan reconciliation as its own task: one person, one pass, checking that every tag on the plans appears in the schedules and vice versa. It takes an hour and eliminates an entire category of corrections.</Callout>


![Above-ceiling coordination — routing duct, piping, conduit, and sprinkler lines in shared space before drawings go to permit.](/generated/blog/inline/permit-ready-mep-drawings-guide-1.webp)


## The Pre-Submittal QC Pass

Never submit a set that has not been through a formal quality check by someone who did not draw it. Use a written checklist — memory is not a QC process:

<Checklist>
- [ ] Code edition years cited on the code analysis sheet match the calculation tables used
- [ ] Local AHJ amendments reviewed and addressed in notes and details
- [ ] Sheet index matches the AHJ submittal checklist item for item
- [ ] All equipment tags on plans appear in schedules, and all scheduled items appear on plans
- [ ] Panel schedules show connected load, demand load, and match the riser diagram
- [ ] Riser diagrams labeled with pipe sizes, slopes, and fixture unit or load data
- [ ] Energy compliance forms completed for the correct code edition and matching the drawings
- [ ] Deferred submittals (sprinkler, fire alarm) listed with design criteria shown
- [ ] Reflected ceiling plans coordinated: lighting, diffusers, sprinklers, and access panels
- [ ] PDFs are true vector with searchable text, correctly named, and legible at full zoom
</Checklist>

The QC reviewer should redline the set exactly the way a plan reviewer would — skeptically, literally, and without benefit of the doubt. Every issue caught internally is a review cycle saved.

## Handling Plan Review Comments Like a Pro

Even excellent sets get comments. What separates professionals is the response. Number every response to match the reviewer's comment numbers, describe exactly what changed and on which sheet, and cloud every revision on the drawings so the reviewer can find it in seconds. Resubmit complete, coordinated sets — never a loose collection of revised sheets that no longer match each other.

If a comment reflects a genuine code disagreement, respond with the code section cited and your reading of it, professionally and briefly. Reviewers respect designers who know the code; they do not respect arguments without citations. And track every comment to closure — an unanswered comment on the second cycle is how permits stall for months.

<Callout type="note">Keep a comment log for every project: comment number, reviewer, response, and sheets revised. It becomes your proof of compliance and your template for faster permits on the next project.</Callout>

Permit-ready is not a mystery. It is a checklist-driven, calculation-backed, coordinated set of documents produced in the right order and checked before submittal. Build that workflow into every project and the permit process stops being a gamble.

*Need a permit-ready MEP set without the in-house drafting overhead? [Request a quote](/request-quote) — send your architectural backgrounds and we will deliver coordinated, calculation-backed drawings built for your AHJ.*`,
    meta: { pullQuotes: ["Design to the checklist. The reviewer grades against it, so it is the closest thing to an answer key you will ever get.", "Calculations drive drawings, not the other way around."] },
  },
];
