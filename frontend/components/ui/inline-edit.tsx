"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

export interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}

function InlineEdit({
  value,
  onSave,
  className,
  inputClassName,
  placeholder = "Click to edit",
  as: Tag = "span",
}: InlineEditProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setDraft(value);
  }, [value]);

  React.useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const handleSave = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      onSave(trimmed);
    } else {
      setDraft(value);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setDraft(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn(
          "rounded-md border border-terracotta bg-white px-2 py-1 text-sm outline-none ring-2 ring-terracotta/20",
          inputClassName
        )}
        placeholder={placeholder}
      />
    );
  }

  return (
    <Tag
      className={cn(
        "group inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1 -mx-1 transition-colors hover:bg-[var(--muted)]",
        className
      )}
      onClick={() => setEditing(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setEditing(true);
        }
      }}
    >
      {value || <span className="text-muted-foreground">{placeholder}</span>}
      <Pencil className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </Tag>
  );
}

export { InlineEdit };
