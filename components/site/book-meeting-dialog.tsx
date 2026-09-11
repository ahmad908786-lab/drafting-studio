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

/** Half-hour slots across a US working day, client's local time. */
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="accent" disabled={pending} className="w-full">
      {pending ? "Requesting…" : "Request this slot"}
    </Button>
  );
}

export function BookMeetingDialog() {
  const [open, setOpen] = useState(false);
  const [slot, setSlot] = useState("");
  const [topic, setTopic] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // Handle the outcome here rather than in an effect, so closing and clearing
  // the form isn't a cascading setState during render.
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
        className="hidden sm:inline-flex"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <CalendarCheck className="size-4" /> Book A Meeting
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Book a meeting</DialogTitle>
            <DialogDescription>
              Pick a day and time that suits you. We&apos;ll confirm by email within one
              business day — no charge, no obligation.
            </DialogDescription>
          </DialogHeader>

          <form ref={formRef} action={action} className="space-y-4">
            {/* Honeypot — must stay empty. */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="bm-name">Name</Label>
                <Input id="bm-name" name="name" placeholder="Your name" />
                {state?.errors?.name && <p className="text-xs text-destructive">{state.errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bm-email">Email *</Label>
                <Input id="bm-email" name="email" type="email" placeholder="you@company.com" required />
                {state?.errors?.email && <p className="text-xs text-destructive">{state.errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bm-phone">Phone</Label>
                <Input id="bm-phone" name="phone" type="tel" placeholder="(555) 555-5555" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bm-company">Company</Label>
                <Input id="bm-company" name="company" placeholder="Company name" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="bm-date">Preferred date</Label>
                <Input id="bm-date" name="preferredDate" type="date" min={tomorrow} required />
              </div>
              <div className="space-y-1.5">
                <Label>Preferred time</Label>
                <Select value={slot} onValueChange={setSlot}>
                  <SelectTrigger><SelectValue placeholder="Pick a slot" /></SelectTrigger>
                  <SelectContent className="max-h-56">
                    {SLOTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <input type="hidden" name="preferredTime" value={slot} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>What would you like to cover?</Label>
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger><SelectValue placeholder="Select a topic" /></SelectTrigger>
                <SelectContent>
                  {TOPICS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <input type="hidden" name="topic" value={topic} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bm-message">Anything we should know?</Label>
              <Textarea id="bm-message" name="message" rows={3} placeholder="Scope, deadline, or the file you'd like us to look at…" />
            </div>

            <p className="text-xs text-muted-foreground">
              Times shown are your local time. We&apos;ll send a calendar invite once confirmed.
            </p>

            <SubmitButton />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
