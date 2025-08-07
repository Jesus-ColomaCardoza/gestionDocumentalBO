import {
  TramiteCreate,
  TramiteOut,
  TramitesOut,
  TramiteUpdate,
  TramiteEmitidoCreate, 
} from "../interfaces/TramiteInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { TRAMITE } from "../service/TramiteService";
import { Menssage } from "../../utils/menssage";

const UseTramite = () => {
  let message = new Menssage();

  const create = async (
    tramiteCreate: TramiteCreate
  ): Promise<TramiteOut | undefined> => {
    try {
      const tramite = await axios.post<TramiteOut>(
        `${VITE_API_URL_GDS + TRAMITE.CREATE}`,
        tramiteCreate
      );
      return tramite.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const createEmitido = async (
    TramiteEmitidoCreate: TramiteEmitidoCreate
  ): Promise<TramiteOut | undefined> => {
    try {
      const tramite = await axios.post<TramiteOut>(
        `${VITE_API_URL_GDS + TRAMITE.CREATE_EMITIDO}`,
        TramiteEmitidoCreate
      );
      return tramite.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (): Promise<TramitesOut | undefined> => {
    try {
      const tramites = await axios.post<TramitesOut>(
        `${VITE_API_URL_GDS + TRAMITE.FIND_ALL}`,
        filterBodyRequest
      );
      return tramites.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<TramiteOut | undefined> => {
    try {
      const tramite = await axios.get<TramiteOut>(
        `${VITE_API_URL_GDS + TRAMITE.FIND_ONE + id}`
      );
      return tramite.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    tramiteUpdate: TramiteUpdate
  ): Promise<TramiteOut | undefined> => {
    try {
      const tramite = await axios.patch<TramiteOut>(
        `${VITE_API_URL_GDS + TRAMITE.UPDATE + id}`,
        tramiteUpdate
      );
      return tramite.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<TramiteOut | undefined> => {
    try {
      const tramite = await axios.post<TramiteOut>(
        `${VITE_API_URL_GDS + TRAMITE.REMOVE + id}`
      );
      return tramite.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    create,
    createEmitido,
    findAll,
    findOne,
    update,
    remove,
  };
};

export default UseTramite;
