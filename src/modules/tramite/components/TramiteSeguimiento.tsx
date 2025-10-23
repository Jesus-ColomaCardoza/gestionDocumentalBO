import { Button } from "primereact/button";
import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { useTheme } from "../../../ThemeContext";
import { Tooltip } from "primereact/tooltip";
import { useAuth } from "../../auth/context/AuthContext";
import { formatDate } from "../../utils/Methods";
import { useNavigate, useParams } from "react-router-dom";
import { Tag } from "primereact/tag";
import { OrganizationChart } from "primereact/organizationchart";
import { TreeNode } from "primereact/treenode";
import UseMovimiento from "../../movimiento/hooks/UseMovimiento";
import {
  MovimientoNode,
  MovimientoSeguimientoEntity,
} from "../../movimiento/interfaces/MovimientoInterface";
import { Avatar } from "primereact/avatar";

const TramiteSeguimiento = () => {
  // custom hooks
  const { themePrimeFlex } = useTheme();

  const { userAuth } = useAuth()!;

  const navigate = useNavigate();

  const { findOneSeguimiento } = UseMovimiento();

  const params = useParams();

  //useRefs
  const toast = useRef<Toast>(null);

  const anexosRef = useRef<HTMLInputElement>(null);

  const organizationChartRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);

  const dragStart = useRef({ x: 0, y: 0 });

  //useStates
  const [loading, setLoading] = useState<boolean>(true);

  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });

  const [selectedAnexos, setSelectedAnexos] = useState<File[]>([]);

  const [moviminetoSeguimiento, setMoviminetoSeguimiento] =
    useState<MovimientoSeguimientoEntity>();

  //functions
  const nodeTemplate2 = (node: OrgNode) => {
    let iconEstatdo = "";

    switch (node.data?.HistorialMovimientoxEstado?.[0]?.Estado.IdEstado) {
      case 15:
        iconEstatdo = "pi pi-clock";
        break;
      case 16:
        iconEstatdo = "pi pi-book";
        break;
      case 17:
        iconEstatdo = "pi pi-file-plus";
        break;
      case 18:
        iconEstatdo = "pi pi-calendar-clock";
        break;
      case 19:
        iconEstatdo = "pi pi-info-circle";
        break;
      case 20:
        iconEstatdo = "pi pi-trash";
        break;
      default:
        iconEstatdo = "pi pi-clock";
        break;
    }

    if (node.type === "movimiento") {
      return (
        <div
          className="flex flex-column p-2 pb-3"
          style={{
            width: "17em",
            background: themePrimeFlex === "dark" ? "#1f1f2cff" : "#ffffffde",
            border:
              themePrimeFlex === "dark"
                ? "1px solid #1f1f2cff"
                : "1px solid #f5f5f5de",
            borderRadius: "10px",
          }}
        >
          <div className="flex flex-row justify-content-between align-items-center my-2">
            <div
              className="flex flex-column justify-content-start align-items-start"
              style={{ width: "70%" }}
            >
              <span className="text-xs">Enviado</span>
              <span style={{ textAlign: "left" }} className="text-xs">
                {node?.data?.FechaMovimiento
                  ? formatDate(new Date(node.data.FechaMovimiento))
                  : "--:--:--"}
              </span>
              <span className="text-xs">
                {node?.data?.Documento?.CodigoReferenciaDoc ?? "Sin código"}
              </span>
            </div>
            <div style={{ width: "20%" }}>
              <Avatar
                label={`${
                  ((node?.data?.NombreResponsable || "SR")
                    .split(" ")[0][0]
                    ?.toUpperCase() || "") +
                  "" +
                  ((node?.data?.NombreResponsable || "Sin responsable")
                    .split(" ")[1][0]
                    ?.toUpperCase() || "SR")
                }`}
                image={`${""}`}
                shape="circle"
              />
            </div>
          </div>
          <div className="flex flex-row  justify-content-between align-items-center border-top-1 border-bottom-1 border-gray-600 py-2">
            <div style={{ width: "20%" }}>
              <Avatar
                icon={iconEstatdo}
                shape="circle"
                style={{
                  color:
                    themePrimeFlex === "dark"
                      ? "rgba(106, 123, 216, 1)"
                      : "rgba(43, 71, 230, 1)",
                }}
              />
            </div>
            <div
              className="flex flex-column justify-content-start align-items-start"
              style={{ width: "75%" }}
            >
              <span className="text-xs">
                {node?.data?.NombreResponsable || "Sin responsable"}
              </span>
              <span style={{ textAlign: "left" }} className="text-sm font-bold">
                {node?.data?.AreaDestino?.Descripcion || "Sin área destino"}
              </span>
            </div>
          </div>

          {node.data?.HistorialMovimientoxEstado?.map((HxM, index) => {
            if (HxM?.Estado?.IdEstado === 15 || HxM?.Estado?.IdEstado === 17) {
              return null;
            }
            return (
              <div
                key={`historial-${HxM.IdHistorialMxE || index}`}
                className="flex flex-row justify-content-between align-items-center my-2"
              >
                <div
                  className="flex flex-column justify-content-start align-items-start"
                  style={{ width: "100%" }}
                >
                  <span className="text-xs">{HxM?.Estado?.Descripcion}</span>
                  {HxM?.Observaciones && HxM?.Observaciones !== "" && (
                    <span className="text-xs">{HxM?.Observaciones ?? ""}</span>
                  )}
                  {HxM?.Detalle && HxM?.Detalle !== "" && (
                    <span className="text-xs">{HxM?.Detalle ?? ""}</span>
                  )}
                  <span style={{ textAlign: "left" }} className="text-xs">
                    {HxM.FechaHistorialMxE
                      ? formatDate(new Date(HxM.FechaHistorialMxE))
                      : "--:--:--"}
                  </span>
                </div>
                {/* <div style={{ width: "20%" }}>
                  <Avatar
                    label={`${
                      userAuth?.Nombres.split(" ")[0][0].toUpperCase() +
                      "" +
                      userAuth?.ApellidoPaterno.split(" ")[0][0].toUpperCase()
                    }`}
                    image={`${userAuth?.UrlFotoPerfil}`}
                    shape="circle"
                  />
                </div> */}
              </div>
            );
          })}
        </div>
      );
    } else if (node.type === "tramite") {
      return (
        <div
          className="flex flex-column p-2 pb-3"
          style={{
            width: "17em",
            background: themePrimeFlex === "dark" ? "#1f1f2cff" : "#ffffffde",
            border:
              themePrimeFlex === "dark"
                ? "1px solid #1f1f2cff"
                : "1px solid #f5f5f5de",
            borderRadius: "10px",
          }}
        >
          <div className="flex flex-row  justify-content-between align-items-center border-bottom-1 border-gray-600 py-2">
            <div style={{ width: "20%" }}>
              <Avatar
                icon={
                  node?.data?.Tramite?.TipoTramite?.IdTipoTramite === 1
                    ? // interno
                      "pi pi-building"
                    : // externo
                      "pi pi-globe"
                }
                shape="circle"
                style={{
                  color:
                    themePrimeFlex === "dark"
                      ? "rgba(106, 123, 216, 1)"
                      : "rgba(43, 71, 230, 1)",
                }}
              />
            </div>
            <div
              className="flex flex-column justify-content-start align-items-start"
              style={{ width: "75%" }}
            >
              {node?.data?.Tramite?.TipoTramite?.IdTipoTramite === 1 ? (
                // interno
                // área de origen
                <>
                  <span style={{ textAlign: "left" }} className="text-xs">
                    {node?.data?.Tramite?.Remitente?.Nombres +
                      " " +
                      node?.data?.Tramite?.Remitente?.ApellidoPaterno +
                      " " +
                      node?.data?.Tramite?.Remitente?.ApellidoMaterno ||
                      "Sin remitente" ||
                      ""}
                  </span>
                  <span
                    style={{ textAlign: "left" }}
                    className="text-sm font-bold"
                  >
                    {node?.data?.Tramite?.Area?.Descripcion ||
                      "Sin área destino"}
                  </span>
                </>
              ) : (
                // externo
                <>
                  {/* documento de identificacion */}
                  <span
                    style={{ textAlign: "left" }}
                    className="text-sm font-bold"
                  >
                    {node?.data?.Tramite?.Remitente?.NroIdentificacion ||
                      "Sin Nro. Identificación"}
                  </span>
                  {/* usuario */}
                  <span className="text-xs">
                    {`${
                      node?.data?.Tramite?.Remitente?.Nombres +
                      " " +
                      node?.data?.Tramite?.Remitente?.ApellidoPaterno +
                      " " +
                      node?.data?.Tramite?.Remitente?.ApellidoMaterno
                    }` || "Sin remitente"}
                  </span>
                </>
              )}
            </div>
          </div>

          {node?.data?.Tramite?.TipoTramite?.IdTipoTramite === 1 ? (
            // interno
            <></>
          ) : (
            // externo
            <div className="flex flex-row justify-content-between align-items-center border-bottom-1 border-gray-600 py-2 ">
              <div
                className="flex flex-column justify-content-start align-items-start"
                style={{ width: "70%" }}
              >
                <span className="text-xs">
                  {node?.data?.Tramite?.Remitente?.Email}
                </span>
                {/* <span style={{ textAlign: "left" }} className="text-xs">
                {node?.data?.Tramite?.FechaInicio
                  ? formatDate(new Date(node?.data?.Tramite?.FechaInicio))
                  : "--:--:--"}
              </span> */}
              </div>
            </div>
          )}

          <div className="flex flex-row justify-content-between align-items-center my-2">
            <div
              className="flex flex-column justify-content-start align-items-start"
              style={{ width: "70%" }}
            >
              <span className="text-xs">Inicio trámite</span>
              <span style={{ textAlign: "left" }} className="text-xs">
                {node?.data?.Tramite?.FechaInicio
                  ? formatDate(new Date(node?.data?.Tramite?.FechaInicio))
                  : "--:--:--"}
              </span>
            </div>
            <div style={{ width: "20%" }}>
              <Avatar
                label={`${
                  node?.data?.Tramite?.Remitente?.Nombres?.split(
                    " "
                  )[0][0]?.toUpperCase() +
                  "" +
                  (node?.data?.Tramite?.Remitente?.ApellidoPaterno?.split(
                    " "
                  )[0][0]?.toUpperCase() || "SR")
                }`}
                image={`${""}`}
                shape="circle"
              />
            </div>
          </div>
        </div>
      );
    }
    return node.label;
  };

  interface OrgNode extends TreeNode {
    data?: MovimientoNode;
    type?: string;
  }

  const [treeMovimientos, setTreeMovimientos] = useState<OrgNode[]>([]);

  function mapToOrgNodes(movimientos: MovimientoNode[]): OrgNode[] {
    return movimientos
      .filter((mov) => !!mov) // evita nulls directos
      .map((mov) => {
        const nodo: OrgNode = {
          key: mov.IdMovimiento?.toString() ?? crypto.randomUUID(),
          label: "movimiento",
          type: "movimiento",
          expanded: true,
          // className: "bg-indigo-500 text-white",
          className: "p-0",
          style: { borderRadius: "12px" },
          data: { ...mov },
          children: Array.isArray(mov.Children)
            ? mapToOrgNodes(mov.Children)
            : [],
        };

        return nodo;
      });
  }

  const findOneSeguimientoMovimiento = async () => {
    setLoading(true);

    const movimiento = await findOneSeguimiento({
      IdTramite: parseInt(params.id ?? "0") || 0,
      IdMovimiento: parseInt(params.id2 ?? "0") || 0,
    });

    setLoading(false);

    if (movimiento?.message.msgId == 0 && movimiento.registro) {
      const roots = mapToOrgNodes(movimiento.registro.Seguimiento);

      const rootNode: OrgNode = {
        key: movimiento.registro.Tramite.IdTramite.toString(),
        label: "tramite",
        type: "tramite",
        expanded: true,
        className: "p-0",
        style: { borderRadius: "12px" },
        data: {
          Tramite: {
            IdTramite: movimiento.registro.Tramite.IdTramite,
            Area: movimiento.registro.Tramite.Area,
            FechaInicio: movimiento.registro.Tramite.FechaInicio,
            TipoTramite: movimiento.registro.Tramite.TipoTramite,
            Remitente: movimiento.registro.Tramite.Remitente,
          },
        },
        children: roots,
      };

      setTreeMovimientos([rootNode]);

      setMoviminetoSeguimiento(movimiento.registro);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };
    setTransform((prev) => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  //useEffects
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      let newScale = transform.scale - e.deltaY * 0.001;
      newScale = Math.min(Math.max(0.3, newScale), 2.5);
      setTransform((prev) => ({ ...prev, scale: newScale }));
    };

    if (organizationChartRef.current) {
      organizationChartRef.current.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }

    return () => {
      if (organizationChartRef.current) {
        organizationChartRef.current.removeEventListener("wheel", handleWheel);
      }
    };
  }, [transform.scale]);

  useEffect(() => {
    findOneSeguimientoMovimiento();
  }, []);

  const [data] = useState<TreeNode[]>([
    {
      expanded: true,
      label: "person",
      className: "bg-indigo-500 text-white",
      style: { borderRadius: "12px" },
      data: {
        image:
          "https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png",
        name: "Amy Elsner",
        title: "CEO",
      },
      children: [
        {
          expanded: true,
          label: "person",
          className: "bg-purple-500 text-white",
          style: { borderRadius: "12px" },
          data: {
            image:
              "https://primefaces.org/cdn/primereact/images/avatar/annafali.png",
            name: "Anna Fali",
            title: "CMO",
          },
          children: [
            {
              label: "Sales",
              className: "bg-purple-500 text-white",
              style: { borderRadius: "12px" },
            },
            {
              label: "Marketing",
              className: "bg-purple-500 text-white",
              style: { borderRadius: "12px" },
            },
          ],
        },
        {
          expanded: true,
          label: "person",
          className: "bg-teal-500 text-white",
          style: { borderRadius: "12px" },
          data: {
            image:
              "https://primefaces.org/cdn/primereact/images/avatar/stephenshaw.png",
            name: "Stephen Shaw",
            title: "CTO",
          },
          children: [
            {
              label: "Development",
              className: "bg-teal-500 text-white",
              style: { borderRadius: "12px" },
            },
            {
              label: "UI/UX Design",
              className: "bg-teal-500 text-white",
              style: { borderRadius: "12px" },
            },
          ],
        },
        {
          expanded: true,
          label: "person",
          className: "bg-teal-500 text-white",
          style: { borderRadius: "12px" },
          data: {
            image:
              "https://primefaces.org/cdn/primereact/images/avatar/stephenshaw.png",
            name: "Stephen Shaw",
            title: "CTO",
          },
          children: [
            {
              label: "Development",
              className: "bg-teal-500 text-white",
              style: { borderRadius: "12px" },
            },
            {
              label: "UI/UX Design",
              className: "bg-teal-500 text-white",
              style: { borderRadius: "12px" },
            },
          ],
        },
        {
          expanded: true,
          label: "person",
          className: "bg-teal-500 text-white",
          style: { borderRadius: "12px" },
          data: {
            image:
              "https://primefaces.org/cdn/primereact/images/avatar/stephenshaw.png",
            name: "Stephen Shaw",
            title: "CTO",
          },
          children: [
            {
              label: "Development",
              className: "bg-teal-500 text-white",
              style: { borderRadius: "12px" },
            },
            {
              label: "UI/UX Design",
              className: "bg-teal-500 text-white",
              style: { borderRadius: "12px" },
            },
          ],
        },
      ],
    },
  ]);

  return (
    <div className="card p-0 m-0">
      <Toast ref={toast} position={"bottom-right"} />

      <div
        className="flex flex-row flex-wrap justify-content-between"
        style={{ height: "70vh" }}
      >
        <div
          className="flex flex-column border-solid border-1 border-gray-500 border-round-md"
          style={{ width: "24%" }}
        >
          <div className="flex flex-column">
            <div className="flex flex-row justify-content-between align-items-center py-3 px-3 border-bottom-1 border-gray-500">
              <label
                htmlFor="ApellidoPaterno"
                className="block text-900 text-md font-bold"
                style={{
                  width: "30%",
                }}
              >
                Trámite
              </label>

              <Button
                type="button"
                onClick={() => {
                  // anexosRef.current?.click();
                  window.print();
                }}
                size="small"
                severity="contrast"
                style={{
                  padding: "0",
                  width: "6rem",
                  height: "2rem",
                  margin: "0",
                  color: "#000",
                  background: "#eee",
                  border: "none",
                }}
              >
                <span className="flex justify-content-between gap-2 align-items-center m-auto">
                  <i className="pi pi-print text-sm"></i>
                  <span>Imprimir</span>
                </span>
              </Button>
              <input
                ref={anexosRef}
                type="file"
                accept="application/pdf"
                // onChange={onChangeAnexos}
                style={{ display: "none" }}
              />
            </div>
            
            <div
              className="flex flex-row pt-3 pb-1 px-3"
              style={{ gap: "1rem" }}
            >
              <div
                style={{
                  width: "100%",
                }}
              >
                <label className="block text-900 text-sm font-bold mb-2">
                  Código de trámite
                </label>
                <span className="block text-900 text-xs mb-2">
                  {moviminetoSeguimiento?.Tramite?.IdTramite.toString().padStart(
                    8,
                    "0"
                  )}
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
                  Origen
                </label>
                <span className="block text-900 text-xs mb-2">
                  {moviminetoSeguimiento?.Tramite?.TipoTramite?.Descripcion ||
                    "Externo"}
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
                  {moviminetoSeguimiento?.Movimiento?.Asunto || "Sin Asunto"}
                </span>
              </div>
            </div>

            <div
              className="flex flex-row pt-1 pb-3 px-3"
              style={{ gap: "1rem" }}
            >
              <div
                style={{
                  width: "100%",
                }}
              >
                <label className="block text-900 text-sm font-bold mb-2">
                  Estado
                </label>

                <span className="block text-900 text-xs mb-2">
                  <Tag severity="success" className="text-white">
                    Activo
                  </Tag>
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
                Documentos
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
                {moviminetoSeguimiento?.Documentos.map((doc) => {
                  return (
                    <div
                      key={doc.Documento.IdDocumento}
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
                            // href={`${doc.Documento.UrlDocumento}`}
                            // href={`${URL.createObjectURL(doc)}`}
                            onClick={() => {
                              navigate(
                                `../tramite/documento/${doc?.Documento?.IdDocumento}`
                              );
                            }}
                            target="_blank"
                          >
                            {doc.Documento
                              ? `${
                                  doc.Documento.TipoDocumento?.Descripcion?.substring(
                                    0,
                                    3
                                  ) ?? "Doc"
                                }. ${doc.Documento.CodigoReferenciaDoc ?? ""} `
                              : ""}{" "}
                          </a>
                          <span className="flex flex-column m-0">
                            <span className="text-sm">
                              {doc.Documento.Asunto}
                            </span>
                            <span className="text-xs font-bold">
                              {doc.Documento.CreadoEl
                                ? formatDate(new Date(doc.Documento.CreadoEl))
                                : ""}{" "}
                            </span>
                          </span>
                        </div>
                      </div>
                      {/* icon trash */}
                      <div className="flex align-items-center justify-content-center pr-1">
                        <Tooltip target=".icon-bolt" />

                        {doc.Anexos > 0 && (
                          <i
                            data-pr-tooltip="Anexos"
                            className="pi pi-copy icon-bolt m-1"
                            style={{
                              color: "rgba(206, 154, 59, 1)",
                              fontSize: "1.5rem",
                            }}
                            // onClick={() => {
                            //   setSelectedAnexos((prev) => {
                            //     return prev.filter(
                            //       (p) => p.lastModified != doc.lastModified
                            //     );
                            //   });
                            // }}
                          ></i>
                        )}
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
          <div className="flex flex-row justify-content-between align-items-center py-2 px-3 border-bottom-1 border-gray-500">
            <label
              className="block text-900 text-md font-bold"
              style={{
                width: "20%",
              }}
            >
              Movimientos
            </label>

            <div
              className="flex flex-row flex-wrap justify-content-end align-items-center"
              style={{
                gap: "1rem",
              }}
            >
              <div className="d-flex align-items-center">
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">
                    <label className="text-xs">Zoom</label>
                  </span>
                  <select
                    value={transform.scale}
                    onChange={(e) =>
                      setTransform((prev) => ({
                        ...prev,
                        scale: parseFloat(e.target.value),
                      }))
                    }
                    className="p-inputgroup-addon"
                  >
                    <option value={1}>100%</option>
                    <option value={0.75}>75%</option>
                    <option value={0.5}>50%</option>
                    <option value={0.25}>25%</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={organizationChartRef}
            className="py-1"
            style={{
              overflow: "hidden",
              height: "58vh",
              cursor: isDragging.current ? "grabbing" : "grab",
              userSelect: "none",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                transformOrigin: "top left",
                transition: isDragging.current
                  ? "none"
                  : "transform 0.1s ease-out",
              }}
            >
              {/* <OrganizationChart value={data} nodeTemplate={nodeTemplate} /> */}
              {/* <OrganizationChart
                value={treeMovimientos ?? []}
                nodeTemplate={nodeTemplate2}
              /> */}
              {treeMovimientos && treeMovimientos.length > 0 && (
                <OrganizationChart
                  value={treeMovimientos}
                  nodeTemplate={nodeTemplate2}
                />
              )}
            </div>
          </div>

          <div className="flex flex-row flex-wrap justify-content-start gap-3 py-3 px-2 border-top-1 border-gray-500">
            <span className="flex gap-1 align-items-center text-xs">
              <i className="pi pi-clock text-xs" style={{ color: "#482" }}></i>
              <span>Pendiente por recibir</span>
            </span>
            <span className="flex gap-1 align-items-center  text-xs">
              <i className="pi pi-book text-xs" style={{ color: "#848" }}></i>
              <span>Recibido</span>
            </span>
            <span className="flex gap-1 align-items-center text-xs">
              <i
                className="pi pi-file-plus text-xs"
                style={{ color: "#842" }}
              ></i>
              <span>Derivado</span>
            </span>
            <span className="flex gap-1 align-items-center text-xs">
              <i
                className="pi pi-calendar-clock text-xs"
                style={{ color: "#482" }}
              ></i>
              <span>Atendido</span>
            </span>
            <span className="flex gap-1 align-items-center text-xs">
              <i
                className="pi pi-info-circle text-xs"
                style={{ color: "#26d" }}
              ></i>
              <span>Observado</span>
            </span>
            <span className="flex gap-1 align-items-center text-xs">
              <i className="pi pi-trash text-xs" style={{ color: "#a44" }}></i>
              <span>Archivado</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TramiteSeguimiento;
