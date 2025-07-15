import { FilterMatchMode, FilterOperator } from "primereact/api";
import { ColumnMeta } from "../../utils/Interfaces";
import { DataTableFilterMeta } from "primereact/datatable";
import { TramiteEntity } from "../interfaces/TramiteInterface";

export const columns: ColumnMeta[] = [
  {
    field: "IdTramite",
    filterField: "IdTramite",
    header: "IdTramite",
    dataType: "numeric",
    width: "5%",
    show: true,
    filterPlaceholder: "Buscar por IdTramite",
  },
  {
    field: "Descripcion",
    filterField: "Descripcion",
    header: "Descripcion",
    dataType: "text",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por Descripcion",
  },
  {
    field: "EsquemaTramite",
    filterField: "EsquemaTramite.Descripcion",
    header: "EsquemaTramite",
    dataType: "text",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por Esquema Tramite",
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

  IdTramite: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Descripcion: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  "EsquemaTramite.Descripcion": { value: null, matchMode: FilterMatchMode.IN },
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

export let emptyTramite: TramiteEntity = {
  IdTramite: 0,
  CodigoReferencia: "",
  Asunto: "",
  Descripcion: "",
  Observaciones: "",
  FechaInicio: null,
  FechaFin: null,
  Folios: 0,
  IdTipoTramite: 0,
  TipoTramite: {
    IdTipoTramite: 0,
    Descripcion: "",
  },
  IdTipoDocumento: 0,
  TipoDocumento: {
    IdTipoDocumento: 0,
    Descripcion: "",
  },
  IdAreaEmision: 0,
  Area: {
    IdArea: 0,
    Descripcion: "",
  },
  IdEstado: 0,
  Estado: {
    IdEstado: 0,
    Descripcion: "",
  },
  IdRemitente: 0,
  Remitente: {
    IdUsuario: 0,
    Nombres: "",
    ApellidoPaterno: "",
    ApellidoMaterno: "",
  },
  Activo: true,
  CreadoEl: new Date(),
  CreadoPor: "",
  ModificadoEl: new Date(),
  ModificadoPor: "",
};
