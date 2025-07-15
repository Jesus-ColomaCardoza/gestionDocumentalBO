import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/menuitem";
import { SplitButton } from "primereact/splitbutton";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { useState, useEffect, useRef } from "react";
import UseTramite from "../hooks/UseTramite";
import { ColumnMeta } from "../../utils/Interfaces";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import {
  TramiteCreate,
  TramiteEntity,
  TramiteOut,
  TramitesOut,
} from "../interfaces/TramiteInterface";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { columns, defaultFilters, emptyTramite } from "../utils/Constants";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { useTheme } from "../../../ThemeContext";
import UseTipoDocumento from "../../tipo-documento/hooks/UseTipoDocumento";
import { TipoDocumentoEntity } from "../../tipo-documento/interfaces/TipoDocumentoInterface";
import { UsuarioEntity } from "../../usuario/interfaces/UsuarioInterface";
import UseUsuario from "../../usuario/hooks/UseUsuario";
import { AreaEntity } from "../../area/interfaces/AreaInterface";
import UseArea from "../../area/hooks/UseArea";
import TipoDocumento from "../../tipo-documento/components/TipoDocumento";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import FileManagerModal from "../../file-manager/components/FileMangerModal";
import { FileManagerEntity } from "../../file-manager/interfaces/FileMangerInterface";
import { Tooltip } from "primereact/tooltip";

