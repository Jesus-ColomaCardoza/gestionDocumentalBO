import { Message } from "../../utils/Interfaces";

type Fecha = Date | string | null;
export interface RolEntity {
  IdRol: string;
  Descripcion: string;
  Activo: boolean;
  CreadoEl: Fecha;
  CreadoPor: string;
  ModificadoEl: Fecha;
  ModificadoPor: string;
}
export interface RolCreate {
  IdRol?: string;
  Descripcion: string;
  Activo: boolean;
  CreadoEl?: Date | string;
  CreadoPor?: string;
}
export interface RolUpdate {
  IdRol?: string;
  Descripcion?: string;
  Activo?: boolean;
  ModificadoEl?: Date | string;
  ModificadoPor?: string;
}
export interface RolOut {
  message : Message;
  registro?: RolEntity;
}
export interface RolesOut {
  message : Message;
  registro?: RolEntity[];
}