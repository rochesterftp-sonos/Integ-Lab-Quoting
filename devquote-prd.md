# DevQuote — Project Quoting Tool
## Product Requirements Document
**Version:** 1.0  
**Status:** Ready for Development  
**Prepared for:** Claude Code

---

## 1. Overview

DevQuote is a web-based project quoting tool for a small software development agency that uses Claude Code for AI-assisted development. It produces two outputs from a single quote session: an internal estimate with full margin visibility, and a client-facing proposal. It includes an AI-powered complexity evaluator, a total cost of ownership calculator covering LLM API costs and hosting, and a fully editable rate card.

---

## 2. Technology Stack

- **Frontend:** Single-file React application (JSX)
- **Styling:** Tailwind CSS utility classes only (no custom CSS files)
- **AI Integration:** Anthropic Claude API via `fetch` to `https://api.anthropic.com/v1/messages`
- **Storage:** `window.storage` persistent key-value API (no localStorage, no backend)
- **Fonts:** Google Fonts via CDN
- **No build step required.** Output must be a single `.html` file or single `.jsx` file that runs standalone.

---

## 3. Application Structure

The app has four tabs accessible via a top navigation bar:

1. **Quote Builder** — primary estimating workspace
2. **Rate Card** — editable rates, phases, LLM pricing, hosting tiers
3. **Proposal View** — client-facing output
4. **Internal View** — full internal estimate with margin analysis

---

## 4. Data Model

All data persists via `window.storage`. Keys are prefixed with `devquote:`.

### 4.1 Rate Card (`devquote:ratecard`)

