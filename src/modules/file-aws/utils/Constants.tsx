import { FilterMatchMode, FilterOperator } from "primereact/api";
import { ColumnMeta } from "../../utils/Interfaces";
import { DataTableFilterMeta } from "primereact/datatable";
import {
  FileManagerAwsEntity,
} from "../interfaces/FileAwsInterface";

export const columns: ColumnMeta[] = [
  {
    field: "IdFM",
    filterField: "IdFM",
    header: "IdFM",
    dataType: "text",
    width: "10%",
    show: false,
    filterPlaceholder: "Buscar por IdFM",
  },
  {
    field: "Descripcion",
    filterField: "Descripcion",
    header: "Descripcion",
    dataType: "text",
    width: "35%",
    show: true,
    filterPlaceholder: "Buscar por Descripcion",
  },
  // {
  //   field: "Estado",
  //   filterField: "Estado.Descripcion",
  //   header: "Estado",
  //   dataType: "text",
  //   width: "10%",
  //   show: true,
  //   filterPlaceholder: "Buscar por Estado",
  // },
  {
    field: "FechaEmision",
    filterField: "FechaEmision",
    header: "FechaEmision",
    dataType: "date",
    width: "10%",
    show: true,
    filterPlaceholder: "Buscar por Fecha",
  },
];

export const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },

  IdFM: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Descripcion: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
  },
  // "Estado.Descripcion": {
  //   value: null,
  //   // value: ["Nuevo", "Sin Firmar", "Firmado", null], //revisar to modal
  //   matchMode: FilterMatchMode.IN,
  // },
  FechaEmision: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
  },
};

export let emptyFileManagerAws: FileManagerAwsEntity = {
  IdFM: "",
  Descripcion: "",
  FechaEmision: new Date(),
  UrlFM: "",
  Estado: {
    IdEstado: 0,
    Descripcion: "",
  },
};
