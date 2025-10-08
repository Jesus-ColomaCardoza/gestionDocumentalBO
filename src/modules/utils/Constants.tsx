export const VITE_API_URL_GDS = import.meta.env.VITE_API_URL_GDS;

export const REACT_APP_SALT = import.meta.env.REACT_APP_SALT;

export const VITE_ID_OAUTH2_GOOGLE = import.meta.env.VITE_ID_OAUTH2_GOOGLE;

export const MAX_FILE_SIZE = 2_000_000; // 2MB

export const filterBodyRequest = {
  cantidad_max: "0",
  Language: "ES",
  filters: [
    {
      campo: "0",
      operador: "",
      tipo: "",
      valor1: "",
      valor2: "",
    },
  ],
};

export const filterSpanish = {
  startsWith: "Empieza con",
  contains: "Contiene",
  notContains: "No contiene",
  endsWith: "Termina con",
  equals: "Es igual a",
  notEquals: "No es igual a",
  noFilter: "Sin filtro",
  lt: "Menor que",
  lte: "Menor o igual que",
  gt: "Mayor que",
  gte: "Mayor o igual que",
  dateIs: "Fecha es",
  dateIsNot: "Fecha no es",
  dateBefore: "Fecha antes de",
  dateAfter: "Fecha después de",
  clear: "Limpiar",
  apply: "Aplicar",
  matchAll: "Coincidir con todos",
  matchAny: "Coincidir con alguno",
  addRule: "Agregar regla",
  removeRule: "Eliminar regla",
  accept: "Sí",
  reject: "No",
  choose: "Elegir",
  upload: "Subir",
  cancel: "Cancelar",
};

export const colors = [
  "#00838F", // Cian oscuro
  "#1E88E5", // Azul
  "#8E24AA", // Púrpura
  "#F4511E", // Naranja rojizo
  "#43A047", // Verde
  "#5E35B1", // Violeta
  "#3949AB", // Azul intenso
  "#039BE5", // Celeste
  "#E53935", // Rojo
  "#00ACC1", // Turquesa
  "#00897B", // Verde azulado
  "#7CB342", // Verde lima
  "#D81B60", // Rosa fuerte
  "#C0CA33", // Amarillo verdoso
  "#FDD835", // Amarillo
  "#FB8C00", // Naranja
  "#6D4C41", // Marrón
  "#757575", // Gris
  "#546E7A", // Azul grisáceo
  "#AD1457", // Magenta oscuro
];
