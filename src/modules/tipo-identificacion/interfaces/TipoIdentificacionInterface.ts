import { Message } from "../../utils/Interfaces";

type Fecha = Date | string | null;
export interface TipoIdentificacionEntity {
  IdTipoIdentificacion: number;
  Descripcion: string;
  Activo: boolean;
  CreadoEl: Fecha;
  CreadoPor: string;
  ModificadoEl: Fecha;
  ModificadoPor: string;
}
export interface TipoIdentificacionCreate {
  IdTipoIdentificacion?: number;
  Descripcion: string;
  Activo: boolean;
  CreadoEl?: Date | string;
  CreadoPor?: string;
}
export interface TipoIdentificacionUpdate {
  IdTipoIdentificacion?: number;
  Descripcion?: string;
  Activo?: boolean;
  ModificadoEl?: Date | string;
  ModificadoPor?: string;
}
export interface TipoIdentificacionOut {
  message : Message;
  registro?: TipoIdentificacionEntity;
}
export interface TipoIdentificacionesOut {
  message : Message;
  registro?: TipoIdentificacionEntity[];
}