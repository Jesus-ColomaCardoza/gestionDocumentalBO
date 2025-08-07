import { FilterMatchMode, FilterOperator } from "primereact/api";
import { ColumnMeta } from "../../utils/Interfaces";
import { DataTableFilterMeta } from "primereact/datatable";
import { ConstanteEntity} from "../interfaces/ConstanteInterface";

export const columns: ColumnMeta[] = [
  {
    field: "IdConstante",
    header: "IdConstante",
    dataType: "numeric",
    width: "5%",
    show: true,
    filterPlaceholder: "Buscar por IdConstante",
  },
  {
    field: "NombreTecnico",
    header: "NombreTecnico",
    dataType: "text",
    width: "10%",
    show: true,
    filterPlaceholder: "Buscar por NombreTecnico",
  },
  {
    field: "IdGrupo",
    header: "IdGrupo",
    dataType: "text",
    width: "5%",
    show: true,
    filterPlaceholder: "Buscar por IdGrupo",
  },
  {
    field: "Valor",
    header: "Valor",
    dataType: "text",
    width: "5%",
    show: true,
    filterPlaceholder: "Buscar por Valor",
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
    field: "IdEmpresa",
    header: "IdEmpresa",
    dataType: "numeric",
    width: "10%",
    show: true,
    filterPlaceholder: "Buscar por IdEmpresa",
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

  IdConstante: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  NombreTecnico: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
  },
  IdGrupo: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  Valor: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
  },
  Descripcion: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  IdEmpresa: {
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

export let emptyConstante: ConstanteEntity = {
  IdConstante: 0,
  NombreTecnico: "",
  IdGrupo: "",
  Valor: "",
  Descripcion: "",
  IdEmpresa: 0,
  Activo: true,
  CreadoEl: new Date(),
  CreadoPor: "",
  ModificadoEl: new Date() ,
  ModificadoPor: "",
};
