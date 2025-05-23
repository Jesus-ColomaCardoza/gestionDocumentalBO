import {
  TipoUsuarioCreate,
  TipoUsuarioOut,
  TipoUsuariosOut,
  TipoUsuarioUpdate,
} from "../interfaces/TipoUsuarioInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { Menssage } from "../../utils/menssage";
import { TIPO_USUARIO } from "../service/TipoUsuarioService";

const UseTipoUsuario = () => {
  let message = new Menssage();

  const create = async (
    tipoUsuarioCreate: TipoUsuarioCreate
  ): Promise<TipoUsuarioOut | undefined> => {
    try {
      const tipoUsuario = await axios.post<TipoUsuarioOut>(
        `${VITE_API_URL_GDS + TIPO_USUARIO.CREATE}`,
        tipoUsuarioCreate
      );
      return tipoUsuario.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (): Promise<TipoUsuariosOut | undefined> => {
    try {
      const tipoUsuarios = await axios.post<TipoUsuariosOut>(
        `${VITE_API_URL_GDS + TIPO_USUARIO.FIND_ALL}`,
        filterBodyRequest
      );
      return tipoUsuarios.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<TipoUsuarioOut | undefined> => {
    try {
      const tipoUsuario = await axios.get<TipoUsuarioOut>(
        `${VITE_API_URL_GDS + TIPO_USUARIO.FIND_ONE + id}`
      );
      return tipoUsuario.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    tipoUsuarioUpdate: TipoUsuarioUpdate
  ): Promise<TipoUsuarioOut | undefined> => {
    try {
      const tipoUsuario = await axios.patch<TipoUsuarioOut>(
        `${VITE_API_URL_GDS + TIPO_USUARIO.UPDATE + id}`,
        tipoUsuarioUpdate
      );
      return tipoUsuario.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<TipoUsuarioOut | undefined> => {
    try {
      const tipoUsuario = await axios.post<TipoUsuarioOut>(
        `${VITE_API_URL_GDS + TIPO_USUARIO.REMOVE + id}`
      );
      return tipoUsuario.data;
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

export default UseTipoUsuario;
