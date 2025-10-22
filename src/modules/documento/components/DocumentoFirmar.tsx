import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DocumentoEntity } from "../interfaces/DocumentoInterface";
import { InputText } from "primereact/inputtext";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { PDFDocument, rgb } from "pdf-lib";
import { useState, useRef, useEffect } from "react";
import { FileManagerEntity } from "../../file-manager/interfaces/FileMangerInterface";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { themePlugin } from "@react-pdf-viewer/theme";
import { useTheme } from "../../../ThemeContext";

import logo from "../../../assets/img/logo.png";
import { formatDate } from "../../utils/Methods";

type DocumentoFirmarProps = {
  fileManager: FileManagerEntity;
  firmarDocumentoDialog: boolean;
  hideFirmarDocumentoDialog: () => void;
};

const DocumentoFirmar = (props: DocumentoFirmarProps) => {
  const { themePrimeFlex } = useTheme();

  const [signature, setSignature] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragging, setDragging] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pdfDimensions, setPdfDimensions] = useState<{
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const [firmante, setFirmante] = useState({
    Nombre: "Jesús Coloma",
    Cargo: "Analista TI",
    Motivo: "En señal de conformidad",
    Entidad: "Municipalidad de San Miguel de El Faique",
    NroIdentidad: "87654321",
  });

  const viewerRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const themePluginInstance = themePlugin();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // ✅ Obtener dimensiones reales del PDF
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

  // ✅ Detectar cambios de tamaño
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

  // ✅ Manejar clic en el contenedor del PDF para colocar la firma
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

  // ✅ Iniciar arrastre de la firma
  const handleSignatureMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragging(true);
  };

  const handleMouseUp = () => setDragging(false);

  // ✅ Eventos globales para el arrastre
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

  // ✅ Insertar la firma en el PDF
  const handleDownloadWithSignature = async () => {
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
      const firstPage = pages[0];
      const { width: pdfWidth, height: pdfHeight } = firstPage.getSize();

      const signatureImageBytes = await fetch(logo).then((res) =>
        res.arrayBuffer()
      );
      const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

      const imgWidth = 50;
      const imgHeight = 50;

      const relativeX = signature.x - pdfDimensions.offsetX;
      const relativeY = signature.y - pdfDimensions.offsetY;

      const clampedX = Math.max(0, Math.min(relativeX, pdfDimensions.width));
      const clampedY = Math.max(0, Math.min(relativeY, pdfDimensions.height));

      const posX = ((clampedX / pdfDimensions.width) * pdfWidth - imgWidth / 2)-90;// 90 test value to coincidir
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
      firstPage.drawText(`${firmante.Nombre}`, {
        x: textStartX,
        y: textStartY,
        size: 8,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(`${firmante.Cargo}`, {
        x: textStartX,
        y: textStartY - 10, // 10px debajo del nombre
        size: 8,
        color: rgb(0.1, 0.1, 0.1),
      });

      firstPage.drawText(`Fecha: ${formatDate(new Date())}`, {
        x: textStartX,
        y: textStartY - 20, // 20px debajo del nombre
        size: 8,
        color: rgb(0.2, 0.2, 0.2),
      });

      firstPage.drawText(`${firmante.Entidad}`, {
        x: textStartX,
        y: textStartY - 30, // 30px debajo del nombre
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

      link.download = "documento_firmado.pdf";

      link.click();

      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Error al firmar el PDF:", error);
      alert("Error al firmar el documento. Por favor, intente nuevamente.");
    }
  };

  return (
    <Dialog
      visible={props.firmarDocumentoDialog}
      style={{ width: "50rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      headerClassName="py-2"
      modal
      onHide={props.hideFirmarDocumentoDialog}
    >
      <div>
        <div
          ref={viewerRef}
          onClick={handleContainerClick}
          style={{
            position: "relative",
            border: "none",
            marginTop: "1rem",
            height: "70vh",
            overflow: "auto",
            cursor: dragging ? "grabbing" : "crosshair",
          }}
        >
          {props.fileManager.UrlFM && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={props.fileManager.UrlFM}
                plugins={[defaultLayoutPluginInstance, themePluginInstance]}
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
                transform: "translate(-50%, -50%)",
                border: "2px dashed #007ad9",
                padding: "10px",
                backgroundColor: "rgba(255,255,255,0.95)",
                borderRadius: "8px",
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
                    width: "45px",
                    height: "45px",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </div>
              <div
                className="flex flex-column justify-content-center"
                style={{
                  fontSize: "8px",
                }}
              >
                <span style={{ color: "#000", fontSize: ".3rem" }}>
                  {"Firmado digitalmente por:"}
                </span>
                <span style={{ color: "#000", fontSize: ".3rem" }}>
                  {firmante.Nombre}
                </span>
                <span style={{ color: "#000", fontSize: ".3rem" }}>
                  {firmante.NroIdentidad}
                </span>
                <span style={{ color: "#333", fontSize: ".3rem" }}>
                  {"Motivo: " + firmante.Motivo}
                </span>
                <span style={{ color: "#666", fontSize: ".3rem" }}>
                  {"Fecha: " + formatDate(new Date())}
                </span>
                <span style={{ color: "#333", fontSize: ".3rem" }}>
                  {"Cargo: " + firmante.Cargo}
                </span>
                <span style={{ color: "#333", fontSize: ".3rem" }}>
                  {firmante.Entidad}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 flex gap-3">
          <Button
            label="Confirmar Datos"
            icon="pi pi-user-edit"
            onClick={() => setVisible(true)}
          />
          <Button
            label="Descargar PDF con Firma"
            icon="pi pi-download"
            severity="success"
            onClick={handleDownloadWithSignature}
            disabled={!signature}
          />
          {signature && (
            <Button
              label="Quitar Firma"
              icon="pi pi-times"
              severity="danger"
              onClick={() => setSignature(null)}
            />
          )}
        </div>

        {/* Debug info */}
        {pdfDimensions && (
          <div style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
            PDF: {Math.round(pdfDimensions.width)}x
            {Math.round(pdfDimensions.height)} | Offset:{" "}
            {Math.round(pdfDimensions.offsetX)},
            {Math.round(pdfDimensions.offsetY)}
            {signature &&
              ` | Firma: ${Math.round(signature.x)},${Math.round(signature.y)}`}
          </div>
        )}

        <Dialog
          header="Datos del Firmante"
          visible={visible}
          style={{ width: "30vw" }}
          onHide={() => setVisible(false)}
        >
          <div className="flex flex-column gap-3">
            <span className="p-float-label">
              <InputText
                id="nombre"
                value={firmante.Nombre}
                onChange={(e) =>
                  setFirmante({ ...firmante, Nombre: e.target.value })
                }
              />
              <label htmlFor="nombre">Nombre completo</label>
            </span>

            <span className="p-float-label">
              <InputText
                id="cargo"
                value={firmante.Cargo}
                onChange={(e) =>
                  setFirmante({ ...firmante, Cargo: e.target.value })
                }
              />
              <label htmlFor="cargo">Cargo</label>
            </span>

            <span className="p-float-label">
              <InputText
                id="entidad"
                value={firmante.Entidad}
                onChange={(e) =>
                  setFirmante({ ...firmante, Entidad: e.target.value })
                }
              />
              <label htmlFor="entidad">Entidad / Empresa</label>
            </span>

            <Button
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
