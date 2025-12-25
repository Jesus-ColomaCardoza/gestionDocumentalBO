import {
  DocumentoAwsEntity,
  DocumentoEntity,
} from "../interfaces/DocumentoInterface";

export let emptyDocumento: DocumentoEntity = {
  IdDocumento: 0,
  CodigoReferencia: "",
  Titulo: "",
  Descripcion: "",
  Folios: 0,
  FechaEmision: "",
  FormatoDocumento: "",
  NombreDocumento: "",
  UrlDocumento: "",
  SizeDocumento: 0,
  UrlBase: "",
  IdTipoDocumento: 0,
  IdTramite: 0,
  FirmaDigital: false,
  IdCarpeta: 0,
  Categoria: "MF",
  IdEstado: 0,
  IdUsuario: 0,
  Activo: true,
  CreadoEl: new Date(),
  CreadoPor: "",
  ModificadoEl: new Date(),
  ModificadoPor: "",
};

export let emptyDocumentoAws: DocumentoAwsEntity = {
  IdArea: 0,
  Area: {
    IdArea: 0,
    Descripcion: "",
  },
  Folios: 0,
  IdTipoDocumento: 0,
  TipoDocumento: {
    IdTipoDocumento: 0,
    Descripcion: "",
  },
};
