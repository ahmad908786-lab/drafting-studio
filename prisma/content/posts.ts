/** Blog content — 12 posts covering all 5 templates. */

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
    bodyMdx: `The industry spent a decade insisting every drawing had to become a model. For a lot of buildings, that was never true — and pretending otherwise slowed projects down.

> A plan reviewer does not stamp a model. They stamp sheets. Clean, complete, coordinated sheets.

Most tenant fit-outs, franchise rollouts, and light-commercial projects need a permit set: power plans, panel schedules, a one-line, ductwork, piping, a sprinkler grid. Every one of those is a 2D deliverable. Producing them through a heavy modeling pipeline adds cost and time without changing what lands on the reviewer's desk.

## Focus is a feature

When a studio commits to 2D AutoCAD, the whole workflow tightens around the thing that matters: correct, legible, code-compliant sheets delivered fast. Layer standards stay disciplined. Files stay small and portable. Your engineer of record opens the DWG, redlines, and stamps — no round-trip through a model nobody asked for.

## Where modeling earns its keep — and where it doesn't

Complex, heavily coordinated new construction with dozens of trades stacked in a tight plenum can justify a model. A 2,100 sq ft drive-thru does not. The mistake is treating every project like the first case when most are the second.

The result of choosing 2D deliberately is not a compromise. It is a faster path to a permit, at a lower cost, with a file your whole team can actually use.`,
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

## 3. Add the continuous-load and motor adjustments

Continuous loads are taken at 125%. The largest motor gets an additional 25%. These two adjustments catch more first-time reviewers than anything else.

## 4. Total and size the service

Sum the demand load, convert to amps at the service voltage, and select the next standard service size. Document every assumption — a reviewer wants to trace your number back to the code.

<Callout type="tip">Keep the panel schedule and the load summary in the same file. When the two disagree, the reviewer notices — and so does the inspector.</Callout>

## 5. Produce the load letter

Utilities and many AHJs want a load letter: connected load, demand load, and service size on one page, ready for your PE to stamp. That single sheet keeps the service application moving.

## A quick checklist

<Checklist items="Inventory every connected load;Apply Article 220 demand factors;Take continuous loads at 125%;Add 25% for the largest motor;Select the next standard service size;Document assumptions and produce the load letter" />

Done in this order, a standard-method calc is fast, defensible, and easy to review.`,
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

## Compare demand to supply

Plot the system **demand** against the **water supply** curve from your flow test. If demand sits comfortably under supply with margin to spare, the design works. If it pokes above, you resize pipe, adjust the layout, or flag that a pump may be required.

| Input | Why it matters |
| --- | --- |
| Occupancy hazard | Sets density and area |
| Flow test (static/residual/flow) | Defines the supply curve |
| Pipe schedule & C-factors | Drives friction loss |
| Elevations | Adds/removes pressure |

## What you receive

A clean report: the demand/supply graph, node and pipe schedules, the remote-area analysis, and a summary the fire department can accept. Pair it with the sprinkler layout and the set is submission-ready.`,
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

## 4. Template the title block and sheet index

One title block, one sheet order, every location. Reviewers and your own team move faster when every set reads identically.

## 5. Standardize the load and equipment basis

If the equipment package is fixed, the load calc is nearly fixed too. Template it and adjust only the service point and local factors.

## 6. Track revisions like a program, not a project

A shared log of what changed and why — across all sites — prevents re-solving the same landlord or AHJ issue twice.

## 7. Keep files 2D and portable

Small, layered DWGs move between your team, the landlord's engineer, and the AHJ without friction. That portability is what makes a fifty-site pace possible.

Run the program this way and each new site becomes a 48-hour adaptation instead of a fresh design.`,
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
    bodyMdx: `## Challenge

A healthcare developer needed a 6,400 sq ft urgent-care fit-out through permit fast. The scope was code-critical: dedicated and isolated power for medical equipment, complete egress and exit lighting, and a full NFPA 72 fire-alarm design with battery and voltage-drop calculations. Their in-house engineer would stamp — but had no bandwidth to draft.

## Solution

We took the architectural floor and reflected-ceiling plans and produced the full electrical set:

- Dedicated and isolated circuits for exam and imaging equipment
- Egress and exit lighting coordinated to the life-safety plan
- Fire-alarm device layout with candela and spacing to NFPA 72
- SLC/NAC circuiting, riser, and battery/voltage-drop calculations
- Panel schedules and a coordinated one-line

