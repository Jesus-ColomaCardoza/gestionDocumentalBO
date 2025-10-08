import {
  EstadoCreate,
  EstadoOut,
  EstadosOut,
  EstadoUpdate,
} from "../interfaces/EstadoInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { ESTADO } from "../service/EstadoService";
import { Menssage } from "../../utils/menssage";
import { CombinationsFilters } from "../../utils/Interfaces";

const UseEstado = () => {
  let message = new Menssage();

  const create = async (
    estadoCreate: EstadoCreate
  ): Promise<EstadoOut | undefined> => {
    try {
      const estado = await axios.post<EstadoOut>(
        `${VITE_API_URL_GDS + ESTADO.CREATE}`,
        estadoCreate
      );
      return estado.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (
    combinationsFilters: CombinationsFilters
  ): Promise<EstadosOut | undefined> => {
    try {
      const estados = await axios.post<EstadosOut>(
        `${VITE_API_URL_GDS + ESTADO.FIND_ALL}`,
        combinationsFilters
      );
      return estados.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<EstadoOut | undefined> => {
    try {
      const estado = await axios.get<EstadoOut>(
        `${VITE_API_URL_GDS + ESTADO.FIND_ONE + id}`
      );
      return estado.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    estadoUpdate: EstadoUpdate
  ): Promise<EstadoOut | undefined> => {
    try {
      const estado = await axios.patch<EstadoOut>(
        `${VITE_API_URL_GDS + ESTADO.UPDATE + id}`,
        estadoUpdate
      );
      return estado.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<EstadoOut | undefined> => {
    try {
      const estado = await axios.post<EstadoOut>(
        `${VITE_API_URL_GDS + ESTADO.REMOVE + id}`
      );
      return estado.data;
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

export default UseEstado;
