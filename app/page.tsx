"use client";

import { useState, useEffect } from "react";
import BrdForm from "@/components/BrdForm";
import BrdOutput from "@/components/BrdOutput";

export default function Home() {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [brdContext, setBrdContext] = useState<{ country: string; baseline: string } | null>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  async function handleGenerate(formData: FormData) {
    setIsLoading(true);
    setOutput("");
    setError("");
    setBrdContext({
      country: (formData.get("newCountry") as string) || "",
      baseline: (formData.get("baselineMarket") as string) || "",
    });

    try {
      const response = await fetch("/api/generate-brd", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errMsg = `Server error (${response.status})`;
        try {
          const err = await response.json();
          errMsg = err.error || errMsg;
        } catch {
          // response was not JSON (e.g. Vercel HTML error page)
        }
        throw new Error(errMsg);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#141414] font-sans transition-colors duration-200">
      {/* Left panel */}
      <div className="w-[420px] flex-shrink-0 border-r border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1C1C1C] overflow-y-auto transition-colors duration-200">
        <div className="p-6 border-b border-gray-200 dark:border-[#2A2A2A]">
          <h1 className="text-xl font-bold text-gray-900 dark:text-[#F5F5F5]">ABIX BRD Generator</h1>
          <p className="text-sm text-gray-500 dark:text-[#8A8A8A] mt-1">
            Provide 4 inputs → get a review-ready BRD draft in minutes
          </p>
        </div>
        <BrdForm onGenerate={handleGenerate} isLoading={isLoading} isDark={isDark} />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Right panel header */}
        <div className="flex items-center justify-between px-8 py-3 border-b border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1C1C1C] transition-colors duration-200">
          <span className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-[#555]">
            BRD Output
          </span>
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252525] text-xs font-medium text-gray-500 dark:text-[#8A8A8A] hover:bg-gray-100 dark:hover:bg-[#2E2E2E] transition-colors"
          >
            <span>{isDark ? "🌙" : "☀️"}</span>
            <span>{isDark ? "Dark" : "Light"}</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-[#141414] transition-colors duration-200">
          <BrdOutput output={output} isLoading={isLoading} error={error} brdContext={brdContext} isDark={isDark} />
        </div>
      </div>
    </div>
  );
}
