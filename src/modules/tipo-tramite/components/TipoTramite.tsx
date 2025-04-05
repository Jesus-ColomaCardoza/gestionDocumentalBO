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
import UseTipoTramite from "../hooks/UseTipoTramite";
import { ColumnMeta } from "../../utils/Interfaces";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import {
  TipoTramiteCreate,
  TipoTramiteEntity,
  TipoTramiteOut,
  TipoTramitesOut,
} from "../interfaces/TipoTramiteInterface";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { columns, defaultFilters, emptyTipoTramite } from "../utils/Constants";
import TipoTramiteCreateOrUpdate from "./TipoTramiteCreateOrUpdate";
import TipoTramiteRemove from "./TipoTramiteRemove";
import TipoTramitesRemove from "./TipoTramitesRemove";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { formatDate } from "../../utils/Methods";
import { Calendar } from "primereact/calendar";
import EmptyMessageData from "../../utils/shared/EmptyMessageData";

const TipoTramite = () => {
  // custom hooks
  const { create, findAll, findOne, update, remove } = UseTipoTramite();

  //useRefs
  const toast = useRef<Toast>(null);

  const dt = useRef<DataTable<TipoTramiteEntity[]>>(null);

  //useStates
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(
    columns.filter((col: ColumnMeta) => col.show)
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingTipoTramiteCreateOrUpdate, setLoadingTipoTramiteCreateOrUpdate] =
    useState<boolean>(false);

  const [tipoTramite, setTipoTramite] = useState<TipoTramiteEntity>(emptyTipoTramite);

  const [tipoTramites, setTipoTramites] = useState<TipoTramiteEntity[]>([]);

  const [selectedTipoTramites, setSelectedTipoTramites] = useState<TipoTramiteEntity[]>([]);

  const [tipoTramiteDialog, setTipoTramiteDialog] = useState<{
    type?: "create" | "update" | undefined;
    state: boolean;
  }>({
    state: false,
  });

  const [removeTipoTramiteDialog, setRemoveTipoTramiteDialog] = useState<boolean>(false);

  const [removeTipoTramitesDialog, setRemoveTipoTramitesDialog] = useState<boolean>(false);

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
      <h3 className="m-0">Mantenimiento de Tipo Trámite</h3>
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
      <SplitButton label="Save" model={items} icon="pi pi-check"></SplitButton>
    </>
  );

  // actions CRUD (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllTipoTramite = async () => {
    setLoading(true);
    const tipoTramitesFindAll = await findAll();
    setLoading(false);

    if (tipoTramitesFindAll?.message.msgId == 0 && tipoTramitesFindAll.registro) {
      setTipoTramites(
        Array.isArray(tipoTramitesFindAll.registro)
          ? tipoTramitesFindAll.registro?.map((af) => {
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
      //     detail: `${tipoTramitesFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
      // } else if (tipoTramitesFindAll?.message.msgId == 1) {
      //   toast.current?.show({
      //     severity: "error",
      //     detail: `${tipoTramitesFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  const createTipoTramite = async () => {
    setSubmitted(true);
    if (tipoTramite.Descripcion.trim()) {
      setLoadingTipoTramiteCreateOrUpdate(true);
      let tipoTramiteCreate = await create({
        Descripcion: tipoTramite.Descripcion,
        Activo: tipoTramite.Activo,
      });
      setLoadingTipoTramiteCreateOrUpdate(false);

      if (tipoTramiteCreate?.message.msgId == 0 && tipoTramiteCreate.registro) {
        setTipoTramites([...tipoTramites, tipoTramiteCreate.registro]);
        toast.current?.show({
          severity: "success",
          detail: `${tipoTramiteCreate.message.msgTxt}`,
          life: 3000,
        });
      } else if (tipoTramiteCreate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${tipoTramiteCreate.message.msgTxt}`,
          life: 3000,
        });
      }

      setTipoTramiteDialog({ state: false });
      setTipoTramite(emptyTipoTramite);
    }
  };

  const updateTipoTramite = async () => {
    setSubmitted(true);
    if (tipoTramite.IdTipoTramite) {
      setLoadingTipoTramiteCreateOrUpdate(true);
      let tipoTramiteUpdate = await update(tipoTramite.IdTipoTramite.toString(), {
        Descripcion: tipoTramite.Descripcion,
        Activo: tipoTramite.Activo,
      });
      setLoadingTipoTramiteCreateOrUpdate(false);

      if (tipoTramiteUpdate?.message.msgId == 0 && tipoTramiteUpdate.registro) {
        setTipoTramites(
          tipoTramites?.map((tipoTramite) =>
            tipoTramite.IdTipoTramite === tipoTramiteUpdate?.registro?.IdTipoTramite
              ? { ...tipoTramite, ...tipoTramiteUpdate.registro }
              : tipoTramite
          )
        );
        toast.current?.show({
          severity: "success",
          detail: `${tipoTramiteUpdate.message.msgTxt}`,
          life: 3000,
        });
      } else if (tipoTramiteUpdate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${tipoTramiteUpdate.message.msgTxt}`,
          life: 3000,
        });
      }

      setTipoTramiteDialog({ state: false });
      setTipoTramite(emptyTipoTramite);
    }
  };

  const removeTipoTramite = async () => {
    if (tipoTramite.IdTipoTramite) {
      let tipoTramiteRemove = await remove(tipoTramite.IdTipoTramite.toString());

      if (tipoTramiteRemove?.message.msgId == 0 && tipoTramiteRemove.registro) {
        setTipoTramites(
          tipoTramites?.filter((tipoTramite) => tipoTramite.IdTipoTramite !== tipoTramiteRemove?.registro?.IdTipoTramite)
        );
        toast.current?.show({
          severity: "success",
          detail: `${tipoTramiteRemove.message.msgTxt}`,
          life: 3000,
        });
      } else if (tipoTramiteRemove?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${tipoTramiteRemove.message.msgTxt}`,
          life: 3000,
        });
      }

      setRemoveTipoTramiteDialog(false);
      setTipoTramite(emptyTipoTramite);
    }
  };

  const removeSelectedTipoTramites = () => {
    let _tipoTramites = tipoTramites.filter(
      (val: TipoTramiteEntity) => !selectedTipoTramites?.includes(val)
    );

    setTipoTramites(_tipoTramites);
    setRemoveTipoTramitesDialog(false);
    setSelectedTipoTramites([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "TipoTramites Removed",
      life: 3000,
    });
  };

  // templates to dialogs
  const hideDialog = () => {
    setSubmitted(false);
    setTipoTramiteDialog({ state: false });
  };

  const showCreateTipoTramiteDialog = () => {
    setTipoTramite(emptyTipoTramite);
    setSubmitted(false);
    setTipoTramiteDialog({ type: "create", state: true });
  };

  const showUpdateTipoTramiteDialog = (tipoTramite: TipoTramiteEntity) => {
    setTipoTramite({ ...tipoTramite });
    setTipoTramiteDialog({ type: "update", state: true });
  };

  const hideRemoveTipoTramiteDialog = () => {
    setRemoveTipoTramiteDialog(false);
  };

  const hideRemoveTipoTramitesDialog = () => {
    setRemoveTipoTramitesDialog(false);
  };

  const confirmRemoveTipoTramite = (tipoTramite: TipoTramiteEntity) => {
    setTipoTramite(tipoTramite);
    setRemoveTipoTramiteDialog(true);
  };

  const confirmRemoveSelectedTipoTramites = () => {
    setRemoveTipoTramitesDialog(true);
  };

  // here
  const findIndexById = (id: string) => {
    let index = -1;

    for (let i = 0; i < tipoTramites.length; i++) {
      if (tipoTramites[i].IdTipoTramite.toString() === id) {
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
    let _tipoTramite = { ...tipoTramite };

    _tipoTramite["Activo"] = e.value;
    setTipoTramite(_tipoTramite);
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";
    let _tipoTramite = { ...tipoTramite };

    // @ts-ignore
    _tipoTramite[name] = val;

    setTipoTramite(_tipoTramite);
  };

  // const onInputTextTipoTramiteChange = (
  //   e: React.ChangeEvent<HTMLTextTipoTramiteElement>,
  //   name: string
  // ) => {
  //   const val = (e.target && e.target.value) || "";
  //   let _tipoTramite = { ...tipoTramite };

  //   // @ts-ignore
  //   _tipoTramite[name] = val;

  //   setTipoTramite(_tipoTramite);
  // };

  // const onInputNumberChange = (
  //   e: InputNumberValueChangeEvent,
  //   name: string
  // ) => {
  //   const val = e.value ?? 0;
  //   let _tipoTramite = { ...tipoTramite };

  //   // @ts-ignore
  //   _tipoTramite[name] = val;

  //   setTipoTramite(_tipoTramite);
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
          onClick={showCreateTipoTramiteDialog}
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
          onClick={findAllTipoTramite}
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
  const activoBodyTemplate = (rowData: TipoTramiteEntity) => {
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
  const modifiadoElBodyTemplate = (rowData: TipoTramiteEntity) => {
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
  const creadoElBodyTemplate = (rowData: TipoTramiteEntity) => {
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
  const actionsBodyTemplate = (rowData: TipoTramiteEntity) => {
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
          onClick={() => showUpdateTipoTramiteDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          style={{
            width: "2rem",
            height: "1rem",
            color: "#fff",
          }}
          onClick={() => confirmRemoveTipoTramite(rowData)}
        />
      </div>
    );
  };

  //useEffects
  useEffect(() => {
    findAllTipoTramite();
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
        value={tipoTramites}
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
          "IdTipoTramite",
          "Descripcion",
          "Activo",
          "CreadoEl",
          "CreadoPor",
          "ModificadoEl",
          "ModificadoPor",
        ]}
        emptyMessage={<EmptyMessageData loading={loading} />}
        selectionMode="multiple"
        selection={selectedTipoTramites}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedTipoTramites(e.value);
          }
        }}
        dataKey="IdTipoTramite"
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

      <TipoTramiteCreateOrUpdate
        submitted={submitted}
        tipoTramite={tipoTramite}
        tipoTramiteDialog={tipoTramiteDialog}
        hideDialog={hideDialog}
        createTipoTramite={createTipoTramite}
        updateTipoTramite={updateTipoTramite}
        onInputChange={onInputChange}
        onActivoChange={onActivoChange}
        loadingTipoTramiteCreateOrUpdate={loadingTipoTramiteCreateOrUpdate}
      />

      <TipoTramiteRemove
        tipoTramite={tipoTramite}
        removeTipoTramiteDialog={removeTipoTramiteDialog}
        hideRemoveTipoTramiteDialog={hideRemoveTipoTramiteDialog}
        removeTipoTramite={removeTipoTramite}
      />

      <TipoTramitesRemove
        tipoTramite={tipoTramite}
        removeTipoTramitesDialog={removeTipoTramitesDialog}
        hideRemoveTipoTramitesDialog={hideRemoveTipoTramitesDialog}
        removeSelectedTipoTramites={removeSelectedTipoTramites}
      />
    </div>
  );
};

export default TipoTramite;
