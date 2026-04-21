import { create } from 'zustand';
import dayjs, { Dayjs } from 'dayjs';

interface DateState {
  currentDate: string;
  setCurrentDate: (date: Dayjs) => void;
  resetDate: () => void;
}

export const useDateStore = create<DateState>((set) => ({
  currentDate: dayjs().format("YYYY-MM-DD"),
  setCurrentDate: (date) => set({ currentDate: date.format("YYYY-MM-DD") }),
  resetDate: () => set({ currentDate: dayjs().format("YYYY-MM-DD") }),
}));

// Selectors
export const useCurrentDate = () => useDateStore((state) => state.currentDate);
export const useSetCurrentDate = () => useDateStore((state) => state.setCurrentDate);
export const useResetDate = () => useDateStore((state) => state.resetDate);
