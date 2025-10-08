import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { useTheme } from "../../../ThemeContext";
import { useAuth } from "../../auth/context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import UseDocumento from "../../documento/hooks/UseDocumento";
import { DocumentoDetailsEntity } from "../../documento/interfaces/DocumentoInterface";
import { formatDate } from "../../utils/Methods";

const TramiteDocumento = () => {
  // custom hooks
  const { themePrimeFlex } = useTheme();

  const { userAuth } = useAuth()!;

  const navigate = useNavigate();

  const { findOneDetails } = UseDocumento();

  const params = useParams();

  //useRefs
  const toast = useRef<Toast>(null);

  //useStates
  const [loading, setLoading] = useState<boolean>(true);

  const [documento, setDocumento] = useState<DocumentoDetailsEntity>();

  //functions
  const findOneDetailsDocumento = async () => {
    setLoading(true);

    const documentoDetails = await findOneDetails(params.id ?? "0");

    console.log(documentoDetails);

    setLoading(false);

    if (documentoDetails?.message.msgId == 0 && documentoDetails.registro) {
      setDocumento(documentoDetails.registro);
    }
  };

  //useEffects
  useEffect(() => {
    findOneDetailsDocumento();
  }, []);
  return (
    <div className="card p-0 m-0">
      <Toast ref={toast} position={"bottom-right"} />

      <div
        className="flex flex-row flex-wrap justify-content-between"
        style={{ minHeight: "70vh" }}
      >
        <div
          className="flex flex-column border-solid border-1 border-gray-500 border-round-md"
          style={{ width: "24%" }}
        >
          <div className="flex flex-column">
            <div className="flex flex-row justify-content-between align-items-center py-3 px-3 border-bottom-1 border-gray-500">
              <label
                htmlFor="ApellidoPaterno"
                className="block text-900 font-bold"
              >
                Detalles de trámite
              </label>
            </div>

            <div className="flex flex-row py-1 px-3" style={{ gap: "1rem" }}>
              <div
                style={{
                  width: "100%",
                }}
              >
                <label className="block text-900 text-sm font-bold mb-2">
                  Tipo de documento
                </label>
                <span className="block text-900 text-xs mb-2">
                  {documento?.TipoDocumento?.Descripcion.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex flex-row py-1 px-3" style={{ gap: "1rem" }}>
              <div
                style={{
                  width: "100%",
                }}
              >
                <label className="block text-900 text-sm font-bold mb-2">
                  Nº de referencia
                </label>
                <span className="block text-900 text-xs mb-2">
                  {documento?.CodigoReferenciaDoc.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex flex-row py-1 px-3" style={{ gap: "1rem" }}>
              <div
                style={{
                  width: "100%",
                }}
              >
                <label className="block text-900 text-sm font-bold mb-2">
                  Remitente
                </label>
                <span className="block text-900 text-xs mb-2">
                  {(
                    documento?.Usuario?.Nombres||"" +
                    " " +
                    documento?.Usuario?.ApellidoPaterno||"" +
                    " " +
                    documento?.Usuario?.ApellidoMaterno||""
                  ).toUpperCase()}{" "}
                </span>
              </div>
            </div>

            <div className="flex flex-row py-1 px-3" style={{ gap: "1rem" }}>
              <div
                style={{
                  width: "70%",
                }}
              >
                <label className="block text-900 text-sm font-bold mb-2">
                  Fecha de registro
                </label>
                <span className="block text-900 text-xs mb-2">
                  {documento?.CreadoEl
                    ? formatDate(new Date(documento.CreadoEl))
                    : ""}{" "}
                </span>
              </div>
              <div
                style={{
                  width: "30%",
                }}
              >
                <label className="block text-900 text-sm font-bold mb-2">
                  Folios
                </label>
                <span className="block text-900 text-xs mb-2">
                  {documento?.Folios}
                </span>
              </div>
            </div>

            <div className="flex flex-row py-1 px-3" style={{ gap: "1rem" }}>
              <div
                style={{
                  width: "100%",
                }}
              >
                <label className="block text-900 text-sm font-bold mb-2">
                  Asunto
                </label>
                <span className="block text-900 text-xs mb-2">
                  {documento?.Asunto.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex flex-row py-1 px-3" style={{ gap: "1rem" }}>
              <div
                style={{
                  width: "100%",
                }}
              >
                <label className="block text-900 text-sm font-bold mb-2">
                  Observaciones
                </label>
                <span className="block text-900 text-xs mb-2">
                  {documento?.Observaciones.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-column border-top-1 border-gray-500">
            <div className="flex flex-row align-items-center pt-3 px-3 ">
              <label
                className="block text-900 text-sm font-bold"
                style={{
                  width: "30%",
                }}
              >
                Anexos
              </label>
            </div>

            <div className="py-2 px-2">
              <div
                className="border-round-md"
                style={{
                  backgroundColor:
                    themePrimeFlex === "dark" ? "#111827" : "#ffffffde",
                  border:
                    themePrimeFlex === "dark"
                      ? "1px solid #424b57"
                      : "1px solid #d1d5db",
                  minHeight: "3rem",
                }}
              >
                {documento?.Anexo.map((anexo) => {
                  return (
                    <div
                      key={anexo.IdAnexo}
                      className="flex flex-row justify-content-between p-2"
                      style={{
                        gap: "1rem",
                        borderBottom:
                          themePrimeFlex === "dark"
                            ? "1px solid #424b57"
                            : "1px solid #d1d5db",
                      }}
                    >
                      <div className="flex flex-row gap-2">
                        {/* icon */}
                        {/* <div className="flex align-items-center justify-content-center pr-2">
                            <i
                              className="pi pi-file-pdf"
                              style={{ color: "#559", fontSize: "1.5rem" }}
                            ></i>
                          </div> */}
                        <div
                          className="flex align-items-center justify-content-center text-center border-round-md mr-2"
                          style={{
                            background:
                              themePrimeFlex === "light" ? "#eee" : "#333",
                          }}
                        >
                          <i
                            className="pi pi-file-pdf px-3 py-2 "
                            style={{
                              color:
                                themePrimeFlex === "light"
                                  ? "rgba(75, 75, 165, 1)"
                                  : "rgba(121, 121, 179, 1)",
                              fontSize: "1.3rem",
                            }}
                          ></i>
                        </div>
                        {/* descripcion */}
                        <div className="flex flex-column">
                          <a
                            className="hover:underline hover:text-blue-300 text-sm font-bold"
                            style={{
                              textDecoration: "none",
                              color: "var(--text-color)",
                            }}
                            href={`${anexo.UrlAnexo}`}
                            // href={`${URL.createObjectURL(anexo)}`}
                            target="_blank"
                          >
                            {anexo.Titulo}
                          </a>
                          <span className="flex flex-column m-0">
                            {/* <span className="text-sm">{anexo.Titulo}</span> */}
                            <span className="text-xs font-bold">
                              {anexo.CreadoEl
                                ? formatDate(new Date(anexo.CreadoEl))
                                : ""}{" "}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-column justify-content-between border-solid border-1 border-gray-500 border-round-md"
          style={{ width: "74%" }}
        >
          <div className="flex flex-row  align-items-center py-3 px-3 border-bottom-1 border-gray-500">
            <label
              className="block text-900 font-medium"
              style={{
                width: "20%",
              }}
            >
              Vista Previa
            </label>
          </div>

          <div style={{ height: "100%", border: "none" }}>
            <iframe
              src={`${documento?.UrlDocumento}`}
              title="Visor PDF"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TramiteDocumento;
