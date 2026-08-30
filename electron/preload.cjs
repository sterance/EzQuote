const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  isElectron: true,
  writeClipboardText: (text) => ipcRenderer.invoke("clipboard:writeText", text),
});
