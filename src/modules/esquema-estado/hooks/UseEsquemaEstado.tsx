import {
  EsquemaEstadoCreate,
  EsquemaEstadoOut,
  EsquemaEstadosOut,
  EsquemaEstadoUpdate,
} from "../interfaces/EsquemaEstadoInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { Menssage } from "../../utils/menssage";
import { ESQUEMA_ESTADO } from "../service/EsquemaEstadoService";

const UseEsquemaEstado = () => {
  let message = new Menssage();

  const create = async (
    esquemaEstadoCreate: EsquemaEstadoCreate
  ): Promise<EsquemaEstadoOut | undefined> => {
    try {
      const esquemaEstado = await axios.post<EsquemaEstadoOut>(
        `${VITE_API_URL_GDS + ESQUEMA_ESTADO.CREATE}`,
        esquemaEstadoCreate
      );
      return esquemaEstado.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (): Promise<EsquemaEstadosOut | undefined> => {
    try {
      const esquemaEstados = await axios.post<EsquemaEstadosOut>(
        `${VITE_API_URL_GDS + ESQUEMA_ESTADO.FIND_ALL}`,
        filterBodyRequest
      );
      return esquemaEstados.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<EsquemaEstadoOut | undefined> => {
    try {
      const esquemaEstado = await axios.get<EsquemaEstadoOut>(
        `${VITE_API_URL_GDS + ESQUEMA_ESTADO.FIND_ONE + id}`
      );
      return esquemaEstado.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    esquemaEstadoUpdate: EsquemaEstadoUpdate
  ): Promise<EsquemaEstadoOut | undefined> => {
    try {
      const esquemaEstado = await axios.patch<EsquemaEstadoOut>(
        `${VITE_API_URL_GDS + ESQUEMA_ESTADO.UPDATE + id}`,
        esquemaEstadoUpdate
      );
      return esquemaEstado.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<EsquemaEstadoOut | undefined> => {
    try {
      const esquemaEstado = await axios.post<EsquemaEstadoOut>(
        `${VITE_API_URL_GDS + ESQUEMA_ESTADO.REMOVE + id}`
      );
      return esquemaEstado.data;
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

export  {UseEsquemaEstado};
