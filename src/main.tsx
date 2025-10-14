// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.tsx";
// import { PrimeReactProvider, addLocale } from "primereact/api";
// import { ThemeProvider } from "./ThemeContext.tsx";
// import "../node_modules/primeicons/primeicons.css"; //icons
// import "../node_modules/primeflex/primeflex.css"; // flex
// import { filterSpanish, VITE_ID_OAUTH2_GOOGLE } from "./modules/utils/Constants.tsx";
// import { GoogleOAuthProvider } from "@react-oauth/google";

// addLocale("es", filterSpanish);

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <PrimeReactProvider value={{ locale: "es", ripple: true }}>
//       <ThemeProvider>
//         <GoogleOAuthProvider clientId={`${VITE_ID_OAUTH2_GOOGLE}`}>
//           <App />
//         </GoogleOAuthProvider>
//       </ThemeProvider>
//     </PrimeReactProvider>
//   </StrictMode>
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PrimeReactProvider, addLocale } from "primereact/api";
import { ThemeProvider } from "./ThemeContext.tsx";

// IMPORTS DE ESTILOS PRIMEREACT (SOLO EL TEMA POR DEFECTO)
// import "primereact/resources/themes/lara-dark-blue/theme.css"; // Tema por defecto
import "primereact/resources/primereact.min.css"; // Estilos base
import "primeicons/primeicons.css"; // Iconos
import "primeflex/primeflex.css"; // PrimeFlex base (sin tema)
// import "primeflex/themes/primeone-dark.css"; // PrimeFlex base (sin tema)

import { filterSpanish, VITE_ID_OAUTH2_GOOGLE } from "./modules/utils/Constants.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

addLocale("es", filterSpanish);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider value={{ locale: "es", ripple: true }}>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={`${VITE_ID_OAUTH2_GOOGLE}`}>
          <App />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </PrimeReactProvider>
  </StrictMode>
);