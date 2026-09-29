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

Most tenant fit-outs, franchise rollouts, and light-commercial projects need a permit set: power plans, panel schedules, a single-line diagram, ductwork, piping, a sprinkler grid. Every one of those is a 2D deliverable. Producing them through a heavy modeling pipeline adds cost and time without changing what lands on the reviewer's desk.

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
- Panel schedules and a coordinated single-line diagram

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
    tags: ["single-line", "one-line", "plan review"],
    discipline: "electrical",
    readMinutes: 5, featured: false, daysAgo: 40,
    excerpt: "The single-line is the first thing a reviewer reads. These five omissions are the ones that bounce it back.",
    bodyMdx: `The single-line is the map of your electrical system. Reviewers start here, and these five gaps are the common reasons it comes back.

## 1. Missing AIC / interrupting ratings

Overcurrent devices without an interrupting rating — or ratings that don't reflect the available fault current — are an instant comment. Show them.

## 2. Unlabeled feeder and conductor sizes

Every feeder needs its conductor and conduit size. A single-line with unlabeled runs forces the reviewer to guess, and they won't.

## 3. No grounding and bonding

The grounding electrode system and bonding path belong on the single-line. Leaving them off reads as incomplete.

## 4. Panel hierarchy that doesn't match the schedules

If the single-line says one thing and the panel schedules say another, the reviewer notices immediately. Keep them in sync in the same file.

## 5. Service and metering ambiguity

Utility service, metering, and the main have to be unambiguous — configuration, rating, and location. Vagueness here delays the whole set.

Fix these five and your single-line reads as complete, which is exactly the impression you want a reviewer to start with.`,
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

## Calculations Referenced on the Sheet

Plan reviewers approve designs against numbers: NEC Article 220 load calculations, ASHRAE heating and cooling loads, plumbing fixture counts against the IPC, available fault current for the service. The calculations do not need to live on the plan sheets, but the sheets must point to them. We add a schedule or note on the relevant sheet stating the calculation basis, for example noting that lighting and receptacle loads follow NEC 220 with the full calculation on the referenced sheet. When the reviewer can trace a feeder size back to a stated load basis in one step, the review moves. When they cannot, you get a correction asking for the basis — and you lose two to three weeks.

## Coordination the Reviewer Can Actually See

The fastest way to lose a reviewer's confidence is a visible conflict: a duct drawn through a sprinkler main, a panel schedule that does not match the single-line diagram, a diffuser layout that ignores the reflected ceiling plan. Reviewers cross-check disciplines, and every conflict they find makes them look harder for the next one. Before a set leaves our office, it goes through a coordination pass across shared backgrounds — aligned grids, matched equipment tags, one architectural reference. We would rather find the conflict in CAD than have the AHJ find it in review.

<Callout type="tip">Before every submittal, we read the finished set the way the reviewer sees it — full sheets, in order — checking the index, legends, and keyed notes as a stranger would. Ten minutes of cold reading catches what a week of drafting misses.</Callout>`,
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

## Step 3: Cloud Changes and Run a Revision Delta

Every change gets a revision cloud, a delta number, and a date — on the sheet, in the title block, and on the sheet index. The revision cloud is not decoration; it is how the reviewer verifies that every comment was addressed without re-reading the whole set. We keep a revision log that maps each delta to the specific correction-letter comment it answers. After clouding, we run a delta check: open the previous submittal next to the new one and confirm that every cloud corresponds to a comment, and every comment corresponds to a cloud. Changes made without clouds are invisible to the reviewer and read as ignored comments — the fastest route to a second correction letter.

## Step 4: Assemble a Resubmittal Package, Not Just New Sheets

The resubmittal is a package with four parts: the response letter, the revised sheets, the unchanged sheets, and the supporting documents. The response letter answers every comment by number, states what changed, and cites the sheet and delta where the reviewer can find it. We resubmit the complete set, not just the changed sheets, because reviewers check context — a changed detail on one sheet affects the plan on another, and they want to see both. Supporting documents — updated load calculations, cut sheets for substituted equipment, energy compliance forms — go in with the package, referenced from the response letter. A complete package gets re-reviewed in days. A partial one gets a new correction letter asking for the missing pieces.

<Callout type="warning">Never resubmit only the changed sheets. Reviewers verify corrections in context, and a partial set almost always triggers a second correction letter asking for the rest — resetting your review clock.</Callout>

<Checklist items="Read the full correction letter and map each comment to a sheet and root cause;Classify every comment as code, coordination, clarification, or administrative;Confirm engineer-of-record sign-off on any design changes;Cloud every change with a delta number and date;Update the revision log mapping each delta to its comment;Run a delta check against the previous submittal;Update the sheet index and title block revision blocks;Write the numbered response letter citing sheet and delta for each comment;Attach updated calcs, cut sheets, and compliance forms;Resubmit the complete set, not just the changed sheets" />`,
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

