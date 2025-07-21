import {
  MovimientoCreate,
  MovimientoOut,
  MovimientosOut,
  MovimientoUpdate,
} from "../interfaces/MovimientoInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { MOVIMIENTO } from "../service/MovimientoService";
import { Menssage } from "../../utils/menssage";

const UseMovimiento = () => {
  let message = new Menssage();

  const create = async (
    movimientoCreate: MovimientoCreate
  ): Promise<MovimientoOut | undefined> => {
    try {
      const movimiento = await axios.post<MovimientoOut>(
        `${VITE_API_URL_GDS + MOVIMIENTO.CREATE}`,
        movimientoCreate
      );
      return movimiento.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (): Promise<MovimientosOut | undefined> => {
    try {
      const movimientos = await axios.post<MovimientosOut>(
        `${VITE_API_URL_GDS + MOVIMIENTO.FIND_ALL}`,
        filterBodyRequest
      );
      return movimientos.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<MovimientoOut | undefined> => {
    try {
      const movimiento = await axios.get<MovimientoOut>(
        `${VITE_API_URL_GDS + MOVIMIENTO.FIND_ONE + id}`
      );
      return movimiento.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    movimientoUpdate: MovimientoUpdate
  ): Promise<MovimientoOut | undefined> => {
    try {
      const movimiento = await axios.patch<MovimientoOut>(
        `${VITE_API_URL_GDS + MOVIMIENTO.UPDATE + id}`,
        movimientoUpdate
      );
      return movimiento.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<MovimientoOut | undefined> => {
    try {
      const movimiento = await axios.post<MovimientoOut>(
        `${VITE_API_URL_GDS + MOVIMIENTO.REMOVE + id}`
      );
      return movimiento.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    create,
    findAll,
    findOne,
    update,
    remove,
  };
};

export default UseMovimiento;
