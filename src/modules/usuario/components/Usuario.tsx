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
import UseUsuario from "../hooks/UseUsuario";
import { ColumnMeta } from "../../utils/Interfaces";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import { UsuarioEntity } from "../interfaces/UsuarioInterface";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { columns, defaultFilters, emptyUsuario } from "../utils/Constants";
import UsuarioCreateOrUpdate from "./UsuarioCreateOrUpdate";
import UsuarioRemove from "./UsuarioRemove";
import UsuariosRemove from "./UsuariosRemove";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { formatDate } from "../../utils/Methods";
import { Calendar } from "primereact/calendar";
import EmptyMessageData from "../../utils/shared/EmptyMessageData";
import { DropdownChangeEvent } from "primereact/dropdown";
import { TipoIdentificacionEntity } from "../../tipo-identificacion/interfaces/TipoIdentificacionInterface";
import UseTipoIdentificacion from "../../tipo-identificacion/hooks/UseTipoIdentificacion";
import { TipoUsuarioEntity } from "../../tipo-usuario/interfaces/TipoUsuarioInterface";
import { RolEntity } from "../../rol/interfaces/RolInterface";
import { CargoEntity } from "../../cargo/interfaces/CargoInterface";
import { AreaEntity } from "../../area/interfaces/AreaInterface";
import UseArea from "../../area/hooks/UseArea";
import UseCargo from "../../cargo/hooks/UseCargo";
import UseRol from "../../rol/hooks/UseRol";
import UseTipoUsuario from "../../tipo-usuario/hooks/UseTipoUsuario";
import { REACT_APP_SALT } from "../../utils/Constants";
import { sha256 } from "js-sha256";
import { useAuth } from "../../auth/context/AuthContext";

