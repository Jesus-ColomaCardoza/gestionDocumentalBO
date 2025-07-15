import { Message } from "../../utils/Interfaces";

type Fecha = Date | string | null;
export interface TramiteEntity {
  IdTramite: number;
  CodigoReferencia: string;
  Asunto: string;
  Descripcion: string;
  Observaciones: string;
  FechaInicio: Fecha;
  FechaFin: Fecha;
  Folios: number;
  IdTipoTramite: number;
  IdTipoDocumento: number;
  IdAreaEmision: number;
  IdEstado: number;
  IdRemitente: number;
  Activo: boolean;
  CreadoEl: Date;
  CreadoPor: string;
  ModificadoEl: Date;
  ModificadoPor: string;
  TipoTramite: {
    IdTipoTramite: number;
    Descripcion: string;
  };
  TipoDocumento: {
    IdTipoDocumento: number;
    Descripcion: string;
  };
  Area: {
    IdArea: number;
    Descripcion: string;
  };
  Estado: {
    IdEstado: number;
    Descripcion: string;
  };
  Remitente: {
    IdUsuario: number;
    Nombres: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
  };
}
export interface TramiteCreate {
  IdTramite?: number;
  Descripcion: string;
  IdEsquemaTramite?: number;
  Activo: boolean;
  CreadoEl?: Date | string;
  CreadoPor?: string;
}
export interface TramiteEmitidoCreate {
  IdTramite?: number;
  CodigoReferencia: string;
  Asunto: string;
  Descripcion: string;
  Observaciones: string;
  FechaInicio: Fecha;
  FechaFin?: Fecha;
  Folios: number;
  IdTipoTramite: number;
  IdTipoDocumento: number;
  IdEstado: number;
  IdRemitente: number;
  Activo: boolean;
  CreadoEl?: Date;
  CreadoPor?: string;
}
export interface TramiteUpdate {
  IdTramite?: number;
  Descripcion?: string;
  IdEsquemaTramite?: number;
  Activo?: boolean;
  ModificadoEl?: Date | string;
  ModificadoPor?: string;
}
export interface TramiteOut {
  message: Message;
  registro?: TramiteEntity;
}
export interface TramitesOut {
  message: Message;
  registro?: TramiteEntity[];
}
