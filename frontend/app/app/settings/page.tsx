"use client";

import { useState } from "react";
import { Settings, Building2, Users, CreditCard, Plug, ScrollText, Shield, Upload, ExternalLink, Plus, Trash2 } from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: Settings },
  { id: "firm", label: "Firm", icon: Building2 },
  { id: "team", label: "Team", icon: Users },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "audit-trail", label: "Audit Trail", icon: ScrollText },
];

const teamMembers = [
  { id: "1", name: "Sarah Mitchell", email: "sarah@mitchellauditing.com.au", role: "Admin", initials: "SM" },
  { id: "2", name: "James Park", email: "james@mitchellauditing.com.au", role: "Auditor", initials: "JP" },
];

const invoices = [
  { id: "inv1", date: "01/08/2025", amount: "$147.00", status: "Paid", description: "3 Auto audits" },
  { id: "inv2", date: "01/07/2025", amount: "$98.00", status: "Paid", description: "2 Auto audits" },
  { id: "inv3", date: "01/06/2025", amount: "$49.00", status: "Paid", description: "1 Auto audit" },
];

const auditTrailEvents = [
  { id: "at1", timestamp: "22/08/2025 09:15", actor: "Sarah Mitchell", action: "Signed audit", target: "Chen Family Retirement FY25" },
  { id: "at2", timestamp: "21/08/2025 10:30", actor: "James Park", action: "Changed status to Review", target: "Williams Investment Super FY25" },
  { id: "at3", timestamp: "20/08/2025 11:00", actor: "Daniel Chen", action: "Replied to query", target: "Acme Family Super Fund FY25" },
  { id: "at4", timestamp: "19/08/2025 09:00", actor: "Sarah Mitchell", action: "Raised finding", target: "Acme Family Super Fund FY25" },
  { id: "at5", timestamp: "18/08/2025 14:00", actor: "AuditHub Auto", action: "Completed 4 items", target: "Acme Family Super Fund FY25" },
  { id: "at6", timestamp: "17/08/2025 14:00", actor: "Sarah Mitchell", action: "Sent query", target: "Acme Family Super Fund FY25" },
  { id: "at7", timestamp: "16/08/2025 10:00", actor: "Sarah Mitchell", action: "Sent queries", target: "Smith Family Super FY25" },
  { id: "at8", timestamp: "15/08/2025 08:00", actor: "Sarah Mitchell", action: "Created audit", target: "O'Brien Super Fund FY25" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [trailSearch, setTrailSearch] = useState("");

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border)] mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? "border-terracotta text-terracotta"
                : "border-transparent text-[var(--muted-foreground)] hover:text-ink"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6 max-w-lg">
          <div>
            <label className="block text-sm font-medium mb-1.5">Name</label>
            <input defaultValue="Sarah Mitchell" className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-paper focus:ring-2 focus:ring-terracotta focus:border-transparent text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input defaultValue="sarah@mitchellauditing.com.au" disabled className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)] text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">ASIC SMSF Auditor Number</label>
            <div className="flex items-center gap-2">
              <input defaultValue="12345678" disabled className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-sm font-mono" />
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-forest/10 text-forest">
                <Shield className="h-3 w-3" /> Verified
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-3">Notifications</label>
            <div className="space-y-3">
              {["Email notifications", "In-app notifications", "Sound effects"].map((label) => (
                <label key={label} className="flex items-center justify-between">
                  <span className="text-sm">{label}</span>
                  <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-terracotta transition-colors">
                    <span className="inline-block h-3.5 w-3.5 rounded-full bg-white translate-x-[18px] transition-transform" />
                  </button>
                </label>
              ))}
            </div>
          </div>
          <button className="px-4 py-2 bg-terracotta text-white text-sm rounded-lg hover:bg-terracotta-dark transition-colors">
            Save changes
          </button>
        </div>
      )}

      {/* Firm Tab */}
      {activeTab === "firm" && (
        <div className="space-y-6 max-w-lg">
          <div>
            <label className="block text-sm font-medium mb-1.5">Firm name</label>
            <input defaultValue="Mitchell Auditing Pty Ltd" className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-paper text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">ABN</label>
            <input defaultValue="98 765 432 109" className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-paper text-sm font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Address</label>
            <textarea defaultValue="Level 4, 123 Collins Street&#10;Melbourne VIC 3000" rows={3} className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-paper text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Letterhead</label>
            <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto text-[var(--muted-foreground)] mb-2" />
              <p className="text-sm text-[var(--muted-foreground)]">Drop your letterhead image here, or click to browse</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">PNG or JPG, recommended 800x200px</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-terracotta text-white text-sm rounded-lg hover:bg-terracotta-dark transition-colors">
            Save changes
          </button>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === "team" && (
        <div className="space-y-6">
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-cream rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center text-sm font-medium">
                    {member.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    member.role === "Admin" ? "bg-terracotta/10 text-terracotta" : "bg-forest/10 text-forest"
                  }`}>
                    {member.role}
                  </span>
                  <button className="p-1 text-[var(--muted-foreground)] hover:text-rose">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] text-sm rounded-lg hover:bg-cream transition-colors">
            <Plus className="h-4 w-4" /> Invite team member
          </button>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-cream rounded-lg border border-[var(--border)]">
              <p className="text-sm text-[var(--muted-foreground)]">Current plan</p>
              <p className="text-2xl font-semibold mt-1">Auto</p>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">$49 per Auto audit</p>
            </div>
            <div className="p-6 bg-cream rounded-lg border border-[var(--border)]">
              <p className="text-sm text-[var(--muted-foreground)]">This financial year</p>
              <p className="text-2xl font-semibold mt-1">6 Auto audits</p>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">$294.00 total</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Invoice history</h3>
            <div className="border border-[var(--border)] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[var(--muted)]">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium">Date</th>
                    <th className="text-left px-4 py-2.5 font-medium">Description</th>
                    <th className="text-left px-4 py-2.5 font-medium">Amount</th>
                    <th className="text-left px-4 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-t border-[var(--border)]">
                      <td className="px-4 py-2.5 font-mono text-xs">{inv.date}</td>
                      <td className="px-4 py-2.5">{inv.description}</td>
                      <td className="px-4 py-2.5 font-mono">{inv.amount}</td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-forest/10 text-forest">{inv.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] text-sm rounded-lg hover:bg-cream transition-colors">
            <ExternalLink className="h-4 w-4" /> Manage billing
          </button>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === "integrations" && (
        <div className="grid grid-cols-2 gap-4">
          {["BGL Simple Fund 360", "Class Super"].map((name) => (
            <div key={name} className="p-6 bg-cream rounded-lg border border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{name}</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber/10 text-amber">Coming soon</span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Import fund data and member records directly from {name}.
              </p>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-[var(--border)] text-terracotta" />
                Notify me when available
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Audit Trail Tab */}
      {activeTab === "audit-trail" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search audit trail..."
              value={trailSearch}
              onChange={(e) => setTrailSearch(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-paper text-sm"
            />
            <button className="px-4 py-2 border border-[var(--border)] text-sm rounded-lg hover:bg-cream transition-colors">
              Export CSV
            </button>
          </div>
          <div className="border border-[var(--border)] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--muted)]">
                <tr>
                  <th className="text-left px-4 py-2.5 font-medium">Timestamp</th>
                  <th className="text-left px-4 py-2.5 font-medium">Actor</th>
                  <th className="text-left px-4 py-2.5 font-medium">Action</th>
                  <th className="text-left px-4 py-2.5 font-medium">Target</th>
                </tr>
              </thead>
              <tbody>
                {auditTrailEvents
                  .filter((e) => !trailSearch || JSON.stringify(e).toLowerCase().includes(trailSearch.toLowerCase()))
                  .map((event) => (
                    <tr key={event.id} className="border-t border-[var(--border)] hover:bg-cream/50">
                      <td className="px-4 py-2.5 font-mono text-xs">{event.timestamp}</td>
                      <td className="px-4 py-2.5">{event.actor}</td>
                      <td className="px-4 py-2.5">{event.action}</td>
                      <td className="px-4 py-2.5">{event.target}</td>
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
