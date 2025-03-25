import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PrimeReactProvider } from "primereact/api";
import { ThemeProvider } from "./ThemeContext.tsx";
import '../node_modules/primeicons/primeicons.css'; //icons
import '../node_modules/primeflex/primeflex.css'; // flex

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider value={{ripple:true}}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </PrimeReactProvider>
  </StrictMode>
);
