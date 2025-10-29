import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

let firebaseApp = null
/**
 * Initialize Firebase client only when the required NEXT_PUBLIC_ env vars are present.
 * Returns { configured, auth, googleProvider } where configured is a boolean.
 */
export function initFirebaseClient() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

  if (!apiKey || !authDomain || !projectId) {
    // Not configured — return a safe stub to avoid runtime crashes in the UI.
    return { configured: false, auth: null, googleProvider: null }
  }

  if (!getApps().length) {
    const config = {
      apiKey,
      authDomain,
      projectId,
      storageBucket
    }
    try {
      firebaseApp = initializeApp(config)
    } catch (err) {
      console.warn('Failed to initialize Firebase client:', err.message)
      return { configured: false, auth: null, googleProvider: null }
    }
  }

  try {
    const auth = getAuth()
    const googleProvider = new GoogleAuthProvider()
    return { configured: true, auth, googleProvider }
  } catch (err) {
    console.warn('Failed to get Firebase auth instance:', err.message)
    return { configured: false, auth: null, googleProvider: null }
  }
}
