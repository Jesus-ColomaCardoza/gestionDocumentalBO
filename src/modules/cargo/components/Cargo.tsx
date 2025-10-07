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
import UseCargo from "../hooks/UseCargo";
import { ColumnMeta } from "../../utils/Interfaces";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import {
  CargoCreate,
  CargoEntity,
  CargoOut,
  CargosOut,
} from "../interfaces/CargoInterface";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { columns, defaultFilters, emptyCargo } from "../utils/Constants";
import CargoCreateOrUpdate from "./CargoCreateOrUpdate";
import CargoRemove from "./CargoRemove";
import CargosRemove from "./CargosRemove";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { formatDate } from "../../utils/Methods";
import { Calendar } from "primereact/calendar";
import EmptyMessageData from "../../utils/shared/EmptyMessageData";
import { useAuth } from "../../auth/context/AuthContext";

const Cargo = () => {
  // custom hooks
  const { create, findAll, findOne, update, remove } = UseCargo();

  const { userAuth } = useAuth()!;

  //useRefs
  const toast = useRef<Toast>(null);

  const dt = useRef<DataTable<CargoEntity[]>>(null);

  //useStates
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(
    columns.filter((col: ColumnMeta) => col.show)
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingCargoCreateOrUpdate, setLoadingCargoCreateOrUpdate] =
    useState<boolean>(false);

  const [cargo, setCargo] = useState<CargoEntity>(emptyCargo);

  const [cargos, setCargos] = useState<CargoEntity[]>([]);

  const [selectedCargos, setSelectedCargos] = useState<CargoEntity[]>([]);

  const [cargoDialog, setCargoDialog] = useState<{
    type?: "create" | "update" | undefined;
    state: boolean;
  }>({
    state: false,
  });

  const [removeCargoDialog, setRemoveCargoDialog] = useState<boolean>(false);

  const [removeCargosDialog, setRemoveCargosDialog] = useState<boolean>(false);

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
      <h3 className="m-0">Mantenimiento de Cargos</h3>
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
  const findAllCargo = async () => {
    setLoading(true);
    const cargosFindAll = await findAll();
    setLoading(false);

    if (cargosFindAll?.message.msgId == 0 && cargosFindAll.registro) {
      setCargos(
        Array.isArray(cargosFindAll.registro)
          ? cargosFindAll.registro?.map((af) => {
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
      //     detail: `${cargosFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
      // } else if (cargosFindAll?.message.msgId == 1) {
      //   toast.current?.show({
      //     severity: "error",
      //     detail: `${cargosFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  const createCargo = async () => {
    setSubmitted(true);
    if (cargo.Descripcion.trim()) {
      setLoadingCargoCreateOrUpdate(true);
      let cargoCreate = await create({
        Descripcion: cargo.Descripcion,
        Activo: cargo.Activo,
      });
      setLoadingCargoCreateOrUpdate(false);

      if (cargoCreate?.message.msgId == 0 && cargoCreate.registro) {
        setCargos([...cargos, cargoCreate.registro]);
        toast.current?.show({
          severity: "success",
          detail: `${cargoCreate.message.msgTxt}`,
          life: 3000,
        });
      } else if (cargoCreate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${cargoCreate.message.msgTxt}`,
          life: 3000,
        });
      }

      setCargoDialog({ state: false });
      setCargo(emptyCargo);
    }
  };

  const updateCargo = async () => {
    setSubmitted(true);
    if (cargo.IdCargo) {
      setLoadingCargoCreateOrUpdate(true);
      let cargoUpdate = await update(cargo.IdCargo.toString(), {
        Descripcion: cargo.Descripcion,
        Activo: cargo.Activo,
      });
      setLoadingCargoCreateOrUpdate(false);

      if (cargoUpdate?.message.msgId == 0 && cargoUpdate.registro) {
        setCargos(
          cargos?.map((cargo) =>
            cargo.IdCargo === cargoUpdate?.registro?.IdCargo
              ? { ...cargo, ...cargoUpdate.registro }
              : cargo
          )
        );
        toast.current?.show({
          severity: "success",
          detail: `${cargoUpdate.message.msgTxt}`,
          life: 3000,
        });
      } else if (cargoUpdate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${cargoUpdate.message.msgTxt}`,
          life: 3000,
        });
      }

      setCargoDialog({ state: false });
      setCargo(emptyCargo);
    }
  };

  const removeCargo = async () => {
    if (cargo.IdCargo) {
      let cargoRemove = await remove(cargo.IdCargo.toString());

      if (cargoRemove?.message.msgId == 0 && cargoRemove.registro) {
        setCargos(
          cargos?.filter(
            (cargo) => cargo.IdCargo !== cargoRemove?.registro?.IdCargo
          )
        );
        toast.current?.show({
          severity: "success",
          detail: `${cargoRemove.message.msgTxt}`,
          life: 3000,
        });
      } else if (cargoRemove?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${cargoRemove.message.msgTxt}`,
          life: 3000,
        });
      }

      setRemoveCargoDialog(false);
      setCargo(emptyCargo);
    }
  };

  const removeSelectedCargos = () => {
    let _cargos = cargos.filter(
      (val: CargoEntity) => !selectedCargos?.includes(val)
    );

    setCargos(_cargos);
    setRemoveCargosDialog(false);
    setSelectedCargos([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Cargos Removed",
      life: 3000,
    });
  };

  // templates to dialogs
  const hideDialog = () => {
    setSubmitted(false);
    setCargoDialog({ state: false });
  };

  const showCreateCargoDialog = () => {
    setCargo(emptyCargo);
    setSubmitted(false);
    setCargoDialog({ type: "create", state: true });
  };

  const showUpdateCargoDialog = (cargo: CargoEntity) => {
    setCargo({ ...cargo });
    setCargoDialog({ type: "update", state: true });
  };

  const hideRemoveCargoDialog = () => {
    setRemoveCargoDialog(false);
  };

  const hideRemoveCargosDialog = () => {
    setRemoveCargosDialog(false);
  };

  const confirmRemoveCargo = (cargo: CargoEntity) => {
    setCargo(cargo);
    setRemoveCargoDialog(true);
  };

  const confirmRemoveSelectedCargos = () => {
    setRemoveCargosDialog(true);
  };

  // here
  const findIndexById = (id: string) => {
    let index = -1;

    for (let i = 0; i < cargos.length; i++) {
      if (cargos[i].IdCargo.toString() === id) {
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
    let _cargo = { ...cargo };

    _cargo["Activo"] = e.value;
    setCargo(_cargo);
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";
    let _cargo = { ...cargo };

    // @ts-ignore
    _cargo[name] = val;

    setCargo(_cargo);
  };

  // const onInputTextCargoChange = (
  //   e: React.ChangeEvent<HTMLTextCargoElement>,
  //   name: string
  // ) => {
  //   const val = (e.target && e.target.value) || "";
  //   let _cargo = { ...cargo };

  //   // @ts-ignore
  //   _cargo[name] = val;

  //   setCargo(_cargo);
  // };

  // const onInputNumberChange = (
  //   e: InputNumberValueChangeEvent,
  //   name: string
  // ) => {
  //   const val = e.value ?? 0;
  //   let _cargo = { ...cargo };

  //   // @ts-ignore
  //   _cargo[name] = val;

  //   setCargo(_cargo);
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
          onClick={showCreateCargoDialog}
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
          onClick={findAllCargo}
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
  const activoBodyTemplate = (rowData: CargoEntity) => {
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
  const modifiadoElBodyTemplate = (rowData: CargoEntity) => {
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
  const creadoElBodyTemplate = (rowData: CargoEntity) => {
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
  const actionsBodyTemplate = (rowData: CargoEntity) => {
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
          onClick={() => showUpdateCargoDialog(rowData)}
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
          onClick={() => confirmRemoveCargo(rowData)}
        />
      </div>
    );
  };

  //useEffects
  useEffect(() => {
    findAllCargo();
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
        value={cargos}
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
          "IdCargo",
          "Descripcion",
          "Activo",
          "CreadoEl",
          "CreadoPor",
          "ModificadoEl",
          "ModificadoPor",
        ]}
        emptyMessage={<EmptyMessageData loading={loading} />}
        selectionMode="multiple"
        selection={selectedCargos}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedCargos(e.value);
          }
        }}
        dataKey="IdCargo"
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

      <CargoCreateOrUpdate
        submitted={submitted}
        cargo={cargo}
        cargoDialog={cargoDialog}
        hideDialog={hideDialog}
        createCargo={createCargo}
        updateCargo={updateCargo}
        onInputChange={onInputChange}
        onActivoChange={onActivoChange}
        loadingCargoCreateOrUpdate={loadingCargoCreateOrUpdate}
      />

      <CargoRemove
        cargo={cargo}
        removeCargoDialog={removeCargoDialog}
        hideRemoveCargoDialog={hideRemoveCargoDialog}
        removeCargo={removeCargo}
      />

      <CargosRemove
        cargo={cargo}
        removeCargosDialog={removeCargosDialog}
        hideRemoveCargosDialog={hideRemoveCargosDialog}
        removeSelectedCargos={removeSelectedCargos}
      />
    </div>
  );
};

export default Cargo;
