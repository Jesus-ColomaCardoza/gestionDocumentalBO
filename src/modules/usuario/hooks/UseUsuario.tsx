import {
  UsuarioCreate,
  UsuarioOut,
  UsuariosOut,
  UsuarioUpdate,
} from "../interfaces/UsuarioInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { USUARIO } from "../service/UsuarioService";
import { Menssage } from "../../utils/menssage";
import { CombinationsFilters } from "../../utils/Interfaces";

const UseUsuario = () => {
  let message = new Menssage();

  const create = async (
    usuarioCreate: UsuarioCreate
  ): Promise<UsuarioOut | undefined> => {
    try {
      const usuario = await axios.post<UsuarioOut>(
        `${VITE_API_URL_GDS + USUARIO.CREATE}`,
        usuarioCreate
      );
      return usuario.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (
    combinationsFilters: CombinationsFilters
  ): Promise<UsuariosOut | undefined> => {
    try {
      const usuarios = await axios.post<UsuariosOut>(
        `${VITE_API_URL_GDS + USUARIO.FIND_ALL}`,
        combinationsFilters
      );
      return usuarios.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<UsuarioOut | undefined> => {
    try {
      const usuario = await axios.get<UsuarioOut>(
        `${VITE_API_URL_GDS + USUARIO.FIND_ONE + id}`
      );
      return usuario.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    usuarioUpdate: UsuarioUpdate
  ): Promise<UsuarioOut | undefined> => {
    try {
      const usuario = await axios.patch<UsuarioOut>(
        `${VITE_API_URL_GDS + USUARIO.UPDATE + id}`,
        usuarioUpdate
      );
      return usuario.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<UsuarioOut | undefined> => {
    try {
      const usuario = await axios.post<UsuarioOut>(
        `${VITE_API_URL_GDS + USUARIO.REMOVE + id}`
      );
      return usuario.data;
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

export default UseUsuario;
