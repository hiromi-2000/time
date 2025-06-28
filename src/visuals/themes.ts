import type p5 from "p5";
import type { ParticleType } from "../particles";

export type ColorTheme = {
  name: string;
  background: string;
  palette: string[];
  particleTypes: ParticleType[];
};

export const colorThemes: ColorTheme[] = [
  {
    name: "Pastel",
    background: "#f0e6ff",
    palette: ["#6699FF", "#9D84FF", "#FF80FF", "#FFFF80", "#4DFFFF"],
    particleTypes: ["standard", "audio", "spark"],
  },
  {
    name: "Default",
    background: "#000000",
    palette: ["#FF6496", "#64C8FF", "#96FF64", "#FFC864", "#C864FF"],
    particleTypes: ["standard"],
  },
  {
    name: "Ocean",
    background: "#4682B4",
    palette: ["#64ffda", "#8892b0", "#ccd6f6", "#112240", "#b2fcfd"],
    particleTypes: ["standard", "audio", "trail"],
  },
  {
    name: "Sunset",
    background: "#5c252d",
    palette: ["#ff6b6b", "#f06543", "#ffb238", "#e43f6f", "#c81d25"],
    particleTypes: ["fire", "trail", "spark"],
  },
  {
    name: "Forest",
    background: "#1e2a26",
    palette: ["#4a7c59", "#6a994e", "#a7c957", "#f2e8cf", "#bc4749"],
    particleTypes: ["standard", "audio", "trail"],
  },
];

// トンネルの色相範囲
export const tunnelHueRanges: [number, number][] = [
  [180, 240], // Deep Ocean (Blue/Purple)
  [300, 360], // Sunset (Pink/Red)
  [120, 180], // Forest (Green/Cyan)
  [0, 60], // Fire (Red/Yellow)
  [240, 300], // Galaxy (Purple/Pink)
  [180, 240], // Cyberpunk
];

export const getThemeColors = (p: p5, theme: ColorTheme): p5.Color[] => {
  return theme.palette.map((c) => p.color(c));
};
