import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  cashDeskId: number | null;
  cashDeskName: string | null;
  setCashDesk: (id: number, name: string) => void;
  clearCashDesk: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      cashDeskId: null,
      cashDeskName: null,
      setCashDesk: (cashDeskId, cashDeskName) =>
        set({ cashDeskId, cashDeskName }),
      clearCashDesk: () => set({ cashDeskId: null, cashDeskName: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useCashDeskId = () => useAuthStore((state) => state.cashDeskId);
export const useCashDeskName = () => useAuthStore((state) => state.cashDeskName);
export const useSetCashDesk = () => useAuthStore((state) => state.setCashDesk);
export const useClearCashDesk = () => useAuthStore((state) => state.clearCashDesk);
