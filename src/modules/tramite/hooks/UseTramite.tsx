import {
  TramiteCreate,
  TramiteOut,
  TramitesOut,
  TramiteUpdate,
  TramiteEmitidoCreate,
  TramitesPendientesOut,
  GetAllTramitePendiente,
  TramiteRecibir,
  TramitesRecibidosOut,
  GetAllTramiteRecibido,
  TramiteAtender,
  TramiteRecibidoOut,
  TramiteAtendidoOut,
  TramiteObservar,
  TramiteObservadoOut,
  TramiteDesmarcarAtendidoOut,
  TramiteDesmarcarAtender,
  TramiteDesmarcarObservar,
  TramiteDesmarcarObservadoOut,
} from "../interfaces/TramiteInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { TRAMITE } from "../service/TramiteService";
import { Menssage } from "../../utils/menssage";
import { TramiteExternoRecibir } from "../interfaces/TramiteInterface";

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
    tramiteEmitidoCreate: TramiteEmitidoCreate
  ): Promise<TramiteOut | undefined> => {
    try {
      const tramite = await axios.post<TramiteOut>(
        `${VITE_API_URL_GDS + TRAMITE.CREATE_EMITIDO}`,
        tramiteEmitidoCreate
      );
      return tramite.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const recibirExterno = async (
    tramiteExternoRecibir: TramiteExternoRecibir
  ): Promise<TramiteOut | undefined> => {
    try {
      const tramite = await axios.post<TramiteOut>(
        `${VITE_API_URL_GDS + TRAMITE.RECIBIR_EXTERNO}`,
        tramiteExternoRecibir
      );
      return tramite.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const recibir = async (
    tramiteRecibir: TramiteRecibir
  ): Promise<TramiteRecibidoOut | undefined> => {
    try {
      const tramite = await axios.post<TramiteRecibidoOut>(
        `${VITE_API_URL_GDS + TRAMITE.RECIBIR}`,
        tramiteRecibir
      );
      return tramite.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const atender = async (
    tramiteAtender: TramiteAtender
  ): Promise<TramiteAtendidoOut | undefined> => {
    try {
      const tramite = await axios.post<TramiteAtendidoOut>(
        `${VITE_API_URL_GDS + TRAMITE.ATENDER}`,
        tramiteAtender
      );
      return tramite.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const desmarcarAtender = async (
    tramiteDesmarcarAtender: TramiteDesmarcarAtender
  ): Promise<TramiteDesmarcarAtendidoOut | undefined> => {
    try {
      const tramite = await axios.post<TramiteDesmarcarAtendidoOut>(
        `${VITE_API_URL_GDS + TRAMITE.DESMARCAR_ATENDER}`,
        tramiteDesmarcarAtender
      );
      return tramite.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const observar = async (
    tramiteObservar: TramiteObservar
  ): Promise<TramiteObservadoOut | undefined> => {
    try {
      const tramite = await axios.post<TramiteObservadoOut>(
        `${VITE_API_URL_GDS + TRAMITE.OBSERVAR}`,
        tramiteObservar
      );
      return tramite.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const desmarcarObservar = async (
    tramiteDesmarcarObservar: TramiteDesmarcarObservar
  ): Promise<TramiteDesmarcarObservadoOut | undefined> => {
    try {
      const tramite = await axios.post<TramiteDesmarcarObservadoOut>(
        `${VITE_API_URL_GDS + TRAMITE.DESMARCAR_OBSERVAR}`,
        tramiteDesmarcarObservar
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

  const findAllPendientes = async (
    getAllTramitePendiente: GetAllTramitePendiente
  ): Promise<TramitesPendientesOut | undefined> => {
    try {
      const tramites = await axios.post<TramitesPendientesOut>(
        `${VITE_API_URL_GDS + TRAMITE.FIND_ALL_PENDIENTES}`,
        getAllTramitePendiente
      );
      return tramites.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findAllRecibidos = async (
    getAllTramiteRecibido: GetAllTramiteRecibido
  ): Promise<TramitesRecibidosOut | undefined> => {
    try {
      const tramites = await axios.post<TramitesRecibidosOut>(
        `${VITE_API_URL_GDS + TRAMITE.FIND_ALL_RECIBIDOS}`,
        getAllTramiteRecibido
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
    recibirExterno,
    recibir,
    atender,
    desmarcarAtender,
    observar,
    desmarcarObservar,
    findAll,
    findAllPendientes,
    findAllRecibidos,
    findOne,
    update,
    remove,
  };
};

export default UseTramite;
