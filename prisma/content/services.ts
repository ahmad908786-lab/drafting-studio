/**
 * Service content — 13 services across 4 categories. 2D AutoCAD scope only.
 * Consumed by prisma/seed.ts.
 */

export type ServiceSeed = {
  slug: string;
  name: string;
  category: string; // primary category slug
  secondaryCategory?: string;
  disciplines: string[]; // discipline slugs
  shortDesc: string;
  heroCopy: string;
  bodyMdx: string;
  deliverables: string[];
  documentsRequired: string[];
  notCovered: string[];
  valuePillars: { title: string; desc: string; icon: string }[];
  faqs: { q: string; a: string }[];
  turnaroundDays: number;
  startingPrice: number | null;
  priceNote?: string;
  order: number;
};

const PILLAR_SPEED = { title: "Fast Turnaround", desc: "Most sets delivered in 3–7 business days, rush options available.", icon: "Timer" };
const PILLAR_CODE = { title: "Code-Compliant", desc: "Drawn to current US codes and formatted for AHJ / permit submission.", icon: "ShieldCheck" };
const PILLAR_2D = { title: "Pure 2D AutoCAD", desc: "Clean, layered DWG + PDF sets — fast, precise, and easy to work with.", icon: "PenTool" };
const PILLAR_REV = { title: "Two Free Revisions", desc: "Included minor revisions so the set lands right the first time.", icon: "RefreshCw" };

const commonNotCovered = [
  "PE stamping / engineer of record sign-off",
  "On-site surveys or field verification visits",
  "Permit filing or agency expediting",
  "Structural, civil, or architectural design",
];

