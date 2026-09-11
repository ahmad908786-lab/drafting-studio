"use client";

import * as React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type Drawing = { url: string; caption: string | null };

export function DrawingGallery({ cover, images, title }: { cover: string | null; images: Drawing[]; title: string }) {
  const all: Drawing[] = [
    ...(cover ? [{ url: cover, caption: "Cover sheet" }] : []),
    ...images,
  ];
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);

  if (all.length === 0) return null;

  const openAt = (i: number) => {
    setActive(i);
    setOpen(true);
  };

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {all.map((img, i) => (
          <button
            key={img.url}
            onClick={() => openAt(i)}
            className="group relative aspect-[3/2] overflow-hidden rounded-xl border border-border bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Image src={img.url} alt={img.caption ?? title} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            {img.caption && (
              <Badge className="absolute bottom-2 left-2 bg-primary/80 text-white backdrop-blur-sm">{img.caption}</Badge>
            )}
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-2">
          <DialogTitle className="sr-only">{all[active]?.caption ?? title}</DialogTitle>
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-primary">
            {all[active] && (
              <Image src={all[active].url} alt={all[active].caption ?? title} fill sizes="90vw" className="object-contain" />
            )}
          </div>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm font-medium text-muted-foreground">{all[active]?.caption}</span>
            <div className="flex gap-1.5">
              {all.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Drawing ${i + 1}`}
                  className={`size-2 rounded-full ${i === active ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
