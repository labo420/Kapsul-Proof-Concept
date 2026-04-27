import { useColorScheme } from "react-native";
import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function midColor(a: string, b: string): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return rgbToHex((r1 + r2) / 2, (g1 + g2) / 2, (b1 + b2) / 2);
}

export function useColors() {
  const scheme = useColorScheme();
  const { activeGradient } = useTheme();

  const palette =
    scheme === "dark" && "dark" in colors
      ? (colors as Record<string, typeof colors.light>).dark
      : colors.light;

  if (activeGradient) {
    const mid = midColor(activeGradient.start, activeGradient.end);
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