const TramiteEmitido = () => {
  // custom hooks
  const { themePrimeFlex } = useTheme();

  const { create, createEmitido, findAll, findOne, update, remove } =
    UseTramite();

  const { findAll: findAllTipoDocumento } = UseTipoDocumento();

  const { findAll: findAllRemitentes } = UseUsuario();

  const { findAll: findAllAreas } = UseArea();

  //useRefs
  const toast = useRef<Toast>(null);

  //useStates
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingTramiteCreateOrUpdate, setLoadingTramiteCreateOrUpdate] =
    useState<boolean>(false);

  const [tramite, setTramite] = useState<TramiteEntity>(emptyTramite);

  const [tramiteErrors, setTramiteErrors] = useState<any>({});

  const [tramites, setTramites] = useState<TramiteEntity[]>([]);

  const [selectedTramites, setSelectedTramites] = useState<TramiteEntity[]>([]);

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

  const [fileManagerDialog, setFileManagerDialog] = useState<boolean>(false);

  const [tramiteDialog, setTramiteDialog] = useState<{
    type?: "create" | "update" | undefined;
    state: boolean;
  }>({
    state: false,
  });

  const [removeTramiteDialog, setRemoveTramiteDialog] =
    useState<boolean>(false);

  const [removeTramitesDialog, setRemoveTramitesDialog] =
    useState<boolean>(false);

  const [selectedDigitalFiles, setSelectedDigitalFiles] = useState<
    FileManagerEntity[]
  >([]);

  //functions
  const createTramiteEmitido = async () => {
    setSubmitted(true);
    if (
      tramite.Asunto.trim() &&
      tramite.IdTipoDocumento != 0 &&
      tramite.CodigoReferencia.trim() &&
      tramite.IdRemitente != 0 &&
      tramite.Folios != 0
    ) {
      setLoadingTramiteCreateOrUpdate(true);
      let tramiteCreateEmitido = await createEmitido({
        CodigoReferencia: tramite.CodigoReferencia,
        Asunto: tramite.Asunto,
        Descripcion: tramite.Descripcion,
        Observaciones: tramite.Observaciones,
        FechaInicio: new Date().toISOString(),
        // FechaFin:tramite.FechaFin,
        Folios: tramite.Folios,
        IdTipoTramite: tramite.IdTipoTramite,
        IdTipoDocumento: tramite.IdTipoDocumento,
        IdEstado: tramite.Folios,
        IdRemitente: tramite.IdRemitente,
        Activo: tramite.Activo,
      });
      setLoadingTramiteCreateOrUpdate(false);

      if (
        tramiteCreateEmitido?.message.msgId == 0 &&
        tramiteCreateEmitido.registro
      ) {
        setTramites([...tramites, tramiteCreateEmitido.registro]);
        toast.current?.show({
          severity: "success",
          detail: `${tramiteCreateEmitido.message.msgTxt}`,
          life: 3000,
        });
      } else if (tramiteCreateEmitido?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${tramiteCreateEmitido.message.msgTxt}`,
          life: 3000,
        });
      }

      setFileManagerDialog(false);
      setTramite(emptyTramite);
    }
  };

  // const updateTramite = async () => {
  //   setSubmitted(true);
  //   if (tramite.IdTramite) {
  //     setLoadingTramiteCreateOrUpdate(true);
  //     let tramiteUpdate = await update(tramite.IdTramite.toString(), {
  //       Descripcion: tramite.Descripcion,
  //       IdEsquemaTramite: tramite.IdEsquemaTramite,
  //       Activo: tramite.Activo,
  //     });
  //     setLoadingTramiteCreateOrUpdate(false);

  //     if (tramiteUpdate?.message.msgId == 0 && tramiteUpdate.registro) {
  //       setTramites(
  //         tramites?.map((tramite) =>
  //           tramite.IdTramite === tramiteUpdate?.registro?.IdTramite
  //             ? { ...tramite, ...tramiteUpdate.registro }
  //             : tramite
  //         )
  //       );
  //       toast.current?.show({
  //         severity: "success",
  //         detail: `${tramiteUpdate.message.msgTxt}`,
  //         life: 3000,
  //       });
  //     } else if (tramiteUpdate?.message.msgId == 1) {
  //       toast.current?.show({
  //         severity: "error",
  //         detail: `${tramiteUpdate.message.msgTxt}`,
  //         life: 3000,
  //       });
  //     }

  //     setTramiteDialog({ state: false });
  //     setTramite(emptyTramite);
  //   }
  // };

  // const removeTramite = async () => {
  //   if (tramite.IdTramite) {
  //     let tramiteRemove = await remove(tramite.IdTramite.toString());

  //     if (tramiteRemove?.message.msgId == 0 && tramiteRemove.registro) {
  //       setTramites(
  //         tramites?.filter(
  //           (tramite) =>
  //             tramite.IdTramite !== tramiteRemove?.registro?.IdTramite
  //         )
  //       );
  //       toast.current?.show({
  //         severity: "success",
  //         detail: `${tramiteRemove.message.msgTxt}`,
  //         life: 3000,
  //       });
  //     } else if (tramiteRemove?.message.msgId == 1) {
  //       toast.current?.show({
  //         severity: "error",
  //         detail: `${tramiteRemove.message.msgTxt}`,
  //         life: 3000,
  //       });
  //     }

  //     setRemoveTramiteDialog(false);
  //     setTramite(emptyTramite);
  //   }
  // };

  const removeSelectedTramites = () => {
    let _tramites = tramites.filter(
      (val: TramiteEntity) => !selectedTramites?.includes(val)
    );

    setTramites(_tramites);
    setRemoveTramitesDialog(false);
    setSelectedTramites([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Tramites Removed",
      life: 3000,
    });
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
  const hideFilerManagerDialog = () => {
    setSubmitted(false);
    setFileManagerDialog(false);
  };

  const showFilerManagerDialog = () => {
    setSubmitted(false);
    setFileManagerDialog(true);
  };

  const onActivoChange = (e: RadioButtonChangeEvent) => {
    let _tramite = { ...tramite };

    _tramite["Activo"] = e.value;
    setTramite(_tramite);
  };

  const onInputTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";

    setTramite((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const onInputNumberChange = (e: InputNumberChangeEvent, name: string) => {
    const val = e.value ?? null;

    setTramite((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const onInputTextAreaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";
    let _tramite = { ...tramite };

    // @ts-ignore
    _tramite[name] = val;

    setTramite(_tramite);
  };

  const onDropdownChange = (
    e: DropdownChangeEvent,
    nameObj: string,
    nameFK: string,
    nameTagFK?: string
  ) => {
    const val = (e.target && e.target.value) || "";

    let _tramite: any = { ...tramite };

    _tramite[nameTagFK ? nameTagFK : nameFK] = val[nameFK];
    _tramite[nameObj] = { ...val };

    setTramite(_tramite);
  };

  // const onInputTextTramiteChange = (
  //   e: React.ChangeEvent<HTMLTextTramiteElement>,
  //   name: string
  // ) => {
  //   const val = (e.target && e.target.value) || "";
  //   let _tramite = { ...tramite };

  //   // @ts-ignore
  //   _tramite[name] = val;

  //   setTramite(_tramite);
  // };

  // const onInputNumberChange = (
  //   e: InputNumberValueChangeEvent,
  //   name: string
  // ) => {
  //   const val = e.value ?? 0;
  //   let _tramite = { ...tramite };

  //   // @ts-ignore
  //   _tramite[name] = val;

  //   setTramite(_tramite);
  // };

  const validateForm = () => {
    let fieldErrors: any = {};

    if (!tramite.Asunto.trim()) {
      fieldErrors.Asunto = "Asunto es obligatorio.";
    }

    if (tramite.IdTipoDocumento == 0) {
      fieldErrors.IdTipoDocumento = "Tipo de documento es obligatorio.";
    }

    if (!tramite.CodigoReferencia.trim()) {
      fieldErrors.CodigoReferencia = "Codigo de referencia es obligatoria.";
    }

    if (tramite.IdRemitente == 0) {
      fieldErrors.IdRemitente = "Remitente es obligatorio.";
    }

    if (tramite.Folios == 0) {
      fieldErrors.Folios = "Folios es obligatorio.";
    }

    if (tramite.IdAreaEmision == 0) {
      fieldErrors.IdAreaEmision = "Área de emisión es obligatoria.";
    }

    setTramiteErrors(fieldErrors);

    return Object.keys(fieldErrors).length === 0;
  };

  //useEffects
  useEffect(() => {
    findAllTipoDocumentoCombox();
    findAllRemitenteCombox();
    findAllAreaCombox();
  }, []);

  return (
    <div className="card p-0 m-0">
      <Toast ref={toast} position={"bottom-right"} />

      <div className="flex flex-row flex-wrap justify-content-between">
        <div
          className="flex flex-column flex-wrap gap-1  border-solid border-1 border-gray-500 border-round-md"
          style={{ width: "49%" }}
        >
          <div className="flex flex-row align-items-center pb-3 mb-3  py-2 px-4 border-bottom-1 border-gray-500">
            <label
              className="block text-900 font-medium"
              style={{
                width: "20%",
              }}
            >
              Documento
            </label>

            <div
              className="flex flex-row flex-wrap justify-content-end align-items-center"
              style={{
                width: "80%",
                gap: "1rem",
              }}
            >
              <Button
                type="button"
                onClick={showFilerManagerDialog}
                size="small"
                severity="secondary"
                style={{
                  padding: "0",
                  width: "10rem",
                  height: "2.5rem",
                  margin: "0",
                  color: "#fff",
                }}
              >
                <span className="flex justify-content-between gap-2 align-items-center m-auto text-white">
                  <i className="pi pi-file-import text-sm"></i>
                  <span>Buscar archivo</span>
                </span>
              </Button>
              <Button
                type="button"
                // onClick={} ga
                size="small"
                style={{
                  padding: "0",
                  width: "10rem",
                  height: "2.5rem",
                  margin: "0",
                  color: "#fff",
                }}
              >
                <span className="flex justify-content-between gap-2 align-items-center m-auto text-white">
                  <i className="pi pi-file-plus text-sm"></i>
                  <span>Cargar archivo</span>
                </span>
              </Button>
            </div>
          </div>

          <div className="flex flex-row py-2 px-4" style={{ gap: "1rem" }}>
            <div
              style={{
                width: "100%",
              }}
            >
              <label
                htmlFor="ApellidoPaterno"
                className="block text-900 text-sm font-medium mb-2"
              >
                Archivo digital
              </label>

              <div
                className="my-3 border-round-md"
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
                {selectedDigitalFiles.map((df) => {
                  return (
                    <div
                      key={df.IdFM}
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
                            style={{ color: "#559", fontSize: "2rem" }}
                          ></i>
                        </div>
                        {/* descripcion */}
                        <div className="flex flex-column gap-2">
                          <span className="hover:text-blue-500">
                            {df.Descripcion}
                          </span>
                          <span className="flex flex-row gap-2  m-0">
                            <span className="text-sm">
                              {df.Estado.Descripcion}
                            </span>
                            <span className="text-sm">-</span>
                            <span className="text-sm">
                              {df.Estado.Descripcion}
                            </span>
                          </span>
                        </div>
                      </div>
                      {/* icon trash */}
                      <div className="flex align-items-center justify-content-center pr-1">
                        <Tooltip target=".icon-bolt" />
                        <i
                          className="pi pi-bolt m-1 icon-bolt"
                          style={{ color: "#559", fontSize: "1rem" }}
                          data-pr-tooltip="Firmar"
                          onClick={() => {
                            // code about signature a document
                          }}
                        ></i>
                        <i
                          className="pi pi-trash m-1"
                          style={{ color: "#559", fontSize: "1rem" }}
                          onClick={() => {
                            setSelectedDigitalFiles((prev) => {
                              return prev.filter((p) => p.IdFM != df.IdFM);
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

          <div className="flex flex-row px-4" style={{ gap: "1rem" }}>
            <div
              style={{
                width: "50%",
              }}
            >
              <label
                htmlFor="TipoDocumento"
                className="block text-900 text-sm font-medium mb-2"
              >
                Tipo de documento
              </label>
              <div className="flex flex-column mb-3 gap-1">
                <div className="p-inputgroup">
                  <Dropdown
                    value={tramite.TipoDocumento}
                    onChange={(e) => {
                      onDropdownChange(e, "TipoDocumento", "IdTipoDocumento");
                    }}
                    options={tiposDocumento}
                    optionLabel="Descripcion"
                    filter
                    placeholder="Seleccionar Tipo Documento"
                    className="w-full flex flex-row align-items-center p-inputtext-sm"
                    showClear
                    style={{
                      paddingTop: "1.2rem",
                      paddingBottom: "1.2rem",
                      width: "16rem",
                      height: "2rem",
                    }}
                  />
                </div>
                {tramiteErrors.IdTipoDocumento && (
                  <small className="p-error">
                    {tramiteErrors.IdTipoDocumento}
                  </small>
                )}
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
                Nº de referencia
              </label>
              <div className="flex flex-column mb-3 gap-1">
                <div className="p-inputgroup">
                  <InputText
                    id="CodigoReferencia"
                    value={tramite.CodigoReferencia}
                    onChange={(e) => {
                      onInputTextChange(e, "CodigoReferencia");
                    }}
                    type="text"
                    placeholder="Nº de referencia"
                    className="p-inputtext-sm "
                  />
                </div>
                {tramiteErrors.CodigoReferencia && (
                  <small className="p-error">
                    {tramiteErrors.CodigoReferencia}
                  </small>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row px-4" style={{ gap: "1rem" }}>
            <div
              style={{
                width: "70%",
              }}
            >
              <label
                htmlFor="Remitente"
                className="block text-900 text-sm font-medium mb-2"
              >
                Remitente
              </label>
              <div className="flex flex-column mb-3 gap-1">
                <div className="p-inputgroup">
                  <Dropdown
                    value={tramite.Remitente}
                    onChange={(e) => {
                      onDropdownChange(
                        e,
                        "Remitente",
                        "IdUsuario",
                        "IdRemitente"
                      );
                    }}
                    options={remitentes}
                    optionLabel="NombreCompleto"
                    filter
                    placeholder="Seleccionar Remitente"
                    className="w-full flex flex-row align-items-center p-inputtext-sm"
                    showClear
                    style={{
                      paddingTop: "1.2rem",
                      paddingBottom: "1.2rem",
                      width: "16rem",
                      height: "2rem",
                    }}
                  />
                </div>
                {tramiteErrors.IdRemitente && (
                  <small className="p-error">{tramiteErrors.IdRemitente}</small>
                )}
              </div>
            </div>

            <div
              style={{
                width: "30%",
              }}
            >
              <label
                htmlFor="Folios"
                className="block text-900 text-sm font-medium mb-2"
              >
                Folios
              </label>
              <div className="flex flex-column mb-3 gap-1">
                <div className="p-inputgroup">
                  <InputNumber
                    id="Folios"
                    value={tramite.Folios}
                    onChange={(e) => {
                      onInputNumberChange(e, "Folios");
                    }}
                    type="text"
                    placeholder="Folios"
                    className="p-inputtext-sm "
                  />
                </div>
                {tramiteErrors.Folios && (
                  <small className="p-error">{tramiteErrors.Folios}</small>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row px-4" style={{ gap: "1rem" }}>
            <div
              style={{
                width: "100%",
              }}
            >
              <label
                htmlFor="Asunto"
                className="block text-900 text-sm font-medium mb-2"
              >
                Asunto
              </label>
              <div className="flex flex-column mb-3 gap-1">
                <div className="p-inputgroup">
                  <InputTextarea
                    id="Asunto"
                    value={tramite.Asunto}
                    onChange={(e) => onInputTextAreaChange(e, "Asunto")}
                    autoFocus
                    rows={2}
                    // className={classNames({
                    //   "p-invalid": props.submitted && !props.documento.Asunto,
                    // })}
                  />
                </div>
                {tramiteErrors.Asunto && (
                  <small className="p-error">{tramiteErrors.Asunto}</small>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row px-4" style={{ gap: "1rem" }}>
            <div
              style={{
                width: "100%",
              }}
            >
              <label
                htmlFor="Observaciones"
                className="block text-900 text-sm font-medium mb-2"
              >
                Observaciones
              </label>
              <div className="flex flex-column mb-3 gap-1">
                <div className="p-inputgroup">
                  <InputTextarea
                    id="Observaciones"
                    value={tramite.Observaciones}
                    onChange={(e) => onInputTextAreaChange(e, "Observaciones")}
                    rows={3}
                  />
                </div>
                {tramiteErrors.Observaciones && (
                  <small className="p-error">
                    {tramiteErrors.Observaciones}
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-column flex-wrap gap-3 border-solid border-1 border-gray-500 border-round-md"
          style={{ width: "49%" }}
        >
          <div className="flex flex-row align-items-center py-3 mb-3 px-4 border-bottom-1 border-gray-500">
            <label
              className="block text-900 font-medium"
              style={{
                width: "30%",
              }}
            >
              Trámite
            </label>
          </div>

          <div className="flex flex-row  px-4" style={{ gap: "1rem" }}>
            <div
              style={{
                width: "100%",
              }}
            >
              <label
                htmlFor="AreaEmision"
                className="block text-900 text-sm font-medium mb-2"
              >
                Área Emisión
              </label>
              <div className="flex flex-column  gap-1">
                <div className="p-inputgroup">
                  <Dropdown
                    value={tramite.Area}
                    onChange={(e) => {
                      onDropdownChange(e, "Area", "IdArea", "IdAreaEmision");
                    }}
                    options={areas}
                    optionLabel="Descripcion"
                    filter
                    placeholder="Seleccionar Área de Emisión"
                    className="w-full flex flex-row align-items-center p-inputtext-sm"
                    showClear
                    style={{
                      paddingTop: "1.2rem",
                      paddingBottom: "1.2rem",
                      width: "16rem",
                      height: "2rem",
                    }}
                  />
                </div>
                {tramiteErrors.IdAreaEmision && (
                  <small className="p-error">
                    {tramiteErrors.IdAreaEmision}
                  </small>
                )}
              </div>
            </div>
          </div>

          <div className=" px-4">
            <div className="flex flex-row justify-content-between align-items-center mb-2">
              <label
                htmlFor="ApellidoPaterno"
                className="block text-900 text-sm font-medium"
                style={{
                  width: "30%",
                }}
              >
                Destino
              </label>

              <Button
                type="button"
                // onClick={findAllTramite}
                size="small"
                severity="secondary"
                style={{
                  padding: "0",
                  width: "7rem",
                  height: "2.5rem",
                  margin: "0",
                  color: "#fff",
                  background: "#293",
                  border: "none",
                }}
              >
                <span className="flex justify-content-between gap-2 align-items-center m-auto text-white">
                  <i className="pi pi-plus text-sm"></i>
                  <span>Agregar</span>
                </span>
              </Button>
            </div>

            <div
              className="mt-3 border-round-md"
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
              <div
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
                      className="pi pi-user"
                      style={{ color: "#e55", fontSize: "2rem" }}
                    ></i>
                  </div>
                  {/* descripcion */}
                  <div className="flex flex-column gap-2">
                    <span className="hover:text-orange-500">Descripcion</span>
                    <span className="text-sm m-0">kk</span>
                  </div>
                </div>
                {/* icon trash */}
                <div className="flex align-items-center justify-content-center pr-1">
                  <i
                    className="pi pi-trash"
                    style={{ color: "#e55", fontSize: "1rem" }}
                  ></i>
                </div>
              </div>

              <div
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
                      className="pi pi-building"
                      style={{ color: "#e55", fontSize: "2rem" }}
                    ></i>
                  </div>
                  {/* descripcion */}
                  <div className="flex flex-column gap-2">
                    <span className="hover:text-orange-500">Descripcion</span>
                    <span className="text-sm m-0">kk</span>
                  </div>
                </div>
                {/* icon trash */}
                <div className="flex align-items-center justify-content-center pr-1">
                  <i
                    className="pi pi-trash"
                    style={{ color: "#e55", fontSize: "1rem" }}
                  ></i>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-content-between align-items-center mt-3 py-2 px-4  pb-3 border-bottom-1 border-top-1 border-gray-500">
            <label
              htmlFor="ApellidoPaterno"
              className="block text-900 font-medium"
              style={{
                width: "30%",
              }}
            >
              Anexos
            </label>

            <Button
              type="button"
              // onClick={findAllTramite}
              size="small"
              severity="contrast"
              style={{
                padding: "0",
                width: "7rem",
                height: "2.5rem",
                margin: "0",
                color: "#000",
                background: "#eee",
                border: "none",
              }}
            >
              <span className="flex justify-content-between gap-2 align-items-center m-auto">
                <i className="pi pi-plus text-sm"></i>
                <span>Agregar</span>
              </span>
            </Button>
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
              }}
            >
              <div
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
                      className="pi pi-user"
                      style={{ color: "#e55", fontSize: "2rem" }}
                    ></i>
                  </div>
                  {/* descripcion */}
                  <div className="flex flex-column gap-2">
                    <span className="hover:text-orange-500">Descripcion</span>
                    <span className="text-sm m-0">kk</span>
                  </div>
                </div>
                {/* icon trash */}
                <div className="flex align-items-center justify-content-center pr-1">
                  <i
                    className="pi pi-trash"
                    style={{ color: "#e55", fontSize: "1rem" }}
                  ></i>
                </div>
              </div>

              <div
                className="flex flex-row justify-content-between p-2 "
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
                      className="pi pi-building"
                      style={{ color: "#e55", fontSize: "2rem" }}
                    ></i>
                  </div>
                  {/* descripcion */}
                  <div className="flex flex-column gap-2">
                    <span className="hover:text-orange-500">Descripcion</span>
                    <span className="text-sm m-0">kk</span>
                  </div>
                </div>
                {/* icon trash */}
                <div className="flex align-items-center justify-content-center pr-1">
                  <i
                    className="pi pi-trash"
                    style={{ color: "#e55", fontSize: "1rem" }}
                  ></i>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row py-2 px-4" style={{ gap: "1rem" }}>
            <Button
              type="button"
              // onClick={findAllTramite}
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
                <span>Cancelar</span>
              </span>
            </Button>

            <Button
              type="button"
              onClick={validateForm}
              size="small"
              style={{
                padding: "0",
                width: "50%",
                height: "2.5rem",
                margin: "0",
                color: "#000",
              }}
            >
              <span className="flex justify-content-between gap-2 align-items-center m-auto text-white">
                <i className="pi pi-send text-sm"></i>
                <span>Enviar</span>
              </span>
            </Button>
          </div>
        </div>
      </div>

      <FileManagerModal
        submitted={submitted}
        hideFilerManagerDialog={hideFilerManagerDialog}
        fileManagerDialog={fileManagerDialog}
        selectedDigitalFiles={selectedDigitalFiles}
        setSelectedDigitalFiles={setSelectedDigitalFiles}
      />
      {/* <TramiteCreateOrUpdate
        submitted={submitted}
        tramite={tramite}
        esquemaTramites={esquemaTramites}
        tramiteDialog={tramiteDialog}
        hideDialog={hideDialog}
        createTramite={createTramite}
        updateTramite={updateTramite}
        onInputTextChange ={onInputTextChange }
        onDropdownChange={onDropdownChange}
        onActivoChange={onActivoChange}
        loadingTramiteCreateOrUpdate={loadingTramiteCreateOrUpdate}
      />

      <TramiteRemove
        tramite={tramite}
        removeTramiteDialog={removeTramiteDialog}
        hideRemoveTramiteDialog={hideRemoveTramiteDialog}
        removeTramite={removeTramite}
      />

      <TramitesRemove
        tramite={tramite}
        removeTramitesDialog={removeTramitesDialog}
        hideRemoveTramitesDialog={hideRemoveTramitesDialog}
        removeSelectedTramites={removeSelectedTramites}
      /> */}
    </div>
  );
};

export default TramiteEmitido;
