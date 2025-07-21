import { Message } from "../../utils/Interfaces";

type Fecha = Date | string | null;
export interface AnexoEntity {
  IdAnexo: number;
  Titulo: string;
  FormatoAnexo?: string;
  NombreAnexo?: string;
  UrlAnexo: string;
  SizeAnexo?: number;
  UrlBase?: string;
  IdTramite?: number;
  Activo?: boolean;
  CreadoEl?: Fecha;
  CreadoPor?: string;
  ModificadoEl?: Fecha;
  ModificadoPor?: string;
}
export interface AnexoCreate {
  IdAnexo?: number;
  Titulo?: string;
  FormatoAnexo?: string;
  NombreAnexo?: string;
  UrlAnexo?: string;
  SizeAnexo?: number;
  UrlBase?: string;
  IdTramite?: number;
  Activo?: boolean;
  CreadoEl?: Date | string;
  CreadoPor?: string;
}
export interface AnexoUpdate {
  IdAnexo?: number;
  Titulo?: string;
  FormatoAnexo?: string;
  NombreAnexo?: string;
  UrlAnexo?: string;
  SizeAnexo?: number;
  UrlBase?: string;
  IdTramite?: number;
  Activo?: boolean;
  ModificadoEl?: Date | string;
  ModificadoPor?: string;
}
export interface AnexoOut {
  message: Message;
  registro?: AnexoEntity;
}
export interface AnexosOut {
  message: Message;
  registro?: AnexoEntity[];
}
