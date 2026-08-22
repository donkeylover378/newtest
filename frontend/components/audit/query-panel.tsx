"use client";

import { useState } from "react";
import { MessageSquare, Send, ChevronDown, ChevronRight, Plus, Clock } from "lucide-react";
import { formatRelativeTime } from "@/lib/format";
import type { Query } from "@/lib/types";

interface QueryPanelProps {
  queries: Query[];
  accountantName?: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  sent: "bg-amber/10 text-amber",
  responded: "bg-forest/10 text-forest",
  resolved: "bg-gray-100 text-gray-500",
};

export function QueryPanel({ queries, accountantName = "Daniel Chen" }: QueryPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNewQuery, setShowNewQuery] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newBody, setNewBody] = useState("");

  const openQueries = queries.filter((q) => q.status !== "resolved");

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <h3 className="font-medium text-sm">Queries</h3>
          {openQueries.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber/10 text-amber">
              {openQueries.length}
            </span>
          )}
        </div>
        <button onClick={() => setShowNewQuery(!showNewQuery)} className="p-1 hover:bg-cream rounded">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* New Query Form */}
      {showNewQuery && (
        <div className="p-4 border-b border-[var(--border)] space-y-3 bg-cream/50">
          <input
            type="text"
            placeholder="Subject"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-paper"
          />
          <textarea
            placeholder="Describe what you need from the accountant..."
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-paper resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--muted-foreground)]">To: {accountantName}</span>
            <div className="flex gap-2">
              <button onClick={() => setShowNewQuery(false)} className="px-3 py-1.5 text-xs border border-[var(--border)] rounded-lg hover:bg-cream">
                Cancel
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-xs bg-terracotta text-white rounded-lg hover:bg-terracotta-dark">
                <Send className="h-3 w-3" /> Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Send */}
      {openQueries.filter((q) => q.status === "draft").length > 1 && (
        <div className="px-4 py-2 bg-gold/5 border-b border-[var(--border)]">
          <button className="text-xs text-gold hover:text-gold-dark flex items-center gap-1">
            <Send className="h-3 w-3" />
            Send {openQueries.filter((q) => q.status === "draft").length} draft queries to {accountantName} as one email
          </button>
        </div>
      )}

      {/* Query List */}
      <div className="flex-1 overflow-auto">
        {queries.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-8 w-8 mx-auto text-[var(--muted-foreground)] mb-2" />
            <p className="text-sm text-[var(--muted-foreground)]">No open queries. Good place to be.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {queries.map((query) => (
              <div key={query.id}>
                <button
                  onClick={() => setExpandedId(expandedId === query.id ? null : query.id)}
                  className="w-full text-left px-4 py-3 hover:bg-cream/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {expandedId === query.id ? <ChevronDown className="h-3 w-3 flex-shrink-0" /> : <ChevronRight className="h-3 w-3 flex-shrink-0" />}
                        <span className="text-sm font-medium truncate">{query.subject}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${statusColors[query.status]}`}>
                          {query.status}
                        </span>
                        <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(query.raisedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
                {expandedId === query.id && (
                  <div className="px-4 pb-4 space-y-3">
                    {query.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-lg text-sm ${
                          msg.fromRole === "auditor" ? "bg-cream ml-4" : "bg-forest/5 mr-4"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-xs">{msg.from}</span>
                          <span className="text-[10px] text-[var(--muted-foreground)]">{formatRelativeTime(msg.timestamp)}</span>
                        </div>
                        <p className="text-sm leading-relaxed">{msg.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
