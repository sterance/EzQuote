export type ThemeOption = {
  label: string;
  pageBg: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
  navBg: string;
  navText: string;
};

export const LIGHT_THEMES: ThemeOption[] = [
  {
    label: "Sky",
    pageBg: "#f1f3f4",
    surface: "#f9fafa",
    surfaceMuted: "#e5e9eb",
    text: "#263540",
    textMuted: "#60707b",
    border: "#bec8cf",
    accent: "#0284c7",
    navBg: "#0c4a6e",
    navText: "#f0f3f4",
  },
  {
    label: "Ocean",
    pageBg: "#f1f2f4",
    surface: "#f9fafa",
    surfaceMuted: "#e5e8eb",
    text: "#263140",
    textMuted: "#606b7b",
    border: "#bec5cf",
    accent: "#2563eb",
    navBg: "#1e3a5f",
    navText: "#f0f2f4",
  },
  {
    label: "Forest",
    pageBg: "#f1f4f2",
    surface: "#f9fafa",
    surfaceMuted: "#e5ebe7",
    text: "#26402f",
    textMuted: "#607b69",
    border: "#becfc4",
    accent: "#16a34a",
    navBg: "#14532d",
    navText: "#f0f4f2",
  },
  {
    label: "Royal",
    pageBg: "#f2f1f4",
    surface: "#faf9fa",
    surfaceMuted: "#e7e5eb",
    text: "#2f2640",
    textMuted: "#69607b",
    border: "#c4becf",
    accent: "#7c3aed",
    navBg: "#312e81",
    navText: "#f2f0f4",
  },
  {
    label: "Rose",
    pageBg: "#f4f1f2",
    surface: "#faf9fa",
    surfaceMuted: "#ebe5e8",
    text: "#402633",
    textMuted: "#7b606e",
    border: "#cfbec7",
    accent: "#db2777",
    navBg: "#500724",
    navText: "#f4f0f2",
  },
  {
    label: "Sunset",
    pageBg: "#f4f2f1",
    surface: "#fafaf9",
    surfaceMuted: "#ebe7e5",
    text: "#402f26",
    textMuted: "#7b6960",
    border: "#cfc4be",
    accent: "#d95d39",
    navBg: "#173b40",
    navText: "#f4f2f0",
  },
  {
    label: "Ember",
    pageBg: "#f4f2f1",
    surface: "#fafaf9",
    surfaceMuted: "#ebe8e5",
    text: "#403126",
    textMuted: "#7b6b60",
    border: "#cfc5be",
    accent: "#ea580c",
    navBg: "#7c2d12",
    navText: "#f4f2f0",
  },
  {
    label: "Cyan",
    pageBg: "#f1f3f4",
    surface: "#f9fafa",
    surfaceMuted: "#e5eaeb",
    text: "#263b40",
    textMuted: "#60767b",
    border: "#becdcf",
    accent: "#0891b2",
    navBg: "#164e63",
    navText: "#f0f4f4",
  },
  {
    label: "Mustard",
    pageBg: "#f4f3f1",
    surface: "#fafaf9",
    surfaceMuted: "#ebeae5",
    text: "#403b26",
    textMuted: "#7b7660",
    border: "#cfccbe",
    accent: "#ca8a04",
    navBg: "#422006",
    navText: "#f4f3f0",
  },
  {
    label: "Mint",
    pageBg: "#f1f4f3",
    surface: "#f9fafa",
    surfaceMuted: "#e5ebe9",
    text: "#264036",
    textMuted: "#607b71",
    border: "#becfc9",
    accent: "#059669",
    navBg: "#064e3b",
    navText: "#f0f4f3",
  },
];

