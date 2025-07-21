import { AnexoEntity } from "../interfaces/AnexoInterface";

export let emptyAnexo: AnexoEntity = {
  IdAnexo: 0,
  Titulo: "",
  FormatoAnexo: "",
  NombreAnexo: "",
  UrlAnexo: "",
  SizeAnexo: 0,
  UrlBase: "",
  IdTramite: 0,
  Activo: true,
  CreadoEl: new Date(),
  CreadoPor: "",
  ModificadoEl: new Date(),
  ModificadoPor: "",
};