## Cleanup Is Where the Permit Value Lives

Tracing alone produces a CAD file. Cleanup produces a permit set. We rebuild the layer structure to a standard convention, purge the junk, and set line types and weights so the set plots correctly. Equipment schedules get recreated as real schedules with tags that match the plans. Title blocks get the current project information, the engineer of record, and the code edition the permit will be reviewed under. And we add what the legacy set never had: a sheet index, legends, and keyed notes — the navigation layer that turns an old drawing into a submittable set. This is the work clients do not see in a thumbnail but reviewers feel on the first page.

## What the AHJ Receives

The deliverable is a complete DWG set: layered, scaled, editable, and organized to the same standard as a new-construction set. Alongside it, we provide conversion notes documenting what was verified, what was assumed, and what the client should field-verify — because honesty about a decades-old building's as-builts is part of permit readiness. From there, the renovation design proceeds on a reliable background instead of a scanned guess. The permit review starts from a set the reviewer can actually review, which is the entire point.

<Callout type="tip">If you only have scans, provide the earliest-generation original you can find. Every generation of copying adds dimensional drift that has to be corrected by hand — and that correction time shows up in your fee.</Callout>`,
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

## 4. Sheet Order That Matches How Reviewers Read

Sheets follow a fixed order: cover and index, general notes and legends, then architectural backgrounds, then mechanical, electrical, plumbing, and fire protection — plans first, then schedules, then details within each discipline. Numbering carries the discipline prefix: M-201 is always a mechanical plan, E-601 always an electrical detail. Reviewers learn the pattern once and navigate every set the same way. A set with sheets in random order forces the reviewer to build a mental map before evaluating the design, and that friction shows up as pickier comments.

## 5. Title Block Fields With No Blanks

Every title block carries the same complete information: project name and address, client, engineer of record with license number, code edition, sheet number and title, scale, date, and drawn and checked initials. No blanks, no TBD, no placeholder text — a blank field reads as an unfinished set, and reviewers treat unfinished sets accordingly. Dates update on every submittal so the revision history is unambiguous. This is administrative, it takes minutes, and we have seen it hold up permits.

## 6. A Revision Protocol That Survives Resubmittals

Revisions follow one protocol from the first correction letter to the final permit: cloud, delta, date, log. Each change gets a cloud with a delta number tied to the correction comment it answers; the title block revision block records the delta, date, and description; the sheet index flags revised sheets. The revision log maps every delta to its source comment. When the third resubmittal arrives, nobody has to reconstruct what changed in the second — the protocol already says so. Reviewers notice this discipline, and it shortens every subsequent review.

## 7. File Naming That Tells You What Is Inside

File names carry project, discipline, content, and version: a name like 24017-M-FP-201_R2 tells anyone — drafter, engineer, or reviewer downloading the submittal — exactly what the file is without opening it. No "final," no "final-final," no prose dates. Version suffixes increment on every issued set, and superseded versions move to an archive folder instead of lingering next to current files. Clean file naming is the cheapest quality control in the office, and it is the first thing a reviewer sees on an electronic submittal portal.

None of these seven standards is difficult on its own. Together, they are the difference between a set that reads as professional and one that reads as improvised — and reviewers issue permits to the professional one.`,
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

## Door Swing and Egress

For large equipment rated 1,200 amps or more and over 6 feet wide, NEC 110.26(C)(2) requires two entrances to the working space — one at each end. Personnel doors must open in the direction of egress and carry listed panic hardware per 110.26(C)(3).

We draw both door swings on the electrical room plan, not just on the architectural sheets, and we verify that an open door does not trap anyone behind energized equipment. We also confirm illumination per 110.26(D): the working space must be illuminated, and control of that lighting cannot depend on automatic means only. A wall switch at each entrance, shown on the plan, closes that comment before it opens.

