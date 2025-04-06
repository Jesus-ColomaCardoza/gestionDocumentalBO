import { Message } from "../../utils/Interfaces";

type Fecha = Date | string | null;
export interface EsquemaEstadoEntity {
  IdEsquemaEstado: number;
  Descripcion: string;
  Activo: boolean;
  CreadoEl: Fecha;
  CreadoPor: string;
  ModificadoEl: Fecha;
  ModificadoPor: string;
}
export interface EsquemaEstadoCreate {
  IdEsquemaEstado?: number;
  Descripcion: string;
  Activo: boolean;
  CreadoEl?: Date | string;
  CreadoPor?: string;
}
export interface EsquemaEstadoUpdate {
  IdEsquemaEstado?: number;
  Descripcion?: string;
  Activo?: boolean;
  ModificadoEl?: Date | string;
  ModificadoPor?: string;
}
export interface EsquemaEstadoOut {
  message : Message;
  registro?: EsquemaEstadoEntity;
}
export interface EsquemaEstadosOut {
  message : Message;
  registro?: EsquemaEstadoEntity[];
}