import { FilterMatchMode, FilterOperator } from "primereact/api";
import { ColumnMeta } from "../../utils/Interfaces";
import { DataTableFilterMeta } from "primereact/datatable";
import { RolEntity} from "../interfaces/RolInterface";

export const columns: ColumnMeta[] = [
  {
    field: "IdRol",
    header: "IdRol",
    dataType: "text",
    width: "5%",
    show: true,
    filterPlaceholder: "Buscar por IdRol",
  },
  {
    field: "Descripcion",
    header: "Descripcion",
    dataType: "text",
    width: "30%",
    show: true,
    filterPlaceholder: "Buscar por Descripcion",
  },
  {
    field: "Activo",
    header: "Activo",
    dataType: "boolean",
    width: "5%",
    show: true,
    filterPlaceholder: "Buscar por Activo",
  },
  {
    field: "CreadoEl",
    header: "CreadoEl",
    dataType: "date",
    width: "15%",
    show: false,
    filterPlaceholder: "Buscar por CreadoEl",
  },
  {
    field: "CreadoPor",
    header: "CreadoPor",
    dataType: "text",
    width: "10%",
    show: false,
    filterPlaceholder: "Buscar por CreadoPor",
  },
  {
    field: "ModificadoEl",
    header: "ModificadoEl",
    dataType: "date",
    width: "15%",
    show: false,
    filterPlaceholder: "Buscar por ModificadoEl ",
  },
  {
    field: "ModificadoPor",
    header: "ModificadoPor",
    dataType: "text",
    width: "10%",
    show: false,
    filterPlaceholder: "Buscar por ModificadoPor ",
  },
];

export const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },

  IdRol: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Descripcion: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Activo: { value: null, matchMode: FilterMatchMode.EQUALS },
  CreadoEl: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
  },
  CreadoPor: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  ModificadoEl: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
  },
  ModificadoPor: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
};

export let emptyRol: RolEntity = {
  IdRol: "",
  Descripcion: "",
  Activo: true,
  CreadoEl: new Date(),
  CreadoPor: "",
  ModificadoEl: new Date() ,
  ModificadoPor: "",
};
