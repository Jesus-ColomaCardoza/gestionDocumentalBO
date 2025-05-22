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
import UseEstado from "../hooks/UseEstado";
import { ColumnMeta } from "../../utils/Interfaces";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import {
  EstadoCreate,
  EstadoEntity,
  EstadoOut,
  EstadosOut,
} from "../interfaces/EstadoInterface";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { columns, defaultFilters, emptyEstado } from "../utils/Constants";
import EstadoCreateOrUpdate from "./EstadoCreateOrUpdate";
import EstadoRemove from "./EstadoRemove";
import EstadosRemove from "./EstadosRemove";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { formatDate } from "../../utils/Methods";
import { Calendar } from "primereact/calendar";
import EmptyMessageData from "../../utils/shared/EmptyMessageData";
import { UseEsquemaEstado } from "../../esquema-estado/hooks/UseEsquemaEstado";
import { EsquemaEstadoEntity } from "../../esquema-estado/interfaces/EsquemaEstadoInterface";
import { DropdownChangeEvent } from "primereact/dropdown";

const Estado = () => {
  // custom hooks
  const { create, findAll, findOne, update, remove } = UseEstado();

  const { findAll: findAllEsquemaEstado } = UseEsquemaEstado();

  //useRefs
  const toast = useRef<Toast>(null);

  const dt = useRef<DataTable<EstadoEntity[]>>(null);

  //useStates
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(
    columns.filter((col: ColumnMeta) => col.show)
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingEstadoCreateOrUpdate, setLoadingEstadoCreateOrUpdate] =
    useState<boolean>(false);

  const [estado, setEstado] = useState<EstadoEntity>(emptyEstado);

  const [estados, setEstados] = useState<EstadoEntity[]>([]);

  const [selectedEstados, setSelectedEstados] = useState<EstadoEntity[]>([]);

  const [esquemaEstados, setEsquemaEstados] = useState<
    Pick<EsquemaEstadoEntity, "IdEsquemaEstado" | "Descripcion">[]
  >([]);

  const [estadoDialog, setEstadoDialog] = useState<{
    type?: "create" | "update" | undefined;
    state: boolean;
  }>({
    state: false,
  });

  const [removeEstadoDialog, setRemoveEstadoDialog] = useState<boolean>(false);

  const [removeEstadosDialog, setRemoveEstadosDialog] =
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
      <h3 className="m-0">Mantenimiento de Estados</h3>
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

  // actions CRUD - Estado (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllEstado = async () => {
    setLoading(true);
    const estadosFindAll = await findAll();
    setLoading(false);

    if (estadosFindAll?.message.msgId == 0 && estadosFindAll.registro) {
      setEstados(
        Array.isArray(estadosFindAll.registro)
          ? estadosFindAll.registro?.map((af) => {
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
      //     detail: `${estadosFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
      // } else if (estadosFindAll?.message.msgId == 1) {
      //   toast.current?.show({
      //     severity: "error",
      //     detail: `${estadosFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  const createEstado = async () => {
    setSubmitted(true);
    if (estado.Descripcion.trim() && estado.IdEsquemaEstado != 0) {
      setLoadingEstadoCreateOrUpdate(true);
      let estadoCreate = await create({
        Descripcion: estado.Descripcion,
        IdEsquemaEstado: estado.IdEsquemaEstado,
        Activo: estado.Activo,
      });
      setLoadingEstadoCreateOrUpdate(false);

      if (estadoCreate?.message.msgId == 0 && estadoCreate.registro) {
        setEstados([...estados, estadoCreate.registro]);
        toast.current?.show({
          severity: "success",
          detail: `${estadoCreate.message.msgTxt}`,
          life: 3000,
        });
      } else if (estadoCreate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${estadoCreate.message.msgTxt}`,
          life: 3000,
        });
      }

      setEstadoDialog({ state: false });
      setEstado(emptyEstado);
    }
  };

  const updateEstado = async () => {
    setSubmitted(true);
    if (estado.IdEstado) {
      setLoadingEstadoCreateOrUpdate(true);
      let estadoUpdate = await update(estado.IdEstado.toString(), {
        Descripcion: estado.Descripcion,
        IdEsquemaEstado: estado.IdEsquemaEstado,
        Activo: estado.Activo,
      });
      setLoadingEstadoCreateOrUpdate(false);

      if (estadoUpdate?.message.msgId == 0 && estadoUpdate.registro) {
        setEstados(
          estados?.map((estado) =>
            estado.IdEstado === estadoUpdate?.registro?.IdEstado
              ? { ...estado, ...estadoUpdate.registro }
              : estado
          )
        );
        toast.current?.show({
          severity: "success",
          detail: `${estadoUpdate.message.msgTxt}`,
          life: 3000,
        });
      } else if (estadoUpdate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${estadoUpdate.message.msgTxt}`,
          life: 3000,
        });
      }

      setEstadoDialog({ state: false });
      setEstado(emptyEstado);
    }
  };

  const removeEstado = async () => {
    if (estado.IdEstado) {
      let estadoRemove = await remove(estado.IdEstado.toString());

      if (estadoRemove?.message.msgId == 0 && estadoRemove.registro) {
        setEstados(
          estados?.filter(
            (estado) => estado.IdEstado !== estadoRemove?.registro?.IdEstado
          )
        );
        toast.current?.show({
          severity: "success",
          detail: `${estadoRemove.message.msgTxt}`,
          life: 3000,
        });
      } else if (estadoRemove?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${estadoRemove.message.msgTxt}`,
          life: 3000,
        });
      }

      setRemoveEstadoDialog(false);
      setEstado(emptyEstado);
    }
  };

  const removeSelectedEstados = () => {
    let _estados = estados.filter(
      (val: EstadoEntity) => !selectedEstados?.includes(val)
    );

    setEstados(_estados);
    setRemoveEstadosDialog(false);
    setSelectedEstados([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Estados Removed",
      life: 3000,
    });
  };

  // actions CRUD - Esquema Estado (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllEsquemaEstadoCombox = async () => {
    setLoading(true);
    const esquemaEstadosFindAll = await findAllEsquemaEstado();
    setLoading(false);

    if (
      esquemaEstadosFindAll?.message.msgId == 0 &&
      esquemaEstadosFindAll.registro
    ) {
      setEsquemaEstados(
        Array.isArray(esquemaEstadosFindAll.registro)
          ? esquemaEstadosFindAll.registro?.map((af) => {
              return {
                IdEsquemaEstado: af.IdEsquemaEstado,
                Descripcion: af.Descripcion,
              };
            })
          : []
      );
    }
  };

  // templates to dialogs
  const hideDialog = () => {
    setSubmitted(false);
    setEstadoDialog({ state: false });
  };

  const showCreateEstadoDialog = () => {
    setEstado(emptyEstado);
    setSubmitted(false);
    setEstadoDialog({ type: "create", state: true });
  };

  const showUpdateEstadoDialog = (estado: EstadoEntity) => {
    setEstado({ ...estado });
    setEstadoDialog({ type: "update", state: true });
  };

  const hideRemoveEstadoDialog = () => {
    setRemoveEstadoDialog(false);
  };

  const hideRemoveEstadosDialog = () => {
    setRemoveEstadosDialog(false);
  };

  const confirmRemoveEstado = (estado: EstadoEntity) => {
    setEstado(estado);
    setRemoveEstadoDialog(true);
  };

  const confirmRemoveSelectedEstados = () => {
    setRemoveEstadosDialog(true);
  };

  // here
  const findIndexById = (id: string) => {
    let index = -1;

    for (let i = 0; i < estados.length; i++) {
      if (estados[i].IdEstado.toString() === id) {
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
    let _estado = { ...estado };

    _estado["Activo"] = e.value;
    setEstado(_estado);
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";

    let _estado: any = { ...estado };

    _estado[name] = val;

    setEstado(_estado);
  };

  const onDropdownChange = (
    e: DropdownChangeEvent,
    nameFK: string,
    nameObj: string
  ) => {
    const val = (e.target && e.target.value) || "";

    let _estado: any = { ...estado };

    _estado[nameFK] = val[nameFK];
    _estado[nameObj] = { ...val };

    setEstado(_estado);
  };

  // const onInputTextEstadoChange = (
  //   e: React.ChangeEvent<HTMLTextEstadoElement>,
  //   name: string
  // ) => {
  //   const val = (e.target && e.target.value) || "";
  //   let _estado = { ...estado };

  //   // @ts-ignore
  //   _estado[name] = val;

  //   setEstado(_estado);
  // };

  // const onInputNumberChange = (
  //   e: InputNumberValueChangeEvent,
  //   name: string
  // ) => {
  //   const val = e.value ?? 0;
  //   let _estado = { ...estado };

  //   // @ts-ignore
  //   _estado[name] = val;

  //   setEstado(_estado);
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
          onClick={showCreateEstadoDialog}
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
          onClick={findAllEstado}
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

  // templates to column EsquemaEstado
  const esquemaEstadoBodyTemplate = (rowData: EstadoEntity) => {
    return (
      <div className="flex align-items-center gap-2">
        <p className="text-sm m-0">{rowData.EsquemaEstado.Descripcion}</p>
      </div>
    );
  };

  const esquemaEstadoFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <>
        <div className="mb-3 text-sm w-12rem">Esquema Picker</div>
        <MultiSelect
          value={options.value}
          options={esquemaEstados}
          itemTemplate={(option: EsquemaEstadoEntity) => {
            return (
              <div className="flex align-items-center gap-2">
                <span>{option.Descripcion}</span>
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

  // templates to column Activo
  const activoBodyTemplate = (rowData: EstadoEntity) => {
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
      <div className="flex align-items-center justify-content-center gap-2 w-12rem">
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
  const modifiadoElBodyTemplate = (rowData: EstadoEntity) => {
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
  const creadoElBodyTemplate = (rowData: EstadoEntity) => {
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
  const actionsBodyTemplate = (rowData: EstadoEntity) => {
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
          onClick={() => showUpdateEstadoDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          style={{
            width: "2rem",
            height: "1rem",
            color: "#fff",
          }}
          onClick={() => confirmRemoveEstado(rowData)}
        />
      </div>
    );
  };

  //useEffects
  useEffect(() => {
    findAllEstado();
    findAllEsquemaEstadoCombox();
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
        value={estados}
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
          "IdEstado",
          "Descripcion",
          "EsquemaEstado.Descripcion",
          "Activo",
          "CreadoEl",
          "CreadoPor",
          "ModificadoEl",
          "ModificadoPor",
        ]}
        emptyMessage={<EmptyMessageData loading={loading} />}
        selectionMode="multiple"
        selection={selectedEstados}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedEstados(e.value);
          }
        }}
        dataKey="IdEstado"
        selectionPageOnly
        // loading={loading}
      >
        <Column
          selectionMode="multiple"
          exportable={false}
          headerStyle={{ width: "0%" }}
        />
        {visibleColumns.map((col) => {
          if (col.field == "EsquemaEstado") {
            return (
              <Column
                key={col.field}
                field={col.filterField}
                filterField={col.filterField}
                showFilterMatchModes={false}
                sortField={col.filterField}
                header={col.header}
                dataType={col.dataType}
                sortable
                style={{ width: col.width, padding: 5 }}
                filter
                filterPlaceholder={col.filterPlaceholder}
                body={esquemaEstadoBodyTemplate}
                filterElement={esquemaEstadoFilterTemplate}
              />
            );
          } else if (col.field == "Activo") {
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

      <EstadoCreateOrUpdate
        submitted={submitted}
        estado={estado}
        esquemaEstados={esquemaEstados}
        estadoDialog={estadoDialog}
        hideDialog={hideDialog}
        createEstado={createEstado}
        updateEstado={updateEstado}
        onInputChange={onInputChange}
        onDropdownChange={onDropdownChange}
        onActivoChange={onActivoChange}
        loadingEstadoCreateOrUpdate={loadingEstadoCreateOrUpdate}
      />

      <EstadoRemove
        estado={estado}
        removeEstadoDialog={removeEstadoDialog}
        hideRemoveEstadoDialog={hideRemoveEstadoDialog}
        removeEstado={removeEstado}
      />

      <EstadosRemove
        estado={estado}
        removeEstadosDialog={removeEstadosDialog}
        hideRemoveEstadosDialog={hideRemoveEstadosDialog}
        removeSelectedEstados={removeSelectedEstados}
      />
    </div>
  );
};

export default Estado;
