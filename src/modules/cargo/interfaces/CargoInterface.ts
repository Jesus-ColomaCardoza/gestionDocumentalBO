import { Message } from "../../utils/Interfaces";

type Fecha = Date | string | null;
export interface CargoEntity {
  IdCargo: number;
  Descripcion: string;
  Activo: boolean;
  CreadoEl: Fecha;
  CreadoPor: string;
  ModificadoEl: Fecha;
  ModificadoPor: string;
}
export interface CargoCreate {
  IdCargo?: number;
  Descripcion: string;
  Activo: boolean;
  CreadoEl?: Date | string;
  CreadoPor?: string;
}
export interface CargoUpdate {
  IdCargo?: number;
  Descripcion?: string;
  Activo?: boolean;
  ModificadoEl?: Date | string;
  ModificadoPor?: string;
}
export interface CargoOut {
  message : Message;
  registro?: CargoEntity;
}
export interface CargosOut {
  message : Message;
  registro?: CargoEntity[];
}