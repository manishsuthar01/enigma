const ANALYSIS_PROMPT = `
Analyze the following contract for legal risks. 
Respond ONLY in valid JSON.
Do not include markdown.
Do not include explanation outside JSON.
Do not wrap in triple backticks.

The output must follow this strict schema:
{
  "overallRisk": "Red | Yellow | Green",
  "summary": "2-3 line explanation of the overall risk profile",
  "risks": [
    {
      "severity": "High | Medium | Low",
      "title": "Short title of the risk (e.g., Unlimited Liability)",
      "issue": "Plain English explanation of what is wrong",
      "suggestion": "Short counter suggestion or mitigation strategy"
    }
  ]
}

Contract text:
{contractText}
`;

module.exports = { ANALYSIS_PROMPT };
