import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { MenuItem, MenuItemCommandEvent } from "primereact/menuitem";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { useState, useEffect, useRef } from "react";
import { ColumnMeta } from "../../utils/Interfaces";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import {
  FileManagerAws,
  FileManagerAwsEntity,
  FileManagerEntity,
} from "../interfaces/FileAwsInterface";
import { Toast } from "primereact/toast";
import { columns, defaultFilters } from "../utils/Constants";
import { formatDate, getColorById } from "../../utils/Methods";
import { Calendar } from "primereact/calendar";
import EmptyMessageData from "../../utils/shared/EmptyMessageData";
import { Menu } from "primereact/menu";
import { BreadCrumb } from "primereact/breadcrumb";
import { useAuth } from "../../auth/context/AuthContext";
import { EstadoEntity } from "../../estado/interfaces/EstadoInterface";
import UseEstado from "../../estado/hooks/UseEstado";
import { InputNumberChangeEvent } from "primereact/inputnumber";
import UseArea from "../../area/hooks/UseArea";
import { AreaEntity } from "../../area/interfaces/AreaInterface";
import UseTipoDocumento from "../../tipo-documento/hooks/UseTipoDocumento";
import { TipoDocumentoEntity } from "../../tipo-documento/interfaces/TipoDocumentoInterface";
import { DocumentoAwsEntity } from "../../documento/interfaces/DocumentoInterface";
import { emptyDocumentoAws } from "../../documento/utils/Constants";
import DocumentoRemove from "../../documento/components/DocumentoRemove";
import DocumentoAwsCreateOrUpdate from "../../documento/components/DocumentoAwsCreateOrUpdate";
import { DropdownChangeEvent } from "primereact/dropdown";
import UseFileAws from "../hooks/UseFileAws";

