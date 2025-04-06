
import {
  TipoIdentificacionCreate,
  TipoIdentificacionesOut,
  TipoIdentificacionOut,

  TipoIdentificacionUpdate,
} from "../interfaces/TipoIdentificacionInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { Menssage } from "../../utils/menssage";
import { TIPO_IDENTIFICACION } from "../service/TipoIdentificacionService";

const UseTipoIdentificacion = () => {
  let message = new Menssage();

  const create = async (
    tipoIdentificacionCreate: TipoIdentificacionCreate
  ): Promise<TipoIdentificacionOut | undefined> => {
    try {
      const tipoIdentificacion = await axios.post<TipoIdentificacionOut>(
        `${VITE_API_URL_GDS + TIPO_IDENTIFICACION.CREATE}`,
        tipoIdentificacionCreate
      );
      return tipoIdentificacion.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (): Promise<TipoIdentificacionesOut | undefined> => {
    try {
      const tipoIdentificaciones = await axios.post<TipoIdentificacionesOut>(
        `${VITE_API_URL_GDS + TIPO_IDENTIFICACION.FIND_ALL}`,
        filterBodyRequest
      );
      return tipoIdentificaciones.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<TipoIdentificacionOut | undefined> => {
    try {
      const tipoIdentificacion = await axios.get<TipoIdentificacionOut>(
        `${VITE_API_URL_GDS + TIPO_IDENTIFICACION.FIND_ONE + id}`
      );
      return tipoIdentificacion.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    tipoIdentificacionUpdate: TipoIdentificacionUpdate
  ): Promise<TipoIdentificacionOut | undefined> => {
    try {
      const tipoIdentificacion = await axios.patch<TipoIdentificacionOut>(
        `${VITE_API_URL_GDS + TIPO_IDENTIFICACION.UPDATE + id}`,
        tipoIdentificacionUpdate
      );
      return tipoIdentificacion.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<TipoIdentificacionOut | undefined> => {
    try {
      const tipoIdentificacion = await axios.post<TipoIdentificacionOut>(
        `${VITE_API_URL_GDS + TIPO_IDENTIFICACION.REMOVE + id}`
      );
      return tipoIdentificacion.data;
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

export default UseTipoIdentificacion;