## Equipment Placement and Adjacencies

Transformers need ventilation clearance per Article 450. Separately derived systems need their grounding electrode conductor paths shown. Working space for one piece of equipment may overlap another's, but it cannot extend into the dedicated space of different equipment or block access to disconnects required for motors under Article 430.

We place the largest equipment first — typically the switchboard or main distribution panel — then lay out panelboards, transformers, and transfer switches around the required envelopes rather than fitting envelopes around placed equipment. Order of operations matters: clearances first, equipment second.

## Electrical Room Layout Checklist

Before a room layout leaves our desk, it passes this list:

<Checklist items="Working-space depth dimensioned per Table 110.26(A)(1) for each voltage and condition;30-inch minimum width and 6-1/2-foot headroom verified at every lineup;Dedicated space per 110.26(E) held clear of piping, ducts, and foreign systems;Two entrances shown for equipment rated 1,200A or more and over 6 ft wide;Personnel doors swing in the direction of egress with panic hardware noted;Working-space illumination shown with manual control at each entrance;Clearance envelopes drawn as dashed polylines and dimensioned, not assumed" />`,
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

## Site Plan: Where the Conduit Actually Goes

EVSE lives in parking lots and garages, so the site plan does real work. We show each charger location, bollard protection, accessible stall layouts where required, and the complete conduit route from the electrical room to the last pedestal — including trenching, boring, or surface raceway. Disconnecting means per NEC 625.43 get located on the plan for equipment rated over 60 amps or over 150 volts to ground.

Setbacks, clearances, and equipment pads go on the plan too. The reviewer is checking that the installation can actually be built where it is drawn, and the inspector will hold you to the same drawing in the field.

## What Reviewers Ask For (Almost) Every Time

Beyond the drawings, expect the AHJ to ask for utility confirmation that the service can take the added load, equipment cut sheets for the EVSE with listings to UL 2594, and confirmation of local amendments — some jurisdictions layer EV-capable or EV-ready parking counts on top of the NEC through their energy codes. GFCI protection per 625.54 and proper labeling round out the typical correction list.

<Callout type="tip">Package the cut sheets, load calc, and panel schedules with the drawing set on the first submittal. One complete package beats three rounds of corrections every time.</Callout>`,
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

## 4. Mystery Spares and Unlabeled Spaces

Blank rows labeled "spare" with no breaker size, or spaces with no indication of intended load, raise the question of what is really being permitted. Some AHJs treat unlabeled spares as unreviewed future load and reject them outright. We label every space: breaker size for spares, or the specific future load for spaces, so there is nothing for the reviewer to guess at.

## 5. Voltage or Phase That Disagrees With the Service

A 208Y/120V schedule fed from a 480Y/277V service with no transformer shown, or single-phase loads landed on a three-phase panel schedule with no phase balancing. These are drafting errors, not engineering errors, but the reviewer cannot tell the difference. We verify the service voltage against the utility letter and show every transformation point on the riser before the schedule is finalized.

## 6. Conductors That Cannot Carry the Breaker

NEC 240.4 requires conductors to be protected against overcurrent in accordance with their ampacity. A 100-amp breaker on a conductor sized for 85 amps is a correction every time — and it usually comes from updating the breaker during value engineering without updating the wire size. Our schedules carry the conductor size in the same row as the breaker, so a change to one forces a check of the other.

## 7. Connected Load With No Demand Summary

A schedule that lists every load at 100 percent connected kVA with no demand factors applied is technically a load list, not a load calculation. Reviewers need to see Article 220 demand factors — lighting, receptacle, motor, and HVAC diversity — applied and totaled so the service and feeder sizing can be verified. We show connected load, demand factor, and demand load in separate columns with a summary total that feeds the riser.

