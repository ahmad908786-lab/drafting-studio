"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BUDGET_RANGES } from "@/lib/taxonomy";
import { createQuote } from "@/app/actions/quotes";

export function NewQuoteForm({ services }: { services: { slug: string; name: string }[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [picked, setPicked] = useState<ReadonlySet<string>>(new Set());
  const [budget, setBudget] = useState<string>("");

  const toggleService = (slug: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      serviceSlugs: [...picked],
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim() || undefined,
      companyName: String(fd.get("companyName") ?? "").trim() || undefined,
      budgetRange: budget || undefined,
      description: String(fd.get("description") ?? "").trim() || undefined,
    };
    start(async () => {
      const res = await createQuote(payload);
      if (res.ok) {
        toast.success(`Quote ${res.refNumber} created`);
        router.push("/admin/rfqs?status=NEW");
      } else {
        toast.error(res.message || "Could not create the quote.");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nq-name">Full name *</Label>
          <Input id="nq-name" name="name" required maxLength={120} placeholder="Jane Cooper" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nq-email">Email *</Label>
          <Input id="nq-email" name="email" type="email" required maxLength={160} placeholder="jane@company.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nq-phone">Phone</Label>
          <Input id="nq-phone" name="phone" maxLength={40} placeholder="+1 (555) 000-0000" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nq-company">Company</Label>
          <Input id="nq-company" name="companyName" maxLength={160} placeholder="Company LLC" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Services *</Label>
        <div className="grid gap-2 rounded-lg border p-4 sm:grid-cols-2">
          {services.map((s) => (
            <label key={s.slug} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox checked={picked.has(s.slug)} onCheckedChange={() => toggleService(s.slug)} />
              <span>{s.name}</span>
            </label>
          ))}
        </div>
        {picked.size === 0 && <p className="text-xs text-muted-foreground">Select at least one service.</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Budget range</Label>
          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
            <SelectContent>
              {BUDGET_RANGES.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="nq-desc">Project details</Label>
        <Textarea id="nq-desc" name="description" rows={5} maxLength={6000} placeholder="Scope, timeline, links to plans…" />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={pending || picked.size === 0} className="bg-emerald-500 font-semibold text-white hover:bg-emerald-600">
          {pending ? "Creating…" : "Create quote"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