```json
{
  "lastUpdated": "ISO date string",
  "laborRates": {
    "hourlyRate": 150,
    "blendedRate": 150,
    "claudeCodeEfficiency": 0.4
  },
  "phases": [
    {
      "id": "discovery",
      "name": "Discovery & Customer Meetings",
      "description": "Initial meeting, requirements gathering",
      "minHours": 2,
      "maxHours": 4,
      "includeInProposal": true,
      "claudeCodeApplies": false
    },
    {
      "id": "prd",
      "name": "PRD Generation & Sign-off",
      "description": "Load meeting transcripts into Claude, generate PRD.md, client sign-off",
      "minHours": 1,
      "maxHours": 3,
      "includeInProposal": true,
      "claudeCodeApplies": true
    },
    {
      "id": "design",
      "name": "Design",
      "description": "UI/UX design via Claude Code",
      "minHours": 4,
      "maxHours": 16,
      "includeInProposal": true,
      "claudeCodeApplies": true
    },
    {
      "id": "build",
      "name": "Development Build",
      "description": "Claude Code assisted development from PRD.md",
      "minHours": 8,
      "maxHours": 40,
      "includeInProposal": true,
      "claudeCodeApplies": true
    },
    {
      "id": "qa_internal",
      "name": "Internal QA",
      "description": "Human QA pass, documented findings, fixes, retest",
      "minHours": 4,
      "maxHours": 16,
      "includeInProposal": true,
      "claudeCodeApplies": false
    },
    {
      "id": "security",
      "name": "Security Review",
      "description": "Code and security audit",
      "minHours": 2,
      "maxHours": 8,
      "includeInProposal": true,
      "claudeCodeApplies": false
    },
    {
      "id": "customer_first_look",
      "name": "Customer First Look",
      "description": "Client review session and feedback collection",
      "minHours": 1,
      "maxHours": 2,
      "includeInProposal": true,
      "claudeCodeApplies": false
    },
    {
      "id": "feature_tuning",
      "name": "Feature Tuning",
      "description": "Adjustments based on first look feedback (capped at 2 rounds)",
      "minHours": 2,
      "maxHours": 8,
      "includeInProposal": true,
      "claudeCodeApplies": true
    },
    {
      "id": "customer_second_look",
      "name": "Customer Second Look",
      "description": "Second client review and acceptance check",
      "minHours": 1,
      "maxHours": 2,
      "includeInProposal": true,
      "claudeCodeApplies": false
    },
    {
      "id": "documentation",
      "name": "Documentation Review",
      "description": "Technical and user documentation generated and reviewed",
      "minHours": 1,
      "maxHours": 4,
      "includeInProposal": true,
      "claudeCodeApplies": true
    },
    {
      "id": "customer_acceptance",
      "name": "Customer Acceptance",
      "description": "Final sign-off and handoff",
      "minHours": 1,
      "maxHours": 2,
      "includeInProposal": true,
      "claudeCodeApplies": false
    },
    {
      "id": "change_window",
      "name": "14-Day Change Window",
      "description": "Up to 2 minor changes post-acceptance. Minor = no logic changes, UI only, under 2 hours each.",
      "minHours": 0,
      "maxHours": 4,
      "includeInProposal": true,
      "claudeCodeApplies": true
    },
    {
      "id": "break_fix",
      "name": "30-Day Break-Fix (No Support Contract)",
      "description": "Bug fixes within original spec only. Excludes new features.",
      "minHours": 0,
      "maxHours": 8,
      "includeInProposal": false,
      "claudeCodeApplies": false
    }
  ],
  "llmPricing": [
    {
      "id": "claude-haiku-3-5",
      "name": "Claude Haiku 3.5",
      "provider": "Anthropic",
      "inputCostPer1MTokens": 0.80,
      "outputCostPer1MTokens": 4.00
    },
    {
      "id": "claude-sonnet-4",
      "name": "Claude Sonnet 4",
      "provider": "Anthropic",
      "inputCostPer1MTokens": 3.00,
      "outputCostPer1MTokens": 15.00
    },
    {
      "id": "claude-opus-4",
      "name": "Claude Opus 4",
      "provider": "Anthropic",
      "inputCostPer1MTokens": 15.00,
      "outputCostPer1MTokens": 75.00
    },
    {
      "id": "gpt-4o",
      "name": "GPT-4o",
      "provider": "OpenAI",
      "inputCostPer1MTokens": 2.50,
      "outputCostPer1MTokens": 10.00
    },
    {
      "id": "gpt-4o-mini",
      "name": "GPT-4o Mini",
      "provider": "OpenAI",
      "inputCostPer1MTokens": 0.15,
      "outputCostPer1MTokens": 0.60
    }
  ],
  "hostingTiers": [
    {
      "id": "managed-small",
      "name": "Managed Small",
      "description": "Render, Railway, Vercel — hobby/startup scale",
      "monthlyLow": 20,
      "monthlyHigh": 100
    },
    {
      "id": "managed-production",
      "name": "Managed Production",
      "description": "Render/Railway production tier, Vercel Pro",
      "monthlyLow": 100,
      "monthlyHigh": 500
    },
    {
      "id": "cloud-small",
      "name": "Cloud Hosted — Small",
      "description": "AWS / GCP / Azure small workloads",
      "monthlyLow": 200,
      "monthlyHigh": 800
    },
    {
      "id": "cloud-enterprise",
      "name": "Cloud Hosted — Enterprise",
      "description": "AWS / GCP / Azure production, HA, multi-region",
      "monthlyLow": 800,
      "monthlyHigh": 3000
    },
    {
      "id": "on-prem",
      "name": "On-Premises",
      "description": "Client-managed infrastructure — outputs labor estimate only",
      "monthlyLow": 0,
      "monthlyHigh": 0
    }
  ],
  "supportContract": {
    "monthlyLow": 800,
    "monthlyHigh": 1200,
    "description": "Priority response, minor changes, ongoing maintenance"
  },
  "targetMargin": 60
}
```

### 4.2 Quote (`devquote:quote:{id}`)

