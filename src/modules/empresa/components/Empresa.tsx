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
import UseEmpresa from "../hooks/UseEmpresa";
import { ColumnMeta } from "../../utils/Interfaces";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import {
  EmpresaCreate,
  EmpresaEntity,
  EmpresaOut,
  EmpresasOut,
} from "../interfaces/EmpresaInterface";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { columns, defaultFilters, emptyEmpresa } from "../utils/Constants";
import EmpresaCreateOrUpdate from "./EmpresaCreateOrUpdate";
import EmpresaRemove from "./EmpresaRemove";
import EmpresasRemove from "./EmpresasRemove";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { formatDate } from "../../utils/Methods";
import { Calendar } from "primereact/calendar";
import EmptyMessageData from "../../utils/shared/EmptyMessageData";

const Empresa = () => {
  // custom hooks
  const { create, findAll, findOne, update, remove } = UseEmpresa();

  //useRefs
  const toast = useRef<Toast>(null);

  const dt = useRef<DataTable<EmpresaEntity[]>>(null);

  //useStates
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(
    columns.filter((col: ColumnMeta) => col.show)
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingEmpresaCreateOrUpdate, setLoadingEmpresaCreateOrUpdate] =
    useState<boolean>(false);

  const [empresa, setEmpresa] = useState<EmpresaEntity>(emptyEmpresa);

  const [empresas, setEmpresas] = useState<EmpresaEntity[]>([]);

  const [selectedEmpresas, setSelectedEmpresas] = useState<EmpresaEntity[]>([]);

  const [empresaDialog, setEmpresaDialog] = useState<{
    type?: "create" | "update" | undefined;
    state: boolean;
  }>({
    state: false,
  });

  const [removeEmpresaDialog, setRemoveEmpresaDialog] = useState<boolean>(false);

  const [removeEmpresasDialog, setRemoveEmpresasDialog] = useState<boolean>(false);

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
      <h3 className="m-0">Mantenimiento de Empresas</h3>
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
  const findAllEmpresa = async () => {
    setLoading(true);
    const empresasFindAll = await findAll();
    setLoading(false);

    if (empresasFindAll?.message.msgId == 0 && empresasFindAll.registro) {
      setEmpresas(
        Array.isArray(empresasFindAll.registro)
          ? empresasFindAll.registro?.map((af) => {
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
      //     detail: `${empresasFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
      // } else if (empresasFindAll?.message.msgId == 1) {
      //   toast.current?.show({
      //     severity: "error",
      //     detail: `${empresasFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  const createEmpresa = async () => {
    setSubmitted(true);
    if (empresa.Descripcion.trim()) {
      setLoadingEmpresaCreateOrUpdate(true);
      let empresaCreate = await create({
        Descripcion: empresa.Descripcion,
        NroIdentificacion: empresa.NroIdentificacion,
        Email: empresa.Email,
        Celular: empresa.Celular,
        RazonSocial: empresa.RazonSocial,
        // UrlBase: empresa.UrlBase,
        // FormatoLogo: empresa.FormatoLogo,
        // NombreLogo: empresa.NombreLogo, 
        // SizeLogo: empresa.SizeLogo,
        // UrlLogo: empresa.UrlLogo,
        LogoNombre: empresa.LogoNombre,
        LogoBase64: empresa.LogoBase64,
        Activo: empresa.Activo,
      });
      setLoadingEmpresaCreateOrUpdate(false);

      if (empresaCreate?.message.msgId == 0 && empresaCreate.registro) {
        setEmpresas([...empresas, empresaCreate.registro]);
        toast.current?.show({
          severity: "success",
          detail: `${empresaCreate.message.msgTxt}`,
          life: 3000,
        });
      } else if (empresaCreate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${empresaCreate.message.msgTxt}`,
          life: 3000,
        });
      }

      setEmpresaDialog({ state: false });
      setEmpresa(emptyEmpresa);
      setSubmitted(false);
    }
  };

  const updateEmpresa = async () => {
    setSubmitted(true);
    if (empresa.IdEmpresa) {
      setLoadingEmpresaCreateOrUpdate(true);
      let empresaUpdate = await update(empresa.IdEmpresa.toString(), {
        Descripcion: empresa.Descripcion,
        NroIdentificacion: empresa.NroIdentificacion,
        Email: empresa.Email,
        Celular: empresa.Celular,
        RazonSocial: empresa.RazonSocial,
        // UrlBase: empresa.UrlBase,
        // FormatoLogo: empresa.FormatoLogo,
        // NombreLogo: empresa.NombreLogo, 
        // SizeLogo: empresa.SizeLogo,
        // UrlLogo: empresa.UrlLogo,
        LogoNombre: empresa.LogoNombre,
        LogoBase64: empresa.LogoBase64,
        Activo: empresa.Activo,
      });
      setLoadingEmpresaCreateOrUpdate(false);

      if (empresaUpdate?.message.msgId == 0 && empresaUpdate.registro) {
        setEmpresas(
          empresas?.map((empresa) =>
            empresa.IdEmpresa === empresaUpdate?.registro?.IdEmpresa
              ? { ...empresa, ...empresaUpdate.registro }
              : empresa
          )
        );
        toast.current?.show({
          severity: "success",
          detail: `${empresaUpdate.message.msgTxt}`,
          life: 3000,
        });
      } else if (empresaUpdate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${empresaUpdate.message.msgTxt}`,
          life: 3000,
        });
      }

      setEmpresaDialog({ state: false });
      setEmpresa(emptyEmpresa);
      setSubmitted(false);
    }
  };

  const removeEmpresa = async () => {
    if (empresa.IdEmpresa) {
      let empresaRemove = await remove(empresa.IdEmpresa.toString());

      if (empresaRemove?.message.msgId == 0 && empresaRemove.registro) {
        setEmpresas(
          empresas?.filter((empresa) => empresa.IdEmpresa !== empresaRemove?.registro?.IdEmpresa)
        );
        toast.current?.show({
          severity: "success",
          detail: `${empresaRemove.message.msgTxt}`,
          life: 3000,
        });
      } else if (empresaRemove?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${empresaRemove.message.msgTxt}`,
          life: 3000,
        });
      }

      setRemoveEmpresaDialog(false);
      setEmpresa(emptyEmpresa);
    }
  };

  const removeSelectedEmpresas = () => {
    let _empresas = empresas.filter(
      (val: EmpresaEntity) => !selectedEmpresas?.includes(val)
    );

    setEmpresas(_empresas);
    setRemoveEmpresasDialog(false);
    setSelectedEmpresas([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Empresas Removed",
      life: 3000,
    });
  };

  // templates to dialogs
  const hideDialog = () => {
    setSubmitted(false);
    setEmpresaDialog({ state: false });
  };

  const showCreateEmpresaDialog = () => {
    setEmpresa(emptyEmpresa);
    setSubmitted(false);
    setEmpresaDialog({ type: "create", state: true });
  };

  const showUpdateEmpresaDialog = (empresa: EmpresaEntity) => {
    setEmpresa({ ...empresa });
    setEmpresaDialog({ type: "update", state: true });
  };

  const hideRemoveEmpresaDialog = () => {
    setRemoveEmpresaDialog(false);
  };

  const hideRemoveEmpresasDialog = () => {
    setRemoveEmpresasDialog(false);
  };

  const confirmRemoveEmpresa = (empresa: EmpresaEntity) => {
    setEmpresa(empresa);
    setRemoveEmpresaDialog(true);
  };

  const confirmRemoveSelectedEmpresas = () => {
    setRemoveEmpresasDialog(true);
  };

  // here
  const findIndexById = (id: string) => {
    let index = -1;

    for (let i = 0; i < empresas.length; i++) {
      if (empresas[i].IdEmpresa.toString() === id) {
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
    let _empresa = { ...empresa };

    _empresa["Activo"] = e.value;
    setEmpresa(_empresa);
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";
    let _empresa = { ...empresa };

    // @ts-ignore
    _empresa[name] = val;

    setEmpresa(_empresa);
  };

  // const onInputTextEmpresaChange = (
  //   e: React.ChangeEvent<HTMLTextEmpresaElement>,
  //   name: string
  // ) => {
  //   const val = (e.target && e.target.value) || "";
  //   let _empresa = { ...empresa };

  //   // @ts-ignore
  //   _empresa[name] = val;

  //   setEmpresa(_empresa);
  // };

  // const onInputNumberChange = (
  //   e: InputNumberValueChangeEvent,
  //   name: string
  // ) => {
  //   const val = e.value ?? 0;
  //   let _empresa = { ...empresa };

  //   // @ts-ignore
  //   _empresa[name] = val;

  //   setEmpresa(_empresa);
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
          onClick={showCreateEmpresaDialog}
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
          onClick={findAllEmpresa}
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
  const activoBodyTemplate = (rowData: EmpresaEntity) => {
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
  const modifiadoElBodyTemplate = (rowData: EmpresaEntity) => {
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
  const creadoElBodyTemplate = (rowData: EmpresaEntity) => {
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
  const actionsBodyTemplate = (rowData: EmpresaEntity) => {
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
          onClick={() => showUpdateEmpresaDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          style={{
            width: "2rem",
            height: "1rem",
            color: "#fff",
          }}
          onClick={() => confirmRemoveEmpresa(rowData)}
        />
      </div>
    );
  };

  //useEffects
  useEffect(() => {
    findAllEmpresa();
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
        value={empresas}
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
          "IdEmpresa",
          "Descripcion",
          "NroIdentificacion",
          "Email",
          "Celular",
          "RazonSocial",
          "UrlBase",
          "FormatoLogo",
          "NombreLogo",
          "SizeLogo",
          "UrlLogo",
          "Activo",
          "CreadoEl",
          "CreadoPor",
          "ModificadoEl",
          "ModificadoPor",
        ]}
        emptyMessage={<EmptyMessageData loading={loading} />}
        selectionMode="multiple"
        selection={selectedEmpresas}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedEmpresas(e.value);
          }
        }}
        dataKey="IdEmpresa"
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

      <EmpresaCreateOrUpdate
        submitted={submitted}
        empresa={empresa}
        empresaDialog={empresaDialog}
        hideDialog={hideDialog}
        createEmpresa={createEmpresa}
        updateEmpresa={updateEmpresa}
        onInputChange={onInputChange}
        onActivoChange={onActivoChange}
        loadingEmpresaCreateOrUpdate={loadingEmpresaCreateOrUpdate}
      />

      <EmpresaRemove
        empresa={empresa}
        removeEmpresaDialog={removeEmpresaDialog}
        hideRemoveEmpresaDialog={hideRemoveEmpresaDialog}
        removeEmpresa={removeEmpresa}
      />

      <EmpresasRemove
        empresa={empresa}
        removeEmpresasDialog={removeEmpresasDialog}
        hideRemoveEmpresasDialog={hideRemoveEmpresasDialog}
        removeSelectedEmpresas={removeSelectedEmpresas}
      />
    </div>
  );
};

export default Empresa;