A clean panel schedule does not just avoid corrections — it shortens review time, because the reviewer spends their effort verifying good work instead of hunting for errors. That is the standard we hold every schedule to before it leaves our desk.`,
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

## Egress Lighting Coordination

Emergency illumination for the means of egress is required by NEC 700.16, and 700.12 lists the permitted sources, including generators, batteries, and unit equipment. We coordinate every egress fixture with the architectural reflected ceiling plan so the lighting layout on our sheets matches the ceiling the architect is permitting. Mismatched ceiling plans are a classic, entirely avoidable correction.

Exit signs and unit equipment are circuited back to the emergency distribution and shown on dedicated emergency lighting plans, with battery-pack locations called out. Where the AHJ asks for it, we add photometric values along the egress path. The goal is simple: anyone reading our lighting plan and the architect's ceiling plan should see the same building.

## The Riser Diagram Ties It Together

The riser — the one-line diagram — is the reviewer's roadmap: utility service, generator, each ATS, the emergency distribution, and every downstream panel on one sheet. We show the normal and emergency source for each transfer switch, breaker sizes with AIC ratings coordinated for selective operation, and clear labeling of which panels carry Article 700 emergency loads versus 701 or 702 loads.

Wiring separation notes per 700.10(B) go on the riser too. Emergency wiring kept independent of normal wiring is one of the first things a reviewer checks, and stating it on the drawing answers the question before it is asked. When the riser tells a coherent story, the floor plans just confirm it.

## Emergency Power Drawing Checklist

Every emergency power set we issue passes this list first:

<Checklist items="Generator sizing basis on the drawings: connected load, motor starting kVA, margin stated;Selective coordination noted per 700.32 and 701.31 with settings table reference;Each ATS shown with sources, loads grouped by system, transition type, bypass where required;Neutral switching explicit (3-pole vs 4-pole) with grounding notes;Emergency, legally required standby, and optional standby loads on correct transfer equipment;Egress lighting coordinated with the architectural reflected ceiling plan;Exit signs and unit equipment circuited to emergency distribution;Riser shows full source-to-load path with breaker sizes and AIC ratings;Wiring separation per 700.10(B) noted on the riser;Fuel source, runtime, and NFPA 110 remote annunciator located on the plans" />`,
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

## Battery Calculations and Voltage Drop

NFPA 72 requires standby batteries sized for 24 hours of standby followed by 5 minutes of alarm operation, or 15 minutes of alarm for emergency voice and alarm communications systems. Our calculation sheet lists every device on standby current and alarm current, totals both columns, applies the required safety factor, and states the selected battery size in amp-hours. The reviewer checks the math against the device schedule, so the two must use the same quantities.

Voltage drop gets its own sheet for the longest notification appliance circuit run. We calculate using the actual conductor size, the circuit length from the riser, and the total alarm current on that run, confirming the last device still sees voltage within the listed operating range of the appliance. When a run fails, we upsize the conductor or split the circuit before the submittal goes out, not after the first review comment.

## Sequence of Operations Table

The sequence table is a matrix: every initiating input down the left column, every output function across the top, and the required actions marked at each intersection. A smoke detector in the elevator lobby recalls the cars, shuts down the associated air handler, releases the door holders, and activates notification on the alarm floor. A duct detector shuts down its unit without a general alarm. A sprinkler waterflow switch starts the same outputs as a manual pull station. We write the table from the actual system programming intent, because the commissioning agent will test against it.

## Common Review Comments We Design Around

Most fire alarm review comments trace back to coordination. The FACP location conflicts with the electrical room layout. The annunciator is not at the fire department entrance the AHJ uses. Candela ratings on the plan do not match the schedule. Our drafting checklist catches these before submittal, which is why our packages clear review in fewer rounds.