```json
{
  "id": "uuid",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string",
  "projectName": "string",
  "clientName": "string",
  "clientContact": "string",
  "projectSummary": "string",
  "requirements": "string — raw requirements text used for complexity evaluation",
  "claudeCodeEnabled": true,
  "complexity": {
    "score": 1.0,
    "rationale": "string from AI evaluation",
    "manualOverride": null,
    "manualOverrideNote": ""
  },
  "phases": [
    {
      "phaseId": "string",
      "hoursEstimate": 0,
      "included": true,
      "notes": ""
    }
  ],
  "tco": {
    "llmModelId": "claude-sonnet-4",
    "estimatedCallsPerDay": 100,
    "avgInputTokensPerCall": 500,
    "avgOutputTokensPerCall": 800,
    "hostingTierId": "managed-production",
    "supportContractIncluded": false
  },
  "finalPrice": 0,
  "priceOverride": null,
  "priceOverrideNote": "",
  "status": "draft"
}
```

---

## 5. Feature Specifications

### 5.1 Quote Builder Tab

**Project Details Section**
- Input fields: Project Name, Client Name, Client Contact Email
- Textarea: Project Summary (shown in proposal)
- Textarea: Requirements (used for complexity evaluation only, not shown to client)
- Toggle: Claude Code Enabled (default: on) — applies `claudeCodeEfficiency` multiplier to eligible phases

**Complexity Evaluator**
- Button: "Evaluate Complexity"
- On click: send requirements text to Anthropic API with the system prompt defined in Section 7
- Display returned score (e.g. 1.4×) and rationale text in a styled card
- Show manual override input field below AI result — numeric input 0.5–2.5 and a notes field
- Active multiplier (AI score or override) is shown prominently and applied to all calculations

**Phase Estimator**
- Display each phase from the rate card as a row
- Each row shows: phase name, description, hour range (min–max from rate card), checkbox to include/exclude, notes field
- When Claude Code is enabled, show compressed hour range for phases where `claudeCodeApplies: true`
- Claude Code compression formula: `compressedHours = baseHours * (1 - claudeCodeEfficiency)`
- All hour estimates are multiplied by the active complexity score
- Running total of hours and cost updates in real time

**Price Summary**
- Show: Total Hours (min), Total Hours (max), Estimated Cost (min), Estimated Cost (max)
- Show: Recommended Fixed Bid (midpoint + 15% contingency buffer)
- Show: Actual Margin % at recommended price vs labor cost
- Show: Target Margin indicator — green if at or above target, red if below
- Manual price override field with note
- Support contract toggle — adds monthly support cost to TCO section

**TCO Calculator**
- Select: LLM Model (from rate card)
- Input: Estimated API calls per day
- Input: Average input tokens per call
- Input: Average output tokens per call
- Auto-calculate: Monthly LLM cost (low/medium/high usage scenarios at 0.5×, 1×, 2× of estimate)
- Select: Hosting Tier (from rate card)
- Display: Monthly hosting cost range
- If On-Premises selected: show text field for estimated IT labor hours/month instead of dollar range
- Display: Monthly support contract cost (if toggled on)
- Display: **12-Month Total Cost of Ownership** — sum of all monthly costs × 12, shown as a range

**Save / Actions**
- Save Quote button — persists to `window.storage`
- New Quote button
- Load Quote — dropdown of saved quotes by project name and date
- Delete Quote

---

### 5.2 Rate Card Tab

Displayed as an editable table for each section. All edits save immediately to `window.storage`.

**Labor Rates**
- Inline editable: Hourly Rate, Blended Rate, Claude Code Efficiency (shown as % compression, stored as decimal)

**Phase Hour Ranges**
- Table with columns: Phase Name, Description, Min Hours, Max Hours, Claude Code Applies (checkbox), Include in Proposal (checkbox)
- Add row / Delete row buttons
- Changes immediately affect all open quote calculations

**LLM Pricing**
- Table with columns: Model Name, Provider, Input $/1M tokens, Output $/1M tokens
- Add row / Delete row
- Last Updated timestamp shown at top of section, updates on any edit

**Hosting Tiers**
- Table with columns: Tier Name, Description, Monthly Low ($), Monthly High ($)
- Special row for On-Premises — Monthly fields disabled, shows "Labor estimate" label
- Add row / Delete row