const FileAws = () => {
  // custom hooks
  const { userAuth } = useAuth()!;

  const { findAllByArea, create, remove } = UseFileAws();

  const { findAll: findAllArea } = UseArea();

  const { findAll: findAllTipoDocumento } = UseTipoDocumento();

  const { findAll: findAllEstado } = UseEstado();

  //useRefs
  const toastx = useRef<Toast>(null);

  const menuActionsFM = useRef<Menu>(null);

  //useStates
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

  const [loadingDocumentoCreateOrUpdate, setLoadingDocumentoCreateOrUpdate] =
    useState<boolean>(false);

  const [areas, setAreas] = useState<
    Pick<AreaEntity, "IdArea" | "Descripcion">[]
  >([]);

  const [tiposDocumento, setTiposDocumento] = useState<
    Pick<TipoDocumentoEntity, "IdTipoDocumento" | "Descripcion">[]
  >([]);

  const [documentoAws, setDocumentoAws] =
    useState<DocumentoAwsEntity>(emptyDocumentoAws);

  const [filesManagerAws, setFilesManagerAws] = useState<
    FileManagerAwsEntity[]
  >([]);

  const [selectedFilesManagerAws, setSelectedFilesManagerAws] = useState<
    FileManagerAwsEntity[]
  >([]);

  const [documentoDialog, setDocumentoDialog] = useState<{
    type?: "create" | "update" | undefined;
    state: boolean;
  }>({
    state: false,
  });

  const [formErrors, setFormErrors] = useState<any>({});

  const [removeDocumentoDialog, setRemoveDocumentoDialog] =
    useState<boolean>(false);

  const [itemBreadCrumbs, setItemBreadCrumbs] = useState<MenuItem[]>([]);

  const [lastItemBreadCrumb, setLastItemBreadCrumb] = useState<FileManagerAws>({
    StorageDO: null,
  });

  const startContent = (
    <div className="flex flex-column p-1 gap-2">
      <h3 className="m-0">Mis archivos</h3>
    </div>
  );

  // actions CRUD (create, read, update, ) -> (create, findAll-findOne, update, )
  const findAllFileManagerAws = async (fileManagerAws: FileManagerAws) => {
    setLoading(true);
    const filesAws = await findAllByArea(fileManagerAws);

    if (filesAws?.message.msgId == 0 && filesAws.registro) {
      setFilesManagerAws(
        Array.isArray(filesAws.registro)
          ? filesAws.registro?.map((af) => {
              return {
                ...af,
                FechaEmision: af.FechaEmision
                  ? new Date(af.FechaEmision)
                  : null,
              };
            })
          : []
      );
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  const createDocumentoFileManager = async () => {
    setSubmitted(true);
    if (
      selectedFilesUpload.length != 0 &&
      (documentoAws.IdTipoDocumento ?? 0) != 0 &&
      (documentoAws.IdArea ?? 0) != 0 &&
      (documentoAws.Folios ?? 0) != 0
    ) {
      setLoadingDocumentoCreateOrUpdate(true);

      const formData = new FormData();

      selectedFilesUpload.forEach((fileUpload) => {
        formData.append("file", fileUpload);
        formData.append("IdArea", documentoAws.IdArea?.toString() ?? "");
        formData.append("Folios", documentoAws.Folios?.toString() ?? "");
        formData.append(
          "IdTipoDocumento",
          documentoAws.IdTipoDocumento?.toString() ?? ""
        );
      });

      const fileUpload = await create(formData);

      setLoadingDocumentoCreateOrUpdate(false);

      if (fileUpload?.message.msgId == 0 && fileUpload.registro) {
        setFilesManagerAws([...filesManagerAws, fileUpload.registro]);

        toastx.current?.show({
          severity: "success",
          detail: `${fileUpload.message.msgTxt}`,
          life: 3000,
        });
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
      setDocumentoAws(emptyDocumentoAws);
    }
  };

  // updateDocumentoFileManager - doesn't work
  const updateDocumentoFileManager = async () => {
    setSubmitted(true);
    // if (documentoAws.IdDocumento) {
    //   setLoadingDocumentoCreateOrUpdate(true);
    //   let documentoUpdate = await updateDocumento(
    //     documentoAws.IdDocumento.toString(),
    //     {
    //       Descripcion: documentoAws.Descripcion,
    //       Activo: documentoAws.Activo,
    //     }
    //   );
    //   setLoadingDocumentoCreateOrUpdate(false);

    //   if (documentoUpdate?.message.msgId == 0 && documentoUpdate.registro) {
    //     setFilesManagerAws(
    //       filesManagerAws?.map((fileManager) =>
    //         fileManager.IdFM === documentoUpdate?.registro?.IdFM
    //           ? { ...fileManager, ...documentoUpdate.registro }
    //           : fileManager
    //       )
    //     );
    //     toastx.current?.show({
    //       severity: "success",
    //       detail: `${documentoUpdate.message.msgTxt}`,
    //       life: 3000,
    //     });
    //   } else if (documentoUpdate?.message.msgId == 1) {
    //     toastx.current?.show({
    //       severity: "error",
    //       detail: `${documentoUpdate.message.msgTxt}`,
    //       life: 3000,
    //     });
    //   }

    //   setDocumentoDialog({ state: false });
    //   setDocumentoAws(emptyDocumentoAws);
    // }
  };

  const removeDocumentoFileManager = async () => {
    if (documentoAws.IdDocumento) {
      const fileRemoved = await remove(documentoAws.IdDocumento.toString());

      if (fileRemoved?.message.msgId == 0) {
        setFilesManagerAws((prev) => {
          return prev?.filter(
            (fileManager) => fileManager.IdFM !== fileRemoved?.registro?.IdFM
          );
        });

        toastx.current?.show({
          severity: "success",
          detail: `${fileRemoved.message.msgTxt}`,
          life: 3000,
        });
      } else {
        toastx.current?.show({
          severity: "error",
          detail: `${fileRemoved?.message.msgTxt}`,
          life: 3000,
        });
      }

      setRemoveDocumentoDialog(false);
      setDocumentoAws(emptyDocumentoAws);
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

  const findAllAreaCombox = async () => {
    const areasFindAll = await findAllArea();

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

  // templates to dialogs
  //documentoAws
  const hideDocumentoDialog = () => {
    setSubmitted(false);
    setDocumentoDialog({ state: false });
    setSelectedFilesUpload([]);
    setTotalSizeFilesUpload(0);
    setFormErrors({});
  };

  const showCreateDocumentoDialog = () => {
    setDocumentoAws(emptyDocumentoAws);
    setSubmitted(false);
    setDocumentoDialog({ type: "create", state: true });
  };

  const showUpdateDocumentoDialog = (documentoAws: DocumentoAwsEntity) => {
    setDocumentoAws({ ...documentoAws });
    setDocumentoDialog({ type: "update", state: true });
  };

  const hideRemoveDocumentoDialog = () => {
    setRemoveDocumentoDialog(false);
  };

  const confirmRemoveDocumento = (documentoAws: DocumentoAwsEntity) => {
    setDocumentoAws({ ...documentoAws });
    setRemoveDocumentoDialog(true);
  };

  // events change
  const onDropdownChangeDocumento = (
    e: DropdownChangeEvent,
    nameObj: string,
    nameFK: string,
    nameTagFK?: string
  ) => {
    const val = (e.target && e.target.value) || "";

    let _documentoAws: any = { ...documentoAws };

    _documentoAws[nameTagFK ? nameTagFK : nameFK] = val[nameFK];

    if (nameObj !== "") {
      _documentoAws[nameObj] = { ...val };
    }

    setDocumentoAws(_documentoAws);
  };

  const onDropdownChange = (
    e: DropdownChangeEvent,
    nameFK: string,
    nameObj: string
  ) => {
    const val = (e.target && e.target.value) || "";

    let _documentoAws: any = { ...documentoAws };

    _documentoAws[nameFK] = val[nameFK];
    _documentoAws[nameObj] = { ...val };

    setDocumentoAws(_documentoAws);

    setFormErrors((prev: any) => ({ ...prev, [nameFK]: undefined }));
  };

  const onInputNumberChangeDocumento = (
    e: InputNumberChangeEvent,
    name: string
  ) => {
    const val = e.value ?? null;

    setDocumentoAws((prev) => ({
      ...prev,
      [name]: val,
    }));

    setFormErrors((prev: any) => ({ ...prev, [name]: undefined }));
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
            icon="pi pi-plus"
            severity="success"
            onClick={showCreateDocumentoDialog}
            style={{
              width: "2rem",
              height: "2rem",
              margin: "auto 0",
              color: "#fff",
            }}
          />
          <Button
            type="button"
            icon="pi pi-refresh"
            severity="info"
            onClick={() => {
              findAllFileManagerAws(lastItemBreadCrumb);
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
              setLastItemBreadCrumb({
                StorageDO: null,
              });

              findAllFileManagerAws({
                StorageDO: null,
              });

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
                console.log(rowData.IdFM.split("_")[1]);

                setLastItemBreadCrumb({
                  StorageDO: rowData.IdFM.split("_")[1],
                });
                findAllFileManagerAws({
                  StorageDO: rowData.IdFM.split("_")[1],
                });

                setItemBreadCrumbs([
                  ...itemBreadCrumbs,
                  {
                    label: rowData.Descripcion,
                    icon: "pi pi-home",
                    command: (event: MenuItemCommandEvent) => {
                      setLastItemBreadCrumb({
                        StorageDO: rowData.IdFM.split("_")[1],
                      });

                      findAllFileManagerAws({
                        StorageDO: rowData.IdFM.split("_")[1],
                      });

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
  const getItemsMenuActionsFM = (rowData: FileManagerAwsEntity): MenuItem[] => {
    const typeElement = rowData.IdFM.split("_")[0];

    if (typeElement === "c") {
      return [
        {
          label: "Ver",
          icon: "pi pi-eye",
          command: () => {
            setLastItemBreadCrumb({
              StorageDO: rowData.IdFM.split("_")[1],
            });

            findAllFileManagerAws({
              StorageDO: rowData.IdFM.split("_")[1],
            });

            setItemBreadCrumbs([
              ...itemBreadCrumbs,
              {
                label: rowData.Descripcion,
                icon: "pi pi-home",
                command: (event: MenuItemCommandEvent) => {
                  setLastItemBreadCrumb({
                    StorageDO: rowData.IdFM.split("_")[1],
                  });

                  findAllFileManagerAws({
                    StorageDO: rowData.IdFM.split("_")[1],
                  });

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
          },
        },
      ];
    } else {
      return [
        {
          label: "Eliminar",
          icon: "pi pi-trash",
          command: () => {
            confirmRemoveDocumento({
              IdDocumento: parseInt(rowData.IdFM.split("_")[1]),
              Titulo: rowData.Descripcion,
              FechaEmision: rowData.FechaEmision,
              UrlDocumento: rowData.UrlFM,
              SizeDocumento: rowData.Size,
              IdEstado: rowData.Estado.IdEstado,
            });
          },
        },
      ];
    }
  };

  const actionsBodyTemplate = (rowData: FileManagerEntity) => {
    return (
      <>
        <Menu
          model={itemsMenuActionsFM}
          popup
          ref={menuActionsFM}
          id="popup_menu_right"
          popupAlignment="right"
        />
        <Button
          icon="pi pi-bars"
          className="mr-2"
          onClick={(event) => {
            setItemsMenuActionsFM(getItemsMenuActionsFM(rowData));
            menuActionsFM.current?.toggle(event);
          }}
          aria-controls="popup_menu_right"
          aria-haspopup
          text
          size="small"
          severity="secondary"
        />
      </>
    );
  };

  //useEffects
  useEffect(() => {
    if (userAuth?.IdUsuario) {
      findAllFileManagerAws({
        StorageDO: null,
      });
    }
  }, [userAuth?.IdUsuario]);

  useEffect(() => {
    findAllEstadoCombox();
    findAllAreaCombox();
    findAllTipoDocumentoCombox();
  }, []);

  return (
    <div className="">
      <Toast ref={toastx} position={"bottom-right"} />

      <div className="flex flex-row flex-wrap justify-content-between">
        <div style={{ width: "100%" }}>
          <Toolbar
            style={{
              margin: "0",
              padding: "0.4em .5em",
            }}
            start={startContent}
          />

          <DataTable
            value={filesManagerAws}
            sortMode="multiple"
            removableSort
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            scrollable
            scrollHeight="60vh"
            header={headerDataTable}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} de {last} del total {totalRecords} registros"
            paginatorClassName="p-1"
            filters={filters}
            globalFilterFields={[
              "IdFM",
              "Descripcion",
              "Estado.Descripcion",
              "FechaEmision",
            ]}
            emptyMessage={<EmptyMessageData loading={loading} />}
            selectionMode="checkbox"
            selection={selectedFilesManagerAws}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedFilesManagerAws(e.value);
              }
            }}
            dataKey="IdFM"
            selectionPageOnly
            // loading={loading}
          >
            <Column
              selectionMode="multiple"
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

      <DocumentoAwsCreateOrUpdate
        submitted={submitted}
        documentoAws={documentoAws}
        documentoDialog={documentoDialog}
        hideDialog={hideDocumentoDialog}
        createDocumento={createDocumentoFileManager}
        updateDocumento={updateDocumentoFileManager}
        onInputNumberChange={onInputNumberChangeDocumento}
        // onDropdownChangeDocumento={onDropdownChangeDocumento}
        onDropdownChange={onDropdownChange}
        loadingDocumentoCreateOrUpdate={loadingDocumentoCreateOrUpdate}
        selectedFilesUpload={selectedFilesUpload}
        setSelectedFilesUpload={setSelectedFilesUpload}
        totalSizeFilesUpload={totalSizeFilesUpload}
        setTotalSizeFilesUpload={setTotalSizeFilesUpload}
        areas={areas}
        tiposDocumento={tiposDocumento}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
      />

      <DocumentoRemove
        documento={documentoAws}
        removeDocumentoDialog={removeDocumentoDialog}
        hideRemoveDocumentoDialog={hideRemoveDocumentoDialog}
        removeDocumento={removeDocumentoFileManager}
      />
    </div>
  );
};

export default FileAws;
