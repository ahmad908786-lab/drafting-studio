"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { saveSettings } from "@/app/actions/admin-misc";

type Stat = { value: string; label: string };

export function SettingsForm({ initial }: { initial: { brand: string; tagline: string; phones: string[]; emails: string[]; stats: Stat[] } }) {
  const router = useRouter();
  const [brand, setBrand] = React.useState(initial.brand);
  const [tagline, setTagline] = React.useState(initial.tagline);
  const [phones, setPhones] = React.useState<string[]>(initial.phones.length ? initial.phones : [""]);
  const [emails, setEmails] = React.useState<string[]>(initial.emails.length ? initial.emails : [""]);
  const [stats, setStats] = React.useState<Stat[]>(initial.stats.length ? initial.stats : [{ value: "", label: "" }]);
  const [busy, setBusy] = React.useState(false);

  const save = async () => {
    setBusy(true);
    await saveSettings({
      brand, tagline,
      phones: phones.filter(Boolean),
      emails: emails.filter(Boolean),
      stats: stats.filter((s) => s.value && s.label),
    });
    toast.success("Settings saved");
    setBusy(false);
    router.refresh();
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card title="Brand">
        <div className="space-y-4">
          <div className="space-y-1.5"><Label>Brand name</Label><Input value={brand} onChange={(e) => setBrand(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Tagline</Label><Input value={tagline} onChange={(e) => setTagline(e.target.value)} /></div>
        </div>
      </Card>

      <Card title="Contact">
        <ListEditor label="Phone numbers" items={phones} setItems={setPhones} placeholder="(212) 555-0142" />
        <div className="mt-4"><ListEditor label="Emails" items={emails} setItems={setEmails} placeholder="sales@example.com" /></div>
      </Card>

      <Card title="Homepage stats">
        <div className="space-y-2">
          {stats.map((s, i) => (
            <div key={i} className="flex gap-2">
              <Input value={s.value} placeholder="6,200+" onChange={(e) => setStats(stats.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} className="w-28" />
              <Input value={s.label} placeholder="Drawing sets delivered" onChange={(e) => setStats(stats.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} className="flex-1" />
              <Button variant="ghost" size="icon" onClick={() => setStats(stats.filter((_, j) => j !== i))} aria-label="Remove"><X className="size-4" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setStats([...stats, { value: "", label: "" }])}><Plus className="size-4" /> Add stat</Button>
        </div>
      </Card>

      <Button onClick={save} disabled={busy}>{busy ? <><Loader2 className="size-4 animate-spin" /> Saving…</> : <><Save className="size-4" /> Save settings</>}</Button>
    </div>
  );
}

function ListEditor({ label, items, setItems, placeholder }: { label: string; items: string[]; setItems: (v: string[]) => void; placeholder: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <Input value={it} placeholder={placeholder} onChange={(e) => setItems(items.map((x, j) => j === i ? e.target.value : x))} />
          <Button variant="ghost" size="icon" onClick={() => setItems(items.filter((_, j) => j !== i))} aria-label="Remove"><X className="size-4" /></Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => setItems([...items, ""])}><Plus className="size-4" /> Add</Button>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"><h3 className="mb-4 text-sm font-bold text-foreground">{title}</h3>{children}</div>;
}
