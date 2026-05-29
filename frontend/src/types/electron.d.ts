export type BackupStatus = "running" | "done" | "error";

export interface ElectronAPI {
  getServerUrl: () => string;
  setServerUrl: (url: string) => void;
  onBackupStatus: (callback: (status: BackupStatus) => void) => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
