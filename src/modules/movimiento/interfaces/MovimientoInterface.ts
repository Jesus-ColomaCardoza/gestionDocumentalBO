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

// export type TramiteNode = {
//   Area: {
//     IdArea: number;
//     Descripcion: string;
//   };
//   FechaInicio: Date;
// }

export type MovimientoNode = {
  Tramite: {
    IdTramite: number;
    Area: {
      IdArea: number;
      Descripcion: string;
    };
    FechaInicio: Date;
    TipoTramite?: {
      Descripcion: string;
      IdTipoTramite: number;
    };
    Remitente: {
      IdUsuario: number,
      Nombres: string,
      ApellidoPaterno: string,
      ApellidoMaterno: string,
      NroIdentificacion: string,
    },
  }
  Documento?: {
    CreadoEl: Date
    IdDocumento: number
    Folios: number
    Asunto: string
    CodigoReferenciaDoc: string
    Visible: boolean
    TipoDocumento: {
      Descripcion: string
      IdTipoDocumento: number
    }
  }
  AreaOrigen?: {
    IdArea: number,
    Descripcion: string,
  },
  AreaDestino?: {
    IdArea: number,
    Descripcion: string,
  },
  IdMovimiento?: number
  FechaMovimiento?: Date
  IdMovimientoPadre?: number
  NombreResponsable?: string
  Acciones?: string
  Motivo?: string
  FirmaDigital?: boolean,
  Copia?: boolean,
  HistorialMovimientoxEstado?: {
    Estado: {
      Descripcion: string
      IdEstado: number
    };
    IdHistorialMxE: number
    FechaHistorialMxE: Date
  }[],
  Children?: MovimientoNode[]
}

export interface MovimientoSeguimientoEntity {
  Tramite: {
    IdTramite: number;
    Area: {
      IdArea: number;
      Descripcion: string;
    };
    FechaInicio: Date;
    TipoTramite?: {
      Descripcion: string;
      IdTipoTramite: number;
    };
    Remitente: {
      IdUsuario: number,
      Nombres: string,
      ApellidoPaterno: string,
      ApellidoMaterno: string,
      NroIdentificacion: string,
    },
    Movimiento: {
      Documento: {
        CreadoEl: Date;
        IdDocumento: number;
        Folios: number;
        Asunto: string;
        CodigoReferenciaDoc: string;
        Visible: boolean;
        TipoDocumento: {
          Descripcion: string;
          IdTipoDocumento: number;
        };
      };
      IdMovimiento: number;
      FechaMovimiento: Date;
      IdMovimientoPadre: number;
      NombreResponsable: string;
      Acciones: string;
      Motivo: string;
      HistorialMovimientoxEstado: {
        Estado: {
          Descripcion: string;
          IdEstado: number;
        };
        IdHistorialMxE: number;
        FechaHistorialMxE: Date;
      }[];
      AreaDestino: {
        IdArea: number;
        Descripcion: string;
      };
      AreaOrigen: {
        IdArea: number;
        Descripcion: string;
      };
    }[];
  }

  Movimiento: {
    IdMomiento: number;
    Asunto: string;
  }

  Seguimiento: MovimientoNode[]

  Documentos: {
    Documento: {
      CreadoEl: Date;
      IdDocumento: number;
      UrlDocumento: string;
      Folios: number;
      Asunto: string;
      CodigoReferenciaDoc: string;
      Visible: boolean;
      TipoDocumento: {
        Descripcion: string;
        IdTipoDocumento: number;
      };
    };
    FirmaDigital: boolean;
    Copia: boolean;
    Anexos:number
  }[]
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
