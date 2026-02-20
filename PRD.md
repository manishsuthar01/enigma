# Contract Risk Scanner — Hackathon MVP (20-Hour Build)

**Version:** 0.1  
**Scope:** Strict Hackathon MVP  
**Goal:** Ship a working AI contract risk analyzer in 20 hours  

---

# 1. Core Objective

Build a web app where a user:

1. Pastes contract text
2. Clicks "Scan"
3. Receives a Traffic Light Risk Report (Red / Yellow / Green)
4. Sees clearly structured risk cards

Nothing else.

No login.
No PDF.
No complex history.
No advanced law engine.
No optimization beyond basic stability.

---

# 2. Problem Statement

Freelancers sign contracts without understanding:

- Delayed payment terms
- Unlimited liability clauses
- One-sided termination rights
- IP ownership traps

They need instant, plain-English risk insight.

---

# 3. Success Criteria

The MVP is successful if:

- Contract text → structured risk report
- Response time ≤ 20 seconds
- JSON output is clean and predictable
- UI clearly displays risks
- No major runtime errors

---

# 4. Strict Feature Scope

## 4.1 Must Have (Only These)

### 1. Text Paste Input
- Large textarea
- Minimum length validation (e.g. 300 characters)
- "Scan Contract" button
- Loading state

### 2. AI Risk Analysis

The AI must return:

```json
{
  "overallRisk": "Red | Yellow | Green",
  "summary": "2-3 line explanation",
  "risks": [
    {
      "severity": "High | Medium | Low",
      "title": "Clause Name",
      "issue": "Plain English explanation",
      "suggestion": "Short counter suggestion"
    }
  ]
}