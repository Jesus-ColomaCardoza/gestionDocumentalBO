import { Message } from "../../utils/Interfaces";

type Fecha = Date | string | null;
export interface ArchivadorEntity {
  IdArchivador: number;
  Ano: number;
  Descripcion: string;
  Nombre: string;
  NroTramites: number;
  Activo: boolean;
  CreadoEl: Fecha;
  CreadoPor: string;
  ModificadoEl: Fecha;
  ModificadoPor: string;
}
export interface ArchivadorCreate {
  IdArchivador?: number;
  Ano: number;
  Descripcion: string;
  Nombre: string;
  NroTramites: number;
  Activo: boolean;
  CreadoEl?: Date | string;
  CreadoPor?: string;
}
export interface ArchivadorUpdate {
  IdArchivador?: number;
  Ano: number;
  Descripcion?: string;
  Nombre: string;
  NroTramites: number;
  Activo?: boolean;
  ModificadoEl?: Date | string;
  ModificadoPor?: string;
}
export interface ArchivadorOut {
  message : Message;
  registro?: ArchivadorEntity;
}
export interface ArchivadoresOut {
  message : Message;
  registro?: ArchivadorEntity[];
}