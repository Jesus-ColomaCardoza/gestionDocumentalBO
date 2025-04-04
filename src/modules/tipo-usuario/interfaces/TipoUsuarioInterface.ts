import { Message } from "../../utils/Interfaces";

type Fecha = Date | string | null;
export interface TipoUsuarioEntity {
  IdTipoUsuario: number;
  Descripcion: string;
  Activo: boolean;
  CreadoEl: Fecha;
  CreadoPor: string;
  ModificadoEl: Fecha;
  ModificadoPor: string;
}
export interface TipoUsuarioCreate {
  IdTipoUsuario?: number;
  Descripcion: string;
  Activo: boolean;
  CreadoEl?: Date | string;
  CreadoPor?: string;
}
export interface TipoUsuarioUpdate {
  IdTipoUsuario?: number;
  Descripcion?: string;
  Activo?: boolean;
  ModificadoEl?: Date | string;
  ModificadoPor?: string;
}
export interface TipoUsuarioOut {
  message : Message;
  registro?: TipoUsuarioEntity;
}
export interface TipoUsuariosOut {
  message : Message;
  registro?: TipoUsuarioEntity[];
}