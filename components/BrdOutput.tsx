"use client";

import ReactMarkdown from "react-markdown";

interface Props {
  output: string;
  isLoading: boolean;
  error: string;
  brdContext: { country: string; baseline: string } | null;
  isDark: boolean;
}

const INPUT_CHECKLIST = [
  {
    label: "Previous Country BRD",
    tag: "Required",
    tagClass: "bg-orange-100 dark:bg-[rgba(255,153,0,0.15)] text-orange-600 dark:text-[#FF9900]",
    description: "Your last country launch BRD (PDF, Markdown, or plain text) — used as the baseline for carry-forward features",
    iconBg: "bg-orange-50 dark:bg-[rgba(255,153,0,0.15)]",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    label: "AB Marketplace Screenshots",
    tag: "Optional",
    tagClass: "bg-gray-100 dark:bg-[rgba(255,255,255,0.06)] text-gray-500 dark:text-[#666]",
    description: "Screenshots of what the host team has shipped — enables parity difference analysis",
    iconBg: "bg-pink-50 dark:bg-[rgba(236,72,153,0.15)]",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
  },
  {
    label: "Local B2C Screenshots",
    tag: "Optional",
    tagClass: "bg-gray-100 dark:bg-[rgba(255,255,255,0.06)] text-gray-500 dark:text-[#666]",
    description: "Consumer marketplace screenshots — enables country gap analysis",
    iconBg: "bg-teal-50 dark:bg-[rgba(16,185,129,0.15)]",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    label: "Tax / TRD Doc",
    tag: "Optional",
    tagClass: "bg-gray-100 dark:bg-[rgba(255,255,255,0.06)] text-gray-500 dark:text-[#666]",
    description: "Compliance constraints — enables compliance extraction and team sign-off list",
    iconBg: "bg-amber-50 dark:bg-[rgba(245,158,11,0.15)]",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
];

export default function BrdOutput({ output, isLoading, error, brdContext }: Props) {
  function handleCopy() {
    navigator.clipboard.writeText(output);
  }

  function handleDownload() {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = brdContext?.country
      ? `brd-${brdContext.country.toLowerCase().replace(/\s+/g, "-")}.md`
      : "brd-draft.md";
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="bg-red-50 dark:bg-[rgba(239,68,68,0.08)] border border-red-200 dark:border-[rgba(239,68,68,0.2)] rounded-xl p-4 max-w-lg">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">Error</p>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!output && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8 text-center py-12">
        <div className="max-w-md w-full">
          <div className="text-4xl mb-4 opacity-30">📋</div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-[#F5F5F5] mb-2">Your BRD will appear here</h2>
          <p className="text-sm text-gray-500 dark:text-[#555] leading-relaxed mb-8">
            Fill in the inputs on the left and click <strong className="text-gray-700 dark:text-[#C0C0C0]">Generate BRD</strong>.
            The generator will run the available analyses and assemble a complete draft — flagging any sections that couldn&apos;t be completed.
          </p>

          <p className="text-xs font-bold text-gray-400 dark:text-[#555] uppercase tracking-widest mb-4 text-left">
            What each input unlocks
          </p>

          <div className="border border-gray-200 dark:border-[#2A2A2A] rounded-xl overflow-hidden bg-white dark:bg-[#1C1C1C] mb-4">
            {INPUT_CHECKLIST.map((item, i) => (
              <div
                key={item.label}
                className={`flex items-start gap-3 p-4 ${i < INPUT_CHECKLIST.length - 1 ? "border-b border-gray-100 dark:border-[#2A2A2A]" : ""}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-sm font-semibold text-gray-700 dark:text-[#C0C0C0]">{item.label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${item.tagClass}`}>{item.tag}</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-[#555]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 dark:text-[#3A3A3A]">
            Only the Previous BRD is required. Missing optional inputs will be flagged as open questions in the BRD output.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Context header */}
      {brdContext && (
        <div className="px-6 py-2.5 bg-[#FF9900] text-black text-sm font-semibold sticky top-0 z-20">
          {brdContext.country} — Baseline: {brdContext.baseline}
        </div>
      )}

      {/* Toolbar */}
      {output && (
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1C1C1C] sticky top-[42px] z-10 transition-colors">
          <span className="text-sm text-gray-500 dark:text-[#8A8A8A]">
            {isLoading ? "Generating…" : "BRD draft ready — review before use"}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#333] bg-white dark:bg-[#252525] hover:bg-gray-50 dark:hover:bg-[#2E2E2E] text-gray-700 dark:text-[#F5F5F5] transition-colors"
            >
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#333] bg-white dark:bg-[#252525] hover:bg-gray-50 dark:hover:bg-[#2E2E2E] text-gray-700 dark:text-[#F5F5F5] transition-colors"
            >
              Download .md
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && !output && (
        <div className="flex items-center justify-center flex-1 p-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#FF9900] border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-[#8A8A8A]">Running parity analysis, gap analysis, compliance extraction…</p>
          </div>
        </div>
      )}

      {/* Markdown output */}
      {output && (
        <div className="flex-1 p-8">
          <article className="prose prose-sm max-w-3xl mx-auto dark:prose-invert prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-a:text-[#FF9900]">
            <ReactMarkdown>{output}</ReactMarkdown>
          </article>
          {isLoading && (
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-400 dark:text-[#555]">
              <div className="animate-pulse w-2 h-2 bg-[#FF9900] rounded-full" />
              Streaming…
            </div>
          )}
        </div>
      )}
    </div>
  );
}