export const DARK_THEMES: ThemeOption[] = [
  {
    label: "Sky",
    pageBg: "#13181b",
    surface: "#1d252a",
    surfaceMuted: "#262f36",
    text: "#e5e9eb",
    textMuted: "#a9b4bc",
    border: "#313f49",
    accent: "#38bdf8",
    navBg: "#082f49",
    navText: "#e5e9eb",
  },
  {
    label: "Ocean",
    pageBg: "#13161b",
    surface: "#1d232a",
    surfaceMuted: "#262d36",
    text: "#e5e8eb",
    textMuted: "#a9b1bc",
    border: "#313b49",
    accent: "#60a5fa",
    navBg: "#0f172a",
    navText: "#e5e8eb",
  },
  {
    label: "Forest",
    pageBg: "#131b16",
    surface: "#1d2a22",
    surfaceMuted: "#26362b",
    text: "#e5ebe7",
    textMuted: "#a9bcaf",
    border: "#314939",
    accent: "#4ade80",
    navBg: "#052e16",
    navText: "#e5ebe7",
  },
  {
    label: "Royal",
    pageBg: "#16131b",
    surface: "#221d2a",
    surfaceMuted: "#2b2636",
    text: "#e7e5eb",
    textMuted: "#afa9bc",
    border: "#393149",
    accent: "#a78bfa",
    navBg: "#1e1b4b",
    navText: "#e7e5eb",
  },
  {
    label: "Rose",
    pageBg: "#1b1317",
    surface: "#2a1d24",
    surfaceMuted: "#36262e",
    text: "#ebe5e8",
    textMuted: "#bca9b2",
    border: "#49313d",
    accent: "#f472b6",
    navBg: "#3f0765",
    navText: "#ebe5e8",
  },
  {
    label: "Sunset",
    pageBg: "#1b1613",
    surface: "#2a221d",
    surfaceMuted: "#362b26",
    text: "#ebe7e5",
    textMuted: "#bcafa9",
    border: "#493931",
    accent: "#f28a5f",
    navBg: "#0b1519",
    navText: "#ebe7e5",
  },
  {
    label: "Ember",
    pageBg: "#1b1613",
    surface: "#2a231d",
    surfaceMuted: "#362d26",
    text: "#ebe8e5",
    textMuted: "#bcb1a9",
    border: "#493b31",
    accent: "#fb923c",
    navBg: "#431407",
    navText: "#ebe8e5",
  },
  {
    label: "Cyan",
    pageBg: "#131a1b",
    surface: "#1d282a",
    surfaceMuted: "#263336",
    text: "#e5eaeb",
    textMuted: "#a9b9bc",
    border: "#314549",
    accent: "#22d3ee",
    navBg: "#083344",
    navText: "#e5eaeb",
  },
  {
    label: "Mustard",
    pageBg: "#1b1913",
    surface: "#2a281d",
    surfaceMuted: "#363326",
    text: "#ebeae5",
    textMuted: "#bcb8a9",
    border: "#494531",
    accent: "#facc15",
    navBg: "#1c1400",
    navText: "#ebeae5",
  },
  {
    label: "Mint",
    pageBg: "#131b18",
    surface: "#1d2a25",
    surfaceMuted: "#263630",
    text: "#e5ebe9",
    textMuted: "#a9bcb5",
    border: "#314940",
    accent: "#34d399",
    navBg: "#022c22",
    navText: "#e5ebe9",
  },
];

export function applyThemeVars(isDark: boolean, index: number) {
  const themes = isDark ? DARK_THEMES : LIGHT_THEMES;
  const safeIndex = Math.max(0, Math.min(index, themes.length - 1));
  const theme = themes[safeIndex];
  const root = document.documentElement.style;
  root.setProperty("--page-bg", theme.pageBg);
  root.setProperty("--surface", theme.surface);
  root.setProperty("--surface-muted", theme.surfaceMuted);
  root.setProperty("--text", theme.text);
  root.setProperty("--text-muted", theme.textMuted);
  root.setProperty("--border", theme.border);
  root.setProperty("--accent", theme.accent);
  root.setProperty("--nav-bg", theme.navBg);
  root.setProperty("--nav-text", theme.navText);
}
