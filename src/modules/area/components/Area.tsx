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
import {
  useState,
  useEffect,
  useRef,
  // ChangeEvent
} from "react";
import UseArea from "../hooks/UseArea";
import { ColumnMeta } from "../../utils/Interfaces";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import { AreaInterface } from "../interfaces/AreaInterface";
import { classNames } from "primereact/utils";
// import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
// import {
//   InputNumber,
//   InputNumberValueChangeEvent,
// } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";

const Area = () => {
  const columns: ColumnMeta[] = [
    {
      field: "IdArea",
      header: "IdArea",
      dataType: "numeric",
      width: "5%",
      show: true,
      filterPlaceholder: "Buscar por IdArea",
    },
    {
      field: "Descripcion",
      header: "Descripcion",
      dataType: "text",
      width: "30%",
      show: true,
      filterPlaceholder: "Buscar por Descripcion",
    },
    {
      field: "Activo",
      header: "Activo",
      dataType: "boolean",
      width: "5%",
      show: true,
      filterPlaceholder: "Buscar por Activo",
    },
    {
      field: "CreadoEl",
      header: "CreadoEl",
      dataType: "date",
      width: "15%",
      show: false,
      filterPlaceholder: "Buscar por CreadoEl",
    },
    {
      field: "CreadoPor",
      header: "CreadoPor",
      dataType: "text",
      width: "10%",
      show: false,
      filterPlaceholder: "Buscar por CreadoPor",
    },
    {
      field: "ModificadoEl",
      header: "ModificadoEl",
      dataType: "date",
      width: "15%",
      show: false,
      filterPlaceholder: "Buscar por ModificadoEl ",
    },
    {
      field: "ModificadoPor",
      header: "ModificadoPor",
      dataType: "text",
      width: "10%",
      show: false,
      filterPlaceholder: "Buscar por ModificadoPor ",
    },
  ];

  const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },

    IdArea: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    Descripcion: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    Activo: { value: null, matchMode: FilterMatchMode.EQUALS },
    CreadoEl: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    CreadoPor: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    ModificadoEl: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    ModificadoPor: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  };

  let emptyArea: AreaInterface = {
    IdArea: 0,
    Descripcion: "",
    Activo: false,
    CreadoEl: new Date(),
    CreadoPor: "",
    ModificadoEl: new Date(),
    ModificadoPor: "",
  };

  // custom hooks
  const { dataArea, findAll } = UseArea();

  //useRefs
  const toast = useRef<Toast>(null);

  const dt = useRef<DataTable<AreaInterface[]>>(null);

  //useStates
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(
    columns.filter((col: ColumnMeta) => col.show)
  );

  const [loading, setLoading] = useState<boolean>(false);

  const [area, setArea] = useState<AreaInterface>(emptyArea);

  const [areas, setAreas] = useState<AreaInterface[]>([]);

  const [selectedAreas, setSelectedAreas] = useState<AreaInterface[]>([]);

  const [areaDialog, setAreaDialog] = useState<boolean>(false);

  const [deleteAreaDialog, setDeleteAreaDialog] = useState<boolean>(false);

  const [deleteAreasDialog, setDeleteAreasDialog] = useState<boolean>(false);

  // templates to component Toolbar
  const items: MenuItem[] = [
    {
      label: "Update",
      icon: "pi pi-refresh",
    },
    {
      label: "Delete",
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

  // templates to dialog

  const openNew = () => {
    setArea(emptyArea);
    setSubmitted(false);
    setAreaDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setAreaDialog(false);
  };

  const hideDeleteAreaDialog = () => {
    setDeleteAreaDialog(false);
  };

  const hideDeleteAreasDialog = () => {
    setDeleteAreasDialog(false);
  };

  const saveArea = () => {
    setSubmitted(true);

    if (area.Descripcion.trim()) {
      let _areas = [...areas];
      let _area = { ...area };

      if (area.IdArea) {
        const index = findIndexById(area.IdArea.toString());

        _areas[index] = _area;
        toast.current?.show({
          severity: "info",
          // summary: "Successful",
          detail: "Área actualizada",
          life: 3000,
        });
      } else {
        // _area.IdArea = createId();
        // _area.image = "area-placeholder.svg";
        _areas.push(_area);
        toast.current?.show({
          severity: "success",
          // summary: "Successful",
          detail: "Área creada",
          life: 3000,
        });
      }

      setAreas(_areas);
      setAreaDialog(false);
      setArea(emptyArea);
    }
  };

  const editArea = (area: AreaInterface) => {
    setArea({ ...area });
    setAreaDialog(true);
  };

  const confirmDeleteArea = (area: AreaInterface) => {
    setArea(area);
    setDeleteAreaDialog(true);
  };

  const deleteArea = () => {
    let _areas = areas.filter(
      (val: AreaInterface) => val.IdArea !== area.IdArea
    );

    setAreas(_areas);
    setDeleteAreaDialog(false);
    setArea(emptyArea);
    toast.current?.show({
      severity: "error",
      // summary: "Successful",
      detail: "Área eliminada",
      life: 3000,
    });
  };

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

  const confirmDeleteSelected = () => {
    setDeleteAreasDialog(true);
  };

  const deleteSelectedAreas = () => {
    let _areas = areas.filter(
      (val: AreaInterface) => !selectedAreas.includes(val)
    );

    setAreas(_areas);
    setDeleteAreasDialog(false);
    setSelectedAreas([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Areas Deleted",
      life: 3000,
    });
  };

  const areaDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveArea} />
    </>
  );

  const deleteAreaDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteAreaDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteArea}
      />
    </>
  );

  const deleteAreasDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteAreasDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedAreas}
      />
    </>
  );

  // const onCategoryChange = (e: RadioButtonChangeEvent) => {
  //   let _area = { ...area };

  //   _area["category"] = e.value;
  //   setArea(_area);
  // };

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
    setFilters(defaultFilters);
    setGlobalFilterValue("");
  };

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onColumnToggle = (event: MultiSelectChangeEvent) => {
    let selectedColumns = event.value;
    console.log(selectedColumns);

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
          onClick={openNew}
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
          onClick={findAll}
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

  const emptyMessageDataTable = (
    <div style={{ width: "100%", textAlign: "center" }}>No hay registros</div>
  );

  // templates to column Activo
  const activoBodyTemplate = (rowData: AreaInterface) => {
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

  // templates to actions update and delete on dataTable
  const actionBodyTemplate = (rowData: AreaInterface) => {
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
          onClick={() => editArea(rowData)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          style={{
            width: "2rem",
            height: "1rem",
            color: "#fff",
          }}
          onClick={() => confirmDeleteArea(rowData)}
        />
      </div>
    );
  };  

  //useEffects
  useEffect(() => {
    findAll();
    setLoading(false);
  }, []);

  return (
    <div className="card">
      <Toast ref={toast}  
      position={"bottom-right"}
      />

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
        value={dataArea}
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
        emptyMessage={emptyMessageDataTable}
        selectionMode="single"
        loading={loading}
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
                style={{ width: col.width, padding:10 }}
                filter
                filterPlaceholder={col.filterPlaceholder}
                body={activoBodyTemplate}
                filterElement={activoFilterTemplate}
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
                style={{ width: col.width, padding:10 }}
                filter
                filterPlaceholder={col.filterPlaceholder}
              />
            );
          }
        })}
        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ width: "5%", padding: 10 }}
        ></Column>
      </DataTable>

      <Dialog
        visible={areaDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Área Detalles"
        modal
        className="p-fluid"
        footer={areaDialogFooter}
        onHide={hideDialog}
      >
        {/* {area.image && (
          <img
            src={`https://primefaces.org/cdn/primereact/images/area/${area.image}`}
            alt={area.image}
            className="area-image block m-auto pb-3"
          />
        )} */}
        <div className="field">
          <label htmlFor="Descripcion" className="font-bold">
            Descripción
          </label>
          <InputText
            id="Descripcion"
            value={area.Descripcion}
            onChange={(e) => onInputChange(e, "Descripcion")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !area.Descripcion,
            })}
          />
          {submitted && !area.Descripcion && (
            <small className="p-error">Name is required.</small>
          )}
        </div>
        {/* <div className="field">
          <label htmlFor="description" className="font-bold">
            Description
          </label>
          <InputTextarea
            id="description"
            value={area.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              onInputTextAreaChange(e, "description")
            }
            required
            rows={3}
            cols={20}
          />
        </div>

        <div className="field">
          <label className="mb-3 font-bold">Category</label>
          <div className="formgrid grid">
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="category1"
                name="category"
                value="Accessories"
                onChange={onCategoryChange}
                checked={area.category === "Accessories"}
              />
              <label htmlFor="category1">Accessories</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="category2"
                name="category"
                value="Clothing"
                onChange={onCategoryChange}
                checked={area.category === "Clothing"}
              />
              <label htmlFor="category2">Clothing</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="category3"
                name="category"
                value="Electronics"
                onChange={onCategoryChange}
                checked={area.category === "Electronics"}
              />
              <label htmlFor="category3">Electronics</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="category4"
                name="category"
                value="Fitness"
                onChange={onCategoryChange}
                checked={area.category === "Fitness"}
              />
              <label htmlFor="category4">Fitness</label>
            </div>
          </div>
        </div>

        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="price" className="font-bold">
              Price
            </label>
            <InputNumber
              id="price"
              value={area.price}
              onValueChange={(e) => onInputNumberChange(e, "price")}
              mode="currency"
              currency="USD"
              locale="en-US"
            />
          </div>
          <div className="field col">
            <label htmlFor="quantity" className="font-bold">
              Quantity
            </label>
            <InputNumber
              id="quantity"
              value={area.quantity}
              onValueChange={(e) => onInputNumberChange(e, "quantity")}
            />
          </div>
        </div> */}
      </Dialog>

      <Dialog
        visible={deleteAreaDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirmación"
        modal
        footer={deleteAreaDialogFooter}
        onHide={hideDeleteAreaDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {area && (
            <span>
              Are you sure you want to delete <b>{area.Descripcion}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteAreasDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirmación"
        modal
        footer={deleteAreasDialogFooter}
        onHide={hideDeleteAreasDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {area && (
            <span>Are you sure you want to delete the selected areas?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default Area;
