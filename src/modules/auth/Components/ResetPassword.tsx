/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Card } from "primereact/card";
import { ResetPasswordAuth } from "../interfaces/AuthInterface";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../ThemeContext";
import fondo from "../../../assets/img/fondo.jpeg";

const ResetPassword = () => {
  // variables and constants
  const resetPasswordAuth: ResetPasswordAuth = {
    CodigoConfirmacion: "",
    Contrasena: "",
    ContrasenaConfirmacion: "",
  };

  // states
  const [resetPasswordData, setResetPasswordData] =
    useState<ResetPasswordAuth>(resetPasswordAuth);

  const [resetPasswordErrors, setResetPasswordErrors] = useState<
    Partial<ResetPasswordAuth>
  >({});

  // custom hooks
  const { resetPassword, loadingAuth } = useAuth()!;

  const navigate = useNavigate();

  const { token } = useParams<{ token: string }>();

  const { themePrimeFlex, switchTheme } = useTheme();

  // functions
  const validateForm = () => {
    const fieldErrors: Partial<ResetPasswordAuth> = {};

    if (!resetPasswordData.Contrasena.trim()) {
      fieldErrors.Contrasena = "Contraseña es obligatoria.";
    }

    if (!resetPasswordData.ContrasenaConfirmacion.trim()) {
      fieldErrors.ContrasenaConfirmacion =
        "Confirmación de contraseña es obligatoria.";
    }

    setResetPasswordErrors(fieldErrors);

    return Object.keys(fieldErrors).length === 0;
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const value = (e.target && e.target.value) || "";

    setResetPasswordData((prev) => ({ ...prev, [name]: value }));

    setResetPasswordErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  useEffect(() => {
    setResetPasswordData({
      ...resetPasswordData,
      CodigoConfirmacion: token!,
    });
  }, []);

  return (
    <div
      className={
        "flex align-items-center justify-content-center overflow-hidden"
      }
      style={{
        height: "100dvh",
        backgroundImage: `url(${fondo})`,
        // backgroundPosition: "contain",
        backgroundSize: "100% 100%", // ¡Esto deforma la imagen!
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div className="flex flex-column align-items-center justify-content-center">
        {/* <img src={""} alt="Sakai logo" className="mb-5 w-6em flex-shrink-0" /> */}
        <div>
          <Card className="w-full py-3 px-2" style={{ borderRadius: "10px" }}>
            <div className="text-center mb-5">
              {/* <img
                src="/demo/images/login/avatar.png"
                alt="Image"
                height="50"
                className="mb-3"
              /> */}
              <div className="text-900 text-xl mb-1">Cambio de contraseña</div>
              <span
                className="text-xs"
                style={{
                  color: themePrimeFlex === "light" ? "#575152ff" : "#756a6cff",
                }}
              >
                A continución ingrese su nueva contraseña
              </span>
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
                  value={resetPasswordData.Contrasena}
                  onChange={(e) => {
                    onInputChange(e, "Contrasena");
                  }}
                  placeholder="Ingresa nueva contraseña"
                  toggleMask
                  inputClassName="w-full sm:w-20rem md:w-20rem "
                  feedback={false}
                  className="p-inputtext-sm"
                ></Password>
              </div>
              {/* <Password
                inputId="Contrasena"
                value={resetPasswordData.Contrasena}
                onChange={(e) => {
                  onInputChange(e, "Contrasena");
                }}
                placeholder="Ingresa tu contraseña"
                toggleMask
                inputClassName="w-full md:w-25em"
                feedback={false}
                className="p-inputtext-sm"
              ></Password> */}
              {resetPasswordErrors.Contrasena && (
                <small className="p-error">
                  {resetPasswordErrors.Contrasena}
                </small>
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
                  value={resetPasswordData.ContrasenaConfirmacion}
                  onChange={(e) => {
                    onInputChange(e, "ContrasenaConfirmacion");
                  }}
                  placeholder="Confirma nueva contraseña"
                  toggleMask
                  inputClassName="w-full sm:w-20rem md:w-20rem "
                  feedback={false}
                  className="p-inputtext-sm"
                ></Password>
              </div>
              {/* <Password
                inputId="ContrasenaConfirmacion"
                value={resetPasswordData.ContrasenaConfirmacion}
                onChange={(e) => {
                  onInputChange(e, "ContrasenaConfirmacion");
                }}
                placeholder="Confirmar contraseña"
                toggleMask
                inputClassName="w-full md:w-25em"
                feedback={false}
                className="p-inputtext-sm"
              ></Password> */}
              {resetPasswordErrors.ContrasenaConfirmacion && (
                <small className="p-error">
                  {resetPasswordErrors.ContrasenaConfirmacion}
                </small>
              )}
            </div>

            <Button
              className="w-full p-2 text-md mb-3 flex justify-content-center gap-1"
              style={{
                backgroundColor: "#D63939",
                borderColor: "#D63939",
                color: "#fff",
              }}
              loading={loadingAuth}
              onClick={() => {
                if (validateForm()) resetPassword(resetPasswordData);
              }}
            >
              Aceptar
            </Button>

            <Button
              icon={
                <>
                  <i className="pi pi-arrow-left mr-2 text-xs"></i>
                  <span className="text-sm">Volver al inicio</span>{" "}
                </>
              }
              className="w-full p-2 mt-3"
              text
              onClick={() => {
                navigate("../login");
              }}
            ></Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
