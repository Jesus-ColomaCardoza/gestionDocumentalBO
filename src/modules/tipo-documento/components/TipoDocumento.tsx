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
import UseTipoDocumento from "../hooks/UseTipoDocumento";
import { ColumnMeta } from "../../utils/Interfaces";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import {
  TipoDocumentoCreate,
  TipoDocumentoEntity,
  TipoDocumentoOut,
  TipoDocumentosOut,
} from "../interfaces/TipoDocumentoInterface";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { columns, defaultFilters, emptyTipoDocumento } from "../utils/Constants";
import TipoDocumentoCreateOrUpdate from "./TipoDocumentoCreateOrUpdate";
import TipoDocumentoRemove from "./TipoDocumentoRemove";
import TipoDocumentosRemove from "./TipoDocumentosRemove";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { formatDate } from "../../utils/Methods";
import { Calendar } from "primereact/calendar";
import EmptyMessageData from "../../utils/shared/EmptyMessageData";

const TipoDocumento = () => {
  // custom hooks
  const { create, findAll, findOne, update, remove } = UseTipoDocumento();

  //useRefs
  const toast = useRef<Toast>(null);

  const dt = useRef<DataTable<TipoDocumentoEntity[]>>(null);

  //useStates
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(
    columns.filter((col: ColumnMeta) => col.show)
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingTipoDocumentoCreateOrUpdate, setLoadingTipoDocumentoCreateOrUpdate] =
    useState<boolean>(false);

  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumentoEntity>(emptyTipoDocumento);

  const [tipoDocumentos, setTipoDocumentos] = useState<TipoDocumentoEntity[]>([]);

  const [selectedTipoDocumentos, setSelectedTipoDocumentos] = useState<TipoDocumentoEntity[]>([]);

  const [tipoDocumentoDialog, setTipoDocumentoDialog] = useState<{
    type?: "create" | "update" | undefined;
    state: boolean;
  }>({
    state: false,
  });

  const [removeTipoDocumentoDialog, setRemoveTipoDocumentoDialog] = useState<boolean>(false);

  const [removeTipoDocumentosDialog, setRemoveTipoDocumentosDialog] = useState<boolean>(false);

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

  const startContent = (
    <div className="flex flex-column p-1 gap-2">
      <h3 className="m-0">Mantenimiento de Tipo Documentos</h3>
      {/* <div>
        <Button label="Nuevo" icon="pi pi-plus" className=" p-2 " outlined />
      </div> */}
    </div>
  );

  const centerContent = (
    <IconField iconPosition="left">
      <InputIcon className="pi pi-search" />
      <InputText placeholder="Search" />
    </IconField>
  );

  const endContent = (
    <>
      <SplitButton label="Aceptar" model={items} icon="pi pi-check"></SplitButton>
    </>
  );

  // actions CRUD (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllTipoDocumento = async () => {
    setLoading(true);
    const tipoDocumentosFindAll = await findAll();
    setLoading(false);

    if (tipoDocumentosFindAll?.message.msgId == 0 && tipoDocumentosFindAll.registro) {
      setTipoDocumentos(
        Array.isArray(tipoDocumentosFindAll.registro)
          ? tipoDocumentosFindAll.registro?.map((af) => {
              return {
                ...af,
                CreadoEl: af.CreadoEl ? new Date(af.CreadoEl) : null,
                ModificadoEl: af.ModificadoEl
                  ? new Date(af.ModificadoEl)
                  : null,
              };
            })
          : []
      );
      //   toast.current?.show({
      //     severity: "success",
      //     detail: `${tipoDocumentosFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
      // } else if (tipoDocumentosFindAll?.message.msgId == 1) {
      //   toast.current?.show({
      //     severity: "error",
      //     detail: `${tipoDocumentosFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  const createTipoDocumento = async () => {
    setSubmitted(true);
    if (tipoDocumento.Descripcion.trim()) {
      setLoadingTipoDocumentoCreateOrUpdate(true);
      let tipoDocumentoCreate = await create({
        Descripcion: tipoDocumento.Descripcion,
        Activo: tipoDocumento.Activo,
      });
      setLoadingTipoDocumentoCreateOrUpdate(false);

      if (tipoDocumentoCreate?.message.msgId == 0 && tipoDocumentoCreate.registro) {
        setTipoDocumentos([...tipoDocumentos, tipoDocumentoCreate.registro]);
        toast.current?.show({
          severity: "success",
          detail: `${tipoDocumentoCreate.message.msgTxt}`,
          life: 3000,
        });
      } else if (tipoDocumentoCreate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${tipoDocumentoCreate.message.msgTxt}`,
          life: 3000,
        });
      }

      setTipoDocumentoDialog({ state: false });
      setTipoDocumento(emptyTipoDocumento);
    }
  };

  const updateTipoDocumento = async () => {
    setSubmitted(true);
    if (tipoDocumento.IdTipoDocumento) {
      setLoadingTipoDocumentoCreateOrUpdate(true);
      let tipoDocumentoUpdate = await update(tipoDocumento.IdTipoDocumento.toString(), {
        Descripcion: tipoDocumento.Descripcion,
        Activo: tipoDocumento.Activo,
      });
      setLoadingTipoDocumentoCreateOrUpdate(false);

      if (tipoDocumentoUpdate?.message.msgId == 0 && tipoDocumentoUpdate.registro) {
        setTipoDocumentos(
          tipoDocumentos?.map((tipoDocumento) =>
            tipoDocumento.IdTipoDocumento === tipoDocumentoUpdate?.registro?.IdTipoDocumento
              ? { ...tipoDocumento, ...tipoDocumentoUpdate.registro }
              : tipoDocumento
          )
        );
        toast.current?.show({
          severity: "success",
          detail: `${tipoDocumentoUpdate.message.msgTxt}`,
          life: 3000,
        });
      } else if (tipoDocumentoUpdate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${tipoDocumentoUpdate.message.msgTxt}`,
          life: 3000,
        });
      }

      setTipoDocumentoDialog({ state: false });
      setTipoDocumento(emptyTipoDocumento);
    }
  };

  const removeTipoDocumento = async () => {
    if (tipoDocumento.IdTipoDocumento) {
      let tipoDocumentoRemove = await remove(tipoDocumento.IdTipoDocumento.toString());

      if (tipoDocumentoRemove?.message.msgId == 0 && tipoDocumentoRemove.registro) {
        setTipoDocumentos(
          tipoDocumentos?.filter((tipoDocumento) => tipoDocumento.IdTipoDocumento !== tipoDocumentoRemove?.registro?.IdTipoDocumento)
        );
        toast.current?.show({
          severity: "success",
          detail: `${tipoDocumentoRemove.message.msgTxt}`,
          life: 3000,
        });
      } else if (tipoDocumentoRemove?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${tipoDocumentoRemove.message.msgTxt}`,
          life: 3000,
        });
      }

      setRemoveTipoDocumentoDialog(false);
      setTipoDocumento(emptyTipoDocumento);
    }
  };

  const removeSelectedTipoDocumentos = () => {
    let _tipoDocumentos = tipoDocumentos.filter(
      (val: TipoDocumentoEntity) => !selectedTipoDocumentos?.includes(val)
    );

    setTipoDocumentos(_tipoDocumentos);
    setRemoveTipoDocumentosDialog(false);
    setSelectedTipoDocumentos([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "TipoDocumentos Removed",
      life: 3000,
    });
  };

  // templates to dialogs
  const hideDialog = () => {
    setSubmitted(false);
    setTipoDocumentoDialog({ state: false });
  };

  const showCreateTipoDocumentoDialog = () => {
    setTipoDocumento(emptyTipoDocumento);
    setSubmitted(false);
    setTipoDocumentoDialog({ type: "create", state: true });
  };

  const showUpdateTipoDocumentoDialog = (tipoDocumento: TipoDocumentoEntity) => {
    setTipoDocumento({ ...tipoDocumento });
    setTipoDocumentoDialog({ type: "update", state: true });
  };

  const hideRemoveTipoDocumentoDialog = () => {
    setRemoveTipoDocumentoDialog(false);
  };

  const hideRemoveTipoDocumentosDialog = () => {
    setRemoveTipoDocumentosDialog(false);
  };

  const confirmRemoveTipoDocumento = (tipoDocumento: TipoDocumentoEntity) => {
    setTipoDocumento(tipoDocumento);
    setRemoveTipoDocumentoDialog(true);
  };

  const confirmRemoveSelectedTipoDocumentos = () => {
    setRemoveTipoDocumentosDialog(true);
  };

  // here
  const findIndexById = (id: string) => {
    let index = -1;

    for (let i = 0; i < tipoDocumentos.length; i++) {
      if (tipoDocumentos[i].IdTipoDocumento.toString() === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = (): string => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };
  //here

  const onActivoChange = (e: RadioButtonChangeEvent) => {
    let _tipoDocumento = { ...tipoDocumento };

    _tipoDocumento["Activo"] = e.value;
    setTipoDocumento(_tipoDocumento);
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";
    let _tipoDocumento = { ...tipoDocumento };

    // @ts-ignore
    _tipoDocumento[name] = val;

    setTipoDocumento(_tipoDocumento);
  };

  // const onInputTextTipoDocumentoChange = (
  //   e: React.ChangeEvent<HTMLTextTipoDocumentoElement>,
  //   name: string
  // ) => {
  //   const val = (e.target && e.target.value) || "";
  //   let _tipoDocumento = { ...tipoDocumento };

  //   // @ts-ignore
  //   _tipoDocumento[name] = val;

  //   setTipoDocumento(_tipoDocumento);
  // };

  // const onInputNumberChange = (
  //   e: InputNumberValueChangeEvent,
  //   name: string
  // ) => {
  //   const val = e.value ?? 0;
  //   let _tipoDocumento = { ...tipoDocumento };

  //   // @ts-ignore
  //   _tipoDocumento[name] = val;

  //   setTipoDocumento(_tipoDocumento);
  // };

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
    <div className="flex flex-wrap justify-content-between m-0 p-0">
      <div className="flex justify-content-between gap-2 align-items-center">
        {/* <p className="m-0">Mantemiento de Áreas</p> */}
        <Button
          type="button"
          icon="pi pi-plus"
          severity="success"
          onClick={showCreateTipoDocumentoDialog}
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
          onClick={findAllTipoDocumento}
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

      <div className="flex justify-content-between gap-2 ">
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
  );

  // templates to column Activo
  const activoBodyTemplate = (rowData: TipoDocumentoEntity) => {
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pl-5 pi-check-circle": rowData.Activo,
          "text-red-500 pl-5 pi-times-circle": !rowData.Activo,
        })}
      ></i>
    );
  };

  const activoFilterTemplate = (
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

  // templates to column ModificadoEl
  const modifiadoElBodyTemplate = (rowData: TipoDocumentoEntity) => {
    return (
      <p className="text-sm m-0">
        {!rowData.ModificadoEl
          ? "00/00/0000, 00:00 TM"
          : formatDate(new Date(rowData.ModificadoEl))}
      </p>
    );
  };

  const modifiadoElFilterTemplate = (
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

  // templates to column CreadoEl
  const creadoElBodyTemplate = (rowData: TipoDocumentoEntity) => {
    return (
      <p className="text-sm m-0">
        {!rowData.CreadoEl ? "__" : formatDate(new Date(rowData.CreadoEl))}
      </p>
    );
  };

  const creadoElFilterTemplate = (
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
  const actionsBodyTemplate = (rowData: TipoDocumentoEntity) => {
    return (
      <div style={{ display: "flex", flexWrap: "nowrap" }}>
        <Button
          icon="pi pi-pencil"
          className="mr-2"
          style={{
            width: "2rem",
            height: "1rem",
            color: "#fff",
          }}
          onClick={() => showUpdateTipoDocumentoDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          style={{
            width: "2rem",
            height: "1rem",
            color: "#fff",
          }}
          onClick={() => confirmRemoveTipoDocumento(rowData)}
        />
      </div>
    );
  };

  //useEffects
  useEffect(() => {
    findAllTipoDocumento();
  }, []);

  return (
    <div className="card">
      <Toast ref={toast} position={"bottom-right"} />

      <Toolbar
        style={{
          margin: "0",
          padding: ".5em",
        }}
        start={startContent}
        // center={centerContent}
        // end={endContent}
      />

      <DataTable
        value={tipoDocumentos}
        sortMode="multiple"
        removableSort
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "50rem" }}
        scrollable
        scrollHeight="60vh"
        header={headerDataTable}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando {first} de {last} del total {totalRecords} registros"
        filters={filters}
        globalFilterFields={[
          "IdTipoDocumento",
          "Descripcion",
          "Activo",
          "CreadoEl",
          "CreadoPor",
          "ModificadoEl",
          "ModificadoPor",
        ]}
        emptyMessage={<EmptyMessageData loading={loading} />}
        selectionMode="multiple"
        selection={selectedTipoDocumentos}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedTipoDocumentos(e.value);
          }
        }}
        dataKey="IdTipoDocumento"
        selectionPageOnly
        // loading={loading}
      >
        <Column
          selectionMode="multiple"
          exportable={false}
          headerStyle={{ width: "0%" }}
        />
        {visibleColumns.map((col) => {
          if (col.field == "Activo") {
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
                body={activoBodyTemplate}
                filterElement={activoFilterTemplate}
              />
            );
          } else if (col.field == "CreadoEl") {
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
                body={creadoElBodyTemplate}
                filterElement={creadoElFilterTemplate}
              />
            );
          } else if (col.field == "ModificadoEl") {
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
                body={modifiadoElBodyTemplate}
                filterElement={modifiadoElFilterTemplate}
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

      <TipoDocumentoCreateOrUpdate
        submitted={submitted}
        tipoDocumento={tipoDocumento}
        tipoDocumentoDialog={tipoDocumentoDialog}
        hideDialog={hideDialog}
        createTipoDocumento={createTipoDocumento}
        updateTipoDocumento={updateTipoDocumento}
        onInputChange={onInputChange}
        onActivoChange={onActivoChange}
        loadingTipoDocumentoCreateOrUpdate={loadingTipoDocumentoCreateOrUpdate}
      />

      <TipoDocumentoRemove
        tipoDocumento={tipoDocumento}
        removeTipoDocumentoDialog={removeTipoDocumentoDialog}
        hideRemoveTipoDocumentoDialog={hideRemoveTipoDocumentoDialog}
        removeTipoDocumento={removeTipoDocumento}
      />

      <TipoDocumentosRemove
        tipoDocumento={tipoDocumento}
        removeTipoDocumentosDialog={removeTipoDocumentosDialog}
        hideRemoveTipoDocumentosDialog={hideRemoveTipoDocumentosDialog}
        removeSelectedTipoDocumentos={removeSelectedTipoDocumentos}
      />
    </div>
  );
};

export default TipoDocumento;
