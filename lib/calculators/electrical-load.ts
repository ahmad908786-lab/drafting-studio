/**
 * NEC Article 220 standard-method electrical load calculation (NEC 2023).
 *
 * Pure functions, no I/O. Verified against the two worked dwelling examples
 * and the 3,000 sq ft office example in
 * scripts/verify-electrical-load-calculator.ts.
 *
 * Dwelling rules (Article 220 Part III):
 * - General lighting: 3 VA per sq ft (220.41), covers lighting plus
 *   general-use receptacles, so receptacles are not added separately.
 * - Small-appliance circuits: 1,500 VA each, minimum 2 (220.52(A)).
 * - Laundry circuit: 1,500 VA (220.52(B)).
 * - Table 220.42 demand on the combined general subtotal: first 3,000 VA
 *   at 100%, 3,001 to 120,000 VA at 35%, over 120,000 VA at 25%.
 * - Range: Table 220.55 Column C, 12 kW or less is 8,000 VA.
 * - Dryer: 220.54, the larger of nameplate or 5,000 VA.
 * - Fixed appliances: 220.53, 75% demand only when 4 or more are fastened
 *   in place (range, dryer and HVAC excluded).
 * - HVAC: the larger of heating or cooling only (220.60).
 *
 * Small-commercial rules (Article 220 Part III):
 * - General lighting: Table 220.42(A) unit loads by occupancy. The table
 *   note says the 125% continuous factor is already in these values, so
 *   it is not applied again.
 * - Lighting demand (Table 220.45): 100% for most occupancies; warehouse
 *   first 12,500 VA at 100%, remainder at 50%.
 * - Receptacles: 180 VA per outlet (220.14(I)); demand first 10,000 VA at
 *   100%, remainder at 50% (220.47). Offices take the larger of the
 *   receptacle total or 1 VA per sq ft (220.14(K)).
 * - Sign outlet: 1,200 VA, continuous, so 125% (220.14(F)).
 * - Show window: 200 VA per linear foot, continuous, so 125% (220.14(G)).
 * - Commercial kitchen equipment: Table 220.56 demand by piece count
 *   (1 to 2 at 100%, 3 at 90%, 4 at 80%, 5 at 75%, 6 or more at 65%).
 * - Largest motor: plus 25% (430.24).
 *
 * The 2026 NEC moves load calculations to Article 120 and cuts the dwelling
 * general lighting load to 2 VA per sq ft for feeder and service work
 * (120.41); branch circuits stay at 3 VA per sq ft (120.13). This tool
 * builds to NEC 2023 and says so on the page.
 */

export interface LoadLineItem {
  label: string;
  basis: string;
  /** Null on a subtotal row, which is not an additive line. */
  connectedVa: number | null;
  /** Null when the line feeds a subtotal below it (dwelling general load). */
  demandVa: number | null;
}

export interface LoadResult {
  lines: LoadLineItem[];
  connectedVa: number;
  demandVa: number;
  demandKva: number;
  amps: number;
  serviceDescription: string;
  recommendedServiceAmps: number | null;
  serviceNote: string | null;
}

/** Standard service ratings per 240.6(A), up to the scope of this tool. */
export const STANDARD_SERVICE_AMPS = [
  100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450, 500, 600,
] as const;

export const MAX_SERVICE_AMPS = 600;

