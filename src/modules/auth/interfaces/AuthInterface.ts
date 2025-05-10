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

export interface SignupAuth {
  Nombres: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  Email: string;
  Contrasena: string;
  ContrasenaConfirmacion: string;
  IdRol: string;
  IdCargo: number;
  IdArea: number;
}

export interface OutSignupAuth {
  message: Menssage;
  registro?: {
    IdUsuario: number;
  };
}

export interface ForgotPasswordAuth {
  Email: string;
}

export interface OutForgotPasswordAuth {
  message: Menssage;
  registro?: {
    IdUsuario: number;
  };
}

export interface ResetPasswordAuth {
  CodigoConfirmacion: string;
  Contrasena: string;
  ContrasenaConfirmacion: string;
}

export interface OutResetPasswordAuth {
  message: Menssage;
  registro?: {
    IdUsuario: number;
  };
}