Everything was drafted in 2D AutoCAD to the firm's CAD standard so their engineer could redline and stamp without cleanup.

## Results

The set went to the AHJ and cleared on the first submission. Two minor review comments were resolved inside the included revision window.

| Metric | Result |
| --- | --- |
| Turnaround | 6 business days |
| Review submissions | 1 |
| Revisions used | 2 (included) |
| Stamp-ready | Yes |

The developer has since sent three more clinic locations through the same pipeline.`,
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

## Mounting height and tilt

Illuminance falls off with the square of distance. The study has to reflect the real mounting height and any tilt — an optimistic height inflates the grid and invites a correction.

## A clean, readable deliverable

Finally, the plan itself has to be legible: the calc grid, the summary table (avg/min/max, ratios), the fixture schedule with IES types, and the compliance note. A tidy sheet gets read quickly and approved quickly.

Get these five right and a photometric study clears review without a second look.`,
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
    bodyMdx: `Sizing HVAC starts with a load calculation — but which method? The two you'll see are Manual-J and the ASHRAE approach. They aren't interchangeable.

## Manual-J: residential

Manual-J is the recognized standard for residential heating and cooling loads. It's room-by-room, envelope-driven, and it's what most residential AHJs expect behind a permit. For single-family, townhomes, and ADUs, this is the basis.

## ASHRAE: commercial

Commercial buildings — offices, retail, healthcare, hospitality — use the ASHRAE method, which handles diversity, ventilation per **ASHRAE 62.1**, and larger, zoned systems more naturally.

## What both need from you

- Envelope assemblies (R-values, glazing, orientation)
- Occupancy and internal gains
- Ventilation requirements
- Design conditions for the location

## Why right-sizing matters

Oversized equipment short-cycles, controls humidity poorly, and costs more up front. Undersized equipment can't hold setpoint on a design day. The load calc is what keeps the selection honest — and it feeds straight into the ductwork sizing on the drawings.

Pick the method to match the building, document the assumptions, and the equipment selection defends itself.`,
  },
  {
    slug: "single-line-diagram-mistakes-that-fail-review",
    title: "5 Single-Line Diagram Mistakes That Fail Plan Review",
    template: "LISTICLE",
    category: "electrical",
    tags: ["single line", "one-line", "review"],
    discipline: "electrical",
    readMinutes: 5, featured: false, daysAgo: 40,
    excerpt: "The one-line is the first thing a reviewer reads. These five omissions are the ones that bounce it back.",
    bodyMdx: `The single-line is the map of your electrical system. Reviewers start here, and these five gaps are the common reasons it comes back.

## 1. Missing AIC / interrupting ratings

Overcurrent devices without an interrupting rating — or ratings that don't reflect the available fault current — are an instant comment. Show them.

## 2. Unlabeled feeder and conductor sizes

Every feeder needs its conductor and conduit size. A one-line with unlabeled runs forces the reviewer to guess, and they won't.

## 3. No grounding and bonding

The grounding electrode system and bonding path belong on the one-line. Leaving them off reads as incomplete.

## 4. Panel hierarchy that doesn't match the schedules

If the one-line says one thing and the panel schedules say another, the reviewer notices immediately. Keep them in sync in the same file.

## 5. Service and metering ambiguity

Utility service, metering, and the main have to be unambiguous — configuration, rating, and location. Vagueness here delays the whole set.

Fix these five and your one-line reads as complete, which is exactly the impression you want a reviewer to start with.`,
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
    bodyMdx: `## Challenge

A contractor won a 65,000 sq ft distribution center and needed two things fast: an ESFR sprinkler layout with a hydraulic report that would clear the fire department, and a high-bay lighting design with a photometric grid proving adequate footcandles across the racking.

## Solution

We drafted both disciplines in coordinated 2D:

- ESFR sprinkler head layout to NFPA 13, coordinated to the roof structure and racking
- A node-by-node hydraulic report comparing demand to the site's flow test
- High-bay lighting layout with a point-by-point photometric grid at aisle and rack faces

The hydraulic calc initially ran close to the supply curve; we resized two cross-mains to open up margin, then re-ran the calc to confirm.

## Results

| Metric | Result |
| --- | --- |
| Building area | 65,000 sq ft |
| Sprinkler basis | ESFR, NFPA 13 |
| Hydraulic margin | Passed with resized mains |
| Lighting | Uniform grid at rack faces |
| Turnaround | 9 business days |

Both packages cleared review together, and the contractor kept the aggressive site schedule.`,
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
    bodyMdx: `There's a quiet assumption that outsourcing drafting means giving up control. In practice, the firms that outsource well keep more control, not less — because they stop spending senior engineering time on production drafting.

> Your PE's signature is the product. The hours spent moving lines in CAD are not.

## The math of a stamp

An engineer's value is judgment and their stamp. When that person spends a day drafting a panel schedule, you've bought the most expensive drafting in the building. Handing production drafting to a dedicated studio frees that judgment for design, review, and client work.

## Control is in the standard, not the mouse

The fear is that outsourced sets won't match house style. The answer is a CAD standard: title block, layers, details. Draft to the standard and the output is indistinguishable from in-house — because it was made to your spec.

## Capacity that flexes

Workload isn't flat. Outsourcing turns a fixed drafting headcount into capacity you scale up for a busy quarter and down when it's quiet, without hiring and layoffs.

Done deliberately, outsourcing production drafting is not a loss of control. It's a decision about where your most expensive people should spend their day.`,
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
    bodyMdx: `A commercial kitchen packs more MEP conflict per square foot than anywhere else in a building. Here's how we keep it coordinated.

## Start with the hood

Everything keys off the Type-I hood. Its exhaust CFM sets the make-up air requirement, and the two must balance — typically 80–90% of exhaust supplied as tempered make-up air so the space doesn't go negative and starve the hood.

<Callout type="warning">Under-supplying make-up air is the single most common kitchen failure. Balance it on the drawings, not on site.</Callout>

## Power the equipment

Kitchen equipment is electrically heavy and specific: dedicated circuits, correct voltages, and connections that match the equipment schedule exactly. A one-off receptacle in the wrong place stalls the whole line at inspection.

| System | Coordination point |
| --- | --- |
| Type-I hood | Exhaust CFM ↔ make-up air |
| Equipment power | Dedicated circuits per schedule |
| Grease waste | Interceptor sizing and slope |
| Gas piping | Load, sizing, and shutoff |

## Route the plumbing

Grease waste needs an interceptor, correct slope, and a clear path. Hand sinks, prep sinks, and floor drains all land on the plan. Gas piping is sized to the connected load with an accessible shutoff.

## Coordinate the ceiling

Hood ductwork, make-up air, sprinkler, lighting, and fire suppression all fight for the same plane. We lay them out together so nothing collides above the line.

## The payoff

A kitchen coordinated on paper is a kitchen that passes health and building review together — and opens on schedule.`,
  },
  {
    slug: "reading-a-drawing-set-for-non-engineers",
    title: "How to Read an MEP Drawing Set (For Non-Engineers)",
    template: "STANDARD",
    category: "design-drafting",
    tags: ["basics", "drawing set", "owners"],
    readMinutes: 6, featured: false, daysAgo: 64,
    excerpt: "Owners, GCs, and project managers: a quick orientation to what's in an MEP set and how the sheets fit together.",
    bodyMdx: `You don't need an engineering degree to get useful information out of an MEP drawing set. Here's a quick orientation.

## The sheet index is the map

Every set opens with a sheet index. Electrical sheets are usually prefixed **E**, mechanical **M**, plumbing **P**, and fire protection **FP**. The index tells you what exists and in what order.

## Legends and general notes

Before the plans, you'll find legends (what each symbol means) and general notes (the code basis and standard requirements). When a symbol on a plan confuses you, the legend is the answer.

## The plans themselves

Plans are scaled top-down views: where devices, ducts, pipes, fixtures, and heads go. Tags and callouts connect items on the plan to the schedules.

## Schedules and diagrams

Schedules are tables — panels, equipment, fixtures — listing sizes and specifications. Diagrams like the single-line and risers show how the system connects vertically and electrically, which a flat plan can't.

## How it all ties together

A device on a plan carries a tag; that tag appears in a schedule with its specification; the schedule ties back to a diagram that shows how it's fed. Follow one item through those three views and the set stops looking like noise.

That's enough to review a set with confidence and ask the right questions at the next project meeting.`,
  },
];
