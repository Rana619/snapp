import React, { createContext, useContext, useEffect, useState } from "react";
import chroma from "chroma-js";
import { useDispatch, useSelector } from "react-redux";
import { updateConfig } from "@/store/slices/configSlice";
import { RootState } from "@/types/store.type";

// Utility to generate all theme variables from a base color
function generateThemeVars(baseColor: string, isDark: boolean) {
  function toHSLString(color: chroma.Color): string {
    const [h, s, l] = color.hsl();
    return `${Math.round(h || 0)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  }

  return {
    "--background": isDark
      ? toHSLString(chroma(baseColor).darken(2))
      : toHSLString(chroma(baseColor).brighten(3)),
    "--foreground": isDark
      ? toHSLString(chroma(baseColor).brighten(3))
      : toHSLString(chroma(baseColor).darken(3)),
    "--muted": toHSLString(chroma(baseColor).desaturate(2).brighten(isDark ? 1 : 4)),
    "--muted-foreground": toHSLString(chroma(baseColor)
      .desaturate(2)
      .brighten(isDark ? 2 : 5)),
    "--popover": isDark
      ? toHSLString(chroma(baseColor).darken(1))
      : toHSLString(chroma(baseColor).brighten(2)),
    "--popover-foreground": isDark
      ? toHSLString(chroma(baseColor).brighten(2))
      : toHSLString(chroma(baseColor).darken(2)),
    "--card": isDark
      ? toHSLString(chroma(baseColor).darken(1.5))
      : toHSLString(chroma(baseColor).brighten(2.5)),
    "--card-foreground": isDark
      ? toHSLString(chroma(baseColor).brighten(2.5))
      : toHSLString(chroma(baseColor).darken(2.5)),
    "--border": toHSLString(chroma(baseColor).darken(isDark ? 2.5 : 0.5)),
    "--input": toHSLString(chroma(baseColor).darken(isDark ? 2.5 : 0.5)),
    "--primary": toHSLString(chroma(baseColor)),
    "--primary-foreground": chroma.contrast(baseColor, "white") > 4.5 ? "0 0% 100%" : "0 0% 0%", // #fff or #000 in HSL
    "--secondary": toHSLString(chroma(baseColor).brighten(isDark ? 1.5 : 4)),
    "--secondary-foreground": toHSLString(chroma(baseColor)
      .darken(isDark ? 3 : 0.5)),
    "--accent": toHSLString(chroma(baseColor).saturate(2)),
    "--accent-foreground": chroma(baseColor).luminance() > 0.5 ? "0 0% 0%" : "0 0% 100%", // #000 or #fff in HSL
    "--destructive": "0 84% 60%", // #dc2626 in HSL
    "--destructive-foreground": "0 0% 100%", // #fff in HSL
    "--ring": toHSLString(chroma(baseColor).brighten(isDark ? 2 : 4)),
    "--radius": "0.5rem",
    "--chart-1": toHSLString(chroma(baseColor).set("hsl.h", "+0")),
    "--chart-2": toHSLString(chroma(baseColor).set("hsl.h", "+30")),
    "--chart-3": toHSLString(chroma(baseColor).set("hsl.h", "+60")),
    "--chart-4": toHSLString(chroma(baseColor).set("hsl.h", "+90")),
    "--chart-5": toHSLString(chroma(baseColor).set("hsl.h", "+120")),
  };
}

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  console.log(context)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeColors {
  light?: string;
  dark?: string;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  themeColors?: ThemeColors;
}

export function ThemeProvider({ children, themeColors }: ThemeProviderProps) {
  const dispatch = useDispatch()
  const configData = useSelector((state: RootState) => state.config)
  const [theme, setTheme] = useState<Theme>(() => {

    const savedTheme = configData?.theme as Theme;

    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    return "light";
  });

  const toggleTheme = () => {
    const curVal = theme === "light" ? "dark" : "light"
    setTheme(curVal);
    dispatch(updateConfig({ theme: curVal }))
  };

  useEffect(() => {
    const root = document.documentElement;

    // Remove previous dynamic theme style if exists
    const oldStyle = document.getElementById("dynamic-theme-style");
    if (oldStyle) oldStyle.remove();

    // Get base colors from themeColors prop, or fallback
    const lightBase = themeColors?.light || "#f8fafc";
    const darkBase = themeColors?.dark || "#1f2937";

    // Generate CSS variable blocks
    const lightVars = generateThemeVars(lightBase, false);
    const darkVars = generateThemeVars(darkBase, true);

    // Build CSS for :root and .dark
    const lightCss = `:root {\n${Object.entries(lightVars)
      .map(([k, v]) => `  ${k}: ${v.replace("#", "")};`)
      .join("\n")}\n}`;
    const darkCss = `.dark {\n${Object.entries(darkVars)
      .map(([k, v]) => `  ${k}: ${v.replace("#", "")};`)
      .join("\n")}\n}`;

    // Inject new style
    const style = document.createElement("style");
    style.id = "dynamic-theme-style";
    style.innerHTML = `${lightCss}\n\n${darkCss}`;
    document.head.appendChild(style);


    console.log(theme)
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, themeColors]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
