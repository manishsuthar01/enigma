# Enigma: AI Contract Risk Scanner
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/manishsuthar01/enigma)

Enigma is a web application built to provide instant, AI-powered risk analysis for legal contracts. Users can paste contract text and receive a clear, structured report that highlights potential risks, explains complex clauses in plain English, and offers actionable suggestions. This project was developed as a hackathon MVP, focusing on core functionality and a professional user experience.

## ✨ Features

*   **Paste & Scan:** A large, clean textarea for pasting contract text.
*   **AI-Powered Analysis:** Leverages the Google Gemini API to analyze legal documents for risks.
*   **Traffic Light Summary:** Provides an immediate, color-coded overall risk assessment (Red, Yellow, Green).
*   **Detailed Risk Cards:** Each identified risk is presented in a separate card detailing its severity, the issue, and a suggested mitigation.
*   **Clean & Responsive UI:** A professional and trustworthy interface built with Tailwind CSS, ensuring a great experience on desktop, tablet, and mobile devices.
*   **Subtle Animations:** Smooth, purpose-driven animations powered by GSAP provide a polished user experience without being distracting.

## 🛠️ Tech Stack

The project follows a simplified MERN-like architecture, optimized for rapid development and stability.

### Frontend
*   **Framework:** React (Vite)
*   **Styling:** Tailwind CSS
*   **Animation:** GSAP (GreenSock Animation Platform)
*   **HTTP Client:** Axios

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **AI Integration:** Google Gemini API (`@google/generative-ai`)

## 🚀 Running Locally

To get Enigma running on your local machine, follow these steps.

### Prerequisites
*   Node.js (v18 or higher)
*   npm

### 1. Backend Setup

First, set up the server which handles the AI analysis.

```bash
# 1. Navigate to the server directory
cd server

# 2. Install dependencies
npm install

# 3. Create a .env file in the /server directory
#    and add your Google Gemini API key:
echo "GEMINI_API_KEY=your_api_key_here" > .env

# 4. Start the development server
npm run dev
```
The backend server will start on `http://localhost:5000`.

### 2. Frontend Setup

Next, set up the React client.

```bash
# 1. In a new terminal, navigate to the client directory
cd client

# 2. Install dependencies
npm install

# 3. Create a .env file in the /client directory
#    to specify the backend API URL:
echo "VITE_API_URL=http://localhost:5000/api" > .env

# 4. Start the frontend development server
npm run dev
```
The frontend will be available at `http://localhost:5173` (or another port if 5173 is in use).

## ⚙️ How It Works

1.  The user pastes their contract text into the **React frontend**.
2.  On clicking "Scan Contract", the frontend sends the text via a POST request to the **Express backend** at `/api/scan`.
3.  The backend validates the input length (min 300, max 20,000 characters).
4.  The server constructs a detailed prompt, instructing the **Google Gemini API** to analyze the text and respond in a strict JSON format.
5.  The Gemini API processes the contract and returns a structured JSON object containing the `overallRisk`, `summary`, and an array of `risks`.
6.  The backend parses the AI's response and forwards the clean JSON to the frontend.
7.  The React app dynamically renders the `SummaryCard` and `RiskCard` components to display the analysis to the user.

## 📝 API

The application exposes a single API endpoint for contract analysis.

### `POST /api/scan`

Scans the provided contract text and returns a risk analysis.

**Request Body:**

```json
{
  "contractText": "The full text of the contract..."
}
```

**Success Response (200 OK):**
```json
{
  "overallRisk": "Red",
  "summary": "This contract presents a high level of risk due to one-sided liability and unfavorable payment terms.",
  "risks": [
    {
      "severity": "High",
      "title": "Unlimited Liability",
      "issue": "The clause holds you liable for any and all damages without a cap, which could be financially ruinous.",
      "suggestion": "Propose a liability cap, typically limited to the total value of the contract or a specified amount."
    },
    {
      "severity": "Medium",
      "title": "Net-90 Payment Terms",
      "issue": "The payment term of 90 days is excessively long and can cause significant cash flow problems.",
      "suggestion": "Negotiate for shorter payment terms, such as Net-30 or Net-45, to ensure timely compensation."
    }
  ]
}
```

**Error Responses:**
*   `400 Bad Request`: If `contractText` is missing or does not meet the length requirements.
*   `500 Internal Server Error`: If the Gemini API key is missing or an error occurs during AI analysis or JSON parsing.
