import { create } from 'zustand';

interface PurchasePriceState {
  activePrice: number | null;
  setActivePrice: (price: number | null) => void;
}

export const usePurchasePriceStore = create<PurchasePriceState>((set) => ({
  activePrice: null,
  setActivePrice: (price) => set({ activePrice: price }),
}));
