import { Button } from "primereact/button";
import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { useTheme } from "../../../ThemeContext";
import { Tooltip } from "primereact/tooltip";
import { useAuth } from "../../auth/context/AuthContext";
import { formatFileSize } from "../../utils/Methods";
import { useNavigate } from "react-router-dom";
import { Tag } from "primereact/tag";
import { OrganizationChart } from "primereact/organizationchart";
import { TreeNode } from "primereact/treenode";

const TramiteSeguimiento = () => {
  // custom hooks
  const { themePrimeFlex } = useTheme();

  const { userAuth } = useAuth()!;

  const navigate = useNavigate();

  //useRefs
  const toast = useRef<Toast>(null);

  const anexosRef = useRef<HTMLInputElement>(null);

  const organizationChartRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);

  const dragStart = useRef({ x: 0, y: 0 });

  //useStates
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });

  const [selectedAnexos, setSelectedAnexos] = useState<File[]>([]);

  //functions
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

  const nodeTemplate = (node: TreeNode) => {
    if (node.label === "person") {
      return (
        <div className="flex flex-column">
          <div className="flex flex-column align-items-center">
            <img
              alt={node.data.name}
              src={node.data.image}
              className="mb-3 w-3rem h-3rem"
            />
            <span className="font-bold mb-2">{node.data.name}</span>
            <span>{node.data.title}</span>
          </div>
        </div>
      );
    }

    return node.label;
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

  useEffect(() => {}, []);

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
          className="flex flex-column justify-content-between border-solid border-1 border-gray-500 border-round-md"
          style={{ width: "24%" }}
        >
          <div className="flex flex-column">
            <div className="flex flex-row justify-content-between align-items-center py-3 px-3 border-bottom-1 border-gray-500">
              <label
                htmlFor="ApellidoPaterno"
                className="block text-900 font-medium"
                style={{
                  width: "30%",
                }}
              >
                Trámite
              </label>

              <Button
                type="button"
                onClick={() => {
                  anexosRef.current?.click();
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

            {/* <div className="flex flex-row py-1 px-4" style={{ gap: "1rem" }}>
              <div
                style={{
                  width: "100%",
                }}
              >
                <label
                  className="block text-900 text-sm font-medium mb-2"
                >
                  Archivo digital
                </label>
                <span
                  className="block text-900 text-xs  mb-2"
                >
                  Archivo digital
                </span>
              </div>
            </div> */}

            <div className="flex flex-row py-1 px-3" style={{ gap: "1rem" }}>
              <div
                style={{
                  width: "100%",
                }}
              >
                <label className="block text-900 text-sm font-medium mb-2">
                  Origen
                </label>
                <span className="block text-900 text-xs mb-2">
                  Archivo digital
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
                  Asunto
                </label>
                <span className="block text-900 text-xs mb-2">
                  Archivo digital
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
            <div className="flex flex-row align-items-center pt-3 px-4 ">
              <label
                className="block text-900 font-medium"
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
                {selectedAnexos.map((anexo) => {
                  return (
                    <div
                      key={anexo.lastModified}
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
                        <div className="flex align-items-center justify-content-center pr-2">
                          <i
                            className="pi pi-file-pdf"
                            style={{ color: "#559", fontSize: "1.5rem" }}
                          ></i>
                        </div>
                        {/* descripcion */}
                        <div className="flex flex-column gap-2">
                          <a
                            className="hover:underline hover:text-blue-300 text-xs"
                            style={{
                              textDecoration: "none",
                              color: "var(--text-color)",
                            }}
                            href={`${URL.createObjectURL(anexo)}`}
                            onClick={() => {
                              const url = URL.createObjectURL(anexo);
                              console.log(url);
                            }}
                            target="_blank"
                          >
                            {anexo.name}
                          </a>
                          <span className="flex flex-row gap-2  m-0">
                            <span className="text-sm">
                              {anexo.type.split("/")[1].toUpperCase()}
                            </span>
                            <span className="text-sm">-</span>
                            <span className="text-sm">
                              {formatFileSize(anexo.size)}
                            </span>
                          </span>
                        </div>
                      </div>
                      {/* icon trash */}
                      <div className="flex align-items-center justify-content-center pr-1">
                        <Tooltip target=".icon-bolt" />

                        <i
                          className="pi pi-trash m-1"
                          style={{ color: "#559", fontSize: "1rem" }}
                          onClick={() => {
                            setSelectedAnexos((prev) => {
                              return prev.filter(
                                (p) => p.lastModified != anexo.lastModified
                              );
                            });
                          }}
                        ></i>
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
              className="block text-900 font-medium"
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
              <OrganizationChart value={data} nodeTemplate={nodeTemplate} />
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
