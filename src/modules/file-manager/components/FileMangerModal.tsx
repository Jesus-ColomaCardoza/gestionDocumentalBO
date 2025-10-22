import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { MenuItem, MenuItemCommandEvent } from "primereact/menuitem";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import UseFileManager from "../hooks/UseFileManger";
import { ColumnMeta } from "../../utils/Interfaces";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import {
  FileManagerEntity,
  FileManagerGetFilesArea,
  FileManagerGetMyFiles,
  FileManagerOut,
} from "../interfaces/FileMangerInterface";
import { Toast } from "primereact/toast";
import { columns, defaultFilters, emptyFileManager } from "../utils/Constants";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { formatDate, getColorById } from "../../utils/Methods";
import { Calendar } from "primereact/calendar";
import EmptyMessageData from "../../utils/shared/EmptyMessageData";
import { Menu } from "primereact/menu";
import { BreadCrumb } from "primereact/breadcrumb";
import { emptyCarpeta } from "../../carpeta/utils/Constants";
import {
  CarpetaCombinationsFilters,
  CarpetaEntity,
} from "../../carpeta/interfaces/CarpetaInterface";
import CarpetaCreateOrUpdate from "../../carpeta/components/CarpetaCreateOrUpdate";
import CarpetaRemove from "../../carpeta/components/CarpetaRemove";
import { emptyDocumento } from "../../documento/utils/Constants";
import { DocumentoEntity } from "../../documento/interfaces/DocumentoInterface";
import DocumentoCreateOrUpdate from "../../documento/components/DocumentoCreateOrUpdate";
import DocumentoRemove from "../../documento/components/DocumentoRemove";
import UseFile from "../../file/hooks/UseFile";
import { InputSwitchChangeEvent } from "primereact/inputswitch";
import FileManagerMove from "./FileMangerMove";
import UseCarpeta from "../../carpeta/hooks/UseCarpeta";
import {
  TreeCheckboxSelectionKeys,
  TreeMultipleSelectionKeys,
} from "primereact/tree";
import { useAuth } from "../../auth/context/AuthContext";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import UseEstado from "../../estado/hooks/UseEstado";
import { EstadoEntity } from "../../estado/interfaces/EstadoInterface";
import { colors } from "../../utils/Constants";

type FileManagerModalProps = {
  submitted: boolean;

  hideFileManagerDialog: () => void;

  fileManagerDialog: boolean;

  selectedDigitalFiles: FileManagerEntity[];

  setSelectedDigitalFiles: Dispatch<SetStateAction<FileManagerEntity[]>>;
};

