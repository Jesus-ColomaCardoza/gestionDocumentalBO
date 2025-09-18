import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import axios, { AxiosError } from "axios";
import {
  ForgotPasswordAuth,
  LoginAuth,
  OutForgotPasswordAuth,
  OutLoginAuth,
  OutResetPasswordAuth,
  OutSignupAuth,
  OutVerifyTokenAuth,
  ResetPasswordAuth,
  SignupAuth,
  SignupGoogleAuth,
  UserAuth,
} from "../interfaces/AuthInterface";
import { REACT_APP_SALT, VITE_API_URL_GDS } from "../../utils/Constants";
import { AUTH } from "../service/AuthService";
import { Toast } from "primereact/toast";
import { useLocation, useNavigate } from "react-router-dom";
import { sha256 } from "js-sha256";
import { CredentialResponse } from "@react-oauth/google";

type AuthPoroviderProps = {
  children: React.ReactNode;
};

interface AuthContextType {
  userAuth: UserAuth | null;
  login: (loginAuth: LoginAuth) => Promise<void>;
  loginGoogle: (credentialResponse: CredentialResponse) => Promise<void>;
  signup: (signupAuth: SignupAuth) => Promise<void>;
  signupGoogle: (SignupGoogleAuth: SignupGoogleAuth) => Promise<void>;
  forgotPassword: (forgotPasswordAuth: ForgotPasswordAuth) => Promise<void>;
  resetPassword: (resetPasswordAuth: ResetPasswordAuth) => Promise<void>;
  logout: () => void;
  loadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthPoroviderProps) => {
  //refs
  const toastAuth = useRef<Toast>(null);

  // states
  const [userAuth, setUserAuth] = useState<UserAuth | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // custom hooks
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // variables
  const authRoutes = [
    //auth
    "/auth/login",
    "/auth/signup",
    "/auth/forgot_password",
    "/auth/reset_password/:token",

    //perfil Usuario
    "/perfil_usuario",

    //firma digital
    "/firma_digital/archivos_digitales",

    //tramite
    "/tramite/seguimiento",
    "/tramite/documento",
    "/tramite/pendiente",
    "/tramite/recibido",
    "/tramite/recibido/externo",
    "/tramite/recibido/atendido/:id",
    "/tramite/recibido/derivado",
    "/tramite/recibido/derivados",
    "/tramite/emitido",
    "/tramite/emitido/nuevo",

    //mantenimiento
    "/mantenimiento/usuario",
    "/mantenimiento/empresa",
    "/mantenimiento/area",
    "/mantenimiento/cargo",
    "/mantenimiento/estado",
    "/mantenimiento/esquema_estado",
    "/mantenimiento/rol",
    "/mantenimiento/tipo_documento",
    "/mantenimiento/tipo_usuario",
    "/mantenimiento/tipo_tramite",
    "/mantenimiento/tipo_identificacion",

    //otros
    "/archivado/archivador", 
  ];

  //functions
  const validateRoutes = authRoutes.some((route) => {
    const pattern = new RegExp(`^${route.replace(/:\w+/g, "[^/]+")}$`);
    return pattern.test(pathname);
  });

  const verifyToken = async (origin: "login" | "reload") => {
    try {
      const tokenSGD = localStorage.getItem("tokenSGD");

      if (tokenSGD) {
        const validateUser = await axios.post<OutVerifyTokenAuth>(
          `${VITE_API_URL_GDS + AUTH.VERIFY_TOKEN}`,
          { Token: tokenSGD }
        );

        if (validateUser.data.message.msgId == 0) {
          setUserAuth(validateUser.data.registro || null);

          if (origin === "login") {
            navigate("/dashboard");
          } else {
            navigate(validateRoutes ? pathname : "/dashboard");
          }
        } else if (validateUser.data.message.msgId == 1) {
          toastAuth.current?.show({
            severity: "error",
            detail: `${validateUser.data.message.msgTxt}`,
            life: 3000,
          });

          navigate("/auth/login");
        }
      } else if (!validateRoutes) {
        console.log("not found");

        navigate("/nofound");

        setLoadingAuth(false);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.status == 400) {
        toastAuth.current?.show({
          severity: "error",
          detail: `${error.response?.data.message}`,
          life: 3000,
        });
      } else {
        toastAuth.current?.show({
          severity: "error",
          detail: `${"Error: Error interno en el servidor"}`,
          life: 3000,
        });
      }

      navigate("/auth/login");

      setUserAuth(null);
    } finally {
      setLoadingAuth(false);
    }
  };

  const signup = async (signupAuth: SignupAuth) => {
    try {
      setLoadingAuth(true);

      const hashedPassword = sha256(
        REACT_APP_SALT + sha256(signupAuth.Contrasena)
      );

      const hashedConfirmPassword = sha256(
        REACT_APP_SALT + sha256(signupAuth.ContrasenaConfirmacion)
      );

      const signuppedUser = await axios.post<OutSignupAuth>(
        `${VITE_API_URL_GDS + AUTH.SIGNUP}`,
        {
          ...signupAuth,
          Contrasena: hashedPassword,
          ContrasenaConfirmacion: hashedConfirmPassword,
        }
      );

      if (signuppedUser.data.message.msgId == 0) {
        toastAuth.current?.show({
          severity: "success",
          detail: `${signuppedUser.data.message.msgTxt}`,
          life: 3000,
        });

        navigate("/auth/login");
      } else if (signuppedUser.data.message.msgId == 2) {
        toastAuth.current?.show({
          severity: "info",
          detail: `${signuppedUser.data.message.msgTxt}`,
          life: 3000,
        });
      } else if (signuppedUser.data.message.msgId == 1) {
        toastAuth.current?.show({
          severity: "error",
          detail: `${signuppedUser.data.message.msgTxt}`,
          life: 3000,
        });
      }
    } catch (error) {
      if (error instanceof AxiosError && error.status == 400) {
        toastAuth.current?.show({
          severity: "error",
          detail: `${error.response?.data.message}`,
          life: 3000,
        });
      } else {
        toastAuth.current?.show({
          severity: "error",
          detail: `${"Error: Error interno en el servidor"}`,
          life: 3000,
        });
      }
    } finally {
      setLoadingAuth(false);
    }
  };

  const signupGoogle = async (SignupGoogleAuth: SignupGoogleAuth) => {
    try {
      setLoadingAuth(true);

      const signuppedUser = await axios.post<OutSignupAuth>(
        `${VITE_API_URL_GDS + AUTH.SIGNUP_GOOGLE}`,
        SignupGoogleAuth
      );

      if (signuppedUser.data.message.msgId == 0) {
        toastAuth.current?.show({
          severity: "success",
          detail: `${signuppedUser.data.message.msgTxt}`,
          life: 3000,
        });

        navigate("/auth/login");
      } else if (signuppedUser.data.message.msgId == 2) {
        toastAuth.current?.show({
          severity: "info",
          detail: `${signuppedUser.data.message.msgTxt}`,
          life: 3000,
        });
      } else if (signuppedUser.data.message.msgId == 1) {
        toastAuth.current?.show({
          severity: "error",
          detail: `${signuppedUser.data.message.msgTxt}`,
          life: 3000,
        });
      }
    } catch (error) {
      if (error instanceof AxiosError && error.status == 400) {
        toastAuth.current?.show({
          severity: "error",
          detail: `${error.response?.data.message}`,
          life: 3000,
        });
      } else {
        toastAuth.current?.show({
          severity: "error",
          detail: `${"Error: Error interno en el servidor"}`,
          life: 3000,
        });
      }
    } finally {
      setLoadingAuth(false);
    }
  };

  const login = async (loginAuth: LoginAuth) => {
    try {
      setLoadingAuth(true);

      const hashedPassword = sha256(
        REACT_APP_SALT + sha256(loginAuth.Contrasena)
      );

      const loggedUser = await axios.post<OutLoginAuth>(
        `${VITE_API_URL_GDS + AUTH.LOGIN}`,
        { Email: loginAuth.Email, Contrasena: hashedPassword }
      );

      if (loggedUser.data.message.msgId == 0) {
        toastAuth.current?.show({
          severity: "success",
          detail: `${loggedUser.data.message.msgTxt}`,
          life: 3000,
        });

        localStorage.setItem(
          "tokenSGD",
          loggedUser.data.registro?.AccessToken!
        );

        await verifyToken("login");
      } else if (loggedUser.data.message.msgId == 2) {
        toastAuth.current?.show({
          severity: "info",
          detail: `${loggedUser.data.message.msgTxt}`,
          life: 3000,
        });

        setUserAuth(null);
      } else if (loggedUser.data.message.msgId == 1) {
        toastAuth.current?.show({
          severity: "error",
          detail: `${loggedUser.data.message.msgTxt}`,
          life: 3000,
        });

        setUserAuth(null);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.status == 400) {
        toastAuth.current?.show({
          severity: "error",
          detail: `${error.response?.data.message}`,
          life: 3000,
        });
      } else {
        toastAuth.current?.show({
          severity: "error",
          detail: `${"Error: Error interno en el servidor"}`,
          life: 3000,
        });
      }

      setUserAuth(null);
    } finally {
      setLoadingAuth(false);
    }
  };

  const loginGoogle = async (credentialResponse: CredentialResponse) => {
    try {
      setLoadingAuth(true);

      const loggedUserWithGoogle = await axios.post<OutLoginAuth>(
        `${VITE_API_URL_GDS + AUTH.LOGIN_GOOGLE}`,
        {
          Token: credentialResponse.credential,
        }
      );

      if (loggedUserWithGoogle.data.message.msgId == 0) {
        toastAuth.current?.show({
          severity: "success",
          detail: `${loggedUserWithGoogle.data.message.msgTxt}`,
          life: 3000,
        });

        localStorage.setItem(
          "tokenSGD",
          loggedUserWithGoogle.data.registro?.AccessToken!
        );

        await verifyToken("login");
      } else if (loggedUserWithGoogle.data.message.msgId == 2) {
        toastAuth.current?.show({
          severity: "info",
          detail: `${loggedUserWithGoogle.data.message.msgTxt}`,
          life: 3000,
        });

        setUserAuth(null);
      } else if (loggedUserWithGoogle.data.message.msgId == 1) {
        toastAuth.current?.show({
          severity: "error",
          detail: `${loggedUserWithGoogle.data.message.msgTxt}`,
          life: 3000,
        });

        setUserAuth(null);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.status == 400) {
        toastAuth.current?.show({
          severity: "error",
          detail: `${error.response?.data.message}`,
          life: 3000,
        });
      } else {
        toastAuth.current?.show({
          severity: "error",
          detail: `${"Error: Error interno en el servidor"}`,
          life: 3000,
        });
      }

      setUserAuth(null);
    } finally {
      setLoadingAuth(false);
    }
  };

  const forgotPassword = async (forgotPasswordAuth: ForgotPasswordAuth) => {
    try {
      setLoadingAuth(true);

      const resForgotPassword = await axios.post<OutForgotPasswordAuth>(
        `${VITE_API_URL_GDS + AUTH.FORGOT_PASSWORD}`,
        forgotPasswordAuth
      );

      if (resForgotPassword.data.message.msgId == 0) {
        toastAuth.current?.show({
          severity: "success",
          detail: `${resForgotPassword.data.message.msgTxt}`,
          life: 3000,
        });
      } else if (resForgotPassword.data.message.msgId == 2) {
        toastAuth.current?.show({
          severity: "info",
          detail: `${resForgotPassword.data.message.msgTxt}`,
          life: 3000,
        });
      } else if (resForgotPassword.data.message.msgId == 1) {
        toastAuth.current?.show({
          severity: "error",
          detail: `${resForgotPassword.data.message.msgTxt}`,
          life: 3000,
        });
      }
    } catch (error) {
      if (error instanceof AxiosError && error.status == 400) {
        toastAuth.current?.show({
          severity: "error",
          detail: `${error.response?.data.message}`,
          life: 3000,
        });
      } else {
        toastAuth.current?.show({
          severity: "error",
          detail: `${"Error: Error interno en el servidor"}`,
          life: 3000,
        });
      }
    } finally {
      setLoadingAuth(false);
    }
  };

  const resetPassword = async (resetPasswordAuth: ResetPasswordAuth) => {
    try {
      setLoadingAuth(true);

      const hashedPassword = sha256(
        REACT_APP_SALT + sha256(resetPasswordAuth.Contrasena)
      );

      const hashedConfirmPassword = sha256(
        REACT_APP_SALT + sha256(resetPasswordAuth.ContrasenaConfirmacion)
      );

      const resResetPassword = await axios.post<OutResetPasswordAuth>(
        `${VITE_API_URL_GDS + AUTH.RESET_PASSWORD}`,
        {
          ...resetPasswordAuth,
          Contrasena: hashedPassword,
          ContrasenaConfirmacion: hashedConfirmPassword,
        }
      );

      if (resResetPassword.data.message.msgId == 0) {
        toastAuth.current?.show({
          severity: "success",
          detail: `${resResetPassword.data.message.msgTxt}`,
          life: 3000,
        });

        navigate("auth/login");
      } else if (resResetPassword.data.message.msgId == 2) {
        toastAuth.current?.show({
          severity: "info",
          detail: `${resResetPassword.data.message.msgTxt}`,
          life: 3000,
        });
      } else if (resResetPassword.data.message.msgId == 1) {
        toastAuth.current?.show({
          severity: "error",
          detail: `${resResetPassword.data.message.msgTxt}`,
          life: 3000,
        });
      }
    } catch (error) {
      if (error instanceof AxiosError && error.status == 400) {
        toastAuth.current?.show({
          severity: "error",
          detail: `${error.response?.data.message}`,
          life: 3000,
        });
      } else {
        toastAuth.current?.show({
          severity: "error",
          detail: `${"Error: Error interno en el servidor"}`,
          life: 3000,
        });
      }
    } finally {
      setLoadingAuth(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("tokenSGD");

    navigate("/auth/login");

    setUserAuth(null);
  };

  useEffect(() => {
    verifyToken("reload");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userAuth,
        login,
        loginGoogle,
        signup,
        signupGoogle,
        forgotPassword,
        resetPassword,
        logout,
        loadingAuth,
      }}
    >
      <Toast ref={toastAuth} position={"bottom-right"} />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
