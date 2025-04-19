import { FilterMatchMode, FilterOperator } from "primereact/api";
import { ColumnMeta } from "../../utils/Interfaces";
import { DataTableFilterMeta } from "primereact/datatable";
import { FileManagerEntity } from "../interfaces/FileMangerInterface";
import { CarpetaEntity } from "../../carpeta/interfaces/CarpetaInterface";

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
    width: "40%",
    show: true,
    filterPlaceholder: "Buscar por Descripcion",
  },
  {
    field: "Usuario",
    filterField: "Usuario.NombreCompleto",
    header: "Usuario",
    dataType: "text",
    width: "40%",
    show: true,
    filterPlaceholder: "Buscar por Usuario",
  },
  {
    field: "Estado",
    filterField: "Estado.Descripcion",
    header: "Estado",
    dataType: "text",
    width: "10%",
    show: true,
    filterPlaceholder: "Buscar por Estado",
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
  "Usuario.NombreCompleto": {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
  },
  "Estado.Descripcion": {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
  },
};

export let emptyFileManager: FileManagerEntity = {
  IdFM: "",
  Descripcion: "",
  FechaEmision: new Date(),
  UrlFM: "",
  FirmaDigital: null,
  Activo:false,
  Usuario: {
    IdUsuario: 0,
    Nombres: "",
    ApellidoPaterno: "",
    ApellidoMaterno: "",
    Area: {
      IdArea: 0,
      Descripcion: "",
    },
  },
  Estado: {
    IdEstado: 0,
    Descripcion: "",
  },
  Carpeta: {
    IdCarpeta: 0,
    Descripcion: "",
  },
};
