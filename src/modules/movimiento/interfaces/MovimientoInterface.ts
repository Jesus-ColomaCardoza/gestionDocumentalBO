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
  NombreCompleto?: string;
  NombreResponsable?: object;
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

export interface MovimientoDetailsEntity {
  IdMovimiento?: number;
  HistorialMovimientoxEstado?: {
    IdHistorialMxE: number,
    FechaHistorialMxE: Date,
    Estado: {
      IdEstado: number,
      Descripcion: string
    }
  }[];
  Documento?: {
    IdDocumento: number;
    CodigoReferenciaDoc: string;
    Asunto: string;
    Folios: number;
    Visible: boolean;
    TipoDocumento: {
      Descripcion: string;
      IdTipoDocumento: number;
    };
  };
  AreaDestino?: {
    IdArea: number;
    Descripcion: string;
  };
  AreaOrigen?: {
    IdArea: number;
    Descripcion: string;
  };
  Motivo?: string;
  Acciones?: string
  FechaMovimiento?: Date;
  NombreResponsable?: string;

  Tramite?: {
    IdTramite: number;
    CodigoReferenciaTram?: string;
    Descripcion?: string;
    FechaInicio?: Date;
    FechaFin?: Date;
    Remitente?: {
      IdUsuario: number;
      Nombres: string;
      ApellidoPaterno: string;
      ApellidoMaterno: string;
      // NroIdentificacion?: string;
    };
    TipoTramite?: {
      Descripcion: string;
      IdTipoTramite: number;
    };
    Estado?: {
      Descripcion: string;
      IdEstado: number;
    };
  };
}

export interface MovimientoSeguimientoEntity {
  IdMovimiento?: number;
  IdMovimientoPadre?: number;
  HistorialMovimientoxEstado?: {
    IdHistorialMxE: number,
    FechaHistorialMxE: Date,
    Estado: {
      IdEstado: number,
      Descripcion: string
    }
  }[];
  Documento?: {
    IdDocumento: number;
    CodigoReferenciaDoc: string;
    Asunto: string;
    Folios: number;
    Visible: boolean;
    TipoDocumento: {
      Descripcion: string;
      IdTipoDocumento: number;
    };
  };
  AreaDestino?: {
    IdArea: number;
    Descripcion: string;
  };
  AreaOrigen?: {
    IdArea: number;
    Descripcion: string;
  };
  Motivo?: string;
  Acciones?: string
  FechaMovimiento?: Date;
  NombreResponsable?: string;

  Tramite?: {
    IdTramite: number;
    CodigoReferenciaTram?: string;
    Descripcion?: string;
    FechaInicio?: Date;
    FechaFin?: Date;
    Remitente?: {
      IdUsuario: number;
      Nombres: string;
      ApellidoPaterno: string;
      ApellidoMaterno: string;
      // NroIdentificacion?: string;
    };
    TipoTramite?: {
      Descripcion: string;
      IdTipoTramite: number;
    };
    Estado?: {
      Descripcion: string;
      IdEstado: number;
    };
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
export interface MovimientoSeguimiento {
  IdMovimiento?: number;
  IdTramite?: number;
}
export interface MovimientoOut {
  message: Message;
  registro?: MovimientoEntity;
}
export interface MovimientoDetailsOut {
  message: Message;
  registro?: MovimientoDetailsEntity;
}
export interface MovimientosDetailsOut {
  message: Message;
  registro?: MovimientoDetailsEntity[];
}
export interface MovimientoSeguimientoOut {
  message: Message;
  registro?: MovimientoSeguimientoEntity;
}
export interface MovimientosOut {
  message: Message;
  registro?: MovimientoEntity[];
}
