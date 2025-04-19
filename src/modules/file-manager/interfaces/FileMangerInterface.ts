import { Message } from "../../utils/Interfaces";

export interface FileManagerEntity {
  IdFM: string;
  Descripcion: string;
  FechaEmision: Date;
  UrlFM: string;
  FirmaDigital: boolean | null;
  Categoria?: "MF" | "FA" | "FS" | undefined;
  Activo: boolean | null;
  Usuario: {
    IdUsuario: number;
    Nombres: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    Area: {
      IdArea: number;
      Descripcion: string;
    };
  };
  Estado: {
    IdEstado: number;
    Descripcion: string;
  };
  Carpeta: {
    IdCarpeta: number;
    Descripcion: string;
  };
}

export interface FileManagerGetMyFiles {
  IdUsuario?: number;
  IdCarpeta?: number | null;
  Categoria?: string;
}

export interface FileManagerGetFilesArea {
  IdCarpeta?: number | null;
  IdArea?: number | null;
  Categoria?: string;
}

export interface FileManagerOut {
  message: Message;
  registro?: FileManagerEntity;
}

export interface FileManagersOut {
  message: Message;
  registro?: FileManagerEntity[];
}
