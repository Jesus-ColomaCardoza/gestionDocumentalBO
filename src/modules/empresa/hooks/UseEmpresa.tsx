import {
  EmpresaCreate,
  EmpresaOut,
  EmpresasOut,
  EmpresaUpdate,
} from "../interfaces/EmpresaInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { Menssage } from "../../utils/menssage";
import { EMPRESA } from "../service/EmpresaService";

const UseEmpresa = () => {
  let message = new Menssage();

  const create = async (
    empresaCreate: EmpresaCreate
  ): Promise<EmpresaOut | undefined> => {
    try {
      const empresa = await axios.post<EmpresaOut>(
        `${VITE_API_URL_GDS + EMPRESA.CREATE}`,
        empresaCreate
      );
      return empresa.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (): Promise<EmpresasOut | undefined> => {
    try {
      const empresas = await axios.post<EmpresasOut>(
        `${VITE_API_URL_GDS + EMPRESA.FIND_ALL}`,
        filterBodyRequest
      );
      return empresas.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<EmpresaOut | undefined> => {
    try {
      const empresa = await axios.get<EmpresaOut>(
        `${VITE_API_URL_GDS + EMPRESA.FIND_ONE + id}`
      );
      return empresa.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    empresaUpdate: EmpresaUpdate
  ): Promise<EmpresaOut | undefined> => {
    try {
      const empresa = await axios.patch<EmpresaOut>(
        `${VITE_API_URL_GDS + EMPRESA.UPDATE + id}`,
        empresaUpdate
      );
      return empresa.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<EmpresaOut | undefined> => {
    try {
      const empresa = await axios.post<EmpresaOut>(
        `${VITE_API_URL_GDS + EMPRESA.REMOVE + id}`
      );
      return empresa.data;
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

export default UseEmpresa;
