export {};

declare global {
  interface Window {
    electronAPI?: {
      isElectron: true;
      writeClipboardText: (text: string) => Promise<boolean>;
    };
  }
}
