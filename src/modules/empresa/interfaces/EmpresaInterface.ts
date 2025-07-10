import { Message } from "../../utils/Interfaces";

type Fecha = Date | string | null;
export interface EmpresaEntity {
  IdEmpresa: number;
  Descripcion: string;
  NroIdentificacion: string;
  Email: string;
  Celular: string;
  RazonSocial: string;
  // UrlBase: string;
  // FormatoLogo: string;
  // NombreLogo: string;
  // SizeLogo: number;
  // UrlLogo: string;
  LogoNombre?: string;
  LogoBase64?: string;
  Activo: boolean;
  CreadoEl: Fecha;
  CreadoPor: string;
  ModificadoEl: Fecha;
  ModificadoPor: string;
}
export interface EmpresaCreate {
  IdEmpresa?: number;
  Descripcion: string;
  NroIdentificacion?: string;
  Email?: string;
  Celular?: string;
  RazonSocial?: string;
  LogoNombre?: string;
  LogoBase64?: string;
  Activo?: boolean;
  CreadoEl?: Date | string;
  CreadoPor?: string;
}
export interface EmpresaUpdate {
  IdEmpresa?: number;
  Descripcion?: string;
  NroIdentificacion?: string;
  Email?: string;
  Celular?: string;
  RazonSocial?: string;
  LogoNombre?: string;
  LogoBase64?: string;
  Activo?: boolean;
  ModificadoEl?: Date | string;
  ModificadoPor?: string;
}
export interface EmpresaOut {
  message : Message;
  registro?: EmpresaEntity;
}
export interface EmpresasOut {
  message : Message;
  registro?: EmpresaEntity[];
}