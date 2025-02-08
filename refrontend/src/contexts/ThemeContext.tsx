import React, { createContext, useContext, useState } from "react";

type ThemeContextProps = {
  children: React.ReactNode;
};

const ThemeContext = createContext<
  { currentTheme: string; toggleTheme: () => void } | undefined
>(undefined);

export const ThemeContextProvider = ({ children }: ThemeContextProps) => {
  const [currentTheme, setCurrentTheme] = useState<string>("dark");
  const toggleTheme = () => {
    setCurrentTheme(currentTheme === "dark" ? "light" : "dark");
  };
  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useThemeContext must be used within a ThemeContextProvider"
    );
  }
  return context;
};

export default ThemeContext;