<Checklist items="Device legend with NFPA 170 symbols and a complete device count schedule;Detector spacing verified against NFPA 72 for the actual ceiling construction;Manual pull stations within 5 ft of exits with 200 ft maximum travel distance;Notification appliance candela ratings and spacing verified per the coverage tables;Riser diagram showing every SLC loop, NAC circuit, and auxiliary power supply;Battery calculations showing 24-hour standby plus 5-minute alarm load;Voltage-drop calculations for the longest NAC run with conductor sizes stated;Sequence of operations table covering every input-output combination;FACP and annunciator locations coordinated with the electrical plans and the fire department entrance" />`,
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

## 5. Sprinklers Below Wide Ducts and Obstructions

Any continuous obstruction wider than 4 feet, such as a large duct or a cable tray bank, needs sprinklers installed below it. This rule surprises project teams because the ductwork is often not on the fire protection drawings. We coordinate with the mechanical plans specifically to find obstructions over 4 feet wide and add the heads before the AHJ does it for us in a review comment.

## 6. Small Rooms and Closets

NFPA 13 grants exemptions for small closets and bathrooms under specific size limits, but the exemption depends on the occupancy and the edition of the standard in force. We never leave a room unprotected on the assumption that an exemption applies. The drafter confirms the exemption with the engineer of record and notes it on the plan, because an unexplained gap in coverage reads as an error.

## 7. Orientation: Pendant, Upright, and Sidewall

Deflectors must face the correct direction: upright sprinklers throw upward, pendent sprinklers throw downward, and sidewall sprinklers throw outward from the wall. It sounds obvious, but on reflected ceiling plans with mixed ceiling types, the wrong symbol in the wrong room is a common drafting error. We use distinct symbols for each orientation and verify them against the ceiling types room by room.

## 8. Concealed Combustible Spaces

Attics, ceiling plenums, and other concealed spaces with combustible construction generally require sprinkler protection unless a specific exemption is met, such as noncombustible insulation or limited access with fireblocking. These spaces are invisible on the architectural floor plan, which is exactly why they get missed. Our plans include a concealed-space note block that states the protection approach for every such space in the building.

## 9. Show Pipe Sizes and Hangers on the Plan

The head layout is only half the drawing. We show branch line pipe sizes from the hydraulic calculations or pipe schedule, mark hanger locations and types per the hanging rules, and dimension the layout so the installing contractor can build from the sheet without interpretation. A beautiful head layout with no pipe sizes is a sketch, not a permit drawing.`,
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

## Hose Connection Placement

Hose connections go at each floor level and intermediate landing of every required stairway, positioned so firefighters can stretch hose to any point on the floor. The practical test we draft to: no portion of the floor area should be beyond a reasonable hose lay from a connection, and the AHJ will apply its own interpretation of reasonable. We also show the roof manifold where required, with the connections the fire department expects to find there.

## FDC Placement and Access

The fire department connection must be visible and accessible from the street front or another approved location, with signage the responding crew can read from the apparatus. We show the FDC on the site plan and the building elevations, coordinate its location with the civil grading so it is not buried behind landscaping, and detail the check valve arrangement behind it. An FDC the fire department cannot find quickly is a design failure no calculation can fix.

## Pressure, Testing, and the Notes Block

Our drawing notes state the required residual pressures, the hydrostatic test pressure of 200 psi held for two hours, and the flow test procedure. These notes are not decoration. They tell the reviewer the system was designed to NFPA 14 end to end, and they give the installing contractor the acceptance criteria before the pipe goes in the wall.`,
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

## Detection and Interlocks

Detection is shown as fusible links or electric thermal detectors positioned over each appliance and in the duct, rated for the temperatures the listing requires. The drawings also show the system microswitches and what they control: typically the makeup air unit shuts down on actuation while the exhaust fan keeps running to clear smoke, and a shunt trip drops power to outlets under the hood. Every interlock gets a line on the sequence notes so the electrician and the suppression contractor are working from the same sheet.

## Coordinating with the Hood and Duct Drawings

Suppression drawings do not stand alone. We coordinate the hood outline, duct routing, and clearances against the mechanical hood drawings, verifying the 18-inch clearance to combustible construction or the reduced clearance of a listed assembly. Grease duct access panels, the fan location, and the discharge termination all affect where detection and nozzles can physically go. When we find a conflict, such as a duct offset that breaks the nozzle coverage, we resolve it on the drawings before submittal instead of letting the installer discover it with a lift in the kitchen.`,
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

## Talk to People, Not Just Portals

Portals will not tell you that the plans examiner dislikes combined single-line diagrams, or that the fire marshal will fast-track your review if sprinkler calcs come in as a separate deferred submittal. People tell you that. For every new jurisdiction, we recommend a short pre-submittal call with the AHJ before the first drawing goes in. Fifteen minutes on the phone routinely saves three weeks of correction cycles.

And when you find a reviewer who is reasonable and responsive, write their name in the jurisdiction profile and treat that relationship like the asset it is. On a fifty-site rollout, three good relationships are worth more than three good templates.

## What We Put in Every Rollout Package

<Callout type="tip">Freeze the prototype, version the jurisdiction layer. Every site-adapted set we issue carries a revision block that separates prototype revisions from jurisdiction-specific changes, so a site correction never contaminates the core set.</Callout>

