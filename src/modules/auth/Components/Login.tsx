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

const Login = () => {
  // variables and constants
  const loginAuth: LoginAuth = {
    Email: "",
    Contrasena: "",
  };

  const remenberMeSGD = localStorage.getItem("remenberMeSGD");

  // states
  const [loginAuthData, setLoginAuthData] = useState<LoginAuth>(loginAuth);

  const [loginAuthErrors, setLoginAuthErrors] = useState<Partial<LoginAuth>>(
    {}
  );

  const [checked, setChecked] = useState(remenberMeSGD ? true : false);

  // custom hooks
  const { login } = useAuth()!;

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

  return (
    <div
      className={
        "flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
      }
    >
      <div className="flex flex-column align-items-center justify-content-center">
        {/* <img src={""} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" /> */}
        <div
          style={{
            borderRadius: "15px",
            padding: "0.2rem",
            background:
              "linear-gradient(180deg, var(--primary-color) 50%, rgba(33, 150, 243, 0) 100%)",
          }}
        >
          <Card className="w-full py-4 px-2" style={{ borderRadius: "15px" }}>
            <div className="text-center mb-5">
              {/* <img
                src="/demo/images/login/avatar.png"
                alt="Image"
                height="50"
                className="mb-3"
              /> */}
              <div className="text-900 text-3xl font-medium mb-3">
                Inicio de Sesión
              </div>
              {/* <span className="text-600 font-medium">Inicio de Sesión</span> */}
            </div>

            <label
              htmlFor="Email"
              className="block text-900 text-lg font-medium mb-2"
            >
              Email
            </label>
            <div className="flex flex-column mb-5 gap-1">
              <InputText
                id="Email"
                value={loginAuthData.Email}
                onChange={(e) => {
                  onInputChange(e, "Email");
                }}
                type="text"
                placeholder="Ingresa tu email"
                className="w-full p-3 md:w-25rem"
                style={{ padding: "1rem" }}
              />
              {loginAuthErrors.Email && (
                <small className="p-error">{loginAuthErrors.Email}</small>
              )}
            </div>

            <label
              htmlFor="Contrasena"
              className="block text-900 font-medium text-lg mb-2"
            >
              Contraseña
            </label>
            <div className="flex flex-column mb-5 gap-1">
              <Password
                inputId="Contrasena"
                value={loginAuthData.Contrasena}
                onChange={(e) => {
                  onInputChange(e, "Contrasena");
                }}
                placeholder="Ingresa tu contraseña"
                toggleMask
                inputClassName="w-full p-3 md:w-25rem"
                feedback={false}
              ></Password>
              {loginAuthErrors.Contrasena && (
                <small className="p-error">{loginAuthErrors.Contrasena}</small>
              )}
            </div>

            <div className="flex align-items-center justify-content-between mb-7 gap-5">
              <div className="flex align-items-center">
                <Checkbox
                  inputId="rememberme1"
                  checked={checked}
                  onChange={(e) => {
                    setChecked(e.checked ?? false);
                    
                    if (e.checked) {
                      localStorage.setItem(
                        "remenberMeSGD",
                        JSON.stringify(loginAuthData)
                      );
                    } else {
                      localStorage.removeItem("remenberMeSGD");
                    }
                  }}
                  className="mr-2"
                ></Checkbox>
                <label className="text-sm" htmlFor="rememberme1">
                  Recordar credenciales
                </label>
              </div>
              <a
                className="font-medium no-underline ml-2 text-right cursor-pointer text-sm"
                style={{ color: "var(--primary-color)" }}
              >
                ¿Olvidé mi contraseña?
              </a>
            </div>

            <Button
              label="Aceptar"
              className="w-full p-2 text-xl"
              onClick={() => {
                if (validateForm()) login(loginAuthData);
              }}
            ></Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
