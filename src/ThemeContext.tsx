import { createContext, useContext, useState, useEffect } from "react";
import { PrimeReactContext } from "primereact/api";

type ThemeContextType = {
  themePrimeReact: string;
  themePrimeFlex: string;
  switchTheme: (newThemePrimeReact: string, newThemePrimeFlex: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  themePrimeReact: "lara-dark-blue",
  themePrimeFlex: "dark",
  switchTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // variables
  const primeReact = useContext(PrimeReactContext);

  //useStates
  const [themePrimeReact, setThemePrimeReact] = useState(
    localStorage.getItem("theme-prime-react") || "lara-dark-blue"
  );
  const [themePrimeFlex, setThemePrimeFlex] = useState(
    localStorage.getItem("theme-flex-react") || "dark"
  );
  const themeLink = document.getElementById(
    "theme-prime-flex"
  ) as HTMLLinkElement;

  //functions
  const switchTheme = (
    newThemePrimeReact: string,
    newThemePrimeFlex: string
  ) => {
    if (!primeReact?.changeTheme) {
      console.error("changeTheme no está disponible todavía.");
      return;
    }

    primeReact.changeTheme(
      themePrimeReact,
      newThemePrimeReact,
      "theme-prime-react",
      () => {
        console.log(`Tema cambiado a: ${newThemePrimeReact}`);
        setThemePrimeReact(newThemePrimeReact);
        localStorage.setItem("theme-prime-react", newThemePrimeReact);

        setThemePrimeFlex(newThemePrimeFlex);
        localStorage.setItem("theme-flex-react", themePrimeFlex);
      }
    );
  };

  //useEffects
  useEffect(() => {
    if (primeReact?.changeTheme) {
      primeReact.changeTheme(
        "lara-dark-blue",
        themePrimeReact,
        "theme-prime-react",
        () => {}
      );
    }
  }, [primeReact]);

  useEffect(() => {
    themeLink.href = `/themes/themesprimeflex/primeone-${themePrimeFlex}.css`;
    setThemePrimeFlex(themePrimeFlex);
    localStorage.setItem("theme-flex-react", themePrimeFlex);
  }, [themePrimeFlex]);

  return (
    <ThemeContext.Provider
      value={{ themePrimeReact, themePrimeFlex, switchTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
