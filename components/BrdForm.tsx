"use client";

import { useRef, useState } from "react";

interface Props {
  onGenerate: (formData: FormData) => void;
  isLoading: boolean;
}

const BASELINE_MARKETS = ["AU", "UK", "DE", "JP", "NL", "MX", "IT", "ES", "FR"];

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
      impact: "Parity diff will be skipped. Feature carry-forward will rely on previous BRD only.",
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

    // Override file input with state-tracked value
    data.delete("previousBrd");
    data.append("previousBrd", previousBrd);

    abScreenshots.forEach((f) => data.append("abScreenshots", f));
    b2cScreenshots.forEach((f) => data.append("b2cScreenshots", f));

    onGenerate(data);
  }

  function handleAbScreenshots(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setAbScreenshots(Array.from(e.target.files));
  }

  function handleB2cScreenshots(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setB2cScreenshots(Array.from(e.target.files));
  }

  function handlePreviousBrd(e: React.ChangeEvent<HTMLInputElement>) {
    setPreviousBrd(e.target.files?.[0] ?? null);
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Country info */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Country Info</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Country</label>
          <input
            name="newCountry"
            type="text"
            required
            placeholder="e.g. South Africa"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Baseline Marketplace</label>
          <select
            name="baselineMarket"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select baseline…</option>
            {BASELINE_MARKETS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Input 1: Previous BRD — REQUIRED */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            1 — Previous Country BRD
          </h2>
          <span className="text-xs font-medium text-white bg-red-500 px-1.5 py-0.5 rounded">Required</span>
        </div>
        <p className="text-xs text-gray-500">Upload the BRD from your last country launch (PDF, Markdown, or plain text)</p>
        <input
          name="previousBrd"
          type="file"
          accept=".pdf,.md,.txt"
          onChange={handlePreviousBrd}
          className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {previousBrd && (
          <p className="text-xs text-blue-600 truncate">📄 {previousBrd.name}</p>
        )}
        {submitAttempted && !previousBrd && (
          <p className="text-xs text-red-600 font-medium">Previous BRD is required to generate a BRD.</p>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* Input 2: AB Marketplace screenshots — OPTIONAL */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            2 — AB Marketplace Screenshots
          </h2>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Optional</span>
        </div>
        <p className="text-xs text-gray-500">
          Screenshots of what the host team has already shipped (PNG/JPG, multi-select OK)
        </p>
        <input
          ref={abInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleAbScreenshots}
          className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
        {abScreenshots.length > 0 && (
          <div className="space-y-0.5">
            <p className="text-xs text-purple-600 font-medium">{abScreenshots.length} file(s) selected</p>
            <ul className="text-xs text-gray-400 space-y-0.5 pl-1">
              {abScreenshots.map((f) => (
                <li key={f.name} className="truncate">• {f.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* Input 3: B2C screenshots — OPTIONAL */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            3 — Local B2C Marketplace Screenshots
          </h2>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Optional</span>
        </div>
        <p className="text-xs text-gray-500">
          Screenshots of the local consumer marketplace showing country-specific features (PNG/JPG)
        </p>
        <input
          ref={b2cInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleB2cScreenshots}
          className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
        />
        {b2cScreenshots.length > 0 && (
          <div className="space-y-0.5">
            <p className="text-xs text-green-600 font-medium">{b2cScreenshots.length} file(s) selected</p>
            <ul className="text-xs text-gray-400 space-y-0.5 pl-1">
              {b2cScreenshots.map((f) => (
                <li key={f.name} className="truncate">• {f.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* Input 4: Tax/TRD doc — OPTIONAL */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            4 — Tax / TRD Doc
          </h2>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Optional</span>
        </div>
        <p className="text-xs text-gray-500">Paste compliance constraints and business rules</p>
        <textarea
          name="trdContent"
          rows={6}
          value={trdContent}
          onChange={(e) => setTrdContent(e.target.value)}
          placeholder="Paste TRD / tax doc content here…"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      <hr className="border-gray-100" />

      {/* Additional context */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Additional Context <span className="text-gray-400 font-normal normal-case">(optional)</span>
        </h2>
        <textarea
          name="additionalContext"
          rows={3}
          placeholder="Any known country-specific requirements, constraints, or open questions…"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      {/* Warning banner for missing optional inputs */}
      {missingOptionals.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 space-y-2">
          <p className="text-xs font-semibold text-amber-800">Some inputs are missing — these sections will be limited:</p>
          <ul className="space-y-1">
            {missingOptionals.map((m) => (
              <li key={m.label} className="text-xs text-amber-700">
                <span className="font-medium">{m.label}:</span> {m.impact}
              </li>
            ))}
          </ul>
          <p className="text-xs text-amber-600">You can still generate — gaps will be flagged in the BRD output.</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-md text-sm transition-colors"
      >
        {isLoading ? "Generating BRD…" : "Generate BRD"}
      </button>
    </form>
  );
}
