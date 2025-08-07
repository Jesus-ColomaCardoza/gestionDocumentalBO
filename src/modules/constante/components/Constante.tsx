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
import UseConstante from "../hooks/UseConstante";
import { ColumnMeta } from "../../utils/Interfaces";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import {
  ConstanteCreate,
  ConstanteEntity,
  ConstanteOut,
  ConstantesOut,
} from "../interfaces/ConstanteInterface";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { columns, defaultFilters, emptyConstante } from "../utils/Constants";
import ConstanteCreateOrUpdate from "./ConstanteCreateOrUpdate";
import ConstanteRemove from "./ConstanteRemove";
import ConstantesRemove from "./ConstantesRemove";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { formatDate } from "../../utils/Methods";
import { Calendar } from "primereact/calendar";
import EmptyMessageData from "../../utils/shared/EmptyMessageData";
import { InputNumberChangeEvent } from "primereact/inputnumber";

const Constante = () => {
  // custom hooks
  const { create, findAll, findOne, update, remove } = UseConstante();

  //useRefs
  const toast = useRef<Toast>(null);

  const dt = useRef<DataTable<ConstanteEntity[]>>(null);

  //useStates
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(
    columns.filter((col: ColumnMeta) => col.show)
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingConstanteCreateOrUpdate, setLoadingConstanteCreateOrUpdate] =
    useState<boolean>(false);

  const [constante, setConstante] = useState<ConstanteEntity>(emptyConstante);

  const [constantes, setConstantes] = useState<ConstanteEntity[]>([]);

  const [selectedConstantes, setSelectedConstantes] = useState<ConstanteEntity[]>([]);

  const [constanteDialog, setConstanteDialog] = useState<{
    type?: "create" | "update" | undefined;
    state: boolean;
  }>({
    state: false,
  });

  const [removeConstanteDialog, setRemoveConstanteDialog] = useState<boolean>(false);

  const [removeConstantesDialog, setRemoveConstantesDialog] = useState<boolean>(false);

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
      <h3 className="m-0">Mantenimiento de Constantes</h3>
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
  const findAllConstante = async () => {
    setLoading(true);
    const constantesFindAll = await findAll();
    setLoading(false);

    if (constantesFindAll?.message.msgId == 0 && constantesFindAll.registro) {
      setConstantes(
        Array.isArray(constantesFindAll.registro)
          ? constantesFindAll.registro?.map((af) => {
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
      //     detail: `${constantesFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
      // } else if (constantesFindAll?.message.msgId == 1) {
      //   toast.current?.show({
      //     severity: "error",
      //     detail: `${constantesFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  const createConstante = async () => {
    setSubmitted(true);
    if (constante.Descripcion.trim()) {
      setLoadingConstanteCreateOrUpdate(true);
      let constanteCreate = await create({
        NombreTecnico: constante.NombreTecnico,
        IdGrupo: constante.IdGrupo,
        Valor: constante.Valor,
        Descripcion: constante.Descripcion,
        IdEmpresa: constante.IdEmpresa,
        Activo: constante.Activo,
      });
      setLoadingConstanteCreateOrUpdate(false);

      if (constanteCreate?.message.msgId == 0 && constanteCreate.registro) {
        setConstantes([...constantes, constanteCreate.registro]);
        toast.current?.show({
          severity: "success",
          detail: `${constanteCreate.message.msgTxt}`,
          life: 3000,
        });
      } else if (constanteCreate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${constanteCreate.message.msgTxt}`,
          life: 3000,
        });
      }

      setConstanteDialog({ state: false });
      setConstante(emptyConstante);
    }
  };

  const updateConstante = async () => {
    setSubmitted(true);
    if (constante.IdConstante) {
      setLoadingConstanteCreateOrUpdate(true);
      let constanteUpdate = await update(constante.IdConstante.toString(), {
        NombreTecnico: constante.NombreTecnico,
        IdGrupo: constante.IdGrupo,
        Valor: constante.Valor,
        Descripcion: constante.Descripcion,
        IdEmpresa: constante.IdEmpresa,
        Activo: constante.Activo,
      });
      setLoadingConstanteCreateOrUpdate(false);

      if (constanteUpdate?.message.msgId == 0 && constanteUpdate.registro) {
        setConstantes(
          constantes?.map((constante) =>
            constante.IdConstante === constanteUpdate?.registro?.IdConstante
              ? { ...constante, ...constanteUpdate.registro }
              : constante
          )
        );
        toast.current?.show({
          severity: "success",
          detail: `${constanteUpdate.message.msgTxt}`,
          life: 3000,
        });
      } else if (constanteUpdate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${constanteUpdate.message.msgTxt}`,
          life: 3000,
        });
      }

      setConstanteDialog({ state: false });
      setConstante(emptyConstante);
    }
  };

  const removeConstante = async () => {
    if (constante.IdConstante) {
      let constanteRemove = await remove(constante.IdConstante.toString());

      if (constanteRemove?.message.msgId == 0 && constanteRemove.registro) {
        setConstantes(
          constantes?.filter((constante) => constante.IdConstante !== constanteRemove?.registro?.IdConstante)
        );
        toast.current?.show({
          severity: "success",
          detail: `${constanteRemove.message.msgTxt}`,
          life: 3000,
        });
      } else if (constanteRemove?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${constanteRemove.message.msgTxt}`,
          life: 3000,
        });
      }

      setRemoveConstanteDialog(false);
      setConstante(emptyConstante);
    }
  };

  const removeSelectedConstantes = () => {
    let _constantes = constantes.filter(
      (val: ConstanteEntity) => !selectedConstantes?.includes(val)
    );

    setConstantes(_constantes);
    setRemoveConstantesDialog(false);
    setSelectedConstantes([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Constantes Removed",
      life: 3000,
    });
  };

  // templates to dialogs
  const hideDialog = () => {
    setSubmitted(false);
    setConstanteDialog({ state: false });
  };

  const showCreateConstanteDialog = () => {
    setConstante(emptyConstante);
    setSubmitted(false);
    setConstanteDialog({ type: "create", state: true });
  };

  const showUpdateConstanteDialog = (constante: ConstanteEntity) => {
    setConstante({ ...constante });
    setConstanteDialog({ type: "update", state: true });
  };

  const hideRemoveConstanteDialog = () => {
    setRemoveConstanteDialog(false);
  };

  const hideRemoveConstantesDialog = () => {
    setRemoveConstantesDialog(false);
  };

  const confirmRemoveConstante = (constante: ConstanteEntity) => {
    setConstante(constante);
    setRemoveConstanteDialog(true);
  };

  const confirmRemoveSelectedConstantes = () => {
    setRemoveConstantesDialog(true);
  };

  // here
  const findIndexById = (id: string) => {
    let index = -1;

    for (let i = 0; i < constantes.length; i++) {
      if (constantes[i].IdConstante.toString() === id) {
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
    let _constante = { ...constante };

    _constante["Activo"] = e.value;
    setConstante(_constante);
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";
    let _constante = { ...constante };

    // @ts-ignore
    _constante[name] = val;

    setConstante(_constante);
  };

  const onInputNumberChange = (e: InputNumberChangeEvent, name: string) => {
      const val = e.value ?? null;
  
      setConstante((prev) => ({
        ...prev,
        [name]: val,
      }));
    };
  
  // const onInputTextConstanteChange = (
  //   e: React.ChangeEvent<HTMLTextConstanteElement>,
  //   name: string
  // ) => {
  //   const val = (e.target && e.target.value) || "";
  //   let _constante = { ...constante };

  //   // @ts-ignore
  //   _constante[name] = val;

  //   setConstante(_constante);
  // };

  // const onInputNumberChange = (
  //   e: InputNumberValueChangeEvent,
  //   name: string
  // ) => {
  //   const val = e.value ?? 0;
  //   let _constante = { ...constante };

  //   // @ts-ignore
  //   _constante[name] = val;

  //   setConstante(_constante);
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
          onClick={showCreateConstanteDialog}
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
          onClick={findAllConstante}
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
  const activoBodyTemplate = (rowData: ConstanteEntity) => {
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
  const modifiadoElBodyTemplate = (rowData: ConstanteEntity) => {
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
  const creadoElBodyTemplate = (rowData: ConstanteEntity) => {
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
  const actionsBodyTemplate = (rowData: ConstanteEntity) => {
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
          onClick={() => showUpdateConstanteDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          style={{
            width: "2rem",
            height: "1rem",
            color: "#fff",
          }}
          onClick={() => confirmRemoveConstante(rowData)}
        />
      </div>
    );
  };

  //useEffects
  useEffect(() => {
    findAllConstante();
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
        value={constantes}
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
          "IdConstante",
          "NombreTecnico",
          "IdGrupo",
          "Valor",
          "Descripcion",
          "IdEmpresa",
          "Activo",
          "CreadoEl",
          "CreadoPor",
          "ModificadoEl",
          "ModificadoPor",
        ]}
        emptyMessage={<EmptyMessageData loading={loading} />}
        selectionMode="multiple"
        selection={selectedConstantes}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedConstantes(e.value);
          }
        }}
        dataKey="IdConstante"
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

      <ConstanteCreateOrUpdate
        submitted={submitted}
        constante={constante}
        constanteDialog={constanteDialog}
        hideDialog={hideDialog}
        createConstante={createConstante}
        updateConstante={updateConstante}
        onInputChange={onInputChange}
        onActivoChange={onActivoChange}
        onInputNumberChange={onInputNumberChange}
        loadingConstanteCreateOrUpdate={loadingConstanteCreateOrUpdate}
      />

      <ConstanteRemove
        constante={constante}
        removeConstanteDialog={removeConstanteDialog}
        hideRemoveConstanteDialog={hideRemoveConstanteDialog}
        removeConstante={removeConstante}
      />

      <ConstantesRemove
        constante={constante}
        removeConstantesDialog={removeConstantesDialog}
        hideRemoveConstantesDialog={hideRemoveConstantesDialog}
        removeSelectedConstantes={removeSelectedConstantes}
      />
    </div>
  );
};

export default Constante;
