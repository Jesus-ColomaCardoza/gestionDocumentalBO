import {
  CarpetaCombinationsFilters,
  CarpetaCreate,
  CarpetaOut,
  CarpetasOut,
  CarpetaUpdate,
} from "../interfaces/CarpetaInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { Menssage } from "../../utils/menssage";
import { CARPETA } from "../service/CarpetaService";

const UseCarpeta = () => {
  let message = new Menssage();

  const create = async (
    fileManagerCreate: CarpetaCreate
  ): Promise<CarpetaOut | undefined> => {
    try {
      const fileManager = await axios.post<CarpetaOut>(
        `${VITE_API_URL_GDS + CARPETA.CREATE}`,
        fileManagerCreate
      );
      return fileManager.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (): Promise<CarpetasOut | undefined> => {
    try {
      const fileManagers = await axios.post<CarpetasOut>(
        `${VITE_API_URL_GDS + CARPETA.FIND_ALL}`,
        filterBodyRequest
      );
      return fileManagers.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findAllTree = async (
    carpetaCombinationsFilters: CarpetaCombinationsFilters
  ): Promise<any | undefined> => {
    try {
      const fileManagers = await axios.post<any>(
        `${VITE_API_URL_GDS + CARPETA.FIND_ALL_TREE}`,
        carpetaCombinationsFilters
      );
      return fileManagers.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<CarpetaOut | undefined> => {
    try {
      const fileManager = await axios.get<CarpetaOut>(
        `${VITE_API_URL_GDS + CARPETA.FIND_ONE + id}`
      );
      return fileManager.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    fileManagerUpdate: CarpetaUpdate
  ): Promise<CarpetaOut | undefined> => {
    try {
      const fileManager = await axios.patch<CarpetaOut>(
        `${VITE_API_URL_GDS + CARPETA.UPDATE + id}`,
        fileManagerUpdate
      );
      return fileManager.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<CarpetaOut | undefined> => {
    try {
      const fileManager = await axios.post<CarpetaOut>(
        `${VITE_API_URL_GDS + CARPETA.REMOVE + id}`
      );
      return fileManager.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    create,
    findAll,
    findAllTree,
    findOne,
    update,
    remove,
  };
};

export default UseCarpeta;
