import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type SourceType = 'soviet' | 'import' | null;

interface AuthState {
  source: SourceType;
  setSource: (source: SourceType) => void;
  clearSource: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      source: null,
      setSource: (source) => set({ source }),
      clearSource: () => set({ source: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useSource = () => useAuthStore((state) => state.source);
export const useSetSource = () => useAuthStore((state) => state.setSource);
export const useClearSource = () => useAuthStore((state) => state.clearSource);