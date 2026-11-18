/**
 * Verification for the NEC 220 electrical load calculator engine.
 *
 * Run: npx tsx scripts/verify-electrical-load-calculator.ts
 * Exits non-zero on any mismatch.
 *
 * Cases:
 * 1-2. The two worked dwelling examples from the tool spec (2,000 sq ft and
 *    1,200 sq ft dwellings).
 * 3. The 3,000 sq ft office example from the NEC 220 walkthrough post.
 * 4. A small dwelling with no range, dryer, fixed appliances or HVAC, which
 *    must still recommend the 100 A minimum service.
 */
import {
  calculateCommercialLoad,
  calculateDwellingLoad,
  type LoadResult,
} from "../lib/calculators/electrical-load";

let failures = 0;

function check(name: string, actual: number | null, expected: number | null, tolerance = 0.05) {
  const ok =
    actual === expected ||
    (typeof actual === "number" &&
      typeof expected === "number" &&
      Math.abs(actual - expected) <= tolerance);
  if (ok) {
    console.log(`PASS ${name}: ${actual}`);
  } else {
    failures += 1;
    console.error(`FAIL ${name}: expected ${expected}, got ${actual}`);
  }
}

function checkColumnSums(name: string, result: LoadResult) {
  const connectedSum = result.lines.reduce((sum, line) => sum + (line.connectedVa ?? 0), 0);
  const demandSum = result.lines.reduce((sum, line) => sum + (line.demandVa ?? 0), 0);
  check(`${name} connected column sums to total`, connectedSum, result.connectedVa, 0.5);
  check(`${name} demand column sums to total`, demandSum, result.demandVa, 0.5);
}

// Case 1: 2,000 sq ft dwelling. Lighting 6,000 + small-appliance 3,000 +
// laundry 1,500 = 10,500 subtotal; demand 3,000 + 7,500 x 35% = 5,625;
// + range 8,000 + dryer 5,000 + fixed (8,000 x 75%) 6,000 + HVAC 8,000
// = 32,625 VA; 32,625 / 240 = 135.9 A, so a 150 A service.
const case1 = calculateDwellingLoad({
  areaSqFt: 2000,
  smallApplianceCircuits: 2,
  laundryCircuits: 1,
  hasRange: true,
  dryerVa: 5000,
  fixedAppliancesVa: [4500, 1200, 800, 1500],
  heatingVa: 8000,
  coolingVa: 5000,
});
check("Case 1 demand VA", case1.demandVa, 32625, 0.5);
check("Case 1 amps", case1.amps, 135.9);
check("Case 1 service", case1.recommendedServiceAmps, 150);
checkColumnSums("Case 1", case1);

// Case 2: 1,200 sq ft dwelling. Lighting 3,600 + 3,000 + 1,500 = 8,100;
// demand 3,000 + 5,100 x 35% = 4,785; + range 8,000 + dryer 5,000 +
// fixed 5,700 (only 2, no discount) + HVAC 5,000 = 28,485 VA;
// 28,485 / 240 = 118.7 A, so a 125 A service.
const case2 = calculateDwellingLoad({
  areaSqFt: 1200,
  smallApplianceCircuits: 2,
  laundryCircuits: 1,
  hasRange: true,
  dryerVa: 5000,
  fixedAppliancesVa: [4500, 1200],
  heatingVa: 5000,
  coolingVa: 3600,
});
check("Case 2 demand VA", case2.demandVa, 28485, 0.5);
check("Case 2 amps", case2.amps, 118.7);
check("Case 2 service", case2.recommendedServiceAmps, 125);
checkColumnSums("Case 2", case2);

// Case 3: 3,000 sq ft office, from the NEC 220 walkthrough post. Lighting
// 3,900 + receptacles 9,000 + rooftop unit 10,100 + largest motor adder 875
// + signage 1,500 = 25,375 VA; 25,375 / (208 x 1.732) = 70.4 A, 100 A service.
const case3 = calculateCommercialLoad({
  occupancy: "office",
  areaSqFt: 3000,
  receptacleCount: 50,
  fixedEquipmentVa: 0,
  kitchenEquipmentVa: 0,
  kitchenEquipmentCount: 0,
  heatingVa: 0,
  coolingVa: 10100,
  largestMotorVa: 3500,
  otherMotorsVa: 0,
  hasSign: true,
  showWindowLinearFt: 0,
  voltage: "208-3ph",
});
check("Case 3 demand VA", case3.demandVa, 25375, 0.5);
check("Case 3 amps", case3.amps, 70.4);
check("Case 3 service", case3.recommendedServiceAmps, 100);
checkColumnSums("Case 3", case3);

// Case 4: small dwelling, minimal loads. Lighting 2,400 + 3,000 + 1,500 =
// 6,900; demand 3,000 + 3,900 x 35% = 4,365 VA; 18.2 A, but the minimum
// dwelling service is 100 A.
const case4 = calculateDwellingLoad({
  areaSqFt: 800,
  smallApplianceCircuits: 2,
  laundryCircuits: 1,
  hasRange: false,
  dryerVa: null,
  fixedAppliancesVa: [],
  heatingVa: 0,
  coolingVa: 0,
});
check("Case 4 demand VA", case4.demandVa, 4365, 0.5);
check("Case 4 amps", case4.amps, 18.2);
check("Case 4 service (100 A minimum)", case4.recommendedServiceAmps, 100);
checkColumnSums("Case 4", case4);

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll electrical load calculator checks passed.");