export const SERVICES: ServiceSeed[] = [
  /* ---------------- Electrical Design ---------------- */
  {
    slug: "electrical-system-design",
    name: "Electrical System Design",
    category: "electrical-design",
    disciplines: ["electrical"],
    order: 1,
    turnaroundDays: 5,
    startingPrice: 450,
    priceNote: "Per floor, up to 10,000 sq ft. Larger areas quoted on scope.",
    shortDesc: "Complete 2D AutoCAD electrical design services: power plans, panel schedules, single-line diagrams & device layouts drafted for permit & AHJ approval.",
    heroCopy:
      "Full electrical construction documents — power plans, panel schedules, riser diagrams and device layouts — drafted in clean, layered AutoCAD and formatted for AHJ submission.",
    bodyMdx: `## What we draft

Our electrical system design service delivers a complete 2D construction set for your project: receptacle and power plans, lighting and equipment circuiting, panel schedules, and a coordinated riser. Every sheet is drawn in AutoCAD on a disciplined layer standard so your engineer of record can review, redline, and stamp without cleanup.

## Built for permit

We draft to the current **National Electrical Code (NEC / NFPA 70)** and your local amendments, with load summaries, panel schedules, and general notes laid out the way plan reviewers expect. Whether it is a single tenant fit-out or a multi-unit building, you get a submission-ready set.

> We work strictly in 2D AutoCAD — you receive editable DWG files and plotted PDFs, never a locked model.`,
    deliverables: [
      "Power & receptacle plans",
      "Lighting circuiting plans",
      "Equipment & mechanical power connections",
      "Panel schedules (load calculations tie-in)",
      "Electrical riser / single line diagram",
      "Grounding & bonding details",
      "Legend, general notes & symbol schedule",
      "Layered DWG + plotted PDF set",
    ],
    documentsRequired: [
      "Architectural floor plan (DWG or PDF)",
      "Equipment schedule / cut sheets if available",
      "Utility service information",
      "Local code amendments or prior comments",
    ],
    notCovered: commonNotCovered,
    valuePillars: [PILLAR_SPEED, PILLAR_CODE, PILLAR_2D, PILLAR_REV],
    faqs: [
      { q: "Do you stamp the drawings?", a: "No — we are a drafting studio. We deliver permit-ready 2D sets that your licensed engineer reviews and stamps. Many clients are engineering firms who stamp in-house." },
      { q: "What files do I receive?", a: "Layered AutoCAD DWG files plus plotted PDFs. DXF is available on request." },
      { q: "Can you match our title block and layer standard?", a: "Yes. Send your CAD standard or a sample sheet and we draft to it." },
      { q: "How fast can you deliver?", a: "Typical turnaround is 5 business days per floor up to 10,000 sq ft; rush service is available." },
    ],
  },
  {
    slug: "site-electrical-plan",
    name: "Site Electrical Plan",
    category: "electrical-design",
    disciplines: ["electrical"],
    order: 2,
    turnaroundDays: 5,
    startingPrice: 400,
    priceNote: "Per site plan. Complex utility coordination quoted separately.",
    shortDesc: "Site electrical plans drafted in 2D: service entrance, site lighting feeds, EV charger circuits & utility routing coordinated on your civil site plan.",
    heroCopy:
      "Exterior power distribution drafted to scale — service entrance, site lighting feeds, EV and equipment circuits, and utility routing coordinated onto your civil site plan.",
    bodyMdx: `## Site-level electrical, drawn to scale

We take your civil or architectural site plan and lay out the exterior electrical scope: service entrance and metering, underground and overhead routing, site lighting feeds, gate and signage power, and pad-mounted equipment. The result is a clean 2D site electrical sheet that ties the building service back to the utility point of connection.

## Coordinated and clear

Feeder runs are drawn with conduit and conductor callouts, homeruns are tagged, and a site panel/feeder schedule keeps the distribution legible for the reviewer and the installing contractor.`,
    deliverables: [
      "Site power distribution plan",
      "Service entrance & metering layout",
      "Underground / overhead routing with conduit callouts",
      "Site & parking lighting feeds",
      "EV charger and site equipment circuits",
      "Feeder schedule & site panel summary",
      "General notes & legend",
    ],
    documentsRequired: [
      "Civil / architectural site plan (DWG or PDF)",
      "Utility service point information",
      "Site equipment list (lighting, gates, EV, signage)",
    ],
    notCovered: commonNotCovered,
    valuePillars: [PILLAR_SPEED, PILLAR_CODE, PILLAR_2D, PILLAR_REV],
    faqs: [
      { q: "Do you photometric the site lighting too?", a: "Yes, as an add-on. We can pair this with our Photometric Design service to deliver a point-by-point site lighting study." },
      { q: "Can you coordinate with the utility drawings?", a: "We route to the utility point of connection you provide; direct utility company negotiation is handled by your team." },
    ],
  },
  {
    slug: "single-line-diagram",
    name: "Single Line Diagram",
    category: "electrical-design",
    disciplines: ["electrical"],
    order: 3,
    turnaroundDays: 3,
    startingPrice: 250,
    priceNote: "Per single line diagram. Multi-service buildings quoted on scope.",
    shortDesc: "Electrical single-line diagrams drafted in AutoCAD: service, metering, distribution, feeders & overcurrent protection — clear, accurate, permit-ready.",
    heroCopy:
      "A precise electrical single line diagram — service, metering, distribution, feeders and overcurrent protection — drafted in AutoCAD for permit and coordination.",
    bodyMdx: `## The backbone of your electrical set

The single line (one-line) diagram is what a plan reviewer looks at first. We draft it clearly and completely: utility service, meter and main, distribution equipment, feeder sizes, overcurrent protective devices, grounding, and downstream panels — each element tagged and scheduled.

## Accurate and reviewer-friendly

We use standard symbols and a logical top-to-bottom hierarchy so ratings, AIC, conductor and conduit sizes are easy to trace. Provide your load data and equipment ratings and we turn it into a submission-ready one-line.`,
    deliverables: [
      "Utility service & metering representation",
      "Main distribution & panel hierarchy",
      "Feeder & conductor sizing callouts",
      "Overcurrent protective device ratings",
      "Grounding & bonding representation",
      "Equipment schedule references",
      "Layered DWG + plotted PDF",
    ],
    documentsRequired: [
      "Panel schedules or load list",
      "Equipment ratings (service size, AIC)",
      "Existing one-line if a revision",
    ],
    notCovered: commonNotCovered,
    valuePillars: [PILLAR_SPEED, PILLAR_CODE, PILLAR_2D, PILLAR_REV],
    faqs: [
      { q: "Can you produce a riser as well as a one-line?", a: "Yes — we can deliver both the single line and a physical riser diagram for the same project." },
      { q: "Do you do short-circuit / coordination studies?", a: "We draft the one-line and can represent provided study values; the engineering study itself is performed by your PE." },
    ],
  },
  {
    slug: "power-upgrade",
    name: "Power Upgrade",
    category: "electrical-design",
    disciplines: ["electrical"],
    order: 4,
    turnaroundDays: 5,
    startingPrice: 550,
    priceNote: "Per service upgrade. Multi-meter and multi-tenant buildings quoted on scope.",
    shortDesc: "Electrical service & panel upgrade drawings: existing-vs-new one-line, feeder routing & NEC load basis — drafted in 2D for permit approval and AHJ submittal.",
    heroCopy:
      "Upgrading an existing electrical service? We draft the permit set — existing versus new service, panel replacement, feeder routing and the load basis that justifies the new size.",
    bodyMdx: `## Existing conditions, then the upgrade

A service upgrade lives or dies on how clearly you show the reviewer what is there today and what changes. We draft both: an existing-conditions one-line marking what is demolished or reused, and the new service with its metering, main disconnect, distribution equipment and feeders.

## Sized on a defensible load basis

We build the connected and demand load tabulation that supports the new service size — existing loads retained, loads removed, and the new equipment being added — so the ampacity you are asking for is backed by numbers on the sheet. Panel schedules are reissued to reflect the new distribution.

## Drawn for the AHJ and the installer

Demolition and new work are separated on their own sheets or clearly hatched, conduit and conductor callouts follow the feeder runs, and grounding and bonding upgrades are shown to current code.`,
    deliverables: [
      "Existing vs. new service one-line diagram",
      "Demolition & new work power plans",
      "Service entrance, metering & main disconnect layout",
      "Feeder routing with conduit & conductor callouts",
      "Updated panel schedules",
      "Load tabulation supporting the new service size",
      "Grounding & bonding upgrade details",
      "General notes & legend",
      "Layered DWG + plotted PDF",
    ],
    documentsRequired: [
      "Existing one-line and/or panel schedules",
      "Photos or survey of the existing service equipment",
      "Floor plan (DWG or PDF)",
      "New equipment list and loads being added",
      "Utility correspondence, if the service size is already agreed",
    ],
    notCovered: commonNotCovered,
    valuePillars: [PILLAR_SPEED, PILLAR_CODE, PILLAR_2D, PILLAR_REV],
    faqs: [
      { q: "Can you work from photos if there are no existing drawings?", a: "Often yes. Clear photos of the panel directory, nameplate and service equipment plus a floor plan are usually enough for us to draft existing conditions." },
      { q: "Do you handle the utility application?", a: "We draft the sheets and load basis your utility and AHJ ask for. The application itself is submitted by you or your engineer of record." },
      { q: "Does this include the load calculation?", a: "A load tabulation supporting the new service size is included. A standalone stamped study is available through our Electrical Load Calculation service." },
      { q: "Can you show demolition separately?", a: "Yes. Demo and new work are delivered on separate sheets, or hatched distinctly on a combined sheet if you prefer." },
    ],
  },
  {
    slug: "lighting-design",
    name: "Lighting Design",
    category: "electrical-design",
    disciplines: ["lighting"],
    order: 5,
    turnaroundDays: 5,
    startingPrice: 400,
    priceNote: "Per floor up to 10,000 sq ft. Fixtures specified by client or per allowance.",
    shortDesc: "Interior & exterior lighting design drafted in 2D AutoCAD: fixture layouts, switching, controls & fixture schedules — code-compliant and permit-ready.",
    heroCopy:
      "Lighting layouts that balance code, comfort and cost — fixture placement, switching, controls and a coordinated fixture schedule, drafted in AutoCAD.",
    bodyMdx: `## Lighting laid out right

We place luminaires to suit the space and the code: general, task and accent lighting, emergency and egress fixtures, exit signage, and exterior/building-mounted fixtures. Switching, dimming, occupancy sensing and daylight zones are drawn and tagged with a clear controls narrative.

## Ready to pair with photometrics

Lighting layouts pair naturally with our **Photometric Design** service when you need a point-by-point footcandle study for code compliance or client sign-off.`,
    deliverables: [
      "Interior lighting layout & fixture placement",
      "Exterior / building-mounted lighting",
      "Emergency & egress lighting, exit signage",
      "Switching, dimming & controls plan",
      "Fixture schedule with types & mounting",
      "Lighting circuiting & homeruns",
      "Legend & general notes",
    ],
    documentsRequired: [
      "Architectural floor plan / RCP (DWG or PDF)",
      "Fixture preferences or spec allowance",
      "Ceiling types & heights",
    ],
    notCovered: commonNotCovered,
    valuePillars: [PILLAR_SPEED, PILLAR_CODE, PILLAR_2D, PILLAR_REV],
    faqs: [
      { q: "Do you select the fixtures?", a: "We can lay out to your specified fixtures or propose types to an allowance and family you approve." },
      { q: "Can you include a photometric study?", a: "Yes — add our Photometric Design service for a point-by-point footcandle analysis." },
    ],
  },
  {
    slug: "photometric-design",
    name: "Photometric Design",
    category: "electrical-design",
    secondaryCategory: "calculations-reports",
    disciplines: ["lighting"],
    order: 6,
    turnaroundDays: 5,
    startingPrice: 500,
    priceNote: "Per area up to 15,000 sq ft. Delivered per IES standards.",
    shortDesc: "Photometric lighting studies per IES standards: point-by-point footcandle grids, uniformity ratios & dark-sky compliance for interiors, parking lots and sites.",
    heroCopy:
      "Point-by-point photometric studies to prove your lighting meets code and design targets — interior, parking, site and facade — delivered as a calc grid and report.",
    bodyMdx: `## Prove the light levels

A photometric study models illuminance across a space using manufacturer IES files and shows the footcandle grid, average/min/max, uniformity ratios, and compliance with the applicable code or dark-sky ordinance. We deliver the calculation plan plus a summary report suitable for AHJ or client review.

## Where it is used

Parking lots and garages, building exteriors and facades, sports courts, warehouses, retail and restaurant interiors, healthcare, and any project with a minimum-illuminance or light-trespass requirement.`,
    deliverables: [
      "Point-by-point footcandle calculation grid",
      "Average / min / max & uniformity ratios",
      "Fixture layout with IES types",
      "Code / ordinance compliance summary",
      "Light trespass & spill check (site)",
      "Photometric plan (DWG + PDF) & report",
    ],
    documentsRequired: [
      "Floor plan or site plan (DWG or PDF)",
      "Fixture IES files or model numbers",
      "Target footcandle criteria / applicable code",
      "Mounting heights",
    ],
    notCovered: [
      "Fixture supply or procurement",
      "PE stamping",
      "On-site light meter readings",
      "Utility rebate filing",
    ],
    valuePillars: [
      { title: "IES-Standard Output", desc: "Grids and ratios computed per IES methodology.", icon: "Gauge" },
      PILLAR_SPEED,
      { title: "All Building Types", desc: "Interior, parking, site, facade and sports lighting.", icon: "Building2" },
      PILLAR_REV,
    ],
    faqs: [
      { q: "Which software do you use?", a: "Industry-standard photometric tools driven by manufacturer IES files; output follows IES methodology." },
      { q: "Can you hit a specific footcandle target?", a: "Yes — give us the criteria (e.g. 5 fc average in the lot) and we lay out fixtures to meet it." },
      { q: "Do you handle dark-sky / light-trespass limits?", a: "Yes, we check spill and trespass at the property line against the ordinance you provide." },
    ],
  },
  {
    slug: "fire-alarm-system-design",
    name: "Fire Alarm System Design",
    category: "electrical-design",
    secondaryCategory: "fire-protection",
    disciplines: ["fire-protection", "electrical"],
    order: 7,
    turnaroundDays: 6,
    startingPrice: 500,
    priceNote: "Per floor up to 12,000 sq ft. Voice/mass-notification quoted separately.",
    shortDesc: "Fire alarm system design to NFPA 72: device layouts, SLC/NAC circuiting, risers, battery & voltage-drop calcs — drafted in clean 2D for permit submittals.",
    heroCopy:
      "Fire alarm device plans, riser diagrams and supporting calculations drafted to NFPA 72 — initiating and notification devices placed, circuited and scheduled.",
    bodyMdx: `## Fire alarm, drawn to NFPA 72

We draft the complete fire alarm shop/permit set in 2D: initiating devices (pulls, smoke, heat, duct detectors), notification appliances (horns, strobes, speakers) placed for coverage and candela, the SLC/NAC circuiting, and a clear system riser. Battery and voltage-drop calculations back up the design.

## Coordinated with the building

Device placement is coordinated with the architectural reflected ceiling and egress plan so spacing, mounting heights and candela selections hold up under review.`,
    deliverables: [
      "Initiating & notification device plans",
      "Candela & spacing coverage",
      "SLC / NAC circuiting",
      "Fire alarm riser diagram",
      "Battery & voltage-drop calculations",
      "Device & equipment schedule",
      "Sequence of operations / matrix",
      "Legend & general notes",
    ],
    documentsRequired: [
      "Architectural floor & reflected ceiling plans",
      "Occupancy type & egress plan",
      "Panel type / manufacturer if specified",
      "Local amendments to NFPA 72",
    ],
    notCovered: [
      "PE / NICET stamping (provided by your team)",
      "Panel programming",
      "On-site acceptance testing",
      "Permit filing",
    ],
    valuePillars: [
      { title: "NFPA 72 Compliant", desc: "Device spacing, candela and circuits to the current code.", icon: "ShieldCheck" },
      PILLAR_SPEED,
      { title: "Calcs Included", desc: "Battery standby and voltage-drop calculations provided.", icon: "Calculator" },
      PILLAR_2D,
    ],
    faqs: [
      { q: "Do you include battery calculations?", a: "Yes — standby/alarm battery and NAC voltage-drop calculations are part of the set." },
      { q: "Can you draft to a specific panel manufacturer?", a: "Yes, tell us the panel/family and we schedule and circuit to it." },
    ],
  },

  /* ---------------- Mechanical Design ---------------- */
  {
    slug: "mechanical-design",
    name: "Mechanical Design",
    category: "mechanical-design",
    disciplines: ["hvac", "plumbing"],
    order: 8,
    turnaroundDays: 6,
    startingPrice: 600,
    priceNote: "Combined HVAC + plumbing scope; per floor up to 10,000 sq ft.",
    shortDesc: "Coordinated mechanical design drafted in 2D AutoCAD: HVAC ductwork plus plumbing — water, waste, vent & gas — in one full permit-ready construction set.",
    heroCopy:
      "Mechanical is our umbrella for HVAC and plumbing. Get both disciplines drafted and coordinated as one 2D construction set — ductwork, piping, equipment and schedules.",
    bodyMdx: `## One coordinated mechanical set

"Mechanical" covers two disciplines that share a ceiling: **HVAC** and **plumbing**. When you need both, we draft them together so ductwork, piping, and equipment don't fight for the same space, and the sheets read as one coherent set.

## Two ways in

- Need only air-side work? See [HVAC Design](/services/mechanical-design/hvac-design).
- Need only water, waste and gas? See [Plumbing Design](/services/mechanical-design/plumbing-design).
- Need both, coordinated? This is the service for you.`,
    deliverables: [
      "HVAC equipment & ductwork plans",
      "Plumbing water, waste, vent & gas plans",
      "Mechanical & plumbing riser diagrams",
      "Equipment & fixture schedules",
      "Coordinated ceiling-space layout",
      "Details, legend & general notes",
      "Layered DWG + plotted PDF set",
    ],
    documentsRequired: [
      "Architectural floor & ceiling plans",
      "Equipment / fixture selections if available",
      "Load or fixture-unit basis if already computed",
    ],
    notCovered: commonNotCovered,
    valuePillars: [PILLAR_SPEED, PILLAR_CODE, PILLAR_2D, PILLAR_REV],
    faqs: [
      { q: "What does 'mechanical' include here?", a: "In this studio, mechanical means HVAC and plumbing. You can order them together (this service) or separately." },
      { q: "Do you coordinate the two disciplines?", a: "Yes — when both are ordered we lay them out together so ductwork and piping are deconflicted in the ceiling." },
    ],
  },
  {
    slug: "hvac-design",
    name: "HVAC Design",
    category: "mechanical-design",
    disciplines: ["hvac"],
    order: 9,
    turnaroundDays: 6,
    startingPrice: 500,
    priceNote: "Per floor up to 10,000 sq ft. Load calc available as add-on.",
    shortDesc: "HVAC design drafted in 2D AutoCAD to the IMC: equipment, ductwork, diffusers, exhaust & controls — coordinated to your ceiling plans and permit-ready.",
    heroCopy:
      "Air-side HVAC drafted in 2D — equipment placement, supply/return ductwork, diffusers, exhaust and controls — coordinated to the ceiling and drawn to the mechanical code.",
    bodyMdx: `## Air-side, fully drafted

We draft the HVAC construction set: rooftop units, split systems, VAV/FCU equipment, supply and return ductwork with sizes, diffusers and grilles, exhaust and make-up air, and the controls/thermostat layout. Ductwork is sized and routed to the reflected ceiling so it clears lights and structure.

## Code and comfort

Drawn to the **International Mechanical Code (IMC)** and local amendments, with ventilation rates, equipment schedules and details laid out for permit. Pair with our **HVAC Heating & Cooling Load** service for the Manual-J/ASHRAE basis.`,
    deliverables: [
      "Equipment placement (RTU, split, VAV, FCU)",
      "Supply & return ductwork with sizing",
      "Diffuser & grille layout",
      "Exhaust & make-up air",
      "Thermostat & controls layout",
      "Equipment schedule",
      "Mechanical details, legend & notes",
    ],
    documentsRequired: [
      "Architectural floor & ceiling plans",
      "Equipment selections or preferences",
      "Load calculation if already performed",
    ],
    notCovered: commonNotCovered,
    valuePillars: [PILLAR_SPEED, PILLAR_CODE, PILLAR_2D, PILLAR_REV],
    faqs: [
      { q: "Do you size the ductwork?", a: "Yes — ductwork is sized and tagged. If you need the underlying heating/cooling load, add our load-calculation service." },
      { q: "Can you draft to our equipment schedule?", a: "Absolutely. Send the selections and we lay out and schedule to them." },
    ],
  },
  {
    slug: "plumbing-design",
    name: "Plumbing Design",
    category: "mechanical-design",
    disciplines: ["plumbing"],
    order: 10,
    turnaroundDays: 6,
    startingPrice: 500,
    priceNote: "Per floor up to 10,000 sq ft.",
    shortDesc: "Plumbing design drafted in 2D to IPC/UPC: domestic water, sanitary, vent, storm & gas piping with risers, fixture schedules & isometric details for permit.",
    heroCopy:
      "Plumbing drafted in 2D — domestic water, sanitary and vent, storm and gas — with waste/vent risers, fixture schedules and isometric details to the plumbing code.",
    bodyMdx: `## Water, waste, vent and gas

We draft the full plumbing set: domestic cold and hot water distribution, sanitary drainage and venting, storm where applicable, and natural gas piping. Waste and vent risers, water riser, fixture schedule and connection details round out a permit-ready package.

## Drawn to the code

Prepared to the **International Plumbing Code (IPC)** / UPC and local amendments, with pipe sizing callouts and fixture-unit basis represented. Isometric riser details make the vertical system easy to review and install.`,
    deliverables: [
      "Domestic water distribution plan",
      "Sanitary drainage & vent plan",
      "Storm drainage (where applicable)",
      "Natural gas piping plan",
      "Waste/vent & water riser diagrams",
      "Fixture schedule & connection details",
      "Isometric details, legend & notes",
    ],
    documentsRequired: [
      "Architectural floor plans with fixtures",
      "Fixture schedule or selections",
      "Site utility connection points",
    ],
    notCovered: commonNotCovered,
    valuePillars: [PILLAR_SPEED, PILLAR_CODE, PILLAR_2D, PILLAR_REV],
    faqs: [
      { q: "Do you include gas piping?", a: "Yes — natural gas piping layout and sizing callouts are included where the project has gas." },
      { q: "Do you draft isometrics?", a: "Yes, waste/vent and water riser isometrics are part of the standard set." },
    ],
  },

  /* ---------------- Fire Protection ---------------- */
  {
    slug: "sprinkler-layout-plan",
    name: "Sprinkler Layout Plan",
    category: "fire-protection",
    disciplines: ["fire-protection"],
    order: 11,
    turnaroundDays: 6,
    startingPrice: 500,
    priceNote: "Per floor up to 12,000 sq ft.",
    shortDesc: "Fire sprinkler shop drawings to NFPA 13: head layouts, branch & main routing, hangers & details — drafted in 2D for AHJ approval & fabrication shop use.",
    heroCopy:
      "Fire sprinkler shop drawings drafted to NFPA 13 — head placement, branch and main routing, hanger and seismic details — ready for AHJ and fabrication.",
    bodyMdx: `## Sprinkler shop drawings, done right

We draft the fire sprinkler layout to **NFPA 13** (or 13R/13D): head placement by hazard and coverage, branch lines and cross mains, riser location, and the hanger, bracing and detail sheets. Drawings are laid out for permit approval and for the fabrication shop.`,
    deliverables: [
      "Sprinkler head layout by coverage & hazard",
      "Branch line & cross main routing",
      "Riser location & detail",
      "Hanger & seismic bracing details",
      "Pipe sizing callouts",
      "Head & fitting schedule",
      "Legend, notes & cover sheet",
    ],
    documentsRequired: [
      "Architectural floor & reflected ceiling plans",
      "Occupancy / hazard classification",
      "Ceiling construction & obstructions",
      "Water supply / flow test data",
    ],
    notCovered: [
      "PE stamping (provided by your team)",
      "On-site verification",
      "Underground fire main design",
      "Permit filing",
    ],
    valuePillars: [
      { title: "NFPA 13 Compliant", desc: "Spacing, coverage and hazard to the current standard.", icon: "ShieldCheck" },
      PILLAR_SPEED,
      { title: "Fab-Ready", desc: "Drawings a fabrication shop can cut and build from.", icon: "Wrench" },
      PILLAR_2D,
    ],
    faqs: [
      { q: "Do you provide hydraulic calculations?", a: "Not as a standard package. Send us your scope and water supply data and we will quote the calculation separately." },
      { q: "Which NFPA standard do you draft to?", a: "13, 13R or 13D depending on occupancy — tell us the building type and we apply the right one." },
    ],
  },
  /* ---------------- Calculations & Reports ---------------- */
  {
    slug: "electrical-load-calculation",
    name: "Electrical Load Calculation",
    category: "calculations-reports",
    disciplines: ["electrical"],
    order: 12,
    turnaroundDays: 4,
    startingPrice: 300,
    priceNote: "Per service / building. Multi-tenant quoted per scope.",
    shortDesc: "NEC Article 220 electrical load calculations: connected & demand loads, panel schedules & service sizing — plus the utility load letter your AHJ requires.",
    heroCopy:
      "NEC-based load calculations that right-size your service — connected and demand loads, panel schedules, and the load letter your utility or AHJ requires.",
    bodyMdx: `## Size the service with confidence

We compute the electrical load per **NEC Article 220**: connected loads by category, demand factors, largest-motor and continuous-load adjustments, and the resulting service and feeder sizes. Output includes panel schedules and a load summary — plus a utility load letter when you need one.

## Common uses

New services and upgrades, tenant fit-outs, added equipment or EV charging, and utility service applications that require a signed load letter (stamped by your engineer).`,
    deliverables: [
      "Connected & demand load summary (NEC 220)",
      "Panel schedules with circuit loading",
      "Service & feeder sizing",
      "Largest-motor & continuous-load adjustments",
      "Utility load letter (unstamped, ready for your PE)",
      "Assumptions & code-reference notes",
    ],
    documentsRequired: [
      "Equipment list / nameplate data",
      "Floor plan or panel layout",
      "Existing panel schedules if an upgrade",
      "Utility / service voltage",
    ],
    notCovered: [
      "PE stamping of the load letter",
      "Short-circuit & coordination study",
      "Utility negotiation",
      "On-site metering",
    ],
    valuePillars: [
      { title: "NEC-Accurate", desc: "Article 220 method with documented demand factors.", icon: "ShieldCheck" },
      { title: "4-Day Delivery", desc: "Fast enough to keep your service application moving.", icon: "Timer" },
      { title: "Load Letter", desc: "Utility-format letter your PE can stamp.", icon: "FileText" },
      PILLAR_REV,
    ],
    faqs: [
      { q: "Do you provide a load letter for the utility?", a: "Yes — we produce the load letter in a utility-ready format for your engineer to stamp." },
      { q: "Can you calc for added EV chargers?", a: "Yes — we include EVSE loads and any required demand management in the calculation." },
    ],
  },
  {
    slug: "hvac-heating-cooling-load",
    name: "HVAC Heating & Cooling Load",
    category: "calculations-reports",
    disciplines: ["hvac"],
    order: 13,
    turnaroundDays: 4,
    startingPrice: 350,
    priceNote: "Per zone/building up to 10,000 sq ft. Larger scopes quoted.",
    shortDesc: "Manual-J & ASHRAE heating/cooling load calculations: room-by-room loads, equipment sizing & ventilation basis for mechanical permit approval and sizing.",
    heroCopy:
      "Room-by-room heating and cooling load calculations — Manual-J / ASHRAE method — that size your equipment correctly and back up the mechanical permit set.",
    bodyMdx: `## Right-size the equipment

Over- and under-sized HVAC costs comfort and energy. We run the **Manual-J / ASHRAE** load calculation room-by-room: envelope, glazing, infiltration, occupancy, ventilation and internal gains, at your design conditions — producing block and zone loads and the equipment tonnage/BTU basis.

## Backs your mechanical set

The load report is the engineering basis reviewers expect behind an HVAC permit set, and it feeds directly into our **HVAC Design** drafting service.`,
    deliverables: [
      "Room-by-room heating & cooling loads",
      "Block & zone load summary",
      "Design-condition & envelope assumptions",
      "Ventilation (ASHRAE 62.1) basis",
      "Equipment sizing (tonnage / BTU)",
      "Load report with methodology notes",
    ],
    documentsRequired: [
      "Architectural floor plans",
      "Envelope / construction assemblies (R-values, glazing)",
      "Occupancy & ventilation requirements",
      "Design conditions / location",
    ],
    notCovered: [
      "PE stamping",
      "Energy-model / COMcheck compliance report",
      "On-site survey",
      "Equipment procurement",
    ],
    valuePillars: [
      { title: "Manual-J / ASHRAE", desc: "Recognized methodology reviewers accept.", icon: "ShieldCheck" },
      { title: "4-Day Delivery", desc: "Quick basis so drafting isn't held up.", icon: "Timer" },
      { title: "Feeds the Set", desc: "Flows straight into HVAC drafting.", icon: "PenTool" },
      PILLAR_REV,
    ],
    faqs: [
      { q: "Is this Manual-J?", a: "For residential we use Manual-J; for commercial we use the ASHRAE method. We pick the right basis for your building." },
      { q: "Do you also draft the HVAC plans?", a: "Yes — order HVAC Design and we carry the load results straight into the drawings." },
    ],
  },
];