**Support Contract**
- Inline editable: Monthly Low, Monthly High, Description

**Target Margin**
- Single input: Target Gross Margin %

---

### 5.3 Proposal View Tab (Client-Facing)

Clean, professional layout. Contains no internal data (no hours, no margin, no complexity score rationale, no rate card values).

Sections:
1. **Header** — Project Name, Client Name, Date, prepared by agency name (editable in settings)
2. **Project Overview** — Project Summary field from quote
3. **Scope of Work** — List of included phases with name and description only (no hours)
4. **Investment** — Single fixed price (the recommended bid or manual override). No hourly breakdown.
5. **What's Included** — 14-day change window terms, break-fix terms if no support contract
6. **Monthly Cost of Ownership** — LLM cost range, hosting cost range, optional support contract. 12-month TCO total.
7. **Next Steps** — Static text: "Upon acceptance, we will schedule a kickoff meeting and begin the discovery phase."
8. **Print / Export button** — triggers `window.print()` with print-optimized CSS

---

### 5.4 Internal View Tab

Full detail view for internal use only.

Sections:
1. **Quote Summary** — all project fields, complexity score + rationale, override note if applicable
2. **Phase Breakdown** — full table: phase name, base hours, compressed hours (if Claude Code), complexity-adjusted hours, cost at hourly rate
3. **Margin Analysis** — Labor cost, quoted price, gross margin $, gross margin %, target margin, pass/fail indicator
4. **TCO Detail** — full breakdown of LLM cost calculation showing formula, all three usage scenarios, hosting, support
5. **12-Month TCO** — same as proposal but with full calculation shown

---

## 6. UI Design Requirements

- **Theme:** Dark. Background `#0d0d0f`, surface `#16161a`, accent `#e8ff47` (yellow-green)
- **Fonts:** Syne (headings, nav, labels — from Google Fonts CDN), DM Sans (body), DM Mono (numbers, code, calculated values)
- **Layout:** Fixed top navigation with four tabs. Content area below. Sidebar summary panel on Quote Builder showing live price calculation.
- **Tables:** Inline editable — click a cell to edit, tab to next. No separate edit mode.
- **Inputs:** Minimal — no heavy borders, subtle underline style
- **Numbers:** All currency formatted as USD. All large numbers use comma separators. Monthly costs show as ranges ($X – $Y).
- **Responsive:** Desktop-first. Minimum supported width 1024px.
- **Animations:** Subtle. Complexity score animates in when returned from API. Price summary updates with a brief flash on change.

---

## 7. AI Complexity Evaluator — Prompt

When the user clicks "Evaluate Complexity", send the following to `https://api.anthropic.com/v1/messages`:

**Model:** `claude-sonnet-4-20250514`  
**Max tokens:** 1000

**System prompt:**
```
You are a software project complexity evaluator for a development agency. 
Your job is to read project requirements and assign a complexity multiplier 
that will be applied to base hour estimates.

Evaluate the following signals:
- Number and complexity of third-party integrations
- Authentication and user management requirements
- Data complexity and volume
- Custom business logic vs standard CRUD operations
- Design complexity and number of distinct UI states
- Number of distinct user roles
- Real-time or performance-sensitive requirements
- Ambiguity or incompleteness in the requirements (ambiguity increases risk, raise the score)
- Regulatory or compliance requirements
- Mobile or cross-platform requirements

Return ONLY valid JSON in this exact format, no other text:
{
  "score": 1.2,
  "rationale": "Brief 2-3 sentence explanation of the score.",
  "flags": ["list", "of", "specific", "risk", "items"]
}

Score guide:
1.0 = Clean, simple, well-specified build. Standard CRUD, no integrations.
1.25 = Moderate complexity. 1-2 integrations or some custom logic.
1.5 = Significant complexity. Multiple systems, ambiguous requirements, or custom logic throughout.
2.0 = High complexity. Real-time features, complex data architecture, security-sensitive, or heavily underspecified.
2.5 = Enterprise scope. Flag this as likely exceeding a 30-day project window.
```

