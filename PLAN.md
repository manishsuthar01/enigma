# Project Plan: Contract Risk Scanner (Hackathon MVP)

This plan outlines the steps to build a 20-hour MVP of the Contract Risk Scanner using React, Express, and the Gemini API.

## 1. Backend Implementation (Node/Express)
- [ ] **B1: Initialize Backend Project**
    - Setup `package.json`, install dependencies (`express`, `cors`, `dotenv`, `@google/generative-ai`, `nodemon`).
    - Create folder structure: `server/`, `routes/`, `controllers/`, `utils/`.
- [ ] **B2: Implement Gemini Integration**
    - Create `utils/promptTemplate.js` with structured prompt for legal risk analysis.
    - **Enforce Strict JSON**: Include instructions: "Respond ONLY in valid JSON.", "Do not include markdown.", "Do not include explanation outside JSON.", "Do not wrap in triple backticks."
    - Setup Gemini API client in `controllers/scanController.js`.
- [ ] **B3: Create Scan API Route**
    - Implement `POST /api/scan` route.
    - Add validation for minimum (300) and maximum (20,000) character length.
    - Implement error handling for AI response parsing and network issues.

## 2. Frontend Implementation (React/Vite)
- [ ] **F1: Initialize Frontend Project**
    - Create Vite project with React and Tailwind CSS.
    - Set up folder structure: `src/components`, `src/pages`, `src/services`, `src/styles`.
- [ ] **F2: Design System & Core Components**
    - Configure `tailwind.config.js` with the color system from `design.md`.
    - Create `Header.jsx`, `TextAreaInput.jsx`, and `LoadingState.jsx`.
- [ ] **F3: Results Visualization Components**
    - Create `SummaryCard.jsx` and `RiskCard.jsx` with severity-based styling (Red/Amber/Green).
- [ ] **F4: Main Page & State Management**
    - Implement `Home.jsx` to manage application state (`contractText`, `loading`, `error`, `result`).
- [ ] **F5: Animation & Polish**
    - Integrate GSAP for Hero fade-in and Results reveal (staggered cards).
    - Add responsive adjustments for mobile and tablet.

## 3. Integration & Finalization
- [ ] **I1: Connect Frontend to Backend**
    - Create `src/services/api.js` to handle fetch requests to the Express server.
- [ ] **I2: End-to-End Testing**
    - Test with short (invalid), medium, and long contracts.
    - Verify responsiveness and animation triggers.
- [ ] **I3: Cleanup & Preparation**
    - Remove console logs, optimize performance, and ensure zero layout shifts.
