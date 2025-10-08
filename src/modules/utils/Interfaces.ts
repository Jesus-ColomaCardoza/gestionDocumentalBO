export interface ColumnMeta {
  field: string;
  filterField?: string;
  header: string;
  dataType?: "text" | "numeric" | "date" | string | undefined;
  width: string;
  show: boolean;
  filterPlaceholder?: string;
}

//message
export interface Message {
  msgId: number;
  msgTxt: string;
}

// filters
export type FilterOperator =
  | "EQ"
  | "BT"
  | "GT"
  | "LT"
  | "GE"
  | "LE"
  | "Contains"
  | "IN";
export type FilterType =
  | "date"
  | "numeric2"
  | "string"
  | "comboPlataforma"
  | "boolean"
  | "other";
export interface CreateFilter {
  campo: string;
  operador: FilterOperator;
  valor1: string;
  valor2?: string;
  tipo: FilterType;
}
export interface CombinationsFilters {
  filters: CreateFilter[];
  cantidad_max: string;
  Language: string;
}

// {
//   cantidad_max: "0",
//   Language: "ES",
//   filters: [
//     {
//       campo: "0",
//       operador: "EQ",
//       tipo: "other",
//       valor1: "",
//       valor2: "",
//     },
//   ],
// }