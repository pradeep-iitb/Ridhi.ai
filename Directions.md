🧠 PROJECT NAME:
Ridhi.ai — Unified AI Assistant for Students

💡 CORE IDEA:
An intelligent AI assistant designed for college and school students that helps manage chats, files, notes, study materials, emails, WhatsApp content, and social reminders — all using voice commands.

Pages-
Login page with animated bg on left and blur glass div with login schematics with usename and password also with sign in and login with google 

Real chat app with weekwise history message chat and voice chat like chatgpt for logo use the lucid origin cret image in the folder in navbar there will be a toggle switch for history Logo in the middle and log out and upgrade to premium on right . drag and drop feature for uploading along with upload button , therefore it should resemble chatgpt page 

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

ENV
########################################
# Ridhi.ai Backend environment example
# Copy to .env and fill with your secrets
########################################

# Server
PORT=4000

# Firebase (if you use Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyAZlKw4_-aXIzV3agzbRgpdxYEIEBpFaPA",
  authDomain: "ridhiaiproject.firebaseapp.com",
  projectId: "ridhiaiproject",
  storageBucket: "ridhiaiproject.firebasestorage.app",
  messagingSenderId: "476510178597",
  appId: "1:476510178597:web:bded871d1a7adf9d329ecc",
  measurementId: "G-E43QLV0D42"
};

# AI APIs
GEMINI_API_KEY=AIzaSyBeI5lJjxvHpPgU9uOhLyScDVUKc6kjjyI
DEEPSEEK_API_KEY=sk-adf8e40b351c4dfb8aeb776121d89688

# OAuth / Google
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

Redirected URI = http://localhost:3000/api/auth/callback/google
Redirected URI = https://ridhi-ai.vercel.app/api/auth/callback/google


# Other service endpoints / URIs
BACKEND_PUBLIC_URL=http://localhost:4000
FRONTEND_PUBLIC_URL=http://localhost:3000

---
Background for login page
npm install three postprocessing

Usage
import Hyperspeed from './Hyperspeed';

// the component will fill the height/width of its parent container, edit the CSS to change this
// the options below are the default values

<Hyperspeed
  effectOptions={{
    onSpeedUp: () => { },
    onSlowDown: () => { },
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 4,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.03, 400 * 0.2],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0xFFFFFF,
      brokenLines: 0xFFFFFF,
      leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
      rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
      sticks: 0x03B3C3,
    }
  }}
/>

BACKGROUND for app - simple and minimilistic
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