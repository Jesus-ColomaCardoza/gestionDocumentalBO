import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/menuitem";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { useState, useEffect, useRef } from "react";
import { ColumnMeta } from "../../utils/Interfaces";
import { Toast } from "primereact/toast";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { formatDate } from "../../utils/Methods";
import { Calendar } from "primereact/calendar";
import EmptyMessageData from "../../utils/shared/EmptyMessageData";
import { DropdownChangeEvent } from "primereact/dropdown";
import { AreaEntity } from "../../area/interfaces/AreaInterface";
import UseArea from "../../area/hooks/UseArea";
import { emptyUsuario } from "../../usuario/utils/Constants";
import { UsuarioEntity } from "../../usuario/interfaces/UsuarioInterface";
import UseTramite from "../hooks/UseTramite";
import { TramiteEntity } from "../interfaces/TramiteInterface";
import { defaultFilters, columns } from "../utils/Constants";
import { Menu } from "primereact/menu";
import { useNavigate } from "react-router-dom";

const TramiteEmitido = () => {
  // custom hooks
  const { create, findAll, findOne, update, remove } = UseTramite();

  const { findAll: findAllArea } = UseArea();

  const navigate = useNavigate();

  //useRefs
  const toast = useRef<Toast>(null);

  const menuActionsFM = useRef<Menu>(null);

  //useStates
  const [itemsMenuActionsFM, setItemsMenuActionsFM] = useState<MenuItem[]>([]);

  const [submitted, setSubmitted] = useState<boolean>(false);

  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(
    columns.filter((col: ColumnMeta) => col.show)
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingUsuarioCreateOrUpdate, setLoadingUsuarioCreateOrUpdate] =
    useState<boolean>(false);

  const [usuario, setUsuario] = useState<UsuarioEntity>(emptyUsuario);

  const [tramites, setTramites] = useState<TramiteEntity[]>([]);

  const [selectedTramites, setSelectedTramites] = useState<TramiteEntity[]>([]);

  const [areas, setAreas] = useState<
    Pick<AreaEntity, "IdArea" | "Descripcion">[]
  >([]);

  const [usuarioDialog, setUsuarioDialog] = useState<{
    type?: "create" | "update" | undefined;
    state: boolean;
  }>({
    state: false,
  });

  const [removeUsuarioDialog, setRemoveUsuarioDialog] =
    useState<boolean>(false);

  const [removeUsuariosDialog, setRemoveUsuariosDialog] =
    useState<boolean>(false);

  const startContent = (
    <div className="flex flex-column p-1 gap-2">
      <h3 className="m-0">Trámites Emitidos</h3>
      {/* <div>
        <Button label="Nuevo" icon="pi pi-plus" className=" p-2 " outlined />
      </div> */}
    </div>
  );

  // actions CRUD - Tramite (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllTramite = async () => {
    setLoading(true);
    const tramitesFindAll = await findAll();
    setLoading(false);

    if (tramitesFindAll?.message.msgId == 0 && tramitesFindAll.registro) {
      //gg
      setTramites(
        Array.isArray(tramitesFindAll.registro)
          ? tramitesFindAll.registro?.map((af) => {
              return {
                ...af,
                FechaInicio: af.FechaInicio ? new Date(af.FechaInicio) : null,
                Detalle:
                  (af.Documento?.TipoDocumento?.Descripcion || "") +
                  " " +
                  (af.Documento?.CodigoReferenciaDoc || "") +
                  " " +
                  (af.Documento?.Folios || "") +
                  " " +
                  (af.Documento?.Asunto || ""),
                Remitente: {
                  ...af.Remitente,
                  NombreCompleto:
                    (af.Remitente?.Nombres || "") +
                    " " +
                    (af.Remitente?.ApellidoPaterno || "") +
                    " " +
                    (af.Remitente?.ApellidoMaterno || ""),
                },
                Destinos:
                  (af.Movimiento?.length || 0) > 1
                    ? `Múltiples destinos(${af.Movimiento?.length})`
                    : af.Movimiento?.[0]
                    ? af.Movimiento[0].AreaDestino.Descripcion
                    : "Sin destino",
              };
            })
          : []
      );
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  // actions CRUD - Area (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllAreaCombox = async () => {
    setLoading(true);
    const areasFindAll = await findAllArea();
    setLoading(false);

    if (areasFindAll?.message.msgId == 0 && areasFindAll.registro) {
      setAreas(
        Array.isArray(areasFindAll.registro)
          ? areasFindAll.registro?.map((af) => {
              return {
                IdArea: af.IdArea,
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
    setUsuarioDialog({ state: false });
  };

  const showCreateUsuarioDialog = () => {
    setUsuario(emptyUsuario);
    setSubmitted(false);
    setUsuarioDialog({ type: "create", state: true });
  };

  const showUpdateUsuarioDialog = (usuario: UsuarioEntity) => {
    setUsuario({ ...usuario });
    setUsuarioDialog({ type: "update", state: true });
  };

  const hideRemoveUsuarioDialog = () => {
    setRemoveUsuarioDialog(false);
  };

  const hideRemoveUsuariosDialog = () => {
    setRemoveUsuariosDialog(false);
  };

  const confirmRemoveUsuario = (usuario: UsuarioEntity) => {
    setUsuario(usuario);
    setRemoveUsuarioDialog(true);
  };

  const confirmRemoveSelectedTramites = () => {
    setRemoveUsuariosDialog(true);
  };

  const onActivoChange = (e: RadioButtonChangeEvent) => {
    let _usuario = { ...usuario };

    _usuario["Activo"] = e.value;
    setUsuario(_usuario);
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";

    let _usuario: any = { ...usuario };

    _usuario[name] = val;

    setUsuario(_usuario);
  };

  const onDropdownChange = (
    e: DropdownChangeEvent,
    nameFK: string,
    nameObj: string
  ) => {
    const val = (e.target && e.target.value) || "";

    let _usuario: any = { ...usuario };

    _usuario[nameFK] = val[nameFK];
    _usuario[nameObj] = { ...val };

    setUsuario(_usuario);
  };

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
          onClick={() => {
            navigate("./nuevo");
          }}
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
          onClick={findAllTramite}
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

  // templates to column IdTramite
  const idTramiteBodyTemplate = (rowData: TramiteEntity) => {
    return (
      <span
        className="hover:underline hover:text-blue-500"
        onClick={() => {
          //call endpoint findone
          //navigate tramite/seguimiento
          navigate("../tramite/seguimiento");
        }}
      >
        {rowData.IdTramite.toString().padStart(6, "0")}
      </span>
    );
  };

  // templates to column detalle
  const detalleBodyTemplate = (rowData: TramiteEntity) => {
    return (
      <div className="flex flex-column gap-2">
        <p className="text-sm m-0">
          {rowData.Documento
            ? `${
                rowData.Documento.TipoDocumento?.Descripcion?.substring(0, 3) ??
                "Doc"
              }. ${rowData.Documento.CodigoReferenciaDoc ?? ""} [${
                rowData.Documento.Folios ?? 0
              } Folio(s)]`
            : ""}
        </p>
        <span className="text-xs text-color-secondary m-0">
          {rowData.Documento?.Asunto || ""}
        </span>
      </div>
    );
  };

  // templates to column Usuario
  const remitenteBodyTemplate = (rowData: TramiteEntity) => {
    return (
      <div className="flex flex-column gap-2">
        <p className="text-sm m-0">
          {rowData.Remitente
            ? `${rowData.Remitente.Nombres ?? ""} ${
                rowData.Remitente.ApellidoPaterno ?? ""
              } ${rowData.Remitente.ApellidoMaterno ?? ""}`
            : ""}
        </p>
      </div>
    );
  };

  // templates to column area
  const areaBodyTemplate = (rowData: TramiteEntity) => {
    return (
      <div className="flex align-items-center gap-2">
        <p className="text-sm m-0">{rowData.Area?.Descripcion}</p>
      </div>
    );
  };

  const areaFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <>
        <div className="mb-3 text-sm w-12rem">Area Picker</div>
        <MultiSelect
          value={options.value}
          options={areas}
          itemTemplate={(option: AreaEntity) => {
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

  // templates to column  FechaInicio
  const fechaInicioBodyTemplate = (rowData: TramiteEntity) => {
    return (
      <p className="text-sm m-0">
        {!rowData.FechaInicio
          ? "__"
          : formatDate(new Date(rowData.FechaInicio))}
      </p>
    );
  };

  const fechaInicioFilterTemplate = (
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
  const getItemsMenuActionsFM = (rowData: TramiteEntity): MenuItem[] => {
    return [
      {
        label: "Editar",
        icon: "pi pi-pencil",
        command: () => {},
      },
      {
        label: "Mover",
        icon: "pi pi-send",
        command: () => {},
      },
      {
        label: "Eliminar",
        icon: "pi pi-trash",
      },
      { label: "Compartir", icon: "pi pi-user-plus", disabled: true },
    ];
  };

  const actionsBodyTemplate = (rowData: TramiteEntity) => {
    return (
      <>
        <Menu
          model={itemsMenuActionsFM}
          popup
          ref={menuActionsFM}
          id="popup_menu_right"
          popupAlignment="right"
        />
        <Button
          icon="pi pi-bars"
          className="mr-2"
          onClick={(event) => {
            setItemsMenuActionsFM(getItemsMenuActionsFM(rowData));
            menuActionsFM.current?.toggle(event);
          }}
          aria-controls="popup_menu_right"
          aria-haspopup
          text
          size="small"
          severity="secondary"
        />
      </>
    );
  };

  //useEffects
  useEffect(() => {
    findAllTramite();
    findAllAreaCombox();
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
      />

      <DataTable
        value={tramites}
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
          "IdTramite",
          "Detalle",
          "Remitente.NombreCompleto",
          "Destinos",
          "Area.Descripcion",
          "FechaInicio",
        ]}
        emptyMessage={<EmptyMessageData loading={loading} />}
        selectionMode="multiple"
        selection={selectedTramites}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedTramites(e.value);
          }
        }}
        dataKey="IdTramite"
        selectionPageOnly
        // loading={loading}
      >
        <Column
          selectionMode="multiple"
          exportable={false}
          headerStyle={{ width: "0%" }}
        />
        {visibleColumns.map((col) => {
          if (col.field == "Detalle") {
            return (
              <Column
                key={col.field}
                field={col.filterField}
                filterField={col.filterField}
                sortField={col.filterField}
                header={col.header}
                dataType={col.dataType}
                sortable
                style={{ width: col.width, padding: 5 }}
                filter
                filterPlaceholder={col.filterPlaceholder}
                body={detalleBodyTemplate}
              />
            );
          } else if (col.field == "IdTramite") {
            return (
              <Column
                key={col.field}
                field={col.field}
                filterField={col.filterField}
                sortField={col.filterField}
                header={col.header}
                dataType={col.dataType}
                sortable
                style={{ width: col.width, padding: 5 }}
                filter
                filterPlaceholder={col.filterPlaceholder}
                body={idTramiteBodyTemplate}
              />
            );
          } else if (col.field == "Remitente") {
            return (
              <Column
                key={col.field}
                field={col.field}
                filterField={col.filterField}
                sortField={col.filterField}
                header={col.header}
                dataType={col.dataType}
                sortable
                style={{ width: col.width, padding: 5 }}
                filter
                filterPlaceholder={col.filterPlaceholder}
                body={remitenteBodyTemplate}
              />
            );
          } else if (col.field == "Area") {
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
                body={areaBodyTemplate}
                filterElement={areaFilterTemplate}
              />
            );
          } else if (col.field == "FechaInicio") {
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
                body={fechaInicioBodyTemplate}
                filterElement={fechaInicioFilterTemplate}
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
    </div>
  );
};

export default TramiteEmitido;
