import React, { createContext, useContext, useState } from "react";

export interface ActiveGradient {
  start: string;
  end: string;
}

interface ThemeContextType {
  activeGradient: ActiveGradient | null;
  setActiveGradient: (g: ActiveGradient | null) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  activeGradient: null,
  setActiveGradient: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeGradient, setActiveGradient] = useState<ActiveGradient | null>(null);

  return (
    <ThemeContext.Provider value={{ activeGradient, setActiveGradient }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
