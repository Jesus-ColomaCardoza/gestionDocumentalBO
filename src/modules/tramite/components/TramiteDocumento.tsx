import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { useTheme } from "../../../ThemeContext";
import { useAuth } from "../../auth/context/AuthContext";
import { useNavigate } from "react-router-dom";

const TramiteDocumento = () => {
  // custom hooks
  const { themePrimeFlex } = useTheme();

  const { userAuth } = useAuth()!;

  const navigate = useNavigate();

  //useRefs
  const toast = useRef<Toast>(null);

  //useStates

  //functions
  // const createTramiteEmitido = async () => {
  //   setSubmitted(true);
  //   if (
  //     tramite.Asunto.trim() &&
  //     tramite.IdTipoDocumento != 0 &&
  //     tramite.CodigoReferencia.trim() &&
  //     tramite.IdRemitente != 0 &&
  //     tramite.Folios != 0
  //   ) {
  //     // setLoadingTramiteCreateOrUpdate(true);
  //     let arrayAnexosUpload: AnexoEntity[] = [];

  //     //1 we create anexos physical files
  //     const uploadResults = await Promise.all(
  //       Array.from(selectedAnexos).map(async (anexo) => {
  //         const formData = new FormData();

  //         formData.append("file", anexo);

  //         const anexoUpload = await createFile(formData);

  //         if (anexoUpload?.message?.msgId === 0) {
  //           const data = {
  //             Titulo: anexoUpload.registro?.parseoriginalname!,
  //             FormatoAnexo: anexoUpload.registro?.mimetype,
  //             NombreAnexo: anexoUpload.registro?.filename,
  //             UrlAnexo: anexoUpload.registro?.url!,
  //             SizeAnexo: anexoUpload.registro?.size,
  //             UrlBase: anexoUpload.registro?.path,
  //             IdTramite: 0,
  //             Activo: true,
  //           };

  //           arrayAnexosUpload.push(data);

  //           return {
  //             success: true,
  //             data: data,
  //           };
  //         } else {
  //           return {
  //             success: false,
  //             error: anexoUpload?.message?.msgTxt || "Error desconocido",
  //           };
  //         }
  //       })
  //     );

  //     // const successfulUploads = uploadResults
  //     //   .filter((r) => r.success)
  //     //   .map((r) => r.data);

  //     const failedUploads = uploadResults.filter((r) => !r.success);

  //     if (failedUploads.length > 0) {
  //       toast.current?.show({
  //         severity: "error",
  //         detail: "No se pudieron cargar todos los anexos.",
  //         life: 3000,
  //       });
  //       return;
  //     }

  //     //2 we create tramite
  //     let tramiteCreateEmitido = await createEmitido({
  //       CodigoReferencia: tramite.CodigoReferencia,
  //       Asunto: tramite.Asunto,
  //       // Descripcion: tramite.Descripcion,
  //       Observaciones: tramite.Observaciones,
  //       FechaInicio: new Date().toISOString(),
  //       // FechaFin:tramite.FechaFin,
  //       Folios: tramite.Folios,

  //       IdTipoTramite: tramite.IdTipoTramite || 1, // IdTipoTramite - 1 - interno

  //       IdTipoDocumento: tramite.IdTipoDocumento,
  //       IdAreaEmision: tramite.IdAreaEmision,
  //       IdEstado: tramite.IdEstado || 1, // IdTipoTramite - 1 - ver estado nuevo o algo asi
  //       IdRemitente: tramite.IdRemitente,
  //       Activo: tramite.Activo,

  //       DigitalFiles: selectedDigitalFiles,
  //       TramiteDestinos: selectedTramiteDestinos,
  //       Anexos: arrayAnexosUpload,
  //     });

  //     // setLoadingTramiteCreateOrUpdate(false);

  //     if (
  //       tramiteCreateEmitido?.message.msgId == 0 &&
  //       tramiteCreateEmitido.registro
  //     ) {
  //       setTramites([...tramites, tramiteCreateEmitido.registro]);

  //       navigate("../tramite/emitido");

  //       toast.current?.show({
  //         severity: "success",
  //         detail: `${tramiteCreateEmitido.message.msgTxt}`,
  //         life: 3000,
  //       });
  //     } else if (tramiteCreateEmitido?.message.msgId == 1) {
  //       toast.current?.show({
  //         severity: "error",
  //         detail: `${tramiteCreateEmitido.message.msgTxt}`,
  //         life: 3000,
  //       });
  //     }

  //     // setSelectedAnexos([])
  //     // setFileManagerDialog(false);
  //     // setTramite(emptyTramite);
  //   }
  // };

  //useEffects
  useEffect(() => {}, []);

  return (
    <div className="card p-0 m-0">
      <Toast ref={toast} position={"bottom-right"} />

      <div className="flex flex-row flex-wrap justify-content-between">
        <div
          className="flex flex-column justify-content-between border-solid border-1 border-gray-500 border-round-md"
          style={{ width: "24%" }}
        >
          <div className="flex flex-column">
            <div className="flex flex-row justify-content-between align-items-center py-3 px-3 border-bottom-1 border-gray-500">
              <label
                htmlFor="ApellidoPaterno"
                className="block text-900 font-medium"
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
                <label className="block text-900 text-sm font-medium mb-2">
                  Tipo de documento
                </label>
                <span className="block text-900 text-xs mb-2">
                  {"Informe".toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex flex-row py-1 px-3" style={{ gap: "1rem" }}>
              <div
                style={{
                  width: "100%",
                }}
              >
                <label className="block text-900 text-sm font-medium mb-2">
                  Nº de referencia
                </label>
                <span className="block text-900 text-xs mb-2">
                  {"1110009998877".toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex flex-row py-1 px-3" style={{ gap: "1rem" }}>
              <div
                style={{
                  width: "100%",
                }}
              >
                <label className="block text-900 text-sm font-medium mb-2">
                  Remitente
                </label>
                <span className="block text-900 text-xs mb-2">
                  {"Jesus Coloma cardoza".toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex flex-row py-1 px-3" style={{ gap: "1rem" }}>
              <div
                style={{
                  width: "70%",
                }}
              >
                <label className="block text-900 text-sm font-medium mb-2">
                  Fecha de registro
                </label>
                <span className="block text-900 text-xs mb-2">
                  {new Date().toLocaleString()}
                  {/* {af.CreadoEl ? new Date(af.CreadoEl) : null} */}
                </span>
              </div>
              <div
                style={{
                  width: "30%",
                }}
              >
                <label className="block text-900 text-sm font-medium mb-2">
                  Folios
                </label>
                <span className="block text-900 text-xs mb-2">{20}</span>
              </div>
            </div>

            <div className="flex flex-row py-1 px-3" style={{ gap: "1rem" }}>
              <div
                style={{
                  width: "100%",
                }}
              >
                <label className="block text-900 text-sm font-medium mb-2">
                  Asunto
                </label>
                <span className="block text-900 text-xs mb-2">
                  {"lorem infrome de estado para prueba de concepto en informática y tecnologías".toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex flex-row py-1 px-3" style={{ gap: "1rem" }}>
              <div
                style={{
                  width: "100%",
                }}
              >
                <label className="block text-900 text-sm font-medium mb-2">
                  Observaciones
                </label>
                <span className="block text-900 text-xs mb-2">
                  {"lorem infrome de estado para prueba de concepto en informática y tecnologías".toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-column border-top-1 border-gray-500">
            <div className="flex flex-row align-items-center pt-3 px-4 ">
              <label
                className="block text-900 font-medium"
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
                {
                  // selectedAnexos.map((anexo) => {
                  //   return (
                  //     <div
                  //       key={anexo.lastModified}
                  //       className="flex flex-row justify-content-between p-2"
                  //       style={{
                  //         gap: "1rem",
                  //         borderBottom:
                  //           themePrimeFlex === "dark"
                  //             ? "1px solid #424b57"
                  //             : "1px solid #d1d5db",
                  //       }}
                  //     >
                  //       <div className="flex flex-row gap-2">
                  //         {/* icon */}
                  //         <div className="flex align-items-center justify-content-center pr-2">
                  //           <i
                  //             className="pi pi-file-pdf"
                  //             style={{ color: "#559", fontSize: "1.5rem" }}
                  //           ></i>
                  //         </div>
                  //         {/* descripcion */}
                  //         <div className="flex flex-column gap-2">
                  //           <a
                  //             className="hover:underline hover:text-blue-300 text-xs"
                  //             style={{
                  //               textDecoration: "none",
                  //               color: "var(--text-color)",
                  //             }}
                  //             href={`${URL.createObjectURL(anexo)}`}
                  //             onClick={() => {
                  //               const url = URL.createObjectURL(anexo);
                  //               console.log(url);
                  //             }}
                  //             target="_blank"
                  //           >
                  //             {anexo.name}
                  //           </a>
                  //           <span className="flex flex-row gap-2  m-0">
                  //             <span className="text-sm">
                  //               {anexo.type.split("/")[1].toUpperCase()}
                  //             </span>
                  //             <span className="text-sm">-</span>
                  //             <span className="text-sm">
                  //               {formatFileSize(anexo.size)}
                  //             </span>
                  //           </span>
                  //         </div>
                  //       </div>
                  //     </div>
                  //   );
                  // })
                }
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
              src="https://www.unp.edu.pe/transparenciaunp/down/reglamentotesistitulo133cu22032018.pdf"
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
