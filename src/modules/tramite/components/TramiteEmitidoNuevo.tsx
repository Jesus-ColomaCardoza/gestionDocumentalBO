import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState, useEffect, useRef } from "react";
import UseTramite from "../hooks/UseTramite";
import { TramiteEntity } from "../interfaces/TramiteInterface";
import { Toast } from "primereact/toast";
import { emptyTramite } from "../utils/Constants";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { useTheme } from "../../../ThemeContext";
import UseTipoDocumento from "../../tipo-documento/hooks/UseTipoDocumento";
import { TipoDocumentoEntity } from "../../tipo-documento/interfaces/TipoDocumentoInterface";
import { UsuarioEntity } from "../../usuario/interfaces/UsuarioInterface";
import UseUsuario from "../../usuario/hooks/UseUsuario";
import { AreaEntity } from "../../area/interfaces/AreaInterface";
import UseArea from "../../area/hooks/UseArea";
import FileManagerModal from "../../file-manager/components/FileMangerModal";
import { FileManagerEntity } from "../../file-manager/interfaces/FileMangerInterface";
import { Tooltip } from "primereact/tooltip";
import UseFileManager from "../../file-manager/hooks/UseFileManger";
import { useAuth } from "../../auth/context/AuthContext";
import { MAX_FILE_SIZE } from "../../utils/Constants";
import { formatFileSize } from "../../utils/Methods";
import TramiteDestinosModal from "./TramiteDestinosModal";
import { MovimientoEntity } from "../../movimiento/interfaces/MovimientoInterface";
import { emptyMovimiento } from "../../movimiento/utils/Constants";
import { InputSwitchChangeEvent } from "primereact/inputswitch";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import UseFile from "../../file/hooks/UseFile";
import UseAnexo from "../../anexo/hooks/UseAnexo";
import { AnexoEntity } from "../../anexo/interfaces/AnexoInterface";
import { useNavigate } from "react-router-dom";

