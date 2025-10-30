// https://react-pdf-viewer.dev
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DocumentoEntity } from "../interfaces/DocumentoInterface";
import { InputText } from "primereact/inputtext";
import {
  Worker,
  Viewer,
  SpecialZoomLevel,
  ScrollMode,
} from "@react-pdf-viewer/core";
import {
  defaultLayoutPlugin,
  ToolbarSlot,
} from "@react-pdf-viewer/default-layout";
import { PDFDocument, rgb } from "pdf-lib";
import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { FileManagerEntity } from "../../file-manager/interfaces/FileMangerInterface";
import {
  pageNavigationPlugin,
  RenderCurrentPageLabelProps,
  RenderGoToPageProps,
} from "@react-pdf-viewer/page-navigation";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";

import { themePlugin } from "@react-pdf-viewer/theme";
import { useTheme } from "../../../ThemeContext";

import logo from "../../../assets/img/logo.png";
import { formatDate } from "../../utils/Methods";
import { scrollModePlugin } from "@react-pdf-viewer/scroll-mode";
import { useAuth } from "../../auth/context/AuthContext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import UseFile from "../../file/hooks/UseFile";
import { Toast } from "primereact/toast";

type DocumentoFirmarProps = {
  fileManager: FileManagerEntity;
  setFileManager: Dispatch<SetStateAction<FileManagerEntity>>;
  fileManagers: FileManagerEntity[];
  setFileManagers: Dispatch<SetStateAction<FileManagerEntity[]>>;
  firmarDocumentoDialog: boolean;
  hideFirmarDocumentoDialog: () => void;
};

