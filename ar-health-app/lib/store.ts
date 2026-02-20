import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Language = 'en' | 'hi' | 'ta';
export type EmergencyType = 'cpr' | 'choking' | 'bleeding' | 'burns';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AppState {
  user: User | null;
  language: Language;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLanguage: (lang: Language) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      language: 'en',
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLanguage: (lang) => set({ language: lang }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'ar-health-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
