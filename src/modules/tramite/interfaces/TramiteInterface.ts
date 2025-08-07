import { AnexoEntity } from "../../anexo/interfaces/AnexoInterface";
import { FileManagerEntity } from "../../file-manager/interfaces/FileMangerInterface";
import { MovimientoEntity } from "../../movimiento/interfaces/MovimientoInterface";
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
  IdRemitente: number;
  IdTipoTramite: number;
  IdTipoDocumento: number;
  IdAreaEmision: number;
  IdEstado: number;
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
  Remitente: {
    IdUsuario: number;
    Nombres: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
  };
  Estado: {
    IdEstado: number;
    Descripcion: string;
  };
  Anexo?: {
    IdAnexo: number,
    NombreAnexo: string,
    UrlAnexo: string,
  }[];
  Documento?: {
    IdDocumento: number,
    NombreDocumento: string,
    UrlDocumento: string,
  }[];
  Movimiento?: {
    IdMovimiento: number,
    AreaDestino: {
      Descripcion: string,
    }
  }[]
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
  Descripcion?: string;//
  Observaciones: string;
  FechaInicio: Fecha;
  FechaFin?: Fecha;//
  Folios: number;
  IdRemitente: number;
  IdTipoTramite: number;
  IdTipoDocumento: number;
  IdAreaEmision: number;
  IdEstado: number;
  Activo: boolean;
  CreadoEl?: Date;
  CreadoPor?: string;
  DigitalFiles: FileManagerEntity[];
  TramiteDestinos: MovimientoEntity[];
  Anexos: AnexoEntity[]
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
