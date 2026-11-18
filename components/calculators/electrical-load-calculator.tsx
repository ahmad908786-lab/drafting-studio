"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  COMMERCIAL_OCCUPANCY_LABELS,
  calculateCommercialLoad,
  calculateDwellingLoad,
  type CommercialOccupancy,
  type CommercialVoltage,
  type LoadResult,
} from "@/lib/calculators/electrical-load";

type Mode = "dwelling" | "commercial";

const DWELLING_DEFAULTS = {
  area: "2000",
  smallAppliance: "2",
  laundry: "1",
  dryerVa: "5000",
  waterHeater: "4500",
  dishwasher: "1200",
  disposal: "800",
  microwave: "1500",
  otherAppliance1: "",
  otherAppliance2: "",
  heating: "8000",
  cooling: "5000",
};

const COMMERCIAL_DEFAULTS = {
  area: "3000",
  receptacles: "50",
  fixedEquipment: "",
  kitchenVa: "",
  kitchenCount: "",
  heating: "",
  cooling: "10100",
  largestMotor: "3500",
  otherMotors: "",
  showWindow: "",
};

function toNumber(value: string): number {
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return parsed;
}

function formatVa(value: number | null): string {
  if (value === null) return "-";
  return value.toLocaleString("en-US");
}

function NumberField({
  id,
  label,
  value,
  onChange,
  hint,
  min,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  min?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        min={min ?? "0"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ResultsPanel({ result }: { result: LoadResult }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Result</CardTitle>
        <CardDescription>
          NEC Article 220 standard method, {result.serviceDescription}. Every
          line below can be checked against the Code section shown.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Demand load
            </p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">
              {result.demandKva.toLocaleString("en-US")} kVA
            </p>
            <p className="text-sm text-muted-foreground">
              {result.demandVa.toLocaleString("en-US")} VA
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Service current
            </p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">
              {result.amps.toLocaleString("en-US")} A
            </p>
            <p className="text-sm text-muted-foreground">
              Demand VA divided by service volts
            </p>
          </div>
          <div className="rounded-xl border border-primary bg-primary p-4 text-primary-foreground">
            <p className="text-xs font-bold uppercase tracking-wide text-primary-foreground/80">
              Recommended service
            </p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">
              {result.recommendedServiceAmps
                ? `${result.recommendedServiceAmps} A`
                : "Over 600 A"}
            </p>
            <p className="text-sm text-primary-foreground/80">
              Next standard rating per 240.6(A)
            </p>
          </div>
        </div>

        {result.serviceNote && (
          <p className="rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
            {result.serviceNote}
          </p>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Load</TableHead>
                <TableHead className="hidden md:table-cell">Basis</TableHead>
                <TableHead className="text-right">Connected VA</TableHead>
                <TableHead className="text-right">Demand VA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.lines.map((line) => (
                <TableRow key={line.label}>
                  <TableCell className="font-medium">{line.label}</TableCell>
                  <TableCell className="hidden max-w-64 text-muted-foreground md:table-cell">
                    {line.basis}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatVa(line.connectedVa)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatVa(line.demandVa)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableCell>Total</TableCell>
                <TableCell className="hidden md:table-cell" />
                <TableCell className="text-right tabular-nums">
                  {result.connectedVa.toLocaleString("en-US")}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {result.demandVa.toLocaleString("en-US")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Put the demand total on the panel schedule and the one-line diagram.
          When the schedule total and the calculation disagree, the reviewer
          stops trusting both documents and asks for a full reconciliation.
        </p>
      </CardContent>
    </Card>
  );
}

export function ElectricalLoadCalculator() {
  const [mode, setMode] = useState<Mode>("dwelling");
  const [dwelling, setDwelling] = useState(DWELLING_DEFAULTS);
  const [hasRange, setHasRange] = useState(true);
  const [hasDryer, setHasDryer] = useState(true);
  const [commercial, setCommercial] = useState(COMMERCIAL_DEFAULTS);
  const [occupancy, setOccupancy] = useState<CommercialOccupancy>("office");
  const [voltage, setVoltage] = useState<CommercialVoltage>("208-3ph");
  const [hasSign, setHasSign] = useState(true);

  const setDwellingField = (field: keyof typeof DWELLING_DEFAULTS) => (value: string) =>
    setDwelling((current) => ({ ...current, [field]: value }));
  const setCommercialField = (field: keyof typeof COMMERCIAL_DEFAULTS) => (value: string) =>
    setCommercial((current) => ({ ...current, [field]: value }));

  const dwellingResult = useMemo(
    () =>
      calculateDwellingLoad({
        areaSqFt: toNumber(dwelling.area),
        smallApplianceCircuits: Math.round(toNumber(dwelling.smallAppliance)),
        laundryCircuits: Math.round(toNumber(dwelling.laundry)),
        hasRange,
        dryerVa: hasDryer ? toNumber(dwelling.dryerVa) : null,
        fixedAppliancesVa: [
          toNumber(dwelling.waterHeater),
          toNumber(dwelling.dishwasher),
          toNumber(dwelling.disposal),
          toNumber(dwelling.microwave),
          toNumber(dwelling.otherAppliance1),
          toNumber(dwelling.otherAppliance2),
        ],
        heatingVa: toNumber(dwelling.heating),
        coolingVa: toNumber(dwelling.cooling),
      }),
    [dwelling, hasRange, hasDryer],
  );

  const commercialResult = useMemo(
    () =>
      calculateCommercialLoad({
        occupancy,
        areaSqFt: toNumber(commercial.area),
        receptacleCount: Math.round(toNumber(commercial.receptacles)),
        fixedEquipmentVa: toNumber(commercial.fixedEquipment),
        kitchenEquipmentVa: toNumber(commercial.kitchenVa),
        kitchenEquipmentCount: Math.round(toNumber(commercial.kitchenCount)),
        heatingVa: toNumber(commercial.heating),
        coolingVa: toNumber(commercial.cooling),
        largestMotorVa: toNumber(commercial.largestMotor),
        otherMotorsVa: toNumber(commercial.otherMotors),
        hasSign,
        showWindowLinearFt: toNumber(commercial.showWindow),
        voltage,
      }),
    [commercial, occupancy, voltage, hasSign],
  );

  const resetCurrentMode = () => {
    if (mode === "dwelling") {
      setDwelling(DWELLING_DEFAULTS);
      setHasRange(true);
      setHasDryer(true);
    } else {
      setCommercial(COMMERCIAL_DEFAULTS);
      setOccupancy("office");
      setVoltage("208-3ph");
      setHasSign(true);
    }
  };

  return (
    <Tabs
      value={mode}
      onValueChange={(value) => setMode(value as Mode)}
      className="w-full"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList>
          <TabsTrigger value="dwelling">Dwelling</TabsTrigger>
          <TabsTrigger value="commercial">Small commercial</TabsTrigger>
        </TabsList>
        <Button variant="outline" size="sm" onClick={resetCurrentMode}>
          Reset to the worked example
        </Button>
      </div>

      <TabsContent value="dwelling" className="mt-6">
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Dwelling inputs</CardTitle>
              <CardDescription>
                NEC 2023 standard method, 120/240 V single-phase. Prefilled
                with the worked example below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <NumberField
                id="dwelling-area"
                label="Floor area (sq ft)"
                value={dwelling.area}
                onChange={setDwellingField("area")}
                hint="Outside dimensions, living area only. 3 VA per sq ft (220.41)."
              />
              <div className="grid grid-cols-2 gap-4">
                <NumberField
                  id="dwelling-small-appliance"
                  label="Small-appliance circuits"
                  value={dwelling.smallAppliance}
                  onChange={setDwellingField("smallAppliance")}
                  hint="1,500 VA each, min 2."
                />
                <NumberField
                  id="dwelling-laundry"
                  label="Laundry circuits"
                  value={dwelling.laundry}
                  onChange={setDwellingField("laundry")}
                  hint="1,500 VA each, min 1."
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="dwelling-range"
                  checked={hasRange}
                  onCheckedChange={(value) => setHasRange(value === true)}
                />
                <Label htmlFor="dwelling-range">
                  Electric range, 12 kW or less (8,000 VA, Table 220.55)
                </Label>
              </div>
              <div className="space-y-4 rounded-xl border border-border p-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="dwelling-dryer"
                    checked={hasDryer}
                    onCheckedChange={(value) => setHasDryer(value === true)}
                  />
                  <Label htmlFor="dwelling-dryer">Electric dryer</Label>
                </div>
                {hasDryer && (
                  <NumberField
                    id="dwelling-dryer-va"
                    label="Dryer nameplate (VA)"
                    value={dwelling.dryerVa}
                    onChange={setDwellingField("dryerVa")}
                    hint="Larger of nameplate or 5,000 VA (220.54)."
                  />
                )}
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold">Fixed appliances (VA each)</p>
                <div className="grid grid-cols-2 gap-4">
                  <NumberField
                    id="dwelling-water-heater"
                    label="Water heater"
                    value={dwelling.waterHeater}
                    onChange={setDwellingField("waterHeater")}
                  />
                  <NumberField
                    id="dwelling-dishwasher"
                    label="Dishwasher"
                    value={dwelling.dishwasher}
                    onChange={setDwellingField("dishwasher")}
                  />
                  <NumberField
                    id="dwelling-disposal"
                    label="Garbage disposal"
                    value={dwelling.disposal}
                    onChange={setDwellingField("disposal")}
                  />
                  <NumberField
                    id="dwelling-microwave"
                    label="Microwave"
                    value={dwelling.microwave}
                    onChange={setDwellingField("microwave")}
                  />
                  <NumberField
                    id="dwelling-other-1"
                    label="Other appliance 1"
                    value={dwelling.otherAppliance1}
                    onChange={setDwellingField("otherAppliance1")}
                  />
                  <NumberField
                    id="dwelling-other-2"
                    label="Other appliance 2"
                    value={dwelling.otherAppliance2}
                    onChange={setDwellingField("otherAppliance2")}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Four or more fixed appliances take a 75% demand factor
                  (220.53). Range, dryer and HVAC are not counted here.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <NumberField
                  id="dwelling-heating"
                  label="Heating load (VA)"
                  value={dwelling.heating}
                  onChange={setDwellingField("heating")}
                />
                <NumberField
                  id="dwelling-cooling"
                  label="Cooling load (VA)"
                  value={dwelling.cooling}
                  onChange={setDwellingField("cooling")}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Only the larger of heating or cooling counts (220.60).
              </p>
            </CardContent>
          </Card>
          <div className="lg:col-span-3">
            <ResultsPanel result={dwellingResult} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="commercial" className="mt-6">
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Small commercial inputs</CardTitle>
              <CardDescription>
                NEC 2023 standard method for one occupancy, up to a 600 A
                service. Prefilled with the office example from our NEC 220
                guide.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="commercial-occupancy">Occupancy</Label>
                <Select
                  value={occupancy}
                  onValueChange={(value) => setOccupancy(value as CommercialOccupancy)}
                >
                  <SelectTrigger id="commercial-occupancy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      Object.keys(COMMERCIAL_OCCUPANCY_LABELS) as CommercialOccupancy[]
                    ).map((key) => (
                      <SelectItem key={key} value={key}>
                        {COMMERCIAL_OCCUPANCY_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  General lighting unit load per Table 220.42(A).
                </p>
              </div>
              <NumberField
                id="commercial-area"
                label="Floor area (sq ft)"
                value={commercial.area}
                onChange={setCommercialField("area")}
                hint="Outside dimensions."
              />
              <NumberField
                id="commercial-receptacles"
                label="General-use receptacle outlets"
                value={commercial.receptacles}
                onChange={setCommercialField("receptacles")}
                hint="180 VA each (220.14(I)). Offices take the larger of this or 1 VA per sq ft."
              />
              <NumberField
                id="commercial-fixed"
                label="Fixed equipment (VA total)"
                value={commercial.fixedEquipment}
                onChange={setCommercialField("fixedEquipment")}
                hint="Water heater, IT loads and similar, nameplate VA."
              />
              {occupancy === "restaurant" && (
                <div className="grid grid-cols-2 gap-4">
                  <NumberField
                    id="commercial-kitchen-va"
                    label="Kitchen equipment (VA total)"
                    value={commercial.kitchenVa}
                    onChange={setCommercialField("kitchenVa")}
                  />
                  <NumberField
                    id="commercial-kitchen-count"
                    label="Kitchen equipment pieces"
                    value={commercial.kitchenCount}
                    onChange={setCommercialField("kitchenCount")}
                    hint="Table 220.56 demand by count."
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <NumberField
                  id="commercial-heating"
                  label="Heating load (VA)"
                  value={commercial.heating}
                  onChange={setCommercialField("heating")}
                />
                <NumberField
                  id="commercial-cooling"
                  label="Cooling load (VA)"
                  value={commercial.cooling}
                  onChange={setCommercialField("cooling")}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Only the larger of heating or cooling counts (220.60).
              </p>
              <div className="grid grid-cols-2 gap-4">
                <NumberField
                  id="commercial-largest-motor"
                  label="Largest motor (VA)"
                  value={commercial.largestMotor}
                  onChange={setCommercialField("largestMotor")}
                  hint="Takes a 25% adder (430.24)."
                />
                <NumberField
                  id="commercial-other-motors"
                  label="Other motors (VA total)"
                  value={commercial.otherMotors}
                  onChange={setCommercialField("otherMotors")}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="commercial-sign"
                  checked={hasSign}
                  onCheckedChange={(value) => setHasSign(value === true)}
                />
                <Label htmlFor="commercial-sign">
                  Sign outlet (1,200 VA, continuous at 125%)
                </Label>
              </div>
              <NumberField
                id="commercial-show-window"
                label="Show window (linear ft)"
                value={commercial.showWindow}
                onChange={setCommercialField("showWindow")}
                hint="200 VA per linear ft, continuous at 125% (220.14(G))."
              />
              <div className="space-y-1.5">
                <Label htmlFor="commercial-voltage">Service voltage</Label>
                <Select
                  value={voltage}
                  onValueChange={(value) => setVoltage(value as CommercialVoltage)}
                >
                  <SelectTrigger id="commercial-voltage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="208-3ph">120/208 V, three-phase</SelectItem>
                    <SelectItem value="240-1ph">120/240 V, single-phase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <div className="lg:col-span-3">
            <ResultsPanel result={commercialResult} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
