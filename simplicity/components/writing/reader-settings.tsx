"use client";
import * as React from "react";
import { Type } from "lucide-react";
import { applyPrefs, DEFAULT_PREFS, PREFS_KEY, type ReaderPrefs } from "@/lib/reader-prefs";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function readPrefs(): ReaderPrefs {
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}") };
  } catch {
    return DEFAULT_PREFS;
  }
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: React.ReactNode }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="grid auto-cols-fr grid-flow-col gap-1 rounded-lg bg-secondary p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={cn(
              "rounded-md py-1.5 text-sm text-muted-foreground transition-colors",
              value === o.value && "bg-background text-foreground shadow-sm",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ReaderSettings() {
  const [prefs, setPrefs] = React.useState<ReaderPrefs>(DEFAULT_PREFS);
  const [open, setOpen] = React.useState(false);

  const update = (patch: Partial<ReaderPrefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    applyPrefs(next);
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
  };

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (o) setPrefs(readPrefs());
        setOpen(o);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Reading settings">
          <Type />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 space-y-4">
        <p className="font-display text-base">Reading settings</p>
        <Segmented
          label="Text size"
          value={prefs.size}
          onChange={(size) => update({ size })}
          options={[
            { value: "s", label: <span className="text-xs">A</span> },
            { value: "m", label: <span className="text-sm">A</span> },
            { value: "l", label: <span className="text-base">A</span> },
            { value: "xl", label: <span className="text-lg">A</span> },
          ]}
        />
        <Segmented
          label="Typeface"
          value={prefs.font}
          onChange={(font) => update({ font })}
          options={[
            { value: "serif", label: <span className="font-serif">Serif</span> },
            { value: "sans", label: <span className="font-sans">Sans</span> },
          ]}
        />
        <Segmented
          label="Line spacing"
          value={prefs.leading}
          onChange={(leading) => update({ leading })}
          options={[
            { value: "cozy", label: "Cozy" },
            { value: "airy", label: "Airy" },
          ]}
        />
        <button
          type="button"
          onClick={() => update(DEFAULT_PREFS)}
          className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Reset to default
        </button>
      </PopoverContent>
    </Popover>
  );
}
