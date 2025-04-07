import { Message } from "../../utils/Interfaces";

type Fecha = Date | string | null;
export interface EstadoEntity {
  IdEstado: number;
  Descripcion: string;
  Activo: boolean;
  CreadoEl: Fecha;
  CreadoPor: string;
  ModificadoEl: Fecha;
  ModificadoPor: string;
}
export interface EstadoCreate {
  IdEstado?: number;
  Descripcion: string;
  Activo: boolean;
  CreadoEl?: Date | string;
  CreadoPor?: string;
}
export interface EstadoUpdate {
  IdEstado?: number;
  Descripcion?: string;
  Activo?: boolean;
  ModificadoEl?: Date | string;
  ModificadoPor?: string;
}
export interface EstadoOut {
  message : Message;
  registro?: EstadoEntity;
}
export interface EstadosOut {
  message : Message;
  registro?: EstadoEntity[];
}