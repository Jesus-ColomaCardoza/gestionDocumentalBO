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
import { ColumnMeta } from "../../utils/Interfaces";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";

import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { columns, defaultFilters, emptyTipoIdentificacion } from "../utils/Constants";

import TipoIdentificacionRemove from "./TipoIdentificacionRemove";
import TipoIdentificacionesRemove from "./TipoIdentificacionesRemove";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { formatDate } from "../../utils/Methods";
import { Calendar } from "primereact/calendar";
import EmptyMessageData from "../../utils/shared/EmptyMessageData";
import UseTipoIdentificacion from "../hooks/UseTipoIdentificacion";
import TipoIdentificacionCreateOrUpdate from "./TipoIdentificacionCreateOrUpdate";
import { TipoIdentificacionEntity } from "../interfaces/TipoIdentificacionInterface";

const TipoIdentificacion = () => {
  // custom hooks
  const { create, findAll, findOne, update, remove } = UseTipoIdentificacion();

  //useRefs
  const toast = useRef<Toast>(null);

  const dt = useRef<DataTable<TipoIdentificacionEntity[]>>(null);

  //useStates
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(
    columns.filter((col: ColumnMeta) => col.show)
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingTipoIdentificacionCreateOrUpdate, setLoadingTipoIdentificacionCreateOrUpdate] =
    useState<boolean>(false);

  const [tipoIdentificacion, setTipoIdentificacion] = useState<TipoIdentificacionEntity>(emptyTipoIdentificacion);

  const [tipoIdentificaciones, setTipoIdentificaciones] = useState<TipoIdentificacionEntity[]>([]);

  const [selectedTipoIdentificaciones, setSelectedTipoIdentificaciones] = useState<TipoIdentificacionEntity[]>([]);

  const [tipoIdentificacionDialog, setTipoIdentificacionDialog] = useState<{
    type?: "create" | "update" | undefined;
    state: boolean;
  }>({
    state: false,
  });

  const [removeTipoIdentificacionDialog, setRemoveTipoIdentificacionDialog] = useState<boolean>(false);

  const [removeTipoIdentificacionesDialog, setRemoveTipoIdentificacionesDialog] = useState<boolean>(false);

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
      <h3 className="m-0">Mantenimiento de Tipo Identificaciones</h3>
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
  const findAllTipoIdentificacion = async () => {
    setLoading(true);
    const tipoIdentificacionesFindAll = await findAll();
    setLoading(false);

    if (tipoIdentificacionesFindAll?.message.msgId == 0 && tipoIdentificacionesFindAll.registro) {
      setTipoIdentificaciones(
        Array.isArray(tipoIdentificacionesFindAll.registro)
          ? tipoIdentificacionesFindAll.registro?.map((af) => {
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
      //     detail: `${tipoIdentificacionesFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
      // } else if (tipoIdentificacionesFindAll?.message.msgId == 1) {
      //   toast.current?.show({
      //     severity: "error",
      //     detail: `${tipoIdentificacionesFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  const createTipoIdentificacion = async () => {
    setSubmitted(true);
    if (tipoIdentificacion.Descripcion.trim()) {
      setLoadingTipoIdentificacionCreateOrUpdate(true);
      let tipoIdentificacionCreate = await create({
        Descripcion: tipoIdentificacion.Descripcion,
        Activo: tipoIdentificacion.Activo,
      });
      setLoadingTipoIdentificacionCreateOrUpdate(false);

      if (tipoIdentificacionCreate?.message.msgId == 0 && tipoIdentificacionCreate.registro) {
        setTipoIdentificaciones([...tipoIdentificaciones, tipoIdentificacionCreate.registro]);
        toast.current?.show({
          severity: "success",
          detail: `${tipoIdentificacionCreate.message.msgTxt}`,
          life: 3000,
        });
      } else if (tipoIdentificacionCreate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${tipoIdentificacionCreate.message.msgTxt}`,
          life: 3000,
        });
      }

      setTipoIdentificacionDialog({ state: false });
      setTipoIdentificacion(emptyTipoIdentificacion);
    }
  };

  const updateTipoIdentificacion = async () => {
    setSubmitted(true);
    if (tipoIdentificacion.IdTipoIdentificacion) {
      setLoadingTipoIdentificacionCreateOrUpdate(true);
      let tipoIdentificacionUpdate = await update(tipoIdentificacion.IdTipoIdentificacion.toString(), {
        Descripcion: tipoIdentificacion.Descripcion,
        Activo: tipoIdentificacion.Activo,
      });
      setLoadingTipoIdentificacionCreateOrUpdate(false);

      if (tipoIdentificacionUpdate?.message.msgId == 0 && tipoIdentificacionUpdate.registro) {
        setTipoIdentificaciones(
          tipoIdentificaciones?.map((tipoIdentificacion) =>
            tipoIdentificacion.IdTipoIdentificacion === tipoIdentificacionUpdate?.registro?.IdTipoIdentificacion
              ? { ...tipoIdentificacion, ...tipoIdentificacionUpdate.registro }
              : tipoIdentificacion
          )
        );
        toast.current?.show({
          severity: "success",
          detail: `${tipoIdentificacionUpdate.message.msgTxt}`,
          life: 3000,
        });
      } else if (tipoIdentificacionUpdate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${tipoIdentificacionUpdate.message.msgTxt}`,
          life: 3000,
        });
      }

      setTipoIdentificacionDialog({ state: false });
      setTipoIdentificacion(emptyTipoIdentificacion);
    }
  };

  const removeTipoIdentificacion = async () => {
    if (tipoIdentificacion.IdTipoIdentificacion) {
      let tipoIdentificacionRemove = await remove(tipoIdentificacion.IdTipoIdentificacion.toString());

      if (tipoIdentificacionRemove?.message.msgId == 0 && tipoIdentificacionRemove.registro) {
        setTipoIdentificaciones(
          tipoIdentificaciones?.filter((tipoIdentificacion) => tipoIdentificacion.IdTipoIdentificacion !== tipoIdentificacionRemove?.registro?.IdTipoIdentificacion)
        );
        toast.current?.show({
          severity: "success",
          detail: `${tipoIdentificacionRemove.message.msgTxt}`,
          life: 3000,
        });
      } else if (tipoIdentificacionRemove?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${tipoIdentificacionRemove.message.msgTxt}`,
          life: 3000,
        });
      }

      setRemoveTipoIdentificacionDialog(false);
      setTipoIdentificacion(emptyTipoIdentificacion);
    }
  };

  const removeSelectedTipoIdentificaciones = () => {
    let _tipoIdentificaciones = tipoIdentificaciones.filter(
      (val: TipoIdentificacionEntity) => !selectedTipoIdentificaciones?.includes(val)
    );

    setTipoIdentificaciones(_tipoIdentificaciones);
    setRemoveTipoIdentificacionesDialog(false);
    setSelectedTipoIdentificaciones([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "TipoIdentificaciones Removed",
      life: 3000,
    });
  };

  // templates to dialogs
  const hideDialog = () => {
    setSubmitted(false);
    setTipoIdentificacionDialog({ state: false });
  };

  const showCreateTipoIdentificacionDialog = () => {
    setTipoIdentificacion(emptyTipoIdentificacion);
    setSubmitted(false);
    setTipoIdentificacionDialog({ type: "create", state: true });
  };

  const showUpdateTipoIdentificacionDialog = (tipoIdentificacion: TipoIdentificacionEntity) => {
    setTipoIdentificacion({ ...tipoIdentificacion });
    setTipoIdentificacionDialog({ type: "update", state: true });
  };

  const hideRemoveTipoIdentificacionDialog = () => {
    setRemoveTipoIdentificacionDialog(false);
  };

  const hideRemoveTipoIdentificacionesDialog = () => {
    setRemoveTipoIdentificacionesDialog(false);
  };

  const confirmRemoveTipoIdentificacion = (tipoIdentificacion: TipoIdentificacionEntity) => {
    setTipoIdentificacion(tipoIdentificacion);
    setRemoveTipoIdentificacionDialog(true);
  };

  const confirmRemoveSelectedTipoIdentificaciones = () => {
    setRemoveTipoIdentificacionesDialog(true);
  };

  // here
  const findIndexById = (id: string) => {
    let index = -1;

    for (let i = 0; i < tipoIdentificaciones.length; i++) {
      if (tipoIdentificaciones[i].IdTipoIdentificacion.toString() === id) {
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
    let _tipoIdentificacion = { ...tipoIdentificacion };

    _tipoIdentificacion["Activo"] = e.value;
    setTipoIdentificacion(_tipoIdentificacion);
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";
    let _tipoIdentificacion = { ...tipoIdentificacion };

    // @ts-ignore
    _tipoIdentificacion[name] = val;

    setTipoIdentificacion(_tipoIdentificacion);
  };

  // const onInputTextTipoIdentificacionChange = (
  //   e: React.ChangeEvent<HTMLTextTipoIdentificacionElement>,
  //   name: string
  // ) => {
  //   const val = (e.target && e.target.value) || "";
  //   let _tipoIdentificacion = { ...tipoIdentificacion };

  //   // @ts-ignore
  //   _tipoIdentificacion[name] = val;

  //   setTipoIdentificacion(_tipoIdentificacion);
  // };

  // const onInputNumberChange = (
  //   e: InputNumberValueChangeEvent,
  //   name: string
  // ) => {
  //   const val = e.value ?? 0;
  //   let _tipoIdentificacion = { ...tipoIdentificacion };

  //   // @ts-ignore
  //   _tipoIdentificacion[name] = val;

  //   setTipoIdentificacion(_tipoIdentificacion);
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
          onClick={showCreateTipoIdentificacionDialog}
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
          onClick={findAllTipoIdentificacion}
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
  const activoBodyTemplate = (rowData: TipoIdentificacionEntity) => {
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
  const modifiadoElBodyTemplate = (rowData: TipoIdentificacionEntity) => {
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
  const creadoElBodyTemplate = (rowData: TipoIdentificacionEntity) => {
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
  const actionsBodyTemplate = (rowData: TipoIdentificacionEntity) => {
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
          onClick={() => showUpdateTipoIdentificacionDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          style={{
            width: "2rem",
            height: "1rem",
            color: "#fff",
          }}
          onClick={() => confirmRemoveTipoIdentificacion(rowData)}
        />
      </div>
    );
  };

  //useEffects
  useEffect(() => {
    findAllTipoIdentificacion();
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
        value={tipoIdentificaciones}
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
          "IdTipoIdentificacion",
          "Descripcion",
          "Activo",
          "CreadoEl",
          "CreadoPor",
          "ModificadoEl",
          "ModificadoPor",
        ]}
        emptyMessage={<EmptyMessageData loading={loading} />}
        selectionMode="multiple"
        selection={selectedTipoIdentificaciones}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedTipoIdentificaciones(e.value);
          }
        }}
        dataKey="IdTipoIdentificacion"
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

      <TipoIdentificacionCreateOrUpdate
        submitted={submitted}
        tipoIdentificacion={tipoIdentificacion}
        tipoIdentificacionDialog={tipoIdentificacionDialog}
        hideDialog={hideDialog}
        createTipoIdentificacion={createTipoIdentificacion}
        updateTipoIdentificacion={updateTipoIdentificacion}
        onInputChange={onInputChange}
        onActivoChange={onActivoChange}
        loadingTipoIdentificacionCreateOrUpdate={loadingTipoIdentificacionCreateOrUpdate}
      />

      <TipoIdentificacionRemove
        tipoIdentificacion={tipoIdentificacion}
        removeTipoIdentificacionDialog={removeTipoIdentificacionDialog}
        hideRemoveTipoIdentificacionDialog={hideRemoveTipoIdentificacionDialog}
        removeTipoIdentificacion={removeTipoIdentificacion}
      />

      <TipoIdentificacionesRemove
        tipoIdentificacion={tipoIdentificacion}
        removeTipoIdentificacionesDialog={removeTipoIdentificacionesDialog}
        hideRemoveTipoIdentificacionesDialog={hideRemoveTipoIdentificacionesDialog}
        removeSelectedTipoIdentificaciones={removeSelectedTipoIdentificaciones}
      />
    </div>
  );
};

export default TipoIdentificacion;
