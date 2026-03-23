import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildSystemPrompt(hasAbScreenshots: boolean, hasB2cScreenshots: boolean, hasTrd: boolean): string {
  const skippedSteps: string[] = [];
  if (!hasAbScreenshots) skippedSteps.push("Step 1 (Parity Diff) — no AB screenshots provided");
  if (!hasB2cScreenshots) skippedSteps.push("Step 2 (Feature Gap Analysis) — no B2C screenshots provided");
  if (!hasTrd) skippedSteps.push("Step 3 (Compliance Extraction) — no TRD content provided");

  const skipNote = skippedSteps.length > 0
    ? `\n\n## ⚠️ Skipped Pipeline Steps\nThe following steps cannot be performed due to missing inputs. Do NOT hallucinate or invent content for these steps. Instead, use the placeholder text shown:\n${skippedSteps.map((s) => `- ${s}`).join("\n")}`
    : "";

  return `You are an expert Amazon Business (AB) Product Manager specializing in international marketplace launches.

Your task is to generate a complete, review-ready Business Requirements Document (BRD) for a new country launch.

## Your Pipeline

Work through these steps in order, then assemble the final BRD:

### Step 1 — Parity Diff (Previous BRD + AB Marketplace Screenshots)
${!hasAbScreenshots ? `**[SKIPPED — no AB screenshots provided]** In the BRD, mark all parity-related sections with: "[SKIPPED — Parity diff not performed. AB screenshots were not uploaded. PM should conduct this analysis manually.]"` : `Compare the uploaded previous BRD against the AB marketplace screenshots to identify:
- Features in the previous BRD that are still valid and should carry forward
- Net-new features the host team has shipped since the last launch (not in previous BRD)
- Any features that appear deprecated or changed`}

### Step 2 — Feature Gap Analysis (AB Screenshots + B2C Screenshots)
${!hasB2cScreenshots ? `**[SKIPPED — no B2C screenshots provided]** In the BRD, mark all country-gap sections with: "[SKIPPED — Country gap analysis not performed. B2C screenshots were not uploaded. PM should conduct a B2C marketplace audit manually.]"` : `Compare the AB marketplace screenshots against the local B2C marketplace screenshots to identify:
- Features present in B2C but missing from AB (country-specific buyer expectations)
- UI/UX patterns in B2C that suggest local market requirements
- Payment methods, address formats, or localization needs specific to this country`}

### Step 3 — Compliance Extraction (Tax/TRD Doc)
${!hasTrd ? `**[SKIPPED — no TRD content provided]** In the BRD, mark all compliance sections with: "[SKIPPED — Compliance extraction not performed. No TRD content was provided. PM should add tax and compliance requirements manually after obtaining the TRD.]"` : `Parse the provided Tax/TRD document to extract:
- Hard compliance requirements (must-have for legal/tax reasons)
- Business rules that translate into acceptance criteria
- Dependencies on other teams (Indirect Tax, TEB, GIS, Accounting)
- Any blocking sign-offs required before launch`}

### Step 4 — Triage Layer
Classify every requirement into one of these buckets:
- **CARRY_FORWARD**: Exists in previous BRD, still valid — localize to the new country
- **PARITY_MATCH**: Host team has shipped this feature — include, flag that it needs AB integration work
- **COUNTRY_GAP**: Found in B2C audit, not in AB — include as new requirement
- **NET_NEW**: New capability from AB screenshots not in previous BRD — include, flag for PM review
- **COMPLIANCE**: Derived from tax/TRD extraction — include with acceptance criteria
${skippedSteps.length > 0 ? "\nFor any buckets dependent on skipped steps, mark them as [NOT ASSESSED] in the triage table." : ""}

### Step 5 — BRD Assembly
Populate the following standard BRD template with your findings.${skipNote}

---

## BRD Structure to Output

# Business Requirements Document
## [New Country] AB Marketplace Launch

**Version:** 1.0 (Claude-generated draft — PM review required)
**Baseline Marketplace:** [Baseline]
**Status:** Draft
${skippedSteps.length > 0 ? `**⚠️ Sections with incomplete analysis:** ${skippedSteps.map((s) => s.split("—")[0].trim()).join(", ")}` : ""}

---

## 1. Executive Summary
Brief overview of the country launch, business case, and scope.
${skippedSteps.length > 0 ? `\n> **Note:** This BRD was generated with limited inputs. The following analyses were skipped and must be completed by the PM: ${skippedSteps.join("; ")}.` : ""}

## 2. Problem Statement
What problem does AB solve for business buyers in this country? What is the current state vs. desired state?

## 3. Customer Segments & Use Cases
Primary customer segments and their core use cases. Reference any country-specific buyer behavior patterns identified from B2C audit.
${!hasB2cScreenshots ? "\n> [SKIPPED — B2C audit not performed. Add country-specific buyer behavior after manual B2C review.]" : ""}

## 4. Feature Requirements

### 4.1 Carry-Forward Features (Localized)
Features from the previous BRD adapted for the new country. For each:
- Feature name
- Source: [Baseline market]
- Localization notes (currency, language, address format, etc.)
- Priority: P0/P1/P2

### 4.2 Parity Features (Host Team Integration)
${!hasAbScreenshots ? `> [SKIPPED — Parity diff not performed. AB screenshots were not uploaded. PM should conduct this analysis manually.]` : `Net-new features the host team has shipped. For each:
- Feature name
- Source: AB [Baseline] marketplace (observed in screenshots)
- Integration work required
- Priority: P0/P1/P2`}

### 4.3 Country-Specific Requirements (B2C Gap)
${!hasB2cScreenshots ? `> [SKIPPED — Country gap analysis not performed. B2C screenshots were not uploaded. PM should conduct a B2C marketplace audit manually.]` : `Features identified from B2C audit that B2B buyers will expect. For each:
- Feature name
- Source: B2C [New Country] marketplace
- Business justification
- Priority: P0/P1/P2`}

### 4.4 Compliance Requirements
${!hasTrd ? `> [SKIPPED — Compliance extraction not performed. No TRD content was provided. PM should add tax and compliance requirements manually after obtaining the TRD.]` : `Requirements derived from tax/TRD document. For each:
- Requirement name
- Legal/regulatory basis
- Acceptance criteria (specific, testable)
- Team dependency (if any)
- Priority: P0 (non-negotiable)`}

## 5. Acceptance Criteria
Consolidated, testable acceptance criteria organized by feature area.
${!hasTrd ? "\n> Compliance acceptance criteria not included — TRD not provided." : ""}

## 6. Team Dependencies & Sign-offs Required
List all cross-team dependencies identified from TRD (Indirect Tax, TEB, GIS, Accounting, Legal, etc.)
${!hasTrd ? "\n> [SKIPPED — TRD not provided. PM must identify and list dependencies after obtaining TRD.]" : ""}

## 7. Out of Scope
Features explicitly excluded from this launch with rationale.

## 8. Open Questions
Questions that require PM judgment or stakeholder input before finalizing requirements.
${skippedSteps.length > 0 ? `\n> **Auto-generated open questions from skipped analyses:**\n${!hasAbScreenshots ? "> - [ ] PM to conduct AB marketplace parity audit manually and update Section 4.2\n" : ""}${!hasB2cScreenshots ? "> - [ ] PM to conduct B2C marketplace audit manually and update Sections 3 and 4.3\n" : ""}${!hasTrd ? "> - [ ] PM to obtain TRD and add compliance requirements to Sections 4.4, 5, and 6\n" : ""}` : ""}

## 9. Triage Summary
A table summarizing all requirements by bucket:
| Requirement | Bucket | Priority | Source | Notes |
|-------------|--------|----------|--------|-------|
${!hasAbScreenshots ? "| Parity features | PARITY_MATCH | [NOT ASSESSED] | AB screenshots not provided | Manual review required |\n" : ""}${!hasB2cScreenshots ? "| Country-specific features | COUNTRY_GAP | [NOT ASSESSED] | B2C screenshots not provided | Manual review required |\n" : ""}${!hasTrd ? "| Compliance requirements | COMPLIANCE | [NOT ASSESSED] | TRD not provided | Manual review required |\n" : ""}

---

## Output Rules
- Be specific and concrete — use feature names, not vague descriptions
- Flag uncertainty clearly with [PM TO VERIFY] markers
- Keep acceptance criteria testable: "Given X, when Y, then Z"
- For anything not covered by the inputs, add an open question rather than inventing requirements
- For skipped steps, use exactly the placeholder text specified — do NOT hallucinate or invent content
- This is a draft — the PM will review and refine before use`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const newCountry = formData.get("newCountry") as string;
    const baselineMarket = formData.get("baselineMarket") as string;
    const trdContent = formData.get("trdContent") as string;
    const additionalContext = formData.get("additionalContext") as string;
    const previousBrdFile = formData.get("previousBrd") as File | null;
    const abScreenshotFiles = formData.getAll("abScreenshots") as File[];
    const b2cScreenshotFiles = formData.getAll("b2cScreenshots") as File[];

    if (!newCountry || !baselineMarket || !previousBrdFile) {
      return Response.json({ error: "Missing required fields: newCountry, baselineMarket, previousBrd" }, { status: 400 });
    }

    const hasAbScreenshots = abScreenshotFiles.length > 0;
    const hasB2cScreenshots = b2cScreenshotFiles.length > 0;
    const hasTrd = !!(trdContent && trdContent.trim());

    const systemPrompt = buildSystemPrompt(hasAbScreenshots, hasB2cScreenshots, hasTrd);

    // Build message content
    const content: Anthropic.MessageParam["content"] = [];

    // Previous BRD — PDF as document block, .md/.txt as text block
    content.push({
      type: "text",
      text: `## INPUT 1: Previous Country BRD (${baselineMarket} baseline)\nThis is the BRD from the previous country launch. Use it as your baseline.`,
    });
    const isPdf = previousBrdFile.type === "application/pdf" || previousBrdFile.name.endsWith(".pdf");
    if (isPdf) {
      const pdfBytes = await previousBrdFile.arrayBuffer();
      const pdfBase64 = Buffer.from(pdfBytes).toString("base64");
      content.push({
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: pdfBase64,
        },
      } as Anthropic.DocumentBlockParam);
    } else {
      const text = await previousBrdFile.text();
      content.push({ type: "text", text: `\`\`\`\n${text}\n\`\`\`` });
    }

    // AB marketplace screenshots
    if (hasAbScreenshots) {
      content.push({
        type: "text",
        text: `## INPUT 2: AB Marketplace Screenshots (${baselineMarket})\nThese show what the host team has already shipped. Use these for the parity diff.`,
      });
      for (const file of abScreenshotFiles) {
        const imgBytes = await file.arrayBuffer();
        const imgBase64 = Buffer.from(imgBytes).toString("base64");
        const mediaType = (file.type || "image/png") as "image/png" | "image/jpeg" | "image/gif" | "image/webp";
        content.push({
          type: "image",
          source: {
            type: "base64",
            media_type: mediaType,
            data: imgBase64,
          },
        });
      }
    } else {
      content.push({
        type: "text",
        text: "## INPUT 2: AB Marketplace Screenshots\n[NOT PROVIDED] — Skip Step 1 (Parity Diff). Mark all parity sections as [SKIPPED] in the BRD output.",
      });
    }

    // B2C screenshots
    if (hasB2cScreenshots) {
      content.push({
        type: "text",
        text: `## INPUT 3: Local B2C Marketplace Screenshots (${newCountry})\nThese show country-specific features and buyer expectations. Use these for the feature gap analysis.`,
      });
      for (const file of b2cScreenshotFiles) {
        const imgBytes = await file.arrayBuffer();
        const imgBase64 = Buffer.from(imgBytes).toString("base64");
        const mediaType = (file.type || "image/png") as "image/png" | "image/jpeg" | "image/gif" | "image/webp";
        content.push({
          type: "image",
          source: {
            type: "base64",
            media_type: mediaType,
            data: imgBase64,
          },
        });
      }
    } else {
      content.push({
        type: "text",
        text: `## INPUT 3: Local B2C Marketplace Screenshots (${newCountry})\n[NOT PROVIDED] — Skip Step 2 (Feature Gap Analysis). Mark all country-gap sections as [SKIPPED] in the BRD output.`,
      });
    }

    // TRD content
    if (hasTrd) {
      content.push({
        type: "text",
        text: `## INPUT 4: Tax / TRD Document\n${trdContent}`,
      });
    } else {
      content.push({
        type: "text",
        text: "## INPUT 4: Tax / TRD Document\n[NOT PROVIDED] — Skip Step 3 (Compliance Extraction). Mark all compliance sections as [SKIPPED] in the BRD output.",
      });
    }

    // Task instruction
    let taskText = `\n---\n\nNow generate the complete BRD for the **${newCountry}** AB marketplace launch, using **${baselineMarket}** as the baseline marketplace.\n\nFollow your pipeline, skipping any steps marked [NOT PROVIDED] above. For skipped steps, use the exact placeholder text specified in the system prompt — do not invent or hallucinate content.`;
    if (additionalContext) {
      taskText += `\n\n## Additional Context from PM\n${additionalContext}`;
    }
    content.push({ type: "text", text: taskText });

    // Stream response
    const stream = await client.messages.stream({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || "8096"),
      system: systemPrompt,
      messages: [{ role: "user", content }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    console.error("BRD generation error:", e);
    const message = e instanceof Error ? e.message : String(e);
    const stack = e instanceof Error ? e.stack : undefined;
    return Response.json({ error: message, detail: stack }, { status: 500 });
  }
}
