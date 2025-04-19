import { CarpetaEntity } from "../../carpeta/interfaces/CarpetaInterface";

export let emptyCarpeta: CarpetaEntity = {
  IdCarpeta: 0,
  Descripcion: "",
  IdCarpetaPadre: null,
  IdUsuario: 0,
  Activo: true,
  Categoria: "MF",
  CreadoEl: new Date(),
  CreadoPor: "",
  ModificadoEl: new Date(),
  ModificadoPor: "",
};
