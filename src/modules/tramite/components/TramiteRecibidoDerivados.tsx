import { Button } from "primereact/button";
import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";
import { useTheme } from "../../../ThemeContext";
import UseTipoDocumento from "../../tipo-documento/hooks/UseTipoDocumento";
import { TipoDocumentoEntity } from "../../tipo-documento/interfaces/TipoDocumentoInterface";
import { UsuarioEntity } from "../../usuario/interfaces/UsuarioInterface";
import UseUsuario from "../../usuario/hooks/UseUsuario";
import { AreaEntity } from "../../area/interfaces/AreaInterface";
import UseArea from "../../area/hooks/UseArea";
import { Tooltip } from "primereact/tooltip";
import { formatDate } from "../../utils/Methods";
import { MovimientoDetailsEntity } from "../../movimiento/interfaces/MovimientoInterface";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Toolbar } from "primereact/toolbar";
import ConfirmModal from "../../utils/shared/ConfirmModal";
import UseMovimiento from "../../movimiento/hooks/UseMovimiento";

const TramiteRecibidoDerivados = () => {
  // custom hooks
  const { themePrimeFlex } = useTheme();

  const { findAllDetails, removeDetails } = UseMovimiento();

  const { findAll: findAllTipoDocumento } = UseTipoDocumento();

  const { findAll: findAllRemitentes } = UseUsuario();

  const { findAll: findAllAreas } = UseArea();

  const navigate = useNavigate();

  const location = useLocation();

  const { selectedTramitesRecibidos, tramiteRecibido } = location.state || {};

  const params = useParams();

  //useRefs
  const toast = useRef<Toast>(null);

  //useStates
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [confirmModal, setConfirmModal] = useState<boolean>(false); //close

  const [tiposDocumento, setTiposDocumento] = useState<
    Pick<TipoDocumentoEntity, "IdTipoDocumento" | "Descripcion">[]
  >([]);

  const [remitentes, setRemitentes] = useState<
    Pick<
      UsuarioEntity,
      "IdUsuario" | "Nombres" | "ApellidoPaterno" | "ApellidoMaterno"
    >[]
  >([]);

  const [areas, setAreas] = useState<
    Pick<AreaEntity, "IdArea" | "Descripcion">[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [moviminetosDetails, setMoviminetosDetails] = useState<
    MovimientoDetailsEntity[]
  >([]);

  const [idMovimientoToDelete, setIdMovimientoToDelete] = useState<number>(0);

  //functions
  const findAllDetailsMovimiento = async () => {
    setLoading(true);
    const movimientos = await findAllDetails({
      cantidad_max: "0",
      Language: "ES",
      filters: [
        {
          campo: "IdMovimientoPadre",
          operador: "EQ",
          tipo: "numeric2",
          valor1: `${params.id ?? "0"}`,
          valor2: "",
        },
      ],
    });
    console.log(movimientos);

    setLoading(false);

    if (movimientos?.message.msgId == 0 && movimientos.registro) {
      setMoviminetosDetails(movimientos.registro);
    }
  };

  const removeTramiteDerivado = async () => {
    setSubmitted(true);

    //2 we create tramite
    let movimiento = await removeDetails(idMovimientoToDelete.toString());

    setSubmitted(false);

    if (movimiento?.message.msgId == 0 && movimiento.registro) {
      setMoviminetosDetails((prev) => {
        return prev?.filter(
          (md) => md?.IdMovimiento != movimiento.registro?.IdMovimiento
        );
      });

      toast.current?.show({
        severity: "success",
        detail: `${movimiento.message.msgTxt}`,
        life: 3000,
      });
    } else if (movimiento?.message.msgId == 1) {
      toast.current?.show({
        severity: "error",
        detail: `${movimiento.message.msgTxt}`,
        life: 3000,
      });
    }

    hideConfirmDialog();
  };

  // actions CRUD - Esquema TipoDocumento (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllTipoDocumentoCombox = async () => {
    setLoading(true);
    const tiposDocumentoFindAll = await findAllTipoDocumento();
    setLoading(false);

    if (
      tiposDocumentoFindAll?.message.msgId == 0 &&
      tiposDocumentoFindAll.registro
    ) {
      setTiposDocumento(
        Array.isArray(tiposDocumentoFindAll.registro)
          ? tiposDocumentoFindAll.registro?.map((af) => {
              return {
                IdTipoDocumento: af.IdTipoDocumento,
                Descripcion: af.Descripcion,
              };
            })
          : []
      );
    }
  };

  // actions CRUD - Remitente (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllRemitenteCombox = async () => {
    setLoading(true);
    const remitentesFindAll = await findAllRemitentes();
    setLoading(false);

    if (remitentesFindAll?.message.msgId == 0 && remitentesFindAll.registro) {
      setRemitentes(
        Array.isArray(remitentesFindAll.registro)
          ? remitentesFindAll.registro?.map((af) => {
              return {
                IdUsuario: af.IdUsuario,
                Nombres: af.Nombres,
                ApellidoPaterno: af.ApellidoPaterno,
                ApellidoMaterno: af.ApellidoMaterno,
                NombreCompleto: `${af.Nombres} ${af.ApellidoPaterno} ${af.ApellidoMaterno}`,
              };
            })
          : []
      );
    }
  };

  // actions CRUD - Area (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllAreaCombox = async () => {
    setLoading(true);
    const areasFindAll = await findAllAreas();
    setLoading(false);

    if (areasFindAll?.message.msgId == 0 && areasFindAll.registro) {
      setAreas(
        Array.isArray(areasFindAll.registro)
          ? areasFindAll.registro?.map((af) => {
              return {
                IdArea: af.IdArea,
                Descripcion: af.Descripcion,
              };
            })
          : []
      );
    }
  };

  // templates to dialogs
  const hideConfirmDialog = () => {
    setConfirmModal(false);
  };

  const showConfirmDialog = (idMovimiento: number | undefined) => {
    if (idMovimiento) {
      setIdMovimientoToDelete(idMovimiento);
    }

    setConfirmModal(true);
  };

  //useEffects
  useEffect(() => {
    findAllTipoDocumentoCombox();
    findAllRemitenteCombox();
    findAllAreaCombox();
    findAllDetailsMovimiento();
  }, []);

  return (
    <div className="card p-0 m-0">
      <Toast ref={toast} position={"bottom-right"} />

      <Toolbar
        style={{
          margin: "0",
          padding: "0",
          marginBottom: "1em",
          border: "none",
        }}
        start={
          <div className="flex flex-column p-1 gap-2">
            <h3 className="m-0">Derivaciones</h3>
          </div>
        }
      />

      <div className="flex flex-row flex-wrap justify-content-between">
        <div
          className="flex flex-column justify-content-between border-solid border-1 border-gray-500 border-round-md"
          style={{ width: "49%" }}
        >
          <div className="flex flex-column">
            <div className="flex flex-row align-items-center py-3 mb-3 px-4 border-bottom-1 border-gray-500">
              <label
                className="block text-900 font-medium"
                style={{
                  width: "30%",
                }}
              >
                Trámite Documentario
              </label>
            </div>

            <div className="flex flex-row px-4" style={{ gap: "1rem" }}>
              <div
                style={{
                  width: "50%",
                }}
              >
                <label
                  htmlFor="CodigoReferencia"
                  className="block text-900 text-sm font-medium mb-2"
                >
                  Trámite
                </label>
                <div className="flex flex-column mb-3 gap-1">
                  <div className="p-inputgroup">
                    <InputTextarea
                      id="IdTramite"
                      value={
                        selectedTramitesRecibidos?.length > 0
                          ? selectedTramitesRecibidos
                              .map(
                                (str: any, index: number) =>
                                  `${
                                    index + 1
                                  }. ${str.Tramite?.IdTramite.toString().padStart(
                                    8,
                                    "0"
                                  )}`
                              )
                              .join("\n")
                          : tramiteRecibido?.Tramite?.IdTramite.toString().padStart(
                              8,
                              "0"
                            )
                      }
                      // onChange={(e) => {
                      //   onInputTextChange(e, "IdTramite");
                      // }}
                      className="p-inputtext-sm "
                      rows={
                        selectedTramitesRecibidos?.length > 0
                          ? selectedTramitesRecibidos?.length
                          : 1
                      }
                    />
                  </div>
                  {/* {tramiteErrors.IdTramite && (
                          <small className="p-error">{tramiteErrors.IdTramite}</small>
                        )} */}
                </div>
              </div>

              <div
                style={{
                  width: "50%",
                }}
              >
                <label
                  htmlFor="CodigoReferencia"
                  className="block text-900 text-sm font-medium mb-2"
                >
                  Documento
                </label>
                <div className="flex flex-column mb-3 gap-1">
                  <div className="p-inputgroup">
                    <InputTextarea
                      id="Documento"
                      value={
                        selectedTramitesRecibidos?.length > 0
                          ? selectedTramitesRecibidos
                              .map(
                                (str: any, index: number) =>
                                  `${index + 1}. ${
                                    (str.Documento?.TipoDocumento
                                      ?.Descripcion || "") +
                                    " " +
                                    (str.Documento?.CodigoReferenciaDoc || "")
                                  }`
                              )
                              .join("\n")
                          : tramiteRecibido?.Documento?.TipoDocumento
                              ?.Descripcion +
                            " " +
                            tramiteRecibido?.Documento?.CodigoReferenciaDoc
                      }
                      // onChange={(e) => {
                      //   onInputTextChange(e, "Documento");
                      // }}
                      className="p-inputtext-sm"
                      rows={
                        selectedTramitesRecibidos?.length > 0
                          ? selectedTramitesRecibidos?.length
                          : 1
                      }
                    />
                  </div>
                  {/* {tramiteErrors.Documento && (
                          <small className="p-error">
                            {tramiteErrors.Documento}
                          </small>
                        )} */}
                </div>
              </div>
            </div>

            <div className="flex flex-column px-4">
              <label
                htmlFor="CodigoReferencia"
                className="block text-900 text-sm font-medium mb-2"
              >
                Asunto
              </label>
              <div className="flex flex-column mb-3 gap-1">
                <div className="p-inputgroup">
                  <InputTextarea
                    id="Asunto"
                    value={
                      selectedTramitesRecibidos?.length > 0
                        ? selectedTramitesRecibidos
                            .map(
                              (str: any, index: number) =>
                                `${index + 1}. ${str.Documento?.Asunto || ""}`
                            )
                            .join("\n")
                        : tramiteRecibido?.Documento?.Asunto
                    }
                    // onChange={(e) => {
                    //   onInputTextChange(e, "Asunto");
                    // }}
                    className="p-inputtext-sm "
                    rows={
                      selectedTramitesRecibidos?.length > 0
                        ? selectedTramitesRecibidos?.length
                        : 1
                    }
                  />
                </div>
                {/* {tramiteErrors.Asunto && (
                        <small className="p-error">{tramiteErrors.Asunto}</small>
                      )} */}
              </div>
            </div>

            <div className="flex flex-column px-4">
              <label
                htmlFor="CodigoReferencia"
                className="block text-900 text-sm font-medium mb-2"
              >
                Ubicación
              </label>
              <div className="flex flex-column mb-3 gap-1">
                <div className="p-inputgroup">
                  <InputTextarea
                    id="Ubicacion"
                    value={
                      selectedTramitesRecibidos?.length > 0
                        ? selectedTramitesRecibidos
                            .map(
                              (str: any, index: number) =>
                                `${index + 1}. ${
                                  str?.AreaDestino?.Descripcion || ""
                                }`
                            )
                            .join("\n")
                        : tramiteRecibido?.AreaDestino?.Descripcion
                    }
                    // onChange={(e) => {
                    //   onInputTextChange(e, "Ubicacion");
                    // }}
                    className="p-inputtext-sm "
                    rows={
                      selectedTramitesRecibidos?.length > 0
                        ? selectedTramitesRecibidos?.length
                        : 1
                    }
                  />
                </div>
                {/* {tramiteErrors.Ubicacion && (
                        <small className="p-error">{tramiteErrors.Ubicacion}</small>
                      )} */}
              </div>
            </div>

            <div className="flex flex-row justify-content-end py-3 px-4">
              <Button
                type="button"
                onClick={() => {
                  navigate("../tramite/recibido");
                }}
                size="small"
                severity="contrast"
                style={{
                  padding: "0",
                  width: "50%",
                  height: "2.5rem",
                  margin: "0",
                  color: "#000",
                  background: "#eee",
                  border: "none",
                }}
              >
                <span className="flex justify-content-between gap-2 align-items-center m-auto">
                  {/* <i className="pi pi-plus text-sm"></i> */}
                  <span>Volver</span>
                </span>
              </Button>
            </div>
          </div>
        </div>

        <div
          className="flex flex-column flex-wrap border-solid border-1 border-gray-500 border-round-md"
          style={{ width: "49%" }}
        >
          <div className="flex flex-row justify-content-between align-items-center p-3 border-bottom-1 border-gray-500">
            <label
              htmlFor="ApellidoPaterno"
              className="block text-900 font-medium"
              style={{
                width: "30%",
              }}
            >
              Derivaciones
            </label>
          </div>

          <div className="px-4">
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
                margin: ".5em 0",
              }}
            >
              {moviminetosDetails.map((mov) => {
                return (
                  <div
                    key={mov.IdMovimiento}
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
                          className="hover:underline hover:text-blue-300 text-sm"
                          style={{
                            textDecoration: "none",
                            color: "var(--text-color)",
                          }}
                          // href={`${URL.createObjectURL(mov.)}`}
                          // onClick={() => {
                          //   const url = URL.createObjectURL(mov.);
                          //   console.log(url);
                          // }}
                          target="_blank"
                        >
                          {mov.AreaDestino?.Descripcion}
                        </a>
                        <span className="flex flex-row gap-2  m-0">
                          <span className="text-xs">
                            {mov.FechaMovimiento
                              ? formatDate(new Date(mov.FechaMovimiento))
                              : ""}
                          </span>
                          <span className="text-xs">-</span>
                          <span className="text-sm">
                            {
                              mov?.HistorialMovimientoxEstado?.[0]?.Estado
                                .Descripcion
                            }
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
                          showConfirmDialog(mov.IdMovimiento);
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

      <ConfirmModal
        submitted={submitted}
        titleModal="Confirmación"
        typeMessage="danger"
        message="¿Estás seguro de realizar esta acción?"
        typeButton="danger"
        state={confirmModal}
        hideDialog={hideConfirmDialog}
        callBack={removeTramiteDerivado}
      />
    </div>
  );
};

export default TramiteRecibidoDerivados;
