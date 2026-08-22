"use client";

import { useState } from "react";
import { ChecklistPanel } from "@/components/audit/checklist-panel";
import { WorkingPaper } from "@/components/audit/working-paper";
import { AIPanel } from "@/components/audit/ai-panel";
import { mockChecklistItems, mockDocuments, mockQueries } from "@/lib/mock-data";
import { formatDuration } from "@/lib/format";
import { FileText, MessageSquare, AlertTriangle, Clock, ChevronRight } from "lucide-react";

export default function AuditPage() {
  const [selectedItemId, setSelectedItemId] = useState<string | null>("ci1");
  const [autoEnabled, setAutoEnabled] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(true);

  const audit = {
    id: "a2",
    fundName: "Acme Family Super Fund (sample)",
    year: 2025,
    autoEnabled,
    progress: 62,
    totalItems: mockChecklistItems.length,
    completedItems: mockChecklistItems.filter((i) => i.status !== "todo").length,
    queriesOpen: mockQueries.filter((q) => q.status !== "resolved").length,
    findingsCount: mockChecklistItems.filter((i) => i.status === "fail").length,
    timeSavedMinutes: 87,
  };

  const selectedItem = mockChecklistItems.find((i) => i.id === selectedItemId) || null;
  const itemDocuments = selectedItem
    ? mockDocuments.filter((d) => selectedItem.evidenceIds.includes(d.id))
    : [];

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      {/* Top Banner */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-cream">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold">{audit.fundName}</h1>
            <p className="text-sm text-[var(--muted-foreground)]">FY{audit.year} Audit</p>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            autoEnabled
              ? "bg-gold/10 text-gold border border-gold/20"
              : "bg-gray-100 text-gray-500 border border-gray-200"
          }`}>
            {autoEnabled ? "Auto Active" : "Free"}
          </div>
          <button
            onClick={() => setAutoEnabled(!autoEnabled)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              autoEnabled ? "bg-gold" : "bg-gray-300"
            }`}
          >
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
              autoEnabled ? "translate-x-[18px]" : "translate-x-[3px]"
            }`} />
          </button>
        </div>
        <div className="flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
          <div className="flex items-center gap-1">
            <div className="w-32 h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-forest transition-all duration-500"
                style={{ width: `${audit.progress}%` }}
              />
            </div>
            <span className="font-mono text-xs">{audit.progress}%</span>
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Checklist */}
        <div className="w-80 border-r border-[var(--border)] flex-shrink-0">
          <ChecklistPanel
            items={mockChecklistItems}
            selectedItemId={selectedItemId}
            onSelectItem={setSelectedItemId}
          />
        </div>

        {/* Centre: Working Paper */}
        <div className="flex-1 overflow-auto">
          <WorkingPaper
            item={selectedItem}
            documents={itemDocuments}
          />
        </div>

        {/* Right: AI Panel */}
        {showAIPanel && (
          <div className="w-[380px] border-l border-[var(--border)] flex-shrink-0">
            <AIPanel
              selectedItem={selectedItem}
              isAutoEnabled={autoEnabled}
              findings={[]}
              queries={mockQueries}
              onActivateAuto={() => setAutoEnabled(true)}
              collapsed={false}
              onToggleCollapse={() => setShowAIPanel(!showAIPanel)}
            />
          </div>
        )}
      </div>

      {/* Bottom Dock */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--border)] bg-cream">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
            <FileText className="h-4 w-4" />
            <span>{audit.totalItems} items</span>
          </div>
          <div className="flex items-center gap-1.5 text-forest">
            <span>{audit.completedItems} complete</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber">
            <MessageSquare className="h-4 w-4" />
            <span>{audit.queriesOpen} queries</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose">
            <AlertTriangle className="h-4 w-4" />
            <span>{audit.findingsCount} findings</span>
          </div>
          {audit.timeSavedMinutes > 0 && (
            <div className="flex items-center gap-1.5 text-gold">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(audit.timeSavedMinutes)} saved</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className="text-sm text-[var(--muted-foreground)] hover:text-ink flex items-center gap-1"
          >
            AI Panel
            <ChevronRight className={`h-4 w-4 transition-transform ${showAIPanel ? "rotate-180" : ""}`} />
          </button>
          <button className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors">
            Send to partner for review
          </button>
          <button
            disabled={audit.completedItems < audit.totalItems}
            className="px-4 py-2 text-sm bg-terracotta text-white rounded-lg hover:bg-terracotta-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign audit
          </button>
        </div>
      </div>
    </div>
  );
}