Multi-site permitting is not about working harder on each submittal. It is about building the machine once — profiles, templates, trackers, relationships — and letting each new site ride on what the last fifty taught you. That is how fifty jurisdictions stop feeling like fifty surprises.`,
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

Then feed the pattern back into the prototype. If three jurisdictions in a row flag the same detail, the prototype is wrong, not the examiners. That feedback loop is the difference between a rollout that gets faster with every site and one that makes the same mistakes fifty times.`,
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

## Life Safety During Construction

This is the section examiners read first and contractors skip at their peril. Every phase must maintain code-compliant egress: exit paths, exit signage, and emergency lighting that keep working while walls move and ceilings open up. Fire alarm and sprinkler coverage must be maintained or explicitly addressed — if sprinkler heads come down in a phase area, the drawings need to show interim protection or a fire watch arrangement the AHJ has accepted.

<Callout type="warning">Never assume the AHJ will accept a fire watch in place of sprinkler coverage. Get it in writing during pre-submittal and show the approved arrangement on the life-safety phasing plan. Verbal approval evaporates the day the inspector changes.</Callout>

Dust and fume separation between construction zones and occupied areas is not just courtesy either. In food service it is a health code issue, and the health inspector can stop work just as fast as the building inspector.

## Handing the Phases to the GC

Phasing drawings only work if the general contractor actually builds to them. Walk the phasing set with the GC before mobilization, confirm the sequence against their schedule, and make sure the temporary MEP tie-in points match what is really in the ceiling — field-verify, because as-builts lie.

When the inevitable mid-project change hits, revise the phasing plan first and the schedule second. The drawing is the contract for how the work happens around the open business. Occupied-space rollouts reward the team that draws the construction process, not just the finished product. Phase it on paper, and the store stays open.`,
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

## Where Handoffs Usually Break

In our experience, handoffs break in three predictable places. First, the gray zone of responsibility: nobody wrote down who owns the site-specific structural coordination, the utility service applications, or the energy compliance forms, so everyone assumes someone else is doing it — until the permit is due.

Second, the CAD standards collision: the prototype arrives in a layering and xref structure the local firm cannot use, and two weeks burn while drafters translate files instead of designing buildings. Agree on deliverable formats before the first site, not during it.

Third, silence after delivery: the prototype team ships the package and disappears, so the first round of plan-check corrections lands on a local architect with no access to the people who made the original decisions. All three failures are preventable with a written handoff protocol — which, tellingly, almost nobody has.

## A Better Handoff, in Practice

Write the protocol before the first site. Name the deliverables, the file formats, the decision log, and the support window after delivery — including who answers the local architect's questions during plan check and how fast. Treat the local architect as a partner absorbing your liability, not a vendor executing your drawings.

Get this right and site adaptation becomes the fastest part of your rollout instead of the part everyone dreads. Get it wrong and you will pay for the same missing information fifty times, in fifty cities, with fifty different architects wondering why the prototype team could not be bothered to explain itself.`,
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

## Takeoffs, Diffusers, and Return Paths

Every takeoff gets a location, a size, and a balancing damper — not just at the air handler, but at each branch, so the system can actually be balanced. The diffuser schedule should list neck size, throw, NC rating, and mounting type for every outlet; reviewers increasingly check NC ratings in offices and classrooms. Show return paths explicitly: ducted returns, transfer grilles, or door undercuts noted on the plan. Unplanned return air is the most common comfort complaint we see traced back to drawings — rooms starved of return go positive, doors whistle, and nobody can find the cause on paper.

## Coordinate Before You Call It Done

Ductwork shares the ceiling cavity with structure, plumbing, sprinklers, and lighting. On every layout we verify: bottom-of-steel and beam depths against duct depths plus insulation; sprinkler mains and waste piping crossing the trunk; diffuser locations aligned with the reflected ceiling plan and light fixtures; fire and smoke dampers at every rated partition, with access panels noted. A trunk that fits on the plan but not under a beam becomes a field reroute — draw the critical sections or do not run the duct there.

