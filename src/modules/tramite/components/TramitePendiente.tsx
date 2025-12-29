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
import { ColumnMeta } from "../../utils/Interfaces";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";

import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import {
  columnsTramitePendiente,
  defaultFiltersTramitePendiente,
  emptyTramitePendiente,
} from "../utils/Constants";
import EstadoCreateOrUpdate from "./TramiteDestinosModal";
import EstadoRemove from "./EstadoRemove";
import EstadosRemove from "./EstadosRemove";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { delay, formatDate } from "../../utils/Methods";
import { Calendar } from "primereact/calendar";
import EmptyMessageData from "../../utils/shared/EmptyMessageData";
import { UseEsquemaEstado } from "../../esquema-estado/hooks/UseEsquemaEstado";
import { EsquemaEstadoEntity } from "../../esquema-estado/interfaces/EsquemaEstadoInterface";
import { DropdownChangeEvent } from "primereact/dropdown";
import { EstadoEntity } from "../../estado/interfaces/EstadoInterface";
import { emptyEstado } from "../../estado/utils/Constants";
import UseEstado from "../../estado/hooks/UseEstado";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../utils/shared/ConfirmModal";
import TramiteDestinosModal from "./TramiteDestinosModal";
import TramiteDestailsModal from "./TramiteDetailsModal";
import TramiteDetailsModal from "./TramiteDetailsModal";
import UseTramite from "../hooks/UseTramite";
import { useAuth } from "../../auth/context/AuthContext";
import { TramitePendienteEntity } from "../interfaces/TramiteInterface";
import { useTheme } from "../../../ThemeContext";
import { differenceInHours } from "date-fns";

