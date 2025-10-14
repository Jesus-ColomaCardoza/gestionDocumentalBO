import { MovimientoEntity } from "../interfaces/MovimientoInterface";

export let emptyMovimiento: MovimientoEntity = {
  IdMovimiento: 0,
  IdTramite: 0,
  IdAreaOrigen: 0,
  IdAreaDestino: 0,
  FechaMovimiento: "",
  Copia: false,
  FirmaDigital: false,
  IdMovimientoPadre: null,
  NombreResponsable: undefined,//change
  Activo: true,
  CreadoEl: new Date(),
  CreadoPor: "",
  ModificadoEl: new Date(),
  ModificadoPor: "",
  AreaOrigen: {
    IdArea: 0,
    Descripcion: "",
  },
  AreaDestino: {
    IdArea: 0,
    Descripcion: "",
  },
};