<Checklist items="Room-by-room supply, return, and outdoor-air CFM schedule shown;Every duct segment labeled with size and CFM;Sizing method and friction rate noted (equal friction or static regain);Diffuser schedule with neck size, throw, and NC rating;Balancing damper at each branch takeoff;Return-air paths shown and coordinated;Fire and smoke dampers at rated partitions with access panels;Critical sections drawn where ducts pass beams or congested zones" />`,
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

## Keep the Riser and the Plan in Sync

The riser and the floor plans are two views of one system, and they must agree exactly: fixture counts, pipe sizes at connections, and cleanout locations. Our drafting pass always ends with a cross-check — count fixtures on the plan, count them on the riser, and reconcile before the set goes out. On multi-story buildings, carry the same discipline floor to floor: a stack that changes size between levels needs the transition fitting drawn and the reason noted. Consistency across sheets is what makes a reviewer trust the set.

## Common Omissions That Slow Permits

The comments we see most often are avoidable: island-sink vents missing where the local amendment prohibits air-admittance valves; cleanouts shown on the floor plan but absent from the riser; no pipe material schedule, leaving the reviewer to guess; temperature-and-pressure relief discharge termination not shown or not piped to an approved location; expansion tanks missing on water heaters in closed systems; and grease-interceptor sizing notes absent on restaurant work. Each one is a one-line fix on the drawing and a two-week delay if it becomes a review comment.

<Callout type="tip">Draw the riser from the same fixture count as the floor plan. Nothing fails review faster than a riser showing six water closets on a floor where the plan shows eight — the reviewer stops trusting the whole set.</Callout>`,
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

## Shutoffs, Regulators, and the Riser Diagram

Show a shutoff valve at each appliance — accessible, within 6 feet, per IFGC 409.5 — plus the main service shutoff location. Draw the riser diagram from the meter through every branch to each appliance, with sizes labeled; the riser is where the reviewer traces your longest run. Show line regulators with vent piping routed to the outdoors where required, sediment traps at equipment connections, and seismic shutoff valves where the jurisdiction requires them. Add the bonding note: gas piping bonded per IFGC 310.1 and NEC 250.104. These details are small on the sheet and large in the field — the inspector will check every one.

<Checklist items="Longest-run developed length shown with fitting allowances;Appliance demand table with input BTUH and total connected load;Every segment labeled with size and BTUH served;Meter capacity verified against total connected load;Shutoff at each appliance, within 6 ft and accessible;Regulator vent piping routed to outdoors;Sediment traps at equipment connections;Bonding note per IFGC 310.1 included" />`,
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

## Occupancy Inputs the Reviewer Expects

Two inputs draw the most scrutiny. First, Pz: state whether the population comes from the owner's program or from the Table 6.2.2.1 default occupant densities — and use the same number everywhere. Second, Az: the net occupiable floor area from the architectural plan, not the gross building area. The single most common comment we help resolve is a ventilation table whose occupant count does not match the occupant load on the life-safety plan. Reconcile the two before submitting; if they legitimately differ, add a note explaining why.

## Calculation Notes That Prevent Comments

Place a short general-note block next to the table, not buried in the specifications: the 62.1 edition and the compliance path; outdoor-air intake locations with minimum separation distances per Section 5; demand-controlled ventilation where required — 62.1 calls for DCV in densely occupied spaces over 500 square feet, so flag those zones; and energy-recovery triggers where the adopted energy code requires them. Notes are cheap; review cycles are not.

<Callout type="note">Keep the ventilation table, the diffuser schedule, and the equipment schedule in agreement. A Vot of 1,200 cfm on the compliance sheet and an outdoor-air intake sized for 800 cfm on the mechanical plan is a guaranteed comment.</Callout>`,
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

## The Sequence of Operations

The sequence narrative is a plain-language table: for each zone, what happens on occupancy, on vacancy, on daylight contribution, and on time-clock events. A daylight zone dims to 40 percent when photosensor readings exceed the setpoint. An open office shuts off 20 minutes after vacancy. The sequence table is also what the commissioning agent tests against, so we write it to be testable — every row states a sensor input, a control action, and the resulting light level.

<Callout type="note">Title 24 acceptance testing is not optional. Our drawings include an acceptance-test note block listing the required functional tests per Part 6, because the inspector will ask for the completed forms before sign-off.</Callout>

## Documentation That Prevents Corrections

Beyond the plans, we assemble the compliance forms the AHJ expects: the lighting power density calculations with the allowed-versus-proposed comparison, the control credits claimed, and the mandatory-measures checklist. These ride with the drawing set on the first submittal. The most common correction we help resolve is a control drawing that is technically correct but unaccompanied by the forms — the reviewer cannot approve what they cannot document.

