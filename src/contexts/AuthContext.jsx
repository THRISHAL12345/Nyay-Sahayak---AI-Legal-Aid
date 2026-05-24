import { createContext, useContext, useState, useEffect } from 'react';
import { getAuthInstance, isConfigured } from '../utils/firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuthInstance();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const loginWithGoogle = async () => {
    if (!auth) throw new Error('Firebase Authentication is not configured.');
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email, password) => {
    if (!auth) throw new Error('Firebase Authentication is not configured.');
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signupWithEmail = async (email, password) => {
    if (!auth) throw new Error('Firebase Authentication is not configured.');
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!auth) {
      setCurrentUser(null);
      return;
    }
    return signOut(auth);
  };

  const value = {
    currentUser,
    loading,
    firebaseConfigured: isConfigured(),
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
