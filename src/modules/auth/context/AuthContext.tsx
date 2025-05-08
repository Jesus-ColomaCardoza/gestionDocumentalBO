import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import axios, { AxiosError } from "axios";
import {
  LoginAuth,
  OutLoginAuth,
  OutVerifyTokenAuth,
  UserAuth,
} from "../interfaces/AuthInterface";
import { REACT_APP_SALT, VITE_API_URL_GDS } from "../../utils/Constants";
import { AUTH } from "../service/AuthService";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { sha256 } from "js-sha256";

type AuthPoroviderProps = {
  children: React.ReactNode;
};

interface AuthContextType {
  userAuth: UserAuth | null;
  login: (loginAuth: LoginAuth) => Promise<void>;
  logout: () => void;
  loadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthPoroviderProps) => {
  const toastAuth = useRef<Toast>(null);
  const [userAuth, setUserAuth] = useState<UserAuth | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();

  const verifyToken = async () => {
    try {
      const tokenSGD = localStorage.getItem("tokenSGD");

      if (tokenSGD) {
        const validateUser = await axios.post<OutVerifyTokenAuth>(
          `${VITE_API_URL_GDS + AUTH.VERIFY_TOKEN}`,
          { Token: tokenSGD }
        );

        if (validateUser.data.message.msgId == 0) {
          setUserAuth(validateUser.data.registro || null);

          navigate("/dashboard");
        } else if (validateUser.data.message.msgId == 1) {
          toastAuth.current?.show({
            severity: "error",
            detail: `${validateUser.data.message.msgTxt}`,
            life: 3000,
          });

          navigate("/auth/login");
        }
      } else {
        navigate("/auth/login");

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

  const login = async (loginAuth: LoginAuth) => {
    try {
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

        await verifyToken();
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

  const logout = () => {
    localStorage.removeItem("tokenSGD");

    navigate("/auth/login");

    setUserAuth(null);
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ userAuth, login, logout, loadingAuth }}>
      <Toast ref={toastAuth} position={"bottom-right"} />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
