import { FilterMatchMode, FilterOperator } from "primereact/api";
import { ColumnMeta } from "../../utils/Interfaces";
import { DataTableFilterMeta } from "primereact/datatable";
import { UsuarioEntity } from "../interfaces/UsuarioInterface";

export const columns: ColumnMeta[] = [
  {
    field: "IdUsuario",
    filterField: "IdUsuario",
    header: "IdUsuario",
    dataType: "numeric",
    width: "5%",
    show: true,
    filterPlaceholder: "Buscar por IdUsuario",
  },
  {
    field: "Nombres",
    filterField: "Nombres",
    header: "Nombres",
    dataType: "text",
    width: "10%",
    show: true,
    filterPlaceholder: "Buscar por Nombres",
  },
  {
    field: "ApellidoPaterno",
    filterField: "ApellidoPaterno",
    header: "ApellidoPaterno",
    dataType: "text",
    width: "10%",
    show: true,
    filterPlaceholder: "Buscar por Apellido Paterno",
  },
  {
    field: "ApellidoMaterno",
    filterField: "ApellidoMaterno",
    header: "ApellidoMaterno",
    dataType: "text",
    width: "10%",
    show: true,
    filterPlaceholder: "Buscar por Apellido Materno",
  },
  {
    field: "FechaNacimiento",
    filterField: "FechaNacimiento",
    header: "FechaNacimiento",
    dataType: "date",
    width: "10%",
    show: true,
    filterPlaceholder: "Buscar por Fecha Nacimiento",
  },
  {
    field: "Email",
    filterField: "Email",
    header: "Email",
    dataType: "text",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por Email",
  },
  {
    field: "Contrasena",
    filterField: "Contrasena",
    header: "Contrasena",
    dataType: "text",
    width: "10%",
    show: false,
    filterPlaceholder: "Buscar por Contrasena",
  },
  {
    field: "Celular",
    filterField: "Celular",
    header: "Celular",
    dataType: "text",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por Celular",
  },
  {
    field: "RazonSocial",
    filterField: "RazonSocial",
    header: "RazonSocial",
    dataType: "text",
    width: "5%",
    show: false,
    filterPlaceholder: "Buscar por Razon Social",
  },
  {
    field: "TipoIdentificacion",
    filterField: "TipoIdentificacion.Descripcion",
    header: "TipoIdentificacion",
    dataType: "Text",
    width: "5%",
    show: false,
    filterPlaceholder: "Buscar por Tipo Identificacion",
  },
  {
    field: "NroIdentificacion",
    filterField: "NumeroIdentificacion",
    header: "NumeroIdentificacion",
    dataType: "text",
    width: "20%",
    show: false,
    filterPlaceholder: "Buscar por Numero Identificacion",
  },

  {
    field: "TipoUsuario",
    filterField: "TipoUsuario.Descripcion",
    header: "TipoUsuario",
    dataType: "text",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por Tipo Usuario",
  },
  {
    field: "Rol",
    filterField: "Rol.Descripcion",
    header: "Rol",
    dataType: "text",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por Rol",
  },
  {
    field: "Cargo",
    filterField: "Cargo.Descripcion",
    header: "Cargo",
    dataType: "text",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por Cargo",
  },
  {
    field: "Area",
    filterField: "Area.Descripcion",
    header: "Area",
    dataType: "text",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por Area",
  },
  {
    field: "CodigoConfirmacion",
    filterField: "CodigoConfirmacion",
    header: "CodigoConfirmacion",
    dataType: "text",
    width: "5%",
    show: true,
    filterPlaceholder: "Buscar por Codigo Confirmacion",
  },
  {
    field: "UrlBase",
    filterField: "UrlBase",
    header: "UrlBase",
    dataType: "text",
    width: "20%",
    show: true,
    filterPlaceholder: "Buscar por Url Base",
  },
  {
    field: "FormatoFotoPerfil",
    filterField: "FormatoFotoPerfil",
    header: "FormatoFotoPerfil",
    dataType: "text",
    width: "5%",
    show: false,
    filterPlaceholder: "Buscar por Formato Foto Perfil",
  },
  {
    field: "NombreFotoPerfil",
    filterField: "NombreFotoPerfil",
    header: "NombreFotoPerfil",
    dataType: "text",
    width: "15%",
    show: false,
    filterPlaceholder: "Buscar por Nombre Foto Perfil",
  },
  {
    field: "SizeFotoPerfil",
    filterField: "SizeFotoPerfil",
    header: "SizeFotoPerfil",
    dataType: "numeric",
    width: "5%",
    show: false,
    filterPlaceholder: "Buscar por Size Foto Perfil",
  },
  {
    field: "UrlFotoPerfil",
    filterField: "UrlFotoPerfil",
    header: "UrlFotoPerfil",
    dataType: "text",
    width: "15%",
    show: false,
    filterPlaceholder: "Buscar por Url Foto Perfil",
  },
  {
    field: "CodigoConfirmacionExp",
    filterField: "FormatoFotoPerfil",
    header: "FormatoFotoPerfil",
    dataType: "date",
    width: "15%",
    show: true,
    filterPlaceholder: "Buscar por Codigo Confirmacion Exp",
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

  IdUsuario: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Nombres: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  ApellidoPaterno: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  ApellidoMaterno: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  FechaNacimiento: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
  },
  Email: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Contrasena: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Celular: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Genero: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  RazonSocial: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  "TipoIdentificacion.Descripcion": {
    value: null,
    matchMode: FilterMatchMode.IN,
  },
  NroIdentificacion: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  "TipoUsuario.Descripcion": { value: null, matchMode: FilterMatchMode.IN },
  "Rol.Descripcion": { value: null, matchMode: FilterMatchMode.IN },
  "Cargo.Descripcion": { value: null, matchMode: FilterMatchMode.IN },
  "Area.Descripcion": { value: null, matchMode: FilterMatchMode.IN },

  CodigoConfirmacion: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  UrlBase: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  FormatoFotoPerfil: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  NombreFotoPerfil: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  SizeFotoPerfil: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  UrlFotoPerfil: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  CodigoConfirmacionExp: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
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

export let emptyUsuario: UsuarioEntity = {
  IdUsuario: 0,
  Nombres: "",
  ApellidoPaterno: "",
  ApellidoMaterno: "",
  FechaNacimiento: new Date(),
  Email: "",
  Contrasena: "",
  Celular: "",
  Genero: "",
  RazonSocial: "",
  IdTipoIdentificacion: 0,
  TipoIdentificacion: {
    IdTipoIdentificacion: 0,
    Descripcion: "",
  },
  NroIdentificacion: "",
  IdTipoUsuario: 0,
  TipoUsuario: {
    IdTipoUsuario: 0,
    Descripcion: "",
  },
  IdRol: "",
  Rol: {
    IdRol: "",
    Descripcion: "",
  },
  IdCargo: 0,
  Cargo: {
    IdCargo: 0,
    Descripcion: "",
  },
  IdArea: 0,
  Area: {
    IdArea: 0,
    Descripcion: "",
  },
  CodigoConfirmacion: "",
  FotoPerfilNombre: "",
  FotoPerfilBase64: "",
  CodigoConfirmacionExp: new Date(),
  Activo: true,
  CreadoEl: new Date(),
  CreadoPor: "",
  ModificadoEl: new Date(),
  ModificadoPor: "",
};
