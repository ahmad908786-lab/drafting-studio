"use client";

import * as React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Drawing = { url: string; caption: string | null };

/**
 * One large image with a scrollable thumbnail strip beneath it. Picking a
 * thumbnail swaps the large image; clicking the large image opens it full size.
 * The strip is hidden when a project has only one image.
 */
export function DrawingGallery({ cover, images, title }: { cover: string | null; images: Drawing[]; title: string }) {
  const all: Drawing[] = [
    ...(cover ? [{ url: cover, caption: "Cover sheet" }] : []),
    ...images,
  ];
  const [active, setActive] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  if (all.length === 0) return null;

  const current = all[Math.min(active, all.length - 1)];

  return (
    <>
      {/* Large image */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${current.caption ?? title} full size`}
        className="group relative block aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Image
          src={current.url}
          alt={current.caption ?? title}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority
        />
        {current.caption && (
          <Badge className="absolute bottom-3 left-3 bg-primary/80 text-white backdrop-blur-sm">{current.caption}</Badge>
        )}
      </button>

      {/* Thumbnail strip — only worth showing when there's more than one */}
      {all.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
          {all.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={img.caption ?? `Image ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              className={cn(
                "relative aspect-[3/2] w-28 shrink-0 overflow-hidden rounded-lg border-2 bg-primary transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-32",
                i === active ? "border-primary" : "border-transparent opacity-65 hover:opacity-100",
              )}
            >
              <Image src={img.url} alt={img.caption ?? `${title} ${i + 1}`} fill sizes="128px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Full-size view */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl p-2">
          <DialogTitle className="sr-only">{current.caption ?? title}</DialogTitle>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-primary">
            <Image src={current.url} alt={current.caption ?? title} fill sizes="95vw" className="object-contain" />
          </div>
          {all.length > 1 && (
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium text-muted-foreground">{current.caption}</span>
              <div className="flex gap-1.5">
                {all.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Image ${i + 1}`}
                    className={cn("size-2 rounded-full", i === active ? "bg-primary" : "bg-muted")}
                  />
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
