import {
  ConstanteCreate,
  ConstanteOut,
  ConstantesOut,
  ConstanteUpdate,
} from "../interfaces/ConstanteInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { Menssage } from "../../utils/menssage";
import { CONSTANTE } from "../service/ConstanteService";

const UseConstante = () => {
  let message = new Menssage();

  const create = async (
    constanteCreate: ConstanteCreate
  ): Promise<ConstanteOut | undefined> => {
    try {
      const constante = await axios.post<ConstanteOut>(
        `${VITE_API_URL_GDS + CONSTANTE.CREATE}`,
        constanteCreate
      );
      return constante.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (): Promise<ConstantesOut | undefined> => {
    try {
      const constantes = await axios.post<ConstantesOut>(
        `${VITE_API_URL_GDS + CONSTANTE.FIND_ALL}`,
        filterBodyRequest
      );
      return constantes.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<ConstanteOut | undefined> => {
    try {
      const constante = await axios.get<ConstanteOut>(
        `${VITE_API_URL_GDS + CONSTANTE.FIND_ONE + id}`
      );
      return constante.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    constanteUpdate: ConstanteUpdate
  ): Promise<ConstanteOut | undefined> => {
    try {
      const constante = await axios.patch<ConstanteOut>(
        `${VITE_API_URL_GDS + CONSTANTE.UPDATE + id}`,
        constanteUpdate
      );
      return constante.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<ConstanteOut | undefined> => {
    try {
      const constante = await axios.post<ConstanteOut>(
        `${VITE_API_URL_GDS + CONSTANTE.REMOVE + id}`
      );
      return constante.data;
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

export default UseConstante;
