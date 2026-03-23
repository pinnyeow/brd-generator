"use client";

import { useRef, useState } from "react";

interface Props {
  onGenerate: (formData: FormData) => void;
  isLoading: boolean;
  isDark: boolean;
}

const BASELINE_MARKETS = [
  { value: "AU", label: "AU — Australia" },
  { value: "UK", label: "UK — United Kingdom" },
  { value: "DE", label: "DE — Germany" },
  { value: "JP", label: "JP — Japan" },
  { value: "NL", label: "NL — Netherlands" },
  { value: "MX", label: "MX — Mexico" },
  { value: "IT", label: "IT — Italy" },
  { value: "ES", label: "ES — Spain" },
  { value: "FR", label: "FR — France" },
];

export default function BrdForm({ onGenerate, isLoading }: Props) {
  const [abScreenshots, setAbScreenshots] = useState<File[]>([]);
  const [b2cScreenshots, setB2cScreenshots] = useState<File[]>([]);
  const [previousBrd, setPreviousBrd] = useState<File | null>(null);
  const [trdContent, setTrdContent] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const abInputRef = useRef<HTMLInputElement>(null);
  const b2cInputRef = useRef<HTMLInputElement>(null);

  const missingOptionals: { label: string; impact: string }[] = [];
  if (abScreenshots.length === 0) {
    missingOptionals.push({
      label: "AB Marketplace Screenshots",
      impact: "Parity difference analysis will be skipped. Feature carry-forward will rely on previous BRD only.",
    });
  }
  if (b2cScreenshots.length === 0) {
    missingOptionals.push({
      label: "Local B2C Screenshots",
      impact: "Country gap analysis will be skipped. Country-specific requirements won't be identified.",
    });
  }
  if (!trdContent.trim()) {
    missingOptionals.push({
      label: "Tax / TRD Doc",
      impact: "Compliance extraction will be skipped. Tax requirements won't be included.",
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!previousBrd) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    data.delete("previousBrd");
    data.append("previousBrd", previousBrd);
    abScreenshots.forEach((f) => data.append("abScreenshots", f));
    b2cScreenshots.forEach((f) => data.append("b2cScreenshots", f));
    onGenerate(data);
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Country info */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-gray-400 dark:text-[#555] uppercase tracking-widest">Country Info</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#C0C0C0] mb-1">New Country</label>
          <input
            name="newCountry"
            type="text"
            required
            placeholder="e.g. South Africa"
            className="w-full border border-gray-300 dark:border-[#333] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#252525] text-gray-900 dark:text-[#F5F5F5] placeholder-gray-400 dark:placeholder-[#555] focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#C0C0C0] mb-1">Baseline Marketplace</label>
          <select
            name="baselineMarket"
            required
            className="w-full border border-gray-300 dark:border-[#333] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#252525] text-gray-900 dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent transition-colors"
          >
            <option value="">Select baseline…</option>
            {BASELINE_MARKETS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      <hr className="border-gray-100 dark:border-[#2A2A2A]" />

      {/* Input 1: Previous BRD */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-orange-50 dark:bg-[rgba(255,153,0,0.15)]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-gray-600 dark:text-[#C0C0C0] uppercase tracking-wide">1 — Previous Country BRD</h2>
            <span className="text-xs font-bold bg-orange-100 dark:bg-[rgba(255,153,0,0.15)] text-orange-600 dark:text-[#FF9900] px-2 py-0.5 rounded">Required</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-[#666]">Upload the BRD from your last country launch (PDF, Markdown, or plain text)</p>
        <input
          name="previousBrd"
          type="file"
          accept=".pdf,.md,.txt"
          onChange={(e) => setPreviousBrd(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-gray-600 dark:text-[#8A8A8A] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-orange-50 dark:file:bg-[rgba(255,153,0,0.1)] file:text-orange-600 dark:file:text-[#FF9900] hover:file:bg-orange-100 dark:hover:file:bg-[rgba(255,153,0,0.2)]"
        />
        {previousBrd && <p className="text-xs text-[#FF9900] truncate">📄 {previousBrd.name}</p>}
        {submitAttempted && !previousBrd && (
          <p className="text-xs text-red-500 font-medium">Previous BRD is required to generate a BRD.</p>
        )}
      </div>

      <hr className="border-gray-100 dark:border-[#2A2A2A]" />

      {/* Input 2: AB Marketplace Screenshots */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-pink-50 dark:bg-[rgba(236,72,153,0.15)]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-gray-600 dark:text-[#C0C0C0] uppercase tracking-wide">2 — AB Marketplace Screenshots</h2>
            <span className="text-xs font-medium bg-gray-100 dark:bg-[rgba(255,255,255,0.06)] text-gray-500 dark:text-[#666] px-2 py-0.5 rounded">Optional</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-[#666]">Screenshots of what the host team has already shipped (PNG or JPG, select multiple files)</p>
        <input
          ref={abInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => { if (e.target.files) setAbScreenshots(Array.from(e.target.files)); }}
          className="w-full text-sm text-gray-600 dark:text-[#8A8A8A] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-pink-50 dark:file:bg-[rgba(236,72,153,0.1)] file:text-pink-600 dark:file:text-[#F472B6] hover:file:bg-pink-100 dark:hover:file:bg-[rgba(236,72,153,0.2)]"
        />
        {abScreenshots.length > 0 && (
          <div className="space-y-0.5">
            <p className="text-xs text-pink-500 font-medium">{abScreenshots.length} file(s) selected</p>
            <ul className="text-xs text-gray-400 dark:text-[#555] space-y-0.5 pl-1">
              {abScreenshots.map((f) => <li key={f.name} className="truncate">• {f.name}</li>)}
            </ul>
          </div>
        )}
      </div>

      <hr className="border-gray-100 dark:border-[#2A2A2A]" />

      {/* Input 3: B2C Screenshots */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-teal-50 dark:bg-[rgba(16,185,129,0.15)]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-gray-600 dark:text-[#C0C0C0] uppercase tracking-wide">3 — Local B2C Screenshots</h2>
            <span className="text-xs font-medium bg-gray-100 dark:bg-[rgba(255,255,255,0.06)] text-gray-500 dark:text-[#666] px-2 py-0.5 rounded">Optional</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-[#666]">Screenshots of the local consumer marketplace showing country-specific UI patterns and features</p>
        <input
          ref={b2cInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => { if (e.target.files) setB2cScreenshots(Array.from(e.target.files)); }}
          className="w-full text-sm text-gray-600 dark:text-[#8A8A8A] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-teal-50 dark:file:bg-[rgba(16,185,129,0.1)] file:text-teal-600 dark:file:text-[#34D399] hover:file:bg-teal-100 dark:hover:file:bg-[rgba(16,185,129,0.2)]"
        />
        {b2cScreenshots.length > 0 && (
          <div className="space-y-0.5">
            <p className="text-xs text-teal-500 font-medium">{b2cScreenshots.length} file(s) selected</p>
            <ul className="text-xs text-gray-400 dark:text-[#555] space-y-0.5 pl-1">
              {b2cScreenshots.map((f) => <li key={f.name} className="truncate">• {f.name}</li>)}
            </ul>
          </div>
        )}
      </div>

      <hr className="border-gray-100 dark:border-[#2A2A2A]" />

      {/* Input 4: Tax/TRD */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-50 dark:bg-[rgba(245,158,11,0.15)]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-gray-600 dark:text-[#C0C0C0] uppercase tracking-wide">4 — Tax / TRD Document</h2>
            <span className="text-xs font-medium bg-gray-100 dark:bg-[rgba(255,255,255,0.06)] text-gray-500 dark:text-[#666] px-2 py-0.5 rounded">Optional</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-[#666]">Paste compliance and tax constraints for the new country</p>
        <textarea
          name="trdContent"
          rows={6}
          value={trdContent}
          onChange={(e) => setTrdContent(e.target.value)}
          placeholder="Paste tax or compliance requirements here…"
          className="w-full border border-gray-300 dark:border-[#3A3A3A] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-[#F5F5F5] placeholder-gray-400 dark:placeholder-[#555] focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent resize-y transition-colors"
        />
      </div>

      <hr className="border-gray-100 dark:border-[#2A2A2A]" />

      {/* Additional context */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-gray-400 dark:text-[#555] uppercase tracking-widest">
          Additional Context <span className="font-normal normal-case">(optional)</span>
        </h2>
        <textarea
          name="additionalContext"
          rows={3}
          placeholder="Any known country-specific requirements, constraints, or open questions…"
          className="w-full border border-gray-300 dark:border-[#3A3A3A] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-[#F5F5F5] placeholder-gray-400 dark:placeholder-[#555] focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent resize-y transition-colors"
        />
      </div>

      {/* Warning banner */}
      {missingOptionals.length > 0 && (
        <div className="bg-amber-50 dark:bg-[rgba(245,158,11,0.08)] border border-amber-200 dark:border-[rgba(245,158,11,0.2)] rounded-lg p-3 space-y-2">
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">Some inputs are missing — these sections will be limited:</p>
          <ul className="space-y-1">
            {missingOptionals.map((m) => (
              <li key={m.label} className="text-xs text-amber-700 dark:text-amber-500">
                <span className="font-medium">{m.label}:</span> {m.impact}
              </li>
            ))}
          </ul>
          <p className="text-xs text-amber-600 dark:text-amber-500">You can still generate — gaps will be flagged in the BRD output.</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#FF9900] hover:bg-[#E88A00] disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg text-sm transition-colors"
      >
        {isLoading ? "Generating BRD…" : "✦ Generate BRD"}
      </button>
    </form>
  );
}
