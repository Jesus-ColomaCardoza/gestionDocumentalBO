import {
  TipoDocumentoCreate,
  TipoDocumentoOut,
  TipoDocumentosOut,
  TipoDocumentoUpdate,
} from "../interfaces/TipoDocumentoInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { Menssage } from "../../utils/menssage";
import { TIPO_DOCUMENTO } from "../service/TipoUsuarioService";

const UseTipoDocumento = () => {
  let message = new Menssage();

  const create = async (
    tipoDocumentoCreate: TipoDocumentoCreate
  ): Promise<TipoDocumentoOut | undefined> => {
    try {
      const tipoDocumento = await axios.post<TipoDocumentoOut>(
        `${VITE_API_URL_GDS + TIPO_DOCUMENTO.CREATE}`,
        tipoDocumentoCreate
      );
      return tipoDocumento.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (): Promise<TipoDocumentosOut | undefined> => {
    try {
      const tipoDocumentos = await axios.post<TipoDocumentosOut>(
        `${VITE_API_URL_GDS + TIPO_DOCUMENTO.FIND_ALL}`,
        filterBodyRequest
      );
      return tipoDocumentos.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<TipoDocumentoOut | undefined> => {
    try {
      const tipoDocumento = await axios.get<TipoDocumentoOut>(
        `${VITE_API_URL_GDS + TIPO_DOCUMENTO.FIND_ONE + id}`
      );
      return tipoDocumento.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    tipoDocumentoUpdate: TipoDocumentoUpdate
  ): Promise<TipoDocumentoOut | undefined> => {
    try {
      const tipoDocumento = await axios.patch<TipoDocumentoOut>(
        `${VITE_API_URL_GDS + TIPO_DOCUMENTO.UPDATE + id}`,
        tipoDocumentoUpdate
      );
      return tipoDocumento.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<TipoDocumentoOut | undefined> => {
    try {
      const tipoDocumento = await axios.post<TipoDocumentoOut>(
        `${VITE_API_URL_GDS + TIPO_DOCUMENTO.REMOVE + id}`
      );
      return tipoDocumento.data;
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

export default UseTipoDocumento;
