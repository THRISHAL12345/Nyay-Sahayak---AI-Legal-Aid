import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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
let auth = null;

function isConfigured() {
  return firebaseConfig.apiKey && firebaseConfig.projectId;
}

function getDb() {
  if (!isConfigured()) return null;
  if (!app) app = initializeApp(firebaseConfig);
  if (!db) db = getFirestore(app);
  return db;
}

export function getAuthInstance() {
  if (!isConfigured()) return null;
  if (!app) app = initializeApp(firebaseConfig);
  if (!auth) auth = getAuth(app);
  return auth;
}

export async function saveAnalysis(analysis, documentType, languageCode, userId = null) {
  const database = getDb();
  const currentUserId = userId || 'anonymous';

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
      userId: currentUserId,
    });
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
      userId: currentUserId,
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
      userId: currentUserId,
    });
    localStorage.setItem('nyay-history', JSON.stringify(history.slice(0, 20)));
  }
}

export async function getAnalysisHistory(userId = null) {
  const database = getDb();
  const currentUserId = userId || 'anonymous';

  if (!database) {
    return JSON.parse(localStorage.getItem('nyay-history') || '[]').filter(item => item.userId === currentUserId);
  }

  try {
    // Query items scoped to user to ensure privacy
    const q = query(
      collection(database, 'analyses'),
      where('userId', '==', currentUserId)
    );
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        analysis: typeof data.analysis === 'string' ? JSON.parse(data.analysis) : data.analysis,
        createdAt: data.createdAt?.toDate?.() || new Date(),
      };
    });

    // Client-side sort to completely bypass index configuration requirements in Google Console!
    results.sort((a, b) => b.createdAt - a.createdAt);

    return results.slice(0, 20).map(item => ({
      ...item,
      createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : new Date().toISOString()
    }));
  } catch (err) {
    console.error('Failed to fetch from Firebase:', err);
    return JSON.parse(localStorage.getItem('nyay-history') || '[]').filter(item => item.userId === currentUserId);
  }
}

export { isConfigured };
