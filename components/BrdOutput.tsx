"use client";

import ReactMarkdown from "react-markdown";

interface Props {
  output: string;
  isLoading: boolean;
  error: string;
  brdContext: { country: string; baseline: string } | null;
}

const INPUT_CHECKLIST = [
  {
    label: "Previous Country BRD",
    tag: "Required",
    tagColor: "bg-red-100 text-red-700",
    description: "Your last country launch BRD (PDF, Markdown, or plain text) — used as the baseline for carry-forward features",
  },
  {
    label: "AB Marketplace Screenshots",
    tag: "Optional",
    tagColor: "bg-gray-100 text-gray-500",
    description: "Screenshots of what the host team has shipped — enables parity diff",
  },
  {
    label: "Local B2C Screenshots",
    tag: "Optional",
    tagColor: "bg-gray-100 text-gray-500",
    description: "Consumer marketplace screenshots — enables country gap analysis",
  },
  {
    label: "Tax / TRD Doc",
    tag: "Optional",
    tagColor: "bg-gray-100 text-gray-500",
    description: "Compliance constraints — enables compliance extraction and team sign-off list",
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
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-lg">
          <p className="text-sm font-semibold text-red-700 mb-1">Error</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!output && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="max-w-md w-full">
          <div className="text-4xl mb-4">📄</div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Your BRD will appear here</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Fill in the inputs on the left and click <strong>Generate BRD</strong>.
            The generator will run the available analyses and assemble a complete draft — flagging any sections that couldn't be completed.
          </p>

          <div className="text-left bg-gray-50 rounded-md p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">What each input unlocks</p>
            {INPUT_CHECKLIST.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="mt-0.5 w-4 h-4 rounded border-2 border-gray-300 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-medium text-gray-700">{item.label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${item.tagColor}`}>{item.tag}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Only the Previous BRD is required. Missing optional inputs will be flagged as open questions in the BRD output.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sticky context header */}
      {brdContext && (
        <div className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium sticky top-0 z-20">
          {brdContext.country} — Baseline: {brdContext.baseline}
        </div>
      )}

      {/* Toolbar */}
      {output && (
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white sticky top-[42px] z-10">
          <span className="text-sm text-gray-500">
            {isLoading ? "Generating…" : "BRD draft ready — review before use"}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors"
            >
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="text-xs px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors"
            >
              Download .md
            </button>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && !output && (
        <div className="flex items-center justify-center flex-1 p-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-gray-500">Running parity diff, gap analysis, compliance extraction…</p>
          </div>
        </div>
      )}

      {/* Markdown output */}
      {output && (
        <div className="flex-1 p-8">
          <article className="prose prose-sm max-w-3xl mx-auto prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base">
            <ReactMarkdown>{output}</ReactMarkdown>
          </article>
          {isLoading && (
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
              <div className="animate-pulse w-2 h-2 bg-blue-400 rounded-full" />
              Streaming…
            </div>
          )}
        </div>
      )}
    </div>
  );
}
