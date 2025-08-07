import { Message } from "../../utils/Interfaces";

type Fecha = Date | string | null;
export interface ConstanteEntity {
  IdConstante: number;
  NombreTecnico: string;
  IdGrupo: string;
  Valor: string;
  Descripcion: string;
  IdEmpresa: number;
  Activo: boolean;
  CreadoEl: Fecha;
  CreadoPor: string;
  ModificadoEl: Fecha;
  ModificadoPor: string;
}
export interface ConstanteCreate {
  IdConstante?: number;
  NombreTecnico: string;
  IdGrupo: string;
  Valor: string;
  Descripcion: string;
  IdEmpresa: number;
  Activo: boolean;
  CreadoEl?: Date | string;
  CreadoPor?: string;
}
export interface ConstanteUpdate {
  IdConstante?: number;
  NombreTecnico?: string;
  IdGrupo?: string;
  Valor?: string;
  Descripcion?: string;
  IdEmpresa?: number;
  Activo?: boolean;
  ModificadoEl?: Date | string;
  ModificadoPor?: string;
}
export interface ConstanteOut {
  message : Message;
  registro?: ConstanteEntity;
}
export interface ConstantesOut {
  message : Message;
  registro?: ConstanteEntity[];
}