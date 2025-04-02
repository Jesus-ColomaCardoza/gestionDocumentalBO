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
import UseArea from "../hooks/UseArea";
import { ColumnMeta } from "../../utils/Interfaces";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import {
  AreaCreate,
  AreaEntity,
  AreaOut,
  AreasOut,
} from "../interfaces/AreaInterface";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { columns, defaultFilters, emptyArea } from "../utils/Constants";
import AreaCreateOrUpdate from "./AreaCreateOrUpdate";
import AreaRemove from "./AreaRemove";
import AreasRemove from "./AreasRemove";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { formatDate } from "../../utils/Methods";
import { Calendar } from "primereact/calendar";
import EmptyMessageData from "../../utils/shared/EmptyMessageData";

const Area = () => {
  // custom hooks
  const { create, findAll, findOne, update, remove } = UseArea();

  //useRefs
  const toast = useRef<Toast>(null);

  const dt = useRef<DataTable<AreaEntity[]>>(null);

  //useStates
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(
    columns.filter((col: ColumnMeta) => col.show)
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingAreaCreateOrUpdate, setLoadingAreaCreateOrUpdate] =
    useState<boolean>(false);

  const [area, setArea] = useState<AreaEntity>(emptyArea);

  const [areas, setAreas] = useState<AreaEntity[]>([]);

  const [selectedAreas, setSelectedAreas] = useState<AreaEntity[]>([]);

  const [areaDialog, setAreaDialog] = useState<{
    type?: "create" | "update" | undefined;
    state: boolean;
  }>({
    state: false,
  });

  const [removeAreaDialog, setRemoveAreaDialog] = useState<boolean>(false);

  const [removeAreasDialog, setRemoveAreasDialog] = useState<boolean>(false);

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
      <h3 className="m-0">Mantenimineto de Áreas</h3>
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
  const findAllArea = async () => {
    setLoading(true);
    const areasFindAll = await findAll();
    setLoading(false);

    if (areasFindAll?.message.msgId == 0 && areasFindAll.registro) {
      setAreas(
        Array.isArray(areasFindAll.registro)
          ? areasFindAll.registro?.map((af) => {
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
      //     detail: `${areasFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
      // } else if (areasFindAll?.message.msgId == 1) {
      //   toast.current?.show({
      //     severity: "error",
      //     detail: `${areasFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  const createArea = async () => {
    setSubmitted(true);
    if (area.Descripcion.trim()) {
      setLoadingAreaCreateOrUpdate(true);
      let areaCreate = await create({
        Descripcion: area.Descripcion,
        Activo: area.Activo,
      });
      setLoadingAreaCreateOrUpdate(false);

      if (areaCreate?.message.msgId == 0 && areaCreate.registro) {
        setAreas([...areas, areaCreate.registro]);
        toast.current?.show({
          severity: "success",
          detail: `${areaCreate.message.msgTxt}`,
          life: 3000,
        });
      } else if (areaCreate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${areaCreate.message.msgTxt}`,
          life: 3000,
        });
      }

      setAreaDialog({ state: false });
      setArea(emptyArea);
    }
  };

  const updateArea = async () => {
    setSubmitted(true);
    if (area.IdArea) {
      setLoadingAreaCreateOrUpdate(true);
      let areaUpdate = await update(area.IdArea.toString(), {
        Descripcion: area.Descripcion,
        Activo: area.Activo,
      });
      setLoadingAreaCreateOrUpdate(false);

      if (areaUpdate?.message.msgId == 0 && areaUpdate.registro) {
        setAreas(
          areas?.map((area) =>
            area.IdArea === areaUpdate?.registro?.IdArea
              ? { ...area, ...areaUpdate.registro }
              : area
          )
        );
        toast.current?.show({
          severity: "success",
          detail: `${areaUpdate.message.msgTxt}`,
          life: 3000,
        });
      } else if (areaUpdate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${areaUpdate.message.msgTxt}`,
          life: 3000,
        });
      }

      setAreaDialog({ state: false });
      setArea(emptyArea);
    }
  };

  const removeArea = async () => {
    if (area.IdArea) {
      let areaRemove = await remove(area.IdArea.toString());

      if (areaRemove?.message.msgId == 0 && areaRemove.registro) {
        setAreas(
          areas?.filter((area) => area.IdArea !== areaRemove?.registro?.IdArea)
        );
        toast.current?.show({
          severity: "success",
          detail: `${areaRemove.message.msgTxt}`,
          life: 3000,
        });
      } else if (areaRemove?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${areaRemove.message.msgTxt}`,
          life: 3000,
        });
      }

      setRemoveAreaDialog(false);
      setArea(emptyArea);
    }
  };

  const removeSelectedAreas = () => {
    let _areas = areas.filter(
      (val: AreaEntity) => !selectedAreas.includes(val)
    );

    setAreas(_areas);
    setRemoveAreasDialog(false);
    setSelectedAreas([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Areas Removed",
      life: 3000,
    });
  };

  // templates to dialogs
  const hideDialog = () => {
    setSubmitted(false);
    setAreaDialog({ state: false });
  };

  const showCreateAreaDialog = () => {
    setArea(emptyArea);
    setSubmitted(false);
    setAreaDialog({ type: "create", state: true });
  };

  const showUpdateAreaDialog = (area: AreaEntity) => {
    setArea({ ...area });
    setAreaDialog({ type: "update", state: true });
  };

  const hideRemoveAreaDialog = () => {
    setRemoveAreaDialog(false);
  };

  const hideRemoveAreasDialog = () => {
    setRemoveAreasDialog(false);
  };

  const confirmRemoveArea = (area: AreaEntity) => {
    setArea(area);
    setRemoveAreaDialog(true);
  };

  const confirmRemoveSelectedAreas = () => {
    setRemoveAreasDialog(true);
  };

  // here
  const findIndexById = (id: string) => {
    let index = -1;

    for (let i = 0; i < areas.length; i++) {
      if (areas[i].IdArea.toString() === id) {
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

  const onCategoryChange = (e: RadioButtonChangeEvent) => {
    let _area = { ...area };

    _area["Activo"] = e.value;
    setArea(_area);
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";
    let _area = { ...area };

    // @ts-ignore
    _area[name] = val;

    setArea(_area);
  };

  // const onInputTextAreaChange = (
  //   e: React.ChangeEvent<HTMLTextAreaElement>,
  //   name: string
  // ) => {
  //   const val = (e.target && e.target.value) || "";
  //   let _area = { ...area };

  //   // @ts-ignore
  //   _area[name] = val;

  //   setArea(_area);
  // };

  // const onInputNumberChange = (
  //   e: InputNumberValueChangeEvent,
  //   name: string
  // ) => {
  //   const val = e.value ?? 0;
  //   let _area = { ...area };

  //   // @ts-ignore
  //   _area[name] = val;

  //   setArea(_area);
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
          onClick={showCreateAreaDialog}
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
          onClick={findAllArea}
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
  const activoBodyTemplate = (rowData: AreaEntity) => {
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
  const modifiadoElBodyTemplate = (rowData: AreaEntity) => {
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
  const creadoElBodyTemplate = (rowData: AreaEntity) => {
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
  const actionsBodyTemplate = (rowData: AreaEntity) => {
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
          onClick={() => showUpdateAreaDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          style={{
            width: "2rem",
            height: "1rem",
            color: "#fff",
          }}
          onClick={() => confirmRemoveArea(rowData)}
        />
      </div>
    );
  };

  //useEffects
  useEffect(() => {
    findAllArea();
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
        value={areas}
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
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        filters={filters}
        globalFilterFields={[
          "IdArea",
          "Descripcion",
          "Activo",
          "CreadoEl",
          "CreadoPor",
          "ModificadoEl",
          "ModificadoPor",
        ]}
        emptyMessage={<EmptyMessageData loading={loading} />}
        selectionMode="single"
        // loading={loading}
      >
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

      <AreaCreateOrUpdate
        submitted={submitted}
        area={area}
        areaDialog={areaDialog}
        hideDialog={hideDialog}
        createArea={createArea}
        updateArea={updateArea}
        onInputChange={onInputChange}
        onCategoryChange={onCategoryChange}
        loadingAreaCreateOrUpdate={loadingAreaCreateOrUpdate}
      />

      <AreaRemove
        area={area}
        removeAreaDialog={removeAreaDialog}
        hideRemoveAreaDialog={hideRemoveAreaDialog}
        removeArea={removeArea}
      />

      <AreasRemove
        area={area}
        removeAreasDialog={removeAreasDialog}
        hideRemoveAreasDialog={hideRemoveAreasDialog}
        removeSelectedAreas={removeSelectedAreas}
      />
    </div>
  );
};

export default Area;
