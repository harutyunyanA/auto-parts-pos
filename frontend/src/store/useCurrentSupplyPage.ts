import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CurrentSupplyPageState {
  currentSupplyPage: number;
  setCurrentSupplyPage: (page: number) => void;
}

export const useCurrentSupplyPageState = create<CurrentSupplyPageState>()(
  persist(
    (set) => ({
      currentSupplyPage: 1,
      setCurrentSupplyPage: (page: number) => set({ currentSupplyPage: page }),
    }),
    {
      name: "current-supply-page-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export const useCurrentSupplyPage = () =>
  useCurrentSupplyPageState((state) => state.currentSupplyPage);
export const useSetCurrentSupplyPage = () =>
  useCurrentSupplyPageState((state) => state.setCurrentSupplyPage);
