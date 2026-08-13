import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseAuth, db, hasFirebaseConfig } from '../services/firebase';
import { AppRole, PreviewRole, Capability, UserProfile } from '../types/security';
import { hasCapability } from '../security/capabilities';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  emailVerified: boolean;
  actualRole: AppRole | null;
  previewRole: PreviewRole;
  setPreviewRole: (role: PreviewRole) => void;
  effectiveRole: PreviewRole;
  hasEffectiveCapability: (capability: Capability) => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  isAuthenticated: false,
  isLoading: true,
  emailVerified: false,
  actualRole: null,
  previewRole: null,
  setPreviewRole: () => {},
  effectiveRole: null,
  hasEffectiveCapability: () => false,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actualRole, setActualRole] = useState<AppRole | null>(null);
  const [previewRole, setPreviewRole] = useState<PreviewRole>(null);

  useEffect(() => {
    if (!hasFirebaseConfig) {
      console.warn('Firebase is not configured. Auth will be disabled.');
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const profileDoc = await getDoc(doc(db, 'users', user.uid));
          if (profileDoc.exists()) {
            const data = profileDoc.data() as UserProfile;
            setUserProfile(data);
            setActualRole(data.role);
          } else {
            setActualRole('private_user');
            setUserProfile(null);
          }
        } catch (err) {
          console.error("Failed to load user profile:", err);
          setActualRole('private_user');
        }
      } else {
        setUserProfile(null);
        setActualRole(null);
        setPreviewRole(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    if (hasFirebaseConfig) {
      setPreviewRole(null);
      await firebaseSignOut(firebaseAuth);
    }
  };

  const effectiveRole = previewRole !== null ? previewRole : (actualRole || 'visitor');

  const hasEffectiveCapability = (capability: Capability): boolean => {
    const actualHasIt = hasCapability(actualRole, capability);
    if (previewRole) {
      const previewHasIt = hasCapability(previewRole, capability);
      return actualHasIt && previewHasIt;
    }
    return actualHasIt;
  };

  const value = {
    currentUser,
    userProfile,
    isAuthenticated: !!currentUser,
    isLoading,
    emailVerified: currentUser?.emailVerified || false,
    actualRole,
    previewRole,
    setPreviewRole,
    effectiveRole,
    hasEffectiveCapability,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
