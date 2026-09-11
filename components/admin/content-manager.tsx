"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Star, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { saveTestimonial, deleteTestimonial } from "@/app/actions/admin-misc";

type Testimonial = { id: string; author: string; role: string | null; company: string | null; quote: string; rating: number; featured: boolean };

export function ContentManager({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="space-y-10">
      <TestimonialsSection testimonials={testimonials} />
    </div>
  );
}

function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-lg font-bold text-foreground">Testimonials</h3>
        <TestimonialDialog onSaved={() => router.refresh()} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground">{t.author}</span>
                  {t.featured && <Star className="size-3.5 fill-accent text-accent" />}
                </div>
                <p className="text-xs text-muted-foreground">{[t.role, t.company].filter(Boolean).join(", ")}</p>
              </div>
              <div className="flex gap-1">
                <TestimonialDialog initial={t} onSaved={() => router.refresh()} />
                <button onClick={async () => { if (confirm("Delete?")) { await deleteTestimonial(t.id); toast.success("Deleted"); router.refresh(); } }} aria-label="Delete" className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
              </div>
            </div>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">“{t.quote}”</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialDialog({ initial, onSaved }: { initial?: Testimonial; onSaved: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [d, setD] = React.useState({ author: initial?.author ?? "", role: initial?.role ?? "", company: initial?.company ?? "", quote: initial?.quote ?? "", rating: initial?.rating ?? 5, featured: initial?.featured ?? false });
  const [busy, setBusy] = React.useState(false);
  const save = async () => {
    setBusy(true);
    await saveTestimonial({ id: initial?.id, ...d });
    toast.success("Saved");
    setBusy(false); setOpen(false); onSaved();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {initial ? <button className="text-xs font-semibold text-primary hover:underline">Edit</button> : <Button size="sm"><Plus className="size-4" /> Add</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{initial ? "Edit" : "New"} testimonial</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Author</Label><Input value={d.author} onChange={(e) => setD({ ...d, author: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Role</Label><Input value={d.role} onChange={(e) => setD({ ...d, role: e.target.value })} /></div>
          </div>
          <div className="space-y-1.5"><Label>Company</Label><Input value={d.company} onChange={(e) => setD({ ...d, company: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Quote</Label><Textarea rows={3} value={d.quote} onChange={(e) => setD({ ...d, quote: e.target.value })} /></div>
          <label className="flex items-center justify-between"><span className="text-sm font-medium">Featured on homepage</span><Switch checked={d.featured} onCheckedChange={(v) => setD({ ...d, featured: v })} /></label>
          <Button onClick={save} disabled={busy} className="w-full">{busy ? <Loader2 className="size-4 animate-spin" /> : "Save"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