const TramitePendiente = () => {
  // custom hooks
  const { userAuth } = useAuth()!;

  const { create, findAll, findOne, update, remove } = UseEstado();

  const { findAllPendientes, recibir } = UseTramite();

  const { findAll: findAllEsquemaEstado } = UseEsquemaEstado();

  const navigate = useNavigate();

  const { themePrimeFlex, switchTheme } = useTheme();

  //useRefs
  const toast = useRef<Toast>(null);

  const dt = useRef<DataTable<EstadoEntity[]>>(null);

  //useStates
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [filters, setFilters] = useState<DataTableFilterMeta>(
    defaultFiltersTramitePendiente
  );

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(
    columnsTramitePendiente.filter((col: ColumnMeta) => col.show)
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingEstadoCreateOrUpdate, setLoadingEstadoCreateOrUpdate] =
    useState<boolean>(false);

  const [estado, setEstado] = useState<EstadoEntity>(emptyEstado);

  const [tramitePendiente, setTramitePendiente] =
    useState<TramitePendienteEntity>(emptyTramitePendiente);

  const [tramitesPendientes, setTramitesPendientes] = useState<
    TramitePendienteEntity[]
  >([]);

  const [estados, setEstados] = useState<EstadoEntity[]>([]);

  const [selectedTramitesPendientes, setSelectedTramitesPendientes] = useState<
    TramitePendienteEntity[]
  >([]);

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

  const [tramiteDetailsDialog, setTramiteDetailsDialog] =
    useState<boolean>(false);

  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);

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

  const [observaciones, setObservaciones] = useState<string>(" ");

  const startContent = (
    <div className="flex flex-column p-1 gap-2">
      <h3 className="m-0">Trámites pendientes</h3>
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

  // actions CRUD - Tramite (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const recibirTramitesPendintes = async () => {
    setSubmitted(true);
    let idMovimientos = selectedTramitesPendientes.map((stp) => {
      return { IdMovimiento: stp.IdMovimiento };
    });

    const recibirTramitePendintes = await recibir({
      Movimientos: idMovimientos,
      Observaciones: observaciones,
    });

    if (
      recibirTramitePendintes?.message.msgId == 0 &&
      recibirTramitePendintes.registro
    ) {
      let idMovimientosArray = selectedTramitesPendientes.map((stp) => {
        return stp.IdMovimiento;
      });

      setTramitesPendientes(
        tramitesPendientes?.filter(
          (tp) => !idMovimientosArray.includes(tp.IdMovimiento)
        )
      );
      toast.current?.show({
        severity: "success",
        detail: `${recibirTramitePendintes.message.msgTxt}`,
        life: 3000,
      });
    } else if (recibirTramitePendintes?.message.msgId == 1) {
      toast.current?.show({
        severity: "error",
        detail: `${recibirTramitePendintes.message.msgTxt}`,
        life: 3000,
      });
    }

    setTramiteDetailsDialog(false);
    setConfirmDialog(false);
    setObservaciones("");
    setSelectedTramitesPendientes([]);
    setSubmitted(false);
  };

  const findAllTramitePendinte = async () => {
    setLoading(true);
    const tramitesFindAllPendientes = await findAllPendientes({
      IdAreaDestino: userAuth?.Area.IdArea!,
    });
    setLoading(false);

    if (
      tramitesFindAllPendientes?.message.msgId == 0 &&
      tramitesFindAllPendientes.registro
    ) {
      const currentDate = new Date();

      setTramitesPendientes(
        Array.isArray(tramitesFindAllPendientes.registro)
          ? tramitesFindAllPendientes.registro?.map((af) => {
              // TipoTramite: 1 - Interno
              // TipoTramite: 2 - Externo
              const idTipoTramite = af.Tramite.TipoTramite.IdTipoTramite == 1;

              const tpo = af.FechaMovimiento
                ? differenceInHours(currentDate, new Date(af.FechaMovimiento))
                : 0;

              let tpoColor = "";

              if (tpo >= 0 && tpo <= 12) {
                //a tiempo
                tpoColor = "green";
              } else if (tpo >= 13 && tpo <= 24) {
                // accion urgente
                tpoColor = "orage";
              } else {
                // retraso
                tpoColor = "red";
              }

              if (af.HistorialMovimientoxEstado?.[0]?.Estado?.IdEstado == 17) {
                //derivado
                tpoColor = "blue";
              }

              return {
                ...af,
                Detalle:
                  (af.Documento?.TipoDocumento?.Descripcion || "") +
                  " " +
                  (af.Documento?.CodigoReferenciaDoc || "") +
                  " " +
                  (af.Documento?.Folios || "") +
                  " " +
                  (af.Documento?.Asunto || ""),
                Remitente: {
                  NombreCompleto:
                    (af.Tramite.Remitente.Nombres || "") +
                    " " +
                    (af.Tramite.Remitente.ApellidoPaterno || "") +
                    " " +
                    (af.Tramite.Remitente.ApellidoMaterno || ""),
                },
                Origen: idTipoTramite
                  ? af.AreaOrigen.Descripcion || ""
                  : (af.Tramite.TipoTramite.Descripcion || "") +
                    " " +
                    (af.Tramite.Remitente.NroIdentificacion || "") +
                    " " +
                    (af.Tramite.Remitente.Nombres || "") +
                    " " +
                    (af.Tramite.Remitente.ApellidoPaterno || "") +
                    " " +
                    (af.Tramite.Remitente.ApellidoMaterno || ""),
                Motivo_Acciones: af.Motivo + " " + af.Acciones,
                Tpo: tpoColor,
                FechaMovimiento: af.FechaMovimiento
                  ? new Date(af.FechaMovimiento)
                  : null,
              };
            })
          : []
      );
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  // actions CRUD - TramitePendiente (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllEstado = async () => {
    setLoading(true);
    const estadosFindAll = await findAll({
      cantidad_max: "0",
      Language: "ES",
      filters: [
        {
          campo: "0",
          operador: "EQ",
          tipo: "other",
          valor1: "",
          valor2: "",
        },
      ],
    });
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

  // actions CRUD - Esquema TramitePendiente (create, read, update, remove) -> (create, findAll-findOne, update, remove)
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

  const showTramiteDetailsDialog = (
    tramitePendiente: TramitePendienteEntity
  ) => {
    setTramitePendiente(tramitePendiente);
    setTramiteDetailsDialog(true);
  };

  const hideRemoveEstadoDialog = () => {
    setRemoveEstadoDialog(false);
  };

  const hideRemoveEstadosDialog = () => {
    setRemoveEstadosDialog(false);
  };

  const hideTramiteDetailsDialog = () => {
    setSubmitted(false);
    // setMovimiento(emptyMovimiento);
    setTramiteDetailsDialog(false);
  };

  const hideConfirmDialog = () => {
    setConfirmDialog(false);
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

    let orderedSelectedColumns = columnsTramitePendiente.filter((col) =>
      selectedColumns.some((sCol: ColumnMeta) => sCol.field === col.field)
    );
    setVisibleColumns(orderedSelectedColumns);
  };

  const headerDataTable = (
    <div className="flex flex-wrap justify-content-between m-0 p-0">
      <div className="flex flex-wrap justify-content-between gap-2 align-items-center">
        {/* <p className="m-0">Mantemiento de Áreas</p> */}
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
        <Button
          type="button"
          icon="pi pi-refresh"
          severity="info"
          onClick={findAllTramitePendinte}
          style={{
            width: "2rem",
            height: "2rem",
            margin: "auto 0",
            color: "#fff",
          }}
        />
        {(userAuth?.Rol.IdRol == "SUPER_ADMIN" ||
          userAuth?.Rol.IdRol == "ADMIN" ||
          userAuth?.Area?.IdArea === 30) && (
          <Button
            type="button"
            onClick={() => {
              navigate("../tramite/recibido/externo");
            }}
            size="small"
            style={{
              padding: "0",
              width: "10rem",
              height: "2rem",
              margin: "auto 0",
              background: "#293",
              border: "none",
            }}
          >
            <span className="flex justify-content-between gap-2 align-items-center m-auto text-white">
              <i className="pi pi-eject text-sm"></i>
              <span>Recibir Externo</span>
            </span>
          </Button>
        )}

        <Button
          type="button"
          onClick={() => {
            navigate("../tramite/emitido/nuevo");
          }}
          size="small"
          style={{
            padding: "0",
            width: "10rem",
            height: "2rem",
            margin: "auto 0",
            color: "#fff",
          }}
        >
          <span className="flex justify-content-between gap-2 align-items-center m-auto text-white">
            <i className="pi pi-plus text-sm"></i>
            <span>Nuevo trámite</span>
          </span>
        </Button>
        {selectedTramitesPendientes.length > 1 && (
          <Button
            type="button"
            severity="warning"
            onClick={() => {
              setConfirmDialog(true);
            }}
            size="small"
            style={{
              padding: "0",
              width: "10rem",
              height: "2rem",
              margin: "auto 0",
              color: "#fff",
            }}
          >
            <span className="flex justify-content-between gap-2 align-items-center m-auto text-white">
              <i className="pi pi-list-check text-sm"></i>
              <span>Recibir en bloque</span>
            </span>
          </Button>
        )}
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
          options={columnsTramitePendiente}
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

  // templates to column detalle
  const detalleBodyTemplate = (rowData: TramitePendienteEntity) => {
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

  // templates to column IdTramite
  const idTramiteBodyTemplate = (rowData: TramitePendienteEntity) => {
    return (
      <span
        className="hover:underline hover:text-blue-500"
        onClick={() => {
          //call endpoint findone
          //navigate tramite/seguimiento
          navigate(
            `../tramite/seguimiento/${rowData.Tramite?.IdTramite}/${rowData.IdMovimiento}`
          );
        }}
      >
        {rowData.Tramite?.IdTramite.toString().padStart(8, "0")}
      </span>
    );
  };

  // templates to column Origen
  const origenBodyTemplate = (rowData: TramitePendienteEntity) => {
    return (
      <>
        {rowData.Tramite?.TipoTramite.IdTipoTramite == 1 ? (
          <p className="text-sm m-0">
            {`${rowData.AreaOrigen.Descripcion ?? ""}`}
          </p>
        ) : (
          <div className="flex flex-row align-items-center gap-2">
            <div
              className="flex align-items-center justify-content-center text-center border-round-md"
              style={{
                background: themePrimeFlex === "light" ? "#eee" : "#333",
              }}
            >
              <i
                className="pi pi-globe px-2 py-2 "
                style={{
                  color: themePrimeFlex === "light" ? "#ee0a3cff" : "#db3458ff",
                  fontSize: "1.3rem",
                }}
              ></i>
            </div>
            <div className="flex flex-column ">
              <p className="text-sm m-0">
                {rowData.Tramite?.TipoTramite.Descripcion ?? ""}
              </p>
              <span className="text-xs text-color-secondary m-0">
                {rowData.Tramite?.Remitente.NroIdentificacion ?? ""}
                {" | "}
                {rowData.Tramite?.Remitente.Nombres ?? ""}{" "}
                {rowData.Tramite?.Remitente.ApellidoPaterno ?? ""}{" "}
                {rowData.Tramite?.Remitente.ApellidoMaterno ?? ""}
              </span>
            </div>
          </div>
        )}
      </>
    );
  };

  // templates to column Remitente
  const remitenteBodyTemplate = (rowData: TramitePendienteEntity) => {
    return (
      <div className="flex flex-column gap-2">
        <p className="text-sm m-0">
          {rowData.Tramite?.Remitente
            ? `${rowData.Tramite?.Remitente.Nombres ?? ""} ${
                rowData.Tramite?.Remitente.ApellidoPaterno ?? ""
              } ${rowData.Tramite?.Remitente.ApellidoMaterno ?? ""}`
            : ""}
        </p>
      </div>
    );
  };

  // templates to column Motivo_Acciones
  const motivoAccionesBodyTemplate = (rowData: TramitePendienteEntity) => {
    return (
      <div className="flex flex-column gap-2">
        <p className="text-sm m-0">{"SOLO DEPENDENCIA"}</p>
        <span className="text-xs text-color-secondary m-0">
          {rowData.Motivo ?? ""} {rowData.Acciones ?? ""}{" "}
        </span>
      </div>
    );
  };

  // templates to column  Tpo
  const tpoBodyTemplate = (rowData: any) => {
    if (rowData.Tpo == "green") {
    }
    return (
      <p className="text-sm m-0">
        {rowData.Tpo == "green" && (
          <i
            className="pi pi-circle-fill"
            style={{
              color: themePrimeFlex === "light" ? "#0aee97ff" : "#85db34ff",
              fontSize: ".6rem",
            }}
          ></i>
        )}
        {rowData.Tpo == "orange" && (
          <i
            className="ppi pi-circle-fill"
            style={{
              color: themePrimeFlex === "light" ? "#ee9e0aff" : "#dba134ff",
              fontSize: ".6rem",
            }}
          ></i>
        )}
        {rowData.Tpo == "red" && (
          <i
            className="pi pi-circle-fill"
            style={{
              color: themePrimeFlex === "light" ? "#ee0a3cff" : "#db3458ff",
              fontSize: ".6rem",
            }}
          ></i>
        )}
        {rowData.Tpo == "blue" && (
          <i
            className="pi pi-circle-fill"
            style={{
              color: themePrimeFlex === "light" ? "#0a21eeff" : "#343cdbff",
              fontSize: ".6rem",
            }}
          ></i>
        )}
      </p>
    );
  };

  // templates to column  FechaMovimiento
  const fechaMocimientoBodyTemplate = (rowData: TramitePendienteEntity) => {
    return (
      <p className="text-sm m-0">
        {!rowData.FechaMovimiento ? (
          "__"
        ) : (
          <>
            {formatDate(new Date(rowData.FechaMovimiento)).split(",")[0]}
            <br />
            {formatDate(new Date(rowData.FechaMovimiento)).split(",")[1]}
          </>
        )}
      </p>
    );
  };

  const fechaMocimientoFilterTemplate = (
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
  const actionsBodyTemplate = (rowData: TramitePendienteEntity) => {
    return (
      <div style={{ display: "flex", flexWrap: "nowrap" }}>
        <Button
          type="button"
          onClick={() => {
            if (
              selectedTramitesPendientes?.length == 0 ||
              (selectedTramitesPendientes?.length == 1 &&
                selectedTramitesPendientes[0].IdMovimiento ==
                  rowData.IdMovimiento)
            ) {
              if (
                selectedTramitesPendientes.find(
                  (stp) => stp.IdMovimiento == rowData.IdMovimiento
                ) == undefined
              ) {
                setSelectedTramitesPendientes((prev) => [...prev, rowData]);
              }

              showTramiteDetailsDialog(rowData);
            }
          }}
          size="small"
          style={{
            padding: "0",
            width: "6rem",
            height: "2rem",
            margin: "auto 0",
            color: "#fff",
            background: "rgba(24, 61, 161, 1)",
            border: "none",
          }}
        >
          <span className="flex justify-content-between gap-2 align-items-center m-auto text-white">
            <i className="pi pi-download text-sm"></i>
            <span>Recibir</span>
          </span>
        </Button>
      </div>
    );
  };

  //useEffects
  useEffect(() => {
    if (userAuth?.IdUsuario) {
      findAllTramitePendinte();
    }
  }, [userAuth?.IdUsuario]);

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
        value={tramitesPendientes}
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
          "Tramite.IdTramite",
          "Detalle",
          "Origen",
          "Remitente.NombreCompleto",
          "Motivo_Acciones",
          "FechaMovimiento",
        ]}
        emptyMessage={<EmptyMessageData loading={loading} />}
        selectionMode="multiple"
        selection={selectedTramitesPendientes}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedTramitesPendientes(e.value);
          }
        }}
        dataKey="Tramite.IdTramite"
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
          } else if (col.field == "Origen") {
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
                body={origenBodyTemplate}
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
          } else if (col.field == "Motivo_Acciones") {
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
                body={motivoAccionesBodyTemplate}
              />
            );
          } else if (col.field == "FechaMovimiento") {
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
                body={fechaMocimientoBodyTemplate}
                filterElement={fechaMocimientoFilterTemplate}
              />
            );
          } else if (col.field == "Tpo") {
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
                body={tpoBodyTemplate}
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

      <TramiteDetailsModal
        tramitePendiente={tramitePendiente}
        submitted={submitted}
        hideTramiteDetailsDialog={hideTramiteDetailsDialog}
        tramiteDetailsDialog={tramiteDetailsDialog}
        observaciones={observaciones}
        setObservaciones={setObservaciones}
        recibirTramitesPendintes={recibirTramitesPendintes}
        // selectedTramiteDestinos={selectedTramiteDestinos}
        // setSelectedTramiteDestinos={setSelectedTramiteDestinos}
      />

      <ConfirmModal
        submitted={submitted}
        titleModal="Confirmación"
        typeMessage="info"
        message="¿Esta seguro que desea recibir estos trámites?"
        typeButton="info"
        state={confirmDialog}
        hideDialog={hideConfirmDialog}
        callBack={recibirTramitesPendintes}
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

export default TramitePendiente;
