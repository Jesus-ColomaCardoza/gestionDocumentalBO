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
// import UseEsquemaEstado from "../hooks/UseEsquemaEstado";
import { ColumnMeta } from "../../utils/Interfaces";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import {
  EsquemaEstadoCreate,
  EsquemaEstadoEntity,
  EsquemaEstadoOut,
  EsquemaEstadosOut,
} from "../interfaces/EsquemaEstadoInterface";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { columns, defaultFilters, emptyEsquemaEstado } from "../utils/Constants";
import EsquemaEstadoCreateOrUpdate from "./EsquemaEstadoCreateOrUpdate";
import EsquemaEstadoRemove from "./EsquemaEstadoRemove";
import EsquemaEstadosRemove from "./EsquemaEstadosRemove";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { formatDate } from "../../utils/Methods";
import { Calendar } from "primereact/calendar";
import EmptyMessageData from "../../utils/shared/EmptyMessageData";
import { UseEsquemaEstado } from "../hooks/UseEsquemaEstado";

const EsquemaEstado = () => {
  // custom hooks
  const { create, findAll, findOne, update, remove } = UseEsquemaEstado();

  //useRefs
  const toast = useRef<Toast>(null);

  const dt = useRef<DataTable<EsquemaEstadoEntity[]>>(null);

  //useStates
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(
    columns.filter((col: ColumnMeta) => col.show)
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingEsquemaEstadoCreateOrUpdate, setLoadingEsquemaEstadoCreateOrUpdate] =
    useState<boolean>(false);

  const [esquemaEstado, setEsquemaEstado] = useState<EsquemaEstadoEntity>(emptyEsquemaEstado);

  const [esquemaEstados, setEsquemaEstados] = useState<EsquemaEstadoEntity[]>([]);

  const [selectedEsquemaEstados, setSelectedEsquemaEstados] = useState<EsquemaEstadoEntity[]>([]);

  const [esquemaEstadoDialog, setEsquemaEstadoDialog] = useState<{
    type?: "create" | "update" | undefined;
    state: boolean;
  }>({
    state: false,
  });

  const [removeEsquemaEstadoDialog, setRemoveEsquemaEstadoDialog] = useState<boolean>(false);

  const [removeEsquemaEstadosDialog, setRemoveEsquemaEstadosDialog] = useState<boolean>(false);

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
      <h3 className="m-0">Mantenimiento de Esquema Estados</h3>
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
  const findAllEsquemaEstado = async () => {
    setLoading(true);
    const esquemaEstadosFindAll = await findAll();
    setLoading(false);

    if (esquemaEstadosFindAll?.message.msgId == 0 && esquemaEstadosFindAll.registro) {
      setEsquemaEstados(
        Array.isArray(esquemaEstadosFindAll.registro)
          ? esquemaEstadosFindAll.registro?.map((af) => {
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
      //     detail: `${esquemaEstadosFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
      // } else if (esquemaEstadosFindAll?.message.msgId == 1) {
      //   toast.current?.show({
      //     severity: "error",
      //     detail: `${esquemaEstadosFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  const createEsquemaEstado = async () => {
    setSubmitted(true);
    if (esquemaEstado.Descripcion.trim()) {
      setLoadingEsquemaEstadoCreateOrUpdate(true);
      let esquemaEstadoCreate = await create({
        Descripcion: esquemaEstado.Descripcion,
        Activo: esquemaEstado.Activo,
      });
      setLoadingEsquemaEstadoCreateOrUpdate(false);

      if (esquemaEstadoCreate?.message.msgId == 0 && esquemaEstadoCreate.registro) {
        setEsquemaEstados([...esquemaEstados, esquemaEstadoCreate.registro]);
        toast.current?.show({
          severity: "success",
          detail: `${esquemaEstadoCreate.message.msgTxt}`,
          life: 3000,
        });
      } else if (esquemaEstadoCreate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${esquemaEstadoCreate.message.msgTxt}`,
          life: 3000,
        });
      }

      setEsquemaEstadoDialog({ state: false });
      setEsquemaEstado(emptyEsquemaEstado);
    }
  };

  const updateEsquemaEstado = async () => {
    setSubmitted(true);
    if (esquemaEstado.IdEsquemaEstado) {
      setLoadingEsquemaEstadoCreateOrUpdate(true);
      let esquemaEstadoUpdate = await update(esquemaEstado.IdEsquemaEstado.toString(), {
        Descripcion: esquemaEstado.Descripcion,
        Activo: esquemaEstado.Activo,
      });
      setLoadingEsquemaEstadoCreateOrUpdate(false);

      if (esquemaEstadoUpdate?.message.msgId == 0 && esquemaEstadoUpdate.registro) {
        setEsquemaEstados(
          esquemaEstados?.map((esquemaEstado) =>
            esquemaEstado.IdEsquemaEstado === esquemaEstadoUpdate?.registro?.IdEsquemaEstado
              ? { ...esquemaEstado, ...esquemaEstadoUpdate.registro }
              : esquemaEstado
          )
        );
        toast.current?.show({
          severity: "success",
          detail: `${esquemaEstadoUpdate.message.msgTxt}`,
          life: 3000,
        });
      } else if (esquemaEstadoUpdate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${esquemaEstadoUpdate.message.msgTxt}`,
          life: 3000,
        });
      }

      setEsquemaEstadoDialog({ state: false });
      setEsquemaEstado(emptyEsquemaEstado);
    }
  };

  const removeEsquemaEstado = async () => {
    if (esquemaEstado.IdEsquemaEstado) {
      let esquemaEstadoRemove = await remove(esquemaEstado.IdEsquemaEstado.toString());

      if (esquemaEstadoRemove?.message.msgId == 0 && esquemaEstadoRemove.registro) {
        setEsquemaEstados(
          esquemaEstados?.filter((esquemaEstado) => esquemaEstado.IdEsquemaEstado !== esquemaEstadoRemove?.registro?.IdEsquemaEstado)
        );
        toast.current?.show({
          severity: "success",
          detail: `${esquemaEstadoRemove.message.msgTxt}`,
          life: 3000,
        });
      } else if (esquemaEstadoRemove?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${esquemaEstadoRemove.message.msgTxt}`,
          life: 3000,
        });
      }

      setRemoveEsquemaEstadoDialog(false);
      setEsquemaEstado(emptyEsquemaEstado);
    }
  };

  const removeSelectedEsquemaEstados = () => {
    let _esquemaEstados = esquemaEstados.filter(
      (val: EsquemaEstadoEntity) => !selectedEsquemaEstados?.includes(val)
    );

    setEsquemaEstados(_esquemaEstados);
    setRemoveEsquemaEstadosDialog(false);
    setSelectedEsquemaEstados([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "EsquemaEstados Removed",
      life: 3000,
    });
  };

  // templates to dialogs
  const hideDialog = () => {
    setSubmitted(false);
    setEsquemaEstadoDialog({ state: false });
  };

  const showCreateEsquemaEstadoDialog = () => {
    setEsquemaEstado(emptyEsquemaEstado);
    setSubmitted(false);
    setEsquemaEstadoDialog({ type: "create", state: true });
  };

  const showUpdateEsquemaEstadoDialog = (esquemaEstado: EsquemaEstadoEntity) => {
    setEsquemaEstado({ ...esquemaEstado });
    setEsquemaEstadoDialog({ type: "update", state: true });
  };

  const hideRemoveEsquemaEstadoDialog = () => {
    setRemoveEsquemaEstadoDialog(false);
  };

  const hideRemoveEsquemaEstadosDialog = () => {
    setRemoveEsquemaEstadosDialog(false);
  };

  const confirmRemoveEsquemaEstado = (esquemaEstado: EsquemaEstadoEntity) => {
    setEsquemaEstado(esquemaEstado);
    setRemoveEsquemaEstadoDialog(true);
  };

  const confirmRemoveSelectedEsquemaEstados = () => {
    setRemoveEsquemaEstadosDialog(true);
  };

  // here
  const findIndexById = (id: string) => {
    let index = -1;

    for (let i = 0; i < esquemaEstados.length; i++) {
      if (esquemaEstados[i].IdEsquemaEstado.toString() === id) {
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
    let _esquemaEstado = { ...esquemaEstado };

    _esquemaEstado["Activo"] = e.value;
    setEsquemaEstado(_esquemaEstado);
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";
    let _esquemaEstado = { ...esquemaEstado };

    // @ts-ignore
    _esquemaEstado[name] = val;

    setEsquemaEstado(_esquemaEstado);
  };

  // const onInputTextEsquemaEstadoChange = (
  //   e: React.ChangeEvent<HTMLTextEsquemaEstadoElement>,
  //   name: string
  // ) => {
  //   const val = (e.target && e.target.value) || "";
  //   let _esquemaEstado = { ...esquemaEstado };

  //   // @ts-ignore
  //   _esquemaEstado[name] = val;

  //   setEsquemaEstado(_esquemaEstado);
  // };

  // const onInputNumberChange = (
  //   e: InputNumberValueChangeEvent,
  //   name: string
  // ) => {
  //   const val = e.value ?? 0;
  //   let _esquemaEstado = { ...esquemaEstado };

  //   // @ts-ignore
  //   _esquemaEstado[name] = val;

  //   setEsquemaEstado(_esquemaEstado);
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
          onClick={showCreateEsquemaEstadoDialog}
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
          onClick={findAllEsquemaEstado}
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
  const activoBodyTemplate = (rowData: EsquemaEstadoEntity) => {
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
  const modifiadoElBodyTemplate = (rowData: EsquemaEstadoEntity) => {
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
  const creadoElBodyTemplate = (rowData: EsquemaEstadoEntity) => {
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
  const actionsBodyTemplate = (rowData: EsquemaEstadoEntity) => {
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
          onClick={() => showUpdateEsquemaEstadoDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          style={{
            width: "2rem",
            height: "1rem",
            color: "#fff",
          }}
          onClick={() => confirmRemoveEsquemaEstado(rowData)}
        />
      </div>
    );
  };

  //useEffects
  useEffect(() => {
    findAllEsquemaEstado();
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
        value={esquemaEstados}
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
          "IdEsquemaEstado",
          "Descripcion",
          "Activo",
          "CreadoEl",
          "CreadoPor",
          "ModificadoEl",
          "ModificadoPor",
        ]}
        emptyMessage={<EmptyMessageData loading={loading} />}
        selectionMode="multiple"
        selection={selectedEsquemaEstados}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedEsquemaEstados(e.value);
          }
        }}
        dataKey="IdEsquemaEstado"
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

      <EsquemaEstadoCreateOrUpdate
        submitted={submitted}
        esquemaEstado={esquemaEstado}
        esquemaEstadoDialog={esquemaEstadoDialog}
        hideDialog={hideDialog}
        createEsquemaEstado={createEsquemaEstado}
        updateEsquemaEstado={updateEsquemaEstado}
        onInputChange={onInputChange}
        onActivoChange={onActivoChange}
        loadingEsquemaEstadoCreateOrUpdate={loadingEsquemaEstadoCreateOrUpdate}
      />

      <EsquemaEstadoRemove
        esquemaEstado={esquemaEstado}
        removeEsquemaEstadoDialog={removeEsquemaEstadoDialog}
        hideRemoveEsquemaEstadoDialog={hideRemoveEsquemaEstadoDialog}
        removeEsquemaEstado={removeEsquemaEstado}
      />

      <EsquemaEstadosRemove
        esquemaEstado={esquemaEstado}
        removeEsquemaEstadosDialog={removeEsquemaEstadosDialog}
        hideRemoveEsquemaEstadosDialog={hideRemoveEsquemaEstadosDialog}
        removeSelectedEsquemaEstados={removeSelectedEsquemaEstados}
      />
    </div>
  );
};

export default EsquemaEstado;