**User message:** The contents of the requirements textarea.

**Response handling:**
- Parse the JSON response
- Display `score` as the multiplier (e.g. "1.4×")
- Display `rationale` as explanatory text
- Display `flags` as a bulleted warning list
- If score is 2.5, show a prominent warning: "This project may exceed a 30-day window. Consider phasing the scope."
- If API call fails, show error state with retry button. Do not block the rest of the tool.

---

## 8. Calculations Reference

### Phase Hours (Claude Code off)
```
adjustedHours = ((minHours + maxHours) / 2) * complexityScore
```

### Phase Hours (Claude Code on, phase eligible)
```
compressedBase = ((minHours + maxHours) / 2) * (1 - claudeCodeEfficiency)
adjustedHours = compressedBase * complexityScore
```

### Phase Cost
```
phaseCost = adjustedHours * hourlyRate
```

### Total Labor Cost
```
totalLaborCost = sum of all included phaseCosts
```

### Recommended Fixed Bid
```
recommendedBid = totalLaborCost * 1.15
```
Round up to nearest $500.

### Gross Margin
```
grossMargin = (recommendedBid - totalLaborCost) / recommendedBid * 100
```

### Monthly LLM Cost
```
dailyInputTokens = callsPerDay * avgInputTokensPerCall
dailyOutputTokens = callsPerDay * avgOutputTokensPerCall
monthlyInputCost = (dailyInputTokens * 30 / 1000000) * inputCostPer1M
monthlyOutputCost = (dailyOutputTokens * 30 / 1000000) * outputCostPer1M
monthlyLLMCost = monthlyInputCost + monthlyOutputCost
```
Show low (0.5×), medium (1×), high (2×) scenarios.

### 12-Month TCO
```
annualLLMCost = monthlyLLMCost * 12  (use medium scenario)
annualHostingCost = ((hostingLow + hostingHigh) / 2) * 12
annualSupportCost = (supportLow + supportHigh) / 2 * 12  (if included)
totalTCO = annualLLMCost + annualHostingCost + annualSupportCost
```
Show as range using low and high inputs where applicable.

---

## 9. Storage Keys Reference

| Key | Contents |
|-----|----------|
| `devquote:ratecard` | Full rate card object |
| `devquote:quote:{uuid}` | Individual quote |
| `devquote:settings` | Agency name, logo URL, default quote settings |
| `devquote:quotelist` | Array of quote IDs and metadata for the load dropdown |

---

## 10. Settings

A small settings panel (modal or drawer, not a full tab) accessible from a gear icon in the nav.

Fields:
- Agency Name (shown in proposal header)
- Preparer Name
- Default Client Message (shown at bottom of proposal, editable per quote)

---

## 11. Out of Scope for v1.0

The following are explicitly excluded from this version:

- User authentication or multi-user support
- Email sending
- PDF generation (use print CSS instead)
- CRM integration
- Mobile layout below 1024px
- Version history for quotes
- Multi-currency support

---

## 12. Acceptance Criteria

- [ ] All four tabs render and navigate correctly
- [ ] Rate card changes immediately recalculate open quote
- [ ] Complexity evaluator calls Anthropic API and renders score, rationale, and flags
- [ ] Manual override persists and is used in calculations when set
- [ ] Claude Code toggle compresses eligible phase hours correctly
- [ ] TCO calculator shows low/medium/high LLM scenarios
- [ ] Proposal view contains no internal data
- [ ] Internal view shows full margin analysis
- [ ] All data persists across page refresh via window.storage
- [ ] Print view of proposal is clean and professional
- [ ] On-Premises hosting selection disables dollar fields and shows labor note
- [ ] Score of 2.5 triggers scope warning
- [ ] Recommended bid rounds to nearest $500
- [ ] Margin indicator is green at or above target, red below

---

*End of PRD — DevQuote v1.0*
