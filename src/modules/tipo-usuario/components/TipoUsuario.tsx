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
import UseTipoUsuario from "../hooks/UseTipoUsuario";
import { ColumnMeta } from "../../utils/Interfaces";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import {
  TipoUsuarioCreate,
  TipoUsuarioEntity,
  TipoUsuarioOut,
  TipoUsuariosOut,
} from "../interfaces/TipoUsuarioInterface";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { columns, defaultFilters, emptyTipoUsuario } from "../utils/Constants";
import TipoUsuarioCreateOrUpdate from "./TipoUsuarioCreateOrUpdate";
import TipoUsuarioRemove from "./TipoUsuarioRemove";
import TipoUsuariosRemove from "./TipoUsuariosRemove";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { formatDate } from "../../utils/Methods";
import { Calendar } from "primereact/calendar";
import EmptyMessageData from "../../utils/shared/EmptyMessageData";

const TipoUsuario = () => {
  // custom hooks
  const { create, findAll, findOne, update, remove } = UseTipoUsuario();

  //useRefs
  const toast = useRef<Toast>(null);

  const dt = useRef<DataTable<TipoUsuarioEntity[]>>(null);

  //useStates
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(
    columns.filter((col: ColumnMeta) => col.show)
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingTipoUsuarioCreateOrUpdate, setLoadingTipoUsuarioCreateOrUpdate] =
    useState<boolean>(false);

  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuarioEntity>(emptyTipoUsuario);

  const [tipoUsuarios, setTipoUsuarios] = useState<TipoUsuarioEntity[]>([]);

  const [selectedTipoUsuarios, setSelectedTipoUsuarios] = useState<TipoUsuarioEntity[]>([]);

  const [tipoUsuarioDialog, setTipoUsuarioDialog] = useState<{
    type?: "create" | "update" | undefined;
    state: boolean;
  }>({
    state: false,
  });

  const [removeTipoUsuarioDialog, setRemoveTipoUsuarioDialog] = useState<boolean>(false);

  const [removeTipoUsuariosDialog, setRemoveTipoUsuariosDialog] = useState<boolean>(false);

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
      <h3 className="m-0">Mantenimiento de Tipo Usuario</h3>
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
  const findAllTipoUsuario = async () => {
    setLoading(true);
    const tipoUsuariosFindAll = await findAll();
    setLoading(false);

    if (tipoUsuariosFindAll?.message.msgId == 0 && tipoUsuariosFindAll.registro) {
      setTipoUsuarios(
        Array.isArray(tipoUsuariosFindAll.registro)
          ? tipoUsuariosFindAll.registro?.map((af) => {
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
      //     detail: `${tipoUsuariosFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
      // } else if (tipoUsuariosFindAll?.message.msgId == 1) {
      //   toast.current?.show({
      //     severity: "error",
      //     detail: `${tipoUsuariosFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  const createTipoUsuario = async () => {
    setSubmitted(true);
    if (tipoUsuario.Descripcion.trim()) {
      setLoadingTipoUsuarioCreateOrUpdate(true);
      let tipoUsuarioCreate = await create({
        Descripcion: tipoUsuario.Descripcion,
        Activo: tipoUsuario.Activo,
      });
      setLoadingTipoUsuarioCreateOrUpdate(false);

      if (tipoUsuarioCreate?.message.msgId == 0 && tipoUsuarioCreate.registro) {
        setTipoUsuarios([...tipoUsuarios, tipoUsuarioCreate.registro]);
        toast.current?.show({
          severity: "success",
          detail: `${tipoUsuarioCreate.message.msgTxt}`,
          life: 3000,
        });
      } else if (tipoUsuarioCreate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${tipoUsuarioCreate.message.msgTxt}`,
          life: 3000,
        });
      }

      setTipoUsuarioDialog({ state: false });
      setTipoUsuario(emptyTipoUsuario);
    }
  };

  const updateTipoUsuario = async () => {
    setSubmitted(true);
    if (tipoUsuario.IdTipoUsuario) {
      setLoadingTipoUsuarioCreateOrUpdate(true);
      let tipoUsuarioUpdate = await update(tipoUsuario.IdTipoUsuario.toString(), {
        Descripcion: tipoUsuario.Descripcion,
        Activo: tipoUsuario.Activo,
      });
      setLoadingTipoUsuarioCreateOrUpdate(false);

      if (tipoUsuarioUpdate?.message.msgId == 0 && tipoUsuarioUpdate.registro) {
        setTipoUsuarios(
          tipoUsuarios?.map((tipoUsuario) =>
            tipoUsuario.IdTipoUsuario === tipoUsuarioUpdate?.registro?.IdTipoUsuario
              ? { ...tipoUsuario, ...tipoUsuarioUpdate.registro }
              : tipoUsuario
          )
        );
        toast.current?.show({
          severity: "success",
          detail: `${tipoUsuarioUpdate.message.msgTxt}`,
          life: 3000,
        });
      } else if (tipoUsuarioUpdate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${tipoUsuarioUpdate.message.msgTxt}`,
          life: 3000,
        });
      }

      setTipoUsuarioDialog({ state: false });
      setTipoUsuario(emptyTipoUsuario);
    }
  };

  const removeTipoUsuario = async () => {
    if (tipoUsuario.IdTipoUsuario) {
      let tipoUsuarioRemove = await remove(tipoUsuario.IdTipoUsuario.toString());

      if (tipoUsuarioRemove?.message.msgId == 0 && tipoUsuarioRemove.registro) {
        setTipoUsuarios(
          tipoUsuarios?.filter((tipoUsuario) => tipoUsuario.IdTipoUsuario !== tipoUsuarioRemove?.registro?.IdTipoUsuario)
        );
        toast.current?.show({
          severity: "success",
          detail: `${tipoUsuarioRemove.message.msgTxt}`,
          life: 3000,
        });
      } else if (tipoUsuarioRemove?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${tipoUsuarioRemove.message.msgTxt}`,
          life: 3000,
        });
      }

      setRemoveTipoUsuarioDialog(false);
      setTipoUsuario(emptyTipoUsuario);
    }
  };

  const removeSelectedTipoUsuarios = () => {
    let _tipoUsuarios = tipoUsuarios.filter(
      (val: TipoUsuarioEntity) => !selectedTipoUsuarios?.includes(val)
    );

    setTipoUsuarios(_tipoUsuarios);
    setRemoveTipoUsuariosDialog(false);
    setSelectedTipoUsuarios([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "TipoUsuarios Removed",
      life: 3000,
    });
  };

  // templates to dialogs
  const hideDialog = () => {
    setSubmitted(false);
    setTipoUsuarioDialog({ state: false });
  };

  const showCreateTipoUsuarioDialog = () => {
    setTipoUsuario(emptyTipoUsuario);
    setSubmitted(false);
    setTipoUsuarioDialog({ type: "create", state: true });
  };

  const showUpdateTipoUsuarioDialog = (tipoUsuario: TipoUsuarioEntity) => {
    setTipoUsuario({ ...tipoUsuario });
    setTipoUsuarioDialog({ type: "update", state: true });
  };

  const hideRemoveTipoUsuarioDialog = () => {
    setRemoveTipoUsuarioDialog(false);
  };

  const hideRemoveTipoUsuariosDialog = () => {
    setRemoveTipoUsuariosDialog(false);
  };

  const confirmRemoveTipoUsuario = (tipoUsuario: TipoUsuarioEntity) => {
    setTipoUsuario(tipoUsuario);
    setRemoveTipoUsuarioDialog(true);
  };

  const confirmRemoveSelectedTipoUsuarios = () => {
    setRemoveTipoUsuariosDialog(true);
  };

  // here
  const findIndexById = (id: string) => {
    let index = -1;

    for (let i = 0; i < tipoUsuarios.length; i++) {
      if (tipoUsuarios[i].IdTipoUsuario.toString() === id) {
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
    let _tipoUsuario = { ...tipoUsuario };

    _tipoUsuario["Activo"] = e.value;
    setTipoUsuario(_tipoUsuario);
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";
    let _tipoUsuario = { ...tipoUsuario };

    // @ts-ignore
    _tipoUsuario[name] = val;

    setTipoUsuario(_tipoUsuario);
  };

  // const onInputTextTipoUsuarioChange = (
  //   e: React.ChangeEvent<HTMLTextTipoUsuarioElement>,
  //   name: string
  // ) => {
  //   const val = (e.target && e.target.value) || "";
  //   let _tipoUsuario = { ...tipoUsuario };

  //   // @ts-ignore
  //   _tipoUsuario[name] = val;

  //   setTipoUsuario(_tipoUsuario);
  // };

  // const onInputNumberChange = (
  //   e: InputNumberValueChangeEvent,
  //   name: string
  // ) => {
  //   const val = e.value ?? 0;
  //   let _tipoUsuario = { ...tipoUsuario };

  //   // @ts-ignore
  //   _tipoUsuario[name] = val;

  //   setTipoUsuario(_tipoUsuario);
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
          onClick={showCreateTipoUsuarioDialog}
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
          onClick={findAllTipoUsuario}
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
  const activoBodyTemplate = (rowData: TipoUsuarioEntity) => {
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
  const modifiadoElBodyTemplate = (rowData: TipoUsuarioEntity) => {
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
  const creadoElBodyTemplate = (rowData: TipoUsuarioEntity) => {
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
  const actionsBodyTemplate = (rowData: TipoUsuarioEntity) => {
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
          onClick={() => showUpdateTipoUsuarioDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          style={{
            width: "2rem",
            height: "1rem",
            color: "#fff",
          }}
          onClick={() => confirmRemoveTipoUsuario(rowData)}
        />
      </div>
    );
  };

  //useEffects
  useEffect(() => {
    findAllTipoUsuario();
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
        value={tipoUsuarios}
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
          "IdTipoUsuario",
          "Descripcion",
          "Activo",
          "CreadoEl",
          "CreadoPor",
          "ModificadoEl",
          "ModificadoPor",
        ]}
        emptyMessage={<EmptyMessageData loading={loading} />}
        selectionMode="multiple"
        selection={selectedTipoUsuarios}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedTipoUsuarios(e.value);
          }
        }}
        dataKey="IdTipoUsuario"
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

      <TipoUsuarioCreateOrUpdate
        submitted={submitted}
        tipoUsuario={tipoUsuario}
        tipoUsuarioDialog={tipoUsuarioDialog}
        hideDialog={hideDialog}
        createTipoUsuario={createTipoUsuario}
        updateTipoUsuario={updateTipoUsuario}
        onInputChange={onInputChange}
        onActivoChange={onActivoChange}
        loadingTipoUsuarioCreateOrUpdate={loadingTipoUsuarioCreateOrUpdate}
      />

      <TipoUsuarioRemove
        tipoUsuario={tipoUsuario}
        removeTipoUsuarioDialog={removeTipoUsuarioDialog}
        hideRemoveTipoUsuarioDialog={hideRemoveTipoUsuarioDialog}
        removeTipoUsuario={removeTipoUsuario}
      />

      <TipoUsuariosRemove
        tipoUsuario={tipoUsuario}
        removeTipoUsuariosDialog={removeTipoUsuariosDialog}
        hideRemoveTipoUsuariosDialog={hideRemoveTipoUsuariosDialog}
        removeSelectedTipoUsuarios={removeSelectedTipoUsuarios}
      />
    </div>
  );
};

export default TipoUsuario;
