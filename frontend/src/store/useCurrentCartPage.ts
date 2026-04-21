import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrentCartPageState {
  currentCartPage: number;
  setCurrentCartPage: (page: number) => void;
}

export const useCurrentCartPageState = create<CurrentCartPageState>()(
  persist(
    (set) => ({
      currentCartPage: 1,
      setCurrentCartPage: (page: number) => set({ currentCartPage: page }),
    }),
    {
      name: 'current-cart-page-storage',
    }
  )
);

export const useCurrentCartPage = () => useCurrentCartPageState((state) => state.currentCartPage);
export const useSetCurrentCartPage = () => useCurrentCartPageState((state) => state.setCurrentCartPage);
