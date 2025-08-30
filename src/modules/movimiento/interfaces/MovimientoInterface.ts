import { Message } from "../../utils/Interfaces";

type Fecha = Date | string | null;
export interface MovimientoEntity {
  IdMovimiento?: number;
  IdTramite?: number;
  IdAreaOrigen?: number;
  IdAreaDestino: number;
  FechaMovimiento?: string;
  Copia?: boolean;
  FirmaDigital?: boolean;
  IdMovimientoPadre?: number | null;
  NombreCompleto?: string ;
  NombreResponsable?: object ;
  Activo?: boolean;
  CreadoEl?: Fecha;
  CreadoPor?: string;
  ModificadoEl?: Fecha;
  ModificadoPor?: string;
  AreaOrigen?: {
    IdArea: number;
    Descripcion: string;
  };
  AreaDestino?: {
    IdArea: number;
    Descripcion: string;
  };
}
export interface MovimientoCreate {
  IdMovimiento?: number;
  IdTramite?: number;
  IdAreaOrigen?: number;
  IdAreaDestino?: number;
  FechaMovimiento?: string;
  Copia?: boolean;
  FirmaDigital?: boolean;
  IdMovimientoPadre: number | null;
  NombreResponsable?: string;
  Activo?: boolean;
  CreadoEl?: Date | string;
  CreadoPor?: string;
}
export interface MovimientoUpdate {
  IdMovimiento?: number;
  IdTramite?: number;
  IdAreaOrigen?: number;
  IdAreaDestino?: number;
  FechaMovimiento?: string;
  Copia?: boolean;
  FirmaDigital?: boolean;
  IdMovimientoPadre: number | null;
  NombreResponsable?: string;
  Activo?: boolean;
  ModificadoEl?: Date | string;
  ModificadoPor?: string;
}
export interface MovimientoOut {
  message: Message;
  registro?: MovimientoEntity;
}
export interface MovimientosOut {
  message: Message;
  registro?: MovimientoEntity[];
}
