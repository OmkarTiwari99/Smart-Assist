# ✨ Smart-Assist — ELI5 Tutor

> Turn textbook photos into **simple, friendly explanations** — like you’re explaining it to a 5-year-old.  
> Built with React + TypeScript and integrated with Google GenAI (Gemini) for instant, structured explanations.

---

## 🚀 TL;DR
Smart-Assist (a.k.a. *ELI5 Tutor*) is a lightweight single-page app that accepts an image of textbook content (upload / drag-drop / paste), sends the image to an AI model, and returns a structured, student-friendly explanation: **The Big Idea**, **The Simple Breakdown**, and a **Check Question**. It also supports read-aloud and stores lesson history in the browser for quick review.

Live Link =   smart-assist-gamma.vercel.app
---

## 🎯 Key features
- Upload, drag-and-drop, or paste textbook images.  
- Structured AI output: *Big Idea*, *Breakdown*, *Check Question*.  
- Read-aloud (SpeechSynthesis) for accessibility.  
- Local history & simple auth (mocked via `localStorage`) for demo/demo-ready flows.  
- Dockerized for easy local deployment and preview.  

---

## 🧰 Tech stack
- Frontend: **React** + **TypeScript** (Vite driven). :contentReference[oaicite:11]{index=11}  
- AI client: `@google/genai` talking to **Gemini** (model integration and parsing logic in `services/geminiService.ts`). :contentReference[oaicite:12]{index=12}  
- Persistence (prototype): `localStorage` simulated DB (`services/db.ts`). :contentReference[oaicite:13]{index=13}  
- Containerization: **Docker** + `docker-compose` (build + Nginx static serving). :contentReference[oaicite:14]{index=14}

---

## 🏗️ How it works (high level)
1. User uploads/pastes an image in the UI. (`ImageUploader` component) :contentReference[oaicite:15]{index=15}  
2. Frontend encodes the image as base64 and calls the AI service wrapper (`analyzeImage`). The wrapper sends image + a strict system instruction to Gemini and receives a structured response. (`services/geminiService.ts`) :contentReference[oaicite:16]{index=16}  
3. The response is parsed into `TutorResponse` (bigIdea, breakdown[], checkQuestion) and rendered in `ResultDisplay`. :contentReference[oaicite:17]{index=17}  
4. For demo/demo-ready flow, the result is saved to local history via `services/db.ts`. :contentReference[oaicite:18]{index=18}

---

## ⚡ Quick start (local dev)
> **Requirements:** Node 18+, Docker (optional)

```bash
# Clone
git clone https://github.com/dev-happy02/Smart-Assist.git
cd Smart-Assist

# Install
npm install

# Run dev server (frontend)
npm run dev
# Visit http://localhost:5173 (Vite default)
