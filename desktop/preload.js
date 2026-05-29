const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getServerUrl: () => ipcRenderer.sendSync("get-server-url"),
  setServerUrl: (url) => ipcRenderer.send("set-server-url", url),
  onBackupStatus: (callback) =>
    ipcRenderer.on("backup-status", (_event, status) => callback(status)),
});