/** Next standard rating at or above `amps`, or null when over the tool scope. */
export function nextStandardService(amps: number): number | null {
  for (const size of STANDARD_SERVICE_AMPS) {
    if (size >= amps) return size;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Dwelling                                                            */
/* ------------------------------------------------------------------ */

export interface DwellingInputs {
  areaSqFt: number;
  smallApplianceCircuits: number;
  laundryCircuits: number;
  /** Electric range of 12 kW or less present (8,000 VA per Table 220.55). */
  hasRange: boolean;
  /** Electric dryer nameplate VA, or null when there is no electric dryer. */
  dryerVa: number | null;
  /** Nameplate VA of each fixed appliance (water heater, dishwasher, ...). */
  fixedAppliancesVa: number[];
  heatingVa: number;
  coolingVa: number;
}

const DWELLING_LIGHTING_VA_PER_SQFT = 3;
const SMALL_APPLIANCE_VA = 1500;
const LAUNDRY_VA = 1500;
const RANGE_VA = 8000;
const DRYER_MIN_VA = 5000;

/** Table 220.42 demand on a dwelling general-load subtotal. */
export function dwellingGeneralDemand(subtotalVa: number): number {
  const firstTier = Math.min(subtotalVa, 3000);
  const secondTier = Math.min(Math.max(subtotalVa - 3000, 0), 117000);
  const thirdTier = Math.max(subtotalVa - 120000, 0);
  return firstTier + secondTier * 0.35 + thirdTier * 0.25;
}

export function calculateDwellingLoad(input: DwellingInputs): LoadResult {
  const lines: LoadLineItem[] = [];

  const lightingVa = input.areaSqFt * DWELLING_LIGHTING_VA_PER_SQFT;
  const smallApplianceVa =
    Math.max(input.smallApplianceCircuits, 2) * SMALL_APPLIANCE_VA;
  const laundryVa = Math.max(input.laundryCircuits, 1) * LAUNDRY_VA;
  const generalSubtotal = lightingVa + smallApplianceVa + laundryVa;
  const generalDemand = dwellingGeneralDemand(generalSubtotal);
  lines.push({
    label: "General lighting and receptacles",
    basis: `${input.areaSqFt.toLocaleString()} sq ft at 3 VA per sq ft (220.41)`,
    connectedVa: lightingVa,
    demandVa: null,
  });
  lines.push({
    label: "Small-appliance circuits",
    basis: `${Math.max(input.smallApplianceCircuits, 2)} circuits at 1,500 VA (220.52(A))`,
    connectedVa: smallApplianceVa,
    demandVa: null,
  });
  lines.push({
    label: "Laundry circuit",
    basis: `${Math.max(input.laundryCircuits, 1)} circuit at 1,500 VA (220.52(B))`,
    connectedVa: laundryVa,
    demandVa: null,
  });
  lines.push({
    label: "General load after Table 220.42 demand",
    basis: "First 3,000 VA at 100%, 3,001 to 120,000 VA at 35%, over 120,000 VA at 25%",
    connectedVa: null,
    demandVa: generalDemand,
  });

  let demandVa = generalDemand;
  let connectedVa = generalSubtotal;

  if (input.hasRange) {
    lines.push({
      label: "Electric range",
      basis: "12 kW or less, Table 220.55 Column C",
      connectedVa: RANGE_VA,
      demandVa: RANGE_VA,
    });
    demandVa += RANGE_VA;
    connectedVa += RANGE_VA;
  }

  if (input.dryerVa !== null && input.dryerVa > 0) {
    const dryerDemand = Math.max(input.dryerVa, DRYER_MIN_VA);
    lines.push({
      label: "Electric dryer",
      basis: "Larger of nameplate or 5,000 VA (220.54)",
      connectedVa: input.dryerVa,
      demandVa: dryerDemand,
    });
    demandVa += dryerDemand;
    connectedVa += input.dryerVa;
  }

  const fixedAppliances = input.fixedAppliancesVa.filter((va) => va > 0);
  const fixedTotal = fixedAppliances.reduce((sum, va) => sum + va, 0);
  if (fixedTotal > 0) {
    const qualifiesForDiscount = fixedAppliances.length >= 4;
    const fixedDemand = qualifiesForDiscount ? fixedTotal * 0.75 : fixedTotal;
    lines.push({
      label: `Fixed appliances (${fixedAppliances.length})`,
      basis: qualifiesForDiscount
        ? "4 or more fastened in place, 75% demand (220.53)"
        : "Fewer than 4, no demand factor (220.53)",
      connectedVa: fixedTotal,
      demandVa: fixedDemand,
    });
    demandVa += fixedDemand;
    connectedVa += fixedTotal;
  }

  const hvacVa = Math.max(input.heatingVa, input.coolingVa);
  if (hvacVa > 0) {
    lines.push({
      label: "HVAC (larger of heating or cooling)",
      basis: "Heating and cooling never run together (220.60)",
      connectedVa: hvacVa,
      demandVa: hvacVa,
    });
    demandVa += hvacVa;
    connectedVa += hvacVa;
  }

  // Single-phase dwelling service, 120/240 V. Minimum 100 A (230.79(C)).
  const amps = demandVa / 240;
  const recommended = nextStandardService(Math.max(amps, 100));
  return finishResult(lines, connectedVa, demandVa, amps, "120/240 V, single-phase", recommended);
}

/* ------------------------------------------------------------------ */
/* Small commercial                                                    */
/* ------------------------------------------------------------------ */

export type CommercialOccupancy =
  | "office"
  | "retail"
  | "restaurant"
  | "warehouse"
  | "school";

/** Table 220.42(A) general lighting unit loads, VA per sq ft (NEC 2023). */
export const COMMERCIAL_UNIT_LOADS: Record<CommercialOccupancy, number> = {
  office: 1.3,
  retail: 1.9,
  restaurant: 1.5,
  warehouse: 1.2,
  school: 1.5,
};

export const COMMERCIAL_OCCUPANCY_LABELS: Record<CommercialOccupancy, string> = {
  office: "Office",
  retail: "Retail store",
  restaurant: "Restaurant",
  warehouse: "Warehouse",
  school: "School",
};

export type CommercialVoltage = "208-3ph" | "240-1ph";

export interface CommercialInputs {
  occupancy: CommercialOccupancy;
  areaSqFt: number;
  receptacleCount: number;
  /** Total nameplate VA of fixed equipment (water heater, IT, and similar). */
  fixedEquipmentVa: number;
  /** Commercial kitchen equipment: total VA and piece count (Table 220.56). */
  kitchenEquipmentVa: number;
  kitchenEquipmentCount: number;
  heatingVa: number;
  coolingVa: number;
  /** Largest motor nameplate VA (takes the 25% adder per 430.24). */
  largestMotorVa: number;
  /** All other motors, total nameplate VA. */
  otherMotorsVa: number;
  hasSign: boolean;
  showWindowLinearFt: number;
  voltage: CommercialVoltage;
}

const RECEPTACLE_VA = 180;
const SIGN_VA = 1200;
const SHOW_WINDOW_VA_PER_FT = 200;
const CONTINUOUS_FACTOR = 1.25;

/** Table 220.56 demand factor by commercial kitchen equipment count. */
export function kitchenDemandFactor(count: number): number {
  if (count <= 2) return 1;
  if (count === 3) return 0.9;
  if (count === 4) return 0.8;
  if (count === 5) return 0.75;
  return 0.65;
}

/** Table 220.44 / 220.47 receptacle demand: first 10,000 VA at 100%, rest at 50%. */
export function receptacleDemand(totalVa: number): number {
  return Math.min(totalVa, 10000) + Math.max(totalVa - 10000, 0) * 0.5;
}

export function calculateCommercialLoad(input: CommercialInputs): LoadResult {
  const lines: LoadLineItem[] = [];
  let connectedVa = 0;
  let demandVa = 0;

  const unitLoad = COMMERCIAL_UNIT_LOADS[input.occupancy];
  const lightingVa = input.areaSqFt * unitLoad;
  const lightingDemand =
    input.occupancy === "warehouse"
      ? Math.min(lightingVa, 12500) + Math.max(lightingVa - 12500, 0) * 0.5
      : lightingVa;
  lines.push({
    label: `General lighting (${COMMERCIAL_OCCUPANCY_LABELS[input.occupancy]})`,
    basis:
      input.occupancy === "warehouse"
        ? `${input.areaSqFt.toLocaleString()} sq ft at ${unitLoad} VA per sq ft (Table 220.42(A)); first 12,500 VA at 100%, remainder at 50% (Table 220.45)`
        : `${input.areaSqFt.toLocaleString()} sq ft at ${unitLoad} VA per sq ft (Table 220.42(A)); 100% demand (Table 220.45)`,
    connectedVa: lightingVa,
    demandVa: lightingDemand,
  });
  connectedVa += lightingVa;
  demandVa += lightingDemand;

  const receptacleByCount = input.receptacleCount * RECEPTACLE_VA;
  const receptacleBase =
    input.occupancy === "office"
      ? Math.max(receptacleByCount, input.areaSqFt * 1)
      : receptacleByCount;
  const receptacleDemandVa = receptacleDemand(receptacleBase);
  lines.push({
    label: "Receptacles",
    basis:
      input.occupancy === "office"
        ? `Larger of ${input.receptacleCount} outlets at 180 VA (220.14(I)) or 1 VA per sq ft (220.14(K)); first 10,000 VA at 100%, remainder at 50% (220.47)`
        : `${input.receptacleCount} outlets at 180 VA (220.14(I)); first 10,000 VA at 100%, remainder at 50% (220.47)`,
    connectedVa: receptacleBase,
    demandVa: receptacleDemandVa,
  });
  connectedVa += receptacleBase;
  demandVa += receptacleDemandVa;

  if (input.fixedEquipmentVa > 0) {
    lines.push({
      label: "Fixed equipment",
      basis: "Nameplate VA, 100%",
      connectedVa: input.fixedEquipmentVa,
      demandVa: input.fixedEquipmentVa,
    });
    connectedVa += input.fixedEquipmentVa;
    demandVa += input.fixedEquipmentVa;
  }

  if (input.kitchenEquipmentVa > 0 && input.kitchenEquipmentCount > 0) {
    const factor = kitchenDemandFactor(input.kitchenEquipmentCount);
    lines.push({
      label: `Commercial kitchen equipment (${input.kitchenEquipmentCount} pieces)`,
      basis: `Table 220.56 demand, ${Math.round(factor * 100)}% for ${input.kitchenEquipmentCount} pieces`,
      connectedVa: input.kitchenEquipmentVa,
      demandVa: input.kitchenEquipmentVa * factor,
    });
    connectedVa += input.kitchenEquipmentVa;
    demandVa += input.kitchenEquipmentVa * factor;
  }

  const hvacVa = Math.max(input.heatingVa, input.coolingVa);
  if (hvacVa > 0) {
    lines.push({
      label: "HVAC (larger of heating or cooling)",
      basis: "Heating and cooling never run together (220.60)",
      connectedVa: hvacVa,
      demandVa: hvacVa,
    });
    connectedVa += hvacVa;
    demandVa += hvacVa;
  }

  if (input.largestMotorVa > 0) {
    const motorAdder = input.largestMotorVa * 0.25;
    lines.push({
      label: "Largest motor adder",
      basis: "25% of the largest motor (430.24)",
      connectedVa: motorAdder,
      demandVa: motorAdder,
    });
    connectedVa += motorAdder;
    demandVa += motorAdder;
  }
  if (input.otherMotorsVa > 0) {
    lines.push({
      label: "Other motors",
      basis: "Nameplate VA, 100%",
      connectedVa: input.otherMotorsVa,
      demandVa: input.otherMotorsVa,
    });
    connectedVa += input.otherMotorsVa;
    demandVa += input.otherMotorsVa;
  }

  if (input.hasSign) {
    lines.push({
      label: "Sign outlet",
      basis: "1,200 VA, continuous load at 125% (220.14(F))",
      connectedVa: SIGN_VA,
      demandVa: SIGN_VA * CONTINUOUS_FACTOR,
    });
    connectedVa += SIGN_VA;
    demandVa += SIGN_VA * CONTINUOUS_FACTOR;
  }

  if (input.showWindowLinearFt > 0) {
    const showWindowVa = input.showWindowLinearFt * SHOW_WINDOW_VA_PER_FT;
    lines.push({
      label: "Show window lighting",
      basis: `${input.showWindowLinearFt} linear ft at 200 VA per ft, continuous load at 125% (220.14(G))`,
      connectedVa: showWindowVa,
      demandVa: showWindowVa * CONTINUOUS_FACTOR,
    });
    connectedVa += showWindowVa;
    demandVa += showWindowVa * CONTINUOUS_FACTOR;
  }

  const isThreePhase = input.voltage === "208-3ph";
  const amps = isThreePhase ? demandVa / (208 * Math.sqrt(3)) : demandVa / 240;
  const recommended = nextStandardService(Math.max(amps, 100));
  return finishResult(
    lines,
    connectedVa,
    demandVa,
    amps,
    isThreePhase ? "120/208 V, three-phase" : "120/240 V, single-phase",
    recommended,
  );
}

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

function finishResult(
  lines: LoadLineItem[],
  connectedVa: number,
  demandVa: number,
  amps: number,
  serviceDescription: string,
  recommendedServiceAmps: number | null,
): LoadResult {
  return {
    lines,
    connectedVa: Math.round(connectedVa),
    demandVa: Math.round(demandVa),
    demandKva: Math.round((demandVa / 1000) * 10) / 10,
    amps: Math.round(amps * 10) / 10,
    serviceDescription,
    recommendedServiceAmps,
    serviceNote:
      recommendedServiceAmps === null
        ? `Over ${MAX_SERVICE_AMPS} A, which is past the scope of this tool. A service this size needs a custom design from the engineer of record.`
        : null,
  };
}