const Usuario = () => {
  // custom hooks
  const { create, findAll, findOne, update, remove } = UseUsuario();

  const { userAuth } = useAuth()!;

  const { findAll: findAllTipoIdentificacion } = UseTipoIdentificacion();

  const { findAll: findAllTipoUsuario } = UseTipoUsuario();

  const { findAll: findAllRol } = UseRol();

  const { findAll: findAllCargo } = UseCargo();

  const { findAll: findAllArea } = UseArea();

  //useRefs
  const toast = useRef<Toast>(null);

  const dt = useRef<DataTable<UsuarioEntity[]>>(null);

  //useStates
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

  const [usuarios, setUsuarios] = useState<UsuarioEntity[]>([]);

  const [selectedUsuarios, setSelectedUsuarios] = useState<UsuarioEntity[]>([]);

  const [tiposIdentificacion, setTiposIdentificacion] = useState<
    Pick<TipoIdentificacionEntity, "IdTipoIdentificacion" | "Descripcion">[]
  >([]);

  const [tiposUsuario, setTiposUsuario] = useState<
    Pick<TipoUsuarioEntity, "IdTipoUsuario" | "Descripcion">[]
  >([]);

  const [roles, setRoles] = useState<
    Pick<RolEntity, "IdRol" | "Descripcion">[]
  >([]);

  const [cargos, setCargos] = useState<
    Pick<CargoEntity, "IdCargo" | "Descripcion">[]
  >([]);

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
      <h3 className="m-0">Mantenimiento de Usuarios</h3>
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

  // actions CRUD - Usuario (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllUsuario = async () => {
    setLoading(true);
    const usuariosFindAll = await findAll({
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

    if (usuariosFindAll?.message.msgId == 0 && usuariosFindAll.registro) {
      setUsuarios(
        Array.isArray(usuariosFindAll.registro)
          ? usuariosFindAll.registro?.map((af) => {
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
      //     detail: `${usuariosFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
      // } else if (usuariosFindAll?.message.msgId == 1) {
      //   toast.current?.show({
      //     severity: "error",
      //     detail: `${usuariosFindAll.message.msgTxt}`,
      //     life: 3000,
      //   });
    }

    setLoading(false);
    onGlobalFilterChange();
  };

  const createUsuario = async () => {
    setSubmitted(true);
    if (
      usuario.Nombres.trim() &&
      // usuario.ApellidoPaterno.trim() &&
      // usuario.ApellidoMaterno.trim() &&
      usuario.Email.trim() &&
      usuario.Contrasena.trim() &&
      // usuario.Genero.trim() &&
      // usuario.IdTipoIdentificacion != 0 &&
      usuario.IdTipoUsuario != 0 &&
      usuario.IdRol != "" &&
      usuario.IdCargo != 0 &&
      usuario.IdArea != 0
    ) {
      const hashedPassword = sha256(
        REACT_APP_SALT + sha256(usuario.Contrasena)
      );

      setLoadingUsuarioCreateOrUpdate(true);
      let usuarioCreate = await create({
        Nombres: usuario.Nombres,
        ApellidoPaterno: usuario.ApellidoPaterno,
        ApellidoMaterno: usuario.ApellidoMaterno,
        FechaNacimiento: usuario.FechaNacimiento
          ? new Date(usuario.FechaNacimiento)
          : null,
        Email: usuario.Email,
        Contrasena: hashedPassword,
        Celular: usuario.Celular,
        Genero: usuario.Genero,
        RazonSocial: usuario.RazonSocial,
        Direccion: usuario.Direccion,
        IdTipoIdentificacion:
          usuario.IdTipoIdentificacion == 0
            ? null
            : usuario.IdTipoIdentificacion,
        NroIdentificacion: usuario.NroIdentificacion,
        IdTipoUsuario: usuario.IdTipoUsuario,
        IdRol: usuario.IdRol,
        IdCargo: usuario.IdCargo,
        IdArea: usuario.IdArea,
        CodigoConfirmacion: usuario.CodigoConfirmacion,
        // UrlBase: usuario.UrlBase,
        // FormatoFotoPerfil: usuario.FormatoFotoPerfil,
        // NombreFotoPerfil: usuario.NombreFotoPerfil,
        // SizeFotoPerfil: usuario.SizeFotoPerfil,
        // UrlFotoPerfil: usuario.UrlFotoPerfil,
        FotoPerfilNombre: usuario.FotoPerfilNombre,
        FotoPerfilBase64: usuario.FotoPerfilBase64,
        CodigoConfirmacionExp: usuario.CodigoConfirmacionExp,
        Activo: usuario.Activo,
      });
      setLoadingUsuarioCreateOrUpdate(false);

      if (usuarioCreate?.message.msgId == 0 && usuarioCreate.registro) {
        setUsuarios([...usuarios, usuarioCreate.registro]);
        toast.current?.show({
          severity: "success",
          detail: `${usuarioCreate.message.msgTxt}`,
          life: 3000,
        });
      } else if (usuarioCreate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${usuarioCreate.message.msgTxt}`,
          life: 3000,
        });
      }

      setUsuarioDialog({ state: false });
      setUsuario(emptyUsuario);
    }
  };

  const updateUsuario = async () => {
    setSubmitted(true);
    if (usuario.IdUsuario) {
      // const hashedPassword = sha256(
      //   REACT_APP_SALT + sha256(usuario.Contrasena)
      // );

      setLoadingUsuarioCreateOrUpdate(true);
      let usuarioUpdate = await update(usuario.IdUsuario.toString(), {
        Nombres: usuario.Nombres,
        ApellidoPaterno: usuario.ApellidoPaterno,
        ApellidoMaterno: usuario.ApellidoMaterno,
        FechaNacimiento: usuario.FechaNacimiento
          ? new Date(usuario.FechaNacimiento)
          : null,
        Email: usuario.Email,
        // Contrasena: hashedPassword,
        Celular: usuario.Celular,
        Genero: usuario.Genero,
        RazonSocial: usuario.RazonSocial,
        Direccion: usuario.Direccion,
        IdTipoIdentificacion: usuario.IdTipoIdentificacion,
        NroIdentificacion: usuario.NroIdentificacion,
        IdTipoUsuario: usuario.IdTipoUsuario,
        IdRol: usuario.IdRol,
        IdCargo: usuario.IdCargo,
        IdArea: usuario.IdArea,
        CodigoConfirmacion: usuario.CodigoConfirmacion,
        // UrlBase: usuario.UrlBase,
        // FormatoFotoPerfil: usuario.FormatoFotoPerfil,
        // NombreFotoPerfil: usuario.NombreFotoPerfil,
        // SizeFotoPerfil: usuario.SizeFotoPerfil,
        // UrlFotoPerfil: usuario.UrlFotoPerfil,
        FotoPerfilNombre: usuario.FotoPerfilNombre,
        FotoPerfilBase64: usuario.FotoPerfilBase64,
        CodigoConfirmacionExp: usuario.CodigoConfirmacionExp,
        Activo: usuario.Activo,
      });
      setLoadingUsuarioCreateOrUpdate(false);

      if (usuarioUpdate?.message.msgId == 0 && usuarioUpdate.registro) {
        setUsuarios(
          usuarios?.map((usuario) =>
            usuario.IdUsuario === usuarioUpdate?.registro?.IdUsuario
              ? { ...usuario, ...usuarioUpdate.registro }
              : usuario
          )
        );
        toast.current?.show({
          severity: "success",
          detail: `${usuarioUpdate.message.msgTxt}`,
          life: 3000,
        });
      } else if (usuarioUpdate?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${usuarioUpdate.message.msgTxt}`,
          life: 3000,
        });
      }

      setUsuarioDialog({ state: false });
      setUsuario(emptyUsuario);
    }
  };

  const removeUsuario = async () => {
    if (usuario.IdUsuario) {
      let usuarioRemove = await remove(usuario.IdUsuario.toString());

      if (usuarioRemove?.message.msgId == 0 && usuarioRemove.registro) {
        setUsuarios(
          usuarios?.filter(
            (usuario) =>
              usuario.IdUsuario !== usuarioRemove?.registro?.IdUsuario
          )
        );
        toast.current?.show({
          severity: "success",
          detail: `${usuarioRemove.message.msgTxt}`,
          life: 3000,
        });
      } else if (usuarioRemove?.message.msgId == 1) {
        toast.current?.show({
          severity: "error",
          detail: `${usuarioRemove.message.msgTxt}`,
          life: 3000,
        });
      }

      setRemoveUsuarioDialog(false);
      setUsuario(emptyUsuario);
    }
  };

  const removeSelectedUsuarios = () => {
    let _usuarios = usuarios.filter(
      (val: UsuarioEntity) => !selectedUsuarios?.includes(val)
    );

    setUsuarios(_usuarios);
    setRemoveUsuariosDialog(false);
    setSelectedUsuarios([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Usuarios Removed",
      life: 3000,
    });
  };

  // actions CRUD - Tipo Identificacion (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllTipoIdentificacionCombox = async () => {
    setLoading(true);
    const tiposIdentificacionFindAll = await findAllTipoIdentificacion();
    setLoading(false);

    if (
      tiposIdentificacionFindAll?.message.msgId == 0 &&
      tiposIdentificacionFindAll.registro
    ) {
      setTiposIdentificacion(
        Array.isArray(tiposIdentificacionFindAll.registro)
          ? tiposIdentificacionFindAll.registro?.map((af) => {
              return {
                IdTipoIdentificacion: af.IdTipoIdentificacion,
                Descripcion: af.Descripcion,
              };
            })
          : []
      );
    }
  };

  // actions CRUD - Tipo Usuario (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllTipoUsuarioCombox = async () => {
    setLoading(true);
    const tiposUsuarioFindAll = await findAllTipoUsuario();
    setLoading(false);

    if (
      tiposUsuarioFindAll?.message.msgId == 0 &&
      tiposUsuarioFindAll.registro
    ) {
      setTiposUsuario(
        Array.isArray(tiposUsuarioFindAll.registro)
          ? tiposUsuarioFindAll.registro?.map((af) => {
              return {
                IdTipoUsuario: af.IdTipoUsuario,
                Descripcion: af.Descripcion,
              };
            })
          : []
      );
    }
  };

  // actions CRUD - Rol (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllRolCombox = async () => {
    setLoading(true);
    const rolesFindAll = await findAllRol();
    setLoading(false);

    if (rolesFindAll?.message.msgId == 0 && rolesFindAll.registro) {
      setRoles(
        Array.isArray(rolesFindAll.registro)
          ? rolesFindAll.registro?.map((af) => {
              return {
                IdRol: af.IdRol,
                Descripcion: af.Descripcion,
              };
            })
          : []
      );
    }
  };

  // actions CRUD - Cargo (create, read, update, remove) -> (create, findAll-findOne, update, remove)
  const findAllCargoCombox = async () => {
    setLoading(true);
    const cargosFindAll = await findAllCargo();
    setLoading(false);

    if (cargosFindAll?.message.msgId == 0 && cargosFindAll.registro) {
      setCargos(
        Array.isArray(cargosFindAll.registro)
          ? cargosFindAll.registro?.map((af) => {
              return {
                IdCargo: af.IdCargo,
                Descripcion: af.Descripcion,
              };
            })
          : []
      );
    }
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

  const confirmRemoveSelectedUsuarios = () => {
    setRemoveUsuariosDialog(true);
  };

  // here
  const findIndexById = (id: string) => {
    let index = -1;

    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].IdUsuario.toString() === id) {
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

  const onRadioChange = (e: RadioButtonChangeEvent, name: string) => {
    let _usuario: any = { ...usuario };

    _usuario[name] = e.value;
    setUsuario(_usuario);
    console.log(usuario);
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

  // const onInputTextUsuarioChange = (
  //   e: React.ChangeEvent<HTMLTextUsuarioElement>,
  //   name: string
  // ) => {
  //   const val = (e.target && e.target.value) || "";
  //   let _usuario = { ...usuario };

  //   // @ts-ignore
  //   _usuario[name] = val;

  //   setUsuario(_usuario);
  // };

  // const onInputNumberChange = (
  //   e: InputNumberValueChangeEvent,
  //   name: string
  // ) => {
  //   const val = e.value ?? 0;
  //   let _usuario = { ...usuario };

  //   // @ts-ignore
  //   _usuario[name] = val;

  //   setUsuario(_usuario);
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
          onClick={showCreateUsuarioDialog}
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
          onClick={findAllUsuario}
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

  // templates to column tipoIdentificacion
  const tipoIdentificacionBodyTemplate = (rowData: UsuarioEntity) => {
    return (
      <div className="flex align-items-center gap-2">
        <p className="text-sm m-0">{rowData.TipoIdentificacion.Descripcion}</p>
      </div>
    );
  };

  const tipoIdentificacionFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <>
        <div className="mb-3 text-sm w-12rem">Tipo Identificacion Picker</div>
        <MultiSelect
          value={options.value}
          options={tiposIdentificacion}
          itemTemplate={(option: TipoIdentificacionEntity) => {
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

  // templates to column tipoUsuario
  const tipoUsuarioBodyTemplate = (rowData: UsuarioEntity) => {
    return (
      <div className="flex align-items-center gap-2">
        <p className="text-sm m-0">{rowData?.TipoUsuario?.Descripcion}</p>
      </div>
    );
  };

  const tipoUsuarioFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <>
        <div className="mb-3 text-sm w-12rem">Tipo Usuario Picker</div>
        <MultiSelect
          value={options.value}
          options={tiposUsuario}
          itemTemplate={(option: TipoUsuarioEntity) => {
            return (
              <div className="flex align-items-center gap-2">
                <span>{option?.Descripcion}</span>
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

  // templates to column rol
  const rolBodyTemplate = (rowData: UsuarioEntity) => {
    return (
      <div className="flex align-items-center gap-2">
        <p className="text-sm m-0">{rowData?.Rol?.Descripcion || ""}</p>
      </div>
    );
  };

  const rolFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <>
        <div className="mb-3 text-sm w-12rem">Rol Picker</div>
        <MultiSelect
          value={options.value}
          options={roles}
          itemTemplate={(option: RolEntity) => {
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

  // templates to column cargo
  const cargoBodyTemplate = (rowData: UsuarioEntity) => {
    return (
      <div className="flex align-items-center gap-2">
        <p className="text-sm m-0">{rowData?.Cargo?.Descripcion}</p>
      </div>
    );
  };

  const cargoFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <>
        <div className="mb-3 text-sm w-12rem">Cargo Picker</div>
        <MultiSelect
          value={options.value}
          options={cargos}
          itemTemplate={(option: CargoEntity) => {
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

  // templates to column area
  const areaBodyTemplate = (rowData: UsuarioEntity) => {
    return (
      <div className="flex align-items-center gap-2">
        <p className="text-sm m-0">{rowData?.Area?.Descripcion}</p>
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

  // templates to column Activo
  const activoBodyTemplate = (rowData: UsuarioEntity) => {
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
  const modifiadoElBodyTemplate = (rowData: UsuarioEntity) => {
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
  const creadoElBodyTemplate = (rowData: UsuarioEntity) => {
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
  const actionsBodyTemplate = (rowData: UsuarioEntity) => {
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
          onClick={() => showUpdateUsuarioDialog(rowData)}
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
          onClick={() => confirmRemoveUsuario(rowData)}
        />
      </div>
    );
  };

  //useEffects
  useEffect(() => {
    findAllUsuario();
    findAllTipoIdentificacionCombox();
    findAllTipoUsuarioCombox();
    findAllRolCombox();
    findAllCargoCombox();
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
        // center={centerContent}
        // end={endContent}
      />

      <DataTable
        value={usuarios}
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
          "IdUsuario",
          "Nombres",
          "ApellidoPaterno",
          "ApellidoMaterno",
          "FechaNacimiento",
          "Email",
          "Contrasena",
          "Celular",
          "Genero",
          "RazonSocial",
          "TipoIdentificacion.Descripcion",
          "NroIdentificacion",
          "TipoUsuario.Descripcion",
          "Rol.Descripcion",
          "Cargo.Descripcion",
          "Area.Descripcion",
          "CodigoConfirmacion",
          "UrlBase",
          "FormatoFotoPerfil",
          "NombreFotoPerfil",
          "SizeFotoPerfil",
          "UrlFotoPerfil",
          "CodigoConfirmacionExp",
          "Activo",
          "CreadoEl",
          "CreadoPor",
          "ModificadoEl",
          "ModificadoPor",
        ]}
        emptyMessage={<EmptyMessageData loading={loading} />}
        selectionMode="multiple"
        selection={selectedUsuarios}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedUsuarios(e.value);
          }
        }}
        dataKey="IdUsuario"
        selectionPageOnly
        // loading={loading}
      >
        <Column
          selectionMode="multiple"
          exportable={false}
          headerStyle={{ width: "0%" }}
        />
        {visibleColumns.map((col) => {
          if (col.field == "TipoIdentificacion") {
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
                body={tipoIdentificacionBodyTemplate}
                filterElement={tipoIdentificacionFilterTemplate}
              />
            );
          } else if (col.field == "TipoUsuario") {
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
                body={tipoUsuarioBodyTemplate}
                filterElement={tipoUsuarioFilterTemplate}
              />
            );
          } else if (col.field == "Rol") {
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
                body={rolBodyTemplate}
                filterElement={rolFilterTemplate}
              />
            );
          } else if (col.field == "Cargo") {
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
                body={cargoBodyTemplate}
                filterElement={cargoFilterTemplate}
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

      <UsuarioCreateOrUpdate
        submitted={submitted}
        usuario={usuario}
        tiposIdentificacion={tiposIdentificacion}
        tiposUsuario={tiposUsuario}
        roles={roles}
        cargos={cargos}
        areas={areas}
        usuarioDialog={usuarioDialog}
        hideDialog={hideDialog}
        createUsuario={createUsuario}
        updateUsuario={updateUsuario}
        onInputChange={onInputChange}
        onDropdownChange={onDropdownChange}
        onRadioChange={onRadioChange}
        loadingUsuarioCreateOrUpdate={loadingUsuarioCreateOrUpdate}
      />

      <UsuarioRemove
        usuario={usuario}
        removeUsuarioDialog={removeUsuarioDialog}
        hideRemoveUsuarioDialog={hideRemoveUsuarioDialog}
        removeUsuario={removeUsuario}
      />

      <UsuariosRemove
        usuario={usuario}
        removeUsuariosDialog={removeUsuariosDialog}
        hideRemoveUsuariosDialog={hideRemoveUsuariosDialog}
        removeSelectedUsuarios={removeSelectedUsuarios}
      />
    </div>
  );
};

export default Usuario;
