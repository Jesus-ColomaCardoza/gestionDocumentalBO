/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { SignupAuth } from "../interfaces/AuthInterface";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Signup = () => {
  // variables and constants
  const signupAuth: SignupAuth = {
    Nombres: "",
    ApellidoPaterno: "",
    ApellidoMaterno: "",
    Email: "",
    Contrasena: "",
    ContrasenaConfirmacion: "",
    // values by default to fronted
    IdRol: "USER_INTERNO",
    IdCargo: 7,
    IdArea: 1,
  };

  // states
  const [signupAuthData, setSignupAuthData] = useState<SignupAuth>(signupAuth);

  const [signupAuthErrors, setSignupAuthErrors] = useState<Partial<SignupAuth>>(
    {}
  );

  // custom hooks
  const { signup, loadingAuth } = useAuth()!;

  // functions
  const validateForm = () => {
    const fieldErrors: Partial<SignupAuth> = {};

    if (!signupAuthData.Nombres.trim()) {
      fieldErrors.Nombres = "Nombres es obligatorio.";
    }

    if (!signupAuthData.ApellidoPaterno.trim()) {
      fieldErrors.ApellidoPaterno = "Apellido paterno es obligatoria.";
    }

    if (!signupAuthData.ApellidoMaterno.trim()) {
      fieldErrors.ApellidoMaterno = "Apellido materno es obligatorio.";
    }

    if (!signupAuthData.Email.trim()) {
      fieldErrors.Email = "Email es obligatorio.";
    }

    if (!signupAuthData.Contrasena.trim()) {
      fieldErrors.Contrasena = "Contraseña es obligatoria.";
    }

    if (!signupAuthData.ContrasenaConfirmacion.trim()) {
      fieldErrors.ContrasenaConfirmacion =
        "Confirmación de contraseña es obligatoria.";
    }

    setSignupAuthErrors(fieldErrors);

    return Object.keys(fieldErrors).length === 0;
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const value = (e.target && e.target.value) || "";

    setSignupAuthData((prev) => ({ ...prev, [name]: value }));

    setSignupAuthErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  return (
    <div
      className={
        "flex align-items-center justify-content-center overflow-hidden"
      }
      style={{
        height: "100dvh",
        margin: "0 2em",
      }}
    >
      <div className="flex flex-column align-items-center justify-content-center">
        {/* <img src={""} alt="Sakai logo" className="mb-5 w-6em flex-shrink-0" /> */}
        <div>
          <Card className="w-full px-2" style={{ borderRadius: "10px" }}>
            <div className="text-center mb-5">
              {/* <img
                src="/demo/images/login/avatar.png"
                alt="Image"
                height="50"
                className="mb-3"
              /> */}
              <div className="text-900 text-xl">Registro de Usuario</div>
              {/* <span className="text-600 font-medium">Inicio de Sesión</span> */}
            </div>

            {/* <label
              htmlFor="Nombres"
              className="block text-900 text-xs font-medium mb-2"
            >
              Nombres
            </label> */}
            <div className="flex flex-column mb-3 gap-1">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-user"></i>
                </span>
                <InputText
                  id="Nombres"
                  value={signupAuthData.Nombres}
                  onChange={(e) => {
                    onInputChange(e, "Nombres");
                  }}
                  type="text"
                  placeholder="Ingresa tus nombres"
                  className="p-inputtext-sm"
                />
              </div>
              {/* <InputText
                id="Nombres"
                value={signupAuthData.Nombres}
                onChange={(e) => {
                  onInputChange(e, "Nombres");
                }}
                type="text"
                placeholder="Ingresa tus nombres"
                className="p-inputtext-sm"
              /> */}
              {signupAuthErrors.Nombres && (
                <small className="p-error">{signupAuthErrors.Nombres}</small>
              )}
            </div>

            <div className="flex flex-row" style={{ gap: "1rem" }}>
              <div className="md:w-12rem"
              // style={{
              //   width: "10em",
              // }}
              >
                {/* <label
                  htmlFor="ApellidoPaterno"
                  className="block text-900 text-xs font-medium mb-2"
                >
                  Apellido Paterno
                </label> */}
                <div className="flex flex-column mb-3 gap-1">
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-sort-alpha-down"></i>
                    </span>
                    <InputText
                      id="ApellidoPaterno"
                      value={signupAuthData.ApellidoPaterno}
                      onChange={(e) => {
                        onInputChange(e, "ApellidoPaterno");
                      }}
                      type="text"
                      placeholder="Apellido paterno"
                      className="p-inputtext-sm "
                    />
                  </div>
                  {/* <InputText
                    id="ApellidoPaterno"
                    value={signupAuthData.ApellidoPaterno}
                    onChange={(e) => {
                      onInputChange(e, "ApellidoPaterno");
                    }}
                    type="text"
                    placeholder="Apellido paterno"
                    className="p-inputtext-sm"
                  /> */}
                  {signupAuthErrors.ApellidoPaterno && (
                    <small className="p-error">
                      {signupAuthErrors.ApellidoPaterno}
                    </small>
                  )}
                </div>
              </div>
              <div className="md:w-10rem"
              // style={{
              //   width: "10em",
              // }}
              >
                {/* <label
                  htmlFor="ApellidoMaterno"
                  className="block text-900 text-xs font-medium mb-2"
                >
                  Apellido Materno
                </label> */}
                <div className="flex flex-column mb-3 gap-1">
                  <div className="p-inputgroup">
                    {/* <span className="p-inputgroup-addon">
                      <i className="pi pi-sort-alpha-down"></i>
                    </span> */}
                    <InputText
                      id="ApellidoMaterno"
                      value={signupAuthData.ApellidoMaterno}
                      onChange={(e) => {
                        onInputChange(e, "ApellidoMaterno");
                      }}
                      type="text"
                      placeholder="Apellido materno"
                      className="p-inputtext-sm "
                    />
                  </div>
                  {/* <InputText
                    id="ApellidoMaterno"
                    value={signupAuthData.ApellidoMaterno}
                    onChange={(e) => {
                      onInputChange(e, "ApellidoMaterno");
                    }}
                    type="text"
                    placeholder="Apellido materno"
                    className="p-inputtext-sm"
                  /> */}
                  {signupAuthErrors.ApellidoMaterno && (
                    <small className="p-error">
                      {signupAuthErrors.ApellidoMaterno}
                    </small>
                  )}
                </div>
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
                  value={signupAuthData.Email}
                  onChange={(e) => {
                    onInputChange(e, "Email");
                  }}
                  type="text"
                  placeholder="Ingresa tu email"
                  className="p-inputtext-sm w-full w-10rem"
                />
              </div>
              {/* <InputText
                id="Email"
                value={signupAuthData.Email}
                onChange={(e) => {
                  onInputChange(e, "Email");
                }}
                type="text"
                placeholder="Ingresa tu email"
                className="p-inputtext-sm"
              /> */}
              {signupAuthErrors.Email && (
                <small className="p-error">{signupAuthErrors.Email}</small>
              )}
            </div>

            {/* <label
              htmlFor="Contrasena"
              className="block text-900 font-medium text-xs mb-2"
            >
              Contraseña
            </label> */}
            <div className="flex flex-column mb-3 gap-1">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-lock"></i>
                </span>
                <Password
                  inputId="Contrasena"
                  value={signupAuthData.Contrasena}
                  onChange={(e) => {
                    onInputChange(e, "Contrasena");
                  }}
                  placeholder="Ingresa tu contraseña"
                  toggleMask
                  inputClassName="w-full sm:w-20rem md:w-20rem "
                  feedback={false}
                  className="p-inputtext-sm"

                ></Password>
              </div>
              {/* <Password
                inputId="Contrasena"
                value={signupAuthData.Contrasena}
                onChange={(e) => {
                  onInputChange(e, "Contrasena");
                }}
                placeholder="Ingresa tu contraseña"
                toggleMask
                inputClassName="w-full md:w-25em"
                feedback={false}
                className="p-inputtext-sm"
              ></Password> */}
              {signupAuthErrors.Contrasena && (
                <small className="p-error">{signupAuthErrors.Contrasena}</small>
              )}
            </div>

            {/* <label
              htmlFor="ContrasenaConfirmacion"
              className="block text-900 font-medium text-sm mb-2"
            >
              Confirmar contraseña
            </label> */}
            <div className="flex flex-column mb-4 gap-1">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-lock"></i>
                </span>
                <Password
                  inputId="ContrasenaConfirmacion"
                  value={signupAuthData.ContrasenaConfirmacion}
                  onChange={(e) => {
                    onInputChange(e, "ContrasenaConfirmacion");
                  }}
                  placeholder="Confirmar contraseña"
                  toggleMask
                  inputClassName="w-full sm:w-20rem md:w-20rem "
                  feedback={false}
                  className="p-inputtext-sm"
                ></Password>
              </div>
              {/* <Password
                inputId="ContrasenaConfirmacion"
                value={signupAuthData.ContrasenaConfirmacion}
                onChange={(e) => {
                  onInputChange(e, "ContrasenaConfirmacion");
                }}
                placeholder="Confirmar contraseña"
                toggleMask
                inputClassName="w-full md:w-25em"
                feedback={false}
                className="p-inputtext-sm"
              ></Password> */}
              {signupAuthErrors.ContrasenaConfirmacion && (
                <small className="p-error">
                  {signupAuthErrors.ContrasenaConfirmacion}
                </small>
              )}
            </div>

            <Button
              label="Aceptar"
              className="w-full p-2 text-md"
              loading={loadingAuth}
              onClick={() => {
                if (validateForm()) signup(signupAuthData);
              }}
            ></Button>

            <div className="flex align-items-center justify-content-center mt-3 ">
              <label className="text-xs" htmlFor="ememberme1">
                ¿Ya tienes cuenta?
              </label>
              <Link
                to={"../login"}
                className="font-medium no-underline ml-2 text-right cursor-pointer text-xs"
                style={{ color: "var(--primary-color)" }}
              >
                Inicia sesión aquí
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;