<Checklist items="Control zone boundaries drawn and tagged on the reflected ceiling plan;Daylight zones shown at perimeter and skylights with multi-level control noted;Occupancy and vacancy sensor schedule with coverage patterns and mounting heights;Manual area controls shown with zone assignments;Sequence of operations table written to be testable;Lighting power density calculations with allowed vs proposed;Acceptance-test note block per Title 24 Part 6;Compliance forms packaged with the first submittal, not added later" />`,
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

## Sources: Battery Packs, Inverters, and Generators

NEC 700.12 lists the permitted emergency sources, and the drawings must show which one serves each fixture. Unit equipment with integral batteries is the simplest to document: each fixture gets a battery-pack symbol and a note stating the 90-minute rating. Central inverters and generators serve grouped fixtures, and the drawings must show the circuiting back to the source with the transfer equipment identified.

The 90-minute duration is non-negotiable. Our fixture schedule carries a column for the emergency source and duration, and every egress fixture has an entry. A fixture on the egress path with a blank source column is a correction waiting to happen.

## Coordination With Fire Alarm and Architecture

Egress lighting does not stand alone. Exit signs are part of the same system and appear on the same sheets, circuited to the emergency source. We coordinate fixture locations with the reflected ceiling plan — a recessed emergency fixture drawn over a sprinkler head or a duct is a field conflict the reviewer will spot. Fire alarm notification appliances share the corridors, so we check candela ratings and fixture spacing together rather than letting two disciplines collide in the ceiling.

<Callout type="tip">Show the exit discharge path on the site plan, not just the building plans. Reviewers check that emergency illumination continues from the exit door to the public way, and that segment is the most commonly missed.</Callout>`,
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

## Property-Line Photometrics

The photometric plan is the centerpiece of the submittal. We calculate illuminance on a grid that extends past the property line, with values reported at the line itself — most ordinances set a maximum, often 0.5 foot-candles or less at residential boundaries, and some require zero measurable light. The calculation grid must be fine enough to catch hotspots between poles; a coarse grid hides the violations the reviewer's software will find.

> A photometric plan that stops at the property line is incomplete. The ordinance regulates what crosses the line, so the calculation has to show it.

## Curfews, Dimming, and Controls

Many ordinances impose lighting curfews: after closing or after a set hour, site lighting must dim to a fraction of full output or shut off entirely except for security lighting. Our drawings show the control zones and the curfew schedule — which fixtures dim, to what level, at what time — with the sequence tied to the time-clock or astronomical controls on the plan. Motion-sensor override for security zones is drawn and noted where the ordinance permits it.

## What We Put on the Plan Set

<Checklist items="Current municipal ordinance verified and section cited on the cover sheet;Every site fixture scheduled with BUG rating, U0 uplight where required;Zero-tilt mounting noted on details; house-side shields where adjacent to residential;Photometric grid extending past property lines with values at the line;Maximum property-line foot-candles verified against the ordinance;Curfew dimming schedule with zones, levels, and times;Color temperature verified against local caps;Cut sheets with IES files packaged with the submittal" />`,
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

## 4. Controls Assignment per Fixture Type

Each schedule row states its control: switched, dimmed, occupancy-sensor controlled, daylight-zone assignment. The assignment must match the control zoning on the reflected ceiling plan exactly — a fixture type shown in a daylight zone on the plan but scheduled as "switched" is a contradiction the contractor cannot resolve without an RFI.

## 5. Emergency and Egress Designation

Fixtures serving the egress path carry their emergency source in the schedule: integral battery pack with 90-minute rating, central inverter circuit, or generator-backed emergency circuit. Exit signs get their own rows with the same treatment. The life-safety reviewer reads this column first.

## 6. Details That Match the Schedule

For every mounting condition, a detail: pendant mounting with seismic bracing where required, recessed housing in rated ceilings with the fire rating maintained, pole base with anchor bolts and handhole, wall-pack with junction box coordination. Each detail carries the fixture types it applies to. A schedule that references detail 5/E-601 must find detail 5 on sheet E-601.

## 7. The Coordination Pass Before Issue

Before the set goes out, we run the schedule against the plans one final time: every type on the plan in the schedule, every control assignment matching the zoning, every detail reference resolving to a real detail, every lumen value matching the photometrics. Thirty minutes of checking prevents three weeks of RFIs. The schedule is a contract document — treat it like one.`,
  },
];
