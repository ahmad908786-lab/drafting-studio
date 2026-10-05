"use client";

import * as React from "react";
import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { CalendarCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { requestMeeting, type ActionResult } from "@/app/actions/leads";

/** Half-hour slots across a US working day. */
const SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
];

const TOPICS = [
  "New project scope & timeline",
  "Ongoing drafting partnership",
  "Existing quote or project",
  "Something else",
];

/** Used only where the browser can't enumerate zones itself. */
const FALLBACK_ZONES = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Phoenix",
  "America/Los_Angeles", "America/Anchorage", "Pacific/Honolulu", "America/Toronto",
  "Europe/London", "Europe/Berlin", "Asia/Dubai", "Asia/Karachi", "Asia/Kolkata",
  "Asia/Singapore", "Australia/Sydney", "UTC",
];

type Zone = { value: string; label: string; minutes: number };

/** "GMT-04:00" → -240, so the list can sort west-to-east like booking tools do. */
function offsetMinutes(gmt: string): number {
  const m = /GMT([+-])(\d{2}):(\d{2})/.exec(gmt);
  if (!m) return 0;
  return (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
}

function buildZones(): Zone[] {
  const supported =
    typeof Intl.supportedValuesOf === "function"
      ? (Intl.supportedValuesOf("timeZone") as string[])
      : FALLBACK_ZONES;
  const now = new Date();
  return supported
    .map((tz) => {
      let gmt = "GMT+00:00";
      try {
        gmt =
          new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "longOffset" })
            .formatToParts(now)
            .find((p) => p.type === "timeZoneName")?.value ?? "GMT+00:00";
      } catch {
        /* keep the default */
      }
      return { value: tz, label: `(${gmt}) ${tz.replace(/_/g, " ")}`, minutes: offsetMinutes(gmt) };
    })
    .sort((a, b) => a.minutes - b.minutes || a.value.localeCompare(b.value));
}

function detectZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
  } catch {
    return "America/New_York";
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="accent" disabled={pending} className="w-full">
      {pending ? "Scheduling…" : "Schedule Appointment"}
    </Button>
  );
}

export function BookMeetingDialog() {
  const [open, setOpen] = useState(false);
  const [slot, setSlot] = useState("");
  const [topic, setTopic] = useState("");
  // Resolved on open, not during render: the server can't know the visitor's
  // zone, so doing it at render time would mismatch on hydration.
  const [tz, setTz] = useState("");
  const [zones, setZones] = useState<Zone[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const openDialog = () => {
    if (!tz) setTz(detectZone());
    if (zones.length === 0) setZones(buildZones());
    setOpen(true);
  };

  // Outcome handled here rather than in an effect, to avoid a cascading setState.
  const [state, action] = useActionState<ActionResult | null, FormData>(async (prev, formData) => {
    const result = await requestMeeting(prev, formData);
    if (result.ok) {
      toast.success(result.message);
      formRef.current?.reset();
      setSlot("");
      setTopic("");
      setOpen(false);
    } else {
      toast.error(result.message);
    }
    return result;
  }, null);

  // Earliest selectable day is tomorrow, so nobody books a slot in the past.
  const tomorrow = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, []);

  return (
    <>
      <Button
        variant="accent"
        size="sm"
        onClick={openDialog}
        aria-haspopup="dialog"
        aria-label="Book a meeting"
      >
        <CalendarCheck className="size-4" /> <span className="hidden sm:inline">Book A Meeting</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle>Book a meeting</DialogTitle>
            <DialogDescription>
              Pick a day and time that suits you. We&apos;ll confirm by email within one business day.
            </DialogDescription>
          </DialogHeader>

          <form ref={formRef} action={action} className="space-y-3">
            {/* Honeypot — must stay empty. */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="bm-name">Name *</Label>
                <Input id="bm-name" name="name" placeholder="Your name" required />
                {state?.errors?.name && <p className="text-xs text-destructive">{state.errors.name}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="bm-email">Email *</Label>
                <Input id="bm-email" name="email" type="email" placeholder="you@company.com" required />
                {state?.errors?.email && <p className="text-xs text-destructive">{state.errors.email}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="bm-phone">Phone *</Label>
                <Input id="bm-phone" name="phone" type="tel" placeholder="(555) 555-5555" required />
                {state?.errors?.phone && <p className="text-xs text-destructive">{state.errors.phone}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="bm-company">Company</Label>
                <Input id="bm-company" name="company" placeholder="Company name" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="bm-date">Preferred date</Label>
                <Input id="bm-date" name="preferredDate" type="date" min={tomorrow} required />
              </div>
              <div className="space-y-1">
                <Label>Preferred time</Label>
                <Select value={slot} onValueChange={setSlot}>
                  <SelectTrigger><SelectValue placeholder="Pick a slot" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {SLOTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <input type="hidden" name="preferredTime" value={slot} />
              </div>
              <div className="space-y-1">
                <Label>Time zone</Label>
                <Select value={tz} onValueChange={setTz}>
                  <SelectTrigger><SelectValue placeholder="Select time zone" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {zones.map((z) => <SelectItem key={z.value} value={z.value}>{z.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <input type="hidden" name="timeZone" value={tz} />
              </div>
              <div className="space-y-1">
                <Label>What would you like to cover?</Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger><SelectValue placeholder="Select a topic" /></SelectTrigger>
                  <SelectContent>
                    {TOPICS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <input type="hidden" name="topic" value={topic} />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="bm-message">Anything we should know?</Label>
              <Textarea id="bm-message" name="message" rows={2} placeholder="Scope, deadline, or the file you'd like us to look at…" />
            </div>

            <SubmitButton />

            <p className="text-center text-xs text-muted-foreground">
              Your time zone is detected automatically — change it above if it&apos;s wrong.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
