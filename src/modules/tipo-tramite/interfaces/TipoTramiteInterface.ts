import { Message } from "../../utils/Interfaces";

type Fecha = Date | string | null;
export interface TipoTramiteEntity {
  IdTipoTramite: number;
  Descripcion: string;
  Activo: boolean;
  CreadoEl: Fecha;
  CreadoPor: string;
  ModificadoEl: Fecha;
  ModificadoPor: string;
}
export interface TipoTramiteCreate {
  IdTipoTramite?: number;
  Descripcion: string;
  Activo: boolean;
  CreadoEl?: Date | string;
  CreadoPor?: string;
}
export interface TipoTramiteUpdate {
  IdTipoTramite?: number;
  Descripcion?: string;
  Activo?: boolean;
  ModificadoEl?: Date | string;
  ModificadoPor?: string;
}
export interface TipoTramiteOut {
  message : Message;
  registro?: TipoTramiteEntity;
}
export interface TipoTramitesOut {
  message : Message;
  registro?: TipoTramiteEntity[];
}