import {
  TipoTramiteCreate,
  TipoTramiteOut,
  TipoTramitesOut,
  TipoTramiteUpdate,
} from "../interfaces/TipoTramiteInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { Menssage } from "../../utils/menssage";
import { TIPO_TRAMITE } from "../service/TipoTramiteService";

const UseTipoTramite = () => {
  let message = new Menssage();

  const create = async (
    tipoTramiteCreate: TipoTramiteCreate
  ): Promise<TipoTramiteOut | undefined> => {
    try {
      const tipoTramite = await axios.post<TipoTramiteOut>(
        `${VITE_API_URL_GDS + TIPO_TRAMITE.CREATE}`,
        tipoTramiteCreate
      );
      return tipoTramite.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (): Promise<TipoTramitesOut | undefined> => {
    try {
      const tipoTramites = await axios.post<TipoTramitesOut>(
        `${VITE_API_URL_GDS + TIPO_TRAMITE.FIND_ALL}`,
        filterBodyRequest
      );
      return tipoTramites.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<TipoTramiteOut | undefined> => {
    try {
      const tipoTramite = await axios.get<TipoTramiteOut>(
        `${VITE_API_URL_GDS + TIPO_TRAMITE.FIND_ONE + id}`
      );
      return tipoTramite.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    tipoTramiteUpdate: TipoTramiteUpdate
  ): Promise<TipoTramiteOut | undefined> => {
    try {
      const tipoTramite = await axios.patch<TipoTramiteOut>(
        `${VITE_API_URL_GDS + TIPO_TRAMITE.UPDATE + id}`,
        tipoTramiteUpdate
      );
      return tipoTramite.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<TipoTramiteOut | undefined> => {
    try {
      const tipoTramite = await axios.post<TipoTramiteOut>(
        `${VITE_API_URL_GDS + TIPO_TRAMITE.REMOVE + id}`
      );
      return tipoTramite.data;
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

export default UseTipoTramite;
