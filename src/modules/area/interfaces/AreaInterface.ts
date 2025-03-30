import { Message } from "../../utils/Interfaces";

type Fecha = Date | string;
export interface AreaEntity {
  IdArea: number;
  Descripcion: string;
  Activo: boolean;
  CreadoEl: Fecha;
  CreadoPor: string;
  ModificadoEl: Fecha;
  ModificadoPor: string;
}
export interface AreaCreate {
  IdArea?: number;
  Descripcion: string;
  Activo: boolean;
  CreadoEl?: Date | string;
  CreadoPor?: string;
}
export interface AreaUpdate {
  IdArea?: number;
  Descripcion?: string;
  Activo?: boolean;
  ModificadoEl?: Date | string;
  ModificadoPor?: string;
}
export interface AreaOut {
  message : Message;
  registro?: AreaEntity;
}
export interface AreasOut {
  message : Message;
  registro?: AreaEntity[];
}