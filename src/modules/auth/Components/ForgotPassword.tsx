/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { ForgotPasswordAuth } from "../interfaces/AuthInterface";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  // variables and constants
  const forgotPasswordAuth: ForgotPasswordAuth = {
    Email: "",
  };

  // states
  const [forgotPasswordData, setForgotPasswordData] =
    useState<ForgotPasswordAuth>(forgotPasswordAuth);

  const [forgotPasswordErrors, setForgotPasswordErrors] = useState<
    Partial<ForgotPasswordAuth>
  >({});

  // custom hooks
  const { forgotPassword, loadingAuth } = useAuth()!;

  const navigate = useNavigate();

  // functions
  const validateForm = () => {
    const fieldErrors: Partial<ForgotPasswordAuth> = {};

    if (!forgotPasswordData.Email.trim()) {
      fieldErrors.Email = "El email es obligatorio.";
    }

    setForgotPasswordErrors(fieldErrors);

    return Object.keys(fieldErrors).length === 0;
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const value = (e.target && e.target.value) || "";

    setForgotPasswordData((prev) => ({ ...prev, [name]: value }));

    setForgotPasswordErrors((prev) => ({ ...prev, [name]: undefined }));
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
        {/* <img src={""} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" /> */}
        <div className="my-5">
          <Card className="w-full py-3 px-2" style={{ borderRadius: "10px" }}>
            <div className="text-center mb-6">
              {/* <img
                src="/demo/images/login/avatar.png"
                alt="Image"
                height="50"
                className="mb-3"
              /> */}
              <div className="text-900 text-xl mb-1">Valicación de Email</div>
              <span className="text-200 text-xs">
                Se enviará un correo con un link para cambiar
                <br /> tu contraseña
              </span>
            </div>

            {/* <label
              htmlFor="Email"
              className="block text-900 text-xs font-medium mb-2"
            >
              Email
            </label> */}
            <div className="flex flex-column mb-6 gap-1">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-envelope"></i>
                </span>
                <InputText
                  id="Email"
                  value={forgotPasswordData.Email}
                  onChange={(e) => {
                    onInputChange(e, "Email");
                  }}
                  type="text"
                  placeholder="Ingrese su email"
                  className="p-inputtext-sm w-full md:w-18rem"
                />
              </div>
              {/* <InputText
                id="Email"
                value={forgotPasswordData.Email}
                onChange={(e) => {
                  onInputChange(e, "Email");
                }}
                type="text"
                placeholder="Search"
                className="p-inputtext-sm w-full md:w-25rem"
              /> */}
              {forgotPasswordErrors.Email && (
                <small className="p-error text-xs">
                  {forgotPasswordErrors.Email}
                </small>
              )}
            </div>

            <Button
              label="Aceptar"
              className="w-full p-2 text-md mb-3"
              loading={loadingAuth}
              onClick={() => {
                if (validateForm()) forgotPassword(forgotPasswordData);
              }}
            ></Button>

            <Button
              icon={
                <>
                  <i className="pi pi-arrow-left mr-2 text-xs"></i>
                  <span className="text-sm">Volver al inicio</span>{" "}
                </>
              }
              className="w-full p-2 "
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

export default ForgotPassword;
