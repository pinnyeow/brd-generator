"use client";

import { useState } from "react";
import BrdForm from "@/components/BrdForm";
import BrdOutput from "@/components/BrdOutput";

export default function Home() {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [brdContext, setBrdContext] = useState<{ country: string; baseline: string } | null>(null);

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
        const err = await response.json();
        throw new Error(err.error || "Failed to generate BRD");
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
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Left panel */}
      <div className="w-[420px] flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">ABIX BRD Generator</h1>
          <p className="text-sm text-gray-500 mt-1">
            Provide 4 inputs → get a review-ready BRD draft in minutes
          </p>
        </div>
        <BrdForm onGenerate={handleGenerate} isLoading={isLoading} />
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto">
        <BrdOutput output={output} isLoading={isLoading} error={error} brdContext={brdContext} />
      </div>
    </div>
  );
}
