import {
  ArchivadorCreate,
  ArchivadorOut,
  ArchivadoresOut,
  ArchivadorUpdate,
} from "../interfaces/ArchivadorInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { Menssage } from "../../utils/menssage";
import { ARCHIVADOR } from "../service/ArchivadorService";


const UseArchivador = () => {
  let message = new Menssage();

  const create = async (
    archivadorCreate: ArchivadorCreate
  ): Promise<ArchivadorOut | undefined> => {
    try {
      const archivador = await axios.post<ArchivadorOut>(
        `${VITE_API_URL_GDS + ARCHIVADOR.CREATE}`,
        archivadorCreate
      );
      return archivador.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (): Promise<ArchivadoresOut | undefined> => {
    try {
      const Archivadores = await axios.post<ArchivadoresOut>(
        `${VITE_API_URL_GDS + ARCHIVADOR.FIND_ALL}`,
        filterBodyRequest
      );
      return Archivadores.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<ArchivadorOut | undefined> => {
    try {
      const archivador = await axios.get<ArchivadorOut>(
        `${VITE_API_URL_GDS + ARCHIVADOR.FIND_ONE + id}`
      );
      return archivador.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    archivadorUpdate: ArchivadorUpdate
  ): Promise<ArchivadorOut | undefined> => {
    try {
      const archivador = await axios.patch<ArchivadorOut>(
        `${VITE_API_URL_GDS + ARCHIVADOR.UPDATE + id}`,
        archivadorUpdate
      );
      return archivador.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<ArchivadorOut | undefined> => {
    try {
      const archivador = await axios.post<ArchivadorOut>(
        `${VITE_API_URL_GDS + ARCHIVADOR.REMOVE + id}`
      );
      return archivador.data;
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

export default UseArchivador;
