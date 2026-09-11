"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Upload, X, FileText, Loader2, ArrowRight, ArrowLeft, ClipboardList, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import { createQuote } from "@/app/actions/quotes";
import { BUDGET_RANGES, US_STATES } from "@/lib/taxonomy";
import { MAX_UPLOAD_MB, ALLOWED_EXT } from "@/lib/upload-config";

type ServiceOpt = { slug: string; name: string; category: string };
type IndustryOpt = { slug: string; name: string };
type UploadedFile = { name: string; url: string; size: number; type?: string };

type State = {
  serviceSlugs: string[];
  projectType: string;
  industrySlug: string;
  state: string;
  sizeSqft: string;
  floors: string;
  deadline: string;
  budgetRange: string;
  description: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  fileKeys: UploadedFile[];
};

const EMPTY: State = {
  serviceSlugs: [], projectType: "", industrySlug: "", state: "", sizeSqft: "", floors: "",
  deadline: "", budgetRange: "", description: "", name: "", email: "", phone: "", companyName: "", fileKeys: [],
};

const STEPS = ["Services", "Project details", "Files", "Your info"];
const STORAGE_KEY = "ds-rfq-draft";

export function QuoteWizard({
  services,
  industries,
  initialServices = [],
  initialIndustry = "",
}: {
  services: ServiceOpt[];
  industries: IndustryOpt[];
  initialServices?: string[];
  initialIndustry?: string;
}) {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [state, setState] = React.useState<State>(EMPTY);
  const [uploading, setUploading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [summaryOpen, setSummaryOpen] = React.useState(false);
  // Furthest step reached, so the header can offer forward jumps too.
  const [maxStep, setMaxStep] = React.useState(0);

  // Hydrate from localStorage + URL prefills (once).
  React.useEffect(() => {
    let base = EMPTY;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) base = { ...EMPTY, ...JSON.parse(saved) };
    } catch {}
    const merged = {
      ...base,
      serviceSlugs: Array.from(new Set([...(base.serviceSlugs ?? []), ...initialServices])),
      industrySlug: base.industrySlug || initialIndustry,
    };
    setState(merged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist draft.
  React.useEffect(() => {
    try {
      const { fileKeys, ...rest } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...rest, fileKeys }));
    } catch {}
  }, [state]);

  const set = <K extends keyof State>(key: K, value: State[K]) => setState((s) => ({ ...s, [key]: value }));

  const grouped = React.useMemo(() => {
    const byCat: Record<string, ServiceOpt[]> = {};
    for (const s of services) (byCat[s.category] ??= []).push(s);
    return byCat;
  }, [services]);

  /* Everything the user has chosen, shaped for the summary dialog. */
  const pickedByCategory = React.useMemo(() => {
    const byCat: Record<string, ServiceOpt[]> = {};
    for (const s of services) {
      if (state.serviceSlugs.includes(s.slug)) (byCat[s.category] ??= []).push(s);
    }
    return byCat;
  }, [services, state.serviceSlugs]);

  const projectFacts = React.useMemo(() => {
    const industryName = industries.find((i) => i.slug === state.industrySlug)?.name;
    return [
      { label: "Project type", value: state.projectType },
      { label: "Industry", value: industryName },
      { label: "State", value: state.state },
      { label: "Approx. size", value: state.sizeSqft ? `${Number(state.sizeSqft).toLocaleString()} sq ft` : "" },
      { label: "Floors", value: state.floors },
      { label: "Target deadline", value: state.deadline ? formatDate(state.deadline) : "" },
      { label: "Budget range", value: state.budgetRange },
    ].filter((r) => r.value);
  }, [industries, state.projectType, state.industrySlug, state.state, state.sizeSqft, state.floors, state.deadline, state.budgetRange]);

  const contactFacts = React.useMemo(
    () =>
      [
        { label: "Name", value: state.name },
        { label: "Email", value: state.email },
        { label: "Phone", value: state.phone },
        { label: "Company", value: state.companyName },
      ].filter((r) => r.value.trim()),
    [state.name, state.email, state.phone, state.companyName],
  );

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0 && state.serviceSlugs.length === 0) e.serviceSlugs = "Select at least one service.";
    if (step === 3) {
      if (!state.name.trim()) e.name = "Your name is required.";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.email)) e.email = "Enter a valid email.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    const target = Math.min(STEPS.length - 1, step + 1);
    setStep(target);
    setMaxStep((m) => Math.max(m, target));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  /* Step header navigation. Going back is always allowed; jumping forward is
     limited to steps already reached, and still has to pass validation. */
  const goToStep = (i: number) => {
    if (i === step) return;
    if (i < step) {
      setErrors({});
      setStep(i);
      return;
    }
    if (i > maxStep) return;
    if (!validateStep()) return;
    setStep(i);
  };

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "rfq");
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Upload failed");
        setState((s) => ({ ...s, fileKeys: [...s.fileKeys, json] }));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
      }
    }
    setUploading(false);
  };

  const removeFile = (url: string) => set("fileKeys", state.fileKeys.filter((f) => f.url !== url));

  const submit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    const res = await createQuote({
      ...state,
      sizeSqft: state.sizeSqft ? Number(state.sizeSqft) : undefined,
      floors: state.floors ? Number(state.floors) : undefined,
      budgetRange: state.budgetRange || undefined,
      industrySlug: state.industrySlug || undefined,
      state: state.state || undefined,
      deadline: state.deadline || undefined,
    });
    if (res.ok) {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      router.push(`/request-quote/thank-you?ref=${encodeURIComponent(res.refNumber)}`);
    } else {
      setErrors(res.errors ?? {});
      toast.error(res.message);
      if (res.errors?.name || res.errors?.email) setStep(3);
      else if (res.errors?.serviceSlugs) setStep(0);
      setSubmitting(false);
    }
  };

  const toggleService = (slug: string) =>
    set("serviceSlugs", state.serviceSlugs.includes(slug) ? state.serviceSlugs.filter((s) => s !== slug) : [...state.serviceSlugs, slug]);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          {STEPS.map((label, i) => {
            const reachable = i !== step && i <= maxStep;
            return (
              <button
                key={label}
                type="button"
                onClick={() => goToStep(i)}
                disabled={!reachable}
                aria-current={i === step ? "step" : undefined}
                aria-label={i < step ? `Go back to ${label}` : label}
                className={cn(
                  "flex items-center gap-2 rounded-md px-1 py-0.5 -mx-1 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  reachable ? "cursor-pointer hover:opacity-75" : "cursor-default",
                )}
              >
                <span className={cn(
                  "grid size-8 place-items-center rounded-full text-sm font-bold transition-colors",
                  i < step ? "bg-success text-success-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}>
                  {i < step ? <Check className="size-4" /> : i + 1}
                </span>
                <span className={cn("hidden text-sm font-semibold sm:inline", i === step ? "text-foreground" : "text-muted-foreground")}>{label}</span>
              </button>
            );
          })}
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
        {/* Step 0: services */}
        {step === 0 && (
          <div>
            <h2 className="font-sans text-xl font-bold text-foreground">What do you need drafted?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Select every service that applies. You can add more detail next.</p>
            {errors.serviceSlugs && <p className="mt-2 text-sm text-destructive">{errors.serviceSlugs}</p>}
            <div className="mt-5 space-y-5">
              {Object.entries(grouped).map(([cat, list]) => (
                <div key={cat}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{cat}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {list.map((s) => {
                      const on = state.serviceSlugs.includes(s.slug);
                      return (
                        <button
                          key={s.slug}
                          type="button"
                          onClick={() => toggleService(s.slug)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors",
                            on ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-secondary",
                          )}
                        >
                          <Checkbox checked={on} className="pointer-events-none" tabIndex={-1} />
                          <span className="flex-1 font-medium text-foreground">{s.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-1.5">
              <Label htmlFor="ptype">Project type (optional)</Label>
              <Input id="ptype" value={state.projectType} onChange={(e) => set("projectType", e.target.value)} placeholder="e.g. New restaurant fit-out" />
            </div>
          </div>
        )}

        {/* Step 1: project details */}
        {step === 1 && (
          <div>
            <h2 className="font-sans text-xl font-bold text-foreground">Tell us about the project</h2>
            <p className="mt-1 text-sm text-muted-foreground">The more you share, the tighter our quote.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Industry</Label>
                <Select value={state.industrySlug} onValueChange={(v) => set("industrySlug", v)}>
                  <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>
                    {industries.map((i) => <SelectItem key={i.slug} value={i.slug}>{i.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>State</Label>
                <Select value={state.state} onValueChange={(v) => set("state", v)}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent className="max-h-64">
                    {US_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sqft">Approx. size (sq ft)</Label>
                <Input id="sqft" type="number" value={state.sizeSqft} onChange={(e) => set("sizeSqft", e.target.value)} placeholder="e.g. 5000" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="floors">Floors</Label>
                <Input id="floors" type="number" value={state.floors} onChange={(e) => set("floors", e.target.value)} placeholder="e.g. 1" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deadline">Target deadline</Label>
                <Input id="deadline" type="date" value={state.deadline} onChange={(e) => set("deadline", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Budget range</Label>
                <Select value={state.budgetRange} onValueChange={(v) => set("budgetRange", v)}>
                  <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                  <SelectContent>
                    {BUDGET_RANGES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <Label htmlFor="desc">Scope &amp; details</Label>
              <Textarea id="desc" rows={4} value={state.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the scope, existing conditions, and anything else we should know…" />
            </div>
          </div>
        )}

        {/* Step 2: files */}
        {step === 2 && (
          <div>
            <h2 className="font-sans text-xl font-bold text-foreground">Upload your plans</h2>
            <p className="mt-1 text-sm text-muted-foreground">Architectural DWG/PDF, equipment schedules, or anything relevant. Optional — you can send later.</p>
            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/40 p-8 text-center transition-colors hover:border-primary/40 hover:bg-secondary">
              <Upload className="mb-2 size-8 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Click to upload or drag files here</span>
              <span className="mt-1 text-xs text-muted-foreground">{ALLOWED_EXT.join(", ")} · up to {MAX_UPLOAD_MB}MB each</span>
              <input type="file" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} accept={ALLOWED_EXT.join(",")} />
            </label>
            {uploading && <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Uploading…</p>}
            {state.fileKeys.length > 0 && (
              <ul className="mt-4 space-y-2">
                {state.fileKeys.map((f) => (
                  <li key={f.url} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm">
                    <FileText className="size-4 text-primary" />
                    <span className="flex-1 truncate font-medium text-foreground">{f.name}</span>
                    <span className="text-xs text-muted-foreground">{(f.size / 1024 / 1024).toFixed(1)}MB</span>
                    <button onClick={() => removeFile(f.url)} aria-label="Remove file" className="text-muted-foreground hover:text-destructive"><X className="size-4" /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Step 3: contact */}
        {step === 3 && (
          <div>
            <h2 className="font-sans text-xl font-bold text-foreground">Where should we send the quote?</h2>
            <p className="mt-1 text-sm text-muted-foreground">We'll reply within one business day.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={state.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={state.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={state.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(555) 555-5555" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={state.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="Company name" />
              </div>
            </div>
            <div className="mt-5 rounded-lg border border-border bg-secondary/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <ClipboardList className="size-4 text-primary" /> Summary
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {state.serviceSlugs.length} service{state.serviceSlugs.length === 1 ? "" : "s"}
                    {state.industrySlug && ` · ${industries.find((i) => i.slug === state.industrySlug)?.name}`}
                    {state.sizeSqft && ` · ${Number(state.sizeSqft).toLocaleString()} sq ft`}
                    {state.fileKeys.length > 0 && ` · ${state.fileKeys.length} file${state.fileKeys.length === 1 ? "" : "s"}`}
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setSummaryOpen(true)}>
                  <Eye className="size-4" /> View details
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <Button variant="ghost" onClick={back} disabled={step === 0} className={step === 0 ? "invisible" : ""}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next}>Continue <ArrowRight className="size-4" /></Button>
          ) : (
            <Button variant="accent" onClick={submit} disabled={submitting}>
              {submitting ? <><Loader2 className="size-4 animate-spin" /> Submitting…</> : <>Submit request <Check className="size-4" /></>}
            </Button>
          )}
        </div>
      </div>

      {/* Full request summary */}
      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Your request</DialogTitle>
            <DialogDescription>Everything you&apos;ve selected so far. Close this to keep editing.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <SummaryBlock title={`Services (${state.serviceSlugs.length})`}>
              {state.serviceSlugs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No services selected yet.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(pickedByCategory).map(([cat, list]) => (
                    <div key={cat}>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">{cat}</p>
                      <ul className="space-y-1">
                        {list.map((s) => (
                          <li key={s.slug} className="flex items-start gap-2 text-sm text-foreground">
                            <Check className="mt-0.5 size-3.5 shrink-0 text-success" strokeWidth={3} />
                            {s.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </SummaryBlock>

            {projectFacts.length > 0 && (
              <SummaryBlock title="Project details">
                <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                  {projectFacts.map((f) => (
                    <div key={f.label}>
                      <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                      <dd className="text-sm font-medium text-foreground">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </SummaryBlock>
            )}

            {state.description.trim() && (
              <SummaryBlock title="Scope notes">
                <p className="whitespace-pre-wrap text-sm text-foreground">{state.description}</p>
              </SummaryBlock>
            )}

            <SummaryBlock title={`Files (${state.fileKeys.length})`}>
              {state.fileKeys.length === 0 ? (
                <p className="text-sm text-muted-foreground">No files attached.</p>
              ) : (
                <ul className="space-y-1.5">
                  {state.fileKeys.map((f) => (
                    <li key={f.url} className="flex items-center gap-2 text-sm text-foreground">
                      <FileText className="size-4 shrink-0 text-primary" />
                      <span className="flex-1 truncate">{f.name}</span>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {(f.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </SummaryBlock>

            {contactFacts.length > 0 && (
              <SummaryBlock title="Contact">
                <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                  {contactFacts.map((f) => (
                    <div key={f.label}>
                      <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                      <dd className="break-words text-sm font-medium text-foreground">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </SummaryBlock>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 border-b border-border pb-1.5 text-sm font-bold text-foreground">{title}</h3>
      {children}
    </section>
  );
}
