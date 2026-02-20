# TECH STACK DOCUMENT  
# Contract Risk Scanner — Hackathon MVP  
Version: 1.0  
Architecture: Simplified MERN  
Scope: 20-Hour Build (Low Debug Risk)  

---

# 1. Architecture Overview

This project follows a **simplified MERN architecture** optimized for:

- Fast development
- Low debugging complexity
- Clear separation of concerns
- Demo-ready stability

Architecture Pattern:

Client (React)  
↓  
Express API (Node.js)  
↓  
LLM Provider (Gemini API)  
↓  
Optional MongoDB (only if time permits)

No microservices.  
No additional Python backend.  
No unnecessary infrastructure layers.

---

# 2. Frontend Stack

## 2.1 Core Framework

### React (Vite)
- Fast dev server
- Lightweight
- Minimal configuration
- Excellent DX for hackathons

Why:
- Hot reload speed
- Simple build system
- Less boilerplate than CRA

---

## 2.2 Styling

### Tailwind CSS
Utility-first CSS framework.

Why:
- No custom CSS debugging
- Faster UI building
- Consistent spacing system
- Responsive utilities built-in

Rules:
- No custom CSS files
- No heavy design frameworks
- Avoid overuse of arbitrary values

---

## 2.3 Animation

### GSAP (GreenSock)

Used only for:
- Hero fade-in
- Results reveal
- Card stagger animation
- Micro button interaction

Why GSAP:
- Production-grade animation control
- Timeline-based orchestration
- More stable than CSS-only for staged reveals

Animation Guidelines:
- No looping animations
- No heavy transforms
- No scroll hijacking
- No performance-heavy effects

---

## 2.4 State Management

- useState
- useEffect

No Redux.
No Zustand.
No context complexity.

State Scope:
- contractText
- loading
- error
- result

Keep state flat and predictable.

---

# 3. Backend Stack

## 3.1 Runtime

### Node.js

Reason:
- Unified JavaScript stack
- No context switching
- Easy integration with React

---

## 3.2 Framework

### Express.js

Single API route:

POST /api/scan

Responsibilities:
- Validate input
- Call LLM API
- Enforce structured JSON output
- Handle errors gracefully
- Return clean response

No advanced middleware layering.
No complex architecture.

---

## 3.3 AI Integration

### Gemini API (LLM Provider)

Usage:
- Single prompt template
- Strict JSON-only output
- Temperature kept low (0.2–0.3)
- Enforce structured schema

Response must match:

{
  "overallRisk": "Red | Yellow | Green",
  "summary": "string",
  "risks": []
}

Important:
- Always wrap parsing in try/catch
- If JSON parsing fails → return controlled error

---

# 4. Database Strategy

## Hackathon Mode (Recommended)

No Database.

Stateless application.
Results stored in memory only.

Reason:
- Reduces debugging time
- Removes connection issues
- No schema validation issues
- Faster deployment

---

## Optional (If Time Permits)

### MongoDB Atlas

Used only to:
- Save scans
- Retrieve past scans

Collection:
- scans

Schema:
- contractTextHash
- overallRisk
- summary
- risks
- createdAt

No complex indexing required for MVP.

---

# 5. Dev Tools

## Development

- Node 18+
- npm
- Vite
- Postman (API testing)
- Chrome DevTools

---

## Linting (Optional)

- ESLint (basic config only)
- No heavy rules

---

# 6. Deployment Strategy

## Frontend
- Vercel OR Netlify

## Backend
- Render OR Railway

Keep frontend and backend separate.

Environment Variables:

Frontend:
VITE_API_URL

Backend:
GEMINI_API_KEY

Never expose API key in frontend.

---

# 7. Folder Structure

## Frontend

src/
  components/
    Header.jsx
    TextAreaInput.jsx
    SummaryCard.jsx
    RiskCard.jsx
  pages/
    Home.jsx
  services/
    api.js
  App.jsx
  main.jsx

---

## Backend

server/
  routes/
    scan.js
  controllers/
    scanController.js
  utils/
    promptTemplate.js
  server.js

Keep structure shallow.
Avoid over-engineering.

---

# 8. Security Considerations (MVP Level)

- Validate minimum contract length
- Limit max input length (20,000 chars)
- Handle malformed JSON from AI
- Use dotenv for API keys
- Basic CORS configuration

No:
- Rate limiting
- Auth
- Encryption layer
- Advanced security middleware

This is demo-level.

---

# 9. Performance Considerations

- Keep LLM temperature low
- Avoid large unnecessary logging
- Prevent duplicate submissions
- Show loading state

Expected AI response time:
5–15 seconds

---

# 10. Risk Reduction Decisions

Removed:
- Microservices
- FastAPI
- Multi-backend architecture
- Auth system
- Complex DB logic
- PDF parsing
- Streaming responses
- WebSockets

Why:
Each removed layer reduces potential failure points.

---

# 11. Scalability (Post Hackathon)

Future upgrades:

- Add authentication
- Add MongoDB persistence
- Add user dashboard
- Add PDF upload
- Add contract comparison
- Add compliance engine
- Add subscription billing

But not in MVP.

---

# 12. Technology Summary Table

| Layer        | Technology       | Purpose |
|-------------|------------------|----------|
| Frontend    | React (Vite)     | UI rendering |
| Styling     | Tailwind CSS     | Layout & design |
| Animation   | GSAP             | Professional motion |
| Backend     | Node.js          | API runtime |
| Framework   | Express.js       | REST API |
| AI Model    | Gemini API       | Contract analysis |
| Database    | None (MVP)       | Stateless demo |
| Deployment  | Vercel + Render  | Hosting |

---

# 13. Definition of Stable Tech Stack

- Single backend
- Single AI call
- No multi-service orchestration
- No persistent storage dependency
- Minimal external libraries
- Clean, predictable JSON handling

This tech stack is optimized for:

- Hackathon reliability
- Low debugging overhead
- Professional demo quality
- Fast iteration

Ship stability over complexity.