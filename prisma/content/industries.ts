/** Industry content — 12 sectors. Consumed by prisma/seed.ts. */

export type IndustrySeed = {
  slug: string;
  name: string;
  icon: string;
  shortDesc: string;
  bodyMdx: string;
  painPoints: string[];
  stats: { value: string; label: string }[];
  order: number;
};

export const INDUSTRIES: IndustrySeed[] = [
  {
    slug: "franchise",
    name: "Franchise",
    icon: "Store",
    order: 1,
    shortDesc: "Prototype-driven MEP, fire and lighting sets rolled out across every location.",
    bodyMdx: `## Roll out faster, everywhere

Franchise programs live or die on consistency and speed. We take your prototype and adapt the electrical, HVAC, plumbing, fire protection and lighting drawings to each new site — landlord conditions, local code amendments and jurisdiction quirks — while keeping the brand standard intact.

Because we work in pure 2D AutoCAD to your CAD standard, every location's set looks identical and drops straight into your rollout package.`,
    painPoints: [
      "Adapting one prototype to dozens of jurisdictions",
      "Keeping brand and equipment standards consistent",
      "Meeting aggressive site-open dates",
      "Landlord and shell-condition variations",
    ],
    stats: [
      { value: "48 hrs", label: "Typical site adaptation" },
      { value: "1", label: "Prototype, every location" },
    ],
  },
  {
    slug: "residential",
    name: "Residential",
    icon: "Home",
    order: 2,
    shortDesc: "Single-family and multi-unit electrical, mechanical and plumbing plans for permit.",
    bodyMdx: `## Homes, permitted without the wait

From custom single-family to townhome and ADU projects, we draft the electrical, HVAC and plumbing plans your build needs to clear permit — including Manual-J loads and NEC load calculations where the AHJ asks for them.`,
    painPoints: [
      "AHJs requiring load calcs before permit",
      "Coordinating trades on tight residential ceilings",
      "Energy-code compliance documentation",
    ],
    stats: [
      { value: "3–5 days", label: "Typical single-family set" },
      { value: "Manual-J", label: "Loads on request" },
    ],
  },
  {
    slug: "commercial",
    name: "Commercial",
    icon: "Building2",
    order: 3,
    shortDesc: "Tenant fit-outs and core-and-shell MEP, fire and lighting construction sets.",
    bodyMdx: `## Commercial fit-outs and shells

Tenant improvements, white-box fit-outs and core-and-shell — we draft the full MEP, fire protection and lighting scope coordinated to the base building and formatted for the plan reviewer.`,
    painPoints: [
      "Base-building coordination and existing conditions",
      "Fast-track TI schedules",
      "Multi-discipline coordination on one ceiling",
    ],
    stats: [
      { value: "98%", label: "First-time approval" },
      { value: "5 days", label: "Typical TI set" },
    ],
  },
  {
    slug: "restaurant",
    name: "Restaurant",
    icon: "UtensilsCrossed",
    order: 4,
    shortDesc: "Kitchen-heavy electrical, HVAC exhaust, plumbing and fire suppression layouts.",
    bodyMdx: `## Kitchens are hard — we draft them daily

Restaurants pack heavy electrical loads, Type-I hood exhaust and make-up air, grease and gas piping, and fire suppression into a small footprint. We coordinate all of it into a clean 2D set that survives health-department and building review.`,
    painPoints: [
      "Type-I hood exhaust & make-up air balance",
      "Heavy kitchen equipment loads",
      "Grease waste and gas piping coordination",
      "Fast franchise and independent open dates",
    ],
    stats: [
      { value: "Type I/II", label: "Hood exhaust drafted" },
      { value: "48 hrs", label: "Franchise adaptations" },
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    icon: "Stethoscope",
    order: 5,
    shortDesc: "Clinics, dental and medical fit-outs with code-critical MEP and life-safety.",
    bodyMdx: `## Exacting spaces, drafted precisely

Medical and dental offices, urgent care and clinics carry strict requirements — dedicated circuits and isolated power, medical gas, exhaust and pressure relationships, and life-safety. We draft the MEP, fire and lighting scope to the elevated standard these spaces demand.`,
    painPoints: [
      "Dedicated / isolated power and grounding",
      "Medical gas and specialty exhaust",
      "Pressure relationships and ventilation",
      "Life-safety and egress lighting",
    ],
    stats: [
      { value: "NFPA 99", label: "Where applicable" },
      { value: "6 days", label: "Typical clinic set" },
    ],
  },
  {
    slug: "salon",
    name: "Salon & Spa",
    icon: "Scissors",
    order: 6,
    shortDesc: "Salon, spa and wellness fit-outs with station power, ventilation and plumbing.",
    bodyMdx: `## Stations, water and air — balanced

Salons and spas need station power and dedicated circuits, plenty of hot water and drainage at every bowl, and ventilation that clears chemical fumes. We lay out the electrical, plumbing and HVAC so the space is comfortable, compliant and ready to open.`,
    painPoints: [
      "Station power and dedicated circuits",
      "Hot water demand and drainage at bowls",
      "Ventilation for chemical fumes",
    ],
    stats: [
      { value: "3–5 days", label: "Typical salon set" },
      { value: "Multi-bowl", label: "Plumbing risers" },
    ],
  },
  {
    slug: "hotel",
    name: "Hotel",
    icon: "BedDouble",
    order: 7,
    shortDesc: "Hospitality MEP, fire and lighting from guest floors to back-of-house.",
    bodyMdx: `## Repeatable floors, coordinated cores

Hotels reward a disciplined, repeatable approach: guestroom electrical and plumbing stacks, corridor and amenity lighting, back-of-house mechanical, and full fire protection and alarm coverage. We draft typical floors once and roll them cleanly through the tower.`,
    painPoints: [
      "Guestroom stack repetition and risers",
      "Corridor and amenity lighting",
      "Full-coverage fire protection & alarm",
      "Back-of-house mechanical loads",
    ],
    stats: [
      { value: "Typical-floor", label: "Repeatable stacks" },
      { value: "NFPA 13/72", label: "Full coverage" },
    ],
  },
  {
    slug: "apartments",
    name: "Apartments",
    icon: "Building",
    order: 8,
    shortDesc: "Multifamily unit stacks, house panels, risers and full life-safety.",
    bodyMdx: `## Multifamily, stacked and permitted

From garden-style to mid-rise, we draft repeatable unit electrical and plumbing, house and unit metering, mechanical ventilation, and the sprinkler and fire-alarm coverage (NFPA 13R/13) multifamily requires — coordinated across the stack.`,
    painPoints: [
      "Unit repetition and vertical risers",
      "House vs. unit metering",
      "NFPA 13R sprinkler coverage",
      "Ventilation and make-up air",
    ],
    stats: [
      { value: "13R / 13", label: "Sprinkler basis" },
      { value: "Per-unit", label: "Repeatable stacks" },
    ],
  },
  {
    slug: "plaza",
    name: "Plaza & Retail",
    icon: "ShoppingBag",
    order: 10,
    shortDesc: "Strip centers and plazas: multi-tenant power, site lighting and fire.",
    bodyMdx: `## Multi-tenant, one coordinated site

Retail plazas and strip centers need multi-tenant metering and distribution, site and parking photometrics, storefront and sign power, and shell fire protection. We draft the site-wide electrical and the per-tenant scope so leasing and construction move together.`,
    painPoints: [
      "Multi-tenant metering and distribution",
      "Site and parking-lot photometrics",
      "Storefront and pylon-sign power",
      "Shell vs. tenant scope splits",
    ],
    stats: [
      { value: "Site-wide", label: "Photometric studies" },
      { value: "Per-tenant", label: "Distribution splits" },
    ],
  },
  {
    slug: "offices",
    name: "Offices",
    icon: "Briefcase",
    order: 11,
    shortDesc: "Office fit-outs with power, data, lighting controls and comfort HVAC.",
    bodyMdx: `## Workspaces that just work

Office fit-outs balance flexible power and data, tunable lighting with occupancy and daylight controls, and comfortable, well-zoned HVAC. We draft the electrical, lighting and mechanical scope so the space is efficient, code-compliant and easy to occupy.`,
    painPoints: [
      "Flexible power / furniture whips",
      "Lighting controls and daylight zones",
      "Comfort zoning and ventilation",
      "Open-ceiling coordination",
    ],
    stats: [
      { value: "Controls", label: "Daylight & occupancy" },
      { value: "5 days", label: "Typical fit-out set" },
    ],
  },
  {
    slug: "warehouse",
    name: "Warehouse",
    icon: "Warehouse",
    order: 12,
    shortDesc: "Distribution and storage: high-bay lighting, ESFR sprinkler, power drops.",
    bodyMdx: `## Big boxes, drafted right

Warehouses and distribution centers demand high-bay lighting with photometrics, ESFR or in-rack sprinkler protection, equipment and dock power, and ventilation. We draft the electrical, lighting and fire protection to keep the box safe, bright and operational.`,
    painPoints: [
      "High-bay lighting & photometrics",
      "ESFR / in-rack sprinkler protection",
      "Dock and equipment power drops",
      "Ventilation and heating of large volumes",
    ],
    stats: [
      { value: "ESFR", label: "Sprinkler layouts" },
      { value: "High-bay", label: "Photometric grids" },
    ],
  },
];
