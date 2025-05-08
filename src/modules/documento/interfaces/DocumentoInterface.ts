import { Message } from "../../utils/Interfaces";

type Fecha = Date | string | null;
export interface DocumentoEntity {
  IdDocumento: number;
  CodigoReferencia?: string;
  Titulo: string;
  Descripcion?: string;
  Folios?: number;
  FechaEmision: Fecha;
  FormatoDocumento?: string;
  NombreDocumento?: string;
  UrlDocumento: string;
  SizeDocumento?: number;
  UrlBase?: string;
  IdTipoDocumento?: number;
  IdTramite?: number;
  IdUsuario: number;
  FirmaDigital: boolean | null;
  IdCarpeta: number;
  Categoria: "MF" | "FA" | "FS" | undefined;
  IdEstado: number;
  Activo?: boolean;
  CreadoEl?: Fecha;
  CreadoPor?: string;
  ModificadoEl?: Fecha;
  ModificadoPor?: string;
}
export interface DocumentoCreate {
  IdDocumento?: number;
  CodigoReferencia?: string;
  Titulo?: string;
  Descripcion?: string;
  Folios?: number;
  FechaEmision?: string;
  FormatoDocumento?: string;
  NombreDocumento?: string;
  UrlDocumento?: string;
  SizeDocumento?: number;
  UrlBase?: string;
  IdTipoDocumento?: number;
  IdTramite?: number;
  IdUsuario?: number;
  FirmaDigital: boolean | null;
  IdCarpeta?: number | null ;
  Categoria: "MF" | "FA" | "FS" | undefined;
  IdEstado?: number;
  Activo?: boolean;
  CreadoEl?: Date | string;
  CreadoPor?: string;
}
export interface DocumentoUpdate {
  IdDocumento?: number;
  CodigoReferencia?: string;
  Titulo?: string;
  Descripcion?: string;
  Folios?: number;
  FechaEmision?: string;
  FormatoDocumento?: string;
  NombreDocumento?: string;
  UrlDocumento?: string;
  SizeDocumento?: number;
  UrlBase?: string;
  IdTipoDocumento?: number;
  IdTramite?: number;
  IdUsuario?: number;
  FirmaDigital?: boolean;
  IdCarpeta?: number | null ;
  Categoria?: "MF" | "FA" | "FS" | undefined;
  IdEstado?: number;
  Activo?: boolean;
  ModificadoEl?: Date | string;
  ModificadoPor?: string;
}
export interface DocumentoOut {
  message: Message;
  registro?: DocumentoEntity;
}
export interface DocumentosOut {
  message: Message;
  registro?: DocumentoEntity[];
}
