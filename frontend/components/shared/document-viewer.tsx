"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { AuditDocument, ExtractedField } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Pencil,
  FileText,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
} from "lucide-react";

interface DocumentViewerProps {
  document: AuditDocument;
  open: boolean;
  onClose: () => void;
  onConfirmField?: (fieldId: string) => void;
  onEditField?: (fieldId: string, value: string) => void;
}

function ConfidenceDot({ confidence }: { confidence: number }) {
  const colour =
    confidence > 0.9
      ? "bg-forest"
      : confidence >= 0.7
        ? "bg-amber"
        : "bg-rose";
  const label =
    confidence > 0.9
      ? "High confidence"
      : confidence >= 0.7
        ? "Medium confidence"
        : "Low confidence";

  return (
    <span
      title={`${label} (${Math.round(confidence * 100)}%)`}
      className={cn("inline-block h-2 w-2 shrink-0 rounded-full", colour)}
    />
  );
}

export function DocumentViewer({
  document: doc,
  open,
  onClose,
  onConfirmField,
  onEditField,
}: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [editingFieldId, setEditingFieldId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState("");
  const fields = doc.extractedFields ?? [];

  // Escape key to dismiss
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleStartEdit = (field: ExtractedField) => {
    setEditingFieldId(field.id);
    setEditValue(field.value);
  };

  const handleSaveEdit = (fieldId: string) => {
    onEditField?.(fieldId, editValue);
    setEditingFieldId(null);
  };

  const automatedChecks = [
    {
      label: "Document classification matches upload category",
      status: doc.autoClassified ? "pass" : "pending",
    },
    {
      label: "All required fields extracted",
      status: fields.length > 0 && fields.every((f) => f.value) ? "pass" : "warning",
    },
    {
      label: "Confidence scores within acceptable range",
      status:
        fields.length > 0 && fields.every((f) => f.confidence >= 0.7)
          ? "pass"
          : fields.some((f) => f.confidence < 0.7)
            ? "fail"
            : "pending",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`Document viewer: ${doc.filename}`}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-lg bg-ink/80 p-2 text-white hover:bg-ink transition-colors"
        aria-label="Close viewer"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Left: PDF placeholder */}
      <div className="flex flex-1 flex-col bg-gray-100 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-white dark:bg-ink px-4 py-2">
          <h3 className="text-sm font-medium text-ink truncate pr-4">
            {doc.filename}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Page {currentPage} of {doc.pageCount || 1}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setCurrentPage((p) => Math.min(doc.pageCount || 1, p + 1))
              }
              disabled={currentPage >= (doc.pageCount || 1)}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* PDF placeholder area */}
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <FileText className="h-16 w-16 opacity-30" />
            <p className="text-sm">PDF preview</p>
            <p className="text-xs">
              {doc.filename} &middot; Page {currentPage}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Extracted fields */}
      <div className="w-full max-w-md overflow-y-auto border-l border-[var(--border)] bg-paper">
        <div className="p-6">
          <h3 className="font-serif text-lg font-semibold text-ink mb-1">
            Extracted Fields
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            {fields.filter((f) => f.confirmed).length} of {fields.length}{" "}
            confirmed
          </p>

          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No fields extracted for this document.
            </p>
          ) : (
            <div className="space-y-3">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className={cn(
                    "rounded-lg border p-3 transition-colors",
                    field.confirmed
                      ? "border-forest/20 bg-forest/5"
                      : "border-[var(--border)] bg-cream"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          {field.label}
                        </p>
                        <ConfidenceDot confidence={field.confidence} />
                      </div>

                      {editingFieldId === field.id ? (
                        <div className="flex gap-2 mt-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 rounded border border-[var(--border)] bg-white px-2 py-1 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-terracotta"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(field.id)}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-ink">
                          {field.value}
                        </p>
                      )}
                    </div>

                    {editingFieldId !== field.id && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleStartEdit(field)}
                          aria-label={`Edit ${field.label}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        {!field.confirmed && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-forest hover:text-forest"
                            onClick={() => onConfirmField?.(field.id)}
                            aria-label={`Confirm ${field.label}`}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Automated checks */}
          <div className="mt-8">
            <h4 className="font-serif text-sm font-semibold text-ink mb-3">
              Automated Checks
            </h4>
            <div className="space-y-2">
              {automatedChecks.map((check) => (
                <div
                  key={check.label}
                  className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-cream p-3"
                >
                  {check.status === "pass" ? (
                    <ShieldCheck className="h-4 w-4 shrink-0 text-forest mt-0.5" />
                  ) : check.status === "fail" ? (
                    <ShieldAlert className="h-4 w-4 shrink-0 text-rose mt-0.5" />
                  ) : (
                    <ShieldQuestion className="h-4 w-4 shrink-0 text-amber mt-0.5" />
                  )}
                  <p className="text-sm text-ink">{check.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
