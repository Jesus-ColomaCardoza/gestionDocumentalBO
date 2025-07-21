import {
  AnexoCreate,
  AnexoOut,
  AnexosOut,
  AnexoUpdate,
} from "../interfaces/AnexoInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { ANEXO } from "../service/AnexoService";
import { Menssage } from "../../utils/menssage";

const UseAnexo = () => {
  let message = new Menssage();

  const create = async (
    anexoCreate: AnexoCreate
  ): Promise<AnexoOut | undefined> => {
    try {
      const anexo = await axios.post<AnexoOut>(
        `${VITE_API_URL_GDS + ANEXO.CREATE}`,
        anexoCreate
      );
      return anexo.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (): Promise<AnexosOut | undefined> => {
    try {
      const anexos = await axios.post<AnexosOut>(
        `${VITE_API_URL_GDS + ANEXO.FIND_ALL}`,
        filterBodyRequest
      );
      return anexos.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<AnexoOut | undefined> => {
    try {
      const anexo = await axios.get<AnexoOut>(
        `${VITE_API_URL_GDS + ANEXO.FIND_ONE + id}`
      );
      return anexo.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    anexoUpdate: AnexoUpdate
  ): Promise<AnexoOut | undefined> => {
    try {
      const anexo = await axios.patch<AnexoOut>(
        `${VITE_API_URL_GDS + ANEXO.UPDATE + id}`,
        anexoUpdate
      );
      return anexo.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<AnexoOut | undefined> => {
    try {
      const anexo = await axios.post<AnexoOut>(
        `${VITE_API_URL_GDS + ANEXO.REMOVE + id}`
      );
      return anexo.data;
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

export default UseAnexo;
