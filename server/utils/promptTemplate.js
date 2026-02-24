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

const GENERATE_PROMPT = `
You are an expert legal AI assistant. Generate a legally sound {contractType} based on the following details.

Party A: {party1}
Party B: {party2}

Additional Details/Terms:
{details}

Requirements:
1. Start directly with the contract title (e.g., "{contractType}") in ALL CAPS.
2. Ensure standard clauses (Scope, Confidentiality, Liability, Term, Signatures) are included unless overridden by the details.
3. Write in professional, clear legal language.
4. Do NOT include ANY placeholders like square brackets (e.g., [Address], [State]) or blank lines (e.g., _______). If a specific detail (like an address, date, or governing law state) is not explicitly provided, omit that specific requirement entirely, use a legally safe generic wording, or simply refer to the parties by name. The contract must look finalized and ready to use based only on provided info.
5. Do NOT include any markdown formatting like bolding (**) or italics. Use ALL CAPS for section headings.
6. Use generous spacing (double newlines) between paragraphs and sections to make the document highly readable.
7. Provide ONLY the contract text. Do not add conversational filler before or after the contract.
`;

module.exports = { ANALYSIS_PROMPT, GENERATE_PROMPT };