const TramiteEmitidoNuevo = () => {
  // custom hooks
  const { themePrimeFlex } = useTheme();

  const { userAuth } = useAuth()!;

  const { createEmitido } = UseTramite();

  const { createDocumento } = UseFileManager();

  const { create: createAnexo } = UseAnexo();

  const { create: createFile, remove: removeFile } = UseFile();

  const { findAll: findAllTipoDocumento } = UseTipoDocumento();

  const { findAll: findAllRemitentes } = UseUsuario();

  const { findAll: findAllAreas } = UseArea();

  const navigate = useNavigate();

  //useRefs
  const toast = useRef<Toast>(null);

  const loadFilesRef = useRef<HTMLInputElement>(null);

  const anexosRef = useRef<HTMLInputElement>(null);

  //useStates
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingTramiteCreateOrUpdate, setLoadingTramiteCreateOrUpdate] =
    useState<boolean>(false);

  const [tramite, setTramite] = useState<TramiteEntity>(emptyTramite);

  const [movimiento, setMovimiento] =
    useState<MovimientoEntity>(emptyMovimiento);

  const [tramiteErrors, setTramiteErrors] = useState<any>({});

  const [tramiteDestinosErrors, setTramiteDestinosErrors] = useState<any>({});

  const [tramites, setTramites] = useState<TramiteEntity[]>([]);

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

  const [tramiteDestinosDialog, setTramiteDestinosDialog] =
    useState<boolean>(false);

  const [selectedDigitalFiles, setSelectedDigitalFiles] = useState<
    FileManagerEntity[]
  >([]);

  const [selectedTramiteDestinos, setSelectedTramiteDestinos] = useState<
    MovimientoEntity[]
  >([]);

  const [selectedLoadFiles, setSelectedLoadFiles] = useState<File[]>([]);

  const [selectedAnexos, setSelectedAnexos] = useState<File[]>([]);

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
      // setLoadingTramiteCreateOrUpdate(true);
      let arrayAnexosUpload: AnexoEntity[] = [];

      //1 we create anexos physical files
      const uploadResults = await Promise.all(
        Array.from(selectedAnexos).map(async (anexo) => {
          const formData = new FormData();

          formData.append("file", anexo);

          const anexoUpload = await createFile(formData);

          if (anexoUpload?.message?.msgId === 0) {
            const data = {
              Titulo: anexoUpload.registro?.parseoriginalname!,
              FormatoAnexo: anexoUpload.registro?.mimetype,
              NombreAnexo: anexoUpload.registro?.filename,
              UrlAnexo: anexoUpload.registro?.url!,
              SizeAnexo: anexoUpload.registro?.size,
              UrlBase: anexoUpload.registro?.path,
              IdTramite: 0,
              Activo: true,
            };

            arrayAnexosUpload.push(data);

            return {
              success: true,
              data: data,
            };
          } else {
            return {
              success: false,
              error: anexoUpload?.message?.msgTxt || "Error desconocido",
            };
          }
        })
      );

      // const successfulUploads = uploadResults
      //   .filter((r) => r.success)
      //   .map((r) => r.data);

      const failedUploads = uploadResults.filter((r) => !r.success);

      if (failedUploads.length > 0) {
        toast.current?.show({
          severity: "error",
          detail: "No se pudieron cargar todos los anexos.",
          life: 3000,
        });
        return;
      }

      //2 we create tramite
      let tramiteCreateEmitido = await createEmitido({
        CodigoReferencia: tramite.CodigoReferencia,
        Asunto: tramite.Asunto,
        // Descripcion: tramite.Descripcion,
        Observaciones: tramite.Observaciones,
        FechaInicio: new Date().toISOString(),
        // FechaFin:tramite.FechaFin,
        Folios: tramite.Folios,

        IdTipoTramite: tramite.IdTipoTramite || 1, // IdTipoTramite - 1 - interno

        IdTipoDocumento: tramite.IdTipoDocumento,
        IdAreaEmision: tramite.IdAreaEmision,
        IdEstado: tramite.IdEstado || 1, // IdTipoTramite - 1 - ver estado nuevo o algo asi
        IdRemitente: tramite.IdRemitente,
        Activo: tramite.Activo,

        DigitalFiles: selectedDigitalFiles,
        TramiteDestinos: selectedTramiteDestinos,
        Anexos: arrayAnexosUpload,
      });

      // setLoadingTramiteCreateOrUpdate(false);

      if (
        tramiteCreateEmitido?.message.msgId == 0 &&
        tramiteCreateEmitido.registro
      ) {
        setTramites([...tramites, tramiteCreateEmitido.registro]);

        navigate("../tramite/emitido");

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

      // setSelectedAnexos([])
      // setFileManagerDialog(false);
      // setTramite(emptyTramite);
    }
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
  const hideFileManagerDialog = () => {
    setSubmitted(false);
    setFileManagerDialog(false);
  };

  const showFileManagerDialog = () => {
    setSubmitted(false);
    setFileManagerDialog(true);
  };

  const hideTramiteDestinosDialog = () => {
    setSubmitted(false);
    setTramiteDestinosErrors({});
    setMovimiento(emptyMovimiento);
    setTramiteDestinosDialog(false);
  };

  const showTramiteDestinosDialog = () => {
    setSubmitted(false);
    setTramiteDestinosDialog(true);
  };

  const onChangeLoadFiles = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      // setLoadingDocumentoCreateOrUpdate(true);

      // we validate if there is some file exceeds the limit size
      const invalidFiles = Array.from(files).filter(
        (file) => file.size > MAX_FILE_SIZE
      );

      if (invalidFiles.length > 0) {
        toast.current?.show({
          severity: "warn",
          detail: `El archivo "${invalidFiles[0].name}" supera el límite de 2MB.`,
          life: 3000,
        });

        // clear input file
        if (loadFilesRef.current) {
          loadFilesRef.current.value = "";
        }

        return;
      }

      const formData = new FormData();

      Array.from(files).forEach((fileUpload) => {
        formData.append("file", fileUpload);
      });

      const fileUpload = await createFile(formData);

      if (fileUpload?.message.msgId == 0) {
        let documentoCreate = await createDocumento({
          FormatoDocumento: fileUpload.registro?.mimetype,
          NombreDocumento: fileUpload.registro?.filename,
          UrlDocumento: fileUpload.registro?.url,
          SizeDocumento: fileUpload.registro?.size,
          UrlBase: fileUpload.registro?.path,
          Titulo: fileUpload.registro?.parseoriginalname,
          Descripcion: fileUpload.registro?.filename,
          IdUsuario: userAuth?.IdUsuario,
          FirmaDigital: true,
          IdCarpeta: null,
          Categoria: "MF",
          IdEstado: 1, // set at diagram state
          Activo: true,
        });

        // setLoadingDocumentoCreateOrUpdate(false);

        if (documentoCreate?.message.msgId == 0 && documentoCreate.registro) {
          setSelectedDigitalFiles((prev) => [
            ...prev,
            documentoCreate.registro!,
          ]);

          toast.current?.show({
            severity: "success",
            detail: `${documentoCreate.message.msgTxt}`,
            life: 3000,
          });
        } else {
          toast.current?.show({
            severity: "error",
            detail: `${fileUpload?.message.msgTxt}`,
            life: 3000,
          });
        }
      } else {
        toast.current?.show({
          severity: "error",
          detail: `${fileUpload?.message.msgTxt}`,
          life: 3000,
        });
      }

      // clear input file
      if (loadFilesRef.current) {
        loadFilesRef.current.value = "";
      }
    }
  };

  const onChangeAnexos = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      // setLoadingDocumentoCreateOrUpdate(true);

      // we validate if there is some file exceeds the limit size
      const invalidFiles = Array.from(files).filter(
        (file) => file.size > MAX_FILE_SIZE
      );

      if (invalidFiles.length > 0) {
        toast.current?.show({
          severity: "warn",
          detail: `El archivo "${invalidFiles[0].name}" supera el límite de 2MB.`,
          life: 3000,
        });

        // clear input file
        if (anexosRef.current) {
          anexosRef.current.value = "";
        }

        return;
      }

      // console.log(Array.from(files));

      setSelectedAnexos((prev) => [...prev, ...Array.from(files)]);
      // const formData = new FormData();

      // Array.from(files).forEach((fileUpload) => {
      //   formData.append("file", fileUpload);
      // });

      // const fileUpload = await createFile(formData);

      // if (fileUpload?.message.msgId == 0) {
      //   let documentoCreate = await createDocumento({
      //     FormatoDocumento: fileUpload.registro?.mimetype,
      //     NombreDocumento: fileUpload.registro?.filename,
      //     UrlDocumento: fileUpload.registro?.url,
      //     SizeDocumento: fileUpload.registro?.size,
      //     UrlBase: fileUpload.registro?.path,
      //     Titulo: fileUpload.registro?.parseoriginalname,
      //     Descripcion: fileUpload.registro?.filename,
      //     IdUsuario: userAuth?.IdUsuario,
      //     FirmaDigital: true,
      //     IdCarpeta: null,
      //     Categoria: "MF",
      //     IdEstado: 1, // set at diagram state
      //     Activo: true,
      //   });

      //   // setLoadingDocumentoCreateOrUpdate(false);

      //   if (documentoCreate?.message.msgId == 0 && documentoCreate.registro) {
      //     setSelectedDigitalFiles((prev) => [
      //       ...prev,
      //       documentoCreate.registro!,
      //     ]);

      //     toast.current?.show({
      //       severity: "success",
      //       detail: `${documentoCreate.message.msgTxt}`,
      //       life: 3000,
      //     });
      //   } else {
      //     toast.current?.show({
      //       severity: "error",
      //       detail: `${fileUpload?.message.msgTxt}`,
      //       life: 3000,
      //     });
      //   }
      // } else {
      //   toast.current?.show({
      //     severity: "error",
      //     detail: `${fileUpload?.message.msgTxt}`,
      //     life: 3000,
      //   });
      // }

      // clear input file
      if (anexosRef.current) {
        anexosRef.current.value = "";
      }
    }
  };

  // onChanges
  const onInputTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";

    setTramite((prev) => ({
      ...prev,
      [name]: val,
    }));

    setTramiteErrors((prev: any) => ({ ...prev, [name]: undefined }));
  };

  const onInputNumberChange = (e: InputNumberChangeEvent, name: string) => {
    const val = e.value ?? null;

    setTramite((prev) => ({
      ...prev,
      [name]: val,
    }));

    setTramiteErrors((prev: any) => ({ ...prev, [name]: undefined }));
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

    setTramiteErrors((prev: any) => ({ ...prev, [name]: undefined }));
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

    setTramiteErrors((prev: any) => ({
      ...prev,
      [nameTagFK ? nameTagFK : nameFK]: undefined,
    }));
  };

  const onDropdownChangeMovimiento = (
    e: DropdownChangeEvent,
    nameObj: string,
    nameFK: string,
    nameTagFK?: string
  ) => {
    const val = (e.target && e.target.value) || "";

    let _movimiento: any = { ...movimiento };

    _movimiento[nameTagFK ? nameTagFK : nameFK] = val[nameFK];

    if (nameObj !== "") {
      _movimiento[nameObj] = { ...val };
    }

    setMovimiento(_movimiento);
  };

  const onDropdownChangeX = (
    //onchangegeneral of text , to do: number
    e: DropdownChangeEvent,
    state: any,
    setState: React.Dispatch<React.SetStateAction<any>>,
    nameObj: string,
    nameFK: string,
    nameTagFK?: string
  ) => {
    const val = (e.target && e.target.value) || "";

    let _state: any = { ...state };

    _state[nameTagFK ? nameTagFK : nameFK] = val[nameFK];

    if (nameObj !== "") {
      _state[nameObj] = { ...val };
    }

    setState(_state);
  };

  const onSwitchChange = (e: InputSwitchChangeEvent, name: string) => {
    let _movimiento: any = { ...movimiento };
    _movimiento[name] = e.value;
    setMovimiento(_movimiento);
  };

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
          <div className="flex flex-row justify-content-between align-items-center pb-3 mb-3  py-2 px-4 border-bottom-1 border-gray-500">
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
                gap: "1rem",
              }}
            >
              <Button
                type="button"
                onClick={showFileManagerDialog}
                size="small"
                severity="secondary"
                style={{
                  padding: "0",
                  width: "9rem",
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
                onClick={() => {
                  loadFilesRef.current?.click();
                }}
                size="small"
                style={{
                  padding: "0",
                  width: "9rem",
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
              <input
                ref={loadFilesRef}
                type="file"
                accept="application/pdf"
                onChange={onChangeLoadFiles}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div className="flex flex-row py-2 px-4" style={{ gap: "1rem" }}>
            <div
              style={{
                width: "100%",
              }}
            >
              <label
                htmlFor="Archivo digital"
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
                            href={`${df.UrlFM}`}
                            target="_blank"
                          >
                            {df.Descripcion}
                          </a>
                          <span className="flex flex-row gap-2  m-0">
                            <span className="text-sm">
                              {df.Estado.Descripcion}
                            </span>
                            <span className="text-sm">-</span>
                            <span className="text-sm">
                              {formatFileSize(df.Size || 0)}
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
          className="flex flex-column justify-content-between border-solid border-1 border-gray-500 border-round-md"
          style={{ width: "49%" }}
        >
          <div className="flex flex-column gap-3">
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
                  onClick={showTramiteDestinosDialog}
                  size="small"
                  severity="secondary"
                  style={{
                    padding: "0",
                    width: "6.5rem",
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
                {selectedTramiteDestinos.map((destino, index) => {
                  return (
                    <div
                      key={index}
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
                            className={
                              destino.NombreCompleto
                                ? "pi pi-user"
                                : "pi pi-building"
                            }
                            style={{ color: "#559", fontSize: "1.5rem" }}
                          ></i>
                        </div>
                        {/* descripcion */}
                        <div className="flex flex-column gap-2">
                          <span
                            className="hover:underline hover:text-blue-300 text-xs"
                            style={{
                              textDecoration: "none",
                              color: "var(--text-color)",
                            }}
                          >
                            {destino.NombreCompleto
                              ? `${destino.NombreCompleto} | Responsable de oficina`
                              : destino.AreaDestino.Descripcion}
                          </span>
                          <span className="flex flex-row gap-2 m-0">
                            {destino.FirmaDigital && (
                              <span className="text-xs">Para Firma -</span>
                            )}

                            {destino.NombreCompleto && (
                              <span className="text-xs">
                                {destino.AreaDestino.Descripcion}
                              </span>
                            )}
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
                            setSelectedTramiteDestinos((prev) => {
                              return prev.filter(
                                (p) => p.IdMovimiento != destino.IdMovimiento
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
                onClick={() => {
                  anexosRef.current?.click();
                }}
                size="small"
                severity="contrast"
                style={{
                  padding: "0",
                  width: "6.5rem",
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
              <input
                ref={anexosRef}
                type="file"
                accept="application/pdf"
                onChange={onChangeAnexos}
                style={{ display: "none" }}
              />
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

          <div className="flex flex-row pb-3 px-4" style={{ gap: "1rem" }}>
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
              onClick={() => {
                if (validateForm()) {
                  createTramiteEmitido();
                }
              }}
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
        hideFileManagerDialog={hideFileManagerDialog}
        fileManagerDialog={fileManagerDialog}
        selectedDigitalFiles={selectedDigitalFiles}
        setSelectedDigitalFiles={setSelectedDigitalFiles}
      />

      <TramiteDestinosModal
        submitted={submitted}
        hideTramiteDestinosDialog={hideTramiteDestinosDialog}
        tramiteDestinosDialog={tramiteDestinosDialog}
        selectedTramiteDestinos={selectedTramiteDestinos}
        setSelectedTramiteDestinos={setSelectedTramiteDestinos}
        tramiteDestinosErrors={tramiteDestinosErrors}
        setTramiteDestinosErrors={setTramiteDestinosErrors}
        movimiento={movimiento}
        areas={areas}
        remitentes={remitentes}
        setMovimiento={setMovimiento}
        onInputTextChange={onInputTextChange}
        onDropdownChangeMovimiento={onDropdownChangeMovimiento}
        onSwitchChange={onSwitchChange}
      />
    </div>
  );
};

export default TramiteEmitidoNuevo;
