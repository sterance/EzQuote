const {
  app,
  BrowserWindow,
  Menu,
  shell,
  ipcMain,
  clipboard,
} = require("electron");
const path = require("node:path");

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  Menu.setApplicationMenu(null);

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.session.on("will-download", (_event, item) => {
    item.setSaveDialogOptions({
      defaultPath: item.getFilename(),
      filters: [{ name: "JSON", extensions: ["json"] }],
    });
  });

  win.loadFile(
    path.join(__dirname, "..", "dist-electron-renderer", "index.html"),
  );

  if (isDev) win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("clipboard:writeText", (_event, text) => {
  clipboard.writeText(text);
  return true;
});
