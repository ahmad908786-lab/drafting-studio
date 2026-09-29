"use client";

import { useState } from "react";
import { AlertCircle, Briefcase, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoLogin } from "@/app/actions/auth";

const DEMOS = [
  { key: "admin", label: "Admin panel", hint: "admin@draftingstudio.example", icon: ShieldCheck },
  { key: "client", label: "Client portal", hint: "client@acme.example", icon: Briefcase },
];

export function DemoLoginButtons() {
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loginAs = async (demo: (typeof DEMOS)[number]) => {
    setPendingKey(demo.key);
    setError("");
    try {
      const res = await demoLogin(demo.key);
      // Success path redirects (thrown) — only failures return here.
      if (!res.ok) {
        setError(res.message || "Demo login failed. Make sure demo users are seeded.");
        setPendingKey(null);
      }
    } catch {
      // Redirect throws on success — navigation is already happening.
    }
  };

  return (
    <div>
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span className="shrink-0 font-medium">Or try the demo</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      {error && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" /> {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {DEMOS.map((demo) => {
          const Icon = demo.icon;
          const pending = pendingKey === demo.key;
          return (
            <Button
              key={demo.key}
              type="button"
              variant="outline"
              className="h-auto flex-col gap-1 py-3"
              disabled={pendingKey !== null}
              onClick={() => loginAs(demo)}
            >
              <Icon className="size-5 text-primary" />
              <span className="text-sm font-semibold">{pending ? "Opening…" : demo.label}</span>
              <span className="max-w-full truncate text-[11px] font-normal text-muted-foreground">
                {demo.hint}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
