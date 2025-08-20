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
import UseArchivador from "../hooks/UseArchivador";
import { ColumnMeta } from "../../utils/Interfaces";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import { ArchivadorEntity } from "../interfaces/ArchivadorInterface";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";

import ArchivadorCreateOrUpdate from "./ArchivadorCreateOrUpdate";
import ArchivadorRemove from "./ArchivadorRemove";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { formatDate } from "../../utils/Methods";
import { Calendar } from "primereact/calendar";
import EmptyMessageData from "../../utils/shared/EmptyMessageData";
import { columns, defaultFilters, emptyArchivador } from "../utils/Constants";
import ArchivadoresRemove from "./ArchivadoresRemove";
import { InputNumberChangeEvent } from "primereact/inputnumber";

const Archivador = () => {
  // custom hooks
  const { create, findAll, findOne, update, remove } = UseArchivador();

  //useRefs
  const toast = useRef<Toast>(null);

  const dt = useRef<DataTable<ArchivadorEntity[]>>(null);

  //useStates
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(
    columns.filter((col: ColumnMeta) => col.show)
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingArchivadorCreateOrUpdate, setLoadingArchivadorCreateOrUpdate] =
    useState<boolean>(false);

  const [archivador, setArchivador] =
    useState<ArchivadorEntity>(emptyArchivador);

  const [archivados, setArchivadores] = useState<ArchivadorEntity[]>([]);

  const [selectedArchivadores, setSelectedArchivadores] = useState<
    ArchivadorEntity[]
  >([]);

  const [archivadorDialog, setArchivadorDialog] = useState<{
    type?: "create" | "update" | undefined;
    state: boolean;
  }>({
    state: false,
  });

  const [removeArchivadorDialog, setRemoveArchivadorDialog] =
    useState<boolean>(false);

  const [removeArchivadoresDialog, setRemoveArchivadoresDialog] =
    useState<boolean>(false);

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
      <h3 className="m-0">Mantenimiento de Archivadores</h3>
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
      <SplitButton
        label="Aceptar"
        model={items}
        icon="pi pi-check"
      ></SplitButton>
    </>
  );

  // actions CRUD (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllArchivador = async () => {
    setLoading(true);
    const ArchivadoresFindAll = await findAll();
    setLoading(false);

    if (
      ArchivadoresFindAll?.message.msgId == 0 &&
      ArchivadoresFindAll.registro
    ) {
      setArchivadores(
        Array.isArray(ArchivadoresFindAll.registro)
          ? ArchivadoresFindAll.registro?.map((af) => {
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
      //     detail: `${ArchivadoresFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
      // } else if (ArchivadoresFindAll?.message.msgId == 1) {
      //   toast.current?.show({
      //     severity: "error",
      //     detail: `${ArchivadoresFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  const createArchivador = async () => {
    setSubmitted(true);
    if (archivador.Descripcion.trim()) {
      setLoadingArchivadorCreateOrUpdate(true);
      let archivadorCreate = await create({
        Ano: archivador.Ano,
        Descripcion: archivador.Descripcion,
        Nombre: archivador.Nombre,
        NroTramites: archivador.NroTramites,
        Activo: archivador.Activo,
      });
      setLoadingArchivadorCreateOrUpdate(false);

      if (archivadorCreate?.message.msgId == 0 && archivadorCreate.registro) {
        setArchivadores([...archivados, archivadorCreate.registro]);
        toast.current?.show({
          severity: "success",
          detail: `${archivadorCreate.message.msgTxt}`,
          life: 3000,
        });
      } else if (archivadorCreate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${archivadorCreate.message.msgTxt}`,
          life: 3000,
        });
      }

      setArchivadorDialog({ state: false });
      setArchivador(emptyArchivador);
    }
  };

  const updateArchivador = async () => {
    setSubmitted(true);
    if (archivador.IdArchivador) {
      setLoadingArchivadorCreateOrUpdate(true);
      let archivadorUpdate = await update(archivador.IdArchivador.toString(), {
        Ano: archivador.Ano,
        Descripcion: archivador.Descripcion,
        Nombre: archivador.Nombre,
        NroTramites: archivador.NroTramites,
        Activo: archivador.Activo,
      });
      setLoadingArchivadorCreateOrUpdate(false);

      if (archivadorUpdate?.message.msgId == 0 && archivadorUpdate.registro) {
        setArchivadores(
          archivados?.map((archivador) =>
            archivador.IdArchivador === archivadorUpdate?.registro?.IdArchivador
              ? { ...archivador, ...archivadorUpdate.registro }
              : archivador
          )
        );
        toast.current?.show({
          severity: "success",
          detail: `${archivadorUpdate.message.msgTxt}`,
          life: 3000,
        });
      } else if (archivadorUpdate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${archivadorUpdate.message.msgTxt}`,
          life: 3000,
        });
      }

      setArchivadorDialog({ state: false });
      setArchivador(emptyArchivador);
    }
  };

  const removeArchivador = async () => {
    if (archivador.IdArchivador) {
      let archivadorRemove = await remove(archivador.IdArchivador.toString());

      if (archivadorRemove?.message.msgId == 0 && archivadorRemove.registro) {
        setArchivadores(
          archivados?.filter(
            (archivador) =>
              archivador.IdArchivador !==
              archivadorRemove?.registro?.IdArchivador
          )
        );
        toast.current?.show({
          severity: "success",
          detail: `${archivadorRemove.message.msgTxt}`,
          life: 3000,
        });
      } else if (archivadorRemove?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${archivadorRemove.message.msgTxt}`,
          life: 3000,
        });
      }

      setRemoveArchivadorDialog(false);
      setArchivador(emptyArchivador);
    }
  };

  const removeSelectedArchivadores = () => {
    let _Archivadores = archivados.filter(
      (val: ArchivadorEntity) => !selectedArchivadores?.includes(val)
    );

    setArchivadores(_Archivadores);
    setRemoveArchivadoresDialog(false);
    setSelectedArchivadores([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Archivadores Removed",
      life: 3000,
    });
  };

  // templates to dialogs
  const hideDialog = () => {
    setSubmitted(false);
    setArchivadorDialog({ state: false });
  };

  const showCreateArchivadorDialog = () => {
    setArchivador(emptyArchivador);
    setSubmitted(false);
    setArchivadorDialog({ type: "create", state: true });
  };

  const showUpdateArchivadorDialog = (archivador: ArchivadorEntity) => {
    setArchivador({ ...archivador });
    setArchivadorDialog({ type: "update", state: true });
  };

  const hideRemoveArchivadorDialog = () => {
    setRemoveArchivadorDialog(false);
  };

  const hideRemoveArchivadoresDialog = () => {
    setRemoveArchivadoresDialog(false);
  };

  const confirmRemoveArchivador = (archivador: ArchivadorEntity) => {
    setArchivador(archivador);
    setRemoveArchivadorDialog(true);
  };

  const confirmRemoveSelectedArchivadores = () => {
    setRemoveArchivadoresDialog(true);
  };

  // here
  const findIndexById = (id: string) => {
    let index = -1;

    for (let i = 0; i < archivados.length; i++) {
      if (archivados[i].IdArchivador.toString() === id) {
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
    let _archivador = { ...archivador };

    _archivador["Activo"] = e.value;
    setArchivador(_archivador);
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";
    let _archivador = { ...archivador };

    // @ts-ignore
    _archivador[name] = val;

    setArchivador(_archivador);
  };

  const onInputNumberChange = (e: InputNumberChangeEvent, name: string) => {
    const val = e.value ?? null;

    setArchivador((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  // const onInputTextArchivadorChange = (
  //   e: React.ChangeEvent<HTMLTextArchivadorElement>,
  //   name: string
  // ) => {
  //   const val = (e.target && e.target.value) || "";
  //   let _archivador = { ...archivador };

  //   // @ts-ignore
  //   _archivador[name] = val;

  //   setArchivador(_archivador);
  // };

  // const onInputNumberChange = (
  //   e: InputNumberValueChangeEvent,
  //   name: string
  // ) => {
  //   const val = e.value ?? 0;
  //   let _archivador = { ...archivador };

  //   // @ts-ignore
  //   _archivador[name] = val;

  //   setArchivador(_archivador);
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
          onClick={showCreateArchivadorDialog}
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
          onClick={findAllArchivador}
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
  const activoBodyTemplate = (rowData: ArchivadorEntity) => {
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
  const modifiadoElBodyTemplate = (rowData: ArchivadorEntity) => {
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
  const creadoElBodyTemplate = (rowData: ArchivadorEntity) => {
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
  const actionsBodyTemplate = (rowData: ArchivadorEntity) => {
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
          onClick={() => showUpdateArchivadorDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          style={{
            width: "2rem",
            height: "1rem",
            color: "#fff",
          }}
          onClick={() => confirmRemoveArchivador(rowData)}
        />
      </div>
    );
  };

  //useEffects
  useEffect(() => {
    findAllArchivador();
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
        value={archivados}
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
          "IdArchivador",
          "Ano",
          "Descripcion",
          "Nombre",
          "NroTramites",
          "Activo",
          "CreadoEl",
          "CreadoPor",
          "ModificadoEl",
          "ModificadoPor",
        ]}
        emptyMessage={<EmptyMessageData loading={loading} />}
        selectionMode="multiple"
        selection={selectedArchivadores}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedArchivadores(e.value);
          }
        }}
        dataKey="IdArchivador"
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

      <ArchivadorCreateOrUpdate
        submitted={submitted}
        archivador={archivador}
        archivadorDialog={archivadorDialog}
        hideDialog={hideDialog}
        createArchivador={createArchivador}
        updateArchivador={updateArchivador}
        onInputChange={onInputChange}
        onInputNumberChange={onInputNumberChange}
        onActivoChange={onActivoChange}
        loadingArchivadorCreateOrUpdate={loadingArchivadorCreateOrUpdate}
      />

      <ArchivadorRemove
        archivado={archivador}
        removeArchivadorDialog={removeArchivadorDialog}
        hideRemoveArchivadorDialog={hideRemoveArchivadorDialog}
        removeArchivador={removeArchivador}
      />

      <ArchivadoresRemove
        archivador={archivador}
        removeArchivadoresDialog={removeArchivadoresDialog}
        hideRemoveArchivadoresDialog={hideRemoveArchivadoresDialog}
        removeSelectedArchivadores={removeSelectedArchivadores}
      />
    </div>
  );
};

export default Archivador;
