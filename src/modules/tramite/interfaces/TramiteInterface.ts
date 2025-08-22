import { AnexoEntity } from "../../anexo/interfaces/AnexoInterface";
import { FileManagerEntity } from "../../file-manager/interfaces/FileMangerInterface";
import { MovimientoEntity } from "../../movimiento/interfaces/MovimientoInterface";
import { Message } from "../../utils/Interfaces";

type Fecha = Date | string | null;
export interface TramiteEntity {
  IdTramite: number;
  CodigoReferenciaTram: string;
  Descripcion: string;
  Detalle: string;
  FechaInicio: Fecha;
  FechaFin: Fecha;
  IdTipoTramite: number;
  IdAreaEmision: number;
  IdRemitente: number;
  IdEstado: number;
  IdDocumento: number;
  IdArchivador: number;
  Activo: boolean;
  CreadoEl: Date;
  CreadoPor: string;
  ModificadoEl: Date;
  ModificadoPor: string;
  TipoTramite: {
    IdTipoTramite: number;
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
  Documento: {
    IdDocumento: number,
    NombreDocumento: string,
    UrlDocumento: string,
    CodigoReferenciaDoc: string,
    Asunto: string,
    Observaciones: string,
    Folios: number,
    TipoDocumento: {
      IdTipoDocumento: number,
      Descripcion: string,
    },
    Anexo: {
      IdAnexo: number,
      NombreAnexo: string,
      UrlAnexo: string,
    }[]
  },
  Archivador: {
    IdArchivador: number;
    Nombre: string;
  };

  Anexo?: {
    IdAnexo: number,
    NombreAnexo: string,
    UrlAnexo: string,
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
  //data tramite
  IdTramite?: number;
  FechaInicio: Fecha;
  IdTipoTramite: number;
  IdEstado: number;
  IdRemitente: number;
  Remitente?: {
    IdUsuario: number,
    Nombres: string,
    ApellidoPaterno: string,
    ApellidoMaterno: string,
  },
  IdAreaEmision: number;
  Area?: {
    IdArea: number;
    Descripcion: string;
  };
  Activo: boolean;
  CreadoEl?: Date;
  CreadoPor?: string;

  //data documento
  CodigoReferenciaDoc: string;
  Asunto: string;
  Observaciones: string;
  Folios: number;
  IdTipoDocumento: number;
  TipoDocumento?: {
    IdTipoDocumento: number;
    Descripcion: string;
  };

  //data others
  DigitalFiles?: FileManagerEntity[];
  TramiteDestinos?: MovimientoEntity[];
  Anexos?: AnexoEntity[]
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
