import { FilterMatchMode, FilterOperator } from "primereact/api";
import { ColumnMeta } from "../../utils/Interfaces";
import { DataTableFilterMeta } from "primereact/datatable";
import {
  TramiteEmitidoCreate,
  TramiteEntity,
  TramitePendienteEntity,
} from "../interfaces/TramiteInterface";

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

// tramite pendiente
export const columnsTramitePendiente: ColumnMeta[] = [
  {
    field: "IdTramite",
    filterField: "Tramite.IdTramite",
    header: "Id",
    dataType: "numeric",
    width: "5%",
    show: true,
    filterPlaceholder: "Buscar por IdTramite",
  },
  {
    field: "Detalle",
    filterField: "Detalle",
    header: "Detalle",
    dataType: "text",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por Detalle",
  },
  {
    field: "Origen",
    filterField: "Origen",
    header: "Origen",
    dataType: "text",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por Origen",
  },
  {
    field: "Motivo_Acciones",
    filterField: "Motivo_Acciones",
    header: "Motivo/Acciones",
    dataType: "text",
    width: "15%",
    show: true,
    filterPlaceholder: "Buscar por Motivo/Acciones",
  },
  {
    field: "FechaMovimiento",
    header: "Fecha",
    dataType: "date",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por Fecha",
  },
];

export const defaultFiltersTramitePendiente: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  "Tramite.IdTramite": {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Detalle: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Origen: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Motivo_Acciones: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  FechaMovimiento: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
  },
};

export let emptyTramite: TramiteEntity = {
  IdTramite: 0,
  CodigoReferenciaTram: "",
  Descripcion: "",
  Detalle: "",
  FechaInicio: null,
  FechaFin: null,
  IdTipoTramite: 0,
  TipoTramite: {
    IdTipoTramite: 0,
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
  IdDocumento: 0,
  Documento: {
    IdDocumento: 0,
    NombreDocumento: "",
    UrlDocumento: "",
    CodigoReferenciaDoc: "",
    Asunto: "",
    Observaciones: "",
    Folios: 0,
    TipoDocumento: {
      IdTipoDocumento: 0,
      Descripcion: "",
    },
    Anexo: [],
  },
  IdRemitente: 0,
  Remitente: {
    IdUsuario: 0,
    Nombres: "",
    ApellidoPaterno: "",
    ApellidoMaterno: "",
  },
  IdArchivador: 0,
  Archivador: {
    IdArchivador: 0,
    Nombre: "",
  },
  Activo: true,
  CreadoEl: new Date(),
  CreadoPor: "",
  ModificadoEl: new Date(),
  ModificadoPor: "",
};

export let emptyTramitePendiente: TramitePendienteEntity = {
  Documento: {
    IdDocumento: 0,
    CodigoReferenciaDoc: "",
    Asunto: "",
    Observaciones: "",
    Folios: 0,
    TipoDocumento: {
      IdTipoDocumento: 0,
      Descripcion: "",
    },
  },
  AreaOrigen: {
    IdArea: 0,
    Descripcion: "",
  },
  AreaDestino: {
    IdArea: 0,
    Descripcion: "",
  },
  Acciones: "",
  Motivo: "",
  FechaMovimiento: null,
  Tramite: {
    IdTramite: 0,
    CodigoReferenciaTram: "",
    Descripcion: "",
    FechaInicio: null,
    FechaFin: null,
    IdTipoTramite: 0,
    IdRemitente: 0,
    IdEstado: 0,
    IdDocumento: 0,
    TipoTramite: {
      IdTipoTramite: 0,
      Descripcion: "",
    },
    Remitente: {
      IdUsuario: 0,
      Nombres: "",
      ApellidoPaterno: "",
      ApellidoMaterno: "",
      NroIdentificacion: "",
    },
    Estado: {
      IdEstado: 0,
      Descripcion: "",
    },
    // Documento: {
    //   IdDocumento: 0,
    //   CodigoReferenciaDoc: "",
    //   Asunto: "",
    //   Observaciones: "",
    //   Folios: 0,
    //   TipoDocumento: {
    //     IdTipoDocumento: 0,
    //     Descripcion: "",
    //   },
    // },
  },
};

export let emptyTramiteEmitidoCreate: TramiteEmitidoCreate = {
  IdTramite: 0,
  FechaInicio: null,
  IdTipoTramite: 0,
  IdAreaEmision: 0,
  Area: {
    IdArea: 0,
    Descripcion: "",
  },
  IdRemitente: 0,
  Remitente: {
    IdUsuario: 0,
    Nombres: "",
    ApellidoPaterno: "",
    ApellidoMaterno: "",
  },
  IdEstado: 0,
  Activo: true,
  CreadoEl: new Date(),
  CreadoPor: "",

  //data documento
  CodigoReferenciaDoc: "",
  Asunto: "",
  Observaciones: "",
  Folios: 0,
  IdTipoDocumento: 0,
  TipoDocumento: {
    IdTipoDocumento: 0,
    Descripcion: "",
  },
};
