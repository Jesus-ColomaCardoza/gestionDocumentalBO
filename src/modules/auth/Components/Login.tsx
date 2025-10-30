/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { LoginAuth } from "../interfaces/AuthInterface";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useTheme } from "../../../ThemeContext";
import fondo from "../../../assets/img/fondo.jpeg";

const Login = () => {
  // variables and constants
  const loginAuth: LoginAuth = {
    Email: "admin@gmail.com",
    Contrasena: "admin",
  };

  const remenberMeSGD = localStorage.getItem("remenberMeSGD");

  // states
  const [loginAuthData, setLoginAuthData] = useState<LoginAuth>(loginAuth);

  const [loginAuthErrors, setLoginAuthErrors] = useState<Partial<LoginAuth>>(
    {}
  );

  const [checked, setChecked] = useState(remenberMeSGD ? true : false);

  // custom hooks
  const { login, loginGoogle, loadingAuth } = useAuth()!;

  const { themePrimeFlex, switchTheme } = useTheme();

  // functions
  const validateForm = () => {
    const fieldErrors: Partial<LoginAuth> = {};

    if (!loginAuthData.Email.trim()) {
      fieldErrors.Email = "El email es obligatorio.";
    }

    if (!loginAuthData.Contrasena.trim()) {
      fieldErrors.Contrasena = "La contraseña es obligatoria.";
    }

    setLoginAuthErrors(fieldErrors);

    return Object.keys(fieldErrors).length === 0;
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const value = (e.target && e.target.value) || "";

    setLoginAuthData((prev) => ({ ...prev, [name]: value }));

    setLoginAuthErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  useEffect(() => {
    if (remenberMeSGD) {
      setLoginAuthData(JSON.parse(remenberMeSGD!));
    }
  }, []);

  const checkboxStyle = {
    "--primary-color": "#D63939",
    "--check-color": "white",
  } as React.CSSProperties;

  return (
    <>
      <div
        className={
          "flex align-items-center justify-content-center overflow-hidden"
        }
        style={{
          height: "100dvh",
          backgroundImage: `url(${fondo})`,
          opacity: "0.4",
          // backgroundPosition: "contain",
          backgroundSize: "100% 100%", // ¡Esto deforma la imagen!
          backgroundRepeat: "no-repeat",
          width: "100%",
          position: "absolute",
          zIndex: "-1",
        }}
      ></div>
      <div
        className="flex flex-column align-items-center justify-content-center"
        style={{
          height: "100dvh",
        }}
      >
        {/* <img src={""} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" /> */}
        <div className="my-5">
          <Card
            className="w-full py-3 px-2"
            style={{
              borderRadius: "10px",
              border: `${
                themePrimeFlex === "light" ? "1px solid #e9e9e9ff" : "none"
              }`,
            }}
          >
            <div className="text-center mb-3">
              {/* <img
                src="/demo/images/login/avatar.png"
                alt="Image"
                height="50"
                className="mb-3"
              /> */}
              <div className="text-2xl">Inicio de Sesión</div>
              <span
                className=" text-xs"
                style={{
                  color: themePrimeFlex === "light" ? "#575152ff" : "#756a6cff",
                }}
              >
                Bienvenido! Selecciona el metodo para
                <br /> acceder al SGD
              </span>
            </div>

            <div className="flex flex-column mb-3 mt-5">
              <GoogleLogin
                // type="icon"
                logo_alignment="center"
                // theme="filled_blue"
                onSuccess={async (credentialResponse: CredentialResponse) => {
                  loginGoogle(credentialResponse);
                }}
                onError={() => {
                  window.alert("Error al iniciar sesión");
                }}
              />
              <div className="flex align-items-center mt-5">
                <div style={{ flexGrow: 3, border: "1px #999 solid" }}></div>
                <span style={{ flexGrow: 1 }} className="text-xs text-center">
                  o registrate con email
                </span>
                <div style={{ flexGrow: 3, border: "1px #999 solid" }}></div>
              </div>
            </div>

            {/* <label
              htmlFor="Email"
              className="block text-900 text-xs font-medium mb-2"
            >
              Email
            </label> */}
            <div className="flex flex-column mb-3 gap-1">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-envelope"></i>
                </span>
                <InputText
                  id="Email"
                  value={loginAuthData.Email}
                  onChange={(e) => {
                    onInputChange(e, "Email");
                  }}
                  type="text"
                  placeholder="Ingrese su email"
                  className="p-inputtext-sm w-full md:w-18em"
                />
              </div>
              {/* <InputText
                id="Email"
                value={loginAuthData.Email}
                onChange={(e) => {
                  onInputChange(e, "Email");
                }}
                type="text"
                placeholder="Search"
                className="p-inputtext-sm w-full md:w-25rem"
              /> */}
              {loginAuthErrors.Email && (
                <small className="p-error text-xs">
                  {loginAuthErrors.Email}
                </small>
              )}
            </div>

            {/* <label
              htmlFor="Contrasena"
              className="block text-900 font-medium text-xs mb-2"
            >
              Contraseña
            </label> */}
            <div className="flex flex-column mb-5 gap-1">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-lock"></i>
                </span>
                <Password
                  inputId="Contrasena"
                  value={loginAuthData.Contrasena}
                  onChange={(e) => {
                    onInputChange(e, "Contrasena");
                  }}
                  placeholder="Ingresa tu contraseña"
                  toggleMask
                  inputClassName="w-full p-inputtext-sm sm:w-18rem md:w-18rem "
                  inputStyle={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    fontSize: "1rem",
                  }}
                  className="p-inputtext-sm"
                  feedback={false}
                ></Password>
              </div>
              {/* <Password
                inputId="Contrasena"
                value={loginAuthData.Contrasena}
                onChange={(e) => {
                  onInputChange(e, "Contrasena");
                }}
                placeholder="Ingresa tu contraseña"
                toggleMask
                inputClassName="w-full md:w-25rem"
                className="p-inputtext-sm"
                feedback={false}
              ></Password> */}
              {loginAuthErrors.Contrasena && (
                <small className="p-error text-xs">
                  {loginAuthErrors.Contrasena}
                </small>
              )}
            </div>

            <div className="flex align-items-center justify-content-between mb-4 gap-5">
              <div className="flex align-items-center">
                <div className="flex align-items-center" style={checkboxStyle}>
                  <input
                    type="checkbox"
                    id="rememberme1"
                    checked={checked}
                    onChange={(e) => {
                      setChecked(e.target.checked ?? false);
                      if (e.target.checked) {
                        localStorage.setItem(
                          "remenberMeSGD",
                          JSON.stringify(loginAuthData)
                        );
                      } else {
                        localStorage.removeItem("remenberMeSGD");
                      }
                    }}
                    className="mr-2 custom-checkbox"
                    style={{
                      appearance: "none",
                      WebkitAppearance: "none",
                      width: "20px",
                      height: "20px",
                      // border: "2px solid #ddd",
                      borderRadius: "6px",
                      backgroundColor: checked
                        ? "var(--primary-color)"
                        : themePrimeFlex === "light"
                        ? "#e9e9e9ff"
                        : "#111827",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  />
                  <style>{`
                  .custom-checkbox:checked::after {
                    content: '';
                    position: absolute;
                    left: 7px;
                    top: 2px;
                    width: 5px;
                    height: 10px;
                    border: solid var(--check-color);
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                  }
                  .custom-checkbox:hover {
                    border-color: var(--primary-color);
                  }
                `}</style>
                </div>
                <label className="text-xs" htmlFor="rememberme1">
                  Recordar credenciales
                </label>
              </div>

              <Link
                to={"../forgot_password"}
                className="font-medium no-underline ml-2 text-right cursor-pointer text-xs"
                // style={{ color: "var(--primary-color)" }}
                style={{
                  color: "#D63939",
                }}
              >
                ¿Olvidé mi contraseña?
              </Link>
            </div>

            <Button
              className="w-full p-2 text-md flex justify-content-center gap-1"
              style={{
                backgroundColor: "#D63939",
                borderColor: "#D63939",
                color: "#fff",
              }}
              loading={loadingAuth}
              onClick={() => {
                if (validateForm()) login(loginAuthData);
              }}
            >
              Aceptar
            </Button>

            <div className="flex align-items-center justify-content-center mt-3 ">
              <label className="text-xs" htmlFor="rememberme1">
                ¿No tienes cuenta?
              </label>
              <Link
                to={"../signup"}
                className="font-medium no-underline ml-2 text-right cursor-pointer text-xs"
                style={{
                  color: "#D63939",
                }}
                // style={{ color: "var(--primary-color)" }}
              >
                Registrate aquí
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
