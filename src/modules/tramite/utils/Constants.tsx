import { FilterMatchMode, FilterOperator } from "primereact/api";
import { ColumnMeta } from "../../utils/Interfaces";
import { DataTableFilterMeta } from "primereact/datatable";
import { TramiteEntity } from "../interfaces/TramiteInterface";

export const columns: ColumnMeta[] = [
  {
    field: "IdTramite",
    filterField: "IdTramite",
    header: "Id",
    dataType: "numeric",
    width: "5%",
    show: true,
    filterPlaceholder: "Buscar por IdTramite",
  },
  //tipo documento- codigo referencia -folio
  //asunto
  {
    field: "Detalle",
    filterField: "Detalle",
    header: "Detalle",
    dataType: "text",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por Detalle",
  },
  // {
  //   field: "CodigoReferencia",
  //   filterField: "CodigoReferencia",
  //   header: "CodigoReferencia",
  //   dataType: "text",
  //   width: "20%",
  //   show: true,
  //   filterPlaceholder: "Buscar por CodigoReferencia",
  // },
  {
    field: "Remitente",
    filterField: "Remitente.NombreCompleto",
    header: "Remitente",
    dataType: "text",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por remitente",
  },
  {
    field: "Destinos",
    filterField: "Destinos",
    header: "Destinos",
    dataType: "text",
    width: "15%",
    show: true,
    filterPlaceholder: "Buscar por Destinos",
  },
  {
    field: "Area",
    filterField: "Area.Descripcion",
    header: "Area",
    dataType: "text",
    width: "15%",
    show: true,
    filterPlaceholder: "Buscar por Area",
  },
  {
    field: "FechaInicio",
    header: "Fecha Inicio",
    dataType: "date",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por FechaInicio",
  },
];

export const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  IdTramite: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Detalle: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  "Remitente.NombreCompleto": {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Destinos: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  "Area.Descripcion": { value: null, matchMode: FilterMatchMode.IN },
  FechaInicio: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
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
