import { useColorScheme } from "react-native";
import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";

function hexToHsl(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60)        { r = c; g = x; b = 0; }
  else if (h < 120)  { r = x; g = c; b = 0; }
  else if (h < 180)  { r = 0; g = c; b = x; }
  else if (h < 240)  { r = 0; g = x; b = c; }
  else if (h < 300)  { r = x; g = 0; b = c; }
  else               { r = c; g = 0; b = x; }
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function midColorHsl(a: string, b: string): string {
  const [h1, s1, l1] = hexToHsl(a);
  const [h2, s2, l2] = hexToHsl(b);
  let dh = h2 - h1;
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  const midH = (h1 + dh / 2 + 360) % 360;
  return hslToHex(midH, (s1 + s2) / 2, (l1 + l2) / 2);
}

export function useColors() {
  const scheme = useColorScheme();
  const { activeGradient } = useTheme();

  const palette = scheme === "dark" ? colors.dark : colors.light;

  if (activeGradient) {
    const mid = midColorHsl(activeGradient.start, activeGradient.end);
    return {
      ...palette,
      radius: colors.radius,
      gradientStart: activeGradient.start,
      gradientEnd: activeGradient.end,
      gradientMid: mid,
      primary: activeGradient.start,
      accent: activeGradient.end,
    };
  }

  return { ...palette, radius: colors.radius };
}