const DocumentoFirmar = (props: DocumentoFirmarProps) => {
  const toast = useRef<Toast>(null);

  const { themePrimeFlex } = useTheme();

  const [signature, setSignature] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragging, setDragging] = useState(false);

  const [visible, setVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);

  const { userAuth } = useAuth()!;

  const { update } = UseFile();

  const [submitted, setSubmitted] = useState<boolean>(false);

  const [pdfDimensions, setPdfDimensions] = useState<{
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const [firmante, setFirmante] = useState<{
    Nombre: string;
    NroIdentidad: string;
    Motivo: string;
    IdMotivo?: string;
    Cargo: string;
    Entidad: string;
  }>({
    Nombre: "",
    NroIdentidad: "",
    Motivo: "",
    IdMotivo: "",
    Cargo: "",
    Entidad: "",
  });

  const viewerRef = useRef<HTMLDivElement>(null);

  const signatureRef = useRef<HTMLDivElement>(null);

  const pageNavigationPluginInstance = pageNavigationPlugin();

  const scrollModePluginInstance = scrollModePlugin();

  const themePluginInstance = themePlugin();

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const { switchScrollMode } = scrollModePluginInstance;

  switchScrollMode(ScrollMode.Page);

  const {
    CurrentPageLabel,
    GoToPreviousPage,
    GoToFirstPage,
    GoToNextPage,
    GoToLastPage,
  } = pageNavigationPluginInstance;

  // Manejar clic en el contenedor del PDF para colocar la firma
  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Ignorar clics en la firma
    if (signatureRef.current && signatureRef.current.contains(target)) {
      return;
    }

    // Ignorar clics en botones y controles del visor
    if (target.closest("button") || target.closest(".rpv-core__toolbar")) {
      return;
    }

    // Colocar la firma donde se hizo clic
    if (viewerRef.current && pdfDimensions) {
      const rect = viewerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Verificar que el clic está dentro del área del PDF
      if (
        clickX >= pdfDimensions.offsetX &&
        clickX <= pdfDimensions.offsetX + pdfDimensions.width &&
        clickY >= pdfDimensions.offsetY &&
        clickY <= pdfDimensions.offsetY + pdfDimensions.height
      ) {
        setSignature({ x: clickX, y: clickY });
      }
    }
  };

  // Iniciar arrastre de la firma
  const handleSignatureMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragging(true);
  };

  const handleMouseUp = () => setDragging(false);

  // Insertar la firma en el PDF
  const handlePreviewWithSignature = async () => {
    if (!props.fileManager.UrlFM || !signature) {
      return alert("Seleccione un PDF y coloque su firma.");
    }

    if (!pdfDimensions) {
      return alert("Espere a que el PDF se cargue completamente.");
    }

    try {
      const pdfBytes = await fetch(props.fileManager.UrlFM).then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[currentPage];

      const { width: pdfWidth, height: pdfHeight } = firstPage.getSize();

      const signatureImageBytes = await fetch(logo).then((res) =>
        res.arrayBuffer()
      );
      const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

      const imgWidth = 55;
      const imgHeight = 55;

      const relativeX = signature.x - pdfDimensions.offsetX;
      const relativeY = signature.y - pdfDimensions.offsetY;

      const clampedX = Math.max(0, Math.min(relativeX, pdfDimensions.width));
      const clampedY = Math.max(0, Math.min(relativeY, pdfDimensions.height));

      const posX =
        (clampedX / pdfDimensions.width) * pdfWidth - imgWidth / 2 - 90; // 90 test value to coincidir
      const posY =
        pdfHeight -
        (clampedY / pdfDimensions.height) * pdfHeight -
        imgHeight / 2;

      console.log("Coordenadas de firma:", {
        signaturePos: signature,
        pdfDims: pdfDimensions,
        relativePos: { x: relativeX, y: relativeY },
        finalPos: { x: posX, y: posY },
      });

      firstPage.drawImage(signatureImage, {
        x: posX,
        y: posY,
        width: imgWidth,
        height: imgHeight,
      });

      //v1
      // ✅ Calcular posición del texto (a la derecha de la imagen)
      const textStartX = posX + imgWidth + 5; // 5px de separación
      const textStartY = posY + imgHeight - 10; // Alineado con la parte superior de la imagen

      // ✅ Dibujar textos alineados a la derecha de la imagen
      firstPage.drawText(`Firmado digitalemente por:`, {
        x: textStartX,
        y: textStartY,
        size: 7,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(`${firmante.Nombre}`, {
        x: textStartX,
        y: textStartY - 7,
        size: 7,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(`${firmante.NroIdentidad}`, {
        x: textStartX,
        y: textStartY - 14,
        size: 7,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(`${"Cargo: " + firmante.Cargo}`, {
        x: textStartX,
        y: textStartY - 21, // 10px debajo del nombre
        size: 7,
        color: rgb(0.1, 0.1, 0.1),
      });

      firstPage.drawText(`${"Motivo: " + firmante.Motivo}`, {
        x: textStartX,
        y: textStartY - 28, // 10px debajo del nombre
        size: 7,
        color: rgb(0.1, 0.1, 0.1),
      });

      firstPage.drawText(`${"Fecha:" + formatDate(new Date())}`, {
        x: textStartX,
        y: textStartY - 35, // 20px debajo del nombre
        size: 7,
        color: rgb(0.2, 0.2, 0.2),
      });

      firstPage.drawText(`${firmante.Entidad}`, {
        x: textStartX,
        y: textStartY - 42, // 30px debajo del nombre
        size: 7,
        color: rgb(0.1, 0.1, 0.1),
      });

      //v2
      // firstPage.drawText(`${firmante.Nombre}`, {
      //   x: posX,
      //   y: posY - 15,
      //   size: 8,
      //   color: rgb(0, 0, 0),
      // });

      // firstPage.drawText(`${firmante.Cargo}`, {
      //   x: posX,
      //   y: posY - 25,
      //   size: 8,
      //   color: rgb(0.1, 0.1, 0.1),
      // });

      // firstPage.drawText(`Fecha: ${formatDate(new Date())}`, {
      //   x: posX,
      //   y: posY - 35,
      //   size: 8,
      //   color: rgb(0.2, 0.2, 0.2),
      // });

      // firstPage.drawText(`${firmante.Entidad}`, {
      //   x: posX,
      //   y: posY - 45,
      //   size: 7,
      //   color: rgb(0.1, 0.1, 0.1),
      // });

      const pdfBytesFinal = await pdfDoc.save();

      const blob = new Blob([pdfBytesFinal as any], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.target = "_blank";

      // link.download = "documento_firmado.pdf";

      link.click();

      // setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Error al firmar el PDF:", error);
      alert("Error al firmar el documento. Por favor, intente nuevamente.");
    }
  };

  const handleSaveWithSignature = async () => {
    try {
      setSubmitted(true);

      if (!props.fileManager.UrlFM || !signature) {
        return alert("Seleccione un PDF y coloque su firma.");
      }

      if (!pdfDimensions) {
        return alert("Espere a que el PDF se cargue completamente.");
      }

      const pdfBytes = await fetch(props.fileManager.UrlFM).then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[currentPage];

      const { width: pdfWidth, height: pdfHeight } = firstPage.getSize();

      const signatureImageBytes = await fetch(logo).then((res) =>
        res.arrayBuffer()
      );
      const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

      const imgWidth = 55;
      const imgHeight = 55;

      const relativeX = signature.x - pdfDimensions.offsetX;
      const relativeY = signature.y - pdfDimensions.offsetY;

      const clampedX = Math.max(0, Math.min(relativeX, pdfDimensions.width));
      const clampedY = Math.max(0, Math.min(relativeY, pdfDimensions.height));

      const posX =
        (clampedX / pdfDimensions.width) * pdfWidth - imgWidth / 2 - 90; // 90 test value to coincidir
      const posY =
        pdfHeight -
        (clampedY / pdfDimensions.height) * pdfHeight -
        imgHeight / 2;

      // console.log("Coordenadas de firma:", {
      //   signaturePos: signature,
      //   pdfDims: pdfDimensions,
      //   relativePos: { x: relativeX, y: relativeY },
      //   finalPos: { x: posX, y: posY },
      // });

      firstPage.drawImage(signatureImage, {
        x: posX,
        y: posY,
        width: imgWidth,
        height: imgHeight,
      });

      //v1
      // ✅ Calcular posición del texto (a la derecha de la imagen)
      const textStartX = posX + imgWidth + 5; // 5px de separación
      const textStartY = posY + imgHeight - 10; // Alineado con la parte superior de la imagen

      // ✅ Dibujar textos alineados a la derecha de la imagen
      firstPage.drawText(`Firmado digitalemente por:`, {
        x: textStartX,
        y: textStartY,
        size: 7,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(`${firmante.Nombre}`, {
        x: textStartX,
        y: textStartY - 7,
        size: 7,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(`${firmante.NroIdentidad}`, {
        x: textStartX,
        y: textStartY - 14,
        size: 7,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(`${"Cargo: " + firmante.Cargo}`, {
        x: textStartX,
        y: textStartY - 21, // 10px debajo del nombre
        size: 7,
        color: rgb(0.1, 0.1, 0.1),
      });

      firstPage.drawText(`${"Motivo: " + firmante.Motivo}`, {
        x: textStartX,
        y: textStartY - 28, // 10px debajo del nombre
        size: 7,
        color: rgb(0.1, 0.1, 0.1),
      });

      firstPage.drawText(`${"Fecha:" + formatDate(new Date())}`, {
        x: textStartX,
        y: textStartY - 35, // 20px debajo del nombre
        size: 7,
        color: rgb(0.2, 0.2, 0.2),
      });

      firstPage.drawText(`${firmante.Entidad}`, {
        x: textStartX,
        y: textStartY - 42, // 30px debajo del nombre
        size: 7,
        color: rgb(0.1, 0.1, 0.1),
      });

      //v2
      // firstPage.drawText(`${firmante.Nombre}`, {
      //   x: posX,
      //   y: posY - 15,
      //   size: 8,
      //   color: rgb(0, 0, 0),
      // });

      // firstPage.drawText(`${firmante.Cargo}`, {
      //   x: posX,
      //   y: posY - 25,
      //   size: 8,
      //   color: rgb(0.1, 0.1, 0.1),
      // });

      // firstPage.drawText(`Fecha: ${formatDate(new Date())}`, {
      //   x: posX,
      //   y: posY - 35,
      //   size: 8,
      //   color: rgb(0.2, 0.2, 0.2),
      // });

      // firstPage.drawText(`${firmante.Entidad}`, {
      //   x: posX,
      //   y: posY - 45,
      //   size: 7,
      //   color: rgb(0.1, 0.1, 0.1),
      // });

      const pdfBytesFinal = await pdfDoc.save();

      const blob = new Blob([pdfBytesFinal as any], {
        type: "application/pdf",
      });

      const formData = new FormData();

      formData.append("file", blob, `documento_firmado_${Date.now()}.pdf`);

      formData.append(
        "IdDocumento",
        props.fileManager.IdFM.split("_")[1].toString()
      );

      const fileSignature = await update(formData);

      if (fileSignature?.message.msgId == 0 && fileSignature.registro) {
        toast.current?.show({
          severity: "success",
          detail: `${"Documento firmado exitosamente."}`,
          life: 5000,
        });

        setSignature(null);

        props.setFileManager((prev) => ({
          ...prev,
          UrlFM: fileSignature.registro?.url || "",
        }));

        props.setFileManagers(
          props.fileManagers.map((fm) =>
            fm.IdFM === props.fileManager.IdFM
              ? { ...fm, UrlFM: fileSignature.registro?.url || "" }
              : fm
          )
        );

        // setTimeout(() => {
        //   props.hideFirmarDocumentoDialog();
        // }, 3000);
      } else {
        toast.current?.show({
          severity: "error",
          detail: `${"Error al firmar el documento. Por favor, intente nuevamente."}`,
          life: 5000,
        });
      }

      setSubmitted(false);
    } catch (error) {
      console.error("Error al firmar el PDF:", error);
      alert("Error al firmar el documento. Por favor, intente nuevamente.");
    }
  };

  // Obtener dimensiones reales del PDF
  useEffect(() => {
    const findPdfPage = () => {
      if (!viewerRef.current) return;

      const canvas = viewerRef.current.querySelector("canvas");
      const pageContainer =
        viewerRef.current.querySelector(".rpv-core__inner-page") ||
        viewerRef.current.querySelector(".rpv-core__page-layer");

      const targetElement = canvas || pageContainer;

      if (targetElement && viewerRef.current) {
        const rect = targetElement.getBoundingClientRect();
        const containerRect = viewerRef.current.getBoundingClientRect();

        const relativeX = rect.left - containerRect.left;
        const relativeY = rect.top - containerRect.top;

        console.log("PDF dimensions found:", {
          width: rect.width,
          height: rect.height,
          offsetX: relativeX,
          offsetY: relativeY,
        });

        setPdfDimensions({
          width: rect.width,
          height: rect.height,
          offsetX: relativeX,
          offsetY: relativeY,
        });
      } else {
        setTimeout(findPdfPage, 100);
      }
    };

    if (props.fileManager.UrlFM) {
      const timer = setTimeout(findPdfPage, 1000);
      return () => clearTimeout(timer);
    }
  }, [props.fileManager.UrlFM]);

  // Detectar cambios de tamaño
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        const canvas = viewerRef.current?.querySelector("canvas");
        if (canvas && viewerRef.current) {
          const rect = canvas.getBoundingClientRect();
          const containerRect = viewerRef.current.getBoundingClientRect();

          setPdfDimensions({
            width: rect.width,
            height: rect.height,
            offsetX: rect.left - containerRect.left,
            offsetY: rect.top - containerRect.top,
          });
        }
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Eventos globales para el arrastre
  useEffect(() => {
    const handleGlobalMouseUp = () => setDragging(false);

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (dragging && viewerRef.current && signatureRef.current) {
        const rect = viewerRef.current.getBoundingClientRect();
        const signatureRect = signatureRef.current.getBoundingClientRect();

        let newX = e.clientX - rect.left;
        let newY = e.clientY - rect.top;

        if (pdfDimensions) {
          const signatureWidth = signatureRect.width;
          const signatureHeight = signatureRect.height;

          newX = Math.max(pdfDimensions.offsetX + signatureWidth / 2, newX);
          newX = Math.min(
            pdfDimensions.offsetX + pdfDimensions.width - signatureWidth / 2,
            newX
          );

          newY = Math.max(pdfDimensions.offsetY + signatureHeight / 2, newY);
          newY = Math.min(
            pdfDimensions.offsetY + pdfDimensions.height - signatureHeight / 2,
            newY
          );
        }

        setSignature({
          x: newX,
          y: newY,
        });
      }
    };

    if (dragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [dragging, pdfDimensions]);

  // Iniciar user data
  useEffect(() => {
    if (userAuth?.IdUsuario) {
      setFirmante({
        Nombre:
          userAuth.Nombres +
          " " +
          userAuth.ApellidoPaterno +
          " " +
          userAuth.ApellidoMaterno,
        NroIdentidad: userAuth.NroIdentificacion,
        Motivo: "Visto Bueno",
        Cargo: userAuth.Cargo.Descripcion,
        Entidad: "Municipalidad Distrital San Miguel de El Faique",
      });
    }
  }, [userAuth?.IdUsuario]);

  return (
    <Dialog
      visible={props.firmarDocumentoDialog}
      style={{ width: "50rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      headerClassName="py-2"
      header={
        <div style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
          PDF: {Math.round(pdfDimensions?.width || 0)}x
          {Math.round(pdfDimensions?.height || 0)}
          {/* | Offset:{" "} */}
          {/* {Math.round(pdfDimensions.offsetX)},
            {Math.round(pdfDimensions.offsetY)} */}
          {signature &&
            ` | Firma: ${Math.round(signature.x)},${Math.round(signature.y)}`}
        </div>
      }
      modal
      onHide={props.hideFirmarDocumentoDialog}
    >
      <Toast ref={toast} position={"bottom-right"} />

      <div
        style={{
          alignItems: "center",
          backgroundColor: "#eeeeee",
          borderBottom: "1px solid rgba(0, 0, 0, 0.3)",
          display: "none",
          justifyContent: "center",
          padding: "8px",
        }}
      >
        <CurrentPageLabel>
          {(props: RenderCurrentPageLabelProps) => {
            setCurrentPage(props.currentPage);
            return <></>;
          }}
        </CurrentPageLabel>
      </div>

      <div>
        <div
          style={{
            border: `1px ${
              themePrimeFlex === "dark" ? "#1A1A1A" : "#e7e2e2ff"
            } solid`,
          }}
        >
          <div
            style={{
              alignItems: "center",
              backgroundColor: `${
                themePrimeFlex === "dark" ? "#1A1A1A" : "#FFFFFF"
              }`,
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              display: "flex",
              justifyContent: "center",
              padding: "4px",
            }}
          >
            <div style={{ padding: "0px 2px", color: "#fff" }}>
              <GoToFirstPage>
                {(props: RenderGoToPageProps) => (
                  <button
                    style={{
                      backgroundColor: "#357edd",
                      border: "none",
                      borderRadius: "4px",
                      color: "#ffffff",
                      cursor: "pointer",
                      padding: "8px",
                    }}
                    onClick={props.onClick}
                  >
                    <i className="pi pi-step-backward"></i>
                  </button>
                )}
              </GoToFirstPage>
            </div>
            <div style={{ padding: "0px 2px" }}>
              <GoToPreviousPage>
                {(props: RenderGoToPageProps) => (
                  <button
                    style={{
                      backgroundColor: "#357edd",
                      border: "none",
                      borderRadius: "4px",
                      color: "#ffffff",
                      cursor: "pointer",
                      padding: "8px",
                    }}
                    // It will be disabled if the current page is the first page
                    disabled={props.isDisabled}
                    onClick={props.onClick}
                  >
                    <i className="pi pi-caret-left"></i>
                  </button>
                )}
              </GoToPreviousPage>{" "}
            </div>
            <div
              style={{
                padding: "0px 2px",
                width: "100px",
                textAlign: "center",
              }}
            >
              <CurrentPageLabel>
                {(props: RenderCurrentPageLabelProps) => (
                  <span
                    style={{
                      color: `${
                        themePrimeFlex === "dark" ? "#f5f5f5" : "#1A1A1A"
                      }`,
                    }}
                  >
                    Pag. {props.currentPage + 1} de {props.numberOfPages}
                  </span>
                )}
              </CurrentPageLabel>
            </div>
            <div style={{ padding: "0px 2px" }}>
              <GoToNextPage>
                {(props: RenderGoToPageProps) => (
                  <button
                    style={{
                      backgroundColor: "#357edd",
                      border: "none",
                      borderRadius: "4px",
                      color: "#ffffff",
                      cursor: "pointer",
                      padding: "8px",
                    }}
                    // It will be disabled if we are already at the last page
                    disabled={props.isDisabled}
                    onClick={props.onClick}
                  >
                    <i className="pi pi-caret-right"></i>
                  </button>
                )}
              </GoToNextPage>{" "}
            </div>
            <div style={{ padding: "0px 2px" }}>
              <GoToLastPage>
                {(props: RenderGoToPageProps) => (
                  <button
                    style={{
                      backgroundColor: "#357edd",
                      border: "none",
                      borderRadius: "4px",
                      color: "#ffffff",
                      cursor: "pointer",
                      padding: "8px",
                    }}
                    onClick={props.onClick}
                  >
                    <i className="pi pi-step-forward"></i>
                  </button>
                )}
              </GoToLastPage>{" "}
            </div>
          </div>
          <div
            ref={viewerRef}
            onClick={handleContainerClick}
            style={{
              position: "relative",
              border: "none",
              height: "65vh",
              overflow: "auto",
              cursor: dragging ? "grabbing" : "crosshair",
            }}
          >
            {props.fileManager.UrlFM && (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={props.fileManager.UrlFM}
                  plugins={[
                    // defaultLayoutPluginInstance,
                    scrollModePluginInstance,
                    themePluginInstance,
                    pageNavigationPluginInstance,
                  ]}
                  theme={themePrimeFlex === "dark" ? "dark" : "light"}
                  defaultScale={SpecialZoomLevel.PageFit}
                />
              </Worker>
            )}

            {signature && (
              <div
                ref={signatureRef}
                onMouseDown={handleSignatureMouseDown}
                style={{
                  position: "absolute",
                  left: signature.x,
                  top: signature.y,
                  transform: "translate(-55%, -45%)",
                  border: "2px dashed #007ad9",
                  padding: "7px",
                  backgroundColor: "rgba(255, 255, 255, 0.55)",
                  borderRadius: "6px",
                  cursor: dragging ? "grabbing" : "grab",
                  userSelect: "none",
                  zIndex: 1000,
                  maxWidth: "200px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
                className="flex flex-row"
              >
                <div className="flex justify-content-center align-items-center mr-1">
                  <img
                    src={logo}
                    alt="Logo Firma"
                    style={{
                      width: "35px",
                      height: "35px",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                </div>
                <div className="flex flex-column justify-content-center">
                  <span style={{ color: "#000", fontSize: ".25rem" }}>
                    {"Firmado digitalmente por:"}
                  </span>
                  <span style={{ color: "#000", fontSize: ".25rem" }}>
                    {firmante.Nombre}
                  </span>
                  <span style={{ color: "#000", fontSize: ".25rem" }}>
                    {firmante.NroIdentidad}
                  </span>
                  <span style={{ color: "#333", fontSize: ".25rem" }}>
                    {"Cargo: " + firmante.Cargo}
                  </span>
                  <span style={{ color: "#333", fontSize: ".25rem" }}>
                    {"Motivo: " + firmante.Motivo}
                  </span>
                  <span style={{ color: "#666", fontSize: ".25rem" }}>
                    {"Fecha: " + formatDate(new Date())}
                  </span>
                  <span style={{ color: "#333", fontSize: ".25rem" }}>
                    {firmante.Entidad}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex justify-content-center gap-3">
          {/* <div className="flex gap-2"> */}
          <Button
            style={{
              color: "#fff",
              padding: ".7em 1em",
              width: "11em",
            }}
            className="text-xs"
            label="Ver Datos"
            icon="pi pi-user-edit"
            severity="secondary"
            onClick={() => setVisible(true)}
          />
          <Button
            style={{
              color: "#fff",
              padding: ".7em 1em",
              width: "11em",
            }}
            className="text-xs"
            label="Quitar Firma"
            icon="pi pi-times"
            severity="danger"
            onClick={() => setSignature(null)}
            disabled={!signature}
          />
          {/* </div> */}
          {/* <div className="flex gap-2"> */}
          <Button
            style={{
              color: "#fff",
              border: "none",
              padding: ".7em 1em",
              width: "11em",
            }}
            className="text-xs"
            label="Preview PDF"
            // icon="pi pi-download"
            icon="pi pi-eye"
            severity="info"
            onClick={handlePreviewWithSignature}
            disabled={!signature}
          />
          {/* {signature && ( */}

          <Button
            style={{
              color: "#fff",
              padding: ".7em 1em",
              width: "11em",
            }}
            className="text-xs"
            label="Firmar"
            icon="pi pi-pencil"
            severity="warning"
            onClick={handleSaveWithSignature}
            disabled={!signature}
            loading={submitted}
          />
          {/* </div> */}
          {/* )} */}
        </div>

        <Dialog
          headerClassName="p-3 pb-0"
          contentClassName="p-3"
          header="Datos del Firmante"
          visible={visible}
          style={{ width: "25vw" }}
          onHide={() => setVisible(false)}
        >
          <div className="flex flex-column gap-2">
            <span className="flex flex-column">
              <label htmlFor="Nombre">Nombre completo</label>
              <InputText
                id="Nombre"
                value={firmante.Nombre}
                onChange={(e) =>
                  setFirmante({ ...firmante, Nombre: e.target.value })
                }
              />
            </span>

            <span className="flex flex-column">
              <label htmlFor="NroIdentidad">Nro Identidad</label>
              <InputText
                id="NroIdentidad"
                value={firmante.NroIdentidad}
                onChange={(e) =>
                  setFirmante({ ...firmante, NroIdentidad: e.target.value })
                }
              />
            </span>

            <span className="flex flex-column">
              <label htmlFor="Cargo">Cargo</label>
              <InputText
                id="Cargo"
                value={firmante.Cargo}
                onChange={(e) =>
                  setFirmante({ ...firmante, Cargo: e.target.value })
                }
              />
            </span>
            <span className="flex flex-column">
              <label htmlFor="Motivo">Motivo</label>
              <Dropdown
                value={{ name: firmante.Motivo, code: firmante.IdMotivo }}
                onChange={(e: DropdownChangeEvent) =>
                  setFirmante({
                    ...firmante,
                    Motivo: e.value.name,
                    IdMotivo: e.value.code,
                  })
                }
                options={[
                  { name: "Visto Bueno", code: "VB" },
                  { name: "Revisión", code: "R" },
                  { name: "Otro", code: "O" },
                ]}
                optionLabel="name"
                placeholder="seleccionar motivo"
                className="w-full"
              />
              {/* <InputText
                id="Motivo"
                value={firmante.Motivo}
                onChange={(e) =>
                  setFirmante({ ...firmante, Motivo: e.target.value })
                }
              /> */}
            </span>

            <span className="flex flex-column">
              <label htmlFor="Entidad">Entidad / Empresa</label>
              <InputText
                id="Entidad"
                value={firmante.Entidad}
                onChange={(e) =>
                  setFirmante({ ...firmante, Entidad: e.target.value })
                }
              />
            </span>
          </div>
          <div className="flex justify-content-end mt-3">
            <Button
              size="small"
              label="Guardar"
              icon="pi pi-check"
              onClick={() => setVisible(false)}
            />
          </div>
        </Dialog>
      </div>
    </Dialog>
  );
};

export default DocumentoFirmar;
