import { Menssage } from "../../utils/menssage";

export interface UserAuth {
  IdUsuario: number;
  Nombres: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  UrlFotoPerfil: string;
  Email: string;
  Rol: {
    IdRol: string;
    Descripcion: string;
  };
  Area: {
    IdArea: number;
    Descripcion: string;
  };
}

export interface LoginAuth {
  Email: string;
  Contrasena: string;
}

export interface OutLoginAuth {
  message: Menssage;
  registro?: {
    AccessToken: string;
    AccessTokenTime: string;
    // RefreshToken: string,
    ExpiresIn: string;
  };
}

export interface VerifyTokenAuth {
  Token: string;
}

export interface OutVerifyTokenAuth {
  message: Menssage;
  registro?: {
    IdUsuario: number;
    Nombres: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    UrlFotoPerfil: string;
    Email: string;
    Rol: {
      IdRol: string;
      Descripcion: string;
    };
    Area: {
      IdArea: number;
      Descripcion: string;
    };
  };
}
