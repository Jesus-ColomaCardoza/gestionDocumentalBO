import { Message } from "../../utils/Interfaces";

type Fecha = Date | string | null;
export interface UsuarioEntity {
  IdUsuario: number;
  Nombres: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  FechaNacimiento: Fecha;
  Email: string;
  Contrasena: string;
  Celular: string;
  Genero: string;
  RazonSocial: string;
  IdTipoIdentificacion: number;
  TipoIdentificacion: {
    IdTipoIdentificacion: number;
    Descripcion: string;
  };
  NroIdentificacion: string;
  IdTipoUsuario: number;
  TipoUsuario: {
    IdTipoUsuario: number;
    Descripcion: string;
  };
  IdRol: string;
  Rol: {
    IdRol: string;
    Descripcion: string;
  };
  IdCargo: number;
  Cargo: {
    IdCargo: number;
    Descripcion: string;
  };
  IdArea: number;
  Area: {
    IdArea: number;
    Descripcion: string;
  };
  Activo: boolean;
  CreadoEl: Fecha;
  CreadoPor: string;
  ModificadoEl: Fecha;
  ModificadoPor: string;
  CodigoConfirmacion: string;
  // UrlBase: string;
  // FormatoFotoPerfil: string;
  // NombreFotoPerfil: string;
  // SizeFotoPerfil: number;
  // UrlFotoPerfil: string;
  FotoPerfilNombre?: string;
  FotoPerfilBase64?: string;
  CodigoConfirmacionExp: Fecha;
}
export interface UsuarioCreate {
  IdUsuario?: number;
  Nombres: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  FechaNacimiento?: Fecha;
  Email: string;
  Contrasena: string;
  Celular?: string;
  Genero: string;
  RazonSocial?: string;
  IdTipoIdentificacion?: number;
  NroIdentificacion?: string;
  IdTipoUsuario?: number;
  IdRol?: string;
  IdCargo?: number;
  IdArea?: number;
  Activo: boolean;
  CreadoEl?: Date | string;
  CreadoPor?: string;
  CodigoConfirmacion?: string;
  // UrlBase?: string;
  // FormatoFotoPerfil?: string;
  // NombreFotoPerfil?: string;
  // SizeFotoPerfil?: number;
  // UrlFotoPerfil?: string;
  FotoPerfilNombre?: string;
  FotoPerfilBase64?: string;
  CodigoConfirmacionExp?: Fecha;
}
export interface UsuarioUpdate {
  IdUsuario?: number;
  Nombres?: string;
  ApellidoPaterno?: string; 
  ApellidoMaterno: string;
  FechaNacimiento?: Fecha;
  Email?: string;
  Contrasena?: string;
  Celular?: string;
  Genero?: string;
  RazonSocial?: string;
  IdTipoIdentificacion?: number;
  NroIdentificacion?: string;
  IdTipoUsuario?: number;
  IdRol?: string;
  IdCargo?: number;
  IdArea?: number;
  Activo?: boolean;
  ModificadoEl?: Date | string;
  ModificadoPor?: string;
  CodigoConfirmacion?: string;
  // UrlBase?: string;
  // FormatoFotoPerfil?: string;
  // NombreFotoPerfil?: string;
  // SizeFotoPerfil?: number;
  // UrlFotoPerfil?: string;
  FotoPerfilNombre?: string;
  FotoPerfilBase64?: string;
  CodigoConfirmacionExp?: Fecha;
}
export interface UsuarioOut {
  message: Message;
  registro?: UsuarioEntity;
}
export interface UsuariosOut {
  message: Message;
  registro?: UsuarioEntity[];
}
