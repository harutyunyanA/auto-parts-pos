const { app, BrowserWindow, ipcMain, session, dialog } = require("electron");
const path = require("path");
const Store = require("electron-store");

const store = new Store();

ipcMain.on("get-server-url", (event) => {
  event.returnValue = store.get("serverUrl", "");
});

ipcMain.on("set-server-url", (_event, url) => {
  store.set("serverUrl", url);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    win.loadURL(devServerUrl);
  } else {
    const indexPath = app.isPackaged
      ? path.join(process.resourcesPath, "renderer", "index.html")
      : path.join(__dirname, "..", "frontend", "dist", "index.html");
    win.loadFile(indexPath);
  }

  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }

  win.on("close", (e) => {
    if (win.__backupDone) return;
    e.preventDefault();
    runBackupBeforeClose(win);
  });
}

async function runBackupBeforeClose(win) {
  const serverUrl = store.get("serverUrl", "");
  win.webContents.send("backup-status", "running");

  let ok = false;
  if (serverUrl) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 60000);
      const res = await fetch(`${serverUrl}/backup`, {
        method: "POST",
        signal: controller.signal,
      });
      clearTimeout(timer);
      ok = res.ok;
    } catch {
      ok = false;
    }
  }

  if (!ok) {
    await dialog.showMessageBox(win, {
      type: "warning",
      buttons: ["Закрыть"],
      title: "Резервная копия",
      message: "Не удалось создать резервную копию базы данных",
      detail:
        "Сервер недоступен или произошла ошибка. Приложение будет закрыто.",
    });
  }

  win.__backupDone = true;
  win.close();
}

app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self' 'unsafe-inline' data: blob: file: http: https:; connect-src 'self' http: https: ws: wss:;",
        ],
      },
    });
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
