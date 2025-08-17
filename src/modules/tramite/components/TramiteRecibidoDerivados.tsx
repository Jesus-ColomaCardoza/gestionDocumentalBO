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
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import UseFile from "../../file/hooks/UseFile";
import UseAnexo from "../../anexo/hooks/UseAnexo";
import { AnexoEntity } from "../../anexo/interfaces/AnexoInterface";
import { useNavigate } from "react-router-dom";
import { RadioButton } from "primereact/radiobutton";
import { Toolbar } from "primereact/toolbar";
import { TabPanel, TabView, TabViewTabChangeEvent } from "primereact/tabview";
import ConfirmModal from "../../utils/shared/ConfirmModal";

const TramiteRecibidoDerivados = () => {
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

  const [showAnexos, setShowAnexos] = useState<boolean>(false);

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
                    <InputText
                      id="CodigoReferencia"
                      value={tramite.CodigoReferencia}
                      onChange={(e) => {
                        onInputTextChange(e, "CodigoReferencia");
                      }}
                      type="text"
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
                    <InputText
                      id="CodigoReferencia"
                      value={tramite.CodigoReferencia}
                      onChange={(e) => {
                        onInputTextChange(e, "CodigoReferencia");
                      }}
                      type="text"
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

            <div className="flex flex-column px-4">
              <label
                htmlFor="CodigoReferencia"
                className="block text-900 text-sm font-medium mb-2"
              >
                Asunto
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

            <div className="flex flex-column px-4">
              <label
                htmlFor="CodigoReferencia"
                className="block text-900 text-sm font-medium mb-2"
              >
                Ubicación
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
        </div>

        <div
          className="flex flex-column flex-wrap gap-1  border-solid border-1 border-gray-500 border-round-md"
          style={{ width: "49%" }}
        >
          <div className="flex flex-row justify-content-between align-items-center mb-2 p-3 border-bottom-1 border-gray-500">
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

      <ConfirmModal
        titleModal="Confirmación"
        typeMessage="danger"
        message="¿Estás seguro de realizar esta acción?"
        typeButton="danger"
        state={false}
        hideDialog={() => {}}
        callBack={() => {}}
      />
    </div>
  );
};

export default TramiteRecibidoDerivados;
