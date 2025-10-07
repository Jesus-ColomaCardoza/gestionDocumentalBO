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
import UseRol from "../hooks/UseRol";
import { ColumnMeta } from "../../utils/Interfaces";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import {
  RolCreate,
  RolEntity,
  RolOut,
  RolesOut,
} from "../interfaces/RolInterface";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { columns, defaultFilters, emptyRol } from "../utils/Constants";
import RolCreateOrUpdate from "./RolCreateOrUpdate";
import RolRemove from "./RolRemove";
import RolesRemove from "./RolesRemove";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { formatDate } from "../../utils/Methods";
import { Calendar } from "primereact/calendar";
import EmptyMessageData from "../../utils/shared/EmptyMessageData";
import { useAuth } from "../../auth/context/AuthContext";

const Rol = () => {
  // custom hooks
  const { create, findAll, findOne, update, remove } = UseRol();

  const { userAuth } = useAuth()!;

  //useRefs
  const toast = useRef<Toast>(null);

  const dt = useRef<DataTable<RolEntity[]>>(null);

  //useStates
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(
    columns.filter((col: ColumnMeta) => col.show)
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingRolCreateOrUpdate, setLoadingRolCreateOrUpdate] =
    useState<boolean>(false);

  const [rol, setRol] = useState<RolEntity>(emptyRol);

  const [roles, setRoles] = useState<RolEntity[]>([]);

  const [selectedRoles, setSelectedRoles] = useState<RolEntity[]>([]);

  const [rolDialog, setRolDialog] = useState<{
    type?: "create" | "update" | undefined;
    state: boolean;
  }>({
    state: false,
  });

  const [removeRolDialog, setRemoveRolDialog] = useState<boolean>(false);

  const [removeRolesDialog, setRemoveRolesDialog] = useState<boolean>(false);

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
      <h3 className="m-0">Mantenimiento de Roles</h3>
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
  const findAllRol = async () => {
    setLoading(true);
    const rolesFindAll = await findAll();
    setLoading(false);

    if (rolesFindAll?.message.msgId == 0 && rolesFindAll.registro) {
      setRoles(
        Array.isArray(rolesFindAll.registro)
          ? rolesFindAll.registro?.map((af) => {
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
      //     detail: `${rolesFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
      // } else if (rolesFindAll?.message.msgId == 1) {
      //   toast.current?.show({
      //     severity: "error",
      //     detail: `${rolesFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  const createRol = async () => {
    setSubmitted(true);
    if (rol.Descripcion.trim()) {
      setLoadingRolCreateOrUpdate(true);
      let rolCreate = await create({
        IdRol: rol.IdRol,
        Descripcion: rol.Descripcion,
        Activo: rol.Activo,
      });
      setLoadingRolCreateOrUpdate(false);

      if (rolCreate?.message.msgId == 0 && rolCreate.registro) {
        setRoles([...roles, rolCreate.registro]);
        toast.current?.show({
          severity: "success",
          detail: `${rolCreate.message.msgTxt}`,
          life: 3000,
        });
      } else if (rolCreate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${rolCreate.message.msgTxt}`,
          life: 3000,
        });
      }

      setRolDialog({ state: false });
      setRol(emptyRol);
    }
  };

  const updateRol = async () => {
    setSubmitted(true);
    if (rol.IdRol) {
      setLoadingRolCreateOrUpdate(true);
      let rolUpdate = await update(rol.IdRol.toString(), {
        IdRol: rol.IdRol,
        Descripcion: rol.Descripcion,
        Activo: rol.Activo,
      });
      setLoadingRolCreateOrUpdate(false);

      if (rolUpdate?.message.msgId == 0 && rolUpdate.registro) {
        setRoles(
          roles?.map((rol) =>
            rol.IdRol === rolUpdate?.registro?.IdRol
              ? { ...rol, ...rolUpdate.registro }
              : rol
          )
        );
        toast.current?.show({
          severity: "success",
          detail: `${rolUpdate.message.msgTxt}`,
          life: 3000,
        });
      } else if (rolUpdate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${rolUpdate.message.msgTxt}`,
          life: 3000,
        });
      }

      setRolDialog({ state: false });
      setRol(emptyRol);
    }
  };

  const removeRol = async () => {
    if (rol.IdRol) {
      let rolRemove = await remove(rol.IdRol.toString());

      if (rolRemove?.message.msgId == 0 && rolRemove.registro) {
        setRoles(
          roles?.filter((rol) => rol.IdRol !== rolRemove?.registro?.IdRol)
        );
        toast.current?.show({
          severity: "success",
          detail: `${rolRemove.message.msgTxt}`,
          life: 3000,
        });
      } else if (rolRemove?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${rolRemove.message.msgTxt}`,
          life: 3000,
        });
      }

      setRemoveRolDialog(false);
      setRol(emptyRol);
    }
  };

  const removeSelectedRoles = () => {
    let _roles = roles.filter(
      (val: RolEntity) => !selectedRoles?.includes(val)
    );

    setRoles(_roles);
    setRemoveRolesDialog(false);
    setSelectedRoles([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Roles Removed",
      life: 3000,
    });
  };

  // templates to dialogs
  const hideDialog = () => {
    setSubmitted(false);
    setRolDialog({ state: false });
  };

  const showCreateRolDialog = () => {
    setRol(emptyRol);
    setSubmitted(false);
    setRolDialog({ type: "create", state: true });
  };

  const showUpdateRolDialog = (rol: RolEntity) => {
    setRol({ ...rol });
    setRolDialog({ type: "update", state: true });
  };

  const hideRemoveRolDialog = () => {
    setRemoveRolDialog(false);
  };

  const hideRemoveRolesDialog = () => {
    setRemoveRolesDialog(false);
  };

  const confirmRemoveRol = (rol: RolEntity) => {
    setRol(rol);
    setRemoveRolDialog(true);
  };

  const confirmRemoveSelectedRoles = () => {
    setRemoveRolesDialog(true);
  };

  // here
  const findIndexById = (id: string) => {
    let index = -1;

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].IdRol.toString() === id) {
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
    let _rol = { ...rol };

    _rol["Activo"] = e.value;
    setRol(_rol);
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";
    let _rol = { ...rol };

    // @ts-ignore
    _rol[name] = val;

    setRol(_rol);
  };

  // const onInputTextRolChange = (
  //   e: React.ChangeEvent<HTMLTextRolElement>,
  //   name: string
  // ) => {
  //   const val = (e.target && e.target.value) || "";
  //   let _rol = { ...rol };

  //   // @ts-ignore
  //   _rol[name] = val;

  //   setRol(_rol);
  // };

  // const onInputNumberChange = (
  //   e: InputNumberValueChangeEvent,
  //   name: string
  // ) => {
  //   const val = e.value ?? 0;
  //   let _rol = { ...rol };

  //   // @ts-ignore
  //   _rol[name] = val;

  //   setRol(_rol);
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
          onClick={showCreateRolDialog}
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
          onClick={findAllRol}
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
  const activoBodyTemplate = (rowData: RolEntity) => {
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
  const modifiadoElBodyTemplate = (rowData: RolEntity) => {
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
  const creadoElBodyTemplate = (rowData: RolEntity) => {
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
  const actionsBodyTemplate = (rowData: RolEntity) => {
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
          onClick={() => showUpdateRolDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          disabled={!(userAuth?.Area?.IdArea == 11)}
          severity="danger"
          style={{
            width: "2rem",
            height: "1rem",
            color: "#fff",
          }}
          onClick={() => confirmRemoveRol(rowData)}
        />
      </div>
    );
  };

  //useEffects
  useEffect(() => {
    findAllRol();
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
        value={roles}
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
          "IdRol",
          "Descripcion",
          "Activo",
          "CreadoEl",
          "CreadoPor",
          "ModificadoEl",
          "ModificadoPor",
        ]}
        emptyMessage={<EmptyMessageData loading={loading} />}
        selectionMode="multiple"
        selection={selectedRoles}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedRoles(e.value);
          }
        }}
        dataKey="IdRol"
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

      <RolCreateOrUpdate
        submitted={submitted}
        rol={rol}
        rolDialog={rolDialog}
        hideDialog={hideDialog}
        createRol={createRol}
        updateRol={updateRol}
        onInputChange={onInputChange}
        onActivoChange={onActivoChange}
        loadingRolCreateOrUpdate={loadingRolCreateOrUpdate}
      />

      <RolRemove
        rol={rol}
        removeRolDialog={removeRolDialog}
        hideRemoveRolDialog={hideRemoveRolDialog}
        removeRol={removeRol}
      />

      <RolesRemove
        rol={rol}
        removeRolesDialog={removeRolesDialog}
        hideRemoveRolesDialog={hideRemoveRolesDialog}
        removeSelectedRoles={removeSelectedRoles}
      />
    </div>
  );
};

export default Rol;