const FileManagerModal = (props: FileManagerModalProps) => {
  // custom hooks
  const { userAuth } = useAuth()!;

  const {
    createCarpeta,
    createDocumento,
    findAllMyFiles,
    findAllFilesArea,
    updateCarpeta,
    updateDocumento,
    removeCarpeta,
    removeDocumento,
  } = UseFileManager();

  const { findAll: findAllEstado } = UseEstado();

  const { create, remove } = UseFile();

  const { findAllTree } = UseCarpeta();

  //useRefs
  const toastx = useRef<Toast>(null);

  const menuAddFM = useRef<Menu>(null);

  const menuActionsFM = useRef<Menu>(null);

  //useStates
  const [selectedFileMoved, setSelectedFileMoved] = useState<
    string | TreeMultipleSelectionKeys | TreeCheckboxSelectionKeys | null
  >(null);

  const [estados, setEstados] = useState<
    Pick<EstadoEntity, "IdEstado" | "Descripcion">[]
  >([]);

  const [selectedFilesUpload, setSelectedFilesUpload] = useState<File[]>([]);

  const [totalSizeFilesUpload, setTotalSizeFilesUpload] = useState<number>(0);

  const [itemsMenuActionsFM, setItemsMenuActionsFM] = useState<MenuItem[]>([]);

  const [submitted, setSubmitted] = useState<boolean>(false);

  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(
    columns.filter((col: ColumnMeta) => col.show)
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingCarpetaCreateOrUpdate, setLoadingCarpetaCreateOrUpdate] =
    useState<boolean>(false);

  const [loadingDocumentoCreateOrUpdate, setLoadingDocumentoCreateOrUpdate] =
    useState<boolean>(false);

  const [loadingFileManagerMove, setLoadingFileManagerMove] =
    useState<boolean>(false);

  const [carpeta, setCarpeta] = useState<CarpetaEntity>(emptyCarpeta);

  const [documento, setDocumento] = useState<DocumentoEntity>(emptyDocumento);

  const [selectedTitleFM, setSelectedTitleFM] = useState<{
    id: "MF" | "FA" | "FS";
    title: string | undefined;
  } | null>();

  const [treeFileManager, setTreeFileManager] = useState([]);

  const [fileManagers, setFileManagers] = useState<FileManagerEntity[]>([]);

  const [fileManager, setFileManager] =
    useState<FileManagerEntity>(emptyFileManager);

  const [selectedFileManagers, setSelectedFileManagers] =
    useState<FileManagerEntity | null>(null);

  const [carpetaDialog, setCarpetaDialog] = useState<{
    type?: "create" | "update" | undefined;
    state: boolean;
  }>({
    state: false,
  });

  const [documentoDialog, setDocumentoDialog] = useState<{
    type?: "create" | "update" | undefined;
    state: boolean;
  }>({
    state: false,
  });

  const [removeCarpetaDialog, setRemoveCarpetaDialog] =
    useState<boolean>(false);

  const [removeDocumentoDialog, setRemoveDocumentoDialog] =
    useState<boolean>(false);

  const [moveFileManagerDialog, setMoveFileManagerDialog] =
    useState<boolean>(false);

  const [itemBreadCrumbs, setItemBreadCrumbs] = useState<MenuItem[]>([]);

  const [lastItemBreadCrumbMF, setLastItemBreadCrumbMF] =
    useState<FileManagerGetMyFiles>({
      IdUsuario: userAuth?.IdUsuario,
      IdCarpeta: null,
      Categoria: "MF",
    });

  const [lastItemBreadCrumbFA, setLastItemBreadCrumbFA] =
    useState<FileManagerGetFilesArea>({
      IdCarpeta: null,
      IdArea: userAuth?.Area.IdArea,
      Categoria: "FA",
    });

  const [titleFM, setTitleFM] = useState<{
    id: "MF" | "FA" | "FS";
    title: string | undefined;
  }>();

  // templates to component Toolbar
  const items: MenuItem[] = [
    {
      label: "Update",
      icon: "pi pi-refresh",
    },
    {
      label: "Remove",
      icon: "pi pi-times",
    },
  ];

  // actions CRUD (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllMyFilesFileManager = async (
    fileManagerGetMyFiles: FileManagerGetMyFiles
  ) => {
    setLoading(true);
    const fileManagersFindAll = await findAllMyFiles(fileManagerGetMyFiles);

    if (
      fileManagersFindAll?.message.msgId == 0 &&
      fileManagersFindAll.registro
    ) {
      setFileManagers(
        Array.isArray(fileManagersFindAll.registro)
          ? fileManagersFindAll.registro?.map((af) => {
              return {
                ...af,
                FechaEmision: af.FechaEmision
                  ? new Date(af.FechaEmision)
                  : null,
                Usuario: {
                  ...af.Usuario,
                  NombreCompleto:
                    af.Usuario.Nombres +
                    " " +
                    af.Usuario.ApellidoPaterno +
                    " " +
                    af.Usuario.ApellidoMaterno,
                },
              };
            })
          : []
      );
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  const findAllFilesAreaFileManager = async (
    fileManagerGetFilesArea: FileManagerGetFilesArea
  ) => {
    setLoading(true);
    const fileManagersFindAll = await findAllFilesArea(fileManagerGetFilesArea);

    if (
      fileManagersFindAll?.message.msgId == 0 &&
      fileManagersFindAll.registro
    ) {
      setFileManagers(
        Array.isArray(fileManagersFindAll.registro)
          ? fileManagersFindAll.registro?.map((af) => {
              return {
                ...af,
                FechaEmision: af.FechaEmision
                  ? new Date(af.FechaEmision)
                  : null,
                Usuario: {
                  ...af.Usuario,
                  NombreCompleto:
                    af.Usuario.Nombres +
                    " " +
                    af.Usuario.ApellidoPaterno +
                    " " +
                    af.Usuario.ApellidoMaterno,
                },
              };
            })
          : []
      );
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  const findAllTreeFileManager = async (
    fileManagerGetTree: CarpetaCombinationsFilters
  ) => {
    const fileManagersFindAll = await findAllTree(fileManagerGetTree);

    if (
      fileManagersFindAll?.message.msgId == 0 &&
      fileManagersFindAll.registro
    ) {
      setTreeFileManager(
        Array.isArray(fileManagersFindAll.registro)
          ? fileManagersFindAll.registro
          : []
      );
    }
  };

  const createCarpetaFileManager = async () => {
    setSubmitted(true);
    if (carpeta.Descripcion.trim()) {
      setLoadingCarpetaCreateOrUpdate(true);
      let carpetaCreate = await createCarpeta({
        Descripcion: carpeta.Descripcion,
        IdCarpetaPadre:
          titleFM?.id == "MF"
            ? lastItemBreadCrumbMF.IdCarpeta
            : lastItemBreadCrumbFA.IdCarpeta,
        IdUsuario: userAuth?.IdUsuario, //
        Activo: carpeta.Activo,
        Categoria: titleFM?.id,
      });
      setLoadingCarpetaCreateOrUpdate(false);

      if (carpetaCreate?.message.msgId == 0 && carpetaCreate.registro) {
        setFileManagers([...fileManagers, carpetaCreate.registro]);
        toastx.current?.show({
          severity: "success",
          detail: `${carpetaCreate.message.msgTxt}`,
          life: 3000,
        });
      } else if (carpetaCreate?.message.msgId == 1) {
        toastx.current?.show({
          severity: "error",
          detail: `${carpetaCreate.message.msgTxt}`,
          life: 3000,
        });
      }

      setCarpetaDialog({ state: false });
      setCarpeta(emptyCarpeta);
    }
  };

  const updateCarpetaFileManager = async () => {
    setSubmitted(true);
    if (carpeta.IdCarpeta) {
      setLoadingCarpetaCreateOrUpdate(true);
      let carpetaUpdate = await updateCarpeta(carpeta.IdCarpeta.toString(), {
        Descripcion: carpeta.Descripcion,
        Activo: carpeta.Activo,
      });
      setLoadingCarpetaCreateOrUpdate(false);

      if (carpetaUpdate?.message.msgId == 0 && carpetaUpdate.registro) {
        setFileManagers(
          fileManagers?.map((fileManager) =>
            fileManager.IdFM === carpetaUpdate?.registro?.IdFM
              ? { ...fileManager, ...carpetaUpdate.registro }
              : fileManager
          )
        );
        toastx.current?.show({
          severity: "success",
          detail: `${carpetaUpdate.message.msgTxt}`,
          life: 3000,
        });
      } else if (carpetaUpdate?.message.msgId == 1) {
        toastx.current?.show({
          severity: "error",
          detail: `${carpetaUpdate.message.msgTxt}`,
          life: 3000,
        });
      }

      setCarpetaDialog({ state: false });
      setCarpeta(emptyCarpeta);
    }
  };

  const removeCarpetaFileManager = async () => {
    if (carpeta.IdCarpeta) {
      let carpetaRemove = await removeCarpeta(carpeta.IdCarpeta.toString());
      if (carpetaRemove?.message.msgId == 0 && carpetaRemove.registro) {
        setFileManagers(
          fileManagers?.filter(
            (fileManager) => fileManager.IdFM !== carpetaRemove?.registro?.IdFM
          )
        );
        toastx.current?.show({
          severity: "success",
          detail: `${carpetaRemove.message.msgTxt}`,
          life: 3000,
        });
      } else if (carpetaRemove?.message.msgId == 1) {
        toastx.current?.show({
          severity: "error",
          detail: `${carpetaRemove.message.msgTxt}`,
          life: 3000,
        });
      }
      setRemoveCarpetaDialog(false);
      setCarpeta(emptyCarpeta);
    }
  };

  const createDocumentoFileManager = async () => {
    setSubmitted(true);
    if (selectedFilesUpload.length != 0) {
      setLoadingDocumentoCreateOrUpdate(true);

      const formData = new FormData();

      selectedFilesUpload.forEach((fileUpload) => {
        formData.append("file", fileUpload);
      });

      const fileUpload = await create(formData);
      // console.log(fileUpload);

      if (fileUpload?.message.msgId == 0) {
        let documentoCreate = await createDocumento({
          FormatoDocumento: fileUpload.registro?.mimetype,
          NombreDocumento: fileUpload.registro?.filename,
          UrlDocumento: fileUpload.registro?.url,
          SizeDocumento: fileUpload.registro?.size,
          UrlBase: fileUpload.registro?.path,
          Titulo: fileUpload.registro?.parseoriginalname,
          Descripcion: documento.Descripcion,
          IdUsuario: userAuth?.IdUsuario, //
          FirmaDigital: documento.FirmaDigital,
          IdCarpeta:
            titleFM?.id == "MF"
              ? lastItemBreadCrumbMF.IdCarpeta
              : lastItemBreadCrumbFA.IdCarpeta,
          Categoria: titleFM?.id,
          IdEstado: 1, // set at diagram state
          Activo: documento.Activo,
          FechaEmision: new Date().toISOString(),
        });

        setLoadingDocumentoCreateOrUpdate(false);

        if (documentoCreate?.message.msgId == 0 && documentoCreate.registro) {
          setFileManagers([...fileManagers, documentoCreate.registro]);

          toastx.current?.show({
            severity: "success",
            detail: `${documentoCreate.message.msgTxt}`,
            life: 3000,
          });
        } else {
          toastx.current?.show({
            severity: "error",
            detail: `${fileUpload?.message.msgTxt}`,
            life: 3000,
          });
        }
      } else {
        toastx.current?.show({
          severity: "error",
          detail: `${fileUpload?.message.msgTxt}`,
          life: 3000,
        });
      }

      setSelectedFilesUpload([]);
      setTotalSizeFilesUpload(0);
      setDocumentoDialog({ state: false });
      setDocumento(emptyDocumento);
    }
  };

  // updateDocumentoFileManager - doesn't work
  const updateDocumentoFileManager = async () => {
    setSubmitted(true);
    if (documento.IdDocumento) {
      setLoadingDocumentoCreateOrUpdate(true);
      let documentoUpdate = await updateDocumento(
        documento.IdDocumento.toString(),
        {
          Descripcion: documento.Descripcion,
          Activo: documento.Activo,
        }
      );
      setLoadingDocumentoCreateOrUpdate(false);

      if (documentoUpdate?.message.msgId == 0 && documentoUpdate.registro) {
        setFileManagers(
          fileManagers?.map((fileManager) =>
            fileManager.IdFM === documentoUpdate?.registro?.IdFM
              ? { ...fileManager, ...documentoUpdate.registro }
              : fileManager
          )
        );
        toastx.current?.show({
          severity: "success",
          detail: `${documentoUpdate.message.msgTxt}`,
          life: 3000,
        });
      } else if (documentoUpdate?.message.msgId == 1) {
        toastx.current?.show({
          severity: "error",
          detail: `${documentoUpdate.message.msgTxt}`,
          life: 3000,
        });
      }

      setDocumentoDialog({ state: false });
      setDocumento(emptyDocumento);
    }
  };

  const removeDocumentoFileManager = async () => {
    if (documento.IdDocumento) {
      const fileRemoved = await remove({ PublicUrl: documento.UrlDocumento });

      if (fileRemoved?.message.msgId == 0) {
        let documentoRemove = await removeDocumento(
          documento.IdDocumento.toString()
        );
        if (documentoRemove?.message.msgId == 0 && documentoRemove.registro) {
          setFileManagers(
            fileManagers?.filter(
              (fileManager) =>
                fileManager.IdFM !== documentoRemove?.registro?.IdFM
            )
          );
          toastx.current?.show({
            severity: "success",
            detail: `${documentoRemove.message.msgTxt}`,
            life: 3000,
          });
        } else if (documentoRemove?.message.msgId == 1) {
          toastx.current?.show({
            severity: "error",
            detail: `${documentoRemove.message.msgTxt}`,
            life: 3000,
          });
        }
      } else {
        toastx.current?.show({
          severity: "error",
          detail: `${fileRemoved?.message.msgTxt}`,
          life: 3000,
        });
      }

      setRemoveDocumentoDialog(false);
      setDocumento(emptyDocumento);
    }
  };

  const moveFileManager = async (categoria: "MF" | "FA" | "FS") => {
    //ga
    if (fileManager?.IdFM) {
      setLoadingFileManagerMove(true);

      const typeElement = fileManager.IdFM.split("_")[0];
      const idElement = fileManager.IdFM.split("_")[1];

      let element: FileManagerOut | undefined = undefined;

      if (typeElement == "c") {
        element = await updateCarpeta(idElement, {
          IdCarpetaPadre: parseInt(selectedFileMoved?.toString()!),
          Categoria: categoria,
        });
      } else {
        element = await updateDocumento(idElement, {
          IdCarpeta: parseInt(selectedFileMoved?.toString()!),
          Categoria: categoria,
        });
      }

      setLoadingFileManagerMove(false);

      if (element?.message.msgId == 0 && element.registro) {
        // If the final ubication is diferent current ubication
        if (
          (parseInt(selectedFileMoved?.toString()!) || null) !=
            (fileManager?.Carpeta?.IdCarpeta || null) ||
          titleFM?.id != element?.registro?.Categoria
        ) {
          setFileManagers(
            fileManagers?.filter(
              (fileManager) => fileManager.IdFM !== element?.registro?.IdFM
            )
          );
        }

        toastx.current?.show({
          severity: "success",
          detail: `${element.message.msgTxt}`,
          life: 3000,
        });
      } else if (element?.message.msgId == 1) {
        toastx.current?.show({
          severity: "error",
          detail: `${element.message.msgTxt}`,
          life: 3000,
        });
      }

      setSelectedFileMoved(null);
      setMoveFileManagerDialog(false);
    }
  };

  // actions CRUD - Tipo Usuario (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllEstadoCombox = async () => {
    setLoading(true);
    const estadoFindAll = await findAllEstado({
      cantidad_max: "0",
      Language: "ES",
      filters: [
        {
          campo: "IdEsquemaEstado",
          operador: "EQ",
          tipo: "numeric2",
          valor1: "1",
          valor2: "",
        },
      ],
    });
    setLoading(false);

    if (estadoFindAll?.message.msgId == 0 && estadoFindAll.registro) {
      setEstados(
        Array.isArray(estadoFindAll.registro)
          ? estadoFindAll.registro?.map((af) => {
              return {
                IdEstado: af.IdEstado,
                Descripcion: af.Descripcion,
              };
            })
          : []
      );
    }
  };

  // templates to dialogs
  // carpeta
  const hideCarpetaDialog = () => {
    setSubmitted(false);
    setCarpetaDialog({ state: false });
  };

  const showCreateCarpetaDialog = () => {
    setCarpeta(emptyCarpeta);
    setSubmitted(false);
    setCarpetaDialog({ type: "create", state: true });
  };

  const showUpdateCarpetaDialog = (carpeta: CarpetaEntity) => {
    setCarpeta({ ...carpeta });
    setCarpetaDialog({ type: "update", state: true });
  };

  const hideRemoveCarpetaDialog = () => {
    setRemoveCarpetaDialog(false);
  };

  const confirmRemoveCarpeta = (carpeta: CarpetaEntity) => {
    setCarpeta({ ...carpeta });
    setRemoveCarpetaDialog(true);
  };

  //documento
  const hideDocumentoDialog = () => {
    setSubmitted(false);
    setDocumentoDialog({ state: false });
    setSelectedFilesUpload([]);
    setTotalSizeFilesUpload(0);
  };

  const showCreateDocumentoDialog = () => {
    setDocumento(emptyDocumento);
    setSubmitted(false);
    setDocumentoDialog({ type: "create", state: true });
  };

  const showUpdateDocumentoDialog = (documento: DocumentoEntity) => {
    setDocumento({ ...documento });
    setDocumentoDialog({ type: "update", state: true });
  };

  const hideRemoveDocumentoDialog = () => {
    setRemoveDocumentoDialog(false);
  };

  const confirmRemoveDocumento = (documento: DocumentoEntity) => {
    setDocumento({ ...documento });
    setRemoveDocumentoDialog(true);
  };

  //tree
  const showMoveFileManagerDialog = async (fileManager: FileManagerEntity) => {
    setFileManager({ ...fileManager });

    await findAllTreeFileManager({
      cantidad_max: "0",
      Language: "ES",
      filters: [
        {
          campo: "Categoria",
          operador: "EQ",
          tipo: "string",
          valor1: `${titleFM?.id}`,
          valor2: "",
        },
      ],
      CustomIcon: "pi pi-folder",
      IdArea: userAuth?.Area?.IdArea,
      NotIncludeIdCarpeta: parseInt(fileManager.IdFM.split("_")[1]),
    });

    setMoveFileManagerDialog(true);
  };

  const hideMoveFileManagerDialog = () => {
    setSelectedFileMoved(null);
    setMoveFileManagerDialog(false);
  };

  // events change
  const onActivoChangeCarpeta = (e: RadioButtonChangeEvent) => {
    let _carpeta = { ...carpeta };
    _carpeta["Activo"] = e.value;
    setCarpeta(_carpeta);
  };

  const onInputChangeCarpeta = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";
    let _carpeta = { ...carpeta };

    // @ts-ignore
    _carpeta[name] = val;

    setCarpeta(_carpeta);
  };

  const onSwitchChangeDocumento = (e: InputSwitchChangeEvent) => {
    let _documento = { ...documento };
    _documento["FirmaDigital"] = e.value;
    setDocumento(_documento);
  };

  const onInputTextAreaChangeDocumento = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";
    let _documento = { ...documento };

    // @ts-ignore
    _documento[name] = val;

    setDocumento(_documento);
  };

  // templates to component DataTable
  const initFilters = () => {
    // setFilters({ ...defaultFilters });
    onGlobalFilterChange();
  };

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e?: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target.value ?? "";
    let _filters = { ...filters };

    // @ts-ignore
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onColumnToggle = (event: MultiSelectChangeEvent) => {
    let selectedColumns = event.value;

    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol: ColumnMeta) => sCol.field === col.field)
    );
    setVisibleColumns(orderedSelectedColumns);
  };

  const headerDataTable = (
    <div>
      <div className="flex flex-wrap justify-content-between gap-2 m-0 p-0">
        <div className="flex justify-content-between gap-2 align-items-center">
          <Button
            type="button"
            icon="pi pi-refresh"
            severity="info"
            onClick={() => {
              if (titleFM?.id == "MF") {
                findAllMyFilesFileManager(lastItemBreadCrumbMF);
              } else if (titleFM?.id == "FA") {
                findAllFilesAreaFileManager(lastItemBreadCrumbFA);
              }
              // findAllMyFilesFileManager({
              //   IdUsuario: 1,
              //   IdCarpeta: null,
              // });
              // setItemBreadCrumbs([]);
            }}
            style={{
              width: "2rem",
              height: "2rem",
              margin: "auto 0",
              color: "#fff",
            }}
          />
          <Button
            type="button"
            icon="pi pi-filter-slash"
            severity="secondary"
            onClick={clearFilter}
            style={{
              width: "2rem",
              height: "2rem",
              margin: "auto 0",
              color: "#fff",
            }}
          />

          <Dropdown
            value={selectedTitleFM}
            onChange={async (e) => {
              setSelectedTitleFM(e.value);
              if (e.value.id == "MF") {
                setTitleFM({ id: "MF", title: e.value.title });
                setLastItemBreadCrumbMF({
                  IdUsuario: userAuth?.IdUsuario,
                  IdCarpeta: null,
                  Categoria: "MF",
                });
                await findAllMyFilesFileManager({
                  IdUsuario: userAuth?.IdUsuario,
                  IdCarpeta: null,
                  Categoria: "MF",
                });
              } else if (e.value.id == "FA") {
                setTitleFM({ id: "FA", title: e.value.title });
                setLastItemBreadCrumbFA({
                  IdCarpeta: null,
                  IdArea: userAuth?.Area.IdArea,
                  Categoria: "FA",
                });
                await findAllFilesAreaFileManager({
                  IdCarpeta: null,
                  IdArea: userAuth?.Area.IdArea,
                  Categoria: "FA",
                });
              }
            }}
            options={[
              { id: "MF", title: "Mis archivos" },
              { id: "FA", title: "Archivos de área" },
              { id: "FS", title: "Compartidos conmigo" },
            ]}
            optionLabel="title"
            placeholder="Seleccionar Destino"
            className="flex flex-row align-items-center"
            style={{
              paddingTop: "1.2rem",
              paddingBottom: "1.2rem",
              width: "16rem",
              height: "2rem",
            }}
          />
        </div>

        <div className="flex justify-content-between gap-2">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              style={{
                paddingTop: "1.2rem",
                paddingBottom: "1.2rem",
                paddingLeft: "2.5rem",
                width: "18rem",
                height: "2rem",
              }}
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Buscar en todos los campos"
            />
          </IconField>
          <MultiSelect
            value={visibleColumns}
            options={columns}
            optionLabel="header"
            onChange={onColumnToggle}
            display="comma"
            style={{
              width: "3rem",
              height: "2.4rem",
            }}
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-content-between m-0 pt-2">
        <BreadCrumb
          className="p-2 w-full surface-section"
          model={itemBreadCrumbs}
          home={{
            label: " : ",
            icon: "pi pi-home pr-1",
            command: () => {
              if (titleFM?.id == "MF") {
                setLastItemBreadCrumbMF({
                  IdUsuario: userAuth?.IdUsuario,
                  IdCarpeta: null,
                  Categoria: "MF",
                });
                findAllMyFilesFileManager({
                  IdUsuario: userAuth?.IdUsuario,
                  IdCarpeta: null,
                  Categoria: "MF",
                });
              } else if (titleFM?.id == "FA") {
                setLastItemBreadCrumbFA({
                  IdCarpeta: null,
                  IdArea: userAuth?.Area.IdArea,
                  Categoria: "FA",
                });
                findAllFilesAreaFileManager({
                  IdCarpeta: null,
                  IdArea: userAuth?.Area.IdArea,
                  Categoria: "FA",
                });
              }
              setItemBreadCrumbs([]);
            },
          }}
        />
      </div>
    </div>
  );

  // templates to column Descripcion
  const descripcionBodyTemplate = (rowData: FileManagerEntity) => {
    const typeElement = rowData.IdFM.split("_")[0];
    return (
      <div className="flex flex-row gap-2">
        {/* icon */}
        <div className="flex align-items-center justify-content-center pr-1">
          {typeElement == "c" ? (
            <i
              className="pi pi-folder-open"
              style={{ color: "orange", fontSize: "1.5rem" }}
            ></i>
          ) : (
            <i
              className="pi pi-file-pdf"
              style={{ color: "#e55", fontSize: "1.5rem" }}
            ></i>
          )}
        </div>
        {/* descripcion */}
        <div className="flex flex-column gap-2">
          {typeElement == "c" ? (
            <span
              className="hover:underline hover:text-orange-500"
              onClick={() => {
                if (titleFM?.id == "MF") {
                  setLastItemBreadCrumbMF({
                    IdUsuario: userAuth?.IdUsuario,
                    IdCarpeta: parseInt(rowData.IdFM.split("_")[1]),
                    Categoria: "MF",
                  });
                  findAllMyFilesFileManager({
                    IdUsuario: userAuth?.IdUsuario,
                    IdCarpeta: parseInt(rowData.IdFM.split("_")[1]),
                    Categoria: "MF",
                  });
                } else if (titleFM?.id == "FA") {
                  setLastItemBreadCrumbFA({
                    IdCarpeta: parseInt(rowData.IdFM.split("_")[1]),
                    IdArea: userAuth?.Area.IdArea,
                    Categoria: "FA",
                  });
                  findAllFilesAreaFileManager({
                    IdCarpeta: parseInt(rowData.IdFM.split("_")[1]),
                    IdArea: userAuth?.Area.IdArea,
                    Categoria: "FA",
                  });
                }

                setItemBreadCrumbs([
                  ...itemBreadCrumbs,
                  {
                    label: rowData.Descripcion,
                    icon: "pi pi-home",
                    command: (event: MenuItemCommandEvent) => {
                      if (titleFM?.id == "MF") {
                        setLastItemBreadCrumbMF({
                          IdUsuario: userAuth?.IdUsuario,
                          IdCarpeta: parseInt(rowData.IdFM.split("_")[1]),
                          Categoria: "MF",
                        });
                        findAllMyFilesFileManager({
                          IdUsuario: userAuth?.IdUsuario,
                          IdCarpeta: parseInt(rowData.IdFM.split("_")[1]),
                          Categoria: "MF",
                        });
                      } else if (titleFM?.id == "FA") {
                        setLastItemBreadCrumbFA({
                          IdCarpeta: parseInt(rowData.IdFM.split("_")[1]),
                          IdArea: userAuth?.Area.IdArea,
                          Categoria: "FA",
                        });
                        findAllFilesAreaFileManager({
                          IdCarpeta: parseInt(rowData.IdFM.split("_")[1]),
                          IdArea: userAuth?.Area.IdArea,
                          Categoria: "FA",
                        });
                      }

                      setItemBreadCrumbs([
                        ...itemBreadCrumbs,
                        {
                          label: event.item.label,
                          icon: event.item.icon,
                          command: event.item.command,
                        },
                      ]);
                    },
                  },
                ]);
              }}
            >
              {rowData.Descripcion}
            </span>
          ) : (
            <a
              className="hover:underline hover:text-red-300"
              style={{ textDecoration: "none", color: "var(--text-color)" }}
              href={`${rowData.UrlFM}`}
              target="_blank"
            >
              {rowData.Descripcion}
            </a>
          )}
          <span className="text-xs m-0">
            {rowData.FechaEmision
              ? formatDate(new Date(rowData.FechaEmision))
              : ""}
          </span>
        </div>
      </div>
    );
  };

  const descripcionFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <div className="flex align-items-center justify-content-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
          Activo
        </label>
        <TriStateCheckbox
          id="verified-filter"
          value={options.value}
          onChange={(e: TriStateCheckboxChangeEvent) =>
            options.filterCallback(e.value)
          }
        />
      </div>
    );
  };

  // templates to column Estado
  const estadoBodyTemplate = (rowData: FileManagerEntity) => {
    const bgColor = getColorById(rowData.Estado?.IdEstado ?? 0);

    return (
      <div style={{ padding: "0 1em" }}>
        {rowData.Estado?.Descripcion != null && (
          <p
            className="flex justify-content-center align-items-center px-2 py-1 text-sm"
            style={{
              backgroundColor: bgColor,
              color: "#fff",
              borderRadius: "7px",
            }}
          >
            {rowData.Estado?.Descripcion}
          </p>
        )}
      </div>
    );
  };

  const estadoFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <>
        <div className="mb-3 text-sm w-12rem">Estado Picker</div>
        <MultiSelect
          value={options.value}
          options={estados}
          itemTemplate={(option: EstadoEntity) => {
            const bgColor = getColorById(option?.IdEstado ?? 0);

            return (
              <div
                className="flex align-items-center px-2 py-1"
                style={{
                  backgroundColor: bgColor,
                  color: "#fff",
                  borderRadius: "7px",
                }}
              >
                {" "}
                <span>{option?.Descripcion}</span>
              </div>
            );
          }}
          onChange={(e: MultiSelectChangeEvent) =>
            options.filterCallback(e.value)
          }
          optionLabel="Descripcion"
          optionValue="Descripcion"
          placeholder="Seleccionar"
          className="p-column-filter"
        />
      </>
    );
  };

  // templates to column Usuario
  const usuarioBodyTemplate = (rowData: FileManagerEntity) => {
    return (
      <div className="flex flex-column gap-2">
        <p className="text-sm m-0">
          {rowData.Usuario.Nombres +
            " " +
            rowData.Usuario.ApellidoPaterno +
            " " +
            rowData.Usuario.ApellidoMaterno}
        </p>
        <span className="text-xs text-color-secondary m-0">
          {rowData.Usuario.Area.Descripcion}
        </span>
      </div>
    );
  };

  const usuarioFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <Calendar
        value={options.value ? new Date(options.value) : null}
        onChange={(e) => {
          options.filterCallback(e.value, options.index);
        }}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
        showIcon
      />
    );
  };

  // templates to column FechaEmision
  const fechaEmisionBodyTemplate = (rowData: FileManagerEntity) => {
    return (
      <p className="text-sm m-0">
        {!rowData.FechaEmision
          ? "00/00/0000, 00:00 TM"
          : formatDate(new Date(rowData.FechaEmision))}
      </p>
    );
  };

  const fechaEmisionFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <Calendar
        value={options.value ? new Date(options.value) : null}
        onChange={(e) => {
          options.filterCallback(e.value, options.index);
        }}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
        showIcon
      />
    );
  };

  // templates to actions update and remove on dataTable
  const getItemsMenuActionsFM = (rowData: FileManagerEntity): MenuItem[] => {
    const isOwner = rowData.Usuario.IdUsuario === userAuth?.IdUsuario;
    const typeElement = rowData.IdFM.split("_")[0];
    const isSigned = rowData.FirmaDigital;

    if (typeElement === "c") {
      return isOwner
        ? [
            {
              label: "Editar",
              icon: "pi pi-pencil",
              command: () => {
                showUpdateCarpetaDialog({
                  IdCarpeta: parseInt(rowData.IdFM.split("_")[1]),
                  IdCarpetaPadre: rowData.Carpeta?.IdCarpeta,
                  Descripcion: rowData.Descripcion,
                  CreadoEl: rowData.FechaEmision,
                  Categoria: rowData.Categoria,
                  IdUsuario: rowData.Usuario.IdUsuario,
                  Activo: rowData.Activo,
                });
              },
            },
            {
              label: "Mover",
              // icon: "pi pi-file-export",
              icon: "pi pi-send",
              command: () => {
                showMoveFileManagerDialog(rowData);
              },
            },
            {
              label: "Eliminar",
              icon: "pi pi-trash",
              command: () => {
                confirmRemoveCarpeta({
                  IdCarpeta: parseInt(rowData.IdFM.split("_")[1]),
                  IdCarpetaPadre: rowData.Carpeta?.IdCarpeta,
                  Descripcion: rowData.Descripcion,
                  CreadoEl: rowData.FechaEmision,
                  Categoria: rowData.Categoria,
                  IdUsuario: rowData.Usuario.IdUsuario,
                  Activo: rowData.Activo,
                });
              },
            },
            { label: "Compartir", icon: "pi pi-user-plus", disabled: true },
          ]
        : [{ label: "Compartir", icon: "pi pi-user-plus", disabled: true }];
    }

    if (!isSigned) {
      return isOwner
        ? [
            {
              label: "Eliminar",
              icon: "pi pi-trash",
              command: () => {
                confirmRemoveDocumento({
                  IdDocumento: parseInt(rowData.IdFM.split("_")[1]),
                  Titulo: rowData.Descripcion,
                  FechaEmision: rowData.FechaEmision,
                  UrlDocumento: rowData.UrlFM,
                  FirmaDigital: rowData.FirmaDigital,
                  Categoria: rowData.Categoria,
                  IdUsuario: rowData.Usuario.IdUsuario,
                  IdEstado: rowData.Estado.IdEstado,
                  IdCarpeta: rowData.Carpeta?.IdCarpeta,
                });
              },
            },
            {
              label: "Mover",
              // icon: "pi pi-file-export",
              icon: "pi pi-send",
              command: () => {
                showMoveFileManagerDialog(rowData);
              },
            },
            { label: "Compartir", icon: "pi pi-user-plus", disabled: true },
          ]
        : [{ label: "Compartir", icon: "pi pi-user-plus", disabled: true }];
    } else {
      return isOwner
        ? [
            {
              label: "Eliminar",
              icon: "pi pi-trash",
              command: () => {
                confirmRemoveDocumento({
                  IdDocumento: parseInt(rowData.IdFM.split("_")[1]),
                  Titulo: rowData.Descripcion,
                  FechaEmision: rowData.FechaEmision,
                  UrlDocumento: rowData.UrlFM,
                  FirmaDigital: rowData.FirmaDigital,
                  Categoria: rowData.Categoria,
                  IdUsuario: rowData.Usuario.IdUsuario,
                  IdEstado: rowData.Estado.IdEstado,
                  IdCarpeta: rowData.Carpeta?.IdCarpeta,
                });
              },
            },
            {
              label: "Mover",
              // icon: "pi pi-file-export",
              icon: "pi pi-send",
              command: () => {
                showMoveFileManagerDialog(rowData);
              },
            },
            { label: "Firmar", icon: "pi pi-pen-to-square", disabled: true },
            { label: "Ver Firmas", icon: "pi pi-list-check", disabled: true },
            { label: "Compartir", icon: "pi pi-user-plus", disabled: true },
          ]
        : [
            { label: "Firmar", icon: "pi pi-pen-to-square", disabled: true },
            { label: "Ver Firmas", icon: "pi pi-list-check", disabled: true },
            { label: "Compartir", icon: "pi pi-user-plus", disabled: true },
          ];
    }
  };

  const actionsBodyTemplate = (rowData: FileManagerEntity) => {
    const typeElement = rowData.IdFM.split("_")[0];

    return (
      <>
        {typeElement === "d" && (
          <>
            <Menu
              model={itemsMenuActionsFM}
              popup
              ref={menuActionsFM}
              id="popup_menu_right"
              popupAlignment="right"
            />
            <Button
              icon="pi pi-file-plus"
              className="mr-2"
              onClick={() => {
                // setItemsMenuActionsFM(getItemsMenuActionsFM(rowData));
                // menuActionsFM.current?.toggle(event);

                // we validate estado , it must to be Adjuntado(4) or Archivado(5)
                if (
                  rowData?.Estado.IdEstado === 4 ||
                  rowData?.Estado.IdEstado === 5
                ) {
                  toastx.current?.show({
                    severity: "error",
                    detail: `Este archivo ya ha sido adjuntado o archivado`,
                    life: 4000,
                  });
                  return;
                }

                // we verify that this file doesn't select before
                const repeatedDigitalFile = props.selectedDigitalFiles.filter(
                  (df) => df.IdFM == rowData.IdFM
                );

                if (repeatedDigitalFile.length > 0) {
                  toastx.current?.show({
                    severity: "info",
                    detail: `Este archivo digital ya ha sido selecionado anteriomente`,
                    life: 4000,
                  });
                  return;
                }

                // we select this file
                props.setSelectedDigitalFiles((prev) => [...prev, rowData]);

                // we close the fileMangerModal
                props.hideFileManagerDialog();

                // we clean the selectedFileManagers
                setSelectedFileManagers(null);
              }}
              aria-controls="popup_menu_right"
              aria-haspopup
              text
              size="small"
              severity="secondary"
              style={{
                color: "#fff",
                background: "#293",
                padding: ".5em",
              }}
            />
          </>
        )}
      </>
    );
  };

  //useEffects
  useEffect(() => {
    setTitleFM({ id: "MF", title: "Mis archivos" });
    setSelectedTitleFM({ id: "MF", title: "Mis archivos" });
    findAllMyFilesFileManager({
      IdUsuario: userAuth?.IdUsuario,
      IdCarpeta: null,
      Categoria: "MF",
    });
  }, []);

  useEffect(() => {
    findAllEstadoCombox();
  }, []);

  ////////////////////////////////////7
  const FilerManagerDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        size="small"
        outlined
        onClick={() => {
          props.hideFileManagerDialog();
        }}
      />
      <Button
        size="small"
        label="Seleccionar"
        icon="pi pi-check"
        onClick={() => {
          // we select this file
          if (selectedFileManagers) {
            props.setSelectedDigitalFiles((prev) => [
              ...prev,
              selectedFileManagers,
            ]);
          }

          // we close the fileMangerModal
          props.hideFileManagerDialog();

          // we clean the selectedFileManagers
          setSelectedFileManagers(null);
        }}
      />
    </>
  );

  return (
    <Dialog
      visible={props.fileManagerDialog}
      style={{ width: "70%" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Buscar archivo digital"
      headerStyle={{ padding: "1em 1em 0em 1em" }}
      modal
      className="p-fluid"
      footer={FilerManagerDialogFooter}
      onHide={props.hideFileManagerDialog}
    >
      <Toast ref={toastx} position={"bottom-right"} />

      <div className="flex flex-row flex-wrap justify-content-between">
        <div style={{ width: "100%" }}>
          <DataTable
            value={fileManagers}
            sortMode="multiple"
            removableSort
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            scrollable
            scrollHeight="55vh"
            header={headerDataTable}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} de {last} del total {totalRecords} registros"
            paginatorClassName="p-1"
            filters={filters}
            globalFilterFields={[
              "IdFM",
              "Descripcion",
              "Usuario.NombreCompleto",
              "Estado.Descripcion",
              "FechaEmision",
            ]}
            emptyMessage={<EmptyMessageData loading={loading} />}
            selectionMode="single"
            selection={selectedFileManagers}
            onSelectionChange={(e) => {
              setSelectedFileManagers(e.value as FileManagerEntity | null);
            }}
            dataKey="IdFM"
            selectionPageOnly
            // loading={loading}
          >
            <Column
              selectionMode="single"
              exportable={false}
              headerStyle={{ width: "0%" }}
            />
            {visibleColumns.map((col) => {
              if (col.field == "Descripcion") {
                return (
                  <Column
                    key={col.field}
                    field={col.field}
                    filterField={col.filterField}
                    sortField={col.filterField}
                    header={col.header}
                    dataType={col.dataType}
                    sortable
                    style={{ width: col.width, padding: 5 }}
                    filter
                    filterPlaceholder={col.filterPlaceholder}
                    body={descripcionBodyTemplate}
                    // filterElement={creadoElFilterTemplate}
                  />
                );
              } else if (col.field == "Usuario") {
                return (
                  <Column
                    key={col.field}
                    field={col.field}
                    filterField={col.filterField}
                    sortField={col.filterField}
                    header={col.header}
                    dataType={col.dataType}
                    sortable
                    style={{ width: col.width, padding: 5 }}
                    filter
                    filterPlaceholder={col.filterPlaceholder}
                    body={usuarioBodyTemplate}
                    // filterElement={creadoElFilterTemplate}
                  />
                );
              } else if (col.field == "Estado") {
                return (
                  <Column
                    key={col.field}
                    field={col.field}
                    filterField={col.filterField}
                    showFilterMatchModes={false}
                    sortField={col.filterField}
                    header={col.header}
                    dataType={col.dataType}
                    sortable
                    style={{ width: col.width, padding: 5 }}
                    filter
                    filterPlaceholder={col.filterPlaceholder}
                    body={estadoBodyTemplate}
                    filterElement={estadoFilterTemplate}
                  />
                );
              } else if (col.field == "FechaEmision") {
                return (
                  <Column
                    key={col.field}
                    field={col.field}
                    filterField={col.field}
                    header={col.header}
                    dataType={col.dataType}
                    sortable
                    style={{ width: col.width, padding: 5 }}
                    filter
                    filterPlaceholder={col.filterPlaceholder}
                    body={fechaEmisionBodyTemplate}
                    filterElement={fechaEmisionFilterTemplate}
                  />
                );
              } else {
                return (
                  <Column
                    key={col.field}
                    field={col.field}
                    header={col.header}
                    dataType={col.dataType}
                    sortable
                    style={{ width: col.width, padding: 5 }}
                    filter
                    filterPlaceholder={col.filterPlaceholder}
                  />
                );
              }
            })}
            <Column
              body={actionsBodyTemplate}
              exportable={false}
              style={{ width: "5%", padding: 5 }}
            ></Column>
          </DataTable>
        </div>
      </div>

      <CarpetaCreateOrUpdate
        submitted={submitted}
        carpeta={carpeta}
        carpetaDialog={carpetaDialog}
        hideDialog={hideCarpetaDialog}
        createCarpeta={createCarpetaFileManager}
        updateCarpeta={updateCarpetaFileManager}
        onInputChange={onInputChangeCarpeta}
        onActivoChange={onActivoChangeCarpeta}
        loadingCarpetaCreateOrUpdate={loadingCarpetaCreateOrUpdate}
      />

      <CarpetaRemove
        carpeta={carpeta}
        removeCarpetaDialog={removeCarpetaDialog}
        hideRemoveCarpetaDialog={hideRemoveCarpetaDialog}
        removeCarpeta={removeCarpetaFileManager}
      />

      <DocumentoCreateOrUpdate
        submitted={submitted}
        documento={documento}
        documentoDialog={documentoDialog}
        hideDialog={hideDocumentoDialog}
        createDocumento={createDocumentoFileManager}
        updateDocumento={updateDocumentoFileManager}
        onInputTextAreaChange={onInputTextAreaChangeDocumento}
        onSwitchChange={onSwitchChangeDocumento}
        loadingDocumentoCreateOrUpdate={loadingDocumentoCreateOrUpdate}
        selectedFilesUpload={selectedFilesUpload}
        setSelectedFilesUpload={setSelectedFilesUpload}
        totalSizeFilesUpload={totalSizeFilesUpload}
        setTotalSizeFilesUpload={setTotalSizeFilesUpload}
      />

      <DocumentoRemove
        documento={documento}
        removeDocumentoDialog={removeDocumentoDialog}
        hideRemoveDocumentoDialog={hideRemoveDocumentoDialog}
        removeDocumento={removeDocumentoFileManager}
      />

      <FileManagerMove
        usuario={userAuth}
        fileManager={fileManager}
        carpetas={treeFileManager}
        selectedFileMoved={selectedFileMoved}
        setSelectedFileMoved={setSelectedFileMoved}
        moveFileManagerDialog={moveFileManagerDialog}
        hideDialog={hideMoveFileManagerDialog}
        moveFileManager={moveFileManager}
        loadingFileManagerMove={loadingFileManagerMove}
        findAllTreeFileManager={findAllTreeFileManager}
      />
    </Dialog>
  );
};

export default FileManagerModal;
