import {
  RolCreate,
  RolOut,
  RolesOut,
  RolUpdate,
} from "../interfaces/RolInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { ROL } from "../service/RolService";
import { Menssage } from "../../utils/menssage";

const UseRol = () => {
  let message = new Menssage();

  const create = async (
    rolCreate: RolCreate
  ): Promise<RolOut | undefined> => {
    try {
      const rol = await axios.post<RolOut>(
        `${VITE_API_URL_GDS + ROL.CREATE}`,
        rolCreate
      );
      return rol.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (): Promise<RolesOut | undefined> => {
    try {
      const roles = await axios.post<RolesOut>(
        `${VITE_API_URL_GDS + ROL.FIND_ALL}`,
        filterBodyRequest
      );
      return roles.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<RolOut | undefined> => {
    try {
      const rol = await axios.get<RolOut>(
        `${VITE_API_URL_GDS + ROL.FIND_ONE + id}`
      );
      return rol.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    rolUpdate: RolUpdate
  ): Promise<RolOut | undefined> => {
    try {
      const rol = await axios.patch<RolOut>(
        `${VITE_API_URL_GDS + ROL.UPDATE + id}`,
        rolUpdate
      );
      return rol.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<RolOut | undefined> => {
    try {
      const rol = await axios.post<RolOut>(
        `${VITE_API_URL_GDS + ROL.REMOVE + id}`
      );
      return rol.data;
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

export default UseRol;
