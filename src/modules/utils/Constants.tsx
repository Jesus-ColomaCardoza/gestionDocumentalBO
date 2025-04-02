export const VITE_API_URL_GDS = import.meta.env.VITE_API_URL_GDS;

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
