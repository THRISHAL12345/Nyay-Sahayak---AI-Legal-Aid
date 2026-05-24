import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app = null;
let db = null;

function isConfigured() {
  return firebaseConfig.apiKey && firebaseConfig.projectId;
}

function getDb() {
  if (!isConfigured()) return null;
  if (!app) app = initializeApp(firebaseConfig);
  if (!db) db = getFirestore(app);
  return db;
}

export async function saveAnalysis(analysis, documentType, languageCode) {
  const database = getDb();
  if (!database) {
    // Fallback to localStorage
    const history = JSON.parse(localStorage.getItem('nyay-history') || '[]');
    history.unshift({
      id: Date.now().toString(),
      documentType,
      languageCode,
      verdict: analysis.overallVerdict?.rating,
      summary: analysis.summary?.plain?.slice(0, 100),
      createdAt: new Date().toISOString(),
      analysis,
    });
    // Keep only last 20
    localStorage.setItem('nyay-history', JSON.stringify(history.slice(0, 20)));
    return;
  }

  try {
    await addDoc(collection(database, 'analyses'), {
      documentType,
      languageCode,
      verdict: analysis.overallVerdict?.rating,
      summary: analysis.summary?.plain?.slice(0, 100),
      analysis: JSON.stringify(analysis),
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Failed to save to Firebase:', err);
    // Fallback to localStorage
    const history = JSON.parse(localStorage.getItem('nyay-history') || '[]');
    history.unshift({
      id: Date.now().toString(),
      documentType,
      languageCode,
      verdict: analysis.overallVerdict?.rating,
      summary: analysis.summary?.plain?.slice(0, 100),
      createdAt: new Date().toISOString(),
      analysis,
    });
    localStorage.setItem('nyay-history', JSON.stringify(history.slice(0, 20)));
  }
}

export async function getAnalysisHistory() {
  const database = getDb();
  if (!database) {
    return JSON.parse(localStorage.getItem('nyay-history') || '[]');
  }

  try {
    const q = query(collection(database, 'analyses'), orderBy('createdAt', 'desc'), limit(20));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        analysis: typeof data.analysis === 'string' ? JSON.parse(data.analysis) : data.analysis,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });
  } catch (err) {
    console.error('Failed to fetch from Firebase:', err);
    return JSON.parse(localStorage.getItem('nyay-history') || '[]');
  }
}

export { isConfigured };
