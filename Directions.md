🧠 PROJECT NAME:
Ridhi.ai — Unified AI Assistant for Students

💡 CORE IDEA:
An intelligent AI assistant designed for college and school students that helps manage chats, files, notes, study materials, emails, WhatsApp content, and social reminders — all using voice commands.

The app will exist as:
- 🌐 Website (hosted on Vercel)
- 📱 Android App (via Expo → Play Store)
- 🧩 Backend API (hosted on Render)

---

⚙ TECH STACK:

*Frontend (Vercel):*
- Framework: Next.js + Expo (for hybrid web + mobile)
- UI: React Native Paper + Tailwind RN
- Voice: Browser Speech API (web) + Expo Speech/AV (mobile)
- File Uploads: Firebase Storage + Local File System (for PDFs, images)
- Authentication: Firebase Auth (Google Sign-In)
- AI APIs: Gemini + DeepSeek (used together intelligently)
- Database: Firebase Firestore
- Config: Auto environment-based URLs (localhost / Vercel / Render)

*Backend (Render):*
- Node.js + Express
- Routes for AI requests, file parsing, Gmail access, and WhatsApp file reading
- Connects to Firebase and uses environment variables for secrets
- Uses CORS to allow frontend origin (Vercel or localhost)

---

BACKGROUND -
import React from "react";
import { Vortex } from "../ui/vortex";

export function VortexDemoSecond() {
  return (
    <div
      className="w-[calc(100%-4rem)] mx-auto rounded-md  h-screen overflow-hidden">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full">
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          The hell is this?
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          This is chemical burn. It&apos;ll hurt more than you&apos;ve ever been
          burned and you&apos;ll have a scar.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
            Order now
          </button>
          <button className="px-4 py-2  text-white ">Watch trailer</button>
        </div>
      </Vortex>
    </div>
  );
}


🧩 CORE FEATURES TO IMPLEMENT:

1. *ChatGPT-style Interface*
   - Persistent weekly chat histories (“Week 1 August”, “Week 2 August”)
   - Smooth streaming replies from AI
   - Voice input button and speech output

2. *AI Engine Integration*
   - Create lib/ai.js with askGemini() and askDeepSeek() functions
   - Send both responses in parallel → merge intelligently
   - Gemini for factual, DeepSeek for creative responses

3. *File / Study Manager*
   - Upload PDFs and images
   - Store in Firebase Storage
   - AI extracts text or summaries using Gemini / DeepSeek
   - Retrieve old summaries via chat or voice command

4. *Voice Commands*
   - “Open my physics notes” → open study files
   - “Summarize my chemistry PDF” → call AI summarize endpoint
   - “Check my Gmail” → list unread emails using Gmail API
   - “Read my WhatsApp files” → scan local storage (/WhatsApp/Media/Documents)

5. *Gmail + WhatsApp Integration*
   - Gmail via Google OAuth (Firebase Auth)
   - Read, compose, and send emails through AI
   - WhatsApp local file access (mobile only, via Expo FileSystem)

6. *Adaptive Environment Config*
   - Automatically detect whether running on localhost, Vercel, or Render.
   - Read correct API and client URLs from .env.

---

🔐 ENVIRONMENT VARIABLES STRUCTURE

*Frontend (.env.local / .env.production):*