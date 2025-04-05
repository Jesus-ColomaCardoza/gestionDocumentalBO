import { Message } from "../../utils/Interfaces";

type Fecha = Date | string | null;
export interface TipoDocumentoEntity {
  IdTipoDocumento: number;
  Descripcion: string;
  Activo: boolean;
  CreadoEl: Fecha;
  CreadoPor: string;
  ModificadoEl: Fecha;
  ModificadoPor: string;
}
export interface TipoDocumentoCreate {
  IdTipoDocumento?: number;
  Descripcion: string;
  Activo: boolean;
  CreadoEl?: Date | string;
  CreadoPor?: string;
}
export interface TipoDocumentoUpdate {
  IdTipoDocumento?: number;
  Descripcion?: string;
  Activo?: boolean;
  ModificadoEl?: Date | string;
  ModificadoPor?: string;
}
export interface TipoDocumentoOut {
  message : Message;
  registro?: TipoDocumentoEntity;
}
export interface TipoDocumentosOut {
  message : Message;
  registro?: TipoDocumentoEntity[];
}