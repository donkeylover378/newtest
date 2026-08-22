"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  ChevronDown,
  ChevronUp,
  Upload,
  Check,
  X,
  MessageSquare,
  Minus,
  Info,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { findGlossaryEntry } from "@/lib/glossary";
import type {
  ChecklistItem,
  ChecklistStatus,
  AuditDocument,
  ExtractedField,
  FindingSeverity,
} from "@/lib/types";

interface WorkingPaperProps {
  item: ChecklistItem | null;
  documents: AuditDocument[];
  onStatusChange?: (itemId: string, status: ChecklistStatus) => void;
}

function ConfidenceDot({ confidence }: { confidence: number }) {
  const colour =
    confidence >= 0.95
      ? "bg-forest"
      : confidence >= 0.85
        ? "bg-amber"
        : "bg-rose";
  return (
    <span
      className={cn("inline-block h-2 w-2 rounded-full", colour)}
      title={`${Math.round(confidence * 100)}% confidence`}
    />
  );
}

function DocumentRow({ doc }: { doc: AuditDocument }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-white">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-cream/50"
      >
        <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">
            {doc.filename}
          </p>
          <p className="text-xs text-muted-foreground">
            {doc.pageCount} pages &middot;{" "}
            {(doc.fileSize / 1_000_000).toFixed(1)} MB
          </p>
        </div>
        {doc.classificationLabel && (
          <Badge variant="default" className="shrink-0">
            {doc.classificationLabel}
          </Badge>
        )}
        {doc.confidence != null && (
          <ConfidenceDot confidence={doc.confidence} />
        )}
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      {expanded && doc.extractedFields && doc.extractedFields.length > 0 && (
        <div className="border-t border-[var(--border)] p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Extracted Fields
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="pb-1.5 pr-4 text-left text-xs font-medium text-muted-foreground">
                    Label
                  </th>
                  <th className="pb-1.5 pr-4 text-left text-xs font-medium text-muted-foreground">
                    Value
                  </th>
                  <th className="pb-1.5 text-left text-xs font-medium text-muted-foreground">
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody>
                {doc.extractedFields.map((field: ExtractedField) => (
                  <tr
                    key={field.id}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    <td className="py-1.5 pr-4 text-muted-foreground">
                      {field.label}
                    </td>
                    <td className="py-1.5 pr-4 font-medium">{field.value}</td>
                    <td className="py-1.5">
                      <div className="flex items-center gap-1.5">
                        <ConfidenceDot confidence={field.confidence} />
                        <span className="text-xs text-muted-foreground">
                          {Math.round(field.confidence * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function WorkingPaper({
  item,
  documents,
  onStatusChange,
}: WorkingPaperProps) {
  const [notes, setNotes] = useState("");
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "saved" | "saving" | "idle"
  >("idle");
  const [querySubject, setQuerySubject] = useState("");
  const [queryBody, setQueryBody] = useState("");
  const [findingTitle, setFindingTitle] = useState("");
  const [findingDescription, setFindingDescription] = useState("");
  const [findingSeverity, setFindingSeverity] =
    useState<FindingSeverity>("medium");
  const [activeDecision, setActiveDecision] = useState<ChecklistStatus | null>(
    null
  );

  // Sync notes when item changes
  useEffect(() => {
    if (item) {
      setNotes(item.notes || "");
      setActiveDecision(null);
      setQuerySubject("");
      setQueryBody("");
      setFindingTitle("");
      setFindingDescription("");
      setAutoSaveStatus("idle");
    }
  }, [item?.id]);

  // Auto-save simulation
  useEffect(() => {
    if (!item || autoSaveStatus !== "idle") return;
    const timer = setTimeout(() => {
      setAutoSaveStatus("saving");
      setTimeout(() => setAutoSaveStatus("saved"), 800);
    }, 2000);
    return () => clearTimeout(timer);
  }, [notes]);

  const handleNotesChange = useCallback((value: string) => {
    setNotes(value);
    setAutoSaveStatus("idle");
  }, []);

  const handleDecision = useCallback(
    (status: ChecklistStatus) => {
      if (!item) return;
      setActiveDecision(status === activeDecision ? null : status);
      onStatusChange?.(item.id, status);
      const labels: Record<ChecklistStatus, string> = {
        pass: "Pass",
        fail: "Fail",
        query: "Query",
        na: "N/A",
        todo: "To do",
        auto: "Auto",
      };
      toast.success(`Status changed to ${labels[status]}`, {
        description: item.questionText.slice(0, 60) + "...",
      });
    },
    [item, activeDecision, onStatusChange]
  );

  if (!item) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-paper p-8">
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="font-serif text-lg text-muted-foreground">
            Select a checklist item to view its working paper
          </p>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Use <kbd className="rounded bg-cream px-1.5 py-0.5 font-mono text-xs">j</kbd> /{" "}
            <kbd className="rounded bg-cream px-1.5 py-0.5 font-mono text-xs">k</kbd>{" "}
            to navigate
          </p>
        </div>
      </div>
    );
  }

  const glossary = findGlossaryEntry(item.sisReference);
  const linkedDocs = documents.filter((d) =>
    item.evidenceIds.includes(d.id)
  );
  const currentStatus = activeDecision ?? item.status;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-paper">
      {/* Header */}
      <div className="border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h2 className="font-serif text-lg font-semibold leading-snug text-ink">
              {item.questionText}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex cursor-help items-center gap-1 rounded bg-[var(--muted)] px-2 py-0.5 font-mono text-xs text-muted-foreground">
                      {item.sisReference}
                      <Info className="h-3 w-3" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="max-w-xs"
                  >
                    {glossary ? (
                      <div>
                        <p className="mb-1 font-semibold">{glossary.term}</p>
                        <p className="text-xs leading-relaxed">
                          {glossary.definition}
                        </p>
                      </div>
                    ) : (
                      <p>No glossary entry found for {item.sisReference}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-xs text-muted-foreground">
                {item.section}
              </span>
              {item.autoCompleted && (
                <Badge variant="auto">Auto-completed</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="evidence" className="flex h-full flex-col">
          <div className="border-b border-[var(--border)] px-6">
            <TabsList>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="decision">Decision</TabsTrigger>
            </TabsList>
          </div>

          {/* Evidence tab */}
          <TabsContent value="evidence" className="flex-1 overflow-auto px-6 pb-6">
            {linkedDocs.length > 0 ? (
              <div className="space-y-3">
                {linkedDocs.map((doc) => (
                  <DocumentRow key={doc.id} doc={doc} />
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No documents linked to this item yet.
              </p>
            )}

            {/* Drop zone */}
            <div className="mt-4 rounded-xl border-2 border-dashed border-[var(--border)] p-8 text-center transition-colors hover:border-terracotta/40 hover:bg-terracotta/5">
              <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                Drop documents here to link evidence
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                PDF, images, or spreadsheets
              </p>
            </div>
          </TabsContent>

          {/* Notes tab */}
          <TabsContent value="notes" className="flex-1 overflow-auto px-6 pb-6">
            <div className="relative">
              <textarea
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Add your working paper notes..."
                className="min-h-[300px] w-full resize-y rounded-lg border border-[var(--border)] bg-white p-4 text-sm leading-relaxed text-ink placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-1"
              />
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                {autoSaveStatus === "saving" && (
                  <>
                    <Save className="h-3 w-3 animate-pulse" />
                    <span>Saving...</span>
                  </>
                )}
                {autoSaveStatus === "saved" && (
                  <>
                    <Check className="h-3 w-3 text-forest" />
                    <span>Saved</span>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Decision tab */}
          <TabsContent value="decision" className="flex-1 overflow-auto px-6 pb-6">
            <div className="grid grid-cols-4 gap-3">
              {(
                [
                  {
                    status: "na" as const,
                    label: "N/A",
                    icon: Minus,
                    colour: "gray",
                    bgFilled: "bg-gray-500",
                    bgOutline:
                      "border-gray-300 text-gray-500 hover:bg-gray-50",
                  },
                  {
                    status: "query" as const,
                    label: "Query",
                    icon: MessageSquare,
                    colour: "amber",
                    bgFilled: "bg-amber",
                    bgOutline:
                      "border-amber text-amber hover:bg-amber/10",
                  },
                  {
                    status: "fail" as const,
                    label: "Fail",
                    icon: X,
                    colour: "rose",
                    bgFilled: "bg-rose",
                    bgOutline:
                      "border-rose text-rose hover:bg-rose/10",
                  },
                  {
                    status: "pass" as const,
                    label: "Pass",
                    icon: Check,
                    colour: "forest",
                    bgFilled: "bg-forest",
                    bgOutline:
                      "border-forest text-forest hover:bg-forest/10",
                  },
                ] as const
              ).map((opt) => {
                const isFilled = currentStatus === opt.status;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.status}
                    onClick={() => handleDecision(opt.status)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-4 font-medium transition-all",
                      isFilled
                        ? `${opt.bgFilled} border-transparent text-white shadow-md`
                        : opt.bgOutline
                    )}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Inline query form */}
            {currentStatus === "query" && (
              <div className="mt-6 animate-fade-in rounded-xl border border-amber/30 bg-amber/5 p-4">
                <h3 className="mb-3 font-serif text-sm font-semibold text-ink">
                  Raise a Query
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Subject"
                    value={querySubject}
                    onChange={(e) => setQuerySubject(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-1"
                  />
                  <textarea
                    placeholder="Describe the information required from the accountant..."
                    value={queryBody}
                    onChange={(e) => setQueryBody(e.target.value)}
                    className="min-h-[100px] w-full resize-y rounded-lg border border-[var(--border)] bg-white p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-1"
                  />
                  <Button
                    onClick={() => {
                      toast.success("Query sent to accountant");
                      setQuerySubject("");
                      setQueryBody("");
                    }}
                    disabled={!querySubject || !queryBody}
                  >
                    Send Query
                  </Button>
                </div>
              </div>
            )}

            {/* Inline finding form */}
            {currentStatus === "fail" && (
              <div className="mt-6 animate-fade-in rounded-xl border border-rose/30 bg-rose/5 p-4">
                <h3 className="mb-3 font-serif text-sm font-semibold text-ink">
                  Record a Finding
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Finding title"
                    value={findingTitle}
                    onChange={(e) => setFindingTitle(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-1"
                  />
                  <textarea
                    placeholder="Describe the finding and its impact..."
                    value={findingDescription}
                    onChange={(e) => setFindingDescription(e.target.value)}
                    className="min-h-[100px] w-full resize-y rounded-lg border border-[var(--border)] bg-white p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-1"
                  />
                  <Select
                    value={findingSeverity}
                    onValueChange={(v) =>
                      setFindingSeverity(v as FindingSeverity)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      toast.success("Finding recorded");
                      setFindingTitle("");
                      setFindingDescription("");
                    }}
                    disabled={!findingTitle || !findingDescription}
                  >
                    Record Finding
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
