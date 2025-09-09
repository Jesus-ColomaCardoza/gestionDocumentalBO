import { FilterMatchMode, FilterOperator } from "primereact/api";
import { ColumnMeta } from "../../utils/Interfaces";
import { DataTableFilterMeta } from "primereact/datatable";
import {
  TramiteEmitidoCreate,
  TramiteEntity,
  TramiteExternoRecibir,
  TramitePendienteEntity,
  TramiteRecibidoAtendidoCreate,
  TramiteRecibidoDerivadoCreate,
  TramiteRecibidoEntity,
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
    field: "Remitente",
    filterField: "Remitente.NombreCompleto",
    header: "Remitente",
    dataType: "text",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por Remitente",
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
    field: "Tpo",
    filterField: "Tpo",
    header: "Tpo",
    dataType: "text",
    width: "5%",
    show: true,
    filterPlaceholder: "Buscar por tiempo",
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

export const columnsTramiteRecibido: ColumnMeta[] = [
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
    field: "Remitente",
    filterField: "Remitente.NombreCompleto",
    header: "Remitente",
    dataType: "text",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por Remitente",
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
    field: "Tpo",
    filterField: "Tpo",
    header: "Tpo",
    dataType: "text",
    width: "5%",
    show: true,
    filterPlaceholder: "Buscar por tiempo",
  },
  {
    field: "NombreResponsable",
    filterField: "NombreResponsable",
    header: "Responsable",
    dataType: "text",
    width: "5%",
    show: true,
    filterPlaceholder: "Buscar por Responsable",
  },
  {
    field: "FechaMovimiento",
    header: "Fecha",
    dataType: "date",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por Fecha",
  },
  {
    field: "Estado",
    filterField: "Estado",
    header: "Estado",
    dataType: "text",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por Estado",
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
  "Remitente.NombreCompleto": {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Motivo_Acciones: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Tpo: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  FechaMovimiento: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
  },
};

export const defaultFiltersTramiteRecibido: DataTableFilterMeta = {
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
  "Remitente.NombreCompleto": {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Motivo_Acciones: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Tpo: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  NombreResponsable: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  FechaMovimiento: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
  },
  Estado: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
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
  IdMovimiento: 0,
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
  NombreResponsable: "",
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

export let emptyTramiteRecibido: TramiteRecibidoEntity = {
  IdMovimiento: 0,
  HistorialMovimientoxEstado: [
    {
      IdHistorialMxE: 0,
      FechaHistorialMxE: "",
      Estado: {
        IdEstado: 0,
        Descripcion: "",
      },
      // Observaciones:string,
      // Detalle:string,
    },
  ],
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
  NombreResponsable: "",
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

export let emptyTramiteRecibidoAtendidoCreate: TramiteRecibidoAtendidoCreate = {
  IdMovimiento: 0,
  
  IdRemitente: 0,
  Remitente: {
    IdUsuario: 0,
    Nombres: "",
    ApellidoPaterno: "",
    ApellidoMaterno: "",
  },

  //data documento
  Visible: false,
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
export let emptyTramiteRecibidoDerivadoCreate: TramiteRecibidoDerivadoCreate = {
  IdMovimiento: 0,
  
  IdRemitente: 0,
  Remitente: {
    IdUsuario: 0,
    Nombres: "",
    ApellidoPaterno: "",
    ApellidoMaterno: "",
  },

  //data documento
  Visible: false,
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

export let emptyTramiteExternoRecibir: TramiteExternoRecibir = {
  //data tramite
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

  //data usuario externo
  Nombres: "",
  ApellidoPaterno: "",
  ApellidoMaterno: "",
  Email: "",
  Celular: "",
  Direccion: "",
  NroIdentificacion: "",
  RUC: "",
  RazonSocial: "",
  IdTipoUsuario: 0,
  IdRol: "",
  IdTipoIdentificacion: 0,
  TipoIdentificacion: {
    IdTipoIdentificacion: 0,
    Descripcion: "",
  },
};
