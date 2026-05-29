import { create } from "zustand";

interface ServerState {
  serverUrl: string;
  setServerUrl: (url: string) => void;
}

function readInitial(): string {
  return window.electronAPI?.getServerUrl?.() || "";
}

export const useServerStore = create<ServerState>((set) => ({
  serverUrl: readInitial(),
  setServerUrl: (url: string) => {
    window.electronAPI?.setServerUrl?.(url);
    set({ serverUrl: url });
  },
}));

export const useServerUrl = () => useServerStore((state) => state.serverUrl);
export const useSetServerUrl = () => useServerStore((state) => state.setServerUrl);
