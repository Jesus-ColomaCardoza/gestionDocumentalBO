/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL_GDS: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }